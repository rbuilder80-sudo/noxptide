export interface GuideSection {
  heading: string
  paragraphs: string[]
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
  references: { title: string; url: string }[]
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
      'BPC-157 (Body Protection Compound-157) is a synthetic pentadecapeptide derived from a protective protein in human gastric juice. It is one of the most-ordered research peptides in the UK — and one of the most frequently mishandled. This guide covers what the literature examines, how to handle the compound correctly, and how to verify you are working with ≥99% pure material.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'The preclinical literature on BPC-157 is unusually broad for a single peptide. Published animal and in-vitro studies examine tendon-to-bone healing, muscle and ligament repair, gastrointestinal mucosal protection, and angiogenesis — the formation of new blood vessels, which several research groups have proposed as the mechanism linking these effects.',
          'Researchers frequently highlight its stability: unlike many peptides, BPC-157 remains active in gastric environments in published models, which is one reason gut-integrity research accounts for a large share of the literature. All findings remain preclinical; no human therapeutic use is approved or implied.',
        ],
      },
      {
        heading: 'Handling, Storage and Reconstitution',
        paragraphs: [
          'Lyophilised BPC-157 should be stored at -20°C, where it remains stable for 24 months or more. Avoid repeated freeze-thaw cycles and keep the vial sealed until use.',
          'For reconstitution, add bacteriostatic water slowly down the inside wall of the vial — never squirt directly onto the powder, and do not shake. Gentle swirling until fully dissolved preserves peptide integrity. Once reconstituted, refrigerate at 2–8°C and use within 28 days.',
        ],
      },
      {
        heading: 'Verifying Quality Before Your Study',
        paragraphs: [
          'Purity claims mean nothing without documentation. Before including BPC-157 in any protocol, confirm three things: the supplier\'s batch-specific Certificate of Analysis shows HPLC purity ≥99%; mass spectrometry confirms the molecular weight at 1419.53 g/mol; and the COA batch number matches the vial in your hand.',
          'Noxptide publishes this documentation with every order and will send the current batch COA before purchase on request — the standard every serious laboratory should demand.',
        ],
      },
      {
        heading: 'Frequently Paired Research Compounds',
        paragraphs: [
          'In the research literature, BPC-157 is most often examined alongside TB-500 (synthetic Thymosin Beta-4) in complementary tissue-repair models, as the two act through distinct pathways. Both compounds are stocked at ≥99% purity with full documentation.',
        ],
      },
    ],
    keyPoints: [
      'BPC-157 is a gastric-derived pentadecapeptide with a broad preclinical literature base',
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
      { title: 'BPC-157 research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157' },
      { title: 'BPC-157 and tendon healing literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+tendon' },
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
      'TB-500 is the synthetic research analogue of Thymosin Beta-4, a 43-amino-acid peptide involved in actin regulation and cell migration. It is a cornerstone of regenerative research — and one of the compounds UK laboratories reorder most. This guide covers the literature, correct handling, and how TB-500 differs from BPC-157 in research design.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'Published research on Thymosin Beta-4 spans cell migration, angiogenesis, cardiac repair and anti-inflammatory pathways. Its role in actin sequestration — regulating the cytoskeletal machinery cells use to move — underpins much of the migration and wound-repair literature.',
          'TB-500 concentrates the active region of the full-length protein, giving researchers a defined, synthesisable tool compound with consistent analytical characteristics.',
        ],
      },
      {
        heading: 'TB-500 vs BPC-157 in Research Design',
        paragraphs: [
          'These two compounds are frequently discussed together, but they are mechanistically distinct. BPC-157 is a 15-amino-acid gastric-derived peptide with a strong gastrointestinal and angiogenic literature; TB-500 is a 43-amino-acid thymic peptide centred on actin regulation and cell migration. Research programmes often examine both in parallel to cover complementary pathways.',
          'For analytical purposes, note the difference in molecular weight: TB-500 at 4963.49 g/mol versus BPC-157 at 1419.53 g/mol — mass spectrometry identity confirmation should match these values exactly on your COA.',
        ],
      },
      {
        heading: 'Handling, Storage and Reconstitution',
        paragraphs: [
          'Store lyophilised TB-500 at -20°C. Reconstitute with bacteriostatic water added gently down the vial wall, swirl — never shake — until dissolved, then refrigerate at 2–8°C and use within 21 days.',
          'Because of its larger molecular size, TB-500 can take slightly longer to dissolve than smaller peptides; patience and gentle swirling protect the compound.',
        ],
      },
    ],
    keyPoints: [
      'TB-500 is the synthetic analogue of Thymosin Beta-4, centred on actin regulation research',
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
      { title: 'Thymosin Beta-4 research on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4' },
      { title: 'Thymosin Beta-4 and tissue repair literature', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4+wound+healing' },
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
      '"BPC-157 vs TB-500" is one of the most-searched comparisons in UK peptide research — and one of the most poorly answered online. The honest answer is that the two compounds are not rivals but mechanistically distinct tools. This comparison gives research teams a clear basis for choosing one, the other, or both.',
    sections: [
      {
        heading: 'Mechanism and Origin: The Core Difference',
        paragraphs: [
          'BPC-157 is a 15-amino-acid synthetic peptide derived from a gastric protective protein. TB-500 is a synthetic analogue of Thymosin Beta-4, a 43-amino-acid peptide that regulates actin. Different origins, different sizes, different primary literature — which is precisely why they complement each other in research.',
        ],
      },
      {
        heading: 'Literature Coverage Compared',
        paragraphs: [
          'BPC-157\'s literature is strongest in gastrointestinal integrity, tendon-to-bone healing and angiogenesis. TB-500\'s is strongest in cell migration, cardiac and muscle repair models. If your programme focuses on gut models, the BPC-157 literature is deeper; for migration and cytoskeletal studies, TB-500 is the more direct tool.',
        ],
      },
      {
        heading: 'Handling and Analytics Compared',
        paragraphs: [
          'Both are supplied lyophilised and stored at -20°C. Key analytical difference: BPC-157 has a molecular weight of 1419.53 g/mol; TB-500 is 4963.49 g/mol — verify these exact values on the mass spectrometry section of your Certificate of Analysis. BPC-157 keeps 28 days after reconstitution; TB-500 should be used within 21.',
        ],
      },
      {
        heading: 'When Laboratories Study Both',
        paragraphs: [
          'Because the mechanisms do not overlap, many repair-focused programmes examine both compounds in parallel. When doing so, source both from the same supplier so analytical standards, documentation format and batch traceability are consistent across the study.',
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
      { title: 'BPC-157 literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157' },
      { title: 'Thymosin Beta-4 literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4' },
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
      'Ipamorelin and CJC-1295 (No DAC) are the two most-ordered secretagogues in UK endocrine research — and the pair most often studied together. This comparison explains the receptor-level difference, the selectivity that makes Ipamorelin unique, and what to verify on your Certificates of Analysis.',
    sections: [
      {
        heading: 'Two Receptors, One Axis',
        paragraphs: [
          'CJC-1295 (No DAC), also called Modified GRF 1-29, acts on the GHRH receptor. Ipamorelin acts on the ghrelin receptor (GHS-R1a). Both influence the same endocrine axis through different doors — the mechanistic basis for the combination research common in the literature.',
          'Ipamorelin is notable for selectivity: published research documents growth-hormone-releasing activity without the cortisol and prolactin effects seen with earlier GHRP-class compounds, making it a cleaner experimental tool.',
        ],
      },
      {
        heading: 'Modified GRF 1-29 vs CJC-1295 with DAC',
        paragraphs: [
          'A common sourcing error: "CJC-1295" without qualification can mean the DAC (Drug Affinity Complex) version, which has a dramatically extended half-life. Most research protocols call for the No-DAC form — Modified GRF 1-29 — which preserves physiological pulsatility. Check your COA and molecular weight (3367.9 g/mol) to confirm you have the correct analogue.',
        ],
      },
      {
        heading: 'Handling Comparison',
        paragraphs: [
          'Both are lyophilised and stored at -20°C. Reconstituted Ipamorelin keeps 21 days at 2–8°C; reconstituted CJC-1295 (No DAC) should be used within 14 days — the shorter window matters for protocol planning.',
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
      { title: 'Ipamorelin literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=ipamorelin' },
      { title: 'Modified GRF 1-29 literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=modified+GRF+1-29' },
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
      'Semax is a synthetic heptapeptide built on the ACTH(4-10) fragment with a stabilising Pro-Gly-Pro tail. Developed through decades of neuroscience research, it is the benchmark nootropic-class peptide in CNS research. This guide covers the literature, its light-sensitive handling requirements, and analytical verification.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'The Semax literature concentrates on neuroprotection (including ischemia models), neurotrophin expression — particularly BDNF — and CNS melanocortin signalling. Its Russian research heritage means a large body of work sits outside mainstream Western databases, but PubMed indexes a substantial and growing set of studies.',
        ],
      },
      {
        heading: 'Handling: Semax Is Light-Sensitive',
        paragraphs: [
          'Semax degrades faster under light exposure than most research peptides. Store the lyophilised powder at -20°C protected from light, minimise bench time in bright conditions, and refrigerate reconstituted solution at 2–8°C. Noxptide ships Semax in light-protective packaging for this reason.',
        ],
      },
      {
        heading: 'Frequently Paired: Selank',
        paragraphs: [
          'Semax is most often examined alongside Selank, the tuftsin-analogue heptapeptide, in parallel CNS research programmes. The two compounds share the Pro-Gly-Pro stability tail but have distinct origins and literature: ACTH fragment versus immunomodulatory tetrapeptide.',
        ],
      },
    ],
    keyPoints: [
      'Semax is an ACTH(4-10) analogue stabilised with Pro-Gly-Pro',
      'Literature focus: neuroprotection, BDNF, CNS melanocortin signalling',
      'Light-sensitive — store protected from light at -20°C',
      'Frequently studied in parallel with Selank',
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
      { title: 'Semax literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=semax' },
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
      'GHK-Cu — Copper Tripeptide-1 — is one of the oldest and best-documented research peptides in dermatological science. First isolated from human plasma, its literature spans collagen synthesis, extracellular matrix remodelling, antioxidant defence and wound repair. It also has a built-in quality signal most buyers never learn to read.',
    sections: [
      {
        heading: 'The Blue Colour Is a Quality Test',
        paragraphs: [
          'Properly chelated GHK-Cu is vivid blue — the colour of the copper complex itself. Pale, greyish or white material suggests incomplete chelation or degraded product. This makes GHK-Cu unusual: you can perform a first-pass quality check by eye before any instrument confirms it. Your COA should still show ≥99% HPLC purity and correct MS identity (403.9 g/mol).',
        ],
      },
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'Four decades of published work examine GHK-Cu in collagen and glycosaminoglycan synthesis, dermal remodelling, wound healing, antioxidant pathways and hair-follicle biology. It is among the most-cited cosmetic-science peptides — though Noxptide supplies it strictly for in-vitro research, not formulation use.',
        ],
      },
      {
        heading: 'Handling and Storage',
        paragraphs: [
          'Store lyophilised GHK-Cu at -20°C protected from light. Reconstitute with bacteriostatic water or the solvent specified for your assay, and refrigerate at 2–8°C after reconstitution. The blue colour should remain vivid in solution; fading suggests degradation.',
        ],
      },
    ],
    keyPoints: [
      'GHK-Cu is Copper Tripeptide-1 — glycyl-L-histidyl-L-lysine complexed with copper',
      'Vivid blue colour indicates proper copper chelation — a visible quality check',
      'Literature: collagen synthesis, matrix remodelling, wound repair, antioxidant defence',
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
      { title: 'GHK-Cu literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu' },
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
      'More research peptides are ruined by bad handling than by bad suppliers. This guide gives your laboratory a single, correct protocol: how to reconstitute lyophilised peptides, how long each compound keeps, and the five handling mistakes that destroy peptide integrity.',
    sections: [
      {
        heading: 'The Correct Reconstitution Protocol',
        paragraphs: [
          'Bring the vial to room temperature before opening to prevent condensation. Using a sterile syringe, draw bacteriostatic water and add it slowly down the inside wall of the vial — never directly onto the powder cake. Swirl gently until fully dissolved. Never shake: mechanical shear damages peptide bonds and causes aggregation.',
          'Larger peptides (TB-500 at 43 amino acids, Tesamorelin at 44) dissolve more slowly than small ones. Give them time and gentle swirling rather than force.',
        ],
      },
      {
        heading: 'Storage Temperatures and Shelf-Life Windows',
        paragraphs: [
          'Lyophilised peptides: -20°C for long-term storage (typically 24+ months), protected from light for sensitive compounds such as Semax, GHK-Cu and Melanotan II.',
          'Reconstituted peptides: refrigerate at 2–8°C. Windows vary by compound — BPC-157 keeps 28 days, TB-500 and Ipamorelin 21 days, CJC-1295 (No DAC) and Tesamorelin 14 days. Mark the reconstitution date on every vial.',
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
      { title: 'Peptide stability literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=lyophilized+peptide+stability+reconstitution' },
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
      'A Certificate of Analysis is the only thing separating a verified peptide from a promise. Yet most buyers never learn to read one. This guide explains each section of a peptide COA, what good results look like, and the red flags that should send you to a different supplier.',
    sections: [
      {
        heading: 'Section 1: HPLC Purity',
        paragraphs: [
          'High-Performance Liquid Chromatography separates your peptide from impurities and produces a chromatogram with peaks. The main peak should dominate; the reported purity (area percentage) should be ≥99% for research-grade material. A COA showing 98.1% or "≥98%" is telling you the batch failed a stricter standard.',
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
          'COAs only available "after purchase". Stock COAs with no batch number. Purity quoted without a chromatogram. No MS data. In-house-only testing with no independent verification. Any one of these should trigger questions; two or more should end the conversation.',
          'Noxptide supplies batch-specific COAs with every order and sends the current batch documentation before purchase on request — the standard this guide argues for.',
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
      'Melanotan II and PT-141 (Bremelanotide) share the same cyclic heptapeptide core and differ by a single functional group — yet that difference reshapes their research profiles. This comparison explains the structural relationship, receptor coverage in the literature, and when laboratories choose one over the other.',
    sections: [
      {
        heading: 'One Functional Group Apart',
        paragraphs: [
          'Melanotan II is Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2 — a C-terminal amide. PT-141 is the same cyclic core with a free C-terminal carboxylic acid. That single change shifts receptor behaviour documented in the literature, with PT-141 showing a more CNS-focused profile via the MC4R subtype.',
        ],
      },
      {
        heading: 'Receptor Coverage in the Literature',
        paragraphs: [
          'Melanotan II is used as a broad reference agonist with documented activity across melanocortin subtypes MC1R through MC5R — which is why pigmentation-pathway research (MC1R) and energy-homeostasis research (MC3R/MC4R) both cite it. PT-141\'s literature concentrates on MC4R-mediated central pathways, and it carries one of the deepest clinical documentation sets of any melanocortin peptide.',
        ],
      },
      {
        heading: 'Handling Differences',
        paragraphs: [
          'Both are lyophilised and stored at -20°C; Melanotan II should additionally be protected from light. After reconstitution, refrigerate both at 2–8°C; PT-141 should be used within 21 days. Verify molecular weights on your COA: MT-2 at 1024.2 g/mol, PT-141 at 1025.2 g/mol — a one-dalton difference your mass spectrometry must resolve correctly.',
        ],
      },
    ],
    keyPoints: [
      'Same cyclic core; PT-141 is the carboxylic-acid form of MT-2\'s amide',
      'MT-2: broad MC1R–MC5R reference agonist in the literature',
      'PT-141: MC4R-focused, CNS-weighted profile',
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
      { title: 'Melanotan II literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=melanotan+II' },
      { title: 'Bremelanotide literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=bremelanotide' },
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
      'Epitalon (Ala-Glu-Asp-Gly) is a synthetic tetrapeptide based on epithalamin, a peptide preparation from the pineal gland. Small molecule, big literature: it is one of the most discussed compounds in gerontology research, with studies examining telomerase activation and circadian regulation.',
    sections: [
      {
        heading: 'What the Research Literature Covers',
        paragraphs: [
          'Published research examines Epitalon in telomerase-activation models, pineal and circadian regulation, and cellular senescence. Much of the foundational work originates from Russian gerontology programmes; PubMed indexes the core studies, and interest from Western laboratories has grown steadily.',
        ],
      },
      {
        heading: 'Synthetic Tetrapeptide vs Pineal Extract',
        paragraphs: [
          'Epitalon is the defined synthetic tetrapeptide — four amino acids with an exact molecular weight of 390.35 g/mol. It should not be confused with epithalamin, the heterogeneous pineal extract from which it was derived. For reproducible research, the synthetic tetrapeptide is the correct tool: one molecule, one MS signature.',
        ],
      },
      {
        heading: 'Handling and Storage',
        paragraphs: [
          'Store lyophilised at -20°C; reconstitute with bacteriostatic water and refrigerate at 2–8°C, using within 21 days. As a small tetrapeptide it dissolves quickly with gentle swirling.',
        ],
      },
    ],
    keyPoints: [
      'Epitalon = Ala-Glu-Asp-Gly, a defined synthetic tetrapeptide (390.35 g/mol)',
      'Literature: telomerase activation, pineal/circadian regulation, senescence',
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
      { title: 'Epithalon literature on PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=epithalon' },
    ],
  },
]

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug)
export const guidesForProduct = (productSlug: string) =>
  guides.filter((g) => g.relatedProducts.includes(productSlug))
