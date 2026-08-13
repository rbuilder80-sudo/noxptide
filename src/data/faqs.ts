/** FAQ content — single source for the FAQ page and its FAQPage structured data. */
export const faqGroups: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: 'Quality & Testing',
    items: [
      {
        q: 'What purity are your peptides?',
        a: 'Every peptide we sell is independently verified to ≥99% purity by HPLC, with molecular identity confirmed by mass spectrometry. Batches that do not meet this standard are never released for sale.',
      },
      {
        q: 'Can I see a Certificate of Analysis before ordering?',
        a: 'Yes. Contact us with the product name and we will send the current batch COA within one working hour — no account or purchase required. Every order also ships with its batch-specific COA in the box.',
      },
      {
        q: 'Who performs your analytical testing?',
        a: 'HPLC purity analysis and MS identity confirmation are performed by an independent analytical laboratory, separate from our synthesis and fulfilment operations.',
      },
      {
        q: 'How do I read a peptide Certificate of Analysis?',
        a: 'Start by matching the batch number on the COA to the one on your vial — a certificate without a matching batch proves nothing. Then check the HPLC purity result (ours is ≥99%) and the MS identity confirmation. Our guide "How to Read a Peptide COA" in the Research Guides section walks through every field.',
      },
    ],
  },
  {
    heading: 'Ordering & Delivery',
    items: [
      {
        q: 'How fast is UK delivery?',
        a: 'Orders placed before 4pm Monday–Friday are dispatched the same day. Standard tracked delivery takes 1–2 working days; next-working-day options are available at checkout. Delivery is free on orders over £25.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to most European countries with tracked international delivery. Customers are responsible for ensuring import compliance in their jurisdiction.',
      },
      {
        q: 'Is packaging discreet?',
        a: 'Yes. All orders ship in plain, tamper-evident packaging with no external indication of contents.',
      },
      {
        q: 'Do you offer volume discounts?',
        a: 'Yes — applied automatically at checkout: 20% off orders over £150 and 30% off orders over £500. For wholesale and institutional pricing, contact our team.',
      },
      {
        q: 'What is your money-back guarantee?',
        a: 'Every order is covered by a 7-day money-back guarantee. If anything arrives damaged or incorrect, contact us within 7 days of receipt and we will replace it or refund you in full.',
      },
      {
        q: 'Do you price match?',
        a: 'Yes. Find the same compound and batch documentation standard cheaper from another UK supplier and we will match it — contact us before ordering.',
      },
    ],
  },
  {
    heading: 'Storage & Handling',
    items: [
      {
        q: 'How should I store lyophilised peptides?',
        a: 'Store lyophilised peptides at -20°C for long-term stability (24+ months). Protect light-sensitive compounds such as GHK-Cu, Semax and Melanotan II from light. Our Research Guides section includes a complete peptide storage and reconstitution guide.',
      },
      {
        q: 'How do I reconstitute a lyophilised peptide?',
        a: 'Add the specified solvent slowly down the inside wall of the vial and allow the cake to dissolve gently — do not shake or vortex. Solvent choice and volumes depend on the compound; see the reconstitution guide in Research Guides and the compound-specific notes on each product page. Reconstitution guidance applies to laboratory research material only.',
      },
      {
        q: 'How long do peptides last after reconstitution?',
        a: 'Reconstituted peptides should be refrigerated at 2–8°C. Typical guidance is 14–28 days depending on the compound — see each product page for compound-specific storage guidance.',
      },
    ],
  },
  {
    heading: 'Legal & Compliance',
    items: [
      {
        q: 'Are your peptides for human use?',
        a: 'No. All Noxptide products are supplied strictly for in-vitro laboratory research purposes only. They are not medicines, supplements or cosmetics, and are not for human or veterinary use under any circumstances.',
      },
      {
        q: 'Who can purchase from Noxptide?',
        a: 'We supply laboratories, research institutions and qualified researchers. By ordering, you confirm the products will be used solely for lawful laboratory research in accordance with our Research Use Terms.',
      },
    ],
  },
]

export const allFaqs = faqGroups.flatMap((g) => g.items)
