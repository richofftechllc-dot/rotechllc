// Hands-on labs — guided by Flo against the student's OWN ServiceNow PDI.
// The AI never touches their instance; it coaches step-by-step and verifies by
// what the student describes/screenshots. Add a lab = one entry here.

export type LabStep = { title: string; do: string; verify: string };
export type Lab = {
  id: string;
  cert: string;          // "ServiceNow CSA"
  domainId?: string;     // ties back to a quiz domain (csa1, etc.)
  coach?: "bo" | "flo";  // who guides it (default flo for ServiceNow; bo for Sec+/AWS)
  title: string;
  objective: string;
  est: string;           // "~15 min"
  pdiUrl: string;        // the environment URL to open
  envLabel?: string;     // button label (default "Open my PDI")
  steps: LabStep[];
};

const PDI = "https://developer.servicenow.com/dev.do#!/home";

export const LABS: Lab[] = [
  {
    id: "csa-navigation",
    cert: "ServiceNow CSA",
    domainId: "csa1",
    title: "Master the Navigator: filter, favorite, history, impersonate",
    objective: "Move through ServiceNow like a senior admin — fuzzy filter, favorites, history, open-in-new-tab, and impersonation.",
    est: "~10 min",
    pdiUrl: PDI,
    steps: [
      { title: "Get into your instance", do: "Open developer.servicenow.com, sign in, request/open your Personal Developer Instance (PDI), and log in.", verify: "You're on the ServiceNow home page with the left navigator." },
      { title: "Fuzzy filter", do: "In the Filter navigator (top-left), type just 'inc' and watch the menu narrow live. Open Incident > All.", verify: "Typing a few letters filtered the whole menu and the Incident list opened." },
      { title: "Favorite it", do: "Hover the 'Incident' application in the navigator and click the ★ star to favorite it. Switch to the Favorites tab (star icon at the top of the navigator).", verify: "Incident shows under your Favorites." },
      { title: "Use History", do: "Click the History (clock) icon at the top of the navigator. Click a record you recently opened to jump back to it.", verify: "History showed your recent records and you reopened one." },
      { title: "Open in a new tab", do: "In any incident list, right-click an INC number and choose 'Open in New Tab' (or '...in New Window').", verify: "The record opened separately while your filtered list stayed put." },
      { title: "Impersonate a user", do: "Click your name (top-right) or the gear/profile menu and choose Impersonate User. Pick any user, see ServiceNow as them, then End Impersonation.", verify: "You saw the platform as another user, then returned to yourself." },
    ],
  },
  {
    id: "csa-incident",
    cert: "ServiceNow CSA",
    domainId: "csa7",
    title: "Create, work & resolve your first Incident",
    objective: "Run a ticket through its whole life: create it, work it, resolve it — the #1 thing every ServiceNow admin does.",
    est: "~15 min",
    pdiUrl: PDI,
    steps: [
      { title: "Get a free instance", do: "Open developer.servicenow.com, sign in, and request a Personal Developer Instance (PDI). Log into it.", verify: "You're looking at the ServiceNow home page with the left navigator." },
      { title: "Find Incidents", do: "In the Filter navigator (top-left search), type 'Incident' and click All under the Incident application.", verify: "A list of incidents loads in the content frame." },
      { title: "Create a new Incident", do: "Click New. Set Caller to any user, write a Short description (e.g. 'Email not working'), set Impact and Urgency, then Submit. Note the INC number.", verify: "You have an INC number (like INC0010023)." },
      { title: "Work it", do: "Open your incident, set State to In Progress, add a Work note ('Investigating'), and Save.", verify: "State shows In Progress and your work note is in the Activity stream." },
      { title: "Resolve it", do: "Set State to Resolved, pick a Resolution code and add Resolution notes, then Resolve/Update.", verify: "State shows Resolved." },
      { title: "Confirm", do: "Go back to the Incident list and filter State = Resolved. Find yours.", verify: "Your INC shows in the Resolved list." },
    ],
  },
  {
    id: "csa-uipolicy",
    cert: "ServiceNow CSA",
    domainId: "csa3",
    title: "Make a field mandatory with a UI Policy",
    objective: "Control a form with no code — a UI Policy that makes a field required when a condition is met.",
    est: "~12 min",
    pdiUrl: PDI,
    steps: [
      { title: "Open the Incident form", do: "Navigate to Incident > Create New.", verify: "A blank incident form is open." },
      { title: "New UI Policy", do: "In the Filter navigator type 'UI Policies', open it, click New. Table = Incident. Write a short description.", verify: "A new UI Policy form for the Incident table is open." },
      { title: "Set the condition", do: "Add a condition: Priority is 1 - Critical. Check 'Run scripts in UI' off for now. Save.", verify: "The policy saved with your condition." },
      { title: "Add the action", do: "In UI Policy Actions, add a new action: Field = Description, Mandatory = True. Save.", verify: "A UI Policy Action exists making Description mandatory." },
      { title: "Test it", do: "Open a new Incident, set Priority to 1 - Critical, and try to Submit without a Description.", verify: "The form blocks you — Description is now required when Priority is Critical." },
    ],
  },
  {
    id: "csa-report",
    cert: "ServiceNow CSA",
    domainId: "csa5",
    title: "Build a report and pin it to a dashboard",
    objective: "Turn data into a picture — create a bar chart of incidents by priority and put it on a dashboard.",
    est: "~12 min",
    pdiUrl: PDI,
    steps: [
      { title: "New report", do: "Filter navigator > Reports > Create New. Name it 'Incidents by Priority'. Source = Incident table.", verify: "You're on the report builder with the Incident source." },
      { title: "Pick the type", do: "Choose a Bar chart. Group by = Priority.", verify: "A bar chart preview shows incident counts per priority." },
      { title: "Run & save", do: "Click Run, then Save.", verify: "The report saved and renders." },
      { title: "Add to a dashboard", do: "Use the report's menu to Add to dashboard — create a new dashboard 'My CSA Lab' if needed.", verify: "Your chart appears on a dashboard." },
    ],
  },
  {
    id: "csa-lists",
    cert: "ServiceNow CSA",
    domainId: "csa2",
    title: "Filter, group & personalize a list",
    objective: "Bend a list to your will — condition builder, breadcrumbs, group by, and personalized columns.",
    est: "~10 min",
    pdiUrl: PDI,
    steps: [
      { title: "Open the Incident list", do: "Filter navigator > Incident > All.", verify: "The incident list is open." },
      { title: "Build a filter", do: "Click the funnel/filter icon. Build: Active is true AND Priority is 1 - Critical. Run it.", verify: "The list shows only active critical incidents; a breadcrumb appears at the top." },
      { title: "Edit via breadcrumb", do: "Click the breadcrumb condition at the top to tweak it (e.g. change Priority to 2 - High) and run again.", verify: "The list updated from the breadcrumb without reopening the filter." },
      { title: "Group by", do: "Right-click the Priority column header > Group By Priority.", verify: "The list is grouped into collapsible Priority sections with counts." },
      { title: "Personalize columns", do: "Right-click any column header > Personalize > List Columns. Add 'Assigned to' and reorder, then save.", verify: "Your chosen columns now show in your order." },
    ],
  },
  {
    id: "csa-flow",
    cert: "ServiceNow CSA",
    domainId: "csa4",
    title: "Build a Flow that runs on a new Incident",
    objective: "Automate with no code — a Flow Designer flow that triggers when a Critical incident is created.",
    est: "~15 min",
    pdiUrl: PDI,
    steps: [
      { title: "Open Flow Designer", do: "Filter navigator > Flow Designer (or All > Process Automation > Flow Designer). Click New > Flow. Name it 'Critical INC Notify'.", verify: "A new flow canvas is open." },
      { title: "Add a trigger", do: "Set the trigger: Record Created, Table = Incident, Condition = Priority is 1 - Critical.", verify: "The trigger shows Created on Incident with your condition." },
      { title: "Add an action", do: "Add an action: Log (or 'Create Record' / 'Send Notification'). For Log, set the message to 'Critical incident created'.", verify: "An action is wired below the trigger." },
      { title: "Save & activate", do: "Save the flow, then Activate it.", verify: "The flow is Active." },
      { title: "Test it", do: "Create a new Incident with Priority 1 - Critical. Back in Flow Designer, check Executions / Operations to see your flow ran.", verify: "An execution shows your flow fired for that incident." },
    ],
  },
  {
    id: "csa-users",
    cert: "ServiceNow CSA",
    domainId: "csa6",
    title: "Create a user, a group & assign a role",
    objective: "The backbone of access — make a user, a group, give the group a role, and add the user.",
    est: "~12 min",
    pdiUrl: PDI,
    steps: [
      { title: "Create a user", do: "Filter navigator > User Administration > Users > New. Fill User ID, First/Last name, and Submit.", verify: "Your new user record saved." },
      { title: "Create a group", do: "User Administration > Groups > New. Name it 'Lab Team' and Submit.", verify: "The 'Lab Team' group exists." },
      { title: "Give the group a role", do: "Open the group, go to the Roles related list, and add a role (e.g. 'itil').", verify: "The itil role is on the group." },
      { title: "Add the user to the group", do: "In the group's Group Members related list, add the user you created.", verify: "Your user is a member of Lab Team." },
      { title: "Verify inherited access", do: "Impersonate your new user (top-right menu) and confirm they can now see Incident (from the inherited itil role). End impersonation.", verify: "The user inherited itil access through the group." },
    ],
  },
  {
    id: "csa-updateset",
    cert: "ServiceNow CSA",
    domainId: "csa8",
    title: "Capture a change in an Update Set",
    objective: "How config travels between instances — create an Update Set, make a change, and watch it get captured.",
    est: "~12 min",
    pdiUrl: PDI,
    steps: [
      { title: "Create an Update Set", do: "Filter navigator > System Update Sets > Local Update Sets > New. Name it 'My Lab Set' and Submit.", verify: "The update set 'My Lab Set' exists, state In Progress." },
      { title: "Make it the current set", do: "Use the Update Set picker (gear/settings area, or the 'Make this my current set' link on the record).", verify: "The upper-right shows 'My Lab Set' as the current update set." },
      { title: "Make a captured change", do: "Create a simple change that's captured — e.g. a new UI Policy or a Business Rule on the Incident table, and save it.", verify: "Your change saved." },
      { title: "See it captured", do: "Open 'My Lab Set' and look at the Customer Updates related list.", verify: "Your change appears as a line in the update set's Customer Updates." },
      { title: "Mark complete", do: "Set the Update Set state to Complete (this is the set you'd export/promote to Test/Prod).", verify: "The set is Complete and ready to move." },
    ],
  },
  // ── Security+ (Bo-coached, free tools) ──────────────────────────
  {
    id: "secplus-hashing",
    cert: "Security+", domainId: "sp1", coach: "bo",
    title: "Hashing & integrity — see one byte change everything",
    objective: "Prove how integrity works: hash a message, change one character, watch the whole hash change.",
    est: "~8 min", pdiUrl: "https://gchq.github.io/CyberChef/", envLabel: "Open CyberChef ↗",
    steps: [
      { title: "Open CyberChef", do: "Open gchq.github.io/CyberChef — a free in-browser crypto toolkit.", verify: "CyberChef is loaded with Operations, Recipe, Input, Output panes." },
      { title: "Hash some text", do: "Drag 'SHA256' into the Recipe. In Input, type: I will pass Security Plus. Read the Output hash.", verify: "A 64-character SHA-256 hash appears in Output." },
      { title: "Change ONE character", do: "Change 'pass' to 'Pass' (capital P). Watch the Output.", verify: "The entire hash changed completely from one character — that's the avalanche effect." },
      { title: "Compare algorithms", do: "Swap SHA256 for MD5, then SHA512. Note the different lengths.", verify: "MD5 is 32 hex chars, SHA-256 is 64, SHA-512 is 128." },
    ],
  },
  {
    id: "secplus-recon",
    cert: "Security+", domainId: "sp2", coach: "bo",
    title: "Check a file/URL for threats (VirusTotal)",
    objective: "Triage like a SOC analyst — submit a hash or URL and read a multi-engine verdict.",
    est: "~8 min", pdiUrl: "https://www.virustotal.com/", envLabel: "Open VirusTotal ↗",
    steps: [
      { title: "Open VirusTotal", do: "Open virustotal.com.", verify: "You see tabs for File, URL, Search." },
      { title: "Scan a safe URL", do: "On the URL tab, paste a known-good site (e.g. https://example.com) and scan.", verify: "Most/all engines report it clean." },
      { title: "Read the detections", do: "Open the Detection and Details tabs. Note how many vendors flagged it and any categories.", verify: "You can read the vendor verdicts and basic reputation data." },
      { title: "Search a hash", do: "On Search, paste any file's SHA-256 (or use a sample hash) to see if it's known-bad.", verify: "VirusTotal returns a report (or 'not found') for the hash." },
    ],
  },
  {
    id: "secplus-tls",
    cert: "Security+", domainId: "sp3", coach: "bo",
    title: "Grade a site's TLS (SSL Labs)",
    objective: "See security architecture in action — scan a site's TLS config and read the grade.",
    est: "~8 min", pdiUrl: "https://www.ssllabs.com/ssltest/", envLabel: "Open SSL Labs ↗",
    steps: [
      { title: "Open SSL Labs", do: "Open ssllabs.com/ssltest.", verify: "The 'SSL Server Test' input is shown." },
      { title: "Scan a site", do: "Enter a domain you use (e.g. github.com) and run the test (give it a minute).", verify: "You get an overall letter grade (A+, A, B...)." },
      { title: "Read the chain", do: "Look at Certificate paths, Protocols (is TLS 1.0/1.1 disabled?), and Cipher Suites.", verify: "You can see the cert chain, supported protocols, and ciphers." },
      { title: "Inspect in-browser", do: "Visit the site, click the padlock > Connection secure > certificate, and view Issuer + validity dates.", verify: "You read the cert's issuer (a CA) and expiry — chain of trust." },
    ],
  },
  {
    id: "secplus-mfa",
    cert: "Security+", domainId: "sp4", coach: "bo",
    title: "Turn on MFA (TOTP) on a real account",
    objective: "Security operations you'll do day one — enable app-based MFA and understand TOTP.",
    est: "~10 min", pdiUrl: "https://myaccount.google.com/security", envLabel: "Open account security ↗",
    steps: [
      { title: "Open account security", do: "Go to the security settings of an account you own (Google, GitHub, Microsoft).", verify: "You see 2-Step Verification / Two-factor settings." },
      { title: "Add an authenticator app", do: "Choose 'Authenticator app' (TOTP). It shows a QR code.", verify: "A QR code / secret key is displayed." },
      { title: "Scan it", do: "Scan the QR with an authenticator app (Google Authenticator, Authy, etc.). A 6-digit code appears and rotates every 30s.", verify: "Your app shows a rotating 6-digit code for this account." },
      { title: "Confirm & save backups", do: "Enter the current code to confirm, then save the backup/recovery codes somewhere safe.", verify: "MFA is enabled and you saved recovery codes." },
    ],
  },
  {
    id: "secplus-risk",
    cert: "Security+", domainId: "sp5", coach: "bo",
    title: "Build a 3-row risk register",
    objective: "Think like a security program manager — score risks by likelihood × impact and pick a response.",
    est: "~10 min", pdiUrl: "https://docs.new", envLabel: "Open a blank doc ↗",
    steps: [
      { title: "Open a blank doc/sheet", do: "Open a new Google Doc/Sheet (docs.new) and make 5 columns: Risk, Likelihood (1-5), Impact (1-5), Score, Response.", verify: "You have a table with those headers." },
      { title: "Add 3 risks", do: "Add 3 real risks (e.g. 'Phishing', 'Unpatched server', 'Lost laptop'). Rate Likelihood and Impact 1-5 each.", verify: "Three rows with likelihood + impact scores." },
      { title: "Score them", do: "Score = Likelihood × Impact. Fill it in and sort highest-first.", verify: "Each risk has a 1-25 score, sorted by priority." },
      { title: "Pick a response", do: "For each, choose Accept, Mitigate, Transfer, or Avoid — the four risk responses.", verify: "Every risk has one of the four responses." },
    ],
  },
  // ── AWS AI Practitioner (Bo-coached, AWS Free Tier) ─────────────
  {
    id: "aws-comprehend",
    cert: "AWS AI Practitioner", domainId: "ai1", coach: "bo",
    title: "Run Amazon Comprehend on text",
    objective: "Use a managed AI service — detect sentiment and entities in text, no model training.",
    est: "~10 min", pdiUrl: "https://console.aws.amazon.com/comprehend/", envLabel: "Open AWS Comprehend ↗",
    steps: [
      { title: "Open Comprehend", do: "Sign into the AWS Console (free tier) and open Amazon Comprehend > Real-time analysis.", verify: "The Comprehend real-time analysis page is open." },
      { title: "Analyze sentiment", do: "Paste a sentence like 'The service was slow but the staff were amazing.' and Analyze.", verify: "Comprehend returns a sentiment (e.g. Mixed) with confidence scores." },
      { title: "Read entities & key phrases", do: "Look at the Entities and Key phrases tabs.", verify: "It pulled out entities (people, places, orgs) and key phrases automatically." },
      { title: "Connect the concept", do: "Note this is a pre-trained AWS AI service (no ML by you) — that's the 'use managed AI' idea Bo will reinforce.", verify: "You understand Comprehend is a ready-made AI service." },
    ],
  },
  {
    id: "aws-bedrock",
    cert: "AWS AI Practitioner", domainId: "ai2", coach: "bo",
    title: "Chat with a foundation model in Amazon Bedrock",
    objective: "Touch generative AI on AWS — enable a model and prompt it in the Bedrock playground.",
    est: "~12 min", pdiUrl: "https://console.aws.amazon.com/bedrock/", envLabel: "Open Amazon Bedrock ↗",
    steps: [
      { title: "Open Bedrock", do: "In the AWS Console open Amazon Bedrock.", verify: "The Bedrock console is open." },
      { title: "Enable model access", do: "Go to Model access and request access to a model (e.g. an Amazon Titan or Anthropic Claude model). It may grant instantly.", verify: "At least one model shows Access granted." },
      { title: "Open the playground", do: "Go to Playgrounds > Chat/Text, pick your enabled model.", verify: "A chat/text playground is ready with your model." },
      { title: "Prompt it", do: "Ask it something ('Explain a foundation model in one sentence.').", verify: "The foundation model responds in the playground." },
    ],
  },
  {
    id: "aws-prompt",
    cert: "AWS AI Practitioner", domainId: "ai3", coach: "bo",
    title: "Tune inference parameters (temperature & top-p)",
    objective: "Apply foundation models well — see how temperature/top-p change the output.",
    est: "~10 min", pdiUrl: "https://console.aws.amazon.com/bedrock/", envLabel: "Open Bedrock Playground ↗",
    steps: [
      { title: "Open the playground", do: "In Bedrock > Playgrounds, select your enabled model.", verify: "Playground open with inference config controls visible." },
      { title: "Low temperature", do: "Set Temperature near 0. Ask 'Give me a creative startup name for a coffee app' twice.", verify: "Answers are focused and very similar each time." },
      { title: "High temperature", do: "Set Temperature near 1 (and/or raise Top-p). Ask the same thing twice.", verify: "Answers are more varied and creative each run." },
      { title: "Explain it", do: "Note: low temp = deterministic/safe, high temp = creative/varied — a key exam concept.", verify: "You can explain what temperature and top-p do." },
    ],
  },
  {
    id: "aws-guardrails",
    cert: "AWS AI Practitioner", domainId: "ai4", coach: "bo",
    title: "Create a Guardrail in Amazon Bedrock",
    objective: "Responsible AI in practice — build a guardrail that blocks a topic and test it.",
    est: "~12 min", pdiUrl: "https://console.aws.amazon.com/bedrock/", envLabel: "Open Bedrock Guardrails ↗",
    steps: [
      { title: "Open Guardrails", do: "In Amazon Bedrock, open Guardrails > Create guardrail. Name it 'My Lab Guardrail'.", verify: "The guardrail builder is open." },
      { title: "Add a denied topic", do: "Add a Denied topic (e.g. 'Investment advice') with a short description.", verify: "A denied topic is configured." },
      { title: "Set content filters", do: "Turn on content filters (hate, violence, etc.) at a strength, then create the guardrail.", verify: "The guardrail saved with filters." },
      { title: "Test it", do: "Use the guardrail's test panel: ask for the denied topic and watch it get blocked.", verify: "The guardrail blocked the denied request — responsible AI enforced." },
    ],
  },
];

export function getLab(id: string | undefined): Lab | undefined {
  return LABS.find((l) => l.id === id);
}
export function labsForDomain(domainId: string): Lab[] {
  return LABS.filter((l) => l.domainId === domainId);
}
