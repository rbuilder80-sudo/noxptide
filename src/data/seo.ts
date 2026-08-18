import { products, categories, type Category, type Product } from './products'
import { guides, type Guide } from './guides'
import { allFaqs } from './faqs'

/**
 * Single source of truth for route-level SEO metadata.
 * Used by the client (useSeo) and by the build-time prerenderer, so the
 * initial HTML and any client-side enhancement never contradict each other.
 * All URLs are generated on the canonical www host (audit P0-2/P0-3).
 */

export const SITE_URL = 'https://www.noxptide.co.uk'
export const SITE_NAME = 'Noxptide'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`
export const ORG_ID = `${SITE_URL}/#organization`

export const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1'
export const NOINDEX_FOLLOW = 'noindex, follow'
export const NOINDEX_NOFOLLOW = 'noindex, nofollow'

export interface RouteSeo {
  title: string
  description: string
  robots: string
  canonical: string
  ogType: 'website' | 'article' | 'product'
  ogImage: string
  jsonLd?: object[]
}

/* ------------------------------------------------------------------ */
/* Structured-data builders                                            */
/* ------------------------------------------------------------------ */

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/favicon.svg`,
    image: DEFAULT_OG_IMAGE,
    description:
      'UK supplier of ≥99% purity research peptides with batch-specific Certificates of Analysis. For laboratory research use only.',
    email: 'support@noxptide.co.uk',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@noxptide.co.uk',
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: 'en-GB',
    },
    // Factual shipping services (see /shipping). MerchantReturnPolicy is
    // deliberately omitted: our returns terms are restrictive/conditional and
    // a schema declaration could overstate them.
    hasShippingService: [
      {
        '@type': 'ShippingService',
        name: 'Standard tracked UK delivery',
        serviceType: 'Standard tracked',
        areaServed: { '@type': 'Country', name: 'GB' },
        provider: { '@id': ORG_ID },
        costAndShipping: {
          '@type': 'ShippingCostSpecification',
          shippingRate: { '@type': 'MonetaryAmount', value: '4.99', currency: 'GBP' },
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        },
      },
      {
        '@type': 'ShippingService',
        name: 'Next-working-day tracked UK delivery',
        serviceType: 'Next-working-day tracked',
        areaServed: { '@type': 'Country', name: 'GB' },
        provider: { '@id': ORG_ID },
        costAndShipping: {
          '@type': 'ShippingCostSpecification',
          shippingRate: { '@type': 'MonetaryAmount', value: '8.99', currency: 'GBP' },
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
        },
      },
      {
        '@type': 'ShippingService',
        name: 'Tracked European delivery',
        serviceType: 'Tracked international',
        areaServed: { '@type': 'GeoShape', addressContinent: 'EU' },
        provider: { '@id': ORG_ID },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 7, unitCode: 'DAY' },
        },
      },
    ],
  }
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbLd(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: `${SITE_URL}${it.path}` } : {}),
    })),
  }
}

function webPageLd(name: string, path: string, description: string, type = 'WebPage') {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url: `${SITE_URL}${path}`,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': ORG_ID },
  }
}

function faqPageLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/* ------------------------------------------------------------------ */
/* Product pages (audit §6)                                            */
/* ------------------------------------------------------------------ */

/** Title-tag overrides where the product name is long (audit table). */
const PRODUCT_TITLE_OVERRIDES: Record<string, string> = {
  'cjc-1295-no-dac': 'CJC-1295 (No DAC) Peptide UK | ≥99% Purity | Noxptide',
  'hgh-fragment-176-191': 'HGH Fragment 176-191 Peptide UK | ≥99% Purity | Noxptide',
  'cjc-1295-dac': 'CJC-1295 With DAC Peptide UK | ≥99% Purity | Noxptide',
  'thymosin-alpha-1': 'Thymosin Alpha-1 Peptide UK | ≥99% Purity | Noxptide',
}

export function productImageUrl(product: Product, sizeLabel?: string) {
  const label = (sizeLabel ?? product.sizes[0].label).replace(/ /g, '').toLowerCase()
  return `${SITE_URL}/images/products/${product.slug}-${label}.webp`
}

export function productSeo(product: Product): RouteSeo {
  const path = `/product/${product.slug}`
  const title =
    PRODUCT_TITLE_OVERRIDES[product.slug] ??
    `${product.name} Research Peptide UK | ≥99% Purity | Noxptide`
  const description = `Order ${product.name} research peptide in the UK with ≥99% purity, batch-specific COA and tracked delivery. For laboratory research use only.`
  return {
    title,
    description,
    robots: INDEX_ROBOTS,
    canonical: `${SITE_URL}${path}`,
    ogType: 'product',
    ogImage: productImageUrl(product),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${product.name} Research Peptide`,
        description: product.short,
        url: `${SITE_URL}${path}`,
        image: productImageUrl(product),
        brand: { '@type': 'Brand', name: SITE_NAME },
        sku: product.slug.toUpperCase(),
        // No aggregateRating: ratings must only be emitted for genuine, visible,
        // attributable reviews (Google structured-data policy — fabricated ratings
        // risk a manual action). Reinstated once real review data exists.
        offers: product.sizes.map((s) => ({
          '@type': 'Offer',
          url: `${SITE_URL}${path}`,
          priceCurrency: 'GBP',
          price: s.price.toFixed(2),
          name: `${product.name} ${s.label}`,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        })),
      },
      faqPageLd(product.faqs),
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Peptides', path: '/shop' },
        { name: product.name },
      ]),
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Guide pages (audit §7)                                              */
/* ------------------------------------------------------------------ */

