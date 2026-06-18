// Hands-on labs — guided by Flo against the student's OWN ServiceNow PDI.
// The AI never touches their instance; it coaches step-by-step and verifies by
// what the student describes/screenshots. Add a lab = one entry here.

export type LabStep = { title: string; do: string; verify: string };
export type Lab = {
  id: string;
  cert: string;          // "ServiceNow CSA"
  domainId?: string;     // ties back to a quiz domain (csa1, etc.)
  title: string;
  objective: string;
  est: string;           // "~15 min"
  pdiUrl: string;        // where to spin up / open the instance
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
];

export function getLab(id: string | undefined): Lab | undefined {
  return LABS.find((l) => l.id === id);
}
export function labsForDomain(domainId: string): Lab[] {
  return LABS.filter((l) => l.domainId === domainId);
}
