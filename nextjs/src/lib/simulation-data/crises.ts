export const crises = {
    hsc: [
        {
            title: "Breaking: New Intelligence Report",
            description: "Intelligence agencies report a new development that changes the context of the situation. How will the Security Council respond?",
            options: [
                { text: "Request immediate briefing from intelligence agencies", points: 10, outcome: "The briefing reveals critical information that shapes the discussion." },
                { text: "Call for emergency session", points: 8, outcome: "An emergency session is convened to address the new information." },
                { text: "Continue with current agenda", points: 5, outcome: "The committee proceeds but may miss critical timing." },
            ],
        },
        {
            title: "Crisis: Civilian Casualties Reported",
            description: "Reports of significant civilian casualties have emerged from the conflict zone. Immediate action is demanded by the international community.",
            options: [
                { text: "Call for an immediate ceasefire", points: 15, outcome: "The call for ceasefire is noted, tensions rise in the council." },
                { text: "Authorize humanitarian corridor", points: 12, outcome: "Humanitarian aid corridors are established to aid civilians." },
                { text: "Condemn the violence without action", points: 5, outcome: "The condemnation is issued but violence continues." },
            ],
        },
        {
            title: "Crisis: Diplomatic Walkout",
            description: "A key delegation threatens to walk out of negotiations due to perceived bias. The session is at risk of collapse.",
            options: [
                { text: "Suspend session for informal negotiations", points: 10, outcome: "Informal talks successfully bring the delegation back to the table." },
                { text: "Proceed without the delegation", points: 5, outcome: "The session continues but legitimacy is questioned." },
                { text: "Issue a formal apology", points: 8, outcome: "The apology is accepted, but authority is undermined." },
            ],
        },
    ],
    icj: [
        {
            title: "New Evidence Submitted",
            description: "A party to the case submits new, crucial evidence just before deliberations. It could change the verdict.",
            options: [
                { text: "Admit the evidence and extend deliberations", points: 12, outcome: "The evidence significantly impacts the final advisory opinion." },
                { text: "Reject the evidence as untimely", points: 8, outcome: "The evidence is rejected, preserving procedure but raising questions of fairness." },
                { text: "Request verification of authenticity", points: 10, outcome: "Verification confirms authenticity, delaying but ensuring accuracy." },
            ],
        },
        {
            title: "Jurisdictional Challenge",
            description: "A state challenges the court's jurisdiction over a specific aspect of the case.",
            options: [
                { text: "Suspend proceedings to rule on jurisdiction", points: 10, outcome: "Jurisdiction is affirmed after a brief recess." },
                { text: "Dismiss the challenge as baseless", points: 5, outcome: "The challenge is dismissed, but political tension increases." },
                { text: "Allow written submissions on the challenge", points: 8, outcome: "Written submissions clarify the legal standing." },
            ],
        },
    ],
    uncsa: [
        {
            title: "Anomalous Energy Spike",
            description: "Sensors detect a massive energy spike indicating an imminent temporal or dimensional breach.",
            options: [
                { text: "Deploy containment teams immediately", points: 15, outcome: "Containment teams stabilize the anomaly." },
                { text: "Evacuate the sector", points: 10, outcome: "Sector evacuated, but the anomaly causes significant infrastructure damage." },
                { text: "Analyze the signature first", points: 8, outcome: "Analysis reveals it was a false alarm, saving resources." },
            ],
        },
        {
            title: "Rogue Superhuman Activity",
            description: "A registered enhanced individual has gone rogue and is causing destruction in a populated area.",
            options: [
                { text: "Authorize capture mission", points: 12, outcome: "The individual is captured with minimal collateral damage." },
                { text: "Attempt to negotiate surrender", points: 15, outcome: "Negotiation succeeds; the individual surrenders peacefully." },
                { text: "Authorize lethal force", points: 5, outcome: "The threat is neutralized, but public backlash is severe." },
            ],
        },
    ],
    fwc: [
        {
            title: "Inter-Universe Breach",
            description: "A portal opens between universes, threatening to merge timelines and cause chaos.",
            options: [
                { text: "Seal the portal immediately", points: 15, outcome: "The portal is sealed, preventing cross-contamination." },
                { text: "Send an exploration team", points: 10, outcome: "The team returns with valuable data but risks contamination." },
                { text: "Establish a diplomatic outpost", points: 12, outcome: "A diplomatic channel is opened with the other side." },
            ],
        },
        {
            title: "Magical/Technological Plague",
            description: "A mysterious affliction affecting both magical beings and technology is spreading rapidly.",
            options: [
                { text: "Quarantine affected areas", points: 10, outcome: "Quarantine slows the spread." },
                { text: "Collaborate on a cure/patch", points: 15, outcome: "A cure/patch is found through joint effort." },
                { text: "Destroy the source", points: 8, outcome: "The source is destroyed, but at great cost to the environment." },
            ],
        },
    ],
};