const GUIDE_TITLE_OVERRIDES: Record<string, string> = {
  'bpc-157-research-guide': 'BPC-157 Research Guide: Evidence, Handling & Storage',
  'tb-500-research-guide': 'TB-500 Research Guide: Thymosin Beta-4 in the Laboratory',
  'bpc-157-vs-tb-500': 'BPC-157 vs TB-500: Which Peptide for Your Research Model?',
  'ipamorelin-vs-cjc-1295': 'Ipamorelin vs CJC-1295: Secretagogue Research Compared',
  'semax-research-guide': 'Semax Research Guide: The ACTH(4-10) Analogue in CNS Studies',
  'ghk-cu-research-guide': 'GHK-Cu Research Guide: The Copper Peptide in Matrix Research',
  'peptide-reconstitution-storage-guide': 'How to Reconstitute & Store Research Peptides | Noxptide',
  'how-to-read-peptide-coa': 'How to Read a Peptide Certificate of Analysis | Noxptide',
  'melanotan-2-vs-pt-141': 'Melanotan II vs PT-141: Melanocortin Research Compared',
  'epitalon-research-guide': 'Epitalon Research Guide: The Telomerase-Pathway Tetrapeptide',
}

/** Meta descriptions per audit (≤160 chars; the on-page card copy stays longer). */
const GUIDE_DESCRIPTION_OVERRIDES: Record<string, string> = {
  'bpc-157-research-guide':
    'The complete laboratory guide to BPC-157: what it is, what the published research covers, how to store and reconstitute it, and how to verify purity.',
  'tb-500-research-guide':
    'A laboratory guide to TB-500: mechanism coverage in the literature, correct storage and reconstitution, purity verification, and how it differs from BPC-157.',
  'bpc-157-vs-tb-500':
    'BPC-157 and TB-500 compared for research design: mechanisms, literature coverage, handling differences, purity verification, and when to choose each.',
  'ipamorelin-vs-cjc-1295':
    'Ipamorelin vs CJC-1295 (No DAC) compared for endocrine research: receptor mechanisms, selectivity, literature coverage, handling, and why labs pair them.',
  'semax-research-guide':
    'A laboratory guide to Semax: its origin as an ACTH(4-10) analogue, neurotrophin literature, light-sensitive handling, and purity verification.',
  'ghk-cu-research-guide':
    'A laboratory guide to GHK-Cu (Copper Tripeptide-1): four decades of skin and matrix research, what the blue colour tells you about quality, and correct storage.',
  'peptide-reconstitution-storage-guide':
    'Step-by-step laboratory guidance on reconstituting lyophilised peptides with bacteriostatic water, storage temperatures, shelf life and freeze-thaw limits.',
  'how-to-read-peptide-coa':
    'What every section of a peptide COA actually means: HPLC purity traces, mass spectrometry identity, batch numbers, appearance testing, and red flags.',
  'melanotan-2-vs-pt-141':
    'Melanotan II vs PT-141 (Bremelanotide) compared for melanocortin research: the one-atom structural difference, receptor profiles, literature and handling.',
  'epitalon-research-guide':
    'A laboratory guide to Epitalon (Epithalon): the Ala-Glu-Asp-Gly tetrapeptide, telomerase and pineal research literature, handling, and analytical verification.',
}

