export type Source = { claim: string; source: string; url?: string };

/** Grouped by chapter, in the order the claims appear. */
export const SOURCES: { chapter: string; items: Source[] }[] = [
  {
    chapter: "Susi (The key)",
    items: [
      {
        claim: "About 750,000 Palestinians were expelled or fled in 1948 (the Nakba).",
        source: "United Nations, The Question of Palestine",
        url: "https://www.un.org/unispal/about-the-nakba/",
      },
      {
        claim: "UN General Assembly Resolution 194 (December 1948) said refugees wishing to return should be permitted to.",
        source: "UN General Assembly Resolution 194 (III), paragraph 11",
        url: "https://en.wikipedia.org/wiki/United_Nations_General_Assembly_Resolution_194",
      },
      {
        claim: "Nearly 6 million registered Palestine refugees today.",
        source: "UNRWA, Palestine refugees",
        url: "https://www.unrwa.org/palestine-refugees",
      },
    ],
  },
  {
    chapter: "Boto (The vote)",
    items: [
      {
        claim: "Resolution 181 (II) passed 33–13 with 10 abstentions on 29 November 1947; the Philippines voted yes.",
        source: "UN Partition Plan for Palestine (overview with full roll call)",
        url: "https://en.wikipedia.org/wiki/United_Nations_Partition_Plan_for_Palestine",
      },
      {
        claim: "On 26 November Romulo indicated the Philippines would vote against partition; on 29 November it voted in favour.",
        source: "Foreign Relations of the United States, 1947, Vol. V, Doc. 910 (Lovett memo to Truman, 10 Dec 1947)",
        url: "https://history.state.gov/historicaldocuments/frus1947v05/d910",
      },
      {
        claim: "Romulo told the Assembly the Philippines could not support “political disunion and territorial dismemberment of Palestine”; reports of US pressure on Manila.",
        source: "UN Palestine Commission records (UNISPAL archive)",
        url: "https://www.un.org/unispal/document/auto-insert-210902",
      },
    ],
  },
  {
    chapter: "Pader (The wall)",
    items: [
      {
        claim: "The International Court of Justice found the West Bank wall contrary to international law (2004).",
        source: "ICJ Advisory Opinion, 9 July 2004",
        url: "https://www.icj-cij.org/case/131",
      },
      {
        claim: "ICJ provisional measures, 26 January 2024 (South Africa v. Israel).",
        source: "International Court of Justice, case 192",
        url: "https://www.icj-cij.org/case/192",
      },
      {
        claim: "ICC arrest warrants issued 21 November 2024.",
        source: "International Criminal Court, Situation in the State of Palestine",
        url: "https://www.icc-cpi.int/palestine",
      },
      {
        claim: "Famine confirmed in Gaza Governorate, August 2025.",
        source: "Integrated Food Security Phase Classification (IPC)",
        url: "https://www.ipcinfo.org/",
      },
      {
        claim: "UN Commission of Inquiry concluded in September 2025 that Israel committed genocide in Gaza.",
        source: "UN Independent International Commission of Inquiry on the OPT and Israel",
        url: "https://www.ohchr.org/en/hr-bodies/hrc/co-israel/index",
      },
      {
        claim: "More than 1,500 Palestinians killed since the October 2025 ceasefire; nearly all residents still in tents ahead of a fourth winter.",
        source: "OCHA, Humanitarian Situation Report, 22 October 2026",
        url: "https://www.ochaopt.org/content/humanitarian-situation-report-22-october-2026",
      },
    ],
  },
  {
    chapter: "Lakad (The walk)",
    items: [
      {
        claim: "Gaza: 365 km², about 41 km long, about 2.1 million people, about 7 in 10 of them refugees or their descendants.",
        source: "OCHA occupied Palestinian territory; UNRWA",
        url: "https://www.ochaopt.org/",
      },
      {
        claim: "13 October 2023 order for 1.1 million people north of Wadi Gaza to move south; Rafah sheltering about 1.4 million by early 2024.",
        source: "OCHA flash updates, October 2023 – February 2024",
        url: "https://www.ochaopt.org/",
      },
      {
        claim: "About 81% of structures in Gaza damaged or destroyed.",
        source: "UNOSAT comprehensive damage assessment, October 2025",
        url: "https://unosat.org/products/",
      },
    ],
  },
  {
    chapter: "Bilang (The count)",
    items: [
      {
        claim: "74,561 killed and 175,759 injured since 7 October 2023, as of 27 October 2026.",
        source: "Gaza Ministry of Health, as reported 27 October 2026 (see OCHA for the running series)",
        url: "https://www.ochaopt.org/",
      },
      {
        claim: "More than 17,000 children killed (ministry count, June 2025).",
        source: "Gaza Ministry of Health, via press reports, June 2025",
      },
      {
        claim: "Undercount: estimated traumatic deaths about 41% higher than the ministry count to 30 June 2024.",
        source: "Jamaluddine et al., The Lancet, January 2025",
        url: "https://doi.org/10.1016/S0140-6736(24)02678-3",
      },
    ],
  },
  {
    chapter: "Sining (The art)",
    items: [
      {
        claim: "Tatreez inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity (2021).",
        source: "UNESCO",
        url: "https://ich.unesco.org/en/RL/the-art-of-embroidery-in-palestine-practices-skills-knowledge-and-rituals-01722",
      },
      {
        claim: "Handala, created by Naji al-Ali in 1969; al-Ali was shot in London in 1987.",
        source: "Handala",
        url: "https://en.wikipedia.org/wiki/Handala",
      },
      {
        claim: "Gallery 79, Ramallah, closed by the Israeli army in 1980; artists told the flag's colours were banned, even in a watermelon. Sliman Mansour died 24 August 2026, aged 79.",
        source: "The National; Watermelon as a Palestinian symbol",
        url: "https://www.thenationalnews.com/arts-culture/art-design/2026/08/24/palestinian-artist-sliman-mansour-dies-aged-79/",
      },
      {
        claim: "12,350 kites flown at once by Gaza's children, 28 July 2011.",
        source: "Guinness World Records",
        url: "https://guinnessworldrecords.com/world-records/most-kites-flown-simultaneously",
      },
      {
        claim: "Refaat Alareer, poet and professor, killed in an Israeli airstrike on 6 December 2023.",
        source: "Refaat Alareer",
        url: "https://en.wikipedia.org/wiki/Refaat_Alareer",
      },
      {
        claim: "Spoliarium, Juan Luna, 1884, National Museum of Fine Arts, Manila.",
        source: "Spoliarium",
        url: "https://en.wikipedia.org/wiki/Spoliarium",
      },
      {
        claim: "Image of Spoliarium shown in the gallery: public domain (Juan Luna died in 1899).",
        source: "Wikimedia Commons, File:Spoliarium.jpg",
        url: "https://commons.wikimedia.org/wiki/File:Spoliarium.jpg",
      },
      {
        claim: "Village woman's dress, scarf and headdress from Ramallah, 19th century (C.I.39.91.18a–c), The Metropolitan Museum of Art; public domain, CC0. Image shown in the gallery.",
        source: "The Metropolitan Museum of Art",
        url: "https://www.metmuseum.org/art/collection/search/82693",
      },
    ],
  },
  {
    chapter: "Sinulid (The thread)",
    items: [
      {
        claim: "About 30,000 Filipinos work in Israel, most as caregivers.",
        source: "Filipinos in Israel; SunStar; Malaya",
        url: "https://en.wikipedia.org/wiki/Filipinos_in_Israel",
      },
      {
        claim: "Four Filipino caregivers killed on 7 October 2023; Jimmy Pacheco and Noralyn Babadilla held hostage and released.",
        source: "Daily Tribune, 13 October 2026; The Times of Israel",
        url: "https://tribune.net.ph/2026/10/13/filipinos-killed-in-7-october-attack-remembered",
      },
      {
        claim: "136 Filipinos in Gaza in November 2023; many would not leave without their Palestinian families.",
        source: "Department of Foreign Affairs via Daily Tribune and GMA News, November 2023",
        url: "https://tribune.net.ph/2023/11/19/dfa-26-pinoys-remain-in-gaza",
      },
      {
        claim: "Galaxy Leader: 17 Filipino crew held 19 Nov 2023 – 22 Jan 2025.",
        source: "Gulf News, January 2025",
        url: "https://gulfnews.com/world/mena/houthis-free-galaxy-leader-crew-17-filipinos-3-ukrainians-2-mexicans-2-bulgarians-and-romanian-held-captive-for-over-year-1.500020909",
      },
      {
        claim: "Two Filipino seafarers killed on the True Confidence, March 2024.",
        source: "Philstar, 8 March 2024",
        url: "https://www.philstar.com/headlines/2024/03/08/2338989/2-pinoys-killed-2-critical-houthi-attack",
      },
      {
        claim: "Filipino crew among the dead, missing and captured when the Eternity C sank, July 2025.",
        source: "South China Morning Post",
        url: "https://www.scmp.com/news/world/middle-east/article/3317617/ship-attacked-yemens-houthis-sinks-red-sea-6-25-mostly-filipino-crew-rescued",
      },
      {
        claim: "Philippine UN votes: abstained 27 Oct 2023; yes 12 Dec 2023; yes on the New York Declaration, 12 Sep 2025.",
        source: "Inquirer; Philstar",
        url: "https://globalnation.inquirer.net/291546/ph-backs-un-resolution-on-2-state-solution-on-palestine-israel",
      },
      {
        claim: "The eight rays of the Philippine sun stand for the first eight provinces to revolt against Spain.",
        source: "Flag of the Philippines (Republic Act 8491)",
        url: "https://en.wikipedia.org/wiki/Flag_of_the_Philippines",
      },
    ],
  },
  {
    chapter: "Halaga (The price)",
    items: [
      {
        claim: "Rebuilding Gaza will cost about $71.4 billion over ten years.",
        source: "UN, EU and World Bank damage and needs assessment, April 2026 (via CP24/AFP)",
        url: "https://www.cp24.com/news/world/2026/04/20/over-us71-bn-needed-over-next-decade-to-rebuild-gaza-un-eu/",
      },
      {
        claim: "Houthi forces attacked Red Sea shipping from late 2023, saying they acted in support of Gaza.",
        source: "Global News, December 2023",
        url: "https://globalnews.ca/news/10176725/houthi-red-sea-attacks/",
      },
      {
        claim: "Shipping lines rerouted Asia–Europe trade around southern Africa.",
        source: "CNBC, 19 December 2023",
        url: "https://www.cnbc.com/2023/12/19/houthi-attacks-in-red-sea-maersk-begins-rerouting-via-southern-africa.html",
      },
      {
        claim: "Suez Canal revenue fell from $9.4 billion (FY2022/23) to $7.2 billion (FY2023/24).",
        source: "Business Today Egypt, citing the Suez Canal Authority",
        url: "https://businesstodayegypt.com/amp/1/4843/Suez-Canal-revenues-fell-to-7-2B-in-FY23-24",
      },
      {
        claim: "The 2026 war on Iran all but closed the Strait of Hormuz (about a fifth of world oil); the IEA called it the largest supply disruption in the oil market's history; Brent rose from about $72 to about $118; 84% of crude through Hormuz goes to Asia.",
        source: "2026 Iran war fuel crisis (with its cited sources)",
        url: "https://en.wikipedia.org/wiki/2026_Iran_war_fuel_crisis",
      },
      {
        claim: "About 98% of Philippine crude imports come from the Middle East (DOE).",
        source: "OneNews, 12 March 2026",
        url: "https://www.onenews.ph/articles/phl-eyes-alternative-oil-suppliers",
      },
      {
        claim: "About 2.4 million Filipinos live and work in the Middle East.",
        source: "GMA News Research, 1 March 2026",
        url: "https://www.gmanetwork.com/news/pinoyabroad/dispatch/982588/filipinos-repatriation-middle-east-dmw/story",
      },
      {
        claim: "Diesel cost about ₱56.50 a litre in February 2026.",
        source: "GlobalPetrolPrices.com, reading for 9 February 2026",
        url: "https://www.globalpetrolprices.com/Philippines/diesel_prices/",
      },
      {
        claim: "State of national energy emergency declared on 24 March 2026 (Executive Order No. 110), the first country to declare one over the war.",
        source: "2026 Philippine energy crisis (with its cited sources)",
        url: "https://en.wikipedia.org/wiki/2026_Philippine_energy_crisis",
      },
      {
        claim: "Metro Manila diesel at ₱105.00–₱131.90 a litre (common price ₱119.20), 24–30 March 2026.",
        source: "Philstar Price Watch, 31 March 2026 (DOE monitoring)",
        url: "https://www.philstar.com/headlines/2026/03/31/2517935/price-watch-diesel-p12-liter-oil-firms-impose-new-hikes",
      },
      {
        claim: "Metro Manila diesel at ₱153.70 a litre in the week of 7 April 2026, the highest on record; ₱93.30 in the week of 20–26 October 2026.",
        source: "Expressway.ph fuel price history (DOE Metro Manila monitoring)",
        url: "https://www.expressway.ph/fuel-prices/history",
      },
      {
        claim: "LTFRB approved a jeepney fare increase as diesel passed ₱100 a litre.",
        source: "Daily Tribune, 16 March 2026",
        url: "https://tribune.net.ph/2026/03/16/ltfrb-approves-jeepney-fare-hike",
      },
      {
        claim: "Headline inflation rose from 2.4% (February 2026) to 7.2% (April 2026), a three-year high.",
        source: "Philippine Statistics Authority, via Trading Economics",
        url: "https://tradingeconomics.com/philippines/inflation-cpi",
      },
      {
        claim: "The oil price surge may push 1.34 million Filipinos into poverty (up to 3.1 million in worse scenarios).",
        source: "Philippine Institute for Development Studies, April 2026",
        url: "https://pids.gov.ph/details/news/press-releases/oil-price-surge-may-push-1-34-million-filipinos-into-poverty-pids",
      },
    ],
  },
];
