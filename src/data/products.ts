export interface Product {
  slug: string
  rating: number
  reviews: number
  references: { title: string; url: string }[]
  name: string
  subtitle: string
  category: string
  price: number
  sizes: { label: string; price: number }[]
  purity: string
  cas: string
  formula: string
  molecularWeight: string
  sequence: string
  appearance: string
  storage: string
  short: string
  description: string[]
  applications: string[]
  faqs: { q: string; a: string }[]
  badge?: string
}

export interface Category {
  slug: string
  name: string
  tagline: string
  description: string
}

export const categories: Category[] = [
  {
    slug: 'recovery-repair',
    name: 'Recovery & Repair Peptides',
    tagline: 'Tissue, tendon and systemic repair research compounds',
    description:
      'Our recovery and repair range is the most-requested category in UK research laboratories. Every batch of BPC-157, TB-500 and GHK-Cu is synthesised to ≥99% purity, verified by independent HPLC and mass spectrometry, and shipped with a batch-specific Certificate of Analysis so your lab can order with complete confidence.',
  },
  {
    slug: 'growth-hormone-secretagogues',
    name: 'Growth Hormone Secretagogues',
    tagline: 'GHRH and ghrelin-receptor research peptides',
    description:
      'Precision-synthesised secretagogue peptides for endocrine and metabolic research. From Ipamorelin to CJC-1295 and Tesamorelin, each vial is lyophilised for stability, batch-tested to ≥99% purity, and supplied with full analytical documentation trusted by research institutions across the UK and Europe.',
  },
  {
    slug: 'cognitive-neuropeptides',
    name: 'Cognitive & Neuropeptides',
    tagline: 'Neuroscience-grade peptides for CNS research',
    description:
      'A specialist range for neurological and cognitive research programmes. Semax, Selank and Epitalon are manufactured under strict quality controls, independently verified, and delivered cold-chain where required — the standard your neuroscience research deserves.',
  },
  {
    slug: 'metabolic-pigmentation',
    name: 'Metabolic & Melanocortin Peptides',
    tagline: 'Melanocortin and lipolytic research compounds',
    description:
      'Melanocortin receptor and metabolic research peptides including Melanotan II, PT-141 and AOD-9604. Every compound ships with a verifiable Certificate of Analysis, tamper-evident packaging and tracked UK delivery for complete laboratory assurance.',
  },
]