export function guideSeo(guide: Guide): RouteSeo {
  const path = `/guides/${guide.slug}`
  const description = GUIDE_DESCRIPTION_OVERRIDES[guide.slug] ?? guide.description
  return {
    title: GUIDE_TITLE_OVERRIDES[guide.slug] ?? `${guide.title} | Noxptide Research Guides`,
    description,
    robots: INDEX_ROBOTS,
    canonical: `${SITE_URL}${path}`,
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description,
        image: DEFAULT_OG_IMAGE,
        datePublished: guide.published,
        dateModified: guide.updated,
        author: {
          '@type': 'Organization',
          name: 'Noxptide Research Team',
          url: `${SITE_URL}/about`,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
        },
        mainEntityOfPage: `${SITE_URL}${path}`,
      },
      faqPageLd(guide.faqs),
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Guides', path: '/guides' },
        { name: guide.title },
      ]),
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Category hub pages (audit §8: crawlable category URLs)               */
/* ------------------------------------------------------------------ */

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'recovery-repair': {
    title: 'Recovery & Repair Peptides UK | ≥99% Purity | Noxptide',
    description:
      'Browse recovery and repair research peptides — BPC-157, TB-500, GHK-Cu and more. ≥99% purity with batch-specific COAs. Laboratory research use only.',
  },
  'growth-hormone-secretagogues': {
    title: 'Growth Hormone Secretagogues UK | Noxptide Peptides',
    description:
      'GHRH analogues and GHRPs for GH-axis research — CJC-1295, ipamorelin, sermorelin, tesamorelin. Batch COAs, UK dispatch. Research use only.',
  },
  'cognitive-neuropeptides': {
    title: 'Cognitive & Neuropeptides UK | Noxptide Research',
    description:
      'Neuropeptides and bioregulators for CNS research — Semax, Selank, DSIP, Epitalon. ≥99% purity, batch-specific COAs. Laboratory research use only.',
  },
  'metabolic-pigmentation': {
    title: 'Metabolic & Melanocortin Peptides UK | Noxptide',
    description:
      'Metabolic and melanocortin-receptor research peptides — AOD-9604, Melanotan II, PT-141, MOTS-c. Batch COAs, UK dispatch. Research use only.',
  },
}

