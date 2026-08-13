import { products, type Product } from './products'
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
  }
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
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

/**
 * Keyword-mapped product titles (Keyword Planner / autocomplete research, Aug 2026).
 * Default template: "Buy {name} UK | ≥99% Purity & COA | Noxptide".
 * Overrides cover long names, disambiguation (VIP/MGF/KPV/DSIP + "peptide")
 * and high-volume variants (Melanotan 2 / MT-2, Glutathione).
 */
const PRODUCT_TITLE_OVERRIDES: Record<string, string> = {
  'ghk-cu': 'Buy GHK-Cu UK | ≥99% Pure Copper Peptide | Noxptide',
  'cjc-1295-no-dac': 'Buy CJC-1295 No DAC UK | ≥99% Purity | Noxptide',
  'melanotan-2': 'Buy Melanotan 2 (MT-2) UK | ≥99% Purity | Noxptide',
  glutathione: 'Buy Glutathione UK | ≥99% Purity & COA | Noxptide',
  kpv: 'Buy KPV Peptide UK | ≥99% Purity & COA | Noxptide',
  dsip: 'Buy DSIP Peptide UK | ≥99% Purity & COA | Noxptide',
  vip: 'Buy VIP Peptide UK | ≥99% Purity & COA | Noxptide',
  'hgh-fragment-176-191': 'Buy HGH Fragment 176-191 UK | ≥99% Purity | Noxptide',
  'cjc-1295-dac': 'Buy CJC-1295 DAC UK | ≥99% Purity | Noxptide',
  mgf: 'Buy MGF Peptide UK | ≥99% Purity & COA | Noxptide',
  'thymosin-alpha-1': 'Buy Thymosin Alpha-1 UK | ≥99% Purity | Noxptide',
}

