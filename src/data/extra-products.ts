import type { Product } from './products'

export const extraProducts: Product[] = [
  {
    slug: 'sermorelin',
    name: 'Sermorelin',
    subtitle: 'GHRH (1-29) · Growth-hormone-releasing hormone fragment',
    category: 'growth-hormone-secretagogues',
    rating: 4.8,
    reviews: 76,
    price: 34.99,
    sizes: [
      { label: '2 mg', price: 34.99 },
      { label: '5 mg', price: 62.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '86168-78-7',
    formula: 'C149H246N44O42S',
    molecularWeight: '3357.96 g/mol',
    sequence: 'Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH2',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 14 days.',
    short:
      'The minimal active fragment of human GHRH — the reference standard for hypothalamic–pituitary signalling research. ≥99% purity, COA with every batch.',
    description: [
      'The Sermorelin peptide comprises the first 29 amino acids of endogenous growth-hormone-releasing hormone — the smallest fragment retaining full biological activity at the GHRH receptor. Decades of endocrine literature use it as the reference tool for studying hypothalamic–pituitary signalling and pulsatile hormone regulation. All findings described here derive from preclinical and clinical literature; the material supplied here is strictly for laboratory research use.',
      'Noxptide Sermorelin is synthesised by SPPS, purified to ≥99% by preparative HPLC, and identity-confirmed by mass spectrometry against its theoretical 3357.96 g/mol. Every batch ships with its Certificate of Analysis.',
      'Sermorelin storage is lyophilised at -20°C; Sermorelin reconstitution uses bacteriostatic water under sterile conditions, followed by refrigeration at 2–8°C and use within 14 days. The Sermorelin peptide UK laboratories use as their GHRH reference is available in Sermorelin 2 mg and Sermorelin 5 mg vials, supplied lyophilised in sterile, tamper-evident packaging and dispatched tracked from our UK facility — for research use only.',
    ],
    applications: [
      'GHRH receptor binding and signalling research',
      'Hypothalamic–pituitary axis regulation studies',
      'Truncated vs full-length GHRH comparative research',
      'Neuroendocrine reference standard applications',
    ],
    faqs: [
      {
        q: 'Is Sermorelin the same as GHRH?',
        a: 'Sermorelin is the biologically active 1-29 fragment of the full 44-amino-acid GHRH molecule, and is the most widely used GHRH-class tool compound in the research literature.',
      },
      {
        q: 'How does Sermorelin compare to CJC-1295 (No DAC)?',
        a: 'Both target the GHRH receptor. CJC-1295 (No DAC) carries four substitutions that resist DPP-IV degradation; Sermorelin is the native sequence fragment, useful as the reference standard. In CJC-1295/Ipamorelin vs Sermorelin designs, the literature generally positions the secretagogue pairing as the synergistic option and Sermorelin as the native-sequence comparator.',
      },
      {
        q: 'What purity is supplied?',
        a: '≥99% by independent HPLC with MS identity confirmation, documented on the batch COA included with every order.',
      },
    ],
    references: [
      { title: 'Sermorelin and GHRH research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sermorelin+GHRH' },
      { title: 'GHRH receptor biology literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+releasing+hormone+receptor' },
    ],
  },
  {
    slug: 'mots-c',
    name: 'MOTS-c',
    subtitle: 'Mitochondrial-derived peptide · 16 amino acids',
    category: 'metabolic-pigmentation',
    rating: 4.8,
    reviews: 69,
    price: 42.99,
    sizes: [
      { label: '10 mg', price: 42.99 },
      { label: '20 mg', price: 74.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '1627580-64-6',
    formula: 'C101H152N28O22S2',
    molecularWeight: '2174.6 g/mol',
    sequence: 'Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The mitochondrial-encoded peptide at the centre of metabolic and exercise-mimetic research. ≥99% purity, batch-verified, COA included.',
    description: [
      'MOTS-c is a 16-amino-acid peptide encoded within the mitochondrial 12S rRNA gene — part of a recently discovered class of mitochondrial-derived peptides that has reshaped how researchers think about mitochondrial–nuclear signalling. The literature concentrates on metabolic regulation, insulin sensitivity pathways and exercise-mimetic models. All findings described here derive from preclinical research; MOTS-c is supplied strictly for laboratory use.',
      'Because MOTS-c sits at the frontier of metabolic research, batch quality matters doubly: our material is independently verified to ≥99% purity by HPLC with MS identity confirmation, and every order ships with a batch-specific COA.',
      'Lyophilised, sterile-vialed and dispatched tracked from the UK with same-day dispatch before 4pm. MOTS-c for sale here is research-grade material in MOTS-c 10 mg and 20 mg vials, each with a batch-specific COA — supplied strictly for laboratory research use.',
    ],
    applications: [
      'Mitochondrial–nuclear signalling research',
      'Metabolic regulation and insulin-sensitivity models',
      'Exercise-mimetic pathway studies',
      'AMPK pathway research',
    ],
    faqs: [
      {
        q: 'What makes MOTS-c unusual among research peptides?',
        a: 'It is encoded by mitochondrial DNA rather than nuclear DNA, placing it in the emerging class of mitochondrial-derived peptides studied for their role in cellular energy signalling.',
      },
      {
        q: 'How should MOTS-c be stored?',
        a: 'Lyophilised at -20°C; after reconstitution refrigerate at 2–8°C and use within 21 days.',
      },
      {
        q: 'Is a COA provided?',
        a: 'Yes — every batch is independently HPLC and MS verified and ships with its batch-specific Certificate of Analysis.',
      },
    ],
    references: [
      { title: 'MOTS-c research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=MOTS-c' },
      { title: 'Mitochondrial-derived peptides literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=mitochondrial+derived+peptide+metabolism' },
    ],
  },
  {
    slug: 'cagrilintide',
    name: 'Cagrilintide',
    subtitle: 'Amylin analogue · Long-acting amylin receptor agonist',
    category: 'metabolic-pigmentation',
    rating: 4.7,
    reviews: 54,
    price: 39.99,
    sizes: [
      { label: '5 mg', price: 39.99 },
      { label: '10 mg', price: 69.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '1415456-99-3',
    formula: 'C194H312N54O59S2',
    molecularWeight: '4410.0 g/mol',
    sequence: 'Lys-Cys-Asn-Thr-Ala-Thr-Cys-Ala-Thr-Gln-Arg-Leu-Ala-Asn-Phe-Leu-Val-His-Ser-Ser-Asn-Asn-Phe-Gly-Ala-Ile-Leu-Ser-Ser-Thr-Asn-Val-Gly-Ser-Asn-Thr-Tyr-NH2 (lipidated)',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 14 days.',
    short:
      'The lipidated amylin analogue driving the next wave of appetite-regulation research. ≥99% purity with full batch COA documentation.',
    description: [
      'Cagrilintide is a long-acting amylin analogue engineered with a fatty-acid side chain for extended receptor exposure. Amylin-pathway research has expanded rapidly as laboratories investigate complementary appetite-regulation mechanisms beyond the incretin axis, and cagrilintide is the field\'s reference compound, frequently examined alongside semaglutide-class incretin compounds in comparative appetite-regulation research. All findings described here derive from preclinical and clinical literature; the material supplied here is strictly for laboratory research use.',
      'As a large, lipidated peptide, cagrilintide demands exacting synthesis and purification. Our material is independently verified to ≥99% purity by HPLC with mass spectrometry identity confirmation, and ships with a batch-specific Certificate of Analysis.',
      'Supplied lyophilised in sterile vials, dispatched tracked from our UK facility. As a UK peptide supplier and peptide shop focused on research peptides, UK metabolic-research laboratories receive batch-verified cagrilintide in 5 mg and 10 mg vials, for research use only.',
    ],
    applications: [
      'Amylin receptor pharmacology research',
      'Appetite-regulation and satiety pathway studies',
      'Comparative incretin/amylin axis research',
      'Metabolic homeostasis models',
    ],
    faqs: [
      {
        q: 'What is cagrilintide?',
        a: 'A long-acting, lipidated analogue of the hormone amylin used in metabolic research on amylin receptor signalling and appetite-regulation pathways. Supplied for research use only.',
      },
      {
        q: 'How does cagrilintide differ from GLP-1 class compounds?',
        a: 'It acts through the amylin receptor system rather than incretin receptors — a mechanistically distinct appetite-regulation pathway examined in complementary research designs.',
      },
      {
        q: 'How is purity verified?',
        a: 'By independent HPLC (≥99%) and mass spectrometry identity confirmation, documented on the batch COA supplied with your order.',
      },
    ],
    references: [
      { title: 'Cagrilintide research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=cagrilintide' },
      { title: 'Amylin analogue research literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=amylin+analogue+appetite' },
    ],
  },
  {
    slug: 'nad-plus',
    name: 'NAD+',
    subtitle: 'Nicotinamide Adenine Dinucleotide · Coenzyme',
    category: 'cognitive-neuropeptides',
    rating: 4.9,
    reviews: 112,
    price: 44.99,
    sizes: [
      { label: '500 mg', price: 44.99 },
      { label: '1000 mg', price: 79.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '53-84-9',
    formula: 'C21H27N7O14P2',
    molecularWeight: '663.4 g/mol',
    sequence: 'Non-peptide coenzyme (dinucleotide)',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C protected from light. After reconstitution, refrigerate at 2–8°C and use promptly.',
    short:
      'The essential redox coenzyme for cellular-energy and sirtuin-pathway research. ≥99% purity, light-protected, COA with every batch.',
    description: [
      'NAD+ (Nicotinamide Adenine Dinucleotide) is the universal redox coenzyme at the heart of cellular energy metabolism — and one of the most active areas of ageing and mitochondrial research. Laboratories use it in studies of sirtuin signalling, PARP activity and NAD+-decline models.',
      'NAD+ degrades readily with heat, light and moisture, which makes sourcing discipline critical. Noxptide NAD+ is independently verified to ≥99% purity, lyophilised, light-protected, and shipped with a batch-specific Certificate of Analysis.',
      'Dispatched tracked from our UK facility with cold-pack options available on request. As a UK peptide supplier and peptide shop stocking research peptides, UK laboratories receive batch-verified NAD+ in 500 mg and 1000 mg vials, for research use only. All findings described here derive from preclinical research.',
    ],
    applications: [
      'Cellular energy and redox metabolism research',
      'Sirtuin and longevity-pathway studies',
      'Mitochondrial function models',
      'PARP and DNA-repair pathway research',
    ],
    faqs: [
      {
        q: 'Is NAD+ a peptide?',
        a: 'No — NAD+ is a dinucleotide coenzyme, supplied here as a high-purity research compound alongside our peptide catalogue, to the same documentation standard.',
      },
      {
        q: 'Is this an NAD Plus supplement?',
        a: 'No. Although "NAD Plus supplement" is a common search, this listing is a research-grade compound supplied strictly for laboratory use — not a dietary supplement and not for human use.',
      },
      {
        q: 'Why does NAD+ need careful handling?',
        a: 'NAD+ is sensitive to heat, light and moisture. Store lyophilised at -20°C protected from light and use reconstituted solutions promptly.',
      },
      {
        q: 'What purity is supplied?',
        a: '≥99% by independent HPLC with identity confirmation, documented on the batch COA included with every order.',
      },
    ],
    badge: 'Popular',
    references: [
      { title: 'NAD+ metabolism research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=NAD%2B+metabolism+sirtuin' },
      { title: 'NAD+ decline and ageing literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=NAD+decline+aging' },
    ],
  },
  {
    slug: 'glutathione',
    name: 'L-Glutathione',
    subtitle: 'Reduced Glutathione · γ-Glu-Cys-Gly tripeptide',
    category: 'cognitive-neuropeptides',
    rating: 4.8,
    reviews: 88,
    price: 29.99,
    sizes: [
      { label: '600 mg', price: 29.99 },
      { label: '1200 mg', price: 49.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '70-18-8',
    formula: 'C10H17N3O6S',
    molecularWeight: '307.3 g/mol',
    sequence: 'γ-Glu-Cys-Gly (reduced)',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 14 days.',
    short:
      'The master antioxidant tripeptide for oxidative-stress and redox-biology research. ≥99% purity, independently verified, COA included.',
    description: [
      'Reduced L-Glutathione is the cell\'s primary endogenous antioxidant — the glutathione peptide is a tripeptide (γ-Glu-Cys-Gly) central to redox homeostasis, detoxification pathways and oxidative-stress research across cell biology. This glutathione tripeptide is supplied strictly for laboratory research; all findings described here derive from preclinical research.',
      'Glutathione oxidises readily, so purity and handling determine whether your assay measures the reduced form or its disulphide. Our material is independently verified to ≥99% purity by HPLC and ships with a batch-specific COA.',
      'Supplied lyophilised in sterile, tamper-evident vials with tracked UK delivery. As a UK peptide supplier and peptide shop for research peptides, UK cell-biology laboratories receive batch-verified material in 600 mg and 1200 mg vials, for research use only.',
    ],
    applications: [
      'Oxidative-stress and redox-biology research',
      'Detoxification pathway (GST/GPx) studies',
      'Cellular antioxidant defence models',
      'Ferroptosis and cell-death pathway research',
    ],
    faqs: [
      {
        q: 'Is this reduced or oxidised glutathione?',
        a: 'This is reduced L-Glutathione (GSH), the biologically active antioxidant form examined in the redox literature.',
      },
      {
        q: 'How should it be handled?',
        a: 'GSH oxidises on exposure to air and warm aqueous conditions. Store lyophilised at -20°C, reconstitute fresh, and use within 14 days refrigerated.',
      },
      {
        q: 'Is a COA included?',
        a: 'Yes — every batch ships with its batch-specific Certificate of Analysis showing ≥99% HPLC purity.',
      },
    ],
    references: [
      { title: 'Glutathione redox research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=glutathione+oxidative+stress' },
      { title: 'Glutathione in cell biology literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=glutathione+redox+homeostasis' },
    ],
  },
  {
    slug: 'kpv',
    name: 'KPV',
    subtitle: 'α-MSH (11-13) · Tripeptide Lys-Pro-Val',
    category: 'recovery-repair',
    rating: 4.7,
    reviews: 47,
    price: 33.99,
    sizes: [
      { label: '10 mg', price: 33.99 },
      { label: '20 mg', price: 58.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '67727-97-3',
    formula: 'C16H30N4O4',
    molecularWeight: '342.4 g/mol',
    sequence: 'Lys-Pro-Val',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The minimal anti-inflammatory fragment of α-MSH for immune-modulation research. ≥99% purity, batch COA with every order.',
    description: [
      'KPV (Lys-Pro-Val) is the C-terminal tripeptide of alpha-melanocyte-stimulating hormone — the smallest fragment retaining the parent hormone\'s anti-inflammatory activity in research models, without its melanocortin pigmentation effects. That separation makes KPV a clean tool for immune-modulation research. The BPC–KPV pairing is also well established in the literature, with many gut-integrity research programmes studying BPC-157 and KPV in complementary models. All findings described here derive from preclinical research; KPV is supplied strictly for laboratory use.',
      'Published work examines KPV in intestinal inflammation models, NF-κB pathway regulation and epithelial barrier research. Our KPV is independently verified to ≥99% purity by HPLC and MS, and ships with a batch-specific Certificate of Analysis.',
      'Supplied lyophilised, sterile-vialed and dispatched tracked from the UK. For laboratories looking to buy the KPV peptide, UK research institutions can choose 10 mg and 20 mg vials, each with a batch-specific COA — supplied strictly for laboratory research use.',
    ],
    applications: [
      'Inflammatory pathway (NF-κB) research',
      'Intestinal inflammation and barrier models',
      'Immune-modulation signalling studies',
      'Comparative α-MSH fragment research',
    ],
    faqs: [
      {
        q: 'What is KPV?',
        a: 'KPV is the Lys-Pro-Val tripeptide fragment of α-MSH, studied in the literature for anti-inflammatory signalling without melanocortin pigmentation activity. Supplied for research use only.',
      },
      {
        q: 'How does KPV relate to Melanotan peptides?',
        a: 'All derive from α-MSH biology, but KPV is the minimal C-terminal fragment examined for immune-modulation pathways rather than melanocortin receptor agonism.',
      },
      {
        q: 'What documentation is included?',
        a: 'A batch-specific COA with ≥99% HPLC purity and MS identity confirmation ships with every order.',
      },
    ],
    references: [
      { title: 'KPV peptide research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=KPV+tripeptide+inflammation' },
      { title: 'α-MSH fragments in inflammation literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=alpha-MSH+C-terminal+anti-inflammatory' },
    ],
  },
  {
    slug: 'dsip',
    name: 'DSIP',
    subtitle: 'Delta Sleep-Inducing Peptide · Nonapeptide',
    category: 'cognitive-neuropeptides',
    rating: 4.6,
    reviews: 38,
    price: 36.99,
    sizes: [
      { label: '5 mg', price: 36.99 },
      { label: '10 mg', price: 64.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '62568-57-4',
    formula: 'C35H48N10O15',
    molecularWeight: '848.8 g/mol',
    sequence: 'Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The classic neuropeptide for sleep-regulation and stress-axis research since 1977. ≥99% purity, independently batch-verified.',
    description: [
      'DSIP (Delta Sleep-Inducing Peptide) is a nonapeptide first isolated in 1977 during research into sleep-regulating factors. Its literature spans sleep-architecture models, HPA-axis (stress) regulation and neuroendocrine signalling, making the DSIP peptide one of the longest-studied neuropeptides in the catalogue. All findings described here derive from preclinical research; DSIP is supplied strictly for laboratory use and is not for human or veterinary use.',
      'Noxptide DSIP is synthesised to ≥99% purity, independently verified by HPLC and mass spectrometry, and supplied with a batch-specific Certificate of Analysis.',
      'Lyophilised, sterile-vialed and dispatched tracked from our UK facility. As a UK peptide supplier of research peptides, UK neuroscience laboratories can choose DSIP 5 mg and 10 mg vials, each with a batch-specific COA, for research use only.',
    ],
    applications: [
      'Sleep-regulation and circadian research models',
      'HPA-axis and stress-response studies',
      'Neuroendocrine signalling research',
      'Comparative neuropeptide pharmacology',
    ],
    faqs: [
      {
        q: 'What is DSIP used for in research?',
        a: 'Published research examines DSIP in sleep-regulation, stress-axis and neuroendocrine models. It is supplied strictly for laboratory research use only.',
      },
      {
        q: 'How long has DSIP been studied?',
        a: 'Since 1977 — it is one of the longest-documented neuropeptides in the sleep-research literature.',
      },
      {
        q: 'How is it supplied?',
        a: 'Lyophilised at ≥99% purity with a batch-specific COA, in sterile tamper-evident vials with tracked UK delivery.',
      },
    ],
    references: [
      { title: 'DSIP research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=delta+sleep-inducing+peptide' },
    ],
  },
  {
    slug: 'hexarelin',
    name: 'Hexarelin',
    subtitle: 'Examorelin · Hexapeptide GHRP',
    category: 'growth-hormone-secretagogues',
    rating: 4.7,
    reviews: 43,
    price: 35.99,
    sizes: [
      { label: '2 mg', price: 35.99 },
      { label: '5 mg', price: 64.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '140703-51-1',
    formula: 'C47H58N12O6',
    molecularWeight: '887.0 g/mol',
    sequence: 'His-D-2-Me-Trp-Ala-Trp-D-Phe-Lys-NH2',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 21 days.',
    short:
      'The high-potency GHRP for secretagogue-receptor and cardioprotection research. ≥99% purity, COA supplied with every batch.',
    description: [
      'Hexarelin (Examorelin) is a synthetic hexapeptide growth hormone secretagogue — among the most potent of the GHRP class at the ghrelin receptor (GHS-R1a) in published research, with an additional literature strand examining CD36-mediated cardiac pathways. All findings described here derive from preclinical research; Hexarelin is supplied strictly for laboratory use.',
      'Our Hexarelin is synthesised to ≥99% purity and independently verified by HPLC and mass spectrometry. Every order ships with a batch-specific Certificate of Analysis.',
      'Supplied lyophilised in sterile, tamper-evident vials with tracked UK delivery. As a UK peptide supplier and peptide shop specialising in research peptides, UK endocrine laboratories receive batch-verified Hexarelin in 2 mg and 5 mg vials, for research use only.',
    ],
    applications: [
      'GHS-R1a receptor pharmacology research',
      'Comparative GHRP-class potency studies',
      'CD36-mediated cardiac pathway research',
      'Neuroendocrine signalling models',
    ],
    faqs: [
      {
        q: 'How does Hexarelin compare to Ipamorelin?',
        a: 'Both are GHRP-class compounds at GHS-R1a. The literature characterises Hexarelin as higher-potency, while Ipamorelin is the most selective — they serve different experimental purposes.',
      },
      {
        q: 'What is Examorelin?',
        a: 'Examorelin is the INN (generic name) for Hexarelin; the two terms refer to the same hexapeptide.',
      },
      {
        q: 'How should Hexarelin be stored and reconstituted?',
        a: 'Standard peptide storage and peptide reconstitution practice applies: lyophilised at -20°C, reconstitute with bacteriostatic water under sterile conditions, then refrigerate at 2–8°C and use within 21 days.',
      },
      {
        q: 'What purity is supplied?',
        a: '≥99% peptide purity by independent HPLC peptide testing with MS identity confirmation, documented on the batch COA included with every order.',
      },
    ],
    references: [
      { title: 'Hexarelin research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=hexarelin' },
      { title: 'GHRP class pharmacology literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=GHRP+ghrelin+receptor+secretagogue' },
    ],
  },
  {
    slug: 'vip',
    name: 'VIP',
    subtitle: 'Vasoactive Intestinal Peptide · 28 amino acids',
    category: 'cognitive-neuropeptides',
    rating: 4.7,
    reviews: 31,
    price: 46.99,
    sizes: [
      { label: '1 mg', price: 46.99 },
      { label: '2 mg', price: 84.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: '37221-79-7',
    formula: 'C147H238N44O42S',
    molecularWeight: '3325.8 g/mol',
    sequence: 'His-Ser-Asp-Ala-Val-Phe-Thr-Asp-Asn-Tyr-Thr-Arg-Leu-Arg-Lys-Gln-Met-Ala-Val-Lys-Lys-Tyr-Leu-Asn-Ser-Ile-Leu-Asn-NH2',
    appearance: 'White lyophilised powder',
    storage: 'Store at -20°C. After reconstitution, refrigerate at 2–8°C and use within 14 days.',
    short:
      'The 28-amino-acid neuropeptide for VPAC-receptor, immunomodulation and circadian research. ≥99% purity with full batch documentation.',
    description: [
      'VIP (Vasoactive Intestinal Peptide) is a 28-amino-acid neuropeptide of the secretin/glucagon family, examined in the literature across VPAC1/VPAC2 receptor signalling, immunomodulation, circadian regulation in the suprachiasmatic nucleus, and smooth-muscle models. All findings described here derive from preclinical research; the VIP peptide is supplied strictly for laboratory use and is not for human or veterinary use.',
      'VIP is synthesis-intensive and oxidation-sensitive — a compound where supplier quality shows immediately in the analytics. Our material is independently verified to ≥99% purity by HPLC with MS identity confirmation, and ships with a batch-specific COA.',
      'Supplied lyophilised in sterile vials, dispatched tracked from our UK facility. As a UK peptide supplier and peptide shop for research peptides, UK laboratories receive batch-verified VIP in 1 mg and 2 mg vials, for research use only.',
    ],
    applications: [
      'VPAC1/VPAC2 receptor signalling research',
      'Immunomodulation pathway studies',
      'Circadian regulation (SCN) models',
      'Secretin-family comparative pharmacology',
    ],
    faqs: [
      {
        q: 'What is VIP in peptide research?',
        a: 'Vasoactive Intestinal Peptide — a 28-amino-acid neuropeptide examined in VPAC receptor, immune-regulation and circadian research. Supplied for research use only.',
      },
      {
        q: 'Why is VIP relatively expensive per milligram?',
        a: 'Its 28-residue length and oxidation-sensitive methionine make synthesis and purification substantially more demanding than shorter peptides.',
      },
      {
        q: 'How should VIP be stored?',
        a: 'Lyophilised at -20°C; after reconstitution refrigerate at 2–8°C and use within 14 days.',
      },
    ],
    references: [
      { title: 'VIP neuropeptide research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=vasoactive+intestinal+peptide' },
      { title: 'VPAC receptor pharmacology literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=VPAC+receptor+VIP' },
    ],
  },
  {
    slug: 'testagen',
    name: 'Testagen',
    subtitle: 'KEDG · Lys-Glu-Asp-Gly tetrapeptide bioregulator',
    category: 'cognitive-neuropeptides',
    rating: 4.6,
    reviews: 26,
    price: 39.99,
    sizes: [
      { label: '20 mg', price: 39.99 },
      { label: '40 mg', price: 69.99 },
    ],
    purity: '≥99% (HPLC)',
    cas: 'N/A (see literature)',
    formula: 'C17H29N5O9',
    molecularWeight: '447.44 g/mol',
    sequence: 'Lys-Glu-Asp-Gly',
    appearance: 'White to off-white lyophilised powder',
    storage: 'Store at -20°C, desiccated and protected from light. After reconstitution, refrigerate at 2–8°C.',
    short:
      'The Khavinson-family tetrapeptide for gene-expression regulation research. ≥99% purity, batch-tested, COA included.',
    description: [
      'Testagen (KEDG) is a synthetic tetrapeptide of the Khavinson bioregulator family, examined in the research literature as a testis-directed short-peptide probe for studying tissue-specific gene-expression regulation in reproductive-tissue experimental systems.',
      'Within the Khavinson framework, short peptides of this class are proposed to act at the chromatin/transcriptional level; Testagen is used as a tool compound for peptide-driven regulation studies and as a comparator in tissue-specificity panels across the bioregulator family.',
      'Our Testagen is independently verified to ≥99% purity by HPLC and MS, and ships with a batch-specific Certificate of Analysis. All findings described here derive from preclinical research; Testagen is supplied strictly for laboratory use. As a UK peptide supplier and peptide shop stocking research peptides, UK laboratories receive Testagen in 20 mg and 40 mg vials, for research use only.',
    ],
    applications: [
      'Gene-expression regulation research (Khavinson framework)',
      'Reproductive-tissue experimental systems',
      'Tissue-specificity panels across peptide bioregulators',
      'Short-peptide chromatin-interaction studies',
    ],
    faqs: [
      {
        q: 'What is Testagen?',
        a: 'A synthetic Lys-Glu-Asp-Gly tetrapeptide of the Khavinson bioregulator family, used in research on peptide-driven gene-expression regulation. Supplied for research use only.',
      },
      {
        q: 'How does Testagen relate to Epitalon?',
        a: 'Both are Khavinson-family short peptides; Epitalon (Ala-Glu-Asp-Gly) is pineal-associated, while Testagen (Lys-Glu-Asp-Gly) is examined in reproductive-tissue models.',
      },
      {
        q: 'What purity is supplied?',
        a: '≥99% by independent HPLC with MS identity confirmation, documented on the batch COA included with every order.',
      },
    ],
    references: [
      { title: 'Khavinson peptide bioregulator literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Khavinson+peptide+bioregulator' },
      { title: 'Peptide regulation of gene expression review', url: 'https://www.mdpi.com/1420-3049/26/22/7053' },
    ],
  },
]