export function categorySeo(category: Category): RouteSeo {
  const path = `/category/${category.slug}`
  const meta = CATEGORY_META[category.slug]
  const items = products.filter((p) => p.category === category.slug)
  const title = meta?.title ?? `${category.name} | Noxptide Research Peptides`
  const description = meta?.description ?? category.description
  return {
    title,
    description,
    robots: INDEX_ROBOTS,
    canonical: `${SITE_URL}${path}`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: category.name,
        description,
        url: `${SITE_URL}${path}`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: items.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/product/${p.slug}`,
            name: p.name,
          })),
        },
      },
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: category.name },
      ]),
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Core + system routes (audit §5, §8)                                 */
/* ------------------------------------------------------------------ */

const base = (
  path: string,
  title: string,
  description: string,
  extra?: Partial<RouteSeo>,
): RouteSeo => ({
  title,
  description,
  robots: INDEX_ROBOTS,
  canonical: `${SITE_URL}${path}`,
  ogType: 'website',
  ogImage: DEFAULT_OG_IMAGE,
  ...extra,
})

const noindex = (path: string, title: string, description: string): RouteSeo =>
  base(path, title, description, { robots: NOINDEX_FOLLOW })

export const coreSeo: Record<string, RouteSeo> = {
  '/': base(
    '/',
    'UK Research Peptides | ≥99% Purity & Batch COAs',
    'UK research peptides with ≥99% HPLC purity, independent verification and batch-specific COAs. Tracked delivery. For laboratory research use only.',
    { jsonLd: [organizationLd(), websiteLd()] },
  ),
  '/shop': base(
    '/shop',
    'Research Peptides UK | Shop the Noxptide Catalogue',
    'Browse Noxptide research peptides with ≥99% HPLC purity, batch-specific COAs and tracked UK delivery. Supplied strictly for laboratory research.',
    {
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Research Peptides UK',
          url: `${SITE_URL}/shop`,
          description:
            'The complete Noxptide catalogue of ≥99% purity research peptides with batch-specific Certificates of Analysis.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}/product/${p.slug}`,
              name: p.name,
            })),
          },
        },
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Peptides' }]),
      ],
    },
  ),
  '/guides': base(
    '/guides',
    'Research Peptide Guides, Handling & COA Resources',
    'Evidence-led guides to research peptide handling, storage, COAs and compound comparisons. Written for laboratory research; not medical advice.',
    {
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Research Peptide Guides & Laboratory Resources',
          url: `${SITE_URL}/guides`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: guides.map((g, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}/guides/${g.slug}`,
              name: g.title,
            })),
          },
        },
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Guides' }]),
      ],
    },
  ),
  '/quality': base(
    '/quality',
    'Peptide Quality Testing & Certificates of Analysis',
    'See how Noxptide verifies identity and ≥99% purity using HPLC, mass spectrometry and batch-specific Certificates of Analysis for research peptides.',
    {
      jsonLd: [
        webPageLd(
          'Peptide Quality Testing You Can Verify',
          '/quality',
          'How Noxptide verifies identity and ≥99% purity using HPLC, mass spectrometry and batch-specific Certificates of Analysis.',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Quality & COAs' }]),
      ],
    },
  ),
  '/faq': base(
    '/faq',
    'Research Peptide FAQ: Purity, COAs, Storage & Delivery',
    'Answers about research peptide purity, COAs, storage, UK delivery, ordering and research-use compliance from Noxptide.',
    {
      jsonLd: [
        webPageLd(
          'Research Peptide Frequently Asked Questions',
          '/faq',
          'Answers about research peptide purity, COAs, storage, UK delivery, ordering and research-use compliance.',
        ),
        faqPageLd(allFaqs),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'FAQ' }]),
      ],
    },
  ),
  '/about': base(
    '/about',
    'About Noxptide | UK Research Peptide Supplier',
    'Learn how Noxptide approaches research peptide quality, independent verification, batch documentation and research-use compliance in the UK.',
    {
      jsonLd: [
        webPageLd(
          'About Noxptide',
          '/about',
          'How Noxptide approaches research peptide quality, independent verification, batch documentation and research-use compliance in the UK.',
          'AboutPage',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About' }]),
      ],
    },
  ),
  '/shipping': base(
    '/shipping',
    'Research Peptide Shipping & UK Delivery | Noxptide',
    'Noxptide shipping information: dispatch cut-offs, tracked UK delivery, packaging, costs and European options for laboratory research peptide orders.',
    {
      jsonLd: [
        webPageLd(
          'Research Peptide Shipping & Delivery',
          '/shipping',
          'Dispatch cut-offs, tracked UK delivery, packaging, costs and European options for laboratory research peptide orders.',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Shipping & Delivery' }]),
      ],
    },
  ),
  '/legal': base(
    '/legal',
    'Research Use Only Policy | Noxptide UK',
    "Read Noxptide's research-use-only policy for chemical reference materials supplied strictly for in-vitro laboratory research, not human or veterinary use.",
    {
      jsonLd: [
        webPageLd(
          'Research Use Only Policy',
          '/legal',
          'Chemical reference materials supplied strictly for in-vitro laboratory research, not human or veterinary use.',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Research Use Only Policy' }]),
      ],
    },
  ),
  '/contact': base(
    '/contact',
    'Contact Noxptide | COA Requests & Order Support',
    'Contact Noxptide for batch COA requests, order support and research enquiries. UK-based assistance via support@noxptide.co.uk.',
    {
      jsonLd: [
        webPageLd(
          'Contact Noxptide',
          '/contact',
          'Batch COA requests, order support and research enquiries from the UK-based Noxptide team.',
          'ContactPage',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact' }]),
      ],
    },
  ),

  /* System / legal routes — noindex (audit §8) */
  '/terms': noindex(
    '/terms',
    'Terms & Conditions | Noxptide UK',
    'Terms & Conditions governing use of noxptide.co.uk and every order placed with Noxptide — research use only, delivery, returns, liability and governing law.',
  ),
  '/privacy': noindex(
    '/privacy',
    'Privacy Policy | Noxptide UK',
    'How Noxptide collects, uses and protects your personal data — UK GDPR compliant privacy policy covering orders, cookies, analytics and your data rights.',
  ),
  '/data-retention': noindex(
    '/data-retention',
    'Data Retention Policy | Noxptide UK',
    'Exactly how long Noxptide keeps each kind of personal data and why — order records, accounts, emails, marketing, analytics and backups.',
  ),
  '/cart': noindex('/cart', 'Your Cart | Noxptide', 'Review your research peptide order.'),
  '/checkout': noindex(
    '/checkout',
    'Secure Checkout | Noxptide',
    'Complete your research peptide order securely.',
  ),
  '/login': noindex('/login', 'Account Login | Noxptide', 'Sign in to your Noxptide account.'),
}

export const notFoundSeo: RouteSeo = {
  title: 'Page Not Found | Noxptide',
  description: 'The page you requested could not be found.',
  robots: NOINDEX_FOLLOW,
  canonical: `${SITE_URL}/404`,
  ogType: 'website',
  ogImage: DEFAULT_OG_IMAGE,
}

/** Resolve metadata for any request path (used by prerender + client). */
export function seoForPath(path: string): RouteSeo {
  const clean = path.replace(/\/+$/, '') || '/'
  if (coreSeo[clean]) return coreSeo[clean]
  const productMatch = clean.match(/^\/product\/([\w-]+)$/)
  if (productMatch) {
    const product = products.find((p) => p.slug === productMatch[1])
    if (product) return productSeo(product)
  }
  const guideMatch = clean.match(/^\/guides\/([\w-]+)$/)
  if (guideMatch) {
    const guide = guides.find((g) => g.slug === guideMatch[1])
    if (guide) return guideSeo(guide)
  }
  const categoryMatch = clean.match(/^\/category\/([\w-]+)$/)
  if (categoryMatch) {
    const category = categories.find((c) => c.slug === categoryMatch[1])
    if (category) return categorySeo(category)
  }
  return { ...notFoundSeo, canonical: `${SITE_URL}${clean}` }
}

/** Indexable routes advertised in the XML sitemap (audit: 51 URLs + 4 category hubs). */
export const INDEXABLE_PATHS: string[] = [
  '/',
  '/shop',
  '/guides',
  '/quality',
  '/faq',
  '/about',
  '/shipping',
  '/legal',
  '/contact',
  ...categories.map((c) => `/category/${c.slug}`),
  ...products.map((p) => `/product/${p.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
]