/** Sales-focused product meta descriptions (all ≤160 chars, verified). */
const PRODUCT_DESCRIPTION_OVERRIDES: Record<string, string> = {
  'bpc-157':
    'Buy BPC-157 UK — ≥99% HPLC purity, batch COA. The most-researched gastric pentadecapeptide for tissue-repair models. Tracked UK delivery. Research use only.',
  'tb-500':
    'Buy TB-500 UK — ≥99% HPLC purity, batch COA. Thymosin Beta-4 fragment for cell-migration research. Tracked UK delivery. Research use only.',
  'ghk-cu':
    'Buy GHK-Cu UK — ≥99% HPLC purity, batch COA. Copper Tripeptide-1 for matrix and collagen-pathway research. Tracked UK delivery. Research use only.',
  ipamorelin:
    'Buy Ipamorelin UK — ≥99% HPLC purity, batch COA. Selective GHSR-1a agonist for GH-axis research. Tracked UK delivery. Research use only.',
  'cjc-1295-no-dac':
    'Buy CJC-1295 No DAC UK — ≥99% HPLC purity, batch COA. Mod GRF(1-29) GHRH analogue for GH-axis models. Tracked UK delivery. Research use only.',
  tesamorelin:
    'Buy Tesamorelin UK — ≥99% HPLC purity, batch COA. GHRH analogue for GH-axis and metabolic research. Tracked UK delivery. Research use only.',
  semax:
    'Buy Semax UK — ≥99% HPLC purity, batch COA. ACTH(4-10) analogue neuropeptide for CNS research. Tracked UK delivery. Research use only.',
  selank:
    'Buy Selank UK — ≥99% HPLC purity, batch COA. Heptapeptide for GABAergic-pathway research models. Tracked UK delivery. Research use only.',
  epitalon:
    'Buy Epitalon UK — ≥99% HPLC purity, batch COA. Tetrapeptide for telomerase-pathway and pineal research. Tracked UK delivery. Research use only.',
  'aod-9604':
    'Buy AOD-9604 UK — ≥99% HPLC purity, batch COA. HGH fragment analogue for metabolic research models. Tracked UK delivery. Research use only.',
  'melanotan-2':
    'Buy Melanotan 2 UK — ≥99% HPLC purity, batch COA. Cyclic α-MSH analogue for melanocortin research. Tracked UK delivery. Research use only.',
  'pt-141':
    'Buy PT-141 UK — ≥99% HPLC purity, batch COA. Bremelanotide melanocortin agonist for MC4R research. Tracked UK delivery. Research use only.',
  sermorelin:
    'Buy Sermorelin UK — ≥99% HPLC purity, batch COA. GHRH(1-29) analogue for GH-axis research. Tracked UK delivery. Research use only.',
  'mots-c':
    'Buy MOTS-c UK — ≥99% HPLC purity, batch COA. Mitochondrial-derived peptide for metabolic research. Tracked UK delivery. Research use only.',
  cagrilintide:
    'Buy Cagrilintide UK — ≥99% HPLC purity, batch COA. Amylin analogue for appetite-signalling research. Tracked UK delivery. Research use only.',
  'nad-plus':
    'Buy NAD+ UK — ≥99% HPLC purity, batch COA. Nicotinamide adenine dinucleotide for redox research. Tracked UK delivery. Research use only.',
  glutathione:
    'Buy Glutathione UK — ≥99% HPLC purity, batch COA. Tripeptide antioxidant for redox-biology research. Tracked UK delivery. Research use only.',
  kpv:
    'Buy KPV peptide UK — ≥99% HPLC purity, batch COA. α-MSH(11-13) tripeptide for inflammation-pathway research. Tracked UK delivery. Research use only.',
  dsip:
    'Buy DSIP peptide UK — ≥99% HPLC purity, batch COA. Delta-sleep-inducing peptide for CNS research models. Tracked UK delivery. Research use only.',
  hexarelin:
    'Buy Hexarelin UK — ≥99% HPLC purity, batch COA. Hexapeptide secretagogue for GH-axis research. Tracked UK delivery. Research use only.',
  vip:
    'Buy VIP peptide UK — ≥99% HPLC purity, batch COA. Vasoactive intestinal peptide for receptor-signalling research. Tracked UK delivery. Research use only.',
  testagen:
    'Buy Testagen UK — ≥99% HPLC purity, batch COA. Lys-Glu-Asp-Gly tetrapeptide for endocrine research. Tracked UK delivery. Research use only.',
  'ghrp-6':
    'Buy GHRP-6 UK — ≥99% HPLC purity, batch COA. Ghrelin-mimetic hexapeptide for GHSR research. Tracked UK delivery. Research use only.',
  'ghrp-2':
    'Buy GHRP-2 UK — ≥99% HPLC purity, batch COA. Selective GHSR agonist for GH-axis research. Tracked UK delivery. Research use only.',
  'hgh-fragment-176-191':
    'Buy HGH Fragment 176-191 UK — ≥99% HPLC purity, batch COA. C-terminal HGH fragment for lipid-metabolism research. Tracked UK delivery. Research use only.',
  'cjc-1295-dac':
    'Buy CJC-1295 DAC UK — ≥99% HPLC purity, batch COA. Long-acting GHRH analogue with drug affinity complex. Tracked UK delivery. Research use only.',
  'igf-1-lr3':
    'Buy IGF-1 LR3 UK — ≥99% HPLC purity, batch COA. Long-acting IGF-1 analogue for growth-factor research. Tracked UK delivery. Research use only.',
  'peg-mgf':
    'Buy PEG-MGF UK — ≥99% HPLC purity, batch COA. PEGylated MGF variant for muscle-cell research models. Tracked UK delivery. Research use only.',
  mgf:
    'Buy MGF peptide UK — ≥99% HPLC purity, batch COA. Mechano growth factor for muscle-cell research. Tracked UK delivery. Research use only.',
  'thymosin-alpha-1':
    'Buy Thymosin Alpha-1 UK — ≥99% HPLC purity, batch COA. 28-amino-acid thymic peptide for immune-pathway research. Tracked UK delivery. Research use only.',
  'kisspeptin-10':
    'Buy Kisspeptin-10 UK — ≥99% HPLC purity, batch COA. KISS1-derived decapeptide for HPG-axis research. Tracked UK delivery. Research use only.',
  'igf-1-des':
    'Buy IGF-1 DES UK — ≥99% HPLC purity, batch COA. Des(1-3) IGF-1 variant for growth-factor research. Tracked UK delivery. Research use only.',
}

