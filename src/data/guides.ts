export interface GuideSection {
  heading: string
  paragraphs: string[]
}

export interface GuideReference {
  title: string
  url: string
  authors?: string
  journal?: string
  year?: string
  studyType?: string // e.g. 'animal study', 'in-vitro study', 'review', 'human trial'
}

export interface Guide {
  slug: string
  title: string
  keyword: string // primary search intent captured
  description: string
  readingTime: string
  published: string
  updated: string
  intro: string
  sections: GuideSection[]
  keyPoints: string[]
  faqs: { q: string; a: string }[]
  relatedProducts: string[] // product slugs
  references: GuideReference[]
}

export const guides: Guide[] = [
  {
    slug: 'bpc-157-research-guide',
    title: 'BPC-157 Research Guide: Mechanisms, Handling & Laboratory Use',
    keyword: 'how to use BPC-157 in research',
    description:
      'The complete laboratory guide to BPC-157: what it is, what the published research covers, how to store and reconstitute it, and how to verify purity before your study begins.',
    readingTime: '7 min read',
    published: '2026-06-14',
    updated: '2026-08-01',
    intro:
      'BPC-157 (Body Protection Compound-157) is a synthetic pentadecapeptide derived from a protective protein in human gastric juice, and how to use BPC-157 in research correctly comes down to three things: understanding what the preclinical literature actually examines, handling the lyophilised compound within validated peptide storage limits, and verifying batch-specific purity before any protocol begins. This guide covers each in turn, including how BPC 157 and TB500 are paired in the research literature.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'The published BPC-157 literature is almost entirely preclinical — animal and in-vitro work — and it is unusually broad for a single peptide. Peer-reviewed studies examine tendon-to-bone healing, muscle and ligament repair, gastrointestinal mucosal protection, and angiogenesis, the formation of new blood vessels that several research groups have proposed as the mechanism linking these effects. No human therapeutic use is approved or implied by any of this work.',
          'Researchers frequently highlight its stability: unlike many peptides, BPC-157 remains active in gastric environments in published animal models, which is one reason gut-integrity research accounts for a large share of the literature. Reviews by Gwyer and colleagues (Cell and Tissue Research, 2019) and Sikiric and colleagues (Current Neuropharmacology, 2016) summarise this body of work; both are cited below.',
        ],
      },
      {
        heading: 'Peptide Storage, Reconstitution and Handling',
        paragraphs: [
          'Correct peptide storage for BPC-157 is straightforward: keep the lyophilised powder at -20°C, where it remains stable for 24 months or more, avoid repeated freeze-thaw cycles, and keep the vial sealed until use. These limits follow standard lyophilised-peptide practice rather than anything unique to this compound.',
          'BPC 157 reconstitution follows the standard peptide reconstitution protocol: add bacteriostatic water slowly down the inside wall of the vial — never squirt directly onto the powder, and do not shake. Gentle swirling until fully dissolved preserves peptide integrity. Once reconstituted, refrigerate at 2–8°C and use within 28 days.',
        ],
      },
      {
        heading: 'Verifying Quality Before Your Study',
        paragraphs: [
          'Purity claims mean nothing without documentation. Before including BPC-157 in any protocol, confirm three things: the supplier\'s batch-specific Certificate of Analysis shows HPLC purity ≥99%; mass spectrometry confirms the molecular weight at 1419.53 g/mol; and the COA batch number matches the vial in your hand.',
          'Noxptide publishes this documentation with every order and will send the current batch COA before purchase on request — the standard every serious laboratory should demand. See our guide to reading a peptide COA for what each section means.',
        ],
      },
      {
        heading: 'Frequently Paired Research Compounds',
        paragraphs: [
          'In the research literature, BPC 157 and TB500 are most often examined together in complementary tissue-repair models, because the two act through distinct pathways: BPC-157 is a 15-amino-acid gastric-derived peptide, while TB-500 is a 43-amino-acid analogue of Thymosin Beta-4. Our BPC-157 vs TB-500 comparison covers the mechanistic differences in detail.',
          'For laboratories sourcing BPC-157 peptide UK stock for research use: Noxptide supplies research-grade UK peptides — BPC 157 UK peptides included — at ≥99% purity with full batch documentation, strictly for laboratory research. The BPC-157 product page lists available vial sizes; purchase intent should be directed there, where the research-use-only terms are set out in full.',
        ],
      },
    ],
    keyPoints: [
      'BPC-157 is a gastric-derived pentadecapeptide with a broad preclinical (animal and in-vitro) literature base',
      'Store lyophilised at -20°C; reconstituted at 2–8°C, use within 28 days',
      'Reconstitute gently — never shake the vial',
      'Demand HPLC ≥99% purity and MS identity confirmation on the batch COA',
    ],
    faqs: [
      {
        q: 'What is BPC-157 used for in research?',
        a: 'Published preclinical research examines BPC-157 in tendon and soft-tissue repair, gastrointestinal integrity, angiogenesis and wound-healing models. It is supplied strictly for laboratory research use only.',
      },
      {
        q: 'How long does BPC-157 last after reconstitution?',
        a: 'Reconstituted BPC-157 should be refrigerated at 2–8°C and used within 28 days. The lyophilised powder is stable at -20°C for 24+ months.',
      },
      {
        q: 'What purity should research-grade BPC-157 be?',
        a: 'Research-grade material should be ≥99% pure by HPLC with mass spectrometry identity confirmation, documented on a batch-specific Certificate of Analysis.',
      },
    ],
    relatedProducts: ['bpc-157', 'tb-500'],
    references: [
      {
        title: 'Gastric pentadecapeptide body protection compound BPC 157 and its role in accelerating musculoskeletal soft tissue healing',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30915550/',
        authors: 'Gwyer D, Wragg NM, Wilson SL',
        journal: 'Cell and Tissue Research',
        year: '2019',
        studyType: 'review',
      },
      {
        title: 'The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21030672/',
        authors: 'Chang CH, Tsai WC, Lin MS, Hsu YH, Pang JH',
        journal: 'Journal of Applied Physiology',
        year: '2011',
        studyType: 'animal and in-vitro study',
      },
      {
        title: 'Brain-gut axis and pentadecapeptide BPC 157: theoretical and practical implications',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27138887/',
        authors: 'Sikiric P, Seiwerth S, Rucman R, et al.',
        journal: 'Current Neuropharmacology',
        year: '2016',
        studyType: 'review',
      },
    ],
  },
  {
    slug: 'tb-500-research-guide',
    title: 'TB-500 Research Guide: Thymosin Beta-4 in the Laboratory',
    keyword: 'TB-500 dosage guide research',
    description:
      'A laboratory-focused guide to TB-500: mechanism coverage in the literature, correct storage and reconstitution, purity verification, and how it differs from BPC-157 in research models.',
    readingTime: '6 min read',
    published: '2026-06-20',
    updated: '2026-08-01',
    intro:
      'TB 500 is the synthetic research analogue of Thymosin Beta-4, a 43-amino-acid peptide involved in actin regulation and cell migration. Researchers searching for a "TB-500 dosage guide research" resource should note an important boundary: dosing decisions belong to individual protocol design, and this guide covers what a laboratory actually needs — what the published literature examines, how TB-500 is handled and stored, and how it differs from BPC-157 in research design.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'The published Thymosin Beta-4 literature spans cell migration, angiogenesis, cardiac repair and anti-inflammatory pathways, and is almost entirely preclinical — cell-culture and animal-model work. Its role in actin sequestration, regulating the cytoskeletal machinery cells use to move, underpins much of the migration and wound-repair literature, as reviewed by Goldstein, Hannappel and Kleinman (Trends in Molecular Medicine, 2005).',
          'Two landmark animal studies shaped the field: Bock-Marquette and colleagues (Nature, 2004) documented cardiac cell migration and repair effects in a mouse model, and Smart and colleagues (Nature, 2007) reported epicardial progenitor mobilisation and neovascularisation. TB-500 itself concentrates the active region of the full-length protein, giving researchers a defined, synthesisable tool compound with consistent analytical characteristics.',
        ],
      },
      {
        heading: 'TB-500 vs BPC-157 in Research Design',
        paragraphs: [
          'TB-500 and BPC-157 are frequently discussed together, but they are mechanistically distinct compounds, not rivals. BPC-157 is a 15-amino-acid gastric-derived peptide with a strong gastrointestinal and angiogenic literature; TB-500 is a 43-amino-acid thymic peptide centred on actin regulation and cell migration. Research programmes often examine both in parallel to cover complementary pathways.',
          'For analytical purposes, note the difference in molecular weight: TB-500 at 4963.49 g/mol versus BPC-157 at 1419.53 g/mol — mass spectrometry identity confirmation should match these values exactly on your COA.',
        ],
      },
      {
        heading: 'Peptide Storage, TB 500 Storage and Reconstitution',
        paragraphs: [
          'TB 500 storage follows standard peptide storage practice: keep the lyophilised powder at -20°C, protected and sealed, where it is stable long-term. Once reconstituted, refrigerate at 2–8°C and use within 21 days.',
          'For peptide reconstitution, add bacteriostatic water gently down the vial wall and swirl — never shake — until dissolved. Because of its larger molecular size, TB-500 can take slightly longer to dissolve than smaller peptides; patience and gentle swirling protect the compound.',
        ],
      },
      {
        heading: 'Sourcing Research-Grade TB-500',
        paragraphs: [
          'UK laboratories looking for TB 500 10mg, TB 500 5mg or TB 500 2mg vials for research use can find the current sizes on the TB-500 product page, each supplied with a batch-specific Certificate of Analysis under research-use-only terms. Whatever the vial size, the verification standard is identical: HPLC purity ≥99% and MS identity confirmation at 4963.49 g/mol.',
        ],
      },
    ],
    keyPoints: [
      'TB-500 is the synthetic analogue of Thymosin Beta-4, centred on actin regulation research — the literature is preclinical',
      'Mechanistically distinct from BPC-157 — frequently studied in parallel',
      'Reconstituted: refrigerate at 2–8°C, use within 21 days',
      'MS identity confirmation should read 4963.49 g/mol',
    ],
    faqs: [
      {
        q: 'What is TB-500 in research?',
        a: 'TB-500 is a synthetic version of Thymosin Beta-4 used in laboratory research on cell migration, angiogenesis and tissue regeneration. It is supplied for research use only.',
      },
      {
        q: 'What is the difference between TB-500 and BPC-157?',
        a: 'BPC-157 is a 15-amino-acid gastric-derived peptide; TB-500 is a 43-amino-acid thymic peptide. They act through different pathways and are often examined together in complementary repair models.',
      },
      {
        q: 'How should TB-500 be stored?',
        a: 'Lyophilised at -20°C; once reconstituted, refrigerate at 2–8°C and use within 21 days.',
      },
    ],
    relatedProducts: ['tb-500', 'bpc-157'],
    references: [
      {
        title: 'Thymosin beta4: actin-sequestering protein moonlights to repair injured tissues',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16099219/',
        authors: 'Goldstein AL, Hannappel E, Kleinman HK',
        journal: 'Trends in Molecular Medicine',
        year: '2005',
        studyType: 'review',
      },
      {
        title: 'Thymosin beta4 activates integrin-linked kinase and promotes cardiac cell migration, survival and cardiac repair',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15565145/',
        authors: 'Bock-Marquette I, Saxena A, White MD, Dimaio JM, Srivastava D',
        journal: 'Nature',
        year: '2004',
        studyType: 'animal study',
      },
      {
        title: 'Thymosin beta4 induces adult epicardial progenitor mobilization and neovascularization',
        url: 'https://doi.org/10.1038/nature05383',
        authors: 'Smart N, Risebro CA, Melville AAD, et al.',
        journal: 'Nature',
        year: '2007',
        studyType: 'animal study',
      },
    ],
  },
  {
    slug: 'bpc-157-vs-tb-500',
    title: 'BPC-157 vs TB-500: Which Peptide for Your Research Model?',
    keyword: 'BPC-157 vs TB-500',
    description:
      'A side-by-side comparison of BPC-157 and TB-500 for research design: mechanisms, literature coverage, handling differences, purity verification and when laboratories study both together.',
    readingTime: '8 min read',
    published: '2026-07-02',
    updated: '2026-08-01',
    intro:
      'BPC-157 vs TB-500 is one of the most-searched comparisons in UK peptide research — and one of the most poorly answered online. The direct answer: the two compounds are not rivals but mechanistically distinct tools, and BPC 157 and TB500 are most often studied together in the literature precisely because their pathways do not overlap. This comparison gives research teams a clear basis for choosing one, the other, or both.',
    sections: [
      {
        heading: 'Mechanism and Origin: The Core Difference',
        paragraphs: [
          'The core difference between BPC-157 and TB-500 is origin and size. BPC-157 is a 15-amino-acid synthetic peptide derived from a gastric protective protein. TB 500 is a synthetic analogue of Thymosin Beta-4, a 43-amino-acid peptide that regulates actin. Different origins, different molecular weights, different primary literature — which is exactly why they complement each other in research programmes.',
        ],
      },
      {
        heading: 'Literature Coverage Compared',
        paragraphs: [
          'Both compounds have substantial preclinical literature, concentrated in different models. BPC-157\'s evidence base is strongest in gastrointestinal integrity, tendon-to-bone healing and angiogenesis (see Chang et al., Journal of Applied Physiology, 2011). TB-500\'s is strongest in cell migration, cardiac and muscle repair models (Bock-Marquette et al., Nature, 2004; Smart et al., Nature, 2007). If your programme focuses on gut models, the BPC-157 literature is deeper; for migration and cytoskeletal studies, TB-500 is the more direct tool. All of this evidence is animal or in-vitro; neither compound has an approved human use.',
        ],
      },
      {
        heading: 'Handling, Storage and Analytics Compared',
        paragraphs: [
          'Handling is near-identical: both are supplied lyophilised and follow standard peptide storage practice at -20°C. TB 500 storage after reconstitution is slightly tighter — use within 21 days at 2–8°C, versus 28 days for BPC-157. BPC 157 reconstitution and TB-500 reconstitution use the same technique: bacteriostatic water down the vial wall, gentle swirling, never shaking.',
          'The key analytical difference is molecular weight: BPC-157 is 1419.53 g/mol, TB-500 is 4963.49 g/mol. Verify these exact values on the mass spectrometry section of your Certificate of Analysis — peptide purity by HPLC alone does not confirm identity.',
        ],
      },
      {
        heading: 'When Laboratories Study Both',
        paragraphs: [
          'Because the mechanisms do not overlap, many repair-focused programmes examine both compounds in parallel. When doing so, source both from the same supplier so analytical standards, documentation format and batch traceability are consistent across the study.',
          'For UK research teams, the TB 500 10mg and BPC-157 product pages list current vial sizes with batch COAs — the BPC 157 peptide UK stock and TB-500 are both supplied under research-use-only terms. Laboratories comparing UK peptides BPC 157 suppliers should apply the same standard to both compounds: ≥99% HPLC purity plus MS identity confirmation on a batch-specific COA.',
        ],
      },
    ],
    keyPoints: [
      'BPC-157: 15-mer, gastric origin, strongest gut/tendon/angiogenesis literature',
      'TB-500: 43-mer, thymic origin, strongest migration/muscle/cardiac literature',
      'Different mechanisms — complementary, not competing',
      'Verify MW on COA: 1419.53 vs 4963.49 g/mol',
    ],
    faqs: [
      {
        q: 'Is TB-500 stronger than BPC-157?',
        a: 'They are not directly comparable — the compounds act through different mechanisms documented in distinct bodies of literature. The right choice depends on your research model, and many programmes examine both.',
      },
      {
        q: 'Can BPC-157 and TB-500 be reconstituted the same way?',
        a: 'Yes — both use bacteriostatic water added gently with swirling. BPC-157 keeps 28 days refrigerated; TB-500 should be used within 21 days.',
      },
      {
        q: 'Which is more researched?',
        a: 'Both have substantial preclinical literature. BPC-157 is particularly documented in gastrointestinal and tendon models; TB-500 in migration and cardiac models.',
      },
    ],
    relatedProducts: ['bpc-157', 'tb-500'],
    references: [
      {
        title: 'The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21030672/',
        authors: 'Chang CH, Tsai WC, Lin MS, Hsu YH, Pang JH',
        journal: 'Journal of Applied Physiology',
        year: '2011',
        studyType: 'animal and in-vitro study',
      },
      {
        title: 'Thymosin beta4 activates integrin-linked kinase and promotes cardiac cell migration, survival and cardiac repair',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15565145/',
        authors: 'Bock-Marquette I, Saxena A, White MD, Dimaio JM, Srivastava D',
        journal: 'Nature',
        year: '2004',
        studyType: 'animal study',
      },
      {
        title: 'Thymosin beta4 induces adult epicardial progenitor mobilization and neovascularization',
        url: 'https://doi.org/10.1038/nature05383',
        authors: 'Smart N, Risebro CA, Melville AAD, et al.',
        journal: 'Nature',
        year: '2007',
        studyType: 'animal study',
      },
    ],
  },
  {
    slug: 'ipamorelin-vs-cjc-1295',
    title: 'Ipamorelin vs CJC-1295: Secretagogue Research Compared',
    keyword: 'Ipamorelin vs CJC-1295',
    description:
      'Ipamorelin vs CJC-1295 (No DAC) compared for endocrine research: receptor mechanisms, selectivity profiles, literature coverage, handling, and why laboratories study them in combination.',
    readingTime: '7 min read',
    published: '2026-07-09',
    updated: '2026-08-01',
    intro:
      'Ipamorelin and CJC 1295 are the two most-ordered secretagogues in UK endocrine research, and CJC 1295 Ipamorelin combination models are the pairing most often studied in the literature. The direct answer to the comparison: they act on two different receptors of the same endocrine axis, which is precisely why they are examined together. This guide explains the receptor-level difference, Ipamorelin\'s selectivity, and what to verify on your Certificates of Analysis.',
    sections: [
      {
        heading: 'Two Receptors, One Axis',
        paragraphs: [
          'CJC-1295 (No DAC), also called Modified GRF 1-29, acts on the GHRH receptor; Ipamorelin acts on the ghrelin receptor (GHS-R1a). Both influence the same endocrine axis through different doors — the mechanistic basis for the combination research common in the literature.',
          'Ipamorelin is notable for selectivity: Raun and colleagues (European Journal of Endocrinology, 1998) characterised it as the first selective growth-hormone secretagogue, documenting GH-releasing activity without the cortisol and prolactin effects seen with earlier GHRP-class compounds. That selectivity makes it a cleaner experimental tool.',
        ],
      },
      {
        heading: 'Modified GRF 1-29 vs CJC-1295 with DAC',
        paragraphs: [
          'The practical distinction in the CJC 1295 DAC question is half-life. "CJC-1295" without qualification can mean the DAC (Drug Affinity Complex) version, whose extended half-life was documented in healthy adults by Teichman and colleagues (Journal of Clinical Endocrinology & Metabolism, 2006). Most research protocols instead call for the No-DAC form — Modified GRF 1-29 — which preserves physiological pulsatility. Check your COA and molecular weight (3367.9 g/mol) to confirm you have the correct analogue.',
        ],
      },
      {
        heading: 'Handling and Storage Comparison',
        paragraphs: [
          'Ipamorelin vs CJC 1295 handling is broadly similar: both are lyophilised and stored at -20°C. CJC 1295 storage after reconstitution is the tighter of the two — use within 14 days at 2–8°C, versus 21 days for reconstituted Ipamorelin. That shorter window matters for protocol planning.',
          'For laboratories weighing CJC 1295 vs Ipamorelin sourcing: both should arrive with batch-specific COAs showing HPLC purity ≥99% and MS identity confirmation. UK research teams will find current vial sizes, including CJC 1295 2mg, on the CJC-1295 (No DAC) product page — supplied under research-use-only terms, which is where purchase intent (for example, "buy CJC 1295" or "CJC 1295 UK" searches) should be directed rather than to this guide.',
        ],
      },
    ],
    keyPoints: [
      'CJC-1295 (No DAC) = GHRH receptor; Ipamorelin = ghrelin receptor (GHS-R1a)',
      'Ipamorelin is the most selective GHRP in the literature',
      'Confirm No-DAC form via MW 3367.9 g/mol on your COA',
      'Reconstituted windows: Ipamorelin 21 days, CJC-1295 14 days',
    ],
    faqs: [
      {
        q: 'Why are Ipamorelin and CJC-1295 studied together?',
        a: 'They act on two different receptors of the same endocrine axis (GHS-R1a and GHRH-R), and the published literature documents synergistic activity in combination models.',
      },
      {
        q: 'What is the difference between CJC-1295 and CJC-1295 DAC?',
        a: 'The DAC version carries a Drug Affinity Complex that greatly extends half-life. The No-DAC form (Modified GRF 1-29) retains the short, pulsatile profile most research protocols require.',
      },
      {
        q: 'Which has fewer off-target effects in research?',
        a: 'Ipamorelin is documented as the most selective of the GHRP class, with minimal cortisol and prolactin activity in published models.',
      },
    ],
    relatedProducts: ['ipamorelin', 'cjc-1295-no-dac'],
    references: [
      {
        title: 'Ipamorelin, the first selective growth hormone secretagogue',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/',
        authors: 'Raun K, Hansen BS, Johansen NL, et al.',
        journal: 'European Journal of Endocrinology',
        year: '1998',
        studyType: 'animal study',
      },
      {
        title: 'Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295, a long-acting analog of GH-releasing hormone, in healthy adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16352683/',
        authors: 'Teichman SL, Neale A, Lawrence B, Gagnon C, Castaigne JP, Frohman LA',
        journal: 'Journal of Clinical Endocrinology & Metabolism',
        year: '2006',
        studyType: 'human trial',
      },
    ],
  },
  {
    slug: 'semax-research-guide',
    title: 'Semax Research Guide: The ACTH(4-10) Analogue in CNS Studies',
    keyword: 'Semax research guide',
    description:
      'A laboratory guide to Semax: its origin as an ACTH(4-10) analogue, neuroprotection and neurotrophin literature, light-sensitive handling, and purity verification for CNS research.',
    readingTime: '6 min read',
    published: '2026-07-15',
    updated: '2026-08-01',
    intro:
      'Semax is a synthetic heptapeptide built on the ACTH(4-10) fragment with a stabilising Pro-Gly-Pro tail, and it is the benchmark nootropic-class peptide in CNS research. This Semax research guide covers what the literature actually examines, the compound\'s light-sensitive handling requirements, analytical verification, and how it relates to its frequent research partner Selank.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'The Semax literature concentrates on three areas: neuroprotection (including ischaemia models), neurotrophin expression — particularly BDNF — and CNS melanocortin signalling. Much of the foundational work comes from Russian neuroscience programmes and sits outside mainstream Western databases, but PubMed indexes a substantial and growing set of studies; a curated entry point is linked in the references below. As with all peptides in this guide, the evidence is preclinical and no human use is implied.',
        ],
      },
      {
        heading: 'Handling: Semax Is Light-Sensitive',
        paragraphs: [
          'Semax degrades faster under light exposure than most research peptides, so peptide storage for this compound has an extra requirement. Store the lyophilised powder at -20°C protected from light — lyophilized peptide storage in an amber vial or foil wrap is good practice — minimise bench time in bright conditions, and refrigerate reconstituted solution at the standard peptide storage temperature of 2–8°C. Noxptide ships Semax in light-protective packaging for this reason.',
        ],
      },
      {
        heading: 'Frequently Paired: Selank',
        paragraphs: [
          'Semax is most often examined alongside Selank, the tuftsin-analogue heptapeptide, in parallel CNS research programmes. The two compounds share the Pro-Gly-Pro stability tail but have distinct origins and literature: an ACTH(4-10) fragment versus an immunomodulatory tetrapeptide. Selank is supplied lyophilised; any Selank spray format a laboratory encounters is a post-reconstitution preparation, not a shipping format.',
          'For purchase intent — laboratories searching for Selank for sale, to buy Selank spray precursors, or "N acetyl Selank buy" queries — the Selank product page lists current research-grade stock with batch-specific COAs, supplied strictly for laboratory research use. N-Acetyl Selank is an acetylated analogue of the same tuftsin-derived sequence; confirm which variant a protocol specifies before ordering.',
        ],
      },
    ],
    keyPoints: [
      'Semax is an ACTH(4-10) analogue stabilised with Pro-Gly-Pro — literature focus: neuroprotection, BDNF, CNS melanocortin signalling',
      'Light-sensitive — store protected from light at -20°C',
      'Frequently studied in parallel with Selank',
      'Evidence is preclinical; supplied for laboratory research use only',
    ],
    faqs: [
      {
        q: 'What is Semax used for in research?',
        a: 'Published research examines Semax in neuroprotection, neurotrophin (BDNF) pathway and cognitive models. It is supplied strictly for laboratory research use only.',
      },
      {
        q: 'Does Semax need special storage?',
        a: 'Yes — Semax is light-sensitive. Store lyophilised at -20°C protected from light and refrigerate after reconstitution at 2–8°C.',
      },
      {
        q: 'What is the difference between Semax and Selank?',
        a: 'Semax derives from the ACTH(4-10) fragment; Selank derives from the immunomodulatory peptide tuftsin. Both carry a Pro-Gly-Pro stability tail and are often studied in parallel.',
      },
    ],
    relatedProducts: ['semax', 'selank'],
    references: [
      {
        title: 'Semax literature indexed on PubMed (curated search — individual studies are predominantly preclinical)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=semax',
        studyType: 'literature index',
      },
    ],
  },
  {
    slug: 'ghk-cu-research-guide',
    title: 'GHK-Cu Research Guide: The Copper Peptide in Matrix Research',
    keyword: 'GHK-Cu research guide',
    description:
      'A laboratory guide to GHK-Cu (Copper Tripeptide-1): four decades of skin and matrix research, what the blue colour tells you about quality, and correct storage and handling.',
    readingTime: '6 min read',
    published: '2026-07-22',
    updated: '2026-08-01',
    intro:
      'GHK-Cu — Copper Tripeptide-1 — is one of the oldest and best-documented research peptides in dermatological science. First isolated from human plasma, GHK Cu literature spans collagen synthesis, extracellular matrix remodelling, antioxidant defence and wound repair. This GHK-Cu research guide covers that evidence base, the built-in quality signal most buyers never learn to read, and correct storage and handling.',
    sections: [
      {
        heading: 'The Blue Colour Is a Quality Test',
        paragraphs: [
          'Properly chelated GHK-Cu (GHK copper complex) is vivid blue — the colour of the copper complex itself. Pale, greyish or white material suggests incomplete chelation or degraded product. This makes GHK-Cu unusual: you can perform a first-pass quality check by eye before any instrument confirms it. Your COA should still show ≥99% HPLC peptide purity and correct MS identity (403.9 g/mol).',
        ],
      },
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'Four decades of published work examine GHK-Cu in collagen and glycosaminoglycan synthesis, dermal remodelling, wound healing, antioxidant pathways and hair-follicle biology. Pickart and colleagues have reviewed this evidence twice — Biomed Research International (2015) and International Journal of Molecular Sciences (2018), both cited below — drawing largely on in-vitro and animal data. It is among the most-cited cosmetic-science peptides — though Noxptide supplies it strictly for in-vitro research, not formulation use, and no human efficacy claim is made or implied.',
        ],
      },
      {
        heading: 'Handling, Reconstitution and Storage',
        paragraphs: [
          'GHK Cu reconstitution follows the standard protocol: bring the vial to room temperature, add bacteriostatic water — or the solvent specified for your assay — slowly down the vial wall, and swirl gently until dissolved. Store lyophilised GHK-Cu at -20°C protected from light and refrigerate at 2–8°C after reconstitution. The blue colour should remain vivid in solution; fading suggests degradation.',
          'Before ordering, verify documentation: a batch-specific certificate of analysis should show HPLC purity, MS identity and appearance for the exact vial in your hand. For purchase intent — laboratories looking to buy GHK Cu, finding GHK Cu for sale, or sourcing copper peptides for in-vitro work ("buy copper peptides" searches) — the GHK-Cu product page lists current stock with batch COAs under research-use-only terms.',
        ],
      },
    ],
    keyPoints: [
      'GHK-Cu is Copper Tripeptide-1 — glycyl-L-histidyl-L-lysine complexed with copper',
      'Vivid blue colour indicates proper copper chelation — a visible quality check',
      'Literature: collagen synthesis, matrix remodelling, wound repair, antioxidant defence (predominantly in-vitro and animal data)',
      'Supplied for in-vitro research only, not cosmetic formulation',
    ],
    faqs: [
      {
        q: 'Why is GHK-Cu blue?',
        a: 'The blue colour comes from the copper ion chelated to the GHK tripeptide. A vivid blue indicates a well-formed complex; pale material suggests poor chelation or degradation.',
      },
      {
        q: 'What research areas use GHK-Cu?',
        a: 'Published literature covers collagen synthesis, extracellular matrix remodelling, wound healing, antioxidant pathways and hair-follicle biology.',
      },
      {
        q: 'How should GHK-Cu be stored?',
        a: 'Lyophilised at -20°C protected from light; refrigerate at 2–8°C after reconstitution.',
      },
    ],
    relatedProducts: ['ghk-cu', 'bpc-157'],
    references: [
      {
        title: 'GHK peptide as a natural modulator of multiple cellular pathways in skin regeneration',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26236730/',
        authors: 'Pickart L, Vasquez-Soltero JM, Margolina A',
        journal: 'BioMed Research International',
        year: '2015',
        studyType: 'review',
      },
      {
        title: 'Regenerative and protective actions of the GHK-Cu peptide in the light of the new gene data',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29986520/',
        authors: 'Pickart L, Margolina A',
        journal: 'International Journal of Molecular Sciences',
        year: '2018',
        studyType: 'review',
      },
    ],
  },
  {
    slug: 'peptide-reconstitution-storage-guide',
    title: 'How to Reconstitute & Store Research Peptides: The Complete Guide',
    keyword: 'how to reconstitute peptides',
    description:
      'Step-by-step laboratory guidance on reconstituting lyophilised peptides with bacteriostatic water, correct storage temperatures, shelf-life windows and the handling mistakes that destroy peptides.',
    readingTime: '8 min read',
    published: '2026-06-05',
    updated: '2026-08-01',
    intro:
      'How to reconstitute peptides correctly comes down to one protocol: bring the vial to room temperature, add bacteriostatic water slowly down the inside wall of the vial, swirl gently until dissolved, and never shake. More research peptides are ruined by bad handling than by bad suppliers, so this guide gives your laboratory the full procedure, the peptide storage limits for every common compound, and the five handling mistakes that destroy peptide integrity.',
    sections: [
      {
        heading: 'The Correct Reconstitution Protocol',
        paragraphs: [
          'Peptide reconstitution starts before the solvent touches the powder. Bring the vial to room temperature before opening to prevent condensation. Using a sterile syringe, draw bacteriostatic water and add it slowly down the inside wall of the vial — never directly onto the powder cake. Swirl gently until fully dissolved. Never shake: mechanical shear damages peptide bonds and causes aggregation.',
          'The same technique applies whether you reconstitute BPC 157, reconstitute PT 141 or any other lyophilised compound — only the post-reconstitution shelf life differs. Larger peptides (TB-500 at 43 amino acids, Tesamorelin at 44) dissolve more slowly than small ones. Give them time and gentle swirling rather than force.',
        ],
      },
      {
        heading: 'Storage Temperatures and Shelf-Life Windows',
        paragraphs: [
          'Lyophilised peptides: -20°C for long-term storage (typically 24+ months), protected from light for sensitive compounds such as Semax, GHK-Cu and Melanotan II. GHK Cu reconstitution and storage follow the same limits, with the added check that the blue colour should stay vivid in solution.',
          'Reconstituted peptides: refrigerate at 2–8°C. Windows vary by compound — BPC-157 keeps 28 days, TB-500 and Ipamorelin 21 days, CJC-1295 (No DAC) and Tesamorelin 14 days. Mark the reconstitution date on every vial.',
        ],
      },
      {
        heading: 'Vial Sizes and Reconstitution Volumes',
        paragraphs: [
          'Reconstitution volume determines concentration, not the compound itself. Whether a laboratory needs to reconstitute 5mg BPC 157 or a 10mg vial, the protocol is identical — the solvent volume is set by the concentration the protocol requires. Common research formats include the reconstitute BPC 157 5mg vial and TB 500 5mg reconstitution, both listed with batch COAs on the BPC-157 and TB-500 product pages under research-use-only terms.',
        ],
      },
      {
        heading: 'The Five Handling Mistakes That Destroy Peptides',
        paragraphs: [
          'One: shaking the vial instead of swirling. Two: repeated freeze-thaw cycles of reconstituted solution — aliquot instead. Three: leaving lyophilised vials at room temperature for weeks. Four: light exposure for sensitive compounds. Five: using the wrong solvent — always confirm solubility on the Certificate of Analysis before reconstitution.',
        ],
      },
      {
        heading: 'Documentation You Should Keep',
        paragraphs: [
          'Retain the batch COA with your study records. It documents HPLC purity, MS identity and appearance for the exact material you used — essential for reproducibility and for answering reviewer questions about compound provenance.',
        ],
      },
    ],
    keyPoints: [
      'Add bacteriostatic water down the vial wall; swirl, never shake',
      'Lyophilised: -20°C, 24+ months; light-sensitive compounds protected from light',
      'Reconstituted: 2–8°C, 14–28 days depending on compound',
      'Keep the batch COA with your study records for reproducibility',
    ],
    faqs: [
      {
        q: 'Can you shake a peptide vial to mix it?',
        a: 'No. Shaking creates mechanical shear that damages peptide structure and causes aggregation. Always swirl gently until dissolved.',
      },
      {
        q: 'How long do peptides last in the fridge after mixing?',
        a: 'Typically 14–28 days at 2–8°C depending on the compound. BPC-157 keeps 28 days; CJC-1295 and Tesamorelin should be used within 14. Mark reconstitution dates on vials.',
      },
      {
        q: 'Should reconstituted peptides be frozen?',
        a: 'Refrigeration at 2–8°C is standard. If freezing is required, aliquot first to avoid repeated freeze-thaw cycles, which degrade peptides.',
      },
    ],
    relatedProducts: ['bpc-157', 'tb-500', 'ipamorelin', 'tesamorelin', 'aod-9604', 'cjc-1295-no-dac', 'selank', 'pt-141', 'melanotan-2', 'epitalon', 'semax', 'ghk-cu', 'ghrp-6', 'ghrp-2', 'hgh-fragment-176-191', 'cjc-1295-dac', 'igf-1-lr3', 'peg-mgf', 'mgf', 'thymosin-alpha-1', 'kisspeptin-10', 'igf-1-des'],
    references: [
      {
        title: 'Lyophilised peptide stability and reconstitution literature on PubMed (curated search of the stability literature)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=lyophilized+peptide+stability+reconstitution',
        studyType: 'literature index',
      },
    ],
  },
  {
    slug: 'how-to-read-peptide-coa',
    title: 'How to Read a Peptide Certificate of Analysis (COA)',
    keyword: 'peptide certificate of analysis explained',
    description:
      'What every section of a peptide COA actually means: HPLC purity traces, mass spectrometry identity, batch numbers, appearance testing — and the red flags that reveal weak suppliers.',
    readingTime: '6 min read',
    published: '2026-06-10',
    updated: '2026-08-01',
    intro:
      'A peptide Certificate of Analysis, explained in one sentence: it is the batch-specific analytical record that separates a verified peptide from a promise — HPLC purity, mass spectrometry identity, batch number and appearance, all traceable to the vial in your hand. Yet most buyers never learn to read one. This guide explains each section, what good results look like, and the red flags that should send you to a different supplier.',
    sections: [
      {
        heading: 'Section 1: HPLC Purity',
        paragraphs: [
          'HPLC purity is the headline figure on any certificate of analysis, and for research-grade material it should be ≥99%. High-Performance Liquid Chromatography separates your peptide from impurities and produces a chromatogram with peaks. The main peak should dominate; the reported peptide purity (area percentage) is what the certificate quotes. A COA showing 98.1% or "≥98%" is telling you the batch failed a stricter standard.',
        ],
      },
      {
        heading: 'Section 2: Mass Spectrometry Identity',
        paragraphs: [
          'MS confirms the peptide is actually what the label says. The measured molecular weight must match the theoretical value — BPC-157 at 1419.53 g/mol, TB-500 at 4963.49 g/mol, and so on. A COA without MS identity confirmation only tells you something is 99% pure — not 99% of what.',
        ],
      },
      {
        heading: 'Section 3: Batch Number and Date',
        paragraphs: [
          'The COA must carry a batch number that matches your vial label, plus an analysis date. A COA with no batch number — or one recycled across months of orders — is marketing, not documentation.',
        ],
      },
      {
        heading: 'Red Flags to Watch For',
        paragraphs: [
          'COAs only available "after purchase". Stock COAs with no batch number. Purity quoted without a chromatogram. No MS data. In-house-only testing with no independent verification. Any one of these should trigger questions; two or more should end the conversation. The documentation practices of large life-science suppliers (a Merck COA from Sigma-Aldrich/Merck, for instance, always carries batch-specific chromatographic and identity data) set the benchmark the peptide market should meet.',
          'These checks connect directly to handling: purity results are only meaningful if peptide storage and peptide reconstitution were correct afterwards — see our reconstitution and storage guide for those limits. Noxptide supplies batch-specific COAs with every order and sends the current batch documentation before purchase on request — the standard this guide argues for.',
          'For researchers comparing research peptides UK suppliers: any peptide supplier UK laboratories shortlist — whether found through a "peptide shop UK" search or a referral — should pass every check above before a first order is placed.',
        ],
      },
    ],
    keyPoints: [
      'HPLC purity should be ≥99% with a visible dominant peak',
      'MS identity must match the theoretical molecular weight exactly',
      'Batch number on the COA must match your vial',
      'No batch number or no MS data = red flag',
    ],
    faqs: [
      {
        q: 'What is a peptide COA?',
        a: 'A Certificate of Analysis documents the analytical testing of a specific batch: HPLC purity, mass spectrometry identity, appearance and solubility. It is the evidence behind a purity claim.',
      },
      {
        q: 'What purity should a research peptide COA show?',
        a: '≥99% by HPLC for research-grade material, with MS confirming molecular identity against the theoretical weight.',
      },
      {
        q: 'Can I get the COA before ordering?',
        a: 'At Noxptide, yes — request any current batch COA and receive it within one working hour. Suppliers who refuse pre-purchase documentation should raise questions.',
      },
    ],
    relatedProducts: ['bpc-157', 'ghk-cu', 'semax'],
    references: [
      { title: 'Noxptide quality standard', url: 'https://noxptide.co.uk/quality' },
    ],
  },
  {
    slug: 'melanotan-2-vs-pt-141',
    title: 'Melanotan II vs PT-141: Melanocortin Research Compared',
    keyword: 'Melanotan 2 vs PT-141',
    description:
      'Melanotan II vs PT-141 (Bremelanotide) compared for melanocortin research: the one-atom structural difference, receptor profiles, literature coverage and handling guidance.',
    readingTime: '6 min read',
    published: '2026-07-28',
    updated: '2026-08-01',
    intro:
      'Melanotan 2 vs PT-141 is a comparison with an unusually precise answer: the two peptides share the same cyclic heptapeptide core and differ by a single functional group — yet that difference reshapes their research profiles. This guide explains the structural relationship between Melanotan 2 and PT 141, their receptor coverage in the literature, and when laboratories choose one over the other.',
    sections: [
      {
        heading: 'One Functional Group Apart',
        paragraphs: [
          'Melanotan II is Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2 — a C-terminal amide. PT-141 (bremelanotide) is the same cyclic core with a free C-terminal carboxylic acid. That single change shifts receptor behaviour documented in the literature, with PT-141 showing a more CNS-focused profile via the MC4R subtype.',
        ],
      },
      {
        heading: 'Receptor Coverage in the Literature',
        paragraphs: [
          'Melanotan II is used as a broad reference agonist with documented activity across melanocortin subtypes MC1R through MC5R — which is why pigmentation-pathway research (MC1R) and energy-homeostasis research (MC3R/MC4R) both cite it. Early human work by Wessells and colleagues (Journal of Urology, 1998) remains a landmark melanocortin pharmacology study.',
          'PT-141\'s literature concentrates on MC4R-mediated central pathways, and it carries one of the deepest clinical documentation sets of any melanocortin peptide — including the phase 3 RECONNECT trials reported by Kingsberg and colleagues (Obstetrics & Gynecology, 2019). Neither compound is supplied by Noxptide for human use; both are research-use-only laboratory materials.',
        ],
      },
      {
        heading: 'Handling, Storage and Reconstitution',
        paragraphs: [
          'Melanotan 2 storage and PT 141 storage follow standard practice: both are lyophilised and stored at -20°C, with Melanotan II additionally protected from light. PT 141 reconstitution uses the standard technique — bacteriostatic water down the vial wall, gentle swirling — after which both compounds are refrigerated at 2–8°C; PT-141 should be used within 21 days.',
          'Verify molecular weights on your COA: MT-2 at 1024.2 g/mol, PT-141 at 1025.2 g/mol — a one-dalton difference your mass spectrometry must resolve correctly.',
        ],
      },
      {
        heading: 'Sourcing for Laboratory Research',
        paragraphs: [
          'Purchase intent for these compounds — Melanotan 2 order queries, "peptides UK Melanotan 2" searches, or laboratories pricing PT 141 10mg vials — should be directed to the Melanotan II and PT-141 product pages, where current vial sizes are listed with batch-specific COAs under research-use-only terms.',
        ],
      },
    ],
    keyPoints: [
      'Same cyclic core; PT-141 is the carboxylic-acid form of MT-2\'s amide',
      'MT-2: broad MC1R–MC5R reference agonist in the literature',
      'PT-141: MC4R-focused, CNS-weighted profile with the deepest clinical documentation in the class',
      'MW differs by ~1 g/mol — check MS resolution on your COA',
    ],
    faqs: [
      {
        q: 'Is PT-141 the same as Melanotan II?',
        a: 'No. They share a cyclic heptapeptide core, but PT-141 has a free C-terminal carboxylic acid where MT-2 has an amide, giving it a distinct, more CNS-focused receptor profile in the literature.',
      },
      {
        q: 'Which is better documented clinically?',
        a: 'PT-141 (Bremelanotide) has one of the deepest clinical documentation sets among melanocortin peptides, while Melanotan II is more used as a broad research reference agonist.',
      },
      {
        q: 'How should these peptides be stored?',
        a: 'Both lyophilised at -20°C; MT-2 additionally protected from light. After reconstitution, refrigerate at 2–8°C and use PT-141 within 21 days.',
      },
    ],
    relatedProducts: ['melanotan-2', 'pt-141'],
    references: [
      {
        title: 'Synthetic melanotropic peptide initiates erections in men with psychogenic erectile dysfunction: double-blind, placebo controlled crossover study',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9679884/',
        authors: 'Wessells H, Fuciarelli K, Hansen J, et al.',
        journal: 'Journal of Urology',
        year: '1998',
        studyType: 'human trial',
      },
      {
        title: 'Bremelanotide for the treatment of hypoactive sexual desire disorder: two randomized phase 3 trials',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31599840/',
        authors: 'Kingsberg SA, Clayton AH, Portman D, et al.',
        journal: 'Obstetrics & Gynecology',
        year: '2019',
        studyType: 'human trial (phase 3)',
      },
    ],
  },
  {
    slug: 'epitalon-research-guide',
    title: 'Epitalon Research Guide: The Telomerase-Pathway Tetrapeptide',
    keyword: 'Epitalon research guide',
    description:
      'A laboratory guide to Epitalon (Epithalon): the Ala-Glu-Asp-Gly tetrapeptide, telomerase and pineal research literature, handling, and analytical verification for ageing research.',
    readingTime: '5 min read',
    published: '2026-07-30',
    updated: '2026-08-01',
    intro:
      'Epitalon (Ala-Glu-Asp-Gly) is a synthetic tetrapeptide based on epithalamin, a peptide preparation from the pineal gland. This Epitalon research guide covers what the published literature examines — telomerase activation and circadian regulation — how the defined synthetic molecule differs from the pineal extract, and the handling limits laboratories need. The compound is also spelled Epithalon; the two names refer to the same tetrapeptide.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'Published research examines Epitalon in telomerase-activation models, pineal and circadian regulation, and cellular senescence. The most-cited primary study is Khavinson, Bondarev and Butyugov (Bulletin of Experimental Biology and Medicine, 2003), which reported telomerase activity and telomere elongation in human somatic cells in vitro. Much of the foundational work originates from Russian gerontology programmes, and interest from Western laboratories has grown steadily. The evidence remains preclinical; no human use is approved or implied.',
        ],
      },
      {
        heading: 'Synthetic Tetrapeptide vs Pineal Extract',
        paragraphs: [
          'Epitalon is the defined synthetic tetrapeptide — four amino acids with an exact molecular weight of 390.35 g/mol. It should not be confused with epithalamin, the heterogeneous pineal extract from which it was derived. For reproducible research, the synthetic tetrapeptide is the correct tool: one molecule, one MS signature.',
        ],
      },
      {
        heading: 'Handling, Storage and Reconstitution',
        paragraphs: [
          'Peptide storage for Epitalon follows standard lyophilized peptide storage practice: -20°C, sealed and dry, where it is stable long-term. The standard peptide storage temperature after reconstitution is 2–8°C; use within 21 days. Peptide reconstitution uses bacteriostatic water added down the vial wall — as a small tetrapeptide it dissolves quickly with gentle swirling. Our reconstitution and storage guide covers the full protocol.',
          'For laboratories sourcing research peptides UK stock: Epitalon is listed on the product page with a batch-specific COA, supplied under research-use-only terms. As with any peptide supplier UK teams evaluate — including any peptide shop UK researchers shortlist — the documentation standard should be ≥99% HPLC purity plus MS identity at 390.35 g/mol.',
        ],
      },
    ],
    keyPoints: [
      'Epitalon = Ala-Glu-Asp-Gly, a defined synthetic tetrapeptide (390.35 g/mol)',
      'Literature: telomerase activation, pineal/circadian regulation, senescence — preclinical evidence',
      'Distinct from epithalamin pineal extract — use the defined molecule for reproducibility',
      'Also spelled Epithalon; same compound',
    ],
    faqs: [
      {
        q: 'What is Epitalon used for in research?',
        a: 'Published research examines Epitalon in telomerase-activation, circadian regulation and cellular ageing models. It is supplied strictly for laboratory research use only.',
      },
      {
        q: 'Are Epitalon and Epithalon the same?',
        a: 'Yes — two spellings of the same Ala-Glu-Asp-Gly tetrapeptide. Both differ from epithalamin, the pineal extract from which the peptide was derived.',
      },
      {
        q: 'How is Epitalon stored?',
        a: 'Lyophilised at -20°C; after reconstitution refrigerate at 2–8°C and use within 21 days.',
      },
    ],
    relatedProducts: ['epitalon', 'semax'],
    references: [
      {
        title: 'Epithalon peptide induces telomerase activity and telomere elongation in human somatic cells',
        url: 'https://pubmed.ncbi.nlm.nih.gov/12937682/',
        authors: 'Khavinson VKh, Bondarev IE, Butyugov AA',
        journal: 'Bulletin of Experimental Biology and Medicine',
        year: '2003',
        studyType: 'in-vitro study',
      },
    ],
  },
]

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug)
export const guidesForProduct = (productSlug: string) =>
  guides.filter((g) => g.relatedProducts.includes(productSlug))
