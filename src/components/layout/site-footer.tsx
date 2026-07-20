import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { siteConfig } from "@/lib/site-config";

const footerNavigation = [
  ...siteConfig.navigation.filter((link) => link.href !== "/"),
  siteConfig.contactLink,
];

const footerLinkClass =
  "inline-flex min-h-11 items-center rounded-md py-2 text-white/80 transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <footer className="bg-navy py-12 text-white sm:py-16">
      <SiteContainer>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterSection title="Unternehmen">
            <p className="font-semibold text-white">{siteConfig.name}</p>
            <address className="mt-3 not-italic text-white/75">
              {siteConfig.operator}
              <br />
              {siteConfig.address.street}
              <br />
              {siteConfig.address.postalCode} {siteConfig.address.city}
            </address>
          </FooterSection>

          <FooterSection title="Kontakt">
            <ul>
              <li>
                <a className={footerLinkClass} href={siteConfig.phone.href}>
                  {siteConfig.phone.display}
                </a>
              </li>
              <li>
                <a
                  className={`${footerLinkClass} max-w-full break-all`}
                  href={siteConfig.email.href}
                >
                  {siteConfig.email.address}
                </a>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Navigation">
            <nav aria-label="Footer-Navigation">
              <ul>
                {footerNavigation.map((link) => (
                  <li key={link.href}>
                    <Link className={footerLinkClass} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </FooterSection>

          <FooterSection title="Rechtliches">
            <nav aria-label="Rechtliche Navigation">
              <ul>
                {siteConfig.legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link className={footerLinkClass} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </FooterSection>
        </div>
      </SiteContainer>
    </footer>
  );
}

function FooterSection({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold tracking-widest text-green-light uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