export function productImageUrl(product: Product, sizeLabel?: string) {
  const label = (sizeLabel ?? product.sizes[0].label).replace(/ /g, '').toLowerCase()
  return `${SITE_URL}/images/products/${product.slug}-${label}.webp`
}

export function productSeo(product: Product): RouteSeo {
  const path = `/product/${product.slug}`
  const title =
    PRODUCT_TITLE_OVERRIDES[product.slug] ??
    `Buy ${product.name} UK | ≥99% Purity & COA | Noxptide`
  const description =
    PRODUCT_DESCRIPTION_OVERRIDES[product.slug] ??
    `Buy ${product.name} UK — ≥99% HPLC purity, batch COA. Tracked UK delivery. Research use only.`
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
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toFixed(1),
          reviewCount: product.reviews,
          bestRating: '5',
          worstRating: '1',
        },
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
  'bpc-157-research-guide': 'What Is BPC-157? Research Guide & Handling | Noxptide',
  'tb-500-research-guide': 'What Is TB-500? Research Guide & Handling | Noxptide',
  'bpc-157-vs-tb-500': 'BPC-157 vs TB-500: Which Peptide for Your Research?',
  'ipamorelin-vs-cjc-1295': 'Ipamorelin vs CJC-1295: Research Compared | Noxptide',
  'semax-research-guide': 'Semax Research Guide: Mechanisms, Handling & COA',
  'ghk-cu-research-guide': 'GHK-Cu Research Guide: The Copper Peptide | Noxptide',
  'peptide-reconstitution-storage-guide': 'How to Reconstitute Peptides: Guide & Storage | Noxptide',
  'how-to-read-peptide-coa': 'How to Read a Peptide COA: Purity Explained | Noxptide',
  'melanotan-2-vs-pt-141': 'Melanotan 2 vs PT-141: Research Compared | Noxptide',
  'epitalon-research-guide': 'Epitalon Research Guide: Mechanisms & Handling | Noxptide',
}

