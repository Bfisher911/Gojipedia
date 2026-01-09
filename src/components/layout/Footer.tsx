import Link from 'next/link';

const footerLinks = {
  explore: [
    { name: 'All Monsters', href: '/monsters' },
    { name: 'Movies & Media', href: '/movies' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Lore & History', href: '/lore' },
    { name: 'Short Stories', href: '/stories' },
  ],
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Figures', href: '/shop?category=figures' },
    { name: 'Blu-rays', href: '/shop?category=bluray' },
    { name: 'Books', href: '/shop?category=books' },
    { name: 'How We Pick Products', href: '/about/product-selection' },
  ],
  about: [
    { name: 'About Gojipedia', href: '/about' },
    { name: 'Fan Power Index', href: '/about/fan-power-index' },
    { name: 'Affiliate Disclosure', href: '/about/affiliate-disclosure' },
    { name: 'Privacy Policy', href: '/about/privacy' },
    { name: 'Contact', href: '/about/contact' },
  ],
};

const eras = [
  { name: 'Showa Era', href: '/monsters?era=Showa', color: 'text-yellow-400' },
  { name: 'Heisei Era', href: '/monsters?era=Heisei', color: 'text-red-400' },
  { name: 'Millennium', href: '/monsters?era=Millennium', color: 'text-teal-400' },
  { name: 'Reiwa Era', href: '/monsters?era=Reiwa', color: 'text-purple-400' },
  { name: 'MonsterVerse', href: '/monsters?era=MonsterVerse', color: 'text-blue-400' },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#2a2a3a] mt-auto">
      {/* Affiliate Disclosure Banner */}
      <div className="bg-[#00d4aa]/10 border-b border-[#00d4aa]/20">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center text-sm text-[#9090a0]">
          <span className="text-[#00d4aa] font-medium">Affiliate Disclosure:</span>{' '}
          Gojipedia earns commissions from qualifying Amazon purchases. This helps keep the site running.{' '}
          <Link href="/about/affiliate-disclosure" className="text-[#00d4aa] hover:underline">
            Learn more
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-[#00d4aa]">
              Gojipedia
            </Link>
            <p className="mt-4 text-sm text-[#606070]">
              Your encyclopedic guide to the King of the Monsters and the kaiju universe.
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {eras.map((era) => (
                <Link
                  key={era.name}
                  href={era.href}
                  className={`text-xs ${era.color} hover:opacity-80 transition-opacity`}
                >
                  {era.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f0f5] uppercase tracking-wider">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9090a0] hover:text-[#f0f0f5] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f0f5] uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9090a0] hover:text-[#f0f0f5] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f0f5] uppercase tracking-wider">
              About
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9090a0] hover:text-[#f0f0f5] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f0f5] uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="mt-4 text-sm text-[#606070]">
              Get the latest kaiju news and updates.
            </p>
            <form className="mt-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 px-3 py-2 bg-[#12121a] border border-[#2a2a3a] rounded-lg text-sm text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00d4aa] text-[#0a0a0f] rounded-lg text-sm font-medium hover:bg-[#00f0c0] transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#2a2a3a] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#606070]">
            &copy; {new Date().getFullYear()} Gojipedia. All rights reserved. Godzilla and all related characters are trademarks of Toho Co., Ltd.
          </p>
          <p className="text-xs text-[#606070]">
            This is an unofficial fan site. We are not affiliated with Toho, Legendary, or any studios.
          </p>
        </div>
      </div>
    </footer>
  );
}
