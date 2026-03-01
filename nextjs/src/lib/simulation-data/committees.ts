export interface Committee {
    id: string;
    name: string;
    topicGroups?: string[] | string[][]; // Some are arrays of strings, some arrays of arrays (fantasy)
    members?: string[];
    subIssues?: string[];
    fantasy?: boolean;
    universes?: any[];
    displayOrder?: string[];
    // Resolved properties
    universeName?: string;
    topic?: string;
}

export const committees: Committee[] = [
    {
        id: "ep",
        name: "EP",
        topicGroups: [
            "The Question of Addressing the Socio-Economic Impact of Inflation and the Rising Cost of Living on Vulnerable Populations across Europe",
            "The Question of Standardization in Policies Across Europe to Prevent Poverty Driven Cycles of Crime",
            "The Question of Standardizing Migration and Asylum Policies to Uphold the Principle of National Sovereignty while Ensuring the Protection of Vulnerable Migrant and Refugee Populations",
            "The Question of Increased Scholarship Programmes to Aid in Migrant Integration",
            "The Question of Regulating Digital Access and Safeguarding Minors from Online Harms and Exploitation",
            "The Question of Harmonizing Core Educational Standards within the European Union to Ensure Equitable Quality and Labor Market Readiness",
            "The Question of Establishing Comprehensive Global Frameworks for the Prevention and Treatment of Adolescent Substance Use Disorder",
            "The Question of Ensuring Equitable Access to Safe and Adequate Government Housing and Clarifying International Standards for Minors' Legal Emancipation in Europe",
            "The Question of Establishing a Unified European Approach to the Decriminalization, Regulation, and Protection of Sex Workers",
            "The Question of Strengthening Anti-Corruption Mechanisms and Promoting Good Governance within European Member States",
        ],
        members: [
            "France", "Germany", "Italy", "Spain", "Poland", "Netherlands",
            "Belgium", "Greece", "Portugal", "Sweden", "Austria", "Denmark"
        ],
        subIssues: [
            "Addressing economic disparities and social protection mechanisms.",
            "Ensuring cross-border policy coordination and harmonization.",
            "Protecting vulnerable populations while maintaining national sovereignty.",
        ],
    },
    {
        id: "us-senate",
        name: "US Senate",
        topicGroups: [
            "The Question of Medicaid and Nationwide Legislation to Protect Less Fortunate Populations",
            "The Question of Regulating and Protecting Undocumented Immigrants in Healthcare Systems",
            "The Question of Establishing National Standards and Mechanisms to Guarantee Universal Access to Quality Education Focused on Fostering Critical Thinking and Media Literacy Skills",
            "The Question of Fostering Enhanced Inter-Agency and National Collaboration to Develop and Implement Data-Driven Strategies for the Effective Reduction of Violent Crime Rates",
            "The Question of Upholding the Right to Peaceful Assembly while Standardizing Ethical Guidelines for Public Order Management and Intervention in Civil Emergencies",
            "The Question of Addressing Systemic Racism and Ensuring Judicial Equality and Due Process in Law Enforcement Practices",
            "The Question of the Legality and Morality of Capital Punishment and its Application under International Human Rights Law",
            "The Question of Prioritizing Rehabilitative and Restorative Justice Models Over Punitive Sentencing in National Judicial Systems",
            "The Question of Developing Comprehensive National Strategies to Address and Prevent Targeted Violence in Educational Institutions",
            "The Question of Establishing National Guidelines for the Regulation of Small Arms and Light Weapons to Minimize Civilian Misuse",
        ],
        members: [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
            "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
            "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana"
        ],
        subIssues: [
            "Balancing federal and state authority in policy implementation.",
            "Ensuring equitable access and protection for all citizens.",
            "Addressing systemic inequalities while maintaining constitutional principles.",
        ],
    },
    {
        id: "ecosoc",
        name: "ECOSOC",
        topicGroups: [
            "The Question of Evaluating the Feasibility and Implementation of a Globally Coordinated Universal Basic Income (UBI) Programme as a Strategy for Poverty Eradication and Economic Stability",
            "The Question of Exploring International Mechanisms for Reallocating Military Expenditures Towards the Development and Strengthening of Global Public Health Systems",
            "The Question of Fostering Lifelong Learning and Economic Development through Universal Access to Subsidized Educational Financing",
            "The Question of Establishing International Guidelines to Protect the Financial Assets and Privacy of Minors in Digital Banking Environments",
            "The Question of Ensuring Equitable Financial Inclusion and Mitigating Technological Marginalization in the Global Transition toward Digital Currencies",
            "The Question of Enhancing Cybersecurity Standards and Upholding Consumer Data Protection in the International Digital Financial Sector",
            "The Question of Establishing Global Mechanisms to Combat Corporate Tax Avoidance and Ensure Fair and Proportionate International Taxation",
            "The Question of Developing Comprehensive Reintegration Programmes and Financial Support Systems to Reduce Recidivism among Former Incarcerated Individuals",
            "The Question of Enhancing Social Security Programme Integrity and Ensuring Equitable Distribution of State-Provided Benefits to Vulnerable Populations",
            "The Question of Reassessing and Standardizing Poverty Thresholds and Eligibility Criteria for Essential Social Programmes, including Subsidized Childcare",
        ],
        members: [
            "Algeria", "Argentina", "Brazil", "Canada", "Egypt", "Ghana",
            "Kenya", "Mexico", "Nigeria", "Norway", "South Africa", "United States"
        ],
        subIssues: [
            "Promoting economic development and social progress.",
            "Addressing global economic inequalities and financial inclusion.",
            "Ensuring sustainable development and poverty eradication.",
        ],
    },
    {
        id: "hsc",
        name: "HSC",
        topicGroups: [
            "SARS Outbreak (2002-2004)",
            "The Black Death (1346-1353)",
            "The September 11 Attacks (2001)",
            "The East African Embassy Bombings (1998)",
        ],
        members: [
            "China", "France", "United Kingdom", "United States", "Russia",
            "Algeria", "Argentina", "Brazil", "Ghana", "India", "Japan", "Norway"
        ],
        subIssues: [
            "Analyzing historical context and decision-making processes.",
            "Evaluating international response mechanisms and coordination.",
            "Assessing long-term implications and lessons learned.",
        ],
    },
    {
        id: "icj",
        name: "ICJ",
        topicGroups: [
            "Obligations concerning Negotiations relating to Cessation of the Nuclear Arms Race and to Nuclear Disarmament (Marshall Islands v. UK, India, Pakistan)",
            "Application of the Convention on the Prevention and Punishment of the Crime of Genocide (The Gambia v. Myanmar; South Africa v. Israel)",
            "Nuclear Tests Cases (Australia/New Zealand v. France)",
            "Nottebohm Case (Liechtenstein v. Guatemala)",
        ],
        members: [
            "Australia", "Brazil", "China", "France", "Germany", "India",
            "Japan", "Mexico", "Morocco", "Russia", "United Kingdom", "United States"
        ],
        subIssues: [
            "Examining legal principles and international law application.",
            "Assessing state obligations and compliance mechanisms.",
            "Evaluating judicial procedures and evidence standards.",
        ],
    },
    {
        id: "interpol",
        name: "Interpol",
        topicGroups: [
            "The Question of Disrupting Transnational Organized Crime Networks Engaged in the Exploitation of Minors",
            "The Question of Coordinating Law Enforcement Responses to the Global Proliferation of New Psychoactive Substances (NPS) and Adulterated Drugs",
            "The Question of Combating Individual Bribery and Corporate Corruption in Global Supply Chains for Illicit Goods",
            "The Question of Establishing Mechanisms for Law Enforcement to Monitor and Interdict Illicit Operations Using Private Vessels and Cargo Aircraft on Habitual Routes",
            "The Question of Enhancing Global Law Enforcement Capacity for the Prevention, Detection, and Investigation of Biological and Agro-Terrorism",
            "The Question of Disrupting the Convergence of Illicit Markets and Transnational Organized Crime Networks in the Mekong Sub-Region",
            "The Question of Assessing the Efficacy of Prevention Initiatives and Rehabilitation Programs in Global Crime Mitigation",
            "The Question of Evaluating Best Practices for Progressive Correctional Treatment and Reducing Post-Incarceration Offending",
            "The Question of Enhancing Global Operational Capacity to Investigate and Disrupt Transnational Cybercrime Networks",
            "The Question of Dismantling Cross-Border Organized Crime Groups Engaged in Human Trafficking and Modern Slavery",
        ],
        members: [
            "Argentina", "Australia", "Brazil", "Canada", "China", "France",
            "Germany", "India", "Japan", "Mexico", "Nigeria", "United Kingdom", "United States"
        ],
        subIssues: [
            "Strengthening international police cooperation and information sharing.",
            "Combating transnational organized crime and terrorism.",
            "Enhancing law enforcement capacity and coordination.",
        ],
    },
    {
        id: "unodc",
        name: "UNODC",
        topicGroups: [
            "The Question of Strengthening International Cooperation to Prevent Future Opioid Crises by Enhancing Real-Time Data Sharing, Disrupting the Illicit Manufacture and Trafficking of New Psychoactive Substances (NPS), and Expanding Access to Scheduled Medications for Pain Management and Evidence-Based Treatment",
            "The Question of Establishing a Universal Regulatory Framework for the Legalization and State Control of All Psychoactive Substances, and Mandating the Integration of Comprehensive Harm Reduction and Decriminalization Measures to Prioritize Public Health and Encourage Voluntary Recovery",
            "The Question of Mitigating the Potential for an Illicit Tobacco Market by Strengthening Cross-Border Law Enforcement Cooperation and Implementing Robust Anti-Money Laundering Measures in Response to Policies Prohibiting the Sale of Tobacco to Future Generations",
            "The Question of Integrating Evidence-Based Treatment and Prevention Strategies into National Criminal Justice Systems to Address Alcohol Use Disorders and Reduce Alcohol-Related Crime, Violence, and Recidivism",
            "The Question of Promoting Evidence-Based Treatment and Rehabilitation Services for Individuals with Drug Use Disorders",
            "The Question of Developing Comprehensive Prevention Strategies and Specialized Care for Neonatal Opioid Withdrawal Syndrome (NOWS)",
            "The Question of Integrating Crime Prevention and Drug Control Policies to Reduce Drug-Related Offending in High-Risk Communities",
            "The Question of Strengthening International Cooperation and Law Enforcement Capacity to Disrupt the Illicit Drug Trade on the Dark Web",
            "The Question of Policy Analysis of Alternatives to Conviction and Punishment for Drug Possession for Personal Use",
            "The Question of Mitigating Environmental Degradation and Ecosystem Damage Resulting from Illicit Drug Cultivation and Production",
        ],
        members: [
            "Argentina", "Australia", "Brazil", "Canada", "China", "Colombia",
            "France", "Germany", "India", "Mexico", "Nigeria", "United Kingdom", "United States"
        ],
        subIssues: [
            "Balancing drug control with public health approaches.",
            "Strengthening international cooperation and law enforcement.",
            "Addressing root causes and prevention strategies.",
        ],
    },
    {
        id: "cstd",
        name: "CSTD",
        topicGroups: [
            "The Question of Promoting Equitable Access to and Ethical Development of Neuro-Nanotechnologies to Advance Rehabilitation and Improve the Quality of Life for Persons with Disabilities",
            "The Question of the Ethical Governance and Regulation of Emerging Technologies while Fostering International Collaboration in Scientific Research and Development",
            "The Question of Developing Ethical and Inclusive Frameworks for the Integration of Artificial Intelligence into Global Education Systems",
            "The Question of Addressing the Challenge of AI-Driven Technological Unemployment by Promoting Reskilling Initiatives and Establishing New Social Safety Nets for the Future of Work",
            "The Question of Policy Frameworks for Leveraging Artificial Intelligence to Accelerate the SDGs While Addressing Socio-Economic Disruption and Ethical Concerns",
            "The Question of Developing Multi-Stakeholder Cooperative Systems for Global Cybersecurity Resilience and the Protection of Personal Data",
            "The Question of Fostering Responsible Innovation in Digital Platforms to Protect Adolescent Mental Health and Data Privacy",
            "The Question of Designing Innovative Financing Mechanisms and Loan Programmes to Support Technology Start-Ups Contributing to the SDGs",
        ],
        members: [
            "Brazil", "China", "Egypt", "France", "Germany", "India",
            "Japan", "Kenya", "Mexico", "Russia", "South Africa", "United States"
        ],
        subIssues: [
            "Promoting equitable access to technology and innovation.",
            "Addressing ethical concerns and regulatory frameworks.",
            "Ensuring technology serves sustainable development goals.",
        ],
    },
    {
        id: "unsc",
        name: "UNSC",
        topicGroups: [
            "The Question of Establishing International Norms and Safeguards to Prevent the Undue Politicization of Access to and Control over Critical and Emerging Technologies",
            "The Question of Fostering Public-Private and Inter-State Partnerships to Facilitate the Equitable Transfer and Dissemination of Essential Technologies to Developing Nations",
            "The Question of Addressing the Role of Unregulated Weapons in Fueling Internal Conflicts and Threatening Civilian Populations",
            "The Question of Strengthening Implementation of Resolutions on Conflict-Related Sexual Violence (CRSV) and Ensuring Gender-Inclusive Victim Assistance",
            "The Question of Addressing the Role of Education and Information Management in Preventing Youth Radicalization and Extremism",
            "The Question of Developing and Standardizing Best Practices for Peacekeeping Operations to Ensure Scalable and Sustainable Global Implementation",
        ],
        members: [
            "China", "France", "United Kingdom", "United States", "Russia",
            "Algeria", "Argentina", "Brazil", "Ghana", "India", "Japan", "Norway", "Qatar"
        ],
        subIssues: [
            "Maintaining international peace and security.",
            "Addressing threats to peace and conflict prevention.",
            "Strengthening peacekeeping and conflict resolution mechanisms.",
        ],
    },
    {
        id: "unhrc",
        name: "UNHRC",
        topicGroups: [
            "The Question of the Promoting and Accelerating the Universal Abolition of the Death Penalty and Respect for the Right to Life",
            "The Question of The Obligation to Prevent Cruel, Inhuman or Degrading Treatment Arising from Deficiencies in Prison Administration and Justice Systems",
            "The Question of Examining Measures to Combat Hate Speech and Targeted Abuse, Ensuring Consistency with Article 19 of the International Covenant on Civil and Political Rights (ICCPR) and Respecting the Principle of National Sovereignty",
            "The Question of The Role of Educational Curricula, Including Social and Emotional Learning (SEL), in Fostering Tolerance, Combating Ideological Intolerance, and Preventing the Transmission of Discriminatory Beliefs in Primary and Secondary Education",
            "The Question of Implementing Legislative and Policy Measures to Prohibit and Penalize the Practice of So-Called 'Conversion Therapy' on the Basis of Sexual Orientation and Gender Identity",
            "The Question of Recommending Strategies for Member States to Repeal Punitive Legislation that Criminalizes Consensual Same-Sex Relations, Sexual Orientation, or Gender Identity",
            "The Question of Ensuring the Full and Equal Enjoyment of Human Rights for Persons with Disabilities, with a Focus on Mandating Accessible Infrastructure, Information, and Communication in Public Spaces",
            "The Question of Integrating Differentiated and Needs-Based Support Systems into Mainstream Educational Curricula to Uphold the Right to Education for Neurodivergent Students",
        ],
        members: [
            "Argentina", "Brazil", "Canada", "Egypt", "France", "Germany",
            "Ghana", "Kenya", "Mexico", "Norway", "Qatar", "South Africa"
        ],
        subIssues: [
            "Protecting and promoting human rights globally.",
            "Addressing discrimination and ensuring equality.",
            "Strengthening human rights mechanisms and compliance.",
        ],
    },
    {
        id: "disec",
        name: "DISEC",
        topicGroups: [
            "The Question of Strengthening International Protocols and Logistics for Securing the Cross-Border Transport of Weapons of Mass Destruction (WMDs) and Related Materials",
            "The Question of Developing Mechanisms to Prevent the Diversion of Legally Traded Conventional Arms to Illicit Markets and Non-State Actors",
            "The Question of Strengthening International Cooperation and Capacity for the Clearance of Explosive Remnants of War (ERW) and Improvised Explosive Devices (IEDs)",
            "The Question of Strengthening the International Monitoring System to Detect and Deter Unauthorized Nuclear Weapon Testing",
            "The Question of Strengthening International Standards for the Disposal of Weapons to Mitigate the Risk of Diversion to Illicit Trafficking Networks",
            "The Question of Strengthening Controls on High-Risk Precursor Chemicals to Mitigate the Threat of Improvised Explosive Devices (IEDs) by Non-State Actors",
        ],
        members: [
            "China", "France", "Germany", "India", "Indonesia", "Japan",
            "Mexico", "Nigeria", "United Kingdom", "United States", "Qatar", "South Africa"
        ],
        subIssues: [
            "Promoting disarmament and non-proliferation.",
            "Preventing arms diversion and illicit trafficking.",
            "Strengthening international security cooperation.",
        ],
    },
    {
        id: "unicef",
        name: "UNICEF",
        topicGroups: [
            "The Question of Developing and Implementing Coordinated International Strategies to Combat Child Trafficking and Exploitation in Underage Sex Work",
            "The Question of Establishing a Global Framework to Prohibit and Eradicate Child, Early, and Forced Marriage and to Protect the Rights and Autonomy of Minors",
            "The Question of Examining Measures to Transition Away from Institutional Care, Prohibiting For-Profit Children's Homes, and Strengthening Oversight of Foster Care Settings to Prevent Abuse and Exploitation",
            "The Question of Developing Policy Frameworks to Guarantee Accessible and Equitable Primary and Secondary Education, with a Focus on Eliminating Financial Barriers and Promoting Fair Assessment for Vulnerable Applicants",
            "The Question of Strengthening Maternal, Neo-Natal, and Post-Partum Healthcare Systems to Significantly Reduce Preventable Maternal and Infant Mortality and Morbidity",
            "The Question of Recommending Policy Frameworks to Encourage Employer-Supported Flexible Work Arrangements and Parental Leave to Facilitate Early Childhood Development and Strengthen Parent-Child Bonding",
            "The Question of Exploring the Feasibility of Implementing Conditional or Universal Basic Child Income Transfers to Uphold the Child's Right to an Adequate Standard of Living and Promote Adolescent Well-being through Autonomous Access to Non-Essential Items",
            "The Question of Developing International Guidelines and Training Frameworks for Teachers and Staff to Safely Identify, Report, and Refer Cases of Child Abuse, Ensuring the Best Interests of the Child in Situations Where Direct Parental Notification is Detrimental",
        ],
        members: [
            "Bangladesh", "Brazil", "China", "Egypt", "Ethiopia", "India",
            "Indonesia", "Kenya", "Mexico", "Nigeria", "Pakistan", "United States"
        ],
        subIssues: [
            "Protecting children's rights and well-being.",
            "Ensuring access to education and healthcare.",
            "Preventing exploitation and abuse of children.",
        ],
    },
    {
        id: "un-women",
        name: "UN Women",
        topicGroups: [
            "The Question of Affirming and Guaranteeing Women's Reproductive Autonomy by Establishing International Legal Standards on Access to Safe and Legal Abortion with Respect for Cultural and Religious Diversity",
            "The Question of Examining the Recognition of Universal Childcare as a Fundamental Human Right and its Role in Addressing Declining Birth Rates and Supporting Gender Equality in the Workforce",
            "The Question of Developing International Standards and Oversight Mechanisms to Prevent Gender-Based Harassment, Abuse, and Discrimination Against Women in Public and Private Sector Employment",
            "The Question of Mandating All Public and Private Bathrooms to Provide Free, Quality, and Safe Menstruation Products",
            "The Question of Training Healthcare Professionals and Community Workers to Safely Identify Domestic Violence and Address it Effectively",
            "The Question of Mandating the Provision of Free, Accessible, and Quality Menstrual Products in Public Institutions and Workplaces to Combat Period Poverty and Uphold Women's Dignity",
            "The Question of Enhancing the Provision of Essential Sexual and Reproductive Health Services, Including Accessible Menstrual Hygiene Management (MHM) Supplies and Education, in Conflict and Post-Conflict Settings",
            "The Question of Strengthening Measures to Safeguard the Health and Security of Pregnant Women and New Mothers, Including the Establishment and Funding of Dedicated, Gender-Sensitive Protection Facilities and Services During and In Areas of Conflict",
            "The Question of Mandating the Universal Provision of Free Contraceptives and Ensuring Free, Accessible, Comprehensive, and Non-Judgmental Sexual Education Programmes to Prevent Teen and Unwanted Pregnancy",
            "The Question of Examining Measures to Eliminate Age-Based Restrictions on the Purchase and Provision of Contraceptives and Pregnancy Tests, Ensuring Financial Affordability and Comprehensive Coverage for All Women and Adolescent Girls",
        ],
        members: [
            "Argentina", "Bangladesh", "Brazil", "Canada", "Egypt", "France",
            "Germany", "India", "Kenya", "Mexico", "Nigeria", "Sweden", "United States"
        ],
        subIssues: [
            "Promoting gender equality and women's empowerment.",
            "Protecting women's rights and preventing gender-based violence.",
            "Ensuring access to healthcare and reproductive rights.",
        ],
    },
    {
        id: "who",
        name: "WHO",
        topicGroups: [
            "The Question of Developing International Standards and Regulatory Oversight to Enhance Diagnostic Accuracy and Prevent Misdiagnoses in Mental Health Practice",
            "The Question of Examining the Ethical and Regulatory Landscape for the Clinical Use of Psychedelic Drugs in the Treatment of Trauma-Based Mental Health Conditions",
            "The Question of Examining Measures to Safeguard Patient Autonomy, Uphold Professional Integrity, Prioritize Personal and Cultural Factors, and Ensure the Protection of Human Rights in the Context of Euthanasia and Assisted Suicide",
            "The Question of Developing and Promoting International Guidelines for Member States to Enhance the Accessibility of Public Services and Mandate Reasonable Accommodations for Employees Living with Chronic Illnesses",
            "The Question of Strengthening Strategies for Developing and Implementing Standardized Training and Educational Programmes for Informal Caregivers to Enhance Quality of Life and Support Health Systems Resilience",
            "The Question of Examining Policy Measures for Financial Support and Subsidies to Facilitate and Prioritize Palliative Care and Long-Term Care Delivery within the Home Setting",
            "The Question of Developing and Implementing Mechanisms to Ensure the Safe, Timely, and Equitable Access and Delivery of Essential Medicines and Medical Supplies in Areas Affected by Armed Conflict",
            "The Question of Establishing International Standards and Guidelines for the Development, Regulation, and Security of Resilient Healthcare Infrastructure to Safeguard High-Risk Patients and Essential Health Workers",
            "The Question of Developing Integrated Policy Frameworks to Regulate Emergency Healthcare Costs and Implement Social Safety Nets to Mitigate and Resolve Medical Debt for Vulnerable and Low-Income Populations",
            "The Question of Developing Global Standards for the Design and Modernization of Health Facilities to Optimize Patient-Centered Environments, Enhance Recovery, and Promote Mental Health, Well-being, and Comfort for Patients and Visitors",
        ],
        members: [
            "Canada", "China", "Egypt", "France", "Germany", "India",
            "Indonesia", "Japan", "Mexico", "Nigeria", "South Africa", "United Kingdom", "United States"
        ],
        subIssues: [
            "Promoting global health and preventing disease.",
            "Ensuring equitable access to healthcare services.",
            "Strengthening health systems and emergency response.",
        ],
    },
    {
        id: "unep",
        name: "UNEP",
        topicGroups: [
            "The Question of Maximizing Wind and Solar Energy to Minimize Negative Environmental and Economic Impact",
            "The Question of Protecting Endangered Species in Developing Nations While Emphasizing the Need for Wild Animals to Experience Natural Development",
            "The Question of Combating Rising Temperatures in the Arctic and Preventing Ocean Acidification",
            "The Question of Protecting Sensitive Island Ecosystems from Invasive Species and Recovering Ecosystems That Were Damaged",
            "The Question of Combatting Excess Methane Emissions and Developing Mechanisms to Reduce Agricultural Waste",
            "The Question of Protecting Vulnerable Marine Life from Improper Fishing Practices",
            "The Question of Developing Regulations to Permanently Reduce Environmental Impacts Caused by AI and Data Centers",
            "The Question of Evaluating Natural and Non-Renewable Energy Sources to Determine Idealistic Renewable Energy Alternatives",
        ],
        members: [
            "Australia", "Brazil", "Canada", "China", "France", "Germany",
            "India", "Japan", "Kenya", "Mexico", "Nigeria", "United States"
        ],
        subIssues: [
            "Protecting the environment and promoting sustainability.",
            "Addressing climate change and biodiversity loss.",
            "Promoting renewable energy and sustainable practices.",
        ],
    },
    {
        id: "unesco",
        name: "UNESCO",
        topicGroups: [
            "The Question of Developing and Standardizing Inclusive Education Policies and Necessary Accommodations to Ensure Full and Equitable Access to Learning for Neurodivergent Students",
            "The Question of Establishing Guidelines for the Mandatory and Comprehensive Integration of Historical Failures, Atrocities, and Human Rights Violations into National Education Curricula to Promote Reconciliation and Prevent Future Recurrence",
            "The Question of Developing Bilingual Education Programs in All International Schools",
            "The Question of Preventing Cultural Stereotypes and Discrimination Through Education Curricula",
            "The Question of Maintaining and Highlighting Cultural Diversity While Protecting Vulnerable Groups from Discrimination",
            "The Question of Regulating AI Education Systems While Fostering Social and Emotional Learning and Development",
            "The Question of Combatting Racism and Discrimination in Educational Institutions and Labor Markets",
            "The Question of Ensuring Quality Special Education Schools or Classes While Considering Social Integration and Possible Isolation",
            "The Question of Preventing Academic Dishonesty in an AI Centric Society",
            "The Question of Determining and Developing the Optimal Education Curriculum for All Primary and Secondary Students",
        ],
        members: [
            "Argentina", "Brazil", "China", "Egypt", "France", "Germany",
            "India", "Japan", "Kenya", "Mexico", "Nigeria", "Russia", "United States"
        ],
        subIssues: [
            "Promoting education, science, and culture.",
            "Ensuring inclusive and equitable quality education.",
            "Protecting cultural heritage and diversity.",
        ],
    },
    {
        id: "f1",
        name: "F1",
        topicGroups: [
            "The Question of Strengthening and Standardizing Cost Cap Enforcement Mechanisms to Ensure Competitive Equity and Financial Sustainability Across the Grid",
            "The Question of Accelerating Environmental Sustainability Initiatives and Developing Comprehensive Strategies to Achieve Net-Zero Carbon Emissions Across Global F1 Operations",
            "The Question of Enhancing Driver and Spectator Safety Protocols and Mitigating Unique Risks Associated with New and Existing Street Circuit Designs",
            "The Question of Establishing Ethical Vetting Criteria and Policy Guidelines to Address the Issue of Sportswashing and Human Rights Concerns Regarding Host Nations for F1 Grand Prix Events",
            "The Question of Implementing Durability and Longevity Standards for Critical Car Components to Optimize Component Lifecycles and Minimize Material and Energy Waste",
            "The Question of Analyzing the Socio-Economic and Infrastructure Impacts of Hosting a New Grand Prix, with a Focus on Mitigating Urban Congestion and Logistics in Highly Populated Cities With a Focus on the Possible F1 Grand Prix of 2028 in Bangkok",
        ],
        members: [
            "Ferrari", "Mercedes", "Red Bull", "McLaren", "Aston Martin", "Alpine",
            "Williams", "AlphaTauri", "Alfa Romeo", "Haas"
        ],
        subIssues: [
            "Ensuring competitive equity and financial sustainability.",
            "Promoting environmental sustainability and safety.",
            "Addressing ethical concerns and social responsibility.",
        ],
    },
    {
        id: "uncsa",
        name: "UNCSA",
        fantasy: true,
        universes: [
            {
                id: "umbrella",
                name: "Umbrella Academy",
                members: ["Luther", "Diego", "Allison", "Klaus", "Five", "Ben", "Vanya", "The Handler", "Lila", "Reginald Hargreeves", "Pogo", "Grace", "Hazel", "Cha-Cha", "Agnes"],
                topicGroups: [
                    ["The Question of Regulating Temporal Displacement Technologies and Preventing Paradoxes Through Inter-Temporal Compliance"],
                    ["The Question of Establishing Bio-Ethical Regulations to Prohibit the Non-Consensual Suppression or Modification of Superhuman Abilities"],
                    ["The Question of Addressing Systemic Emotional Neglect in Institutions Rearing Gifted Minors and Its Impact on Superhuman Mental Health"],
                ],
                subIssues: ["Regulating time travel and paradox prevention.", "Protecting enhanced individuals from abuse.", "Ensuring accountability of clandestine agencies."],
            },
            {
                id: "potter",
                name: "Harry Potter",
                members: ["Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Severus Snape", "Lord Voldemort", "Luna Lovegood", "Neville Longbottom", "Draco Malfoy", "Minerva McGonagall", "Rubeus Hagrid", "Sirius Black", "Remus Lupin", "Bellatrix Lestrange", "Ginny Weasley"],
                topicGroups: [
                    ["The Question of Standardizing Judicial Consequences and Enacting Global Mandates Against the Practice of the Unforgivable Curses"],
                    ["The Question of Mandating Practical Defense Training in Magical Educational Institutions to Ensure Readiness Against the Dark Arts"],
                    ["The Question of Combatting Blood Purity Ideology and Revising the International Statute of Secrecy to Foster Inter-Magical Cohesion"],
                ],
                subIssues: ["Regulating dark magic and unforgivable curses.", "Magical education and defense.", "Statute of Secrecy and blood purity."],
            },
            {
                id: "wakanda",
                name: "Wakanda & Talokan",
                members: ["T'Challa", "Shuri", "Nakia", "M'Baku", "Namor", "Namora", "Okoye", "Killmonger", "Ramonda", "Attuma", "W'Kabi", "Zuri", "Aneka", "Riri Williams", "Everett Ross"],
                topicGroups: [
                    ["The Question of Assessing the Global Consequences of Wakandan Isolationism and Developing a Framework for Responsible, Equitable Distribution of Aid"],
                    ["The Question of Establishing International Protocols to Prevent the Exploitation and Weaponization of Vibranium"],
                    ["The Question of Protecting Subaquatic Sovereignty and Cultural Integrity in the Face of Surface-World Encroachment"],
                ],
                subIssues: ["Vibranium non-proliferation and aid.", "Subaquatic and surface relations.", "Cultural sovereignty and technology sharing."],
            },
            {
                id: "spiderman",
                name: "Spider-Man",
                members: ["Peter Parker", "Mary Jane Watson", "Ned Leeds", "J. Jonah Jameson", "May Parker", "Norman Osborn", "Tony Stark", "Nick Fury", "Doctor Octopus", "Flash Thompson", "Gwen Stacy", "Harry Osborn", "Eddie Brock", "Felicia Hardy", "Miles Morales"],
                topicGroups: [
                    ["The Question of Regulating Autonomous Global Defense and Surveillance Systems (The EDITH Principle)"],
                    ["The Question of Combating Corporate Negligence Through the Regulation of Technological Scraps and Hazardous Waste"],
                    ["The Question of Addressing the Weaponization of Advanced Illusion Technologies and Protocols Against Manufactured Reality"],
                ],
                subIssues: ["AI and surveillance accountability.", "Battle debris and hazardous tech.", "Digital disinformation and illusion tech."],
            },
            {
                id: "guardians",
                name: "Guardians of the Galaxy",
                members: ["Star-Lord", "Gamora", "Drax", "Rocket Raccoon", "Groot", "Nebula", "Mantis", "Yondu", "Kraglin", "Cosmo", "Adam Warlock", "Ayesha", "Martinex", "Stakar Ogord", "Phyla-Vell"],
                topicGroups: [
                    ["The Question of Regulating the Interstellar Arms Trade and Non-Proliferation Policies for Weapons of Mass Destruction (Including Infinity Stone Artifacts)"],
                    ["The Question of Addressing Eugenic Ideologies and the Irresponsible Demolition of Civilizations with No Due Process (The High Evolutionary Principle)"],
                    ["The Question of Addressing Animal Rights in the Face of Genetic Modification and Non-Consensual Scientific Enhancement of Non-Human Sentient Lifeforms"],
                ],
                subIssues: ["Interstellar arms control and Infinity Stones.", "Eugenics and civilization-scale harm.", "Genetic modification and sentient rights."],
            },
            {
                id: "xmen",
                name: "X-Men",
                members: ["Charles Xavier", "Magneto", "Wolverine", "Storm", "Jean Grey", "Mystique", "Cyclops", "Beast", "Nightcrawler", "Rogue", "Iceman", "Shadowcat", "Colossus", "Angel", "Phoenix"],
                topicGroups: [
                    ["The Question of Establishing Bio-Ethical Regulations to Prohibit the Non-Consensual Suppression of Superhuman Abilities"],
                    ["The Question of Addressing the Threat of Unsanctioned External Enhanced Powers and Protocols for the Defense of Built Societies"],
                    ["The Question of Combatting Weaponization of the Human Mind and Establishing Protocols for the Containment of Psychic Technologies"],
                ],
                subIssues: ["Mutant registration and suppression.", "Enhanced individuals and national security.", "Psychic containment and consent."],
            },
            {
                id: "avengers",
                name: "Avengers",
                members: ["Iron Man", "Captain America", "Thor", "Black Widow", "Hulk", "Hawkeye", "Scarlet Witch", "Vision", "Falcon", "Winter Soldier", "Black Panther", "Captain Marvel", "War Machine", "Ant-Man", "Wasp"],
                topicGroups: [
                    ["The Question of Regulating Autonomous Global Defense and Surveillance Systems and Protection of High-Risk Technologies"],
                    ["The Question of Combating Corporate Negligence Through Regulation of Technological Scraps and Hazardous Waste"],
                    ["The Question of Addressing the Threat of Unsanctioned External Enhanced Powers and Defense of National Sovereignty"],
                ],
                subIssues: ["Autonomous defense and AI.", "Battle debris and weaponization.", "Enhanced individuals and accountability."],
            },
            {
                id: "justiceleague",
                name: "Justice League",
                members: ["Superman", "Batman", "Wonder Woman", "Aquaman", "The Flash", "Cyborg", "Green Lantern", "Martian Manhunter", "Shazam", "Hawkgirl", "Green Arrow", "Black Canary", "Supergirl", "Batwoman", "Nightwing"],
                topicGroups: [
                    ["The Question of Regulating Advanced Scientific Accountability and Transparency in the Development of Internationally Relevant Technologies"],
                    ["The Question of Addressing the Threat of Unsanctioned External Enhanced Powers and Protocols for the Defense of Built Societies"],
                    ["The Question of Combating the Weaponization of Advanced Illusion Technologies and Digital Disinformation"],
                ],
                subIssues: ["Superhuman accountability and tech.", "Defense of civilian populations.", "Illusion tech and disinformation."],
            },
            {
                id: "fantasticfour",
                name: "Fantastic Four",
                members: ["Mr. Fantastic", "Invisible Woman", "Human Torch", "The Thing", "Doctor Doom", "Silver Surfer", "Namor", "Alicia Masters", "Franklin Richards", "Valeria Richards", "She-Hulk", "Crystal", "Medusa", "Black Bolt", "Maximus"],
                topicGroups: [
                    ["The Question of Regulating Advanced Scientific Accountability and Transparency in the Development of Internationally Relevant Technologies"],
                    ["The Question of Regulating Temporal Displacement Technologies and Inter-Temporal Compliance"],
                    ["The Question of Addressing Animal Rights in the Face of Genetic Modification and Non-Consensual Enhancement of Non-Human Sentient Lifeforms"],
                ],
                subIssues: ["Scientific accountability and transparency.", "Time travel and multiverse stability.", "Genetic modification and sentient rights."],
            },
            {
                id: "defenders",
                name: "The Defenders",
                members: ["Daredevil", "Jessica Jones", "Luke Cage", "Iron Fist", "Elektra", "Punisher", "Colleen Wing", "Misty Knight", "Claire Temple", "Foggy Nelson", "Karen Page", "Stick", "Kingpin", "Bullseye", "Trish Walker"],
                topicGroups: [
                    ["The Question of Combating Corporate Negligence Through Regulation of Technological Scraps and Hazardous Waste"],
                    ["The Question of Addressing the Weaponization of Advanced Illusion Technologies and Protocols Against Manufactured Reality"],
                    ["The Question of Regulating Clandestine Enhanced Individuals Operating Without Oversight"],
                ],
                subIssues: ["Corporate negligence and hazardous tech.", "Illusion tech and urban safety.", "Vigilante oversight and accountability."],
            },
        ],
    },
    {
        id: "fwc",
        name: "FWC",
        fantasy: true,
        universes: [
            {
                id: "avatar",
                name: "Avatar",
                members: ["Jake Sully", "Neytiri", "Tonowari", "Ronal", "Quaritch", "Grace Augustine", "Norm Spellman", "Trudy Chacon", "Parker Selfridge", "Mo'at", "Eytukan", "Tsu'tey", "Max Patel", "Lyle Wainfleet", "Ardmore"],
                topicGroups: [
                    ["The Question of Developing Mechanisms and Agreements to Protect the Eywa Against Violence and Destruction"],
                    ["The Question of Combatting Unobtanium Exploitation Through Agreements and the Development of New Governing Bodies"],
                    ["The Question of Protecting Na'vi Cultural Integrity and Sovereignty in the Face of Military Force and Corporate Encroachment"],
                ],
                subIssues: ["Protection of Eywa and sacred sites.", "Unobtanium regulation and governance.", "Na'vi sovereignty and cultural rights."],
            },
            {
                id: "apes",
                name: "Planet of the Apes",
                members: ["Caesar", "Maurice", "Rocket", "Cornelia", "Koba", "The Colonel", "Blue Eyes", "Nova", "Lake", "Bad Ape", "Winter", "Luca", "Rex", "Ash", "Spear"],
                topicGroups: [
                    ["The Question of Combatting Religious Dogma and Ape Supremacy Influencing the Suppression of Valid Archaeological and Evolutionary Findings"],
                    ["The Question of Combating Human Subjugation and Dehumanization and Establishing Civil Rights for All Sentient Life"],
                    ["The Question of Preventing Unethical Scientific Research and Viral Development Through Bio-Ethical Review Boards"],
                ],
                subIssues: ["Ape supremacy and scientific truth.", "Interspecies civil rights.", "Viral research and bio-ethics."],
            },
            {
                id: "stranger",
                name: "Stranger Things",
                members: ["Eleven", "Mike Wheeler", "Joyce Byers", "Jim Hopper", "Dustin Henderson", "Dr. Brenner", "Lucas Sinclair", "Will Byers", "Max Mayfield", "Steve Harrington", "Nancy Wheeler", "Jonathan Byers", "Robin Buckley", "Erica Sinclair", "Murray Bauman"],
                topicGroups: [
                    ["The Question of Preventing DoE Authority Abuse and Subject Manipulation in Government-Funded Scientific Laboratories Through Stricter Regulations"],
                    ["The Question of Preventing Harm Caused by Psychic Child Experimentation and Ensuring the Protection and Rehabilitation of Gifted Minors"],
                    ["The Question of Addressing the Weaponization of the Human Mind and Establishing Protocols for the Containment of Psychic Technologies"],
                ],
                subIssues: ["Government lab oversight.", "Psychic experimentation and minors.", "Containment of anomalous threats."],
            },
            {
                id: "dragon",
                name: "How to Train Your Dragon",
                members: ["Hiccup", "Astrid", "Toothless", "Stoick", "Valka", "Drago", "Snotlout", "Fishlegs", "Ruffnut", "Tuffnut", "Gobber", "Eret", "Cloudjumper", "Grump", "Skullcrusher"],
                topicGroups: [
                    ["The Question of Addressing the Inevitability of Human-Dragon Conflict and Establishing Global Regulations to Protect Dragon and Human Life"],
                    ["The Question of Addressing the Illegal Trafficking and Poaching of Dragons and Combatting the Extinction of Critically Threatened Species"],
                    ["The Question of Conservationism and Refuge as a Sustainable Solution while Evaluating the Ethical Need for Dragon Partnership and Labor"],
                ],
                subIssues: ["Human-dragon coexistence.", "Dragon trafficking and extinction.", "Dragon labor and partnership ethics."],
            },
            {
                id: "lorax",
                name: "Lorax",
                members: ["The Lorax", "The Once-ler", "Ted", "Audrey", "Aloysius O'Hare", "Grammy Norma", "Isabella", "Brett", "Chet", "Uncle Ubb", "Aunt Grizelda", "Cy", "The Once-ler's Mom", "Norma", "Thneedville Mayor"],
                topicGroups: [
                    ["The Question of Instituting Economic Oversight to Prevent the Prioritization of Industrial 'Biggering' over Ecological Sustainability"],
                    ["The Question of Addressing and Combating Truffula Deforestation, Industrial Pollution (Glup-pity-Glup), and Protecting the Habitats of Endangered Species"],
                    ["The Question of Preventing Excessive Consumerism and Regulating the Manufacture and Marketing of Non-Essential Goods (The Thneed Principle)"],
                ],
                subIssues: ["Industrial growth vs. sustainability.", "Deforestation and pollution.", "Consumerism and Thneed regulation."],
            },
            {
                id: "narnia",
                name: "Narnia",
                members: ["Aslan", "Lucy Pevensie", "Edmund Pevensie", "Susan Pevensie", "Peter Pevensie", "White Witch", "Mr. Tumnus", "Mr. Beaver", "Mrs. Beaver", "Caspian", "Reepicheep", "Trumpkin", "Miraz", "Eustace Scrubb", "Jill Pole"],
                topicGroups: [
                    ["The Question of Ensuring the Safety of Magical Beings and Unfettered Operation of Sovereign Realms in Times of Transition"],
                    ["The Question of Strengthening Mechanisms for the Transition Towards Self-Determination for Formerly Occupied Territories"],
                    ["The Question of Addressing Historical Injustice and Establishing Frameworks for Reconciliation Between Rival Kingdoms"],
                ],
                subIssues: ["Magical being rights and sovereignty.", "Decolonization and self-determination.", "Reconciliation and historical justice."],
            },
            {
                id: "middleearth",
                name: "Middle Earth",
                members: ["Aragorn", "Gandalf", "Legolas", "Gimli", "Frodo Baggins", "Galadriel", "Samwise Gamgee", "Merry Brandybuck", "Pippin Took", "Elrond", "Arwen", "Boromir", "Faramir", "Eowyn", "Theoden"],
                topicGroups: [
                    ["The Question of Regulating the Development and Deployment of Artifacts of Mass Power to Strengthen Traveler Safety and Inter-Realm Compliance"],
                    ["The Question of Preventing the Weaponization of Advanced Illusion and Invisibility Technologies Against Civilian Populations"],
                    ["The Question of Establishing Frameworks for the Coexistence of Free Peoples and Former Servant Populations"],
                ],
                subIssues: ["Artifact control and ring-lore.", "Invisibility and deception tech.", "Coexistence and rehabilitation."],
            },
            {
                id: "westeros",
                name: "Westeros",
                members: ["Daenerys Targaryen", "Jon Snow", "Tyrion Lannister", "Cersei Lannister", "Arya Stark", "Sansa Stark", "Jaime Lannister", "Ned Stark", "Catelyn Stark", "Bran Stark", "Robb Stark", "Theon Greyjoy", "Joffrey Baratheon", "Margaery Tyrell", "Brienne of Tarth"],
                topicGroups: [
                    ["The Question of Strengthening Electoral and Succession Integrity to Prevent Corruption and Malpractice in Royal Succession"],
                    ["The Question of Ensuring the Safety of Civilian Populations in Conflict Zones and Compliance with Laws of War"],
                    ["The Question of Establishing a Framework for Redress and Reparations for Historical Damage Caused by Dynastic Conflict"],
                ],
                subIssues: ["Succession and governance.", "Civilian protection in war.", "Reparations and reconciliation."],
            },
            {
                id: "hogwarts",
                name: "Hogwarts (Fantasy World)",
                members: ["Harry Potter", "Hermione Granger", "Rubeus Hagrid", "Minerva McGonagall", "Albus Dumbledore", "Severus Snape", "Ron Weasley", "Luna Lovegood", "Neville Longbottom", "Draco Malfoy", "Ginny Weasley", "Sirius Black", "Remus Lupin", "Fred Weasley", "George Weasley"],
                topicGroups: [
                    ["The Question of Mandating Practical Defense Training in Magical Educational Institutions to Ensure Readiness Against the Dark Arts"],
                    ["The Question of Combatting Blood Purity Ideology and Revising the International Statute of Secrecy to Foster Inter-Species Cohesion"],
                    ["The Question of Ensuring the Full and Equal Enjoyment of Rights for Non-Human Sentient Beings in Magical Society"],
                ],
                subIssues: ["Defense education and dark arts.", "Statute of Secrecy and blood purity.", "Non-human sentient rights."],
            },
            {
                id: "neverland",
                name: "Neverland",
                members: ["Peter Pan", "Tinker Bell", "Captain Hook", "Wendy Darling", "Tiger Lily", "Mr. Smee", "John Darling", "Michael Darling", "Nana", "Curly", "Nibs", "Slightly", "Tootles", "Starkey", "Mullins"],
                topicGroups: [
                    ["The Question of Ensuring the Safety and Autonomy of Minors in Unregulated Territories and the Cessation of Child Conscription"],
                    ["The Question of Addressing the Illegal Trafficking and Poaching of Magical Creatures and Combatting the Endangerment of Indigenous Species"],
                    ["The Question of Establishing Governance Frameworks for Shared Territories Without Undermining the Sovereignty of Indigenous Populations"],
                ],
                subIssues: ["Child safety and conscription.", "Magical creature trafficking.", "Shared territory governance."],
            },
        ]
    },
    {
        id: "specpol",
        name: "SPECPOL",
        topicGroups: [
            "The Question of Examining and Formulating a Framework for Addressing the Root Factors Perpetuating the Israel-Palestine Conflict, Aiming for a Durable and Comprehensive Political Resolution",
            "The Question of Ensuring the Safety and Unfettered Operation of UN Peacekeeping Missions, Journalists, and Humanitarian Personnel in Conflict Zones, in Compliance with International Humanitarian Law",
            "The Question of Strengthening UN Mechanisms to Facilitate the Transition towards Self-Determination and Independent Governance for Non-Self-Governing Territories, with Special Consideration for the Situation in Western Sahara",
            "The Question of Establishing a Comprehensive Framework for Redress and Reparations for Historical Economic and Social Damage Caused by Colonial Exploitation",
            "The Question of Establishing Measures to Safeguard Electoral Integrity and Prevent Corruption and Malpractice in National Elections, with a View to Defining and Enforcing International Democratic Norms, Using the 2018 Venezuelan Presidential Election as a Case Study",
            "The Question of Developing Guidelines for Member States on Candidate Qualifications to Ensure the Administrative and Political Capacity Required for Effective Executive Leadership",
            "The Question of Establishing a Global Framework for Historical Justice, Reconciliation, and Reparations Between Former Colonizing and Colonized States as a Measure for Conflict Prevention and Sustainable Peace",
            "The Question of Strengthening Multilateral Cooperation and Fostering Mutual Trust Among Member States While Upholding the Fundamental Principles of National Sovereignty and Non-Interference",
        ],
        members: [
            "Algeria", "Argentina", "Brazil", "China", "Egypt", "France",
            "Germany", "India", "Indonesia", "Kenya", "Mexico", "Nigeria", "South Africa", "United States"
        ],
        subIssues: [
            "Addressing decolonization and self-determination.",
            "Promoting political stability and democratic governance.",
            "Ensuring historical justice and reconciliation.",
        ],
    },
    {
        id: "unoosa",
        name: "UNOOSA",
        topicGroups: [
            "The Question of Enhancing International Cooperation on Space Situational Awareness (SSA) and Space Traffic Management (STM) to Ensure the Long-Term Sustainability of Outer Space Activities and Mitigate the Risk Posed by Orbital Debris",
            "The Question of Considering the Feasibility and Governance Frameworks for Active Debris Removal (ADR) Technologies and the Remediation of Highly Congested Orbital Regions",
            "The Question of Addressing Gaps in the International Legal Regime to Clarify Principles of Non-Appropriation and Establish Norms for the Deployment of New Technologies in Outer Space and on Celestial Bodies",
            "The Question of Encouraging Greater Synergy and Avoiding Duplication of Efforts in National Space Programs to Maximize Efficiency and Accelerate the Application of Space Tools Towards the Achievement of the Sustainable Development Goals (SDGs)",
            "The Question of Establishing a Comprehensive Governance and Legal Framework for the Permanent Habitation of Outer Space and Other Celestial Bodies, Addressing the Anticipated Socio-Economic and Geopolitical Implications",
            "The Question of Fostering Global Youth Engagement and Developing Platforms for Innovation to Catalyze Ideas and Initiatives Related to the Long-Term, Sustainable Development of Interplanetary Civilizations",
        ],
        members: [
            "China", "France", "Germany", "India", "Japan", "Russia",
            "United Kingdom", "United States", "Australia", "Brazil", "Canada", "South Korea"
        ],
        subIssues: [
            "Promoting peaceful uses of outer space.",
            "Ensuring space sustainability and debris management.",
            "Fostering international cooperation in space activities.",
        ],
    },
    {
        id: "sochum",
        name: "SOCHUM",
        topicGroups: [
            "The Question of Protecting Women and Minors from Online Sexual Exploitation and Abuse, with a focus on Regulating Digital Platforms (such as; Instagram and Snapchat) and Enhancing Accountability",
            "The Question of Developing and Implementing Comprehensive Digital Citizenship and Media Literacy Programmes for the Protection of Children and Adolescents in the Digital Age",
            "The Question of Fostering Global Solidarity and Developing Robust Mechanisms for Equitable Burden-Sharing in the Protection and Reception of Refugee and Asylum-Seeking Populations",
            "The Question of Mitigating the Effects of Human Capital Flight (Brain Drain) while Facilitating the Ethical and Beneficial Circulation of Skilled Professionals to Address Regional Labor Imbalances",
            "The Question of Ensuring the Inclusivity of Educational Curricula and Materials to Promote the Rights and Recognition of All Gender Identities, including Non-Binary Individuals",
            "The Question of Addressing the Structural and Cultural Root Causes of Discrimination and Violence Based on Sexual Orientation and Gender Identity (SOGI) to Achieve Comprehensive Societal Inclusion",
            "The Question of Adopting an Equity-Driven Approach to Resource Allocation to Address Systemic Disparities and Ensure Equal Access to Opportunities for All Individuals",
            "The Question of Evaluating the Efficacy of Existing National and International Policies on Social Equity and Inclusion, and Developing Evidence-Based Best Practices for Successful Universal Access and Participation",
        ],
        members: [
            "Argentina", "Bangladesh", "Brazil", "Canada", "China", "Egypt",
            "France", "Germany", "India", "Kenya", "Mexico", "Nigeria", "South Africa", "United States"
        ],
        subIssues: [
            "Promoting social progress and cultural development.",
            "Protecting human rights and preventing discrimination.",
            "Ensuring equitable access to opportunities and resources.",
        ],
    },
    {
        id: "unhcr",
        name: "UNHCR",
        topicGroups: [
            "The Question of Strengthening Legal Frameworks and Developing Determination Procedures to Reduce Statelessness and Facilitate the Acquisition of Nationality for Stateless Persons",
            "The Question of Mobilizing Sustainable and Predictable Funding to Meet Minimum Core Standards for Settlement and Shelter in Refugee Responses, while Promoting Self-Reliance",
            "The Question of Upholding the Principle of Non-refoulement and Ensuring the Protection of Refugees and Asylum Seekers who Resort to Irregular Movement, with a focus on Safeguarding Vulnerable Individuals",
            "The Question of Strengthening Fair, Efficient and Accessible Asylum Procedures and Promoting International Cooperation to Ensure Equitable Access to Territory and Protection",
            "The Question of Strengthening International Solidarity and Developing Sustainable Financing Models to Support Host Countries in Providing Comprehensive and Non-Discriminatory Health Coverage for Displaced Populations",
            "The Question of Developing and Harmonizing International Legal Standards and Operational Protocols to Prevent the Separation of Families, with a particular focus on Unaccompanied and Separated Children",
        ],
        members: [
            "Bangladesh", "Brazil", "Canada", "China", "Egypt", "Ethiopia",
            "France", "Germany", "India", "Kenya", "Pakistan", "Turkey", "United States"
        ],
        subIssues: [
            "Protecting refugees and asylum seekers.",
            "Ensuring access to protection and assistance.",
            "Promoting durable solutions and self-reliance.",
        ],
    },
];