/** Meta descriptions per audit (≤160 chars; the on-page card copy stays longer). */
const GUIDE_DESCRIPTION_OVERRIDES: Record<string, string> = {
  'bpc-157-research-guide':
    'What BPC-157 is, what the published research covers, and how to store, reconstitute and verify it. Buy BPC-157 UK with batch COA at Noxptide.',
  'tb-500-research-guide':
    'What TB-500 is, what the Thymosin Beta-4 literature covers, and how to store, reconstitute and verify it. Buy TB-500 UK with batch COA at Noxptide.',
  'bpc-157-vs-tb-500':
    'BPC-157 and TB-500 compared: mechanisms, literature coverage, handling and when labs choose each. Buy both in the UK with batch COAs at Noxptide.',
  'ipamorelin-vs-cjc-1295':
    'Ipamorelin vs CJC-1295 (No DAC): receptor mechanisms, selectivity, literature and why labs pair them. Buy both UK with batch COAs at Noxptide.',
  'semax-research-guide':
    'Semax explained: the ACTH(4-10) analogue, neurotrophin literature, light-sensitive handling and purity checks. Buy Semax UK with COA at Noxptide.',
  'ghk-cu-research-guide':
    'GHK-Cu (Copper Tripeptide-1) explained: decades of matrix research, quality signals and correct storage. Buy GHK-Cu UK with batch COA at Noxptide.',
  'peptide-reconstitution-storage-guide':
    'Step-by-step: reconstituting lyophilised peptides with bacteriostatic water, storage temperatures, shelf life and freeze-thaw limits. Lab-grade guidance.',
  'how-to-read-peptide-coa':
    'What every COA section means: HPLC purity traces, mass-spec identity, batch numbers and red flags. Verify before you buy — every Noxptide batch has one.',
  'melanotan-2-vs-pt-141':
    'Melanotan II vs PT-141 (Bremelanotide): structural difference, receptor profiles, literature and handling. Buy both UK with batch COAs at Noxptide.',
  'epitalon-research-guide':
    'Epitalon (Epithalon) explained: the Ala-Glu-Asp-Gly tetrapeptide, telomerase and pineal literature, handling and verification. Buy UK with COA.',
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
    'Buy Research Peptides UK | ≥99% Purity & COAs | Noxptide',
    'Buy research peptides in the UK with ≥99% HPLC purity and batch-specific COAs. 32 compounds in stock, tracked delivery. For laboratory research use only.',
    { jsonLd: [organizationLd(), websiteLd()] },
  ),
  '/shop': base(
    '/shop',
    'Peptides for Sale UK | ≥99% Pure, Batch COA | Noxptide',
    'Shop 32 research peptides for sale in the UK — ≥99% HPLC purity with batch-specific COAs. Tracked delivery. For laboratory research use only.',
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
    'Peptide Research Guides & Lab Resources | Noxptide',
    'Evidence-led peptide research guides: reconstitution, storage, COA verification and compound comparisons — from a UK supplier with batch-tested stock.',
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
    'Peptide Purity Testing: HPLC, MS & Batch COAs | Noxptide',
    'How Noxptide verifies every peptide batch: HPLC purity ≥99%, mass-spec identity and batch-specific COAs you can check before you buy. See the process.',
    {
      jsonLd: [
        webPageLd(
          'Peptide Quality Testing You Can Verify',
          '/quality',
          'How Noxptide verifies every peptide batch: HPLC purity ≥99%, mass-spec identity and batch-specific COAs you can check before you buy.',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Quality & COAs' }]),
      ],
    },
  ),
  '/faq': base(
    '/faq',
    'Research Peptide FAQs: Purity, Shipping & Legal | Noxptide',
    'Answers on peptide purity, COAs, storage, UK delivery and ordering — plus are research peptides legal in the UK? Straight answers from Noxptide.',
    {
      jsonLd: [
        webPageLd(
          'Research Peptide Frequently Asked Questions',
          '/faq',
          'Answers on peptide purity, COAs, storage, UK delivery and ordering — plus whether research peptides are legal in the UK.',
        ),
        faqPageLd(allFaqs),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'FAQ' }]),
      ],
    },
  ),
  '/about': base(
    '/about',
    'About Noxptide | UK Research Peptide Supplier',
    'Why researchers choose Noxptide: ≥99% HPLC purity, independent batch verification, transparent COAs and fast UK dispatch. Meet the team behind it.',
    {
      jsonLd: [
        webPageLd(
          'About Noxptide',
          '/about',
          'Why researchers choose Noxptide: ≥99% HPLC purity, independent batch verification, transparent COAs and fast UK dispatch.',
          'AboutPage',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About' }]),
      ],
    },
  ),
  '/shipping': base(
    '/shipping',
    'Peptide Delivery UK: Tracked Shipping Times | Noxptide',
    'Dispatch cut-offs, tracked UK delivery options, packaging and European shipping for research peptide orders — costs and times explained.',
    {
      jsonLd: [
        webPageLd(
          'Research Peptide Shipping & Delivery',
          '/shipping',
          'Dispatch cut-offs, tracked UK delivery options, packaging and European shipping for research peptide orders.',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Shipping & Delivery' }]),
      ],
    },
  ),
  '/legal': base(
    '/legal',
    'Are Research Peptides Legal in the UK? | Noxptide',
    'The rules on buying and holding research peptides in the UK: research-use-only status, human-use restrictions and handling. Plain-English answers.',
    {
      jsonLd: [
        webPageLd(
          'Research Use Only Policy',
          '/legal',
          'The rules on buying and holding research peptides in the UK: research-use-only status, human-use restrictions and handling.',
        ),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Research Use Only Policy' }]),
      ],
    },
  ),
  '/contact': base(
    '/contact',
    'Contact Noxptide | UK Research Peptide Support',
    'Questions about an order, a batch COA or stock? Contact the Noxptide team — fast, knowledgeable support from a UK research peptide supplier.',
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
  return { ...notFoundSeo, canonical: `${SITE_URL}${clean}` }
}

/** Indexable routes advertised in the XML sitemap (audit: 51 URLs). */
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
  ...products.map((p) => `/product/${p.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
]
