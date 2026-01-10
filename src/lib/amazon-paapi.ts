// Amazon Product Advertising API Integration
// IMPORTANT: Never scrape Amazon pages. Use only this official API.

import crypto from 'crypto';

interface AmazonConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  marketplace: string;
  host: string;
  region: string;
}

interface SearchItemsParams {
  keywords: string;
  searchIndex?: string;
  itemCount?: number;
}

interface GetItemsParams {
  itemIds: string[];
}

interface AmazonProduct {
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;
  primeEligible: boolean;
  detailPageUrl: string;
  brand: string | null;
}

function getConfig(): AmazonConfig {
  const accessKey = process.env.AMAZON_PAAPI_ACCESS_KEY;
  const secretKey = process.env.AMAZON_PAAPI_SECRET_KEY;
  const partnerTag = process.env.AMAZON_ASSOCIATE_TAG;
  const marketplace = process.env.AMAZON_PAAPI_MARKETPLACE || 'www.amazon.com';
  const host = process.env.AMAZON_PAAPI_HOST || 'webservices.amazon.com';
  const region = process.env.AMAZON_PAAPI_REGION || 'us-east-1';

  if (!accessKey || !secretKey || !partnerTag) {
    throw new Error('Missing Amazon PA-API credentials. Set AMAZON_PAAPI_ACCESS_KEY, AMAZON_PAAPI_SECRET_KEY, and AMAZON_ASSOCIATE_TAG.');
  }

  return { accessKey, secretKey, partnerTag, marketplace, host, region };
}

function sign(key: Buffer, msg: string): Buffer {
  return crypto.createHmac('sha256', key).update(msg).digest();
}

function getSignatureKey(key: string, dateStamp: string, region: string, service: string): Buffer {
  const kDate = sign(Buffer.from('AWS4' + key), dateStamp);
  const kRegion = sign(kDate, region);
  const kService = sign(kRegion, service);
  const kSigning = sign(kService, 'aws4_request');
  return kSigning;
}

async function makeRequest(operation: string, payload: Record<string, unknown>): Promise<unknown> {
  const config = getConfig();
  const service = 'ProductAdvertisingAPI';
  const target = `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const requestPayload = JSON.stringify({
    ...payload,
    PartnerTag: config.partnerTag,
    PartnerType: 'Associates',
    Marketplace: config.marketplace,
  });

  const canonicalUri = '/paapi5/' + operation.toLowerCase();
  const canonicalQueryString = '';
  const canonicalHeaders = [
    `content-encoding:amz-1.0`,
    `content-type:application/json; charset=utf-8`,
    `host:${config.host}`,
    `x-amz-date:${amzDate}`,
    `x-amz-target:${target}`,
  ].join('\n') + '\n';

  const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
  const payloadHash = crypto.createHash('sha256').update(requestPayload).digest('hex');

  const canonicalRequest = [
    'POST',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${config.region}/${service}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  const signingKey = getSignatureKey(config.secretKey, dateStamp, config.region, service);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authorizationHeader = [
    `${algorithm} Credential=${config.accessKey}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(', ');

  const response = await fetch(`https://${config.host}${canonicalUri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Encoding': 'amz-1.0',
      'X-Amz-Date': amzDate,
      'X-Amz-Target': target,
      'Authorization': authorizationHeader,
    },
    body: requestPayload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amazon PA-API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

function parseProduct(item: Record<string, unknown>): AmazonProduct | null {
  try {
    const asin = item.ASIN as string;
    const itemInfo = item.ItemInfo as Record<string, unknown> | undefined;
    const offers = item.Offers as Record<string, unknown> | undefined;
    const images = item.Images as Record<string, unknown> | undefined;

    const title = (itemInfo?.Title as Record<string, unknown>)?.DisplayValue as string || 'Unknown Product';

    let imageUrl: string | null = null;
    const primaryImage = (images?.Primary as Record<string, unknown>)?.Large as Record<string, unknown>;
    if (primaryImage?.URL) {
      imageUrl = primaryImage.URL as string;
    }

    let price: string | null = null;
    let primeEligible = false;
    const listings = (offers?.Listings as unknown[]) || [];
    if (listings.length > 0) {
      const listing = listings[0] as Record<string, unknown>;
      const priceInfo = listing.Price as Record<string, unknown>;
      if (priceInfo?.DisplayAmount) {
        price = priceInfo.DisplayAmount as string;
      }
      const deliveryInfo = listing.DeliveryInfo as Record<string, unknown>;
      primeEligible = deliveryInfo?.IsPrimeEligible === true;
    }

    const detailPageUrl = item.DetailPageURL as string || `https://www.amazon.com/dp/${asin}`;

    let brand: string | null = null;
const byLineInfo = itemInfo?.ByLineInfo as Record<string, unknown>;
        const brand_ = (byLineInfo as Record<string, { DisplayValue?: string }>)?.Brand?.DisplayValue;
        const brand_manufacturer = (byLineInfo as Record<string, { DisplayValue?: string }>)?.Manufacturer?.DisplayValue;
        if (brand_) {
                brand = brand_ as string;
        } else if (brand_manufacturer) {
                brand = brand_manufacturer as string;
        }

    return {
      asin,
      title,
      imageUrl,
      price,
      primeEligible,
      detailPageUrl,
      brand,
    };
  } catch {
    return null;
  }
}

export async function searchProducts(params: SearchItemsParams): Promise<AmazonProduct[]> {
  try {
    const response = await makeRequest('SearchItems', {
      Keywords: params.keywords,
      SearchIndex: params.searchIndex || 'All',
      ItemCount: params.itemCount || 10,
      Resources: [
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'Offers.Listings.Price',
        'Offers.Listings.DeliveryInfo.IsPrimeEligible',
        'Images.Primary.Large',
      ],
    }) as { SearchResult?: { Items?: unknown[] } };

    const items = response.SearchResult?.Items || [];
    return items
      .map((item) => parseProduct(item as Record<string, unknown>))
      .filter((p): p is AmazonProduct => p !== null);
  } catch (error) {
    console.error('Amazon search error:', error);
    return [];
  }
}

export async function getProductsByAsin(params: GetItemsParams): Promise<AmazonProduct[]> {
  try {
    const response = await makeRequest('GetItems', {
      ItemIds: params.itemIds,
      Resources: [
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'Offers.Listings.Price',
        'Offers.Listings.DeliveryInfo.IsPrimeEligible',
        'Images.Primary.Large',
      ],
    }) as { ItemsResult?: { Items?: unknown[] } };

    const items = response.ItemsResult?.Items || [];
    return items
      .map((item) => parseProduct(item as Record<string, unknown>))
      .filter((p): p is AmazonProduct => p !== null);
  } catch (error) {
    console.error('Amazon getItems error:', error);
    return [];
  }
}

export function buildAffiliateUrl(asin: string): string {
  const tag = process.env.AMAZON_ASSOCIATE_TAG || 'gojipedia-20';
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

// Check if API credentials are configured
export function isApiConfigured(): boolean {
  return !!(
    process.env.AMAZON_PAAPI_ACCESS_KEY &&
    process.env.AMAZON_PAAPI_SECRET_KEY &&
    process.env.AMAZON_ASSOCIATE_TAG
  );
}