export const products: Product[] = [
  {
    slug: 'bpc-157',
    rating: 4.9,
    reviews: 214,
    name: 'BPC-157',
    subtitle: 'Body Protection Compound-157 · Pentadecapeptide',
    category: 'recovery-repair',
    price: 34.99,
    sizes: [
      { label: '5 mg', price: 34.99 },
      { label: '10 mg', price: 59.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '137525-51-0',
    formula: 'C62H98N16O22',
    molecularWeight: '1419.53 g/mol',
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 28 days.',
    short:
      'The most-researched gastric pentadecapeptide for tissue repair, tendon and gut-integrity studies. ≥99% purity, batch-verified COA with every vial.',
    description: [
      'BPC-157 is a synthetic pentadecapeptide derived from a protective protein found in human gastric juice. It has become one of the most extensively studied research peptides in the world, with a substantial body of preclinical literature examining its role in angiogenesis, tendon-to-bone healing, gastrointestinal integrity and systemic wound repair models.',
      'Noxptide BPC-157 is synthesised using solid-phase peptide synthesis (SPPS) and purified by preparative HPLC to ≥99% purity. Every production batch is independently verified by HPLC and mass spectrometry, and the batch-specific Certificate of Analysis is available to download before you order — because serious research demands verifiable quality.',
      'Supplied as a lyophilised powder in sterile, tamper-evident vials. Each order is dispatched from our UK facility in discreet, temperature-conscious packaging with tracked delivery as standard.',
    ],
    applications: [
      'Tendon, ligament and soft-tissue repair models',
      'Gastrointestinal integrity and mucosal research',
      'Angiogenesis and wound-healing pathways',
      'Inflammatory response modulation studies',
    ],
    references: [
      { title: 'BPC-157 and tendon-to-bone healing: preclinical evidence', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+tendon+healing' },
      { title: 'BPC-157 in gastrointestinal tract research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+gastrointestinal' },
    ],
    faqs: [
      {
        q: 'What purity is your BPC-157?',
        a: 'Every batch is independently verified to ≥99% purity by HPLC and mass spectrometry. The Certificate of Analysis for your specific batch is available on request and ships with your order.',
      },
      {
        q: 'How should BPC-157 be stored?',
        a: 'Lyophilised BPC-157 is stable at -20°C for long-term storage. Once reconstituted with bacteriostatic water, refrigerate at 2–8°C and use within 28 days.',
      },
      {
        q: 'Is BPC-157 legal to buy in the UK?',
        a: 'BPC-157 is sold strictly for laboratory research purposes only. It is not a medicine, not for human or veterinary use, and is supplied under our research-use-only terms.',
      },
    ],
    badge: 'Best Seller',
  },
  {
    slug: 'tb-500',
    rating: 4.8,
    reviews: 167,
    name: 'TB-500',
    subtitle: 'Thymosin Beta-4 fragment · 43 amino acid peptide',
    category: 'recovery-repair',
    price: 39.99,
    sizes: [
      { label: '5 mg', price: 39.99 },
      { label: '10 mg', price: 69.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '77591-33-4',
    formula: 'C212H350N56O78S',
    molecularWeight: '4963.49 g/mol',
    sequence: 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'Synthetic Thymosin Beta-4 for cell-migration, angiogenesis and tissue-regeneration research. Independently tested, COA supplied with every batch.',
    description: [
      'TB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring 43-amino-acid peptide that plays a central role in actin regulation, cell migration and tissue repair. It is one of the cornerstones of regenerative research and is frequently studied alongside BPC-157 in complementary repair models. All findings described here derive from preclinical research; TB-500 is supplied strictly for laboratory use and is not for human or veterinary use.',
      'Our TB-500 is produced by solid-phase synthesis, purified via preparative HPLC, and confirmed to ≥99% purity with full mass spectrometry characterisation. Batch-specific Certificates of Analysis ship with every order.',
      'Lyophilised for maximum stability and dispatched from the UK with tracked, discreet delivery and cold-chain options available on request.',
    ],
    applications: [
      'Cell migration and actin-binding research',
      'Angiogenesis and vascular repair models',
      'Cardiac and muscle tissue regeneration studies',
      'Anti-inflammatory pathway research',
    ],
    references: [
      { title: 'Thymosin Beta-4 in tissue repair and regeneration', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4+tissue+repair' },
      { title: 'Thymosin Beta-4 and angiogenesis research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta+4+angiogenesis' },
    ],
    faqs: [
      {
        q: 'What is the difference between TB-500 and Thymosin Beta-4?',
        a: 'TB-500 is the synthetic research analogue of the endogenous Thymosin Beta-4 peptide, containing the active region responsible for its biological activity in research models.',
      },
      {
        q: 'Can TB-500 be studied alongside BPC-157?',
        a: 'Many research programmes examine the two compounds in complementary models. We also supply both individually so laboratories can control their own protocols.',
      },
      {
        q: 'How is my order shipped?',
        a: 'All UK orders ship tracked with Royal Mail or DHL, in discreet tamper-evident packaging. Same-day dispatch on orders placed before 4pm, Monday–Friday.',
      },
    ],
  },
  {
    slug: 'ghk-cu',
    rating: 4.9,
    reviews: 143,
    name: 'GHK-Cu',
    subtitle: 'Copper Tripeptide-1 · Glycyl-L-Histidyl-L-Lysine',
    category: 'recovery-repair',
    price: 29.99,
    sizes: [
      { label: '50 mg', price: 29.99 },
      { label: '100 mg', price: 49.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '49557-75-7',
    formula: 'C14H24N6O4·Cu',
    molecularWeight: '403.9 g/mol',
    sequence: 'Gly-His-Lys (copper complex)',
    appearance: 'Blue lyophilised powder',
    storage: 'Store at -20°C protected from light. After reconstitution, refrigerate at 2–8°C.',
    short:
      'The definitive copper peptide for dermatological, extracellular-matrix and wound-healing research. Batch-verified ≥99% purity with COA.',
    description: [
      'GHK-Cu (Copper Tripeptide-1) is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. First isolated from human plasma, it has been the subject of four decades of research into skin remodelling, collagen synthesis, antioxidant defence and wound repair.',
      'Noxptide GHK-Cu is synthesised to ≥99% purity and independently verified by HPLC and MS. Its characteristic deep-blue colour confirms proper copper chelation — a simple visual marker of quality that cheaper, poorly chelated material fails to show.',
      'Supplied lyophilised in sterile vials with batch-specific Certificates of Analysis and full traceability.',
    ],
    applications: [
      'Collagen and extracellular-matrix synthesis research',
      'Dermal remodelling and wound-healing models',
      'Antioxidant and anti-inflammatory pathways',
      'Hair-follicle biology research',
    ],
    references: [
      { title: 'GHK-Cu and skin remodelling: four decades of research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+skin+remodeling' },
      { title: 'Copper peptides in wound-healing models', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=GHK+copper+peptide+wound+healing' },
    ],
    faqs: [
      {
        q: 'Why is GHK-Cu blue?',
        a: 'The blue colour comes from proper chelation of the copper ion to the GHK tripeptide. A vivid blue is a reliable visual indicator of a well-formed complex.',
      },
      {
        q: 'What documentation is included?',
        a: 'Every order includes a batch-specific Certificate of Analysis showing HPLC purity, mass spectrometry identity confirmation and physical appearance testing.',
      },
      {
        q: 'Is this for cosmetic formulation?',
        a: 'No. Our GHK-Cu is supplied strictly for in-vitro laboratory research and is not intended for cosmetic, human or veterinary use.',
      },
    ],
  },
  {
    slug: 'ipamorelin',
    rating: 4.8,
    reviews: 121,
    name: 'Ipamorelin',
    subtitle: 'Selective GHRP · Pentapeptide secretagogue',
    category: 'growth-hormone-secretagogues',
    price: 32.99,
    sizes: [
      { label: '5 mg', price: 32.99 },
      { label: '10 mg', price: 57.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '170851-70-4',
    formula: 'C38H49N9O5',
    molecularWeight: '711.86 g/mol',
    sequence: 'Aib-His-D-2-Nal-D-Phe-Lys-NH2',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The most selective growth-hormone-releasing peptide in research use, prized for its clean receptor profile. ≥99% purity, COA with every vial.',
    description: [
      'Ipamorelin is a pentapeptide growth hormone secretagogue renowned in the research literature for its selectivity: it stimulates growth hormone release via the ghrelin receptor (GHS-R1a) without the significant cortisol or prolactin activity observed with earlier GHRPs, making it a clean tool for endocrine research. The CJC-1295–Ipamorelin pairing is one of the most studied combinations in the field, with the GHRH analogue and the selective GHRP acting on complementary receptors. All findings described here derive from preclinical research; Ipamorelin is supplied strictly for laboratory use.',
      'Our Ipamorelin is synthesised by SPPS, purified by preparative HPLC to ≥99%, and every batch is confirmed by mass spectrometry. The batch Certificate of Analysis is available before purchase on request.',
      'Dispatched from our UK facility in discreet, tracked packaging with same-day dispatch before 4pm.',
    ],
    applications: [
      'Growth-hormone secretagogue receptor (GHS-R1a) research',
      'Pituitary signalling pathway studies',
      'Metabolic and body-composition models',
      'Comparative secretagogue selectivity research',
    ],
    references: [
      { title: 'Ipamorelin: a selective growth hormone secretagogue', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=ipamorelin+selective+growth+hormone+secretagogue' },
      { title: 'GHRP receptor (GHS-R1a) pharmacology', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=ghrelin+receptor+GHS-R1a+ipamorelin' },
    ],
    faqs: [
      {
        q: 'Why do researchers choose Ipamorelin over other GHRPs?',
        a: 'Ipamorelin shows the highest selectivity of the GHRP class in published research, with minimal off-target activity on cortisol and prolactin axes.',
      },
      {
        q: 'What is the shelf life?',
        a: 'Lyophilised Ipamorelin is stable for 24+ months at -20°C. Once reconstituted, refrigerate and use within 21 days.',
      },
      {
        q: 'Do you ship outside the UK?',
        a: 'Yes, we ship to most of Europe with tracked international delivery. Shipping times and options are listed on our shipping page.',
      },
    ],
  },
  {
    slug: 'cjc-1295-no-dac',
    rating: 4.7,
    reviews: 98,
    name: 'CJC-1295 (No DAC)',
    subtitle: 'Modified GRF 1-29 · GHRH analogue',
    category: 'growth-hormone-secretagogues',
    price: 36.99,
    sizes: [
      { label: '2 mg', price: 36.99 },
      { label: '5 mg', price: 64.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '863288-34-0',
    formula: 'C152H252N44O42',
    molecularWeight: '3367.9 g/mol',
    sequence: 'Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-NH2',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 14 days.',
    short:
      'The gold-standard GHRH analogue for pulsatile growth-hormone research. Modified GRF 1-29, ≥99% purity, fully documented with batch COA.',
    description: [
      'CJC-1295 without DAC (Drug Affinity Complex), also known as Modified GRF 1-29, is a tetrasubstituted analogue of growth-hormone-releasing hormone. The four amino-acid substitutions protect it from DPP-IV cleavage while preserving the short, physiologically pulsatile activity profile preferred in endocrine research.',
      'Each batch is synthesised, purified to ≥99% by preparative HPLC and identity-confirmed by mass spectrometry. Batch-specific Certificates of Analysis ship with every order.',
      'Frequently studied alongside selective secretagogues such as Ipamorelin in synergistic GHRH/GHRP research models.',
    ],
    applications: [
      'GHRH receptor signalling research',
      'Pulsatile growth-hormone release models',
      'Synergistic GHRH/GHRP studies',
      'Metabolic and endocrine pathway research',
    ],
    references: [
      { title: 'Modified GRF 1-29 and pulsatile GH release', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=modified+GRF+1-29+growth+hormone' },
      { title: 'CJC-1295 pharmacokinetics in research models', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=CJC-1295+pharmacokinetics' },
    ],
    faqs: [
      {
        q: 'What does "No DAC" mean?',
        a: 'DAC (Drug Affinity Complex) is a modification that extends half-life dramatically. The No-DAC version retains the short, pulsatile profile most research protocols require.',
      },
      {
        q: 'Is this the same as Modified GRF 1-29?',
        a: 'Yes — CJC-1295 (No DAC) and Modified GRF 1-29 refer to the same tetrasubstituted 29-amino-acid GHRH analogue.',
      },
      {
        q: 'CJC-1295 vs Ipamorelin — how do they compare?',
        a: 'CJC-1295 acts at the GHRH receptor while Ipamorelin acts at GHS-R1a, so the Ipamorelin vs CJC-1295 comparison is really one of complementary mechanisms; most protocols in the literature run the two together rather than choosing between them.',
      },
      {
        q: 'How is purity verified?',
        a: 'By independent HPLC (purity) and mass spectrometry (identity), with the results published on the batch Certificate of Analysis supplied with your order.',
      },
    ],
  },
  {
    slug: 'tesamorelin',
    rating: 4.8,
    reviews: 64,
    name: 'Tesamorelin',
    subtitle: 'Stabilised GHRH (1-44) analogue',
    category: 'growth-hormone-secretagogues',
    price: 44.99,
    sizes: [
      { label: '2 mg', price: 44.99 },
      { label: '5 mg', price: 89.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '218949-48-5',
    formula: 'C221H366N72O67S',
    molecularWeight: '5135.9 g/mol',
    sequence: 'Hexenoyl-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln-Gln-Gly-Glu-Ser-Asn-Gln-Glu-Arg-Gly-Ala-Arg-Ala-Arg-Leu-NH2',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 14 days.',
    short:
      'The most clinically documented GHRH analogue in existence, supplied research-grade at ≥99% purity with full analytical documentation.',
    description: [
      'Tesamorelin is a stabilised synthetic analogue of human growth-hormone-releasing hormone comprising the full 44-amino-acid GHRH sequence with an N-terminal hexenoyl modification that resists enzymatic degradation. It is among the most extensively documented peptides in the endocrine research literature.',
      'Our Tesamorelin is produced to ≥99% purity, independently verified by HPLC and MS, and supplied lyophilised with a batch-specific Certificate of Analysis.',
      'A premium compound for metabolic and endocrine research programmes that demand the highest documentation standards.',
    ],
    applications: [
      'GHRH receptor pharmacology research',
      'Visceral adipose tissue and metabolic models',
      'Endocrine axis regulation studies',
      'Lipodystrophy research models',
    ],
    references: [
      { title: 'Tesamorelin: clinical evidence in endocrine research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=tesamorelin+clinical+trial' },
      { title: 'GHRH analogues and visceral adipose research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=tesamorelin+visceral+adipose' },
    ],
    faqs: [
      {
        q: 'What makes Tesamorelin different from CJC-1295?',
        a: 'Tesamorelin contains the full 44-amino-acid GHRH sequence with a hexenoyl stabilising group, whereas CJC-1295 is based on the shorter GRF 1-29 fragment.',
      },
      {
        q: 'What documentation do I receive?',
        a: 'A batch-specific Certificate of Analysis with HPLC purity trace, mass spectrometry identity confirmation, and appearance testing.',
      },
      {
        q: 'How should it be reconstituted?',
        a: 'With bacteriostatic water under sterile laboratory conditions, then refrigerated at 2–8°C and used within 14 days.',
      },
    ],
  },
  {
    slug: 'semax',
    rating: 4.8,
    reviews: 87,
    name: 'Semax',
    subtitle: 'ACTH (4-10) analogue · Heptapeptide',
    category: 'cognitive-neuropeptides',
    price: 37.99,
    sizes: [
      { label: '5 mg', price: 37.99 },
      { label: '10 mg', price: 67.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '80714-61-0',
    formula: 'C37H51N9O10S',
    molecularWeight: '813.9 g/mol',
    sequence: 'Met-Glu-His-Phe-Pro-Gly-Pro',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C protected from light. After reconstitution, refrigerate at 2–8°C.',
    short:
      'The benchmark nootropic research peptide — an ACTH(4-10) analogue with decades of CNS literature. ≥99% purity, COA supplied with every batch.',
    description: [
      'Semax is a synthetic heptapeptide based on the ACTH(4-10) fragment, extended with a C-terminal Pro-Gly-Pro sequence for stability. Developed through decades of neuroscience research, it is one of the most studied peptides in cognitive and neuroprotective research models.',
      'Noxptide Semax is synthesised to ≥99% purity, verified by independent HPLC and mass spectrometry, and supplied with a batch-specific Certificate of Analysis.',
      'Lyophilised and light-protected for stability, dispatched from the UK with tracked delivery.',
    ],
    applications: [
      'Neuroprotection and ischemia research models',
      'BDNF and neurotrophin pathway studies',
      'Cognitive performance and attention research',
      'Melanocortin receptor CNS research',
    ],
    references: [
      { title: 'Semax in neuroprotection research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=semax+neuroprotection' },
      { title: 'Semax and neurotrophin (BDNF) pathways', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=semax+BDNF' },
    ],
    faqs: [
      {
        q: 'What research areas is Semax used in?',
        a: 'Published literature covers neuroprotection, neurotrophin expression, cognitive models and CNS melanocortin signalling.',
      },
      {
        q: 'Is Semax light-sensitive?',
        a: 'Yes — we recommend storing the lyophilised powder protected from light at -20°C, and our packaging reflects this.',
      },
      {
        q: 'How quickly do you dispatch?',
        a: 'Orders placed before 4pm Monday–Friday are dispatched the same day, tracked.',
      },
    ],
  },
  {
    slug: 'selank',
    rating: 4.7,
    reviews: 72,
    name: 'Selank',
    subtitle: 'Tuftsin analogue · Heptapeptide',
    category: 'cognitive-neuropeptides',
    price: 36.99,
    sizes: [
      { label: '5 mg', price: 36.99 },
      { label: '10 mg', price: 64.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '129954-34-3',
    formula: 'C33H57N11O9',
    molecularWeight: '751.9 g/mol',
    sequence: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The anxiolytic-class tuftsin analogue for neuroimmune and CNS research. Independently verified ≥99% purity with full COA documentation.',
    description: [
      'Selank is a synthetic heptapeptide analogue of the immunomodulatory tetrapeptide tuftsin, extended with a Pro-Gly-Pro tail for metabolic stability. It occupies a unique position in the research literature at the intersection of neuroimmune signalling and CNS regulation.',
      'Our Selank is synthesised to ≥99% purity and independently verified by HPLC and MS. Every batch ships with its Certificate of Analysis.',
      'Supplied lyophilised in sterile, tamper-evident vials with tracked UK delivery as standard.',
    ],
    applications: [
      'Neuroimmune signalling research',
      'GABAergic system regulation studies',
      'Stress-response and anxiolytic-class models',
      'Enkephalin metabolism research',
    ],
    references: [
      { title: 'Selank and GABAergic regulation research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=selank+GABA' },
      { title: 'Tuftsin analogues in neuroimmune studies', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=selank+tuftsin+analogue' },
    ],
    faqs: [
      {
        q: 'What is Selank derived from?',
        a: 'Selank is a synthetic analogue of tuftsin, a naturally occurring immunomodulatory tetrapeptide, stabilised with a Pro-Gly-Pro extension.',
      },
      {
        q: 'Can Semax and Selank be studied together?',
        a: 'They are frequently examined in parallel in research programmes due to their complementary mechanisms documented in the literature.',
      },
      {
        q: 'Is a COA provided?',
        a: 'Yes — every batch is independently HPLC and MS verified, and the batch-specific COA is supplied with your order.',
      },
    ],
  },
  {
    slug: 'epitalon',
    rating: 4.9,
    reviews: 58,
    name: 'Epitalon',
    subtitle: 'Epithalon · Tetrapeptide (Ala-Glu-Asp-Gly)',
    category: 'cognitive-neuropeptides',
    price: 42.99,
    sizes: [
      { label: '10 mg', price: 42.99 },
      { label: '20 mg', price: 74.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '307297-39-8',
    formula: 'C14H22N4O9',
    molecularWeight: '390.35 g/mol',
    sequence: 'Ala-Glu-Asp-Gly',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The telomerase-pathway tetrapeptide for ageing and pineal research. ≥99% purity, independently batch-tested, COA with every order.',
    description: [
      'Epitalon (also spelled Epithalon) is a synthetic tetrapeptide based on epithalamin, a peptide preparation derived from the pineal gland. It is one of the most discussed compounds in gerontology research, with literature examining telomerase activation and circadian regulation models.',
      'Noxptide Epitalon is synthesised to ≥99% purity and independently verified by HPLC and mass spectrometry. Batch-specific Certificates of Analysis ship with every order.',
      'Supplied lyophilised in sterile vials, dispatched tracked from our UK facility.',
    ],
    applications: [
      'Telomerase activation pathway research',
      'Pineal gland and circadian regulation models',
      'Cellular ageing and senescence studies',
      'Melatonin axis research',
    ],
    references: [
      { title: 'Epitalon and telomerase activation research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=epithalon+telomerase' },
      { title: 'Pineal peptides in ageing research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=epithalamin+pineal+peptide+aging' },
    ],
    faqs: [
      {
        q: 'What is the difference between Epitalon and Epithalon?',
        a: 'They are two spellings of the same Ala-Glu-Asp-Gly tetrapeptide. Our product is the synthetic tetrapeptide itself, not a pineal extract.',
      },
      {
        q: 'What purity do you guarantee?',
        a: '≥99% by HPLC on every batch, confirmed by mass spectrometry, documented on the supplied Certificate of Analysis.',
      },
      {
        q: 'How is it supplied?',
        a: 'As a lyophilised powder in sterile tamper-evident vials, with tracked UK delivery.',
      },
    ],
  },
  {
    slug: 'aod-9604',
    rating: 4.7,
    reviews: 81,
    name: 'AOD-9604',
    subtitle: 'Modified hGH fragment 176-191',
    category: 'metabolic-pigmentation',
    price: 31.99,
    sizes: [
      { label: '2 mg', price: 31.99 },
      { label: '5 mg', price: 54.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '221231-10-3',
    formula: 'C78H123N23O23S2',
    molecularWeight: '1815.1 g/mol',
    sequence: 'Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The lipolytic hGH fragment for metabolic research — the C-terminal region of growth hormone without the growth activity. COA-verified ≥99%.',
    description: [
      'AOD-9604 is a modified fragment of human growth hormone (residues 176-191) developed to isolate the lipolytic region of the molecule. In the research literature it is studied for fat-metabolism pathways without the proliferative activity of full-length growth hormone.',
      'Our AOD-9604 is synthesised to ≥99% purity, independently verified by HPLC and MS, and supplied with a batch-specific Certificate of Analysis.',
      'Lyophilised for stability and dispatched from the UK with tracked, discreet delivery.',
    ],
    applications: [
      'Lipolysis and fat-metabolism pathway research',
      'Metabolic regulation models',
      'hGH fragment pharmacology studies',
      'Cartilage and joint research models',
    ],
    references: [
      { title: 'AOD-9604 and lipolytic pathway research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=AOD9604+lipolysis' },
      { title: 'hGH fragment 176-191 pharmacology', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+fragment+176-191' },
    ],
    faqs: [
      {
        q: 'Does AOD-9604 have growth activity?',
        a: 'In the published research literature, the 176-191 fragment is studied specifically because it retains lipolytic activity without the growth-promoting effects of full-length hGH.',
      },
      {
        q: 'What testing is performed?',
        a: 'Independent HPLC purity analysis and mass spectrometry identity confirmation on every batch, documented on your COA.',
      },
      {
        q: 'How fast is UK delivery?',
        a: 'Tracked next-working-day delivery is available; standard tracked delivery is 1–2 working days.',
      },
    ],
  },
  {
    slug: 'melanotan-2',
    rating: 4.8,
    reviews: 156,
    name: 'Melanotan II',
    subtitle: 'MT-2 · Cyclic melanocortin heptapeptide',
    category: 'metabolic-pigmentation',
    price: 28.99,
    sizes: [
      { label: '10 mg', price: 28.99 },
      { label: '20 mg', price: 49.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '121062-08-6',
    formula: 'C50H69N15O9',
    molecularWeight: '1024.2 g/mol',
    sequence: 'Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C protected from light. After reconstitution, refrigerate at 2–8°C.',
    short:
      'The reference melanocortin receptor agonist for pigmentation and MC-receptor research. ≥99% purity, COA supplied with every batch.',
    description: [
      'Melanotan II (MT-2) is a synthetic cyclic heptapeptide analogue of alpha-melanocyte-stimulating hormone (α-MSH) and one of the most widely used reference compounds in melanocortin receptor research, with activity documented across MC1R through MC5R subtypes.',
      'Noxptide Melanotan II is synthesised to ≥99% purity, independently verified by HPLC and mass spectrometry, and shipped with a batch-specific Certificate of Analysis.',
      'Light-protected, lyophilised and dispatched tracked from our UK facility.',
    ],
    applications: [
      'Melanocortin receptor (MC1R–MC5R) research',
      'Melanogenesis and pigmentation pathway studies',
      'Appetite and energy-homeostasis research',
      'Sexual-function receptor pharmacology models',
    ],
    references: [
      { title: 'Melanotan II and melanocortin receptor research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=melanotan+II+melanocortin+receptor' },
      { title: 'α-MSH analogues in pigmentation studies', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=alpha-MSH+analogue+melanogenesis' },
    ],
    faqs: [
      {
        q: 'What receptor subtypes does MT-2 act on in research?',
        a: 'The literature documents activity across the melanocortin receptor family (MC1R–MC5R), which is why it is used as a broad reference agonist.',
      },
      {
        q: 'How should it be stored?',
        a: 'Lyophilised at -20°C, protected from light. After reconstitution, refrigerate at 2–8°C.',
      },
      {
        q: 'Is a Certificate of Analysis included?',
        a: 'Yes — every batch is HPLC and MS verified and ships with its batch-specific COA.',
      },
    ],
  },
  {
    slug: 'pt-141',
    rating: 4.8,
    reviews: 93,
    name: 'PT-141',
    subtitle: 'Bremelanotide · Melanocortin MC4R agonist',
    category: 'metabolic-pigmentation',
    price: 33.99,
    sizes: [
      { label: '10 mg', price: 33.99 },
      { label: '20 mg', price: 58.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '189691-06-3',
    formula: 'C50H68N14O10',
    molecularWeight: '1025.2 g/mol',
    sequence: 'Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'Bremelanotide — the MC4R-preferring melanocortin for CNS and sexual-function receptor research. ≥99% purity with full COA documentation.',
    description: [
      'PT-141 (Bremelanotide) is a metabolite-derived melanocortin peptide closely related to Melanotan II but with a free C-terminal carboxyl group, shifting its research profile toward MC4R-mediated central nervous system pathways. It is one of the most clinically documented melanocortin peptides in existence.',
      'Our PT-141 is synthesised to ≥99% purity, independently verified by HPLC and MS, and supplied with a batch-specific Certificate of Analysis.',
      'Supplied lyophilised in sterile, tamper-evident vials with tracked UK delivery.',
    ],
    applications: [
      'MC4R receptor pharmacology research',
      'CNS melanocortin signalling studies',
      'Sexual-function pathway research models',
      'Comparative melanocortin analogue studies',
    ],
    references: [
      { title: 'Bremelanotide (PT-141): clinical research overview', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=bremelanotide+clinical' },
      { title: 'MC4R signalling in CNS research', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=melanocortin-4+receptor+PT-141' },
    ],
    faqs: [
      {
        q: 'How does PT-141 differ from Melanotan II?',
        a: 'PT-141 is the carboxylic-acid form of the same cyclic core, which the literature associates with a more CNS-focused receptor profile via MC4R.',
      },
      {
        q: 'What purity is supplied?',
        a: '≥99% by HPLC, confirmed by mass spectrometry, with the batch COA included in every order.',
      },
      {
        q: 'Is this for human use?',
        a: 'No. All Noxptide products are supplied strictly for laboratory research purposes only.',
      },
    ],
  },
]

import { extraProducts } from './extra-products'
import { extraProducts2 } from './extra-products-2'
products.push(...extraProducts)
products.push(...extraProducts2)

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug)

export const formatGBP = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)
