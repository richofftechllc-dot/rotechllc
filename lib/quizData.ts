// Auto-generated from rot-quiz/index.html. Regenerate: node scripts/extract-quiz-data.js
export type Question = { q: string; options: string[]; answer: number; exp: string };
export type Lab = { name: string; url: string; description?: string };
export type Domain = { id: string; name: string; questions: Question[]; labs?: Lab[] };
export type Track = { id: string; name: string; domains: Domain[] };

// Toggle on when a community call is live. Wired into the quiz sidebar.
export const LIVE_SESSION: { active: boolean; url?: string; title?: string; host?: string } = {
  active: false,
};

export const TRACKS: Track[] = [
  {
    "id": "sp",
    "name": "Security+",
    "domains": [
      {
        "id": "sp1",
        "name": "General Security Concepts",
        "questions": [
          {
            "q": "Which concept ensures data is only accessible to authorized users?",
            "options": [
              "Integrity",
              "Availability",
              "Confidentiality",
              "Non-repudiation"
            ],
            "answer": 2,
            "exp": "Confidentiality ensures only authorized people access data. It's the 'C' in the CIA triad — keeping secrets locked down."
          },
          {
            "q": "What does the 'A' in the CIA triad stand for?",
            "options": [
              "Authentication",
              "Availability",
              "Authorization",
              "Accountability"
            ],
            "answer": 1,
            "exp": "Availability ensures systems and data are accessible when needed. Secure data nobody can reach is useless."
          },
          {
            "q": "A user receives an email asking for login credentials claiming to be from their bank. This is:",
            "options": [
              "Whaling",
              "Phishing",
              "Vishing",
              "Smishing"
            ],
            "answer": 1,
            "exp": "Phishing = deceptive emails. Smishing = SMS. Vishing = voice calls. Whaling targets executives specifically."
          },
          {
            "q": "Which of the following is a preventive control?",
            "options": [
              "Audit log",
              "Security camera",
              "Firewall",
              "Incident response plan"
            ],
            "answer": 2,
            "exp": "Firewalls prevent unauthorized access — proactive. Cameras and logs are detective. IR plans are corrective."
          },
          {
            "q": "What is the principle of least privilege?",
            "options": [
              "Users receive only the access needed for their job",
              "Users inherit a default profile of broad privileges from their direct manager",
              "Users start with full access and lose privileges as roles narrow over time",
              "Users get the access level matching their hire date and tenure with the org"
            ],
            "answer": 0,
            "exp": "Least privilege = minimum necessary access. Read-only shouldn't mean delete too."
          },
          {
            "q": "Which authentication factor is a fingerprint?",
            "options": [
              "Something you have",
              "Something you are",
              "Something you know",
              "Somewhere you are"
            ],
            "answer": 1,
            "exp": "Biometrics = something you are. Passwords = something you know. Smart cards = something you have."
          },
          {
            "q": "What does MFA stand for?",
            "options": [
              "Multiple File Access",
              "Multi-Factor Authentication",
              "Multi-Function Authorization",
              "Managed Firewall Architecture"
            ],
            "answer": 1,
            "exp": "MFA requires two or more verification methods. Password alone isn't enough — you need layers."
          },
          {
            "q": "Which best describes non-repudiation?",
            "options": [
              "Verifying that a user is who they claim by checking their valid credentials",
              "Confirming that data has not been altered in transit between the two parties",
              "Ensuring a sender cannot deny sending a message",
              "Ensuring that an authorized user cannot bypass the access control list rules"
            ],
            "answer": 2,
            "exp": "Non-repudiation = you can't deny what you did. Digital signatures provide this."
          },
          {
            "q": "A control that detects and alerts on suspicious activity is classified as:",
            "options": [
              "Deterrent",
              "Detective",
              "Preventive",
              "Corrective"
            ],
            "answer": 1,
            "exp": "Detective controls identify incidents after they occur — IDS, audit logs, cameras."
          },
          {
            "q": "Which is an example of physical security?",
            "options": [
              "Antivirus software",
              "Mantrap",
              "Encryption",
              "Firewall"
            ],
            "answer": 1,
            "exp": "A mantrap is physical — two interlocking doors preventing tailgating. Physical protects the hardware itself."
          },
          {
            "q": "What is the purpose of a DMZ in network security?",
            "options": [
              "To monitor outbound employee web activity for policy compliance and reporting",
              "To store encrypted backup copies of critical infrastructure configuration files",
              "To encrypt traffic between internal subnets using a centrally managed VPN tunnel",
              "To provide a buffer zone between internal and external networks"
            ],
            "answer": 3,
            "exp": "DMZ sits between internal network and internet. Web servers often live here — public-facing but isolated."
          },
          {
            "q": "Which term describes converting plaintext into ciphertext?",
            "options": [
              "Encoding",
              "Tokenization",
              "Encryption",
              "Hashing"
            ],
            "answer": 2,
            "exp": "Encryption converts readable data to unreadable ciphertext using a key. Unlike hashing, it's reversible."
          },
          {
            "q": "A policy requiring password changes every 90 days is an example of:",
            "options": [
              "Administrative control",
              "Preventive control in a production environment",
              "Technical control",
              "Physical control"
            ],
            "answer": 0,
            "exp": "Password policies are administrative controls — written rules governing how people behave."
          },
          {
            "q": "Which is NOT a component of the CIA triad?",
            "options": [
              "Integrity",
              "Availability",
              "Authentication",
              "Confidentiality"
            ],
            "answer": 2,
            "exp": "CIA = Confidentiality, Integrity, Availability. Authentication is important but not part of the triad."
          },
          {
            "q": "What type of malware disguises itself as legitimate software?",
            "options": [
              "Ransomware",
              "Worm",
              "Rootkit",
              "Trojan"
            ],
            "answer": 3,
            "exp": "Trojan looks legit but carries malicious code. Named after the Greek myth — tricks you into letting it in."
          },
          {
            "q": "Which best describes a zero-day vulnerability?",
            "options": [
              "A vulnerability that affects only end-of-life systems no longer receiving any vendor updates",
              "A vulnerability unknown to the vendor with no available fix",
              "A vulnerability discovered in a specific software release within the last twenty-four hours",
              "A vulnerability already disclosed in the CVE database with patches available from the vendor"
            ],
            "answer": 1,
            "exp": "Zero-day = vendor has zero days to fix it — they don't even know it exists. Most dangerous category."
          },
          {
            "q": "What is the primary purpose of a security audit?",
            "options": [
              "To assess compliance with policies and identify weaknesses",
              "To document and respond to active incidents in progress within the operations center team",
              "To replace outdated security tools across the network with newer commercial alternatives",
              "To train end users on phishing recognition and the latest social engineering techniques"
            ],
            "answer": 0,
            "exp": "Security audits evaluate your posture against established standards. A checkup for your security program."
          },
          {
            "q": "Which encryption type uses the same key for encryption and decryption?",
            "options": [
              "Public key encryption combined with digital certificates issued by a trusted certificate authority",
              "Hashing algorithm that produces a fixed-length output from any input for integrity verification",
              "Asymmetric encryption that uses one public key for encryption and a private one for decryption",
              "Symmetric encryption"
            ],
            "answer": 3,
            "exp": "Symmetric uses one shared key — faster but key distribution is the challenge. AES is common symmetric."
          },
          {
            "q": "A social engineering attack using phone calls to manipulate victims is called:",
            "options": [
              "Vishing",
              "Phishing",
              "Smishing",
              "Whaling"
            ],
            "answer": 0,
            "exp": "Vishing = voice phishing. Attackers call pretending to be IT, banks, or government to steal info."
          },
          {
            "q": "Which is the best example of two-factor authentication?",
            "options": [
              "Username and password",
              "Two different passwords",
              "Password and security question",
              "PIN and fingerprint"
            ],
            "answer": 3,
            "exp": "True 2FA uses two DIFFERENT factor types. PIN = something you know. Fingerprint = something you are."
          }
        ]
      },
      {
        "id": "sp2",
        "name": "Threats, Vulnerabilities & Mitigations",
        "questions": [
          {
            "q": "What attack overwhelms a system with traffic to make it unavailable?",
            "options": [
              "Man-in-the-Middle",
              "SQL Injection",
              "Replay Attack",
              "Denial of Service"
            ],
            "answer": 3,
            "exp": "DoS/DDoS floods a system until it can't serve legitimate users. Botnets amplify these attacks."
          },
          {
            "q": "Which vulnerability injects malicious scripts into web pages viewed by other users?",
            "options": [
              "Cross-Site Scripting (XSS)",
              "Server-Side Request Forgery (SSRF)",
              "XML External Entity (XXE)",
              "Cross-Site Request Forgery (CSRF)"
            ],
            "answer": 0,
            "exp": "XSS injects malicious scripts into trusted websites. Other users' browsers execute the attacker's code."
          },
          {
            "q": "A penetration tester with no prior knowledge of the target is called:",
            "options": [
              "Crystal box testing",
              "White box testing",
              "Gray box testing",
              "Black box testing"
            ],
            "answer": 3,
            "exp": "Black box = no prior knowledge, simulates external attacker. White box = full knowledge. Gray = in between."
          },
          {
            "q": "Which is a vulnerability scanning tool?",
            "options": [
              "Netcat",
              "Nessus",
              "Wireshark",
              "Metasploit"
            ],
            "answer": 1,
            "exp": "Nessus is one of the most widely used vulnerability scanners. Wireshark captures packets, Metasploit exploits."
          },
          {
            "q": "What is a botnet?",
            "options": [
              "A network of antivirus tools sharing signature definitions across the organization",
              "A peer-to-peer file sharing network used to distribute large content packages cheaply",
              "A collection of compromised computers controlled by an attacker",
              "A self-healing mesh network topology designed to route around equipment failures"
            ],
            "answer": 2,
            "exp": "Botnets are armies of infected computers controlled remotely by an attacker. Used for DDoS, spam, and more."
          },
          {
            "q": "Which attack intercepts communication between two parties without their knowledge?",
            "options": [
              "Man-in-the-Middle",
              "Brute Force",
              "Phishing",
              "Privilege Escalation"
            ],
            "answer": 0,
            "exp": "MITM positions the attacker between communicating parties — they can eavesdrop and alter communication."
          },
          {
            "q": "What is the purpose of a honeypot?",
            "options": [
              "To filter outbound malicious traffic from compromised internal hosts on the network",
              "To store sensitive data in an encrypted vault separated from the production database",
              "To replace production systems during incident response and disaster recovery testing",
              "To attract and analyze attacker behavior"
            ],
            "answer": 3,
            "exp": "Honeypots are decoy systems that lure attackers. Helps you understand attack methods without real risk."
          },
          {
            "q": "Which best describes a supply chain attack?",
            "options": [
              "Compromising software or hardware before it reaches the end user",
              "Attacking delivery driver mobile devices to intercept shipment tracking information",
              "Disrupting logistics by attacking delivery vehicles between distribution warehouses",
              "Stealing physical packages from warehouses inside the corporate supply chain network"
            ],
            "answer": 0,
            "exp": "Supply chain attacks target the development or distribution process. SolarWinds is the famous example."
          },
          {
            "q": "A buffer overflow attack typically aims to:",
            "options": [
              "Intercept network packets in transit between two hosts on the corporate network",
              "Execute arbitrary code by overwriting memory",
              "Brute-force guess weak user passwords by trying every possible character combination",
              "Encrypt sensitive data on disk without the user's knowledge or any authorization"
            ],
            "answer": 1,
            "exp": "Buffer overflows write data beyond allocated memory, potentially overwriting code execution areas."
          },
          {
            "q": "What does CVE stand for?",
            "options": [
              "Common Vulnerabilities and Exposures",
              "Critical Vulnerability and Exploit reporting framework published by NIST yearly",
              "Common Vulnerability Exposures and the National Vulnerability Database Listings",
              "Cyber Vulnerability Enumeration system maintained by the Department of Defense"
            ],
            "answer": 0,
            "exp": "CVE = Common Vulnerabilities and Exposures. The standardized naming system for known security vulnerabilities."
          },
          {
            "q": "Which is a passive reconnaissance technique?",
            "options": [
              "Vulnerability scanning",
              "OSINT gathering",
              "Port scanning",
              "Social engineering"
            ],
            "answer": 1,
            "exp": "OSINT is passive — you gather publicly available info without touching the target's systems."
          },
          {
            "q": "Ransomware typically:",
            "options": [
              "Deletes all data on the affected system permanently and leaves no recovery option",
              "Monitors user activity silently and logs keystrokes back to a command-and-control server",
              "Steals data and quietly sends it to attackers without disrupting the user's work",
              "Encrypts data and demands payment for decryption"
            ],
            "answer": 3,
            "exp": "Ransomware encrypts your files and demands payment for the decryption key. Always maintain offline backups."
          },
          {
            "q": "What is SQL injection?",
            "options": [
              "Flooding a database server with excessive query traffic to cause a denial of service",
              "Encrypting database tables and demanding payment for the decryption key from the owner",
              "Inserting malicious SQL code into database queries",
              "Inserting malicious JavaScript into a website that runs in another visitor's browser"
            ],
            "answer": 2,
            "exp": "SQL injection inserts malicious SQL into input fields to manipulate database queries. Can expose or delete data."
          },
          {
            "q": "Which technique involves breaking a network into smaller isolated segments?",
            "options": [
              "Network encryption in a production environment",
              "Load balancing",
              "Network segmentation",
              "Patch management"
            ],
            "answer": 2,
            "exp": "Network segmentation limits the blast radius of a breach. Attackers can't automatically move everywhere."
          },
          {
            "q": "What is the purpose of patch management?",
            "options": [
              "To improve overall system performance and reduce the resource footprint over time",
              "To monitor outbound network traffic for unusual flows and anomalies across the org",
              "To update systems and fix known vulnerabilities",
              "To create and verify offline backups of business-critical production data nightly"
            ],
            "answer": 2,
            "exp": "Patch management keeps systems updated. Most breaches exploit known vulnerabilities with available patches."
          },
          {
            "q": "An attacker gains low-privileged access and escalates to admin. This is called:",
            "options": [
              "Privilege escalation",
              "Persistence",
              "Exfiltration",
              "Lateral movement in a production environment"
            ],
            "answer": 0,
            "exp": "Privilege escalation = climbing from limited to higher-level access. Exploits misconfigurations or vulnerabilities."
          },
          {
            "q": "Which is a characteristic of an Advanced Persistent Threat (APT)?",
            "options": [
              "Quick hit-and-run attacks completed in minutes against opportunistic targets",
              "Long-term stealthy presence in a network",
              "Opportunistic targeting that exploits whichever vulnerable host the attacker finds first",
              "Attacks targeting a single isolated system without spreading to the broader network"
            ],
            "answer": 1,
            "exp": "APTs are sophisticated, long-term — often nation-state. They stay hidden for months gathering intelligence."
          },
          {
            "q": "What is typosquatting?",
            "options": [
              "Registering misspelled domain names to catch misdirected traffic",
              "Fuzzing application inputs with random misspelled strings to find parsing vulnerabilities",
              "Scanning developer source code for misspelled function names that may indicate bugs",
              "A variant of SQL injection that exploits typos in stored procedure parameter names today"
            ],
            "answer": 0,
            "exp": "Typosquatting registers domains similar to popular sites (goggle.com) to catch users who mistype URLs."
          },
          {
            "q": "Which best describes a rootkit?",
            "options": [
              "A network reconnaissance tool used by attackers to identify open ports and services",
              "An authentication bypass technique exploiting weak session management on web apps",
              "A type of host-based firewall used to filter outbound application traffic from the OS",
              "Malware providing privileged access while hiding its presence"
            ],
            "answer": 3,
            "exp": "Rootkits hide deep in a system providing persistent access while concealing themselves from security tools."
          },
          {
            "q": "What is the primary goal of threat intelligence?",
            "options": [
              "To encrypt sensitive data at rest with strong algorithms approved by federal standards",
              "To recover from active security incidents already in progress and restore service fast",
              "To proactively understand and anticipate threats",
              "To patch known vulnerabilities faster than competitors and reduce window of exposure"
            ],
            "answer": 2,
            "exp": "Threat intelligence helps organizations understand who is attacking, why, and how — defend proactively."
          }
        ]
      },
      {
        "id": "sp3",
        "name": "Security Architecture",
        "questions": [
          {
            "q": "What does a next-generation firewall (NGFW) provide beyond traditional firewalls?",
            "options": [
              "Stateful inspection only",
              "Encrypted VPN tunneling only in a production environment",
              "Deep packet inspection and application awareness",
              "Static port-based filtering"
            ],
            "answer": 2,
            "exp": "NGFWs go beyond port/protocol filtering — they inspect application-layer traffic and integrate threat intelligence."
          },
          {
            "q": "Which is a characteristic of Zero Trust architecture?",
            "options": [
              "Verify once, trust always",
              "Trust but verify",
              "Trust all internal traffic",
              "Never trust, always verify"
            ],
            "answer": 3,
            "exp": "Zero Trust assumes breach and verifies every request. Being inside the network doesn't grant automatic trust."
          },
          {
            "q": "What is the purpose of a VPN?",
            "options": [
              "To create an encrypted tunnel for secure remote access",
              "To monitor outbound network traffic for malware command-and-control activity patterns",
              "To accelerate internet connections by caching frequently requested web content locally",
              "To block access to malicious websites flagged by an external reputation service"
            ],
            "answer": 0,
            "exp": "VPNs encrypt traffic between your device and a remote network. Critical for remote federal workers."
          },
          {
            "q": "Which cloud deployment model is exclusively used by a single organization?",
            "options": [
              "Community cloud",
              "Private cloud",
              "Public cloud",
              "Hybrid cloud"
            ],
            "answer": 1,
            "exp": "Private cloud is dedicated to one organization. More control and security, higher cost. Common in DOD."
          },
          {
            "q": "What is the primary purpose of a WAF?",
            "options": [
              "To filter inbound TCP and UDP traffic at the network layer below the application layer",
              "To encrypt database connections between application servers and backend storage clusters",
              "To manage SSL certificate lifecycle and rotation across the organization automatically",
              "To protect web applications from HTTP-based attacks"
            ],
            "answer": 3,
            "exp": "WAF filters HTTP traffic protecting against XSS, SQL injection, and other web attacks. Sits in front of web apps."
          },
          {
            "q": "Which protocol provides secure remote command-line access to network devices?",
            "options": [
              "FTP",
              "SSH",
              "Telnet",
              "HTTP"
            ],
            "answer": 1,
            "exp": "SSH encrypts remote command-line sessions. Telnet does the same unencrypted — never use Telnet in production."
          },
          {
            "q": "What does SDN stand for?",
            "options": [
              "Secure Data Network",
              "Software-Defined Networking",
              "Segmented Defense Network",
              "Static DNS Node"
            ],
            "answer": 1,
            "exp": "SDN separates control plane from data plane, allowing centralized network management through software."
          },
          {
            "q": "An IPS differs from an IDS in that an IPS:",
            "options": [
              "Monitors encrypted traffic only",
              "Actively blocks detected threats",
              "Requires manual intervention",
              "Only detects threats"
            ],
            "answer": 1,
            "exp": "IDS = detect and alert. IPS = detect and block. IPS takes automated action to stop threats."
          },
          {
            "q": "Which is an example of infrastructure as code?",
            "options": [
              "Manually configuring router and switch settings during each new network deployment",
              "Using scripts to provision cloud resources",
              "Physically installing rack-mounted servers in a data center by qualified field engineers",
              "Maintaining a paper-based change management process for production server modifications"
            ],
            "answer": 1,
            "exp": "IaC uses code like Terraform to provision infrastructure. Repeatable, version-controlled, and auditable."
          },
          {
            "q": "What is the purpose of network segmentation in security architecture?",
            "options": [
              "To contain breaches and limit lateral movement",
              "To improve internal network throughput by removing intermediate routing hops cleanly",
              "To reduce overall hardware procurement costs by consolidating onto fewer physical hosts",
              "To simplify network management by collapsing routing complexity into a single flat layer"
            ],
            "answer": 0,
            "exp": "Segmentation contains breaches. Attackers compromise one segment can't freely move to others. Critical in DOD."
          },
          {
            "q": "Which is a feature of SASE?",
            "options": [
              "On-premises-only security stack managed by the customer at each physical facility entry",
              "Site-to-site IPsec VPN replacement that keeps traffic flowing through datacenter perimeters",
              "Hardware-based security appliances installed at every branch office for local enforcement",
              "Converged networking and security delivered from the cloud"
            ],
            "answer": 3,
            "exp": "SASE combines SD-WAN with cloud-delivered security. Perfect for distributed workforces accessing cloud resources."
          },
          {
            "q": "What is the role of a load balancer in security architecture?",
            "options": [
              "To scan inbound traffic for malware signatures before forwarding to backend services",
              "To encrypt all internal network traffic between application servers in the datacenter",
              "To distribute traffic and improve availability and resilience",
              "To manage user identities and centrally enforce single sign-on across applications"
            ],
            "answer": 2,
            "exp": "Load balancers distribute traffic across multiple servers, improving availability and resilience against DDoS."
          },
          {
            "q": "Which describes microsegmentation?",
            "options": [
              "Using physical firewall appliances installed between floors of a corporate office building",
              "Dividing the network into a small number of large zones based on department membership",
              "Applying fine-grained security controls at the workload level",
              "Segmenting only external traffic flows while leaving internal east-west traffic unrestricted"
            ],
            "answer": 2,
            "exp": "Microsegmentation applies Zero Trust at workload level — individual applications isolated, not just network zones."
          },
          {
            "q": "What does CASB stand for?",
            "options": [
              "Content Analysis Security Block",
              "Cloud Access Security Broker",
              "Central Authentication Security Bridge",
              "Cloud Application Security Buffer"
            ],
            "answer": 1,
            "exp": "CASB acts as security policy enforcement between cloud users and providers. Visibility and control over cloud apps."
          },
          {
            "q": "Which is a key benefit of containers in secure architecture?",
            "options": [
              "Containers share the host OS kernel and are isolated from each other",
              "Containers eliminate every class of operating system vulnerability they ever encounter",
              "Containers require no patching once deployed since they ship as immutable image artifacts",
              "Containers are always more secure than virtual machines because of namespace isolation only"
            ],
            "answer": 0,
            "exp": "Containers share the OS kernel but are isolated through namespaces and cgroups. Faster than VMs."
          },
          {
            "q": "What is the purpose of a bastion host?",
            "options": [
              "To manage authoritative DNS records for internal hostnames inside the private network",
              "To load balance inbound web traffic across multiple application server backend pools",
              "To store sensitive credentials in a centralized vault accessible by privileged users only",
              "To provide a hardened entry point into a private network"
            ],
            "answer": 3,
            "exp": "A bastion host is a fortified gateway to your private network. Only this hardened system is exposed."
          },
          {
            "q": "Which principle involves designing systems to fail securely?",
            "options": [
              "Fail silent",
              "Fail open",
              "Fail loud",
              "Fail secure"
            ],
            "answer": 3,
            "exp": "Fail secure = when something breaks, it defaults to a secure state. A door failing locked is fail secure."
          },
          {
            "q": "What does SOAR stand for?",
            "options": [
              "Security Operations and Response automation for next-generation managed detection services",
              "Security Orchestration, Automation and Response",
              "System Orchestration and Auditing Repository for unified logging across cloud workloads",
              "Secure Operations Architecture Reporting framework published by federal cyber agencies"
            ],
            "answer": 1,
            "exp": "SOAR automates repetitive security tasks, orchestrates tools, and accelerates incident response."
          },
          {
            "q": "Which is a physical security control for data centers?",
            "options": [
              "Biometric access control",
              "Disk encryption at rest",
              "Web application firewall",
              "Intrusion detection sensor"
            ],
            "answer": 0,
            "exp": "Biometric access is physical. Best logical security means nothing if someone walks into your data center."
          },
          {
            "q": "What is the primary security concern with shadow IT?",
            "options": [
              "Shadow IT subscriptions are too expensive for departments to maintain without IT oversight",
              "Shadow IT reduces overall productivity because users have to learn unfamiliar application interfaces",
              "Shadow IT systems consume excessive bandwidth that interferes with sanctioned applications",
              "Unauthorized systems outside IT control create unmanaged security risks"
            ],
            "answer": 3,
            "exp": "Shadow IT = unauthorized apps employees use. IT can't secure what they don't know about."
          }
        ]
      },
      {
        "id": "sp4",
        "name": "Security Operations",
        "questions": [
          {
            "q": "What is the first step in incident response?",
            "options": [
              "Containment",
              "Recovery",
              "Identification/Detection",
              "Eradication in a production environment"
            ],
            "answer": 2,
            "exp": "You can't respond to what you haven't identified. Detection and identification come first — always."
          },
          {
            "q": "Which is a key function of a SIEM?",
            "options": [
              "Managing user account provisioning and access reviews across enterprise applications",
              "Encrypting data at rest in primary databases and archived backups for compliance reasons",
              "Aggregating and correlating security logs from multiple sources",
              "Blocking inbound network traffic at the perimeter firewall and dropping suspicious sessions"
            ],
            "answer": 2,
            "exp": "SIEM collects logs from across your environment and correlates them to identify patterns. Security command center."
          },
          {
            "q": "What does chain of custody refer to in digital forensics?",
            "options": [
              "Documentation tracking evidence handling from collection to court",
              "The hierarchy of incident responders working a major security event from triage to closure",
              "The network path data travels between collection point and centralized analysis platform",
              "The encryption used to protect evidence files in transit and at rest in the case management"
            ],
            "answer": 0,
            "exp": "Chain of custody documents who handled evidence, when, and why. Break it and evidence may be inadmissible."
          },
          {
            "q": "Which is an example of data loss prevention (DLP)?",
            "options": [
              "Enforcing password complexity requirements at the directory level for all employee accounts",
              "Configuring inbound firewall rules to block traffic from suspicious external IP addresses",
              "Encrypting data at rest on database servers so unauthorized readers cannot recover values",
              "Blocking USB drives from transferring sensitive files"
            ],
            "answer": 3,
            "exp": "DLP prevents sensitive data from leaving your org. Blocking USB transfers, monitoring email attachments."
          },
          {
            "q": "What is the purpose of a playbook in security operations?",
            "options": [
              "To track employee performance metrics across the security operations center on a weekly basis",
              "To provide step-by-step procedures for responding to specific incidents",
              "To manage software licenses and renewal dates for the deployed security tooling stack",
              "To document the network topology and asset inventory for compliance reporting purposes"
            ],
            "answer": 1,
            "exp": "Playbooks are predefined response procedures. When ransomware hits at 2am, you follow the playbook."
          },
          {
            "q": "Which incident response phase involves restoring systems to normal operation?",
            "options": [
              "Identification",
              "Recovery",
              "Containment",
              "Lessons learned"
            ],
            "answer": 1,
            "exp": "Recovery restores systems after eradication — rebuilding systems, restoring backups, validating everything works."
          },
          {
            "q": "What is threat hunting?",
            "options": [
              "Proactively searching for hidden threats in an environment",
              "Monitoring inbound network traffic for unauthorized access attempts passively at the edge",
              "Responding to automated alerts generated by the SIEM correlation engine in real time",
              "Scanning systems for known vulnerabilities tracked in the public CVE database regularly"
            ],
            "answer": 0,
            "exp": "Threat hunting assumes attackers are already in your environment. Hunters proactively search for IOCs."
          },
          {
            "q": "Which is a characteristic of a tabletop exercise?",
            "options": [
              "Live red-team penetration testing conducted against the actual production environment",
              "Automated vulnerability scanning of internet-facing assets using a commercial scanner",
              "Discussion-based simulation of incident scenarios",
              "Physical security testing that involves social engineering attempts at office entrances"
            ],
            "answer": 2,
            "exp": "Tabletop exercises are discussion-based — walk through scenarios without touching live systems."
          },
          {
            "q": "What does EDR stand for?",
            "options": [
              "Enterprise Data Recovery",
              "External Threat Detection and Response",
              "Endpoint Detection and Response",
              "Encrypted Data Repository"
            ],
            "answer": 2,
            "exp": "EDR monitors endpoints for suspicious activity and enables rapid investigation and response."
          },
          {
            "q": "Which log source do you check first when investigating a failed login?",
            "options": [
              "Network flow logs",
              "Application access logs in a production environment",
              "Authentication/security logs",
              "DNS query logs"
            ],
            "answer": 2,
            "exp": "Authentication logs capture login attempts. Windows Event ID 4625 is your best friend here."
          },
          {
            "q": "What is the purpose of network flow analysis in security operations?",
            "options": [
              "To decrypt all encrypted network traffic and inspect the underlying application payloads",
              "To block suspicious source IP addresses at the edge firewall on a rolling basis automatically",
              "To analyze traffic patterns and detect anomalies",
              "To manage available network bandwidth between branch sites and the centralized datacenter"
            ],
            "answer": 2,
            "exp": "Flow analysis examines connection metadata to detect anomalies without needing to decrypt traffic."
          },
          {
            "q": "Which is an indicator of compromise (IOC)?",
            "options": [
              "A known malicious IP address in network logs",
              "An authorized service account login from a sanctioned management workstation",
              "A scheduled system backup completing successfully overnight as expected on schedule",
              "A new software deployment package being staged to a test environment before promotion"
            ],
            "answer": 0,
            "exp": "IOCs are evidence of compromise — malicious IPs, unusual outbound connections, strange file hashes."
          },
          {
            "q": "What is the primary purpose of vulnerability management?",
            "options": [
              "To monitor outbound network traffic for anomalies indicating ongoing data exfiltration",
              "To respond to active incidents already in progress and contain the immediate blast radius",
              "To manage user access rights across enterprise applications using role-based access controls",
              "To identify, classify, and remediate vulnerabilities before exploitation"
            ],
            "answer": 3,
            "exp": "Vulnerability management is proactive — find and fix weaknesses before attackers do. Continuous cycle."
          },
          {
            "q": "Which best describes defense in depth?",
            "options": [
              "Relying on perimeter security only",
              "Using only technical controls",
              "Using the strongest possible single control",
              "Implementing multiple layers of security controls"
            ],
            "answer": 3,
            "exp": "Defense in depth layers multiple controls — if one fails, others compensate. Perimeter, network, endpoint, data."
          },
          {
            "q": "What does MTTR measure?",
            "options": [
              "Malware Threat Tracking Report",
              "Mean Time To Respond",
              "Maximum Threat Tolerance Rating",
              "Mean Time To Recover"
            ],
            "answer": 3,
            "exp": "MTTR = how long to fix an issue after detection. Lower MTTR = more resilient security operations."
          },
          {
            "q": "Which tool is commonly used for packet capture and analysis?",
            "options": [
              "Nmap",
              "Wireshark",
              "Metasploit",
              "Nessus"
            ],
            "answer": 1,
            "exp": "Wireshark captures and analyzes network packets in real time. Essential for investigating suspicious traffic."
          },
          {
            "q": "What is the purpose of log retention policies?",
            "options": [
              "To improve performance of analytics systems by limiting the volume of historical log data",
              "To ensure logs are available for investigations and compliance",
              "To support privacy regulations by deleting logs that contain user data after a brief window",
              "To reduce overall storage costs by aggressively deleting older logs after a short retention"
            ],
            "answer": 1,
            "exp": "Log retention ensures you have historical data for investigations. Many regulations require 1-7 years."
          },
          {
            "q": "Which is a key metric for evaluating security operations effectiveness?",
            "options": [
              "Mean time to detect (MTTD)",
              "Number of security tools deployed",
              "Number of employees trained",
              "Budget spent"
            ],
            "answer": 0,
            "exp": "MTTD measures how quickly you identify threats. Faster detection = less damage. Goal is minutes not days."
          },
          {
            "q": "What is the role of threat feeds in security operations?",
            "options": [
              "To provide current intelligence on known threats and IOCs",
              "To encrypt sensitive data in transit and at rest using approved cryptographic algorithms",
              "To manage user identities and centrally enforce single sign-on across all applications",
              "To automate patch deployment across production servers on a recurring weekly cadence"
            ],
            "answer": 0,
            "exp": "Threat feeds provide real-time intelligence — malicious IPs, domains, file hashes your defenses can act on."
          },
          {
            "q": "Which is a best practice for handling evidence in a digital investigation?",
            "options": [
              "Share evidence freely among the entire incident response team for collaborative analysis",
              "Delete original evidence after the investigation concludes to free up disk storage space",
              "Create forensic copies and work from copies",
              "Work directly on original evidence to preserve the most accurate timestamps possible"
            ],
            "answer": 2,
            "exp": "Always work from forensic copies — never the original. Preserves evidence and maintains chain of custody."
          }
        ]
      },
      {
        "id": "sp5",
        "name": "Security Program Management",
        "questions": [
          {
            "q": "What is the purpose of a risk assessment?",
            "options": [
              "To test the operational effectiveness of deployed security controls against benchmarks",
              "To document every security incident that occurred during the previous fiscal year",
              "To completely eliminate every risk identified across the organization's technology stack",
              "To identify, analyze, and prioritize risks to organizational assets"
            ],
            "answer": 3,
            "exp": "Risk assessments identify what could go wrong, how likely, and what the impact is. Can't manage what you haven't measured."
          },
          {
            "q": "Which framework is commonly used for cybersecurity in federal environments?",
            "options": [
              "COBIT (Control Objectives for Information and Related Technologies framework)",
              "NIST Cybersecurity Framework",
              "CIS Critical Security Controls (community-developed benchmark from Center for Internet Security)",
              "ISO 27001 (information security management standard published by ISO)"
            ],
            "answer": 1,
            "exp": "NIST CSF is the gold standard for federal cybersecurity. Identify, Protect, Detect, Respond, Recover."
          },
          {
            "q": "What does GRC stand for?",
            "options": [
              "Global Risk Certification",
              "Governance, Risk, and Compliance",
              "Government Regulatory Compliance",
              "General Risk Control"
            ],
            "answer": 1,
            "exp": "GRC = Governance, Risk, and Compliance. Integrated approach to managing overall governance and security posture."
          },
          {
            "q": "Which is an example of a quantitative risk assessment?",
            "options": [
              "Calculating Annual Loss Expectancy (ALE)",
              "Conducting expert interviews using a Delphi method to estimate likelihood and impact",
              "Using a heat-map risk matrix to plot likelihood against impact on a color-coded grid",
              "Rating identified risks on a high/medium/low scale based on consensus from stakeholders"
            ],
            "answer": 0,
            "exp": "Quantitative uses numbers. ALE = Asset Value × Exposure Factor × Annual Rate of Occurrence. Dollar figure for risk."
          },
          {
            "q": "What is the purpose of a BCP?",
            "options": [
              "To document and manage the employee benefits enrollment cycle for the upcoming year",
              "To document every security incident that occurred during the previous calendar year",
              "To plan and budget for IT infrastructure upgrades over the next two fiscal quarters",
              "To ensure critical business functions continue during and after a disruption"
            ],
            "answer": 3,
            "exp": "BCP ensures the business keeps running during disruptions. Covers people, processes, and technology."
          },
          {
            "q": "What does RTO stand for in disaster recovery?",
            "options": [
              "Recovery Time Objective",
              "Restoration Target Operations",
              "Risk Tolerance Outcome",
              "Response Time Override"
            ],
            "answer": 0,
            "exp": "RTO = how quickly you need to restore operations after a disaster. Miss the RTO and the business suffers."
          },
          {
            "q": "Which regulation governs the protection of health information?",
            "options": [
              "HIPAA",
              "SOX",
              "GDPR",
              "PCI DSS"
            ],
            "answer": 0,
            "exp": "HIPAA protects patient health information. PHI has strict handling requirements. Know this for healthcare clients."
          },
          {
            "q": "What is the purpose of security awareness training?",
            "options": [
              "To teach employees penetration testing techniques used by the internal red team members",
              "To reduce human error and improve security culture",
              "To comply with software licensing requirements that mandate annual end-user training",
              "To train IT staff on technical skills required for the next certification exam cycle"
            ],
            "answer": 1,
            "exp": "Security awareness addresses the human element — the weakest link. Phishing simulations reduce social engineering success."
          },
          {
            "q": "Which is an example of data classification?",
            "options": [
              "Labeling data as Public, Internal, Confidential, or Top Secret",
              "Backing up data on a regular schedule with off-site copies for disaster recovery purposes",
              "Compressing data files before transferring them between systems on the corporate network",
              "Encrypting every data file at rest regardless of its sensitivity level or business value"
            ],
            "answer": 0,
            "exp": "Data classification assigns sensitivity labels. Government uses Unclassified, CUI, Secret, TS, and TS/SCI."
          },
          {
            "q": "What is the difference between a policy and a procedure?",
            "options": [
              "Policies are technical configurations; procedures are administrative business rules",
              "A procedure states what should happen; a policy explains step-by-step how to do it",
              "A policy states what; a procedure explains how",
              "Policies and procedures are interchangeable terms with no meaningful distinction"
            ],
            "answer": 2,
            "exp": "Policy = the 'what' and 'why' at high level. Procedure = step-by-step 'how.' You need both."
          },
          {
            "q": "Which best describes due diligence in cybersecurity?",
            "options": [
              "Responding quickly and effectively to active security incidents as they happen in real time",
              "Hiring certified cybersecurity professionals with the latest industry credentials and degrees",
              "Installing the latest commercial security tools approved by industry analyst firms each year",
              "Performing the ongoing effort required to maintain security"
            ],
            "answer": 3,
            "exp": "Due diligence is the ongoing work to understand and manage risk. Knowledge without action isn't enough."
          },
          {
            "q": "What is the purpose of a vendor risk management program?",
            "options": [
              "To negotiate better contract pricing with vendors during annual subscription renewals",
              "To assess and manage security risks from third parties",
              "To evaluate product features offered by competing vendors during contract negotiation",
              "To track third-party vendor payment schedules and renewal dates across the procurement team"
            ],
            "answer": 1,
            "exp": "Third-party risk is real. VRM programs assess vendors before onboarding and monitor them continuously."
          },
          {
            "q": "Which is a key component of a security charter?",
            "options": [
              "The scope, authority, and mission of the security function",
              "A directory of all employee personal information including emergency contacts and addresses",
              "Detailed network topology diagrams showing every device connected inside the corporate LAN",
              "Technical configuration details for the deployed firewall and intrusion detection systems"
            ],
            "answer": 0,
            "exp": "A security charter defines the authority and mandate of the security team. Without it, security has no official standing."
          },
          {
            "q": "What does 'privacy by design' mean?",
            "options": [
              "Hiding sensitive data using obfuscation techniques applied after the system is built and deployed",
              "Incorporating privacy protections into systems from the beginning",
              "Making security controls invisible to the end user so they don't have to think about them",
              "Using the privacy settings built into commercial software at the time the application is purchased"
            ],
            "answer": 1,
            "exp": "Privacy by design = building privacy in from day one. GDPR essentially mandates this approach."
          },
          {
            "q": "Which is an example of a technical control?",
            "options": [
              "Background checks",
              "Security policy",
              "Security awareness training",
              "Encryption"
            ],
            "answer": 3,
            "exp": "Technical controls are technology-based — encryption, firewalls, IDS. Administrative = policies. Physical = barriers."
          },
          {
            "q": "What is the purpose of a security metrics program?",
            "options": [
              "To monitor day-to-day employee productivity and time spent on assigned security tasks",
              "To measure the effectiveness of security controls and programs",
              "To count the total number of security incidents handled by the operations team each year",
              "To manage and track the licenses for deployed security tools across the enterprise estate"
            ],
            "answer": 1,
            "exp": "Metrics demonstrate security program value to leadership and identify improvement areas. Measure to manage."
          },
          {
            "q": "Which best describes a privacy impact assessment (PIA)?",
            "options": [
              "A technical configuration scan of the privacy and consent settings inside enterprise applications",
              "An audit of employee policy violations conducted by the internal compliance team annually",
              "An analysis of how personal data is collected, used, and protected",
              "A checklist for verifying compliance with the European Union General Data Protection Regulation"
            ],
            "answer": 2,
            "exp": "A PIA systematically evaluates privacy implications. Required for federal systems under the Privacy Act."
          },
          {
            "q": "What is the role of a CISO?",
            "options": [
              "To manage the technology help desk and end-user support ticket queue on a daily basis",
              "To manage day-to-day IT operations including the server and network infrastructure teams",
              "To oversee and direct an organization's information security strategy",
              "To handle only physical security including badge access systems and surveillance camera feeds"
            ],
            "answer": 2,
            "exp": "The CISO owns the security strategy and program. Bridges technical security with business risk at the C-suite."
          },
          {
            "q": "Which is a key principle of the NIST Risk Management Framework?",
            "options": [
              "Only IT and security staff carry responsibility for the security of the system end to end",
              "Security can be implemented as a one-time project at the start of a system's lifecycle",
              "Risk can be completely eliminated through layered controls and rigorous testing procedures",
              "Security is continuous and integrated throughout the system lifecycle"
            ],
            "answer": 3,
            "exp": "NIST RMF is a continuous 7-step process. Federal systems must go through ATO via RMF. Never done."
          },
          {
            "q": "What is the purpose of an after-action review following a security incident?",
            "options": [
              "To formally assign blame to the specific individuals whose actions contributed to the breach",
              "To document lessons learned and improve future response",
              "To notify external regulators and law enforcement of the breach within the required windows",
              "To calculate the financial losses incurred by the affected business units during the incident"
            ],
            "answer": 1,
            "exp": "After-action reviews improve your response for next time. Blame has no place — the goal is to get better."
          }
        ]
      }
    ]
  },
  {
    "id": "csa",
    "name": "ServiceNow CSA",
    "domains": [
      {
        "id": "csa1",
        "name": "UI & Navigation",
        "questions": [
          {
            "q": "What is the default home page of a ServiceNow instance called?",
            "options": [
              "Dashboard",
              "Quick view canvas",
              "Welcome page",
              "Landing screen"
            ],
            "answer": 0,
            "exp": "The Dashboard (or Homepage) is what users see when they log in. Can be personalized with widgets and gauges."
          },
          {
            "q": "Which element provides access to all applications and modules?",
            "options": [
              "Service Portal",
              "Filter Navigator",
              "Application Navigator",
              "Workspace switcher in production"
            ],
            "answer": 2,
            "exp": "The Application Navigator is the left sidebar. Filter it by typing in the search box at the top."
          },
          {
            "q": "What is the content frame in ServiceNow?",
            "options": [
              "A read-only sidebar showing recent records and pending approvals",
              "A configurable widget panel displayed inside the Application Navigator",
              "A status banner that surfaces system messages from the platform admin",
              "The main working area where forms and lists display"
            ],
            "answer": 3,
            "exp": "The content frame is the large main area on the right where lists, forms, and dashboards display."
          },
          {
            "q": "How do you access System Settings in ServiceNow?",
            "options": [
              "Through the gear icon in the top-right banner",
              "Type system.settings in the Application Navigator filter box",
              "Open the user profile menu and select Edit Layout Options",
              "Right-click any list header and choose Personalize Settings"
            ],
            "answer": 0,
            "exp": "The gear icon (⚙️) in the banner gives you System Settings — customize UI, timezone, accessibility, and more."
          },
          {
            "q": "What is the purpose of Favorites in ServiceNow?",
            "options": [
              "To restrict module visibility for end users without ACLs",
              "To quickly access frequently used modules and records",
              "To replace the default homepage with a personalized landing page",
              "To preload module data so the navigator opens faster overall"
            ],
            "answer": 1,
            "exp": "Favorites let you pin modules and records you access often. Star anything in the navigator to add it."
          },
          {
            "q": "Which describes the Global Search in ServiceNow?",
            "options": [
              "Searches across multiple tables and modules simultaneously",
              "Searches the System Properties table for matching key names",
              "Searches the current table only using the active list filter",
              "Searches a specific module's records through the URL bar input"
            ],
            "answer": 0,
            "exp": "Global Search searches across configured tables simultaneously. Far more powerful than a table-level filter."
          },
          {
            "q": "What are breadcrumbs in the ServiceNow interface?",
            "options": [
              "Visual style applied to a record list when in personalized view",
              "Saved filter conditions that auto-apply when opening a list",
              "Quick-access bookmarks pinned to the user's profile menu",
              "Navigation trail showing current location"
            ],
            "answer": 3,
            "exp": "Breadcrumbs show your navigation path — where you are and how you got there. Click any to jump back."
          },
          {
            "q": "What is the purpose of the Connect sidebar?",
            "options": [
              "To provide real-time collaboration and messaging within the platform",
              "To broadcast platform announcements to all logged-in users",
              "To display a per-user notification badge for inbox activity in production",
              "To pin frequently used modules to the top of the navigator"
            ],
            "answer": 0,
            "exp": "Connect sidebar enables real-time chat and collaboration directly in ServiceNow. @mention team members."
          },
          {
            "q": "How are application menus organized in the Application Navigator?",
            "options": [
              "Alphabetically across all installed scoped applications",
              "By recent usage with the most-accessed modules listed first",
              "By module, grouped under application menus",
              "Grouped by the role required to access each individual module"
            ],
            "answer": 2,
            "exp": "The navigator groups modules under their parent application menus. ITSM has Incident, Problem, Change grouped together."
          },
          {
            "q": "What does pinning a module in the Application Navigator do?",
            "options": [
              "Bookmarks the module's first record as the default landing page",
              "Hides the module from other users who lack the matching role",
              "Adds the module to your Service Portal home screen widget list",
              "Keeps the module visible at the top of the navigator"
            ],
            "answer": 3,
            "exp": "Pinning keeps a module visible even when filtered to a different area. Always accessible."
          },
          {
            "q": "What is the banner in ServiceNow?",
            "options": [
              "The top horizontal bar with logo, search, and user settings",
              "The vertical sidebar with quick links to chat and notifications",
              "The footer area showing the current session ID and node name",
              "The collapsible left panel listing application menus and modules"
            ],
            "answer": 0,
            "exp": "The banner is the top bar of the ServiceNow interface — always visible regardless of what you're doing."
          },
          {
            "q": "What is the purpose of the Service Portal?",
            "options": [
              "To give administrators a single dashboard for instance-wide health",
              "To provide a consumer-friendly self-service interface for end users",
              "To deliver a developer-focused workspace for building scoped apps",
              "To provide a backend admin console for managing scoped applications"
            ],
            "answer": 1,
            "exp": "Service Portal is the end-user facing interface — clean, modern, mobile-friendly. Employees submit requests here."
          },
          {
            "q": "What is a homepage in ServiceNow?",
            "options": [
              "A configurable dashboard with widgets showing relevant information",
              "A static system page showing the current ServiceNow release notes",
              "A scoped application page that lists every module in that scope",
              "A read-only summary page generated from the user's role assignments"
            ],
            "answer": 0,
            "exp": "Homepages are configurable dashboards seen after logging in. Multiple homepages can exist for different roles."
          },
          {
            "q": "How can you switch between different homepages?",
            "options": [
              "Update the homepage field in your user profile preferences",
              "Use the gear icon and pick a homepage from the dropdown list",
              "Right-click the homepage and choose 'Switch to Default View'",
              "Use the homepage carousel arrows or dropdown at the top"
            ],
            "answer": 3,
            "exp": "The homepage carousel at the top lets you navigate between available homepages. Dropdown to jump directly."
          },
          {
            "q": "What is the purpose of the 'Impersonate User' feature?",
            "options": [
              "To send a test notification email as another platform user",
              "To delegate approval authority during another user's vacation in production",
              "To view the system as another user to troubleshoot their experience",
              "To assign tasks to another user on a temporary basis only"
            ],
            "answer": 2,
            "exp": "Impersonate User lets admins see exactly what a specific user sees. Essential for troubleshooting access issues."
          },
          {
            "q": "Which area allows you to set your display name and time zone?",
            "options": [
              "System Settings via the gear icon in the banner",
              "Profile Preferences via the Service Portal home page",
              "User Profile via your name in the banner",
              "User Administration module via Application Navigator"
            ],
            "answer": 2,
            "exp": "Click your name in the banner to access your profile — update display name, timezone, language, notification preferences."
          },
          {
            "q": "What is the Mobile interface in ServiceNow designed for?",
            "options": [
              "A limited admin console exclusive to mobile device managers",
              "A read-only interface for executive users browsing dashboards",
              "A mobile-optimized experience for users on phones and tablets",
              "A scaled-down web view of the desktop UI inside any browser"
            ],
            "answer": 2,
            "exp": "ServiceNow Mobile provides native iOS and Android apps for field workers and on-the-go access."
          },
          {
            "q": "What does the asterisk (*) indicate on a ServiceNow form field?",
            "options": [
              "The field is mandatory/required",
              "The field has a default value set in the dictionary",
              "The field was changed since the last form save",
              "The field is read-only on the current form view"
            ],
            "answer": 0,
            "exp": "An asterisk (*) marks mandatory fields. The form won't submit until all required fields are filled."
          },
          {
            "q": "What is the purpose of the History feature in navigation?",
            "options": [
              "To audit which records a specific user has accessed recently in production",
              "To quickly navigate back to recently viewed records and pages",
              "To restore an older version of a record from the audit log",
              "To re-trigger a saved notification on the last viewed record"
            ],
            "answer": 1,
            "exp": "The History list (clock icon) shows recently accessed records and pages. Jump back to recent work instantly."
          },
          {
            "q": "What is the Filter Navigator?",
            "options": [
              "The search box at the top of the Application Navigator that filters visible modules",
              "A reusable saved filter shared by everyone in a security group",
              "A configuration table holding navigator labels and module URLs in production across the platform",
              "An admin-only debug tool that traces navigator click events"
            ],
            "answer": 0,
            "exp": "The Filter Navigator search box at the top of the left sidebar instantly filters all apps and modules as you type."
          },
          {
            "q": "You're on the Incident list and want to keep it open while opening an INC record in a separate tab. What's the fastest way?",
            "options": [
              "Click the record number once and let the form open inline",
              "Use the back arrow after the record loads to return to your list",
              "Use Ctrl+click to open the same record in a fullscreen overlay",
              "Right-click the record number and select 'Open in New Tab'"
            ],
            "answer": 3,
            "exp": "Right-click → Open in New Tab keeps your filtered list intact while you work the record. Browser back button won't lose your filter. Daily-use trick."
          },
          {
            "q": "What is the Polaris UI in modern ServiceNow versions?",
            "options": [
              "A new mobile-only theme that replaces the desktop interface",
              "A custom branding kit for admins to skin their own instance",
              "The refreshed Next Experience visual design — rounded corners, lighter palette, updated typography",
              "A legacy UI layer that still ships for backward compatibility in production across the platform"
            ],
            "answer": 2,
            "exp": "Polaris is the visual language of the Next Experience UI. Same navigator, same forms — different look. Some clients still use the legacy UI16; know both."
          },
          {
            "q": "A user complains they can't see the Application Navigator at all — only the content frame. Most likely cause?",
            "options": [
              "The user is missing the itil role required to see modules",
              "The user's session expired and only the content frame remains in production across the platform",
              "The navigator is collapsed — click the toggle icon at the top-left to expand it",
              "The instance is in a degraded mode that hides side panels"
            ],
            "answer": 2,
            "exp": "The navigator can be collapsed to give more screen real estate. Click the hamburger / toggle icon at the top-left to bring it back. Not a permissions issue 99% of the time."
          },
          {
            "q": "What does the Connect Chat sidebar primarily enable?",
            "options": [
              "Real-time messaging with other ServiceNow users and group conversations tied to records",
              "Federated single-sign-on for users across multiple instances",
              "Outbound email broadcasting to user-defined distribution lists in production across the platform",
              "Async background notifications sent to mobile device endpoints"
            ],
            "answer": 0,
            "exp": "Connect Chat is internal — like Slack inside ServiceNow. You can attach a conversation to a record so the discussion lives where the work lives."
          },
          {
            "q": "What's the purpose of the 'All' menu in the Next Experience navigation?",
            "options": [
              "Replaces the admin console with a unified diagnostics dashboard for instance-wide health checks in production across the platform",
              "Replaces the Service Portal with a unified consumer experience for end users requesting help",
              "Replaces the legacy mobile app with a unified search interface for any agent on the go",
              "Replaces the legacy Application Navigator with a unified search and filter experience for all apps and modules"
            ],
            "answer": 3,
            "exp": "In Next Experience the 'All' menu is the new home for what the old Application Navigator did — search every app and module from one place. Same function, cleaner interface."
          }
        ]
      },
      {
        "id": "csa2",
        "name": "Lists & Filters",
        "questions": [
          {
            "q": "What is a list view in ServiceNow?",
            "options": [
              "A read-only listing of the current record's field history",
              "A tabular display of multiple records from a table",
              "A search interface that returns matching records as cards",
              "A graphical chart of record counts grouped by a chosen field"
            ],
            "answer": 1,
            "exp": "List views display multiple records in table format — rows are records, columns are fields. Like a spreadsheet of your data."
          },
          {
            "q": "How do you create a personal filter on a list?",
            "options": [
              "Use the filter icon and define conditions, then save as favorite",
              "Type the filter conditions in the URL bar after the table name in production",
              "Use the gear icon and choose Personalize List Filter Defaults",
              "Open the table record in sys_db_object and set a default query"
            ],
            "answer": 0,
            "exp": "Click the filter icon (funnel) at the top of any list, define conditions using the condition builder, save as favorite."
          },
          {
            "q": "What does a breadcrumb filter show in a list view?",
            "options": [
              "The list of columns being grouped in the current list view",
              "Recent search terms entered into the global search box",
              "All saved personal filter favorites pinned for the current user",
              "Active filter conditions applied to the current list"
            ],
            "answer": 3,
            "exp": "Breadcrumb filters show the active conditions filtering your list. Click any chip to remove that condition."
          },
          {
            "q": "How can you sort a list in ServiceNow?",
            "options": [
              "Add a sort directive to the URL query parameters manually",
              "Open the list mechanic settings and pick a sort order field",
              "Click the column header to sort ascending/descending",
              "Right-click the column header and choose Sort Ascending only"
            ],
            "answer": 2,
            "exp": "Click any column header to sort ascending. Click again for descending. Arrow indicator shows current sort."
          },
          {
            "q": "What is the purpose of the 'Group By' function in a list?",
            "options": [
              "To filter the list so only records matching the chosen value remain",
              "To export the chosen field as the first column in CSV downloads",
              "To organize records into grouped sections by a selected field value",
              "To pin a chosen field to the top of the list as a header column"
            ],
            "answer": 2,
            "exp": "Group By organizes list rows into collapsible sections based on a field value. Incidents by priority, by state."
          },
          {
            "q": "What does right-clicking a column header allow you to do?",
            "options": [
              "Access column-specific options like Configure, Group By, and more",
              "Reset only that column to its system default width and label",
              "Promote that column as the new primary key for the record list",
              "Pin that column to the left so it stays visible during horizontal scroll"
            ],
            "answer": 0,
            "exp": "Right-clicking a column header gives options: Group By, sort, show/hide columns, configure the list. Power user tool."
          },
          {
            "q": "How do you add a field/column to a list view without going to List Layout?",
            "options": [
              "Use the Form Designer to add the field then refresh the list",
              "Open the List Layout tool from the gear icon in the banner",
              "Edit the sys_ui_list record for that table to add the field",
              "Use the column chooser by right-clicking any column header"
            ],
            "answer": 3,
            "exp": "Right-click any column header → 'Show / hide columns' to quickly add or remove columns from your current view."
          },
          {
            "q": "What is a list filter condition composed of?",
            "options": [
              "Column, sort, label",
              "Field, operator, and value",
              "Domain, scope, query in production",
              "Table, view, role"
            ],
            "answer": 1,
            "exp": "Every filter condition: Field (what), Operator (is/contains/starts with), Value (what you're looking for)."
          },
          {
            "q": "What does the 'Export' option on a list allow?",
            "options": [
              "Downloads list data as Excel, CSV, PDF, or other formats",
              "Generates a printable PDF of the list with selected columns",
              "Saves the current list as a personal favorite filter set",
              "Schedules the current list to email the recipient on a cadence"
            ],
            "answer": 0,
            "exp": "Export downloads list data in various formats. Used for reporting, auditing, or sharing data outside ServiceNow."
          },
          {
            "q": "How do you perform a bulk update on multiple records?",
            "options": [
              "Edit the field in the column header directly and apply changes",
              "Use a background script to update every matching record at once in production",
              "Open each record one at a time and change them individually",
              "Check multiple records and use 'Update Selected' from the actions menu"
            ],
            "answer": 3,
            "exp": "Check the boxes on multiple records, then use the Actions menu to update all selected records simultaneously."
          },
          {
            "q": "What is the purpose of a saved filter?",
            "options": [
              "To restrict who can view records that match the filter conditions",
              "To synchronize the same filter conditions across multiple tables",
              "To store and quickly reapply frequently used filter conditions",
              "To preload list data so the list loads faster on next open"
            ],
            "answer": 2,
            "exp": "Saved filters store complex conditions and apply them with one click. Save as Favorites for quick access."
          },
          {
            "q": "What does 'AND' vs 'OR' mean in filter conditions?",
            "options": [
              "AND is the default; OR can only be used inside scripted business rules",
              "AND applies to text fields; OR applies only to reference field values",
              "AND = all conditions must be true; OR = any condition being true is sufficient",
              "AND filters return more records; OR filters return fewer records always in production"
            ],
            "answer": 2,
            "exp": "AND = all conditions must be met (more restrictive). OR = either condition can be true (less restrictive, more results)."
          },
          {
            "q": "What is a reference field and how does it appear in lists?",
            "options": [
              "A field linking to another record, shown as a clickable link",
              "A formula field calculated server-side and shown as a static value",
              "A textbox field that accepts free-form input from end users",
              "A computed display field that aggregates totals from related records"
            ],
            "answer": 0,
            "exp": "Reference fields link to records in other tables. In lists they appear as clickable links to the referenced record."
          },
          {
            "q": "What is 'dot-walking' in filter conditions?",
            "options": [
              "To apply a filter to the audit log instead of the main record table",
              "To copy filter conditions across multiple unrelated record tables",
              "To filter on a field that is concatenated from two existing values",
              "To filter on fields from related tables using dot notation"
            ],
            "answer": 3,
            "exp": "Dot-walking accesses fields on related records. Caller.Department = IT filters incidents where the caller's dept is IT."
          },
          {
            "q": "How do you restore a list to its default view after personalizing?",
            "options": [
              "Log out and back in to clear the personal list cache stored",
              "Right-click column header → Reset to column defaults",
              "Delete the sys_user_preference rows tied to your account profile",
              "Refresh the list page using the browser refresh button"
            ],
            "answer": 1,
            "exp": "Right-click any column header and look for 'Reset to column defaults' to return to the system default."
          },
          {
            "q": "What does the 'Related Lists' section show at the bottom of a record?",
            "options": [
              "Records from other tables related to the current record",
              "A list of attachments uploaded by the user against the record",
              "Audit history showing every field change on the current record",
              "Outbound notifications scheduled to fire on save of the record"
            ],
            "answer": 0,
            "exp": "Related Lists show associated records from other tables. On an Incident you might see related Problems and Changes."
          },
          {
            "q": "What is a list decorator in ServiceNow?",
            "options": [
              "An inline editor that lets you change values without opening the form",
              "A formatter that adds a summary section above the related lists area",
              "Visual styling applied to rows based on conditions",
              "A scripted condition that controls which columns load on list refresh"
            ],
            "answer": 2,
            "exp": "List decorators apply visual formatting (colors, icons) to rows based on conditions. Red for overdue, yellow for approaching SLA."
          },
          {
            "q": "What happens when you click a record's number (like INC0001234) in a list?",
            "options": [
              "It expands the row preview inline",
              "It marks the record as favorited",
              "It opens the full record form",
              "It opens an inline edit cell only"
            ],
            "answer": 2,
            "exp": "Clicking the record number opens the full form view of that record. The number field is always a link to record detail."
          },
          {
            "q": "What is the maximum number of records per page in a default list?",
            "options": [
              "A fixed value of 100 per page",
              "Unlimited unless capped by ACLs in production",
              "Configurable, default is typically 20",
              "A fixed value of 50 per page"
            ],
            "answer": 2,
            "exp": "Records per page is configurable — typically 20. Change in System Settings or system properties. Navigate pages with arrows."
          },
          {
            "q": "What does 'Show Related' option do in lists?",
            "options": [
              "Displays records related to a selected record in the current list",
              "Shows the audit log for the selected record from the list view",
              "Opens a graphical relationship map for the selected record's CIs",
              "Filters the list to only the records the selected user reports to"
            ],
            "answer": 0,
            "exp": "'Show Related' filters the list to show records related to a selected record. Useful for seeing all tasks related to a project."
          },
          {
            "q": "You build a complex list filter in the condition builder. What's the fastest way to share that exact filter with a teammate?",
            "options": [
              "Save the filter as a personal favorite and ask them to subscribe to your favorites",
              "Right-click the list title and pick Share Current View, which emails a link to anyone in production",
              "Open the list as XML using the URL trick and send them the resulting XML payload",
              "Right-click the breadcrumb and copy the encoded query, then send them the URL or query string"
            ],
            "answer": 3,
            "exp": "Right-click the filter breadcrumb → 'Copy query' gives you an encoded query (like active=true^priority=1). Paste into a URL or another filter and you're identical. Power user move."
          },
          {
            "q": "Which encoded query operator means 'is empty'?",
            "options": [
              "EMPTY in production",
              "ISEMPTY",
              "NOVAL",
              "NULL"
            ],
            "answer": 1,
            "exp": "ISEMPTY is the operator. Example: assigned_toISEMPTY filters to records with no assignee. ISNOTEMPTY is the inverse. Comes up constantly in dashboards and scheduled reports."
          },
          {
            "q": "What does the caret (^) symbol do in an encoded query string?",
            "options": [
              "Joins multiple conditions with AND",
              "Terminates the query string",
              "Joins conditions as OR",
              "Separates the field from value in production"
            ],
            "answer": 0,
            "exp": "The caret is the AND separator: active=true^priority=1 means active AND priority 1. Use ^OR for OR. ^ORDERBY field_name to sort. Memorize this — it's everywhere."
          },
          {
            "q": "What's a Tag in a ServiceNow list, and how does it differ from a saved filter?",
            "options": [
              "A Tag is just a colored filter shortcut on a single table; a saved filter is shared across all tables for that user in production across the platform",
              "A Tag is a system field automatically populated by business rules; a saved filter is user-defined and personal only",
              "A Tag is a personal/shared label you stick on individual records to group them across tables; a saved filter is a stored set of conditions",
              "A Tag is a label limited to incidents and problems; a saved filter is the only way to label records across tables"
            ],
            "answer": 2,
            "exp": "Tags label specific records — 'follow up' tagged across incidents, problems, and requests. Filters are condition logic. Different tools for different jobs."
          },
          {
            "q": "A manager asks for all incidents assigned to anyone whose Department's Manager is Sarah Johnson. What technique do you need?",
            "options": [
              "Use a query business rule that adds an inline manager filter at runtime on the table",
              "Build a scripted filter that runs as a background script against the user table directly",
              "Write an encoded query using sys_id of Sarah and the manager field on the user record only",
              "Multi-level dot-walking — assigned_to.department.dept_head.name = Sarah Johnson"
            ],
            "answer": 3,
            "exp": "Dot-walking traverses reference fields. You can chain: incident → assigned_to (user) → department → dept_head → name. ServiceNow supports going deep. Standard skill for any senior admin."
          }
        ]
      },
      {
        "id": "csa3",
        "name": "Forms, Fields & Applications",
        "questions": [
          {
            "q": "What is a form in ServiceNow?",
            "options": [
              "A read-only audit panel listing field-level changes on a record",
              "The interface for viewing and editing a single record",
              "A dashboard widget displaying counts grouped by selected fields",
              "A spreadsheet-style view of multiple records on one page"
            ],
            "answer": 1,
            "exp": "A form displays a single record's fields for viewing or editing. Every record in ServiceNow has a form view."
          },
          {
            "q": "What is the purpose of form sections?",
            "options": [
              "To organize related fields into labeled groups on a form",
              "To restrict which roles can view fields on a record form",
              "To hide formatters from users without the admin role assignment",
              "To bind related lists to a form so they load in order on save"
            ],
            "answer": 0,
            "exp": "Sections group related fields together visually. On an Incident: Details, Resolution, Related Incidents, SLA info."
          },
          {
            "q": "What does the 'Update' button do on a form?",
            "options": [
              "Refreshes the form view discarding unsaved field changes",
              "Opens the record in a new tab without saving recent changes",
              "Reassigns the record to the next user in the assignment group",
              "Saves changes to the current record"
            ],
            "answer": 3,
            "exp": "The Update button saves your changes. Always click Update/Save or your changes won't persist."
          },
          {
            "q": "What is a choice field (dropdown) in ServiceNow?",
            "options": [
              "A text field with autocomplete suggestions from prior entries",
              "A field with a predefined list of selectable options",
              "A read-only field that displays the user's profile preferences",
              "A field linked to another table via a reference relationship"
            ],
            "answer": 1,
            "exp": "Choice fields present a dropdown of predefined options. Options managed in the Choice List by admins."
          },
          {
            "q": "What is a UI Policy in ServiceNow?",
            "options": [
              "A rule that dynamically shows, hides, or makes fields mandatory based on conditions",
              "A scheduled job that audits forms nightly and reports missing mandatory fields",
              "A server-side rule that enforces mandatory fields on data imports as well as forms in production",
              "A scripted condition that controls related list visibility on the configured form"
            ],
            "answer": 0,
            "exp": "UI Policies control field behavior dynamically. When Priority = Critical, make Impact mandatory. No code required."
          },
          {
            "q": "What is a Client Script?",
            "options": [
              "Server-side logic running on database operations after commit",
              "A scheduled job that runs JavaScript on a configurable timer",
              "JavaScript that runs in the browser to enhance form behavior",
              "A workflow activity that calls a script include for the trigger"
            ],
            "answer": 2,
            "exp": "Client Scripts run JavaScript in the browser. onLoad, onChange, onSubmit. Powerful for UI logic."
          },
          {
            "q": "What does 'Read Only' mean for a form field?",
            "options": [
              "The field clears its value whenever the form is reloaded",
              "The field is hidden from end users on every form view",
              "The field is mandatory but greyed-out until a condition fires",
              "The field displays data but cannot be edited"
            ],
            "answer": 3,
            "exp": "Read-only fields show their value but can't be changed through the UI. Set by UI Policy or field-level security."
          },
          {
            "q": "What is the Activity Stream used for?",
            "options": [
              "Recording the system properties that have been recently changed",
              "Tracking communication and work history on a record",
              "Tracking the order in which related lists load on each form",
              "Auditing every login attempt by users against the platform"
            ],
            "answer": 1,
            "exp": "The activity stream shows all work notes, comments, emails, and state changes on a record. Full audit trail."
          },
          {
            "q": "What is a Business Rule in ServiceNow?",
            "options": [
              "Server-side logic that runs automatically when records are created, read, updated, or deleted",
              "A client-side script that runs in the browser to validate field values before the user can submit a form",
              "A scheduled task that audits records nightly and flags any data that violates configured business policies",
              "A reusable scripted library that other server-side scripts can call when handling form submissions or imports"
            ],
            "answer": 0,
            "exp": "Business Rules run server-side on database operations (CRUD). Before/After/Async/Display timing options."
          },
          {
            "q": "What is the purpose of Field-Level Security?",
            "options": [
              "To enforce mandatory fields on imports of bulk record data",
              "To control which roles can read or write specific fields",
              "To restrict which records appear in lists for specific roles",
              "To define which UI Actions appear on a form for each role"
            ],
            "answer": 1,
            "exp": "Field-level security (ACLs) controls who can read and write individual fields — not just hide them."
          },
          {
            "q": "What is a Catalog Item in ServiceNow?",
            "options": [
              "A bundle of variables exposed to the requester in the catalog UI in production",
              "A requestable service or product available through the Service Catalog",
              "A request fulfillment task created for each catalog order placed",
              "A reusable workflow template tied to the Service Catalog cart"
            ],
            "answer": 1,
            "exp": "Catalog Items are things users can request — laptops, software access, onboarding tasks. Think IT services shopping catalog."
          },
          {
            "q": "What is the purpose of a Record Producer?",
            "options": [
              "To trigger an approval workflow from outside the Service Catalog",
              "To bundle a fixed set of related catalog items into one order",
              "To create records in any table through a catalog-like interface",
              "To generate a printable invoice from completed service requests"
            ],
            "answer": 2,
            "exp": "Record Producers are Catalog Items that create records in any table — not just Request/RITM."
          },
          {
            "q": "What is the difference between Work Notes and Additional Comments?",
            "options": [
              "Work Notes are only visible to admins; Additional Comments are visible to all users",
              "Work Notes auto-send emails to managers; Additional Comments stay silent inside",
              "Work Notes are internal only; Additional Comments are visible to the requester",
              "Work Notes lock the record on save; Additional Comments allow further edits later"
            ],
            "answer": 2,
            "exp": "Work Notes = internal, customers can't see them. Additional Comments = customer-facing, they get email notifications."
          },
          {
            "q": "What is a Formatter in ServiceNow form configuration?",
            "options": [
              "A reusable section template that admins drag onto multiple form layouts",
              "A scripted field that auto-populates based on changes from related records in production",
              "A read-only label tag that highlights the record's current state visually",
              "A special form element displaying information like activity streams or related lists"
            ],
            "answer": 3,
            "exp": "Formatters are special elements — Activity Log formatter shows work notes, Section Separator adds visual breaks."
          },
          {
            "q": "What does 'Insert and Stay' do on a form?",
            "options": [
              "Saves the record but leaves it locked for review by the next user",
              "Creates a new record and keeps you on the form to create another",
              "Saves the record and re-routes to the assignment group's queue",
              "Saves the current record and immediately closes the form view"
            ],
            "answer": 1,
            "exp": "Insert and Stay creates the record and reloads a blank form. Great for bulk data entry."
          },
          {
            "q": "What is the purpose of the 'Personalize Form' option?",
            "options": [
              "To add or remove fields from your personal view without affecting others",
              "To save a personal favorite of the form with the user's settings",
              "To trigger a scripted refresh of the form's related lists section",
              "To assign the form a global default layout for everyone seeing it in production"
            ],
            "answer": 0,
            "exp": "Personalize Form lets users customize their form view without affecting other users' layouts."
          },
          {
            "q": "What is a Calculated field?",
            "options": [
              "A reusable field template that admins drop onto multiple tables",
              "A field whose value is automatically computed based on a formula or script",
              "A field whose value is restricted to predefined dropdown choices in production",
              "A read-only audit column that records changes to other fields"
            ],
            "answer": 1,
            "exp": "Calculated fields auto-compute their values — Days Open from Created date, combining First/Last name into Full Name."
          },
          {
            "q": "What is a Coalesce field used for in imports?",
            "options": [
              "To validate that the import file matches the table dictionary schema in production across the platform",
              "To merge two import sets together into a single staging set table",
              "To deduplicate records after they are inserted from an import set",
              "To identify existing records during import to update instead of creating duplicates"
            ],
            "answer": 3,
            "exp": "Coalesce tells the import: if a record with this value exists, update it instead of creating a duplicate."
          },
          {
            "q": "What is the purpose of the Dictionary in ServiceNow?",
            "options": [
              "A scheduled report listing every table changed in the last 24 hours",
              "A scripted control that enforces field validation on save operations",
              "The central repository defining all tables and fields in the system",
              "A reusable layout library used by the Form Designer at runtime"
            ],
            "answer": 2,
            "exp": "The Dictionary (sys_dictionary) defines every table and field — data type, max length, default value, mandatory, choices."
          },
          {
            "q": "What is a Variable in a Service Catalog item?",
            "options": [
              "A reusable layout template applied to every catalog item in a category in production",
              "A workflow activity that fulfils part of the requested item order",
              "A field on a Catalog Item form that collects input from the user when ordering",
              "An audit log entry recording who ordered a specific catalog item"
            ],
            "answer": 2,
            "exp": "Variables are the fields users fill in when ordering from the catalog — like choosing a laptop model or software version."
          },
          {
            "q": "What's the key difference between a UI Policy and a Data Policy?",
            "options": [
              "UI Policy is the new replacement; Data Policy is the legacy mechanism that no longer fires in modern UI",
              "UI Policy runs only on insert; Data Policy runs only on update operations from the platform UI itself",
              "UI Policy enforces values on imports and APIs; Data Policy only runs in the user's browser on form load in production across the platform",
              "UI Policy runs in browser only and applies to forms; Data Policy runs server-side and applies to all data entry methods including imports and APIs"
            ],
            "answer": 3,
            "exp": "UI Policy = front-end, only fires when someone uses a form. Data Policy = back-end, enforces rules no matter how data comes in (import, API, list edit). Need a mandatory field even on imports? Data Policy."
          },
          {
            "q": "You need a set of variables (Type of Laptop, RAM, Storage, etc.) reused across 12 different catalog items. What's the cleanest approach?",
            "options": [
              "Define the variables once on the parent table and reference them through dot-walking on the form view",
              "Create a Variable Set and attach it to each catalog item",
              "Edit each catalog item one at a time to add the same variables — there's no reusable construct here",
              "Create a Catalog Client Script that copies the variable set into each item using a script include"
            ],
            "answer": 1,
            "exp": "Variable Sets bundle related variables into a reusable group. Build once, attach to many items. Update the Set, every item gets the change. Saves hours of duplicate work."
          },
          {
            "q": "What is a Form View used for?",
            "options": [
              "A different field layout of the same form shown to specific users or in specific contexts",
              "A different table layout used by integration sets that map fields from external systems",
              "A scripted version of the form rendered only on the Service Portal for end-user self-service",
              "A read-only copy of the form generated automatically when the record is closed and archived"
            ],
            "answer": 0,
            "exp": "Form Views give you multiple layouts of the same form. Service desk sees one view, ESS users see a stripped-down view, mobile gets a tighter one. Same record, different fields visible."
          },
          {
            "q": "A Business Rule is set to run 'before' on insert. What does 'before' actually mean here?",
            "options": [
              "Before any business rule fires, allowing the script to override conditions on related table updates",
              "Before the database commits the record, allowing the script to modify the values being saved",
              "Before the form even loads, allowing the script to populate default field values for new records",
              "Before the notification engine fires, allowing the script to cancel queued emails for that record"
            ],
            "answer": 1,
            "exp": "'Before' = script runs after submit but before the database write. You can change current.field_name and those changes persist. After the write, you can't modify current — too late. Critical timing distinction."
          },
          {
            "q": "What does Form Designer let an admin do?",
            "options": [
              "Drag-and-drop edit the table's audit history view — affecting how field changes are presented to users",
              "Visually edit the related lists section only — field layout still goes through the legacy Form Layout tool",
              "Drag-and-drop reorder fields only — adding new fields still requires editing the dictionary record directly",
              "Drag-and-drop edit a form's layout — add fields, sections, formatters — without writing XML"
            ],
            "answer": 3,
            "exp": "Form Designer is the visual form builder. Replaces the older Form Layout interface for most cases. Drag fields, drop them where you want them, save. Right-click a form and choose 'Configure → Form Design' to launch."
          }
        ]
      },
      {
        "id": "csa4",
        "name": "Flow Designer & Automation",
        "questions": [
          {
            "q": "What is Flow Designer in ServiceNow?",
            "options": [
              "A reporting tool that visualizes throughput of completed workflows",
              "A scripted engine for chaining script includes into orchestrations",
              "A no-code/low-code tool for building automated workflows",
              "A debugger that steps through legacy Workflow Editor activities"
            ],
            "answer": 2,
            "exp": "Flow Designer is ServiceNow's modern no-code automation platform. Build workflows visually — no scripting required."
          },
          {
            "q": "What is a Trigger in Flow Designer?",
            "options": [
              "A reusable subflow called by another flow",
              "A scheduled report run nightly",
              "The event that starts a flow",
              "A scripted condition checked between actions"
            ],
            "answer": 2,
            "exp": "Triggers kick off flows — record created, priority changed, on schedule, via inbound API. Every flow needs one trigger."
          },
          {
            "q": "What is an Action in Flow Designer?",
            "options": [
              "A scheduled execution context for the flow at runtime",
              "A reusable subflow callable from many other flows",
              "A trigger condition that must be true for the flow to start",
              "A step that performs a specific operation within a flow"
            ],
            "answer": 3,
            "exp": "Actions are the 'do something' steps — create a record, send email, update a field, call an API."
          },
          {
            "q": "What is the difference between a Flow and a Subflow?",
            "options": [
              "A Flow can include logic blocks; a Subflow can only contain a single action without any logic",
              "A Flow is triggered automatically; a Subflow is a reusable set of steps called by other flows",
              "A Flow is older and uses script includes; a Subflow is the modern no-code replacement format",
              "A Flow runs only on a schedule; a Subflow runs only when manually triggered by a user"
            ],
            "answer": 1,
            "exp": "Flows are triggered by events. Subflows are reusable action sequences called FROM flows — like reusable functions."
          },
          {
            "q": "What is 'Looks Up Records' used for in Flow Designer?",
            "options": [
              "To query and retrieve records from a table based on conditions",
              "To send an outbound notification to the requested users",
              "To insert a new record into a target table using mapped values",
              "To pause the flow until a condition is satisfied at runtime"
            ],
            "answer": 0,
            "exp": "Look Up Records queries a table with conditions and returns matching records for use in subsequent steps."
          },
          {
            "q": "What is the purpose of Flow Variables?",
            "options": [
              "To bind credential aliases between the flow and integrations",
              "To store and pass data between steps within a flow",
              "To trigger the flow on a recurring time-based schedule daily",
              "To define which roles can edit the flow inside the designer"
            ],
            "answer": 1,
            "exp": "Flow variables store data during execution — capture a field value in one step to use in another."
          },
          {
            "q": "What does 'For Each' do in a flow?",
            "options": [
              "Aborts the flow if any prior step has returned an error result",
              "Pauses the flow until a watched field updates on a record",
              "Branches the flow into two parallel paths based on a condition in production",
              "Iterates through a list of records and performs actions on each one"
            ],
            "answer": 3,
            "exp": "For Each loops through a collection and performs the same actions on each record. One loop, many records handled."
          },
          {
            "q": "What is Integration Hub in relation to Flow Designer?",
            "options": [
              "A standalone integration platform separate from the Flow Designer engine in production",
              "A reusable library of script includes shared across multiple scoped apps",
              "Extends Flow Designer with pre-built spokes for third-party system integrations",
              "A replacement for legacy Workflow Editor for orchestrating IT changes"
            ],
            "answer": 2,
            "exp": "Integration Hub provides pre-built spokes — Slack, Jira, AWS — drag into flows to integrate without building APIs."
          },
          {
            "q": "What is a Scheduled Flow?",
            "options": [
              "A flow triggered manually by users via the Flow Designer UI",
              "A flow triggered by inbound REST API calls from external systems",
              "A flow triggered automatically at defined time intervals",
              "A flow that runs once on every record insert in a target table"
            ],
            "answer": 2,
            "exp": "Scheduled Flows run on time-based triggers — daily, weekly, specific dates. Great for nightly reports or cleanup tasks."
          },
          {
            "q": "What does the 'Wait for Condition' action do?",
            "options": [
              "Pauses execution until a specified condition becomes true",
              "Schedules a delay measured in minutes before the next action",
              "Aborts the flow if the condition has not been met within an hour",
              "Branches the flow into two paths based on a runtime condition"
            ],
            "answer": 0,
            "exp": "Wait for Condition pauses the flow until something changes — like waiting for an incident to be resolved."
          },
          {
            "q": "What is a Workflow in ServiceNow (legacy) vs Flow Designer?",
            "options": [
              "Workflow and Flow Designer are the same engine with different licensing options",
              "Workflow is the older activity-based engine; Flow Designer is the newer no-code platform",
              "Workflow runs only on scheduled triggers; Flow Designer is for ad-hoc admin actions",
              "Workflow uses Flow Designer's no-code canvas; Flow is the legacy script-based engine in production"
            ],
            "answer": 1,
            "exp": "Workflow is the older graphical editor. Flow Designer is the newer, more intuitive platform. Both coexist but Flow is the future."
          },
          {
            "q": "What is an Approval action in Flow Designer?",
            "options": [
              "Pauses the flow and sends an approval request to specified users",
              "Schedules a recurring approval reminder until the action completes",
              "Sends an FYI notification to listed approvers without pausing the flow",
              "Branches the flow on whether the approval was preapproved by a CAB"
            ],
            "answer": 0,
            "exp": "Approval actions pause the flow, notify approvers, and wait for their decision before branching."
          },
          {
            "q": "What is the purpose of Error Handling in Flow Designer?",
            "options": [
              "To pause execution until an approver responds within an SLA",
              "To define what happens when a flow step encounters an error",
              "To branch the flow based on the value of a runtime variable",
              "To log debug data for the flow execution into the system log"
            ],
            "answer": 1,
            "exp": "Error handling defines graceful responses when steps fail — retry, notify admin, or take an alternative path."
          },
          {
            "q": "What are Spokes in Integration Hub?",
            "options": [
              "Reusable scripts that wrap API calls into reusable activities",
              "Custom REST endpoints that other flows call to share data",
              "Scoped applications that bundle multiple flows for installation in production across the platform",
              "Pre-built action libraries for integrating with specific third-party applications"
            ],
            "answer": 3,
            "exp": "Spokes are packaged action libraries for specific systems. Install a spoke and drag its actions into flows instantly."
          },
          {
            "q": "What does 'Publish' do to a flow?",
            "options": [
              "Promotes the flow into the next instance via an update set",
              "Sends a deployment notification to subscribed administrators",
              "Activates the flow so it runs in production when triggered",
              "Triggers an immediate test run of the flow using sample data"
            ],
            "answer": 2,
            "exp": "Publishing activates a flow — before publishing it won't run. Always test in dev before publishing to production."
          },
          {
            "q": "What is the Flow Execution Context?",
            "options": [
              "The transactional scope under which downstream APIs are called",
              "The user record that triggered the flow's initial activation",
              "The system context under which the flow executes",
              "The logging level the flow uses when writing to the system log"
            ],
            "answer": 2,
            "exp": "Execution context determines what permissions the flow has. 'As System' gives full access; 'As User' respects their permissions."
          },
          {
            "q": "What is a Decision Table in Flow Designer?",
            "options": [
              "A structured table of conditions and outcomes determining flow branching",
              "A scheduled reporting widget that summarizes flow execution outcomes",
              "A reusable subflow that wraps multi-step approvals into one block",
              "A scripted helper that calculates dynamic execution timing per branch in production"
            ],
            "answer": 0,
            "exp": "Decision Tables define complex branching in a structured format. Multiple conditions mapped to outcomes — cleaner than nested If/Then."
          },
          {
            "q": "What is Robotic Process Automation (RPA) in ServiceNow context?",
            "options": [
              "A flow trigger that fires whenever a record changes its assignment group",
              "A scripting language designed for chaining REST integrations together",
              "A scheduled job framework that runs simple repetitive cleanup scripts",
              "Software bots that automate repetitive UI-based tasks in non-API systems"
            ],
            "answer": 3,
            "exp": "RPA bots mimic human actions in UIs — logging into legacy systems, copying data. ServiceNow's RPA Hub connects them to Flow Designer."
          },
          {
            "q": "What does the 'Update Record' action do?",
            "options": [
              "Modifies field values on an existing record",
              "Reads a single record by sys_id and returns it to the next action",
              "Sends a notification when the record matches a runtime condition",
              "Creates a new record in the chosen target table with mapped values"
            ],
            "answer": 0,
            "exp": "Update Record modifies one or more fields on an existing record. Specify the record and which fields to update."
          },
          {
            "q": "What is the purpose of 'Ask For Approval' vs 'Create Approval'?",
            "options": [
              "Ask For Approval is a legacy activity from the Workflow Editor; Create Approval is the modern replacement step",
              "Ask For Approval waits for response; Create Approval just creates the record without waiting",
              "Ask For Approval is for scripted flows only; Create Approval is for no-code flows in Flow Designer",
              "Ask For Approval uses CAB members automatically; Create Approval requires hand-picking approvers individually"
            ],
            "answer": 1,
            "exp": "'Ask For Approval' creates AND waits for the response. 'Create Approval' just creates it and moves on."
          },
          {
            "q": "Your flow calls an external REST API that sometimes times out. What construct lets the flow handle the failure gracefully without crashing?",
            "options": [
              "A logging step that writes the error to the system log without halting the flow",
              "A scheduled retry job that re-runs the failed flow after a configured delay",
              "A scripted business rule that intercepts the failure and reroutes the call entirely",
              "A Try / Catch block around the action that may fail"
            ],
            "answer": 3,
            "exp": "Try / Catch wraps risky steps. The Try runs the action; if it errors, the Catch branch handles the cleanup or retry. Without it, the whole flow halts and someone has to babysit."
          },
          {
            "q": "What is a Connection & Credential Alias in Integration Hub?",
            "options": [
              "A scoped application that bundles flows with their credentials into one promotable unit so the entire integration is moved together as a single block across the Dev to Prod pipeline with no manual edits",
              "A scripted helper that runs before every REST step and dynamically resolves the correct credential based on the current instance hostname so flows automatically use the right environment without aliases",
              "An abstraction layer that lets a flow reference 'the Slack connection' without hard-coding a specific URL or credential — useful for promoting flows between dev and prod",
              "A reusable credential record that gets hard-coded into each flow's REST step so the URL travels with the flow when promoted between instances and never needs to be touched manually again afterward"
            ],
            "answer": 2,
            "exp": "The alias points to different actual credentials in dev vs prod. Move the flow up the pipeline and it automatically uses the right environment's credentials. No code changes. This is how you do enterprise-grade Flow."
          },
          {
            "q": "Flow Designer is replacing which legacy automation tool?",
            "options": [
              "Business Rules — the older server-side logic that runs on database operations",
              "Workflow Editor (the older drag-and-drop graphical workflow tool)",
              "Service Catalog Client Scripts — the older method for handling catalog form logic",
              "Scripted REST APIs — the older method for exposing instance functionality outward"
            ],
            "answer": 1,
            "exp": "Workflow Editor is the older activity-based engine — still works, still around in legacy instances, but ServiceNow is steering everyone to Flow Designer. New work should be Flow. Legacy maintenance might still touch Workflow."
          },
          {
            "q": "What does Action Designer let you build?",
            "options": [
              "A custom reusable action that can be added to flows — wraps script logic, REST calls, or transform steps in a no-code interface",
              "A reusable subflow you can drag into other flows as a single step block, behaving like an inline subroutine that takes inputs in production",
              "A scripted activity that wraps a single REST call into a one-step action exposed inside the Workflow Editor canvas instead",
              "A reusable scheduled job template that automates background scripts on a defined cadence and exposes the run history"
            ],
            "answer": 0,
            "exp": "Action Designer is how you make your own action when none of the built-in ones fit. Wrap a script or API call in a clean input/output package and any flow can drag it in. This is how you scale automation without copy-pasting scripts everywhere."
          },
          {
            "q": "A flow needs to run as the System user regardless of who triggered it. Where do you set that?",
            "options": [
              "On the Run As field of the underlying triggering business rule",
              "On the assignment group of the record that triggered the flow",
              "On the System Property glide.flow.designer.run_as_system value",
              "In the Run As setting on the flow properties"
            ],
            "answer": 3,
            "exp": "The 'Run As' setting controls execution context. 'System User' = full access regardless of trigger user's permissions. 'User Who Initiates Session' = respect their ACLs. Pick wrong and either nothing runs or everyone has too much power."
          }
        ]
      },
      {
        "id": "csa5",
        "name": "Reporting & Dashboards",
        "questions": [
          {
            "q": "What is the primary purpose of Reports in ServiceNow?",
            "options": [
              "To visualize and analyze data from the platform",
              "To capture configuration changes for promotion between instances",
              "To replicate data from the CMDB to external monitoring systems",
              "To deploy scoped applications and their data to other instances"
            ],
            "answer": 0,
            "exp": "Reports visualize data — charts, tables, and graphs that surface insights. Essential for showing stakeholders what's happening."
          },
          {
            "q": "Which report type is best for showing trends over time?",
            "options": [
              "Heatmap",
              "Line chart",
              "Bar chart",
              "Pivot table"
            ],
            "answer": 1,
            "exp": "Line charts show trends over time — incident volume month over month, SLA compliance trends."
          },
          {
            "q": "What is a Dashboard in ServiceNow?",
            "options": [
              "A scripted homepage rendered through a single widget block",
              "A read-only audit page of recent record changes for review",
              "A configurable page displaying multiple reports and widgets",
              "A printable report that compiles multiple reports into one PDF"
            ],
            "answer": 2,
            "exp": "Dashboards combine multiple reports, gauges, and widgets on one page. Command center — all key metrics at a glance."
          },
          {
            "q": "What is a Gauge in ServiceNow reporting?",
            "options": [
              "A static label widget displaying contextual help on the dashboard",
              "A reusable filter set that applies dynamically to dashboard widgets",
              "A single-value widget showing a current metric with threshold indicators",
              "A scripted KPI calculator that aggregates rows from a related table in production"
            ],
            "answer": 2,
            "exp": "Gauges show single current values — open incidents, SLA compliance %. Color coding (green/yellow/red) based on thresholds."
          },
          {
            "q": "What is the difference between a personal and a global report?",
            "options": [
              "Personal reports run faster because they bypass ACLs; global reports respect every ACL on every run",
              "Personal reports are only visible to you; global reports are available to all users",
              "Personal reports can include only system tables; global reports can include any table in the instance",
              "Personal reports are stored in your profile preferences; global reports live in a shared report library"
            ],
            "answer": 1,
            "exp": "Personal reports are private to the creator. Global reports are shared. You control visibility when creating."
          },
          {
            "q": "What does 'Group By' do in a report?",
            "options": [
              "Segments report data by a selected field value",
              "Filters the report so only records matching the chosen value remain",
              "Limits the chart's color palette to a single color for the field",
              "Calculates the average of the chosen field across all the records"
            ],
            "answer": 0,
            "exp": "Group By segments your data — incidents by priority, requests by department. Each group becomes a bar or slice."
          },
          {
            "q": "What is a Scheduled Report?",
            "options": [
              "A report that recalculates its values whenever a user opens its page",
              "A report that runs only when triggered manually from the report library in production",
              "A report that auto-saves to PDF when a record changes in the source",
              "A report that automatically runs and emails recipients at defined intervals"
            ],
            "answer": 3,
            "exp": "Scheduled Reports auto-run and email results. Automate your status updates without lifting a finger."
          },
          {
            "q": "What report type shows each individual record with all details?",
            "options": [
              "List report",
              "Trend report",
              "Bar chart",
              "Pivot table"
            ],
            "answer": 0,
            "exp": "List reports display records in tabular format. Good for operational reports where you need individual record details."
          },
          {
            "q": "What is Performance Analytics in ServiceNow?",
            "options": [
              "A scripted reporting engine for building reports against legacy tables",
              "An advanced analytics platform for tracking KPIs and metrics over time",
              "A reporting widget framework that renders inside the Service Portal",
              "A licensed module that imports analytics data from external systems"
            ],
            "answer": 1,
            "exp": "Performance Analytics captures historical data over time, enabling trend analysis and predictive insights. Requires additional licensing."
          },
          {
            "q": "What is the purpose of Report conditions?",
            "options": [
              "Force the report to run only inside business hours each weekday",
              "Restrict which roles can run the report from the report library",
              "To filter which records are included in the report",
              "Cache the report results so they refresh on a scheduled cadence"
            ],
            "answer": 2,
            "exp": "Report conditions filter your data before rendering — like a list filter but for your report."
          },
          {
            "q": "What does 'Aggregate' mean in reports?",
            "options": [
              "To filter records out of the report before any chart renders them in production",
              "To save the resulting numeric value as a record in a target table",
              "To choose which fields display as columns in the underlying list",
              "To combine or calculate values across records (count, sum, average)"
            ],
            "answer": 3,
            "exp": "Aggregation calculates summary values — Count (how many), Sum (total value), Average (mean). 'How many' and 'how much' answers."
          },
          {
            "q": "What is a Scorecard in ServiceNow?",
            "options": [
              "A reusable widget that displays a single field value on dashboards in production",
              "A Performance Analytics component showing metric progress against targets",
              "A scheduled report that emails a KPI summary to managers nightly",
              "A scripted homepage that calculates KPI values from related tables"
            ],
            "answer": 1,
            "exp": "Scorecards display PA indicators over time with targets and thresholds. Red/yellow/green shows if you're meeting goals."
          },
          {
            "q": "What is the purpose of the 'By' field in report configuration?",
            "options": [
              "To define how data is grouped or segmented in the report",
              "To filter which records are aggregated into the visualization",
              "To choose which color theme the chart uses on the dashboard",
              "To trigger an export of the report results to a CSV downloads"
            ],
            "answer": 0,
            "exp": "The 'By' field determines how your data is segmented. Reports show incidents BY priority, BY assignment group, BY month."
          },
          {
            "q": "How do you add a report to a dashboard?",
            "options": [
              "Edit the report and change its Default Dashboard to the target dashboard",
              "Drag the report from the report library onto the dashboard's canvas",
              "Right-click the dashboard background and pick Insert Report directly",
              "Edit the dashboard and use 'Add Widget' to select the report"
            ],
            "answer": 3,
            "exp": "Edit the dashboard, click 'Add Widget', select 'Report' as widget type, search for and select your report."
          },
          {
            "q": "What is a Breakdown Source in Performance Analytics?",
            "options": [
              "A dimension that allows you to slice PA data by different attributes",
              "A reusable filter saved against a table that PA recalculates each night",
              "A scheduled job that loads historical PA records into a reporting cube",
              "A scripted helper that calculates derived KPI values from raw records"
            ],
            "answer": 0,
            "exp": "Breakdown Sources let you slice PA data by dimensions — by assignment group, by priority, by location."
          },
          {
            "q": "What does the 'Trend' report type show?",
            "options": [
              "Shows the count of records per category in a bar layout",
              "Shows the relationship between two fields in a scatter format",
              "How a metric changes over a period of time",
              "Shows the percentage breakdown of records as a pie slice"
            ],
            "answer": 2,
            "exp": "Trend reports show change over time — perfect for showing whether incident volume is increasing or decreasing."
          },
          {
            "q": "What is a Widget in a dashboard?",
            "options": [
              "A scripted workflow that refreshes the dashboard's data on a schedule",
              "A reusable filter set applied automatically to every report in a dashboard in production across the platform",
              "A component on a dashboard displaying specific content like reports, gauges, or custom HTML",
              "A configurable layout template applied to every new dashboard created"
            ],
            "answer": 2,
            "exp": "Widgets are the building blocks of dashboards — reports, gauges, clocks, images, HTML content, or Service Portal widgets."
          },
          {
            "q": "What is the purpose of report 'Drilldown' functionality?",
            "options": [
              "Exports the chart to a CSV with the row-level data behind the visual",
              "Re-runs the report immediately using updated filter conditions live",
              "Opens the report's source query in the condition builder for editing",
              "To click into summary data and see the underlying records"
            ],
            "answer": 3,
            "exp": "Drilldown lets you click a bar or number and see the actual records behind that data point. From summary to detail instantly."
          },
          {
            "q": "How can you share a report with other users?",
            "options": [
              "Assign the report to a dashboard that the target users can access",
              "Change the report's 'Visible to' setting to share with roles, groups, or everyone",
              "Email the report URL to specific users via the Notification engine",
              "Move it from the Personal report library to the Global report library in production"
            ],
            "answer": 1,
            "exp": "Edit the report and change 'Visible to' from 'Me' to specific roles, groups, or everyone."
          },
          {
            "q": "What is the purpose of 'As of' date in Performance Analytics?",
            "options": [
              "The date for which PA data is being viewed or collected",
              "The date when the underlying PA indicator was first activated",
              "The date PA's nightly job will next aggregate data into the cube",
              "The date the report's filter conditions were last edited by an admin"
            ],
            "answer": 0,
            "exp": "'As of' lets you view historical PA data — what did our metrics look like 3 months ago? Essential for trend analysis."
          },
          {
            "q": "Leadership wants a single visual showing incident counts by Priority AND by Assignment Group at the same time. What report type fits?",
            "options": [
              "A bar chart",
              "A heatmap",
              "A list report in production",
              "A pivot table report"
            ],
            "answer": 3,
            "exp": "Pivot tables show two dimensions at once — rows = priority, columns = assignment group, cells = counts. Bar charts only do one dimension cleanly. Pivot is the right tool for cross-tabulation."
          },
          {
            "q": "What is a Heatmap report best used for?",
            "options": [
              "Showing concentration or density across two dimensions using color intensity",
              "Showing the relationship between two metrics as scattered points",
              "Showing the percentage breakdown of records by a chosen field",
              "Showing the change of a single metric over a long period of time in production"
            ],
            "answer": 0,
            "exp": "Heatmaps color-code intensity. Show incidents by hour-of-day vs day-of-week and you instantly see your busy times. Color = volume. Visual pattern recognition in seconds."
          },
          {
            "q": "What's the main advantage of Responsive Dashboards over the older Homepage dashboards?",
            "options": [
              "Responsive Dashboards are scoped to a single application; Homepages are global across the entire instance for any user",
              "Responsive Dashboards are read-only for end users; Homepages allow inline drag-and-drop edits by the user who owns them",
              "They auto-adjust layout for different screen sizes (desktop, tablet, mobile) and support modern widgets",
              "Responsive Dashboards run only with Performance Analytics; Homepages work with any standard reporting source out of the box"
            ],
            "answer": 2,
            "exp": "Responsive Dashboards are mobile-friendly out of the box. Homepages were built when 'mobile' wasn't a real consideration. Anyone managing a real organization is moving to Responsive — it's the future."
          },
          {
            "q": "A report needs to combine data from Incidents AND Changes in one chart. What do you need?",
            "options": [
              "A scripted report",
              "A pivot table report in production",
              "A multi-dataset report",
              "A list report"
            ],
            "answer": 2,
            "exp": "Multi-dataset reports pull from multiple sources into one chart. Combine open incidents and pending changes, side-by-side, in the same visual. Otherwise you're stuck with two reports the viewer has to mentally combine."
          },
          {
            "q": "What's the difference between a Dashboard Filter and a Report Condition?",
            "options": [
              "Report Condition is set per dashboard; Dashboard Filter is set per report and locks the chart filter at design time always",
              "Report Condition only applies to scheduled reports; Dashboard Filter applies only to live reports inside the dashboard view in production across the platform",
              "Report Condition uses encoded queries; Dashboard Filter uses scripted conditions and runs server-side at report load time",
              "Report Condition is hard-coded in the report; Dashboard Filter is a runtime filter the viewer can change to slice all reports on the dashboard at once"
            ],
            "answer": 3,
            "exp": "Report Condition is baked into the report — every viewer sees it filtered the same way. Dashboard Filter sits at the top of the dashboard and slices every report on the page when the viewer changes it. Big difference for self-service analytics."
          }
        ]
      },
      {
        "id": "csa6",
        "name": "User Administration",
        "questions": [
          {
            "q": "What is a Role in ServiceNow?",
            "options": [
              "A named collection of permissions granting access to specific features and data",
              "A scripted condition that grants temporary access to specific records in production",
              "A reusable group template applied to assignment groups in ITSM",
              "A user account flagged as VIP for prioritized service handling"
            ],
            "answer": 0,
            "exp": "Roles define what users can do — itil role gives ITSM access, admin role gives full access. Assigned to users or groups."
          },
          {
            "q": "What is the difference between a User and a Group?",
            "options": [
              "A User is an individual; a Group is a collection of users that can be assigned work and roles",
              "A User contains roles directly; a Group is just a label with no permissions or assignment power attached",
              "A User is a record in the CMDB; a Group is a managed business service record exposed for assignment routing",
              "A User is internal-only; a Group is the public identity exposed to integration partners for assignment routing"
            ],
            "answer": 0,
            "exp": "Users are individuals. Groups collect users — assignment groups route work, security groups control access."
          },
          {
            "q": "What does the 'itil' role provide?",
            "options": [
              "Read-only access to the entire platform for executive reporting only",
              "Basic access for IT service management — create/update incidents, tasks, and requests",
              "Full admin access including the ability to elevate to security_admin role in production",
              "Access to the Service Portal as a self-service end user for requests"
            ],
            "answer": 1,
            "exp": "The itil role is the baseline for ITSM users — service desk agents, IT staff. Create and work incidents, problems, changes."
          },
          {
            "q": "What is an Access Control List (ACL)?",
            "options": [
              "Rules defining who can read, write, create, or delete records and fields",
              "A reusable scripted helper that calculates field visibility on every form",
              "A scoped application that bundles related security policies for deployment",
              "A scripted condition controlling whether a UI Action displays on a form"
            ],
            "answer": 0,
            "exp": "ACLs are the security rules engine — they evaluate role, condition, and script to determine if a user can access a table or field."
          },
          {
            "q": "What is the purpose of the 'active' flag on a user record?",
            "options": [
              "Marks the user record as a VIP for prioritized incident handling routing",
              "Excludes the user from all scheduled notification emails on a permanent basis",
              "Determines if the user can log in — inactive users cannot authenticate",
              "Hides the user from assignment group picker dropdowns across the platform"
            ],
            "answer": 2,
            "exp": "The active checkbox controls login access. Uncheck to disable a user without deleting — preserves history. Use for offboarding."
          },
          {
            "q": "What is impersonation in ServiceNow?",
            "options": [
              "Sharing a temporary admin role with another user during their shift on-call in production across the platform",
              "Logging in as another user using their actual password credential pair",
              "Temporarily assuming another user's identity to test their experience, available to admins",
              "Granting another user permanent read access to your personal saved reports"
            ],
            "answer": 2,
            "exp": "Impersonation lets admins see ServiceNow exactly as a specific user sees it. Essential for troubleshooting access issues."
          },
          {
            "q": "What does 'Contains Roles' on a group do?",
            "options": [
              "Restricts which records the group members can view inside ACLs",
              "Hides the group from the assignment group picker for selected tables",
              "Lists the workflows the group is permitted to trigger on demand",
              "Assigns roles that all members of the group inherit"
            ],
            "answer": 3,
            "exp": "Roles assigned to a group are inherited by all group members. Add itil to your service desk group — every member gets it."
          },
          {
            "q": "What is a Delegated Developer?",
            "options": [
              "A non-admin user granted development rights within a specific application scope",
              "A user given the ability to install ServiceNow Store applications and plugins in production",
              "A user granted temporary access to the security_admin role on weekends",
              "A user permitted to deploy update sets between two specific instances only"
            ],
            "answer": 0,
            "exp": "Delegated Developers can develop within a specific scoped application without having full admin rights."
          },
          {
            "q": "What is LDAP integration used for?",
            "options": [
              "Synchronizing users and groups from Active Directory or other LDAP directories",
              "Federating single-sign-on between an identity provider and a portal in production",
              "Routing inbound emails to a centralized AD-managed shared mailbox",
              "Exporting ServiceNow audit logs into a SIEM tool such as Splunk"
            ],
            "answer": 0,
            "exp": "LDAP integration syncs users from corporate AD to ServiceNow automatically. New hires appear, terminated employees deactivated."
          },
          {
            "q": "What is the purpose of the 'sys_id' field?",
            "options": [
              "A short numeric counter incremented each time the record is updated in production",
              "A unique system-generated identifier (GUID) for every record in the platform",
              "The display name of the record shown in lists and reference fields",
              "The audit signature recording who last modified the record's fields"
            ],
            "answer": 1,
            "exp": "sys_id is the globally unique identifier for every record — a 32-character GUID. Used in integrations, scripts, and URLs."
          },
          {
            "q": "What does the 'Manager' field on a user record control?",
            "options": [
              "Which assignment group the user is automatically routed to on login",
              "Who the user reports to inside the org chart visualizations only",
              "The default approver for the user's submitted service catalog requests",
              "Who the user reports to, used in approval workflows and org hierarchy"
            ],
            "answer": 3,
            "exp": "The Manager field establishes hierarchy — used in approval flows, escalations, and org chart features."
          },
          {
            "q": "What is Single Sign-On (SSO) in ServiceNow?",
            "options": [
              "Authentication where the user enters credentials at the ServiceNow login page first every session",
              "A scripted login mechanism that uses LDAP at login and SAML for subsequent automated sessions",
              "Authentication through an external identity provider without separate ServiceNow credentials",
              "Encrypted authentication using a ServiceNow-managed credential vault for stored credentials"
            ],
            "answer": 2,
            "exp": "SSO lets users log into ServiceNow using corporate credentials. One login for everything — no separate ServiceNow password."
          },
          {
            "q": "What is a VIP user in ServiceNow?",
            "options": [
              "A user with permanent membership in every assignment group that handles ITSM and HRSD work",
              "A user with global admin permissions across every scoped application installed in the instance",
              "A user flagged for priority handling in service requests and incidents",
              "A user with delegated authority to approve catalog requests on behalf of an executive sponsor user"
            ],
            "answer": 2,
            "exp": "VIP flag triggers priority handling — escalate incidents automatically, alert management, or give priority queue placement."
          },
          {
            "q": "What is the purpose of the Time Zone field on a user record?",
            "options": [
              "To restrict which records the user can see based on their physical location only",
              "To set the user's default homepage based on the time of day in their region only",
              "To route inbound calls from the contact center based on the user's working hours",
              "To display dates and times in the user's local time zone across the platform"
            ],
            "answer": 3,
            "exp": "Time zone setting converts all platform timestamps to the user's local time. LA and NY users see times in their respective zones."
          },
          {
            "q": "What is a Quota Rule?",
            "options": [
              "A rule limiting records returned in queries to prevent performance issues",
              "A rule that auto-archives older records once a target table hits a defined size",
              "A scripted condition that caps the rows returned by a dashboard widget on load",
              "A rule that prevents users from creating more than a set number of records daily"
            ],
            "answer": 0,
            "exp": "Quota Rules prevent runaway queries from degrading performance. They cancel queries exceeding row limits or time limits."
          },
          {
            "q": "What is the purpose of Update Sets for configuration changes?",
            "options": [
              "To capture and migrate configuration changes between instances",
              "To preserve a snapshot of the production data in development environments",
              "To assign roles to users based on their LDAP group membership at login",
              "To restrict role inheritance from parent groups to specific child groups"
            ],
            "answer": 0,
            "exp": "Update Sets capture configuration changes (not data) — move from dev to test to production. User records are data, not config."
          },
          {
            "q": "What is a Group Type?",
            "options": [
              "A reusable template applied to every new group created in the instance",
              "A categorization for groups — like 'itil' type for ITSM assignment groups",
              "A scripted condition restricting which roles can join the group dynamically",
              "A scheduled job that audits group membership and removes inactive users"
            ],
            "answer": 1,
            "exp": "Group types categorize groups by purpose. ITSM assignment groups often have type 'itil' to filter correctly in assignment fields."
          },
          {
            "q": "What does 'Contains' mean in a ServiceNow role hierarchy?",
            "options": [
              "Roles must be requested through an approval flow before granting them",
              "Roles that contain other roles cannot be assigned to groups directly",
              "Roles can be granted only by users holding the security_admin role",
              "A role that includes other roles"
            ],
            "answer": 3,
            "exp": "Roles can contain other roles — admin contains itil, which contains approver_user. Role inheritance flows down automatically."
          },
          {
            "q": "What is the purpose of Field Security (field-level ACLs)?",
            "options": [
              "To restrict which scoped applications a user can view inside Application Manager",
              "To prevent specific fields from rendering inside list views for selected users",
              "To control which roles can read or modify specific fields on a table",
              "To restrict which forms a user sees based on their assignment group's role"
            ],
            "answer": 2,
            "exp": "Field-level ACLs control who can read and write individual fields — more granular than table-level or form-level controls."
          },
          {
            "q": "What happens when you assign a role to a group vs directly to a user?",
            "options": [
              "Both grant the same access; group assignment is simply the preferred management method",
              "Direct user assignment is denied by default; group assignment is the only supported method",
              "Group assignment is logged in System Logs; direct user assignment leaves no audit trail behind ever",
              "Group assignment activates immediately; direct user assignment requires nightly cache refresh first"
            ],
            "answer": 0,
            "exp": "Same result — the user gets the permissions. Best practice is group assignment for easier management at scale."
          },
          {
            "q": "You have the admin role but trying to elevate to security_admin to edit ACLs. The option isn't visible. Most likely cause?",
            "options": [
              "The High Security Plugin elevates everyone with admin to security_admin automatically by default",
              "The High Security Plugin isn't activated, or you don't have the security_admin role assigned to begin with",
              "The security_admin role has to be requested through an approval flow and granted by another admin",
              "The user profile preference 'Show Elevation' must be enabled inside the user record before any use in production"
            ],
            "answer": 1,
            "exp": "security_admin is a role you elevate INTO temporarily — but you have to actually have it assigned. High Security Plugin enforces the elevation flow. No security_admin role = no elevation option in your name menu."
          },
          {
            "q": "What does Domain Separation provide in ServiceNow?",
            "options": [
              "Logical data isolation between different business units, customers, or regions on a single instance",
              "Logical separation of update sets into separate parents for tracking change ownership in promotion flows",
              "Logical separation of scoped applications into independent application namespaces with role-based access",
              "Physical separation of data into separate databases for compliance with isolation rules in cloud regions"
            ],
            "answer": 0,
            "exp": "Domain Separation lets one ServiceNow instance serve multiple isolated tenants. MSPs use it to keep Customer A's data invisible to Customer B. Records, users, configs all scoped by domain. Heavy lift to set up."
          },
          {
            "q": "A new admin asks why we don't grant the admin role directly to users. Best answer?",
            "options": [
              "Best practice is to assign roles to groups and add users to the group — easier to audit, easier to revoke at scale, and consistent with how LDAP/AD-based memberships work",
              "Direct user assignment is required for any user that needs to elevate into the security_admin role for editing ACL records",
              "Direct user assignment is more secure because the audit log records the explicit grant action and the responsible admin",
              "Direct user assignment works better with SSO providers because group sync from LDAP is unreliable in newer ServiceNow releases in production across the platform"
            ],
            "answer": 0,
            "exp": "Group-based assignment scales. Onboard 50 service desk reps? Add them to the group, they inherit itil. Someone leaves? Remove from group, access gone. Direct assignment is fine for one-offs, not for managing a real org."
          },
          {
            "q": "What is the Delegate field on a user record used for?",
            "options": [
              "Granting another user the same role assignments that you currently hold to handle your queue during planned absence periods",
              "Letting another user act on behalf of you for approvals and notifications during a defined period (like vacation coverage)",
              "Letting another user fully impersonate your account in the platform to handle work on your behalf during PTO coverage",
              "Permanently transferring ownership of all records assigned to you to another user during a planned departure from the team"
            ],
            "answer": 1,
            "exp": "Delegates are vacation coverage. Set Sarah as your delegate Aug 1-15, and approvals routed to you go to Sarah instead. Without this, things sit in your queue while you're at the beach."
          },
          {
            "q": "What's the purpose of Multi-Provider SSO in ServiceNow?",
            "options": [
              "Allows the platform to authenticate users against multiple databases in parallel — useful for orgs that maintain redundant identity stores",
              "Allows a single identity provider to authenticate users across multiple ServiceNow instances simultaneously without having to re-authenticate in production across the platform",
              "Allows the platform to require multi-factor authentication on top of single sign-on for executives and other high-privilege admin users",
              "Allows different sets of users to authenticate via different identity providers — useful for orgs with multiple AD forests, partners, or recent acquisitions"
            ],
            "answer": 3,
            "exp": "Most orgs have one IDP. Acquisitions, partners, or international subsidiaries break that assumption. Multi-Provider SSO lets you route Group A through Okta and Group B through Azure AD on the same instance. Real-world enterprise feature."
          }
        ]
      },
      {
        "id": "csa7",
        "name": "ITSM Fundamentals",
        "questions": [
          {
            "q": "What is an Incident in ITIL/ServiceNow?",
            "options": [
              "A controlled modification to infrastructure that requires CAB approval first",
              "A documented root cause that explains why an outage keeps happening",
              "An unplanned interruption to a service or reduction in service quality",
              "A planned request submitted by a user for a new service or product"
            ],
            "answer": 2,
            "exp": "An incident is any unplanned interruption — system down, performance degraded, feature broken. Restore service fast."
          },
          {
            "q": "What is the difference between an Incident and a Service Request?",
            "options": [
              "An Incident is unplanned disruption; a Service Request is a planned formal request for something",
              "An Incident requires CAB approval; a Service Request is auto-approved through the catalog",
              "An Incident is closed by the requester; a Service Request is closed by the assignment group",
              "An Incident is logged in the CMDB as a CI; a Service Request is logged in the catalog table only"
            ],
            "answer": 0,
            "exp": "Incidents = something broke. Service Requests = please give me something. Different workflows, priorities, and SLAs."
          },
          {
            "q": "What is a Problem in ITIL/ServiceNow?",
            "options": [
              "An unplanned interruption to service that needs immediate workaround",
              "The underlying root cause of one or more incidents",
              "A controlled modification to infrastructure requiring CAB approval",
              "A pre-approved low-risk change applied through a standard template"
            ],
            "answer": 1,
            "exp": "Problems address root cause — why incidents keep happening. Incident restores service; Problem prevents recurrence."
          },
          {
            "q": "What is a Known Error?",
            "options": [
              "A configuration item flagged in the CMDB as having a degraded operational status in production",
              "A change request that has been approved by the CAB but not yet implemented",
              "An incident that has been resolved but is awaiting final user signoff",
              "A problem with identified root cause and workaround, even if not yet permanently fixed"
            ],
            "answer": 3,
            "exp": "Known Error = we know the root cause and have a workaround. Documenting speeds up future incident resolution."
          },
          {
            "q": "What is Change Management in ITIL?",
            "options": [
              "A process for issuing pre-approved standard templates for routine modifications only",
              "A process for controlling changes to minimize risk while enabling necessary updates",
              "A process for documenting the root cause of recurring service interruptions",
              "A process for ranking incidents by priority based on impact and urgency together"
            ],
            "answer": 1,
            "exp": "Change Management controls modifications to infrastructure — ensuring changes are planned, tested, approved, and communicated."
          },
          {
            "q": "What are the three types of changes in ITIL?",
            "options": [
              "Planned, Unplanned, Emergency",
              "Standard, Normal, Emergency",
              "Major, Minor, Routine",
              "Preventive, Corrective, Adaptive"
            ],
            "answer": 1,
            "exp": "Standard = pre-approved and routine. Normal = requires CAB approval. Emergency = urgent fixes with expedited process."
          },
          {
            "q": "What is a CAB?",
            "options": [
              "A group responsible for reviewing root cause analyses on problems",
              "A pre-approved template used for routine standard change requests",
              "A reusable workflow activity that auto-approves low-risk requests",
              "A group that reviews and approves normal change requests"
            ],
            "answer": 3,
            "exp": "The CAB reviews normal changes to assess risk and approve implementation. IT leaders, service owners, business stakeholders."
          },
          {
            "q": "What is a Configuration Item (CI)?",
            "options": [
              "A document explaining how to resolve a recurring known error issue",
              "A scheduled job that scans the CMDB for stale or duplicate records",
              "Any component that needs to be managed and tracked in the CMDB",
              "A reusable workflow activity that automates the closure of incidents"
            ],
            "answer": 2,
            "exp": "CIs are anything in your infrastructure — servers, applications, databases, network devices. CMDB tracks all CIs and relationships."
          },
          {
            "q": "What is the CMDB?",
            "options": [
              "A repository of CIs and their relationships providing visibility into IT infrastructure",
              "A scripted dashboard showing the status of every change in production environments",
              "A workflow engine that orchestrates the lifecycle of every change record automatically in production",
              "A scheduled job that auto-archives configuration items not updated in 90 days or more"
            ],
            "answer": 0,
            "exp": "The CMDB is the single source of truth for your IT infrastructure. Maps what you have and how everything connects."
          },
          {
            "q": "What is SLA in ServiceNow?",
            "options": [
              "A rule defining who can approve a change record during the CAB review",
              "A commitment defining response and resolution time targets for IT services",
              "A reusable workflow activity that escalates incidents to senior staff members",
              "A scoped application that bundles ITIL processes for customer onboarding"
            ],
            "answer": 1,
            "exp": "SLAs define expected service performance — respond within 1 hour, resolve within 8 hours for P1. Tracks time automatically."
          },
          {
            "q": "What is the difference between Response SLA and Resolution SLA?",
            "options": [
              "Response pauses on weekends; Resolution runs continuously and includes the weekend hours",
              "Response is set per user; Resolution is set per assignment group as a flat clock value",
              "Response handles incidents in the queue; Resolution handles incidents already assigned",
              "Response measures time to first action; Resolution measures time to close/fix"
            ],
            "answer": 3,
            "exp": "Response SLA: time until someone acknowledges and starts working. Resolution SLA: time until the issue is fixed."
          },
          {
            "q": "What does Priority mean on a ServiceNow Incident?",
            "options": [
              "The category the incident is logged against in the Knowledge base list",
              "The calculated urgency based on Impact and Urgency",
              "The role required to close an incident based on its assignment group",
              "The order in which incidents appear in the assignment group's queue"
            ],
            "answer": 1,
            "exp": "Priority = Impact × Urgency. High impact + High urgency = P1. ServiceNow calculates automatically from a priority matrix."
          },
          {
            "q": "What is a Service Catalog in ServiceNow?",
            "options": [
              "A dashboard listing every incident currently assigned to the user",
              "A scheduled job that pushes catalog items to the Service Portal nightly",
              "A self-service portal where users request services and products",
              "A reusable workflow library shared across all scoped applications"
            ],
            "answer": 2,
            "exp": "The Service Catalog is the menu of IT services users can request. Structured workflows fulfill each request automatically."
          },
          {
            "q": "What is a RITM in ServiceNow?",
            "options": [
              "A scheduled job that auto-closes catalog requests after 90 days of inactivity",
              "A reusable workflow activity that fulfils a single requested item line",
              "An audit log entry recording every change to a request's variable values",
              "A Requested Item created when a user orders from the Service Catalog"
            ],
            "answer": 3,
            "exp": "RITM = Requested Item. When you order from the catalog, a Request (REQ) has one or more RITMs — one per item ordered."
          },
          {
            "q": "What is a Task in ServiceNow?",
            "options": [
              "A scheduled job that runs nightly to clean orphaned related task records",
              "A scoped application bundling a related set of catalog items for ordering",
              "A unit of work assigned to a person or group within a workflow",
              "A reusable workflow activity that runs on completion of an incident closure"
            ],
            "answer": 2,
            "exp": "Tasks are work items within larger records — Change Tasks in a change, Catalog Tasks in a request. Their own states and assignees."
          },
          {
            "q": "What is the purpose of Assignment Groups?",
            "options": [
              "To route work to the correct team for resolution",
              "To restrict which records appear in user reports based on department only",
              "To allocate incident resolution credit toward the group's KPI scorecard only",
              "To pre-approve standard changes submitted by members of the listed group"
            ],
            "answer": 0,
            "exp": "Assignment Groups route work to the right team — Network group gets network incidents, Desktop Support gets hardware."
          },
          {
            "q": "What is Incident Auto-Assignment?",
            "options": [
              "Scheduled clearing of stale incidents from the assignment group's queue",
              "Automatically assigning incidents to groups or users based on defined rules",
              "Auto-escalation of incidents missing their first response SLA every hour",
              "Bulk reassignment of incidents from one group to another via a scripted job"
            ],
            "answer": 1,
            "exp": "Auto-assignment rules route incidents to the right group automatically — reducing manual triage time."
          },
          {
            "q": "What is a parent-child relationship between incidents?",
            "options": [
              "A reusable knowledge link between an incident and the problem record's cause",
              "A read-only audit chain showing every group an incident has been routed through in production",
              "A workflow link between incidents and changes that share a common CMDB CI",
              "A major incident (parent) with related individual incidents (children) linked to it"
            ],
            "answer": 3,
            "exp": "Parent-child connects a major incident to all individual incidents reporting the same issue. Fix parent, update all children."
          },
          {
            "q": "What is the purpose of the 'On Hold' state in incidents?",
            "options": [
              "Routes the incident to an escalation queue for senior IT staff review",
              "To pause the incident's SLA clock while waiting on third parties or the user",
              "Triggers a reminder email to the assignment group every business hour",
              "Permanently closes the incident as resolved without further user interaction"
            ],
            "answer": 1,
            "exp": "'On Hold' pauses work and typically pauses SLA timers. Used when waiting for vendor response or user callback."
          },
          {
            "q": "What is Knowledge Management in ServiceNow?",
            "options": [
              "A scoped reporting suite that visualizes incident and change KPIs together",
              "A reusable workflow library that automates the closure of known errors",
              "A system for creating, organizing, and sharing institutional knowledge as articles",
              "A scheduled job that pushes knowledge articles to external customer portals in production"
            ],
            "answer": 2,
            "exp": "Knowledge Management captures institutional knowledge in articles — how to fix common issues, FAQs. Fewer repeat incidents."
          },
          {
            "q": "A P1 incident takes down email for the entire company. Per ITIL, what should this be flagged as in addition to a regular incident?",
            "options": [
              "An Emergency Change",
              "A Problem record",
              "A Major Incident",
              "A Standard Change"
            ],
            "answer": 2,
            "exp": "Major Incidents are high-impact incidents that get a formal communication and bridge process — exec updates, war room, dedicated comms. P1 is a priority; Major Incident is a process designation. Most platforms have a Major Incident checkbox."
          },
          {
            "q": "What's the difference between a Standard Change and a Standard Change Template?",
            "options": [
              "A Standard Change is reviewed by the CAB on every submission; the Standard Change Template is the lower-risk variant that skips CAB review and goes straight to implementation without any oversight",
              "A Standard Change is the live change request; the Standard Change Template is the pre-approved blueprint that the Standard Change is created from",
              "A Standard Change Template is filled by the requester for each new change; the Standard Change is the auto-generated copy that the CAB reviews and approves before any implementation",
              "A Standard Change is the legacy template; the Standard Change Template is the modern replacement record introduced in newer versions of the ServiceNow platform release cycle"
            ],
            "answer": 1,
            "exp": "Template = the pattern (e.g., 'reboot the email server' — pre-approved, low-risk). Standard Change = the actual instance created from the template. Pre-approval lives in the template, so the live change skips CAB."
          },
          {
            "q": "What is a Catalog Task (CTASK)?",
            "options": [
              "A unit of work created by a Service Catalog request to fulfill the requested item — like 'provision the laptop' or 'create the AD account'",
              "A reusable workflow activity inside the Service Catalog request workflow that creates a downstream task for the assignment group that fulfils the request",
              "An audit log entry recording every action a user took inside the Service Catalog ordering process — kept for compliance with internal change-control policies",
              "A scheduled job that runs against the Service Catalog table every hour and creates assignment tasks for any requested items that have not yet been picked up"
            ],
            "answer": 0,
            "exp": "Order a new-hire kit from the catalog. RITM is created. The fulfillment workflow spawns CTASKs for each step — IT provisions the laptop, HR sends the welcome packet, facilities sets up the desk. Each CTASK assigned to a different team."
          },
          {
            "q": "What's the difference between an SLA, an OLA, and a UC?",
            "options": [
              "SLA = with internal teams; OLA = with the customer; UC = the workflow used to fulfil a contract — three separate processes that tie back to the same record",
              "SLA = with the customer; OLA (Operational Level Agreement) = between internal IT teams; UC (Underpinning Contract) = with an external vendor",
              "SLA = the master agreement; OLA = the renewal terms; UC = the technical specs that vendors deliver — three documents that combine into the full service contract for a customer",
              "SLA = customer-facing; OLA = the legal review board; UC = the financial chargeback model used inside the company — three layers of the overall service-level governance"
            ],
            "answer": 1,
            "exp": "SLA faces the customer. OLA holds internal teams accountable to each other (network team commits to desktop team). UC ties to outside vendors (your ISP's contract). All three together = how you actually meet your customer SLA."
          },
          {
            "q": "An incident keeps getting reassigned between groups. What field on the Incident record tracks this for reporting?",
            "options": [
              "Impact Score",
              "Escalation Count in production",
              "Priority",
              "Reassignment Count"
            ],
            "answer": 3,
            "exp": "Reassignment Count auto-increments every time the assignment group changes. High counts signal poor routing or a turfing problem — incidents bouncing because nobody owns them. Common KPI for service desk health."
          }
        ]
      },
      {
        "id": "csa8",
        "name": "Platform Administration",
        "questions": [
          {
            "q": "What is an Update Set in ServiceNow?",
            "options": [
              "A scheduled job that exports records from one table to another nightly",
              "A container that captures configuration changes for migration between instances",
              "A reusable scripted helper that imports records into the staging table",
              "A workflow that promotes a record from one assignment group to another in production"
            ],
            "answer": 1,
            "exp": "Update Sets capture configuration changes — scripts, forms, workflows, ACLs — to move from dev to test to prod."
          },
          {
            "q": "What are the typical ServiceNow instance environments?",
            "options": [
              "Sandbox, Staging, Production",
              "Sandbox, Pre-Production, Production in production",
              "Development, Test/UAT, and Production",
              "Demo, QA, Live"
            ],
            "answer": 2,
            "exp": "Most organizations have Dev (build), Test/UAT (validate), and Production (users work). Changes flow Dev → Test → Prod."
          },
          {
            "q": "What is a Scheduled Job?",
            "options": [
              "A scripted condition that determines when a business rule fires next time",
              "A workflow activity that fires inside another running flow on a schedule",
              "An automated script that runs at defined intervals",
              "An audit log entry recording every scripted action executed on the instance"
            ],
            "answer": 2,
            "exp": "Scheduled Jobs (Scheduled Script Executions) run scripts automatically on a schedule — nightly cleanups, daily imports."
          },
          {
            "q": "What is the purpose of System Properties?",
            "options": [
              "A scripted helper that calculates dynamic field values during form load",
              "A scheduled job that auto-updates platform settings on a recurring cadence",
              "A reusable workflow activity that wraps system-level operations inside it",
              "To store configurable settings that control platform behavior"
            ],
            "answer": 3,
            "exp": "System Properties are key-value pairs controlling platform behavior — email settings, session timeouts, default values."
          },
          {
            "q": "What is a Plugin in ServiceNow?",
            "options": [
              "An optional platform component that activates additional functionality",
              "A scripted workflow activity that runs setup steps when a platform module is activated",
              "An update set that bundles related configuration changes for promotion between instances",
              "A scoped application that bundles related tables and scripts for deployment"
            ],
            "answer": 0,
            "exp": "Plugins activate built-in ServiceNow features — ITSM, HRSD, CSM are all plugins. Some included, some cost extra."
          },
          {
            "q": "What is the MID Server?",
            "options": [
              "A scoped application that bundles integration spokes for outbound REST integrations",
              "A Java application enabling communication between ServiceNow and on-premise systems",
              "A scripted helper that resolves credentials at runtime for outbound REST calls",
              "A reusable workflow activity that runs network discovery scans inside a customer's network"
            ],
            "answer": 1,
            "exp": "MID Server is a Java agent installed on-premise that lets ServiceNow reach systems inside your firewall."
          },
          {
            "q": "What is Discovery in ServiceNow?",
            "options": [
              "A scripted helper that calculates CI relationships dynamically during impact analysis",
              "A reusable workflow activity that updates a CI's state from a notification source",
              "A scheduled job that exports CMDB records into an external monitoring tool",
              "An automated process that scans networks to find and populate CMDB CIs"
            ],
            "answer": 3,
            "exp": "Discovery automatically scans your network, finds infrastructure, and populates the CMDB. Keeps CI inventory current automatically."
          },
          {
            "q": "What is the purpose of the Email Log?",
            "options": [
              "To view a history of every CMDB record changed by an automatic discovery scan today",
              "To view a history of all inbound and outbound emails processed by the platform",
              "To view a history of every login attempt made by users against the instance overnight",
              "To view a history of every workflow activity executed by the platform engine over time"
            ],
            "answer": 1,
            "exp": "The Email Log shows every email sent and received — great for troubleshooting why notifications didn't send."
          },
          {
            "q": "What is a Notification in ServiceNow?",
            "options": [
              "A scripted condition that filters which records appear inside the user's homepage view",
              "A scheduled job that auto-archives records that match a defined retention rule",
              "An automated email, SMS, or push alert triggered by events or conditions",
              "A reusable workflow activity that updates a notification's status from a notification source"
            ],
            "answer": 2,
            "exp": "Notifications automatically send emails when defined conditions are met — incident assigned, SLA breaching, approval needed."
          },
          {
            "q": "What is the purpose of Import Sets?",
            "options": [
              "To restrict which users can run integrations against a target table inside the instance",
              "To migrate scoped applications and their data between two ServiceNow instances directly",
              "To load data from external sources into ServiceNow through a staging process",
              "To trigger a workflow when an inbound email is received on a configured user inbox account"
            ],
            "answer": 2,
            "exp": "Import Sets stage external data, transform and map it, then load it into target tables. Used for bulk user imports and data migrations."
          },
          {
            "q": "What is a Transform Map?",
            "options": [
              "A reusable workflow activity that runs whenever an Import Set finishes a load operation",
              "A scripted condition that filters which rows of an Import Set are loaded into the target",
              "A scoped application that bundles import mapping logic for promotion between two instances",
              "Rules defining how data from an Import Set maps to fields in a target table"
            ],
            "answer": 3,
            "exp": "Transform Maps define the translation rules — Import Set column 'FIRST_NAME' maps to User table field 'first_name'."
          },
          {
            "q": "What is the purpose of the System Log?",
            "options": [
              "To record system events, errors, warnings, and debug information",
              "To view a history of every CMDB record changed by an automatic discovery scan today",
              "To view a history of every login attempt made by users against the instance recently",
              "To view a history of every workflow activity executed by the platform engine recently"
            ],
            "answer": 0,
            "exp": "The System Log records everything — script errors, integration calls, system events. If something's broken, start here."
          },
          {
            "q": "What is a Script Include?",
            "options": [
              "A reusable workflow activity that runs a custom server-side script at a defined flow step",
              "A reusable server-side JavaScript library that can be called from other scripts",
              "A scoped application that bundles related scripts and tables for promotion between instances",
              "A scheduled job that runs server-side JavaScript on a recurring cadence inside each instance"
            ],
            "answer": 1,
            "exp": "Script Includes are reusable server-side code libraries. Write common logic once, call it from Business Rules, REST APIs, Flows."
          },
          {
            "q": "What is an Inbound Email Action?",
            "options": [
              "A rule that processes incoming emails and performs actions like creating or updating records",
              "A scheduled job that auto-archives email records that have been read for more than a week",
              "A reusable workflow activity that sends an outbound email when a record is updated by a user",
              "A scripted helper that calculates email recipients dynamically based on assignment group rules"
            ],
            "answer": 0,
            "exp": "Inbound Email Actions process emails coming into ServiceNow — create an incident, add a comment, close a ticket."
          },
          {
            "q": "What is the purpose of the REST API?",
            "options": [
              "To bundle related scripts and tables into a scoped application for direct promotion between two",
              "To restrict which users can run integrations against a target table inside the instance directly",
              "To allow external systems to interact with ServiceNow data via HTTP requests",
              "To migrate scoped applications and their data between two ServiceNow instances at the same time"
            ],
            "answer": 2,
            "exp": "ServiceNow's REST API lets external systems create, read, update, and delete records via HTTP. Foundation of all integrations."
          },
          {
            "q": "What is a CI Relationship in the CMDB?",
            "options": [
              "A scheduled job that auto-archives CIs that have not been touched by a discovery scan",
              "A scripted condition that filters which CIs appear inside the CMDB's discovery view",
              "A defined connection between two CIs showing how they depend on or connect",
              "A scoped application that bundles related CMDB classes for promotion between instances"
            ],
            "answer": 2,
            "exp": "CI Relationships map dependencies — web server 'runs on' physical server. Enable impact analysis: if this goes down, what breaks?"
          },
          {
            "q": "What is the purpose of Cloning?",
            "options": [
              "To copy data only from one instance to another while leaving configuration untouched",
              "To migrate scoped applications between instances using update sets to track changes",
              "To copy data and configuration from one instance to another",
              "To replicate the contents of the CMDB to an external monitoring system on a schedule"
            ],
            "answer": 2,
            "exp": "Cloning copies a source instance (usually production) to a target (dev or test). Gives developers a realistic environment."
          },
          {
            "q": "What is the Application Manager used for?",
            "options": [
              "To export update sets and migrate them between two ServiceNow instances on a schedule",
              "To trigger workflows when scoped applications are activated for the first time on an instance",
              "To restrict which users can elevate themselves into the security_admin role for ACL editing",
              "To install, update, and manage ServiceNow store applications and plugins"
            ],
            "answer": 3,
            "exp": "Application Manager is where you install ServiceNow Store apps and activate plugins. Admin-level access required."
          },
          {
            "q": "What is a Scope in ServiceNow?",
            "options": [
              "An application namespace that isolates customizations to prevent conflicts",
              "A scoped scheduled job framework that runs background scripts on a recurring cadence",
              "A reusable workflow library shared between scoped applications during their activation",
              "A read-only audit log of every record changed by a scoped application on the instance"
            ],
            "answer": 0,
            "exp": "Scopes isolate applications — your custom app's tables and scripts are in your scope. Prevents upgrade conflicts."
          },
          {
            "q": "What is the Upgrade History?",
            "options": [
              "To export update sets and migrate them between two ServiceNow instances on a defined schedule",
              "To track ServiceNow version upgrades and what was changed",
              "To restrict which users can run upgrades against the instance during defined business hours",
              "To trigger workflows when scoped applications are activated for the first time on an instance"
            ],
            "answer": 1,
            "exp": "Upgrade History tracks every ServiceNow version upgrade — what was applied, what was skipped, what customizations were overwritten."
          },
          {
            "q": "You have 30 update sets to move from dev to prod. What's the cleanest way to migrate them as a single unit?",
            "options": [
              "Combine them into an Update Set Batch with a defined parent and load all at once",
              "Use a background script to clone records between instances bypassing the update set system",
              "Apply each update set one at a time in alphabetical order without any parent grouping",
              "Promote each update set as a scoped app then run a manual sync job in the prod environment"
            ],
            "answer": 0,
            "exp": "Update Set Batches group sets under one parent. Move the parent and all children flow together, in dependency order. Massively reduces risk of forgetting a set or applying them out of order."
          },
          {
            "q": "You're upgrading ServiceNow and a customization conflicts with the new version's out-of-box file. What does ServiceNow ask you to do?",
            "options": [
              "Cancel the upgrade and contact ServiceNow support to manually merge the customization back in afterward",
              "Apply the upgrade with the Force Skip Conflicts option enabled, then patch any broken customizations later",
              "Re-implement the customization as a scoped application before retrying the upgrade against the same instance in production",
              "Review each conflict in Upgrade History and choose Skip (keep your customization) or Revert (accept the new file)"
            ],
            "answer": 3,
            "exp": "Upgrade conflicts get logged in Upgrade History as 'Skipped' files. You review each one and decide: keep my customization (Skip) or take the OOB version (Revert). Skip too aggressively and you miss platform improvements forever."
          },
          {
            "q": "What is a Fix Script used for?",
            "options": [
              "A scoped application that bundles related scripts and tables for promotion between instances — used to deliver one-time data fixes alongside related configuration changes safely",
              "A scheduled job that runs on a recurring cadence inside the platform — used for nightly cleanups, data imports, or report generation on a fixed timer in production",
              "A one-time, run-on-demand server-side script captured in an update set — typically used to fix bad data or run a one-shot configuration step in a target instance",
              "A reusable workflow activity that fires whenever a record matching a configured condition is inserted into a target table — used for ad-hoc data fixes during normal operations"
            ],
            "answer": 2,
            "exp": "Fix Scripts run once when the update set is committed in the target environment. Use them to clean orphaned records, set field defaults on existing data, or finish a setup step that can't be captured as configuration. Different from Background Scripts which never travel."
          },
          {
            "q": "What's the difference between Scripts - Background and a Fix Script?",
            "options": [
              "Scripts - Background runs immediately in the current instance only and is NOT captured in an update set; Fix Scripts are saved records that ARE captured and run when committed elsewhere",
              "Both run on a schedule in the background; the difference is Background runs daily while Fix Scripts run only on update set commit in the target environment by default",
              "Both are captured in update sets and travel between instances; the difference is Background runs against the source instance only while Fix Scripts run against the target instance in production",
              "Both are scoped to a single application; the difference is Background runs only in the global scope while Fix Scripts run in any scope they are captured against during the commit"
            ],
            "answer": 0,
            "exp": "Background = ad-hoc, one-shot, current-instance-only, not captured. Fix Script = saved, captured in update set, runs when committed in target. If you need it to travel, use a Fix Script. If it's a one-time dev poke, Background is fine."
          },
          {
            "q": "What is the Application Repository (now called Application Manager)?",
            "options": [
              "A scoped application that captures custom configuration changes and migrates them through the Dev to Test to Prod promotion pipeline using update sets for tracking",
              "A reusable workflow activity that triggers whenever a ServiceNow Store application is installed or updated — used to orchestrate post-install configuration tasks automatically",
              "A scheduled job that runs against installed applications on a recurring cadence to check for available updates and notifies administrators when new versions become available",
              "The hub where ServiceNow Store apps and ServiceNow-published plugins are installed, updated, and managed"
            ],
            "answer": 3,
            "exp": "Different beast altogether from Update Sets. Update Sets move custom configuration. Application Repository handles ServiceNow Store apps and plugins — the marketplace stuff. Both feed your instance, different lanes."
          }
        ]
      }
    ]
  },
  {
    "id": "ai",
    "name": "AWS AI Practitioner",
    "domains": [
      {
        "id": "ai1",
        "name": "Fundamentals of AI and ML",
        "questions": [
          {
            "q": "What is the difference between Artificial Intelligence (AI) and Machine Learning (ML)?",
            "options": [
              "AI is the broader concept of machines performing intelligent tasks; ML is a subset where machines learn from data",
              "AI focuses exclusively on rule-based systems; ML is the subset that uses neural networks for forecasting tasks",
              "ML is the broader concept of self-improving algorithms; AI is a narrower subset focused only on language and vision tasks",
              "AI and ML refer to the same field, with AI being the older term used before deep learning became dominant"
            ],
            "answer": 0,
            "exp": "AI = broad concept of intelligent machines. ML = a subset of AI where systems learn from data without being explicitly programmed. Deep Learning is a subset of ML."
          },
          {
            "q": "Which type of machine learning uses labeled training data?",
            "options": [
              "Unsupervised learning",
              "Reinforcement learning",
              "Supervised learning",
              "Semi-supervised learning"
            ],
            "answer": 2,
            "exp": "Supervised learning trains on labeled input-output pairs — you show the model examples with correct answers. Classification and regression are supervised tasks."
          },
          {
            "q": "What is a neural network?",
            "options": [
              "A managed AWS service for connecting on-premises networks to cloud workloads using deep packet inspection",
              "A statistical technique that predicts outcomes by fitting a linear regression through observed training data points",
              "A type of decision tree algorithm that splits data into branches based on feature thresholds at each node",
              "A computational model inspired by the human brain with interconnected nodes (neurons)"
            ],
            "answer": 3,
            "exp": "Neural networks are layers of interconnected nodes that process information, learning patterns through training. Deep neural networks have many layers — hence 'deep learning.'"
          },
          {
            "q": "What is the purpose of training data in machine learning?",
            "options": [
              "To teach the model by showing it examples and allowing it to learn patterns",
              "To monitor a deployed model for data drift and degraded prediction quality over time",
              "To measure model accuracy on data the model has never been exposed to during the training phase",
              "To deploy the trained model to a production endpoint for handling real-time inference requests"
            ],
            "answer": 0,
            "exp": "Training data is what the model learns from. More high-quality, representative training data generally leads to better model performance."
          },
          {
            "q": "What is overfitting in a machine learning model?",
            "options": [
              "The model performs poorly on training data and equally poorly on test data due to insufficient complexity",
              "The model performs well on training data but poorly on new unseen data",
              "The model relies on too few features and misses important patterns present in the input training data",
              "The model converges too slowly during training and never reaches an acceptable accuracy threshold on the data"
            ],
            "answer": 1,
            "exp": "Overfitting = the model memorized the training data instead of learning generalizable patterns. High training accuracy, low test accuracy. Like memorizing answers without understanding."
          },
          {
            "q": "What is a Large Language Model (LLM)?",
            "options": [
              "A type of AI model trained on massive text datasets capable of understanding and generating human language",
              "An ensemble of decision trees that aggregates predictions across many weak learners to produce a final answer",
              "A small AI model fine-tuned for one narrow task such as classifying short text into a few fixed categories",
              "A foundation model that generates only structured data such as JSON, tables, and database records for ETL jobs"
            ],
            "answer": 0,
            "exp": "LLMs like GPT-4 and Claude are trained on vast text data to understand and generate language. They power chatbots, summarization, code generation, and more."
          },
          {
            "q": "What is the difference between structured and unstructured data?",
            "options": [
              "Structured data refers to text and documents; unstructured data refers to spreadsheets and database tables",
              "Structured data is what models predict; unstructured data is what models receive as input during inference",
              "Structured data lives in NoSQL databases like DynamoDB; unstructured data lives in relational databases like RDS",
              "Structured data is organized in tables/databases; unstructured data includes text, images, video without predefined format"
            ],
            "answer": 3,
            "exp": "Structured = organized rows and columns like SQL databases. Unstructured = text, images, audio, video. ML models increasingly handle both."
          },
          {
            "q": "What is a training/test split in machine learning?",
            "options": [
              "Dividing data so some is used to train the model and some is held back to evaluate its performance",
              "Splitting the training job across multiple GPUs to reduce wall-clock time and parallelize gradient updates",
              "Splitting incoming inference traffic between two model versions in production to compare their accuracy",
              "Splitting the model architecture into two halves that run on separate compute nodes to speed up training"
            ],
            "answer": 0,
            "exp": "Typically 80% training, 20% testing. The test set evaluates real-world performance — the model has never seen it, so it's a fair assessment."
          },
          {
            "q": "Which AWS service is the primary fully managed machine learning platform?",
            "options": [
              "Amazon Bedrock",
              "Amazon Comprehend",
              "Amazon SageMaker",
              "AWS Lambda"
            ],
            "answer": 2,
            "exp": "Amazon SageMaker is AWS's fully managed ML platform — build, train, deploy, and monitor ML models at scale without managing infrastructure."
          },
          {
            "q": "What is inference in the context of machine learning?",
            "options": [
              "Adjusting model weights based on prediction errors observed during the training phase",
              "Removing low-quality records from a dataset before the model begins its training loop",
              "Evaluating a trained model's accuracy on a held-out test set before deploying to production",
              "Using a trained model to make predictions on new input data"
            ],
            "answer": 3,
            "exp": "Inference = using the trained model in production to make predictions. Training happens once (or periodically); inference happens continuously."
          },
          {
            "q": "What is a feature in machine learning?",
            "options": [
              "An individual measurable property or characteristic used as input to a model",
              "A version of a model that has been deployed to a SageMaker endpoint for real-time inference",
              "A specific model architecture choice such as the number of layers in a deep neural network",
              "An input variable or measurable attribute the model uses to make a prediction during inference"
            ],
            "answer": 0,
            "exp": "Features are the input variables the model uses to make predictions. In a salary prediction model, features might include years of experience, education level, and location."
          },
          {
            "q": "What is unsupervised learning?",
            "options": [
              "Learning from a fixed labeled dataset where every training example has a known correct answer attached",
              "Learning from unlabeled data to find patterns, clusters, or structure without predefined correct answers",
              "Learning through a pre-trained foundation model that is fine-tuned on a small set of customer examples",
              "Learning by receiving rewards or penalties from an environment based on actions the agent decides to take"
            ],
            "answer": 1,
            "exp": "Unsupervised learning finds hidden patterns in data without labels — clustering customers by behavior, anomaly detection, dimensionality reduction."
          },
          {
            "q": "What is reinforcement learning?",
            "options": [
              "Learning through trial and error by receiving rewards or penalties for actions taken in an environment",
              "Learning by adjusting model parameters until predictions on a fixed labeled dataset match the known answers",
              "Learning that uses unlabeled data to find hidden patterns or natural clusters in the input observations",
              "Learning that takes a pre-trained model and fine-tunes it on a smaller domain-specific dataset for a new task"
            ],
            "answer": 0,
            "exp": "Reinforcement learning trains agents to maximize rewards — like training an AI to play chess by rewarding winning moves and penalizing losing ones."
          },
          {
            "q": "What is model accuracy?",
            "options": [
              "The total number of trainable parameters and weight matrices contained in a model's architecture",
              "The number of inference requests a deployed model can process per second under production load",
              "The total wall-clock time required to train the model from initialization to final convergence",
              "The percentage of correct predictions out of total predictions"
            ],
            "answer": 3,
            "exp": "Accuracy = correct predictions / total predictions × 100. A simple but important metric — though not always sufficient on its own for imbalanced datasets."
          },
          {
            "q": "What is the purpose of a validation set in ML training?",
            "options": [
              "To clean and normalize raw training data before it enters the model's first epoch of supervised training",
              "To monitor a deployed model's accuracy over time and detect data drift between training and production",
              "To tune hyperparameters and prevent overfitting during training without touching the test set",
              "To evaluate the final model's accuracy on data it has never seen before deployment to production endpoints"
            ],
            "answer": 2,
            "exp": "The validation set is used during training to tune hyperparameters and make decisions — keeping the test set truly unseen for final evaluation."
          },
          {
            "q": "What is transfer learning?",
            "options": [
              "Training a brand new model from random weights using a very large general-purpose dataset of input examples",
              "Augmenting the training dataset with synthetic examples to balance underrepresented classes in the labels",
              "Using a pre-trained model as a starting point and fine-tuning it for a new task",
              "Moving training data from one AWS region to another to comply with data residency requirements"
            ],
            "answer": 2,
            "exp": "Transfer learning uses knowledge from a model trained on one task to improve learning on a related task. Massive time and compute savings."
          },
          {
            "q": "What is a confusion matrix used for?",
            "options": [
              "To document the hyperparameter settings and model architecture chosen for a given training run on a dataset",
              "To track training loss and validation accuracy at each epoch during the model fitting process automatically",
              "To visualize the performance of a classification model showing true/false positives and negatives",
              "To visualize feature importance scores across the inputs the model relies on most when making predictions"
            ],
            "answer": 2,
            "exp": "Confusion matrices show where a classification model gets confused — which classes it correctly identifies vs mislabels. Essential for model evaluation."
          },
          {
            "q": "What does 'training a model' mean?",
            "options": [
              "Adjusting model parameters by exposing it to data so it learns to minimize prediction errors",
              "Cleaning, normalizing, and labeling raw input data so it's ready to feed into the training loop on a GPU",
              "Deploying the trained model to a managed endpoint where it serves inference requests at production scale",
              "Selecting which input features the model should use and dropping the features that hurt prediction accuracy"
            ],
            "answer": 0,
            "exp": "Training = running data through the model repeatedly, adjusting weights to minimize error (loss) using optimization algorithms like gradient descent."
          },
          {
            "q": "What is a hyperparameter in machine learning?",
            "options": [
              "An internal model weight that the optimizer adjusts during training based on the gradient of the loss",
              "A configuration setting set before training that controls the learning process (not learned from data)",
              "A model parameter that gets updated automatically as the model processes more training examples per epoch",
              "A feature value that is normalized to a standard range before being fed into the model for training"
            ],
            "answer": 1,
            "exp": "Hyperparameters are set by humans before training — learning rate, number of layers, batch size. Unlike model parameters (weights), they aren't learned from data."
          },
          {
            "q": "What is the primary goal of feature engineering?",
            "options": [
              "To create, transform, and select input variables that improve model performance",
              "To label raw training data through a workforce using SageMaker Ground Truth or a third-party labeling team",
              "To deploy trained models to SageMaker endpoints and configure their auto-scaling behavior in production",
              "To version control trained model artifacts and track lineage from training data to deployed endpoints"
            ],
            "answer": 0,
            "exp": "Feature engineering transforms raw data into better inputs for models — creating new features, normalizing values, handling missing data to improve accuracy."
          }
        ]
      },
      {
        "id": "ai2",
        "name": "Fundamentals of Generative AI",
        "questions": [
          {
            "q": "What is Generative AI?",
            "options": [
              "AI that automatically generates training data labels by clustering unlabeled examples into similar groups",
              "AI that operates without training data by relying entirely on hand-coded rules and decision trees instead",
              "AI that only classifies existing content into predefined categories like spam, sentiment, or topic labels",
              "AI that can create new content — text, images, code, audio — that didn't exist before"
            ],
            "answer": 3,
            "exp": "Generative AI creates new content. LLMs generate text. Diffusion models generate images. It's a paradigm shift from AI that only classifies to AI that creates."
          },
          {
            "q": "What is a foundation model?",
            "options": [
              "An ensemble of decision trees specialized in tabular data prediction tasks like fraud detection and scoring",
              "A model trained only on synthetic data generated by other AI models rather than real-world examples",
              "A large model trained on broad data that can be adapted to many downstream tasks",
              "A small fine-tuned model designed for one narrow downstream task like sentiment analysis on product reviews"
            ],
            "answer": 2,
            "exp": "Foundation models (like Claude, GPT-4, Titan) are trained on massive datasets and serve as a base for many downstream applications through fine-tuning or prompting."
          },
          {
            "q": "What is a prompt in the context of generative AI?",
            "options": [
              "A model training technique that gives the optimizer hints about which examples are most important",
              "A pre-deployment configuration step that sets the model's temperature and top-p sampling parameters",
              "The input text or instruction given to a generative AI model to guide its output",
              "An automated test that validates a model's output meets a defined schema before reaching the user"
            ],
            "answer": 2,
            "exp": "A prompt is the instruction you give the model — the better and clearer your prompt, the better the output. Prompt engineering is a critical skill."
          },
          {
            "q": "What is prompt engineering?",
            "options": [
              "The practice of designing effective inputs to guide AI models to produce desired outputs",
              "The discipline of designing the hardware infrastructure that hosts a generative AI model at scale",
              "A model training step that adjusts model weights based on user feedback collected after deployment",
              "Engineering the underlying transformer architecture that powers an LLM's attention mechanism layers"
            ],
            "answer": 0,
            "exp": "Prompt engineering is crafting inputs to get the best outputs from AI. Techniques include few-shot examples, chain-of-thought, role assignment, and clear instructions."
          },
          {
            "q": "What does 'hallucination' mean in the context of LLMs?",
            "options": [
              "When an AI model returns the same response repeatedly because of low temperature and deterministic output",
              "When an AI model fails to respond within the configured timeout window during high inference load",
              "When an AI model consumes more tokens than the user expected and runs up an unexpectedly large bill",
              "When an AI model generates confident but factually incorrect or fabricated information"
            ],
            "answer": 3,
            "exp": "Hallucinations occur when AI models generate plausible-sounding but false information. Critical to verify AI outputs for factual accuracy, especially in high-stakes contexts."
          },
          {
            "q": "What is Retrieval-Augmented Generation (RAG)?",
            "options": [
              "A technique that fine-tunes a foundation model on a customer's documents to embed knowledge into weights",
              "A technique that supplements AI responses by retrieving relevant documents from a knowledge base before generating",
              "A pattern where a model is trained from scratch on the customer's private knowledge base for accuracy",
              "A method that compresses a foundation model so it can run on edge devices without cloud connectivity"
            ],
            "answer": 1,
            "exp": "RAG connects an LLM to external knowledge sources — retrieve relevant docs, give them to the model as context, get more accurate and current responses."
          },
          {
            "q": "What is a token in the context of LLMs?",
            "options": [
              "A unit of text (roughly a word or word piece) that LLMs process — models have token limits per request",
              "A user authentication credential used to sign API requests to Amazon Bedrock from a customer application",
              "A trained model weight value that gets updated during each backpropagation step in the training loop",
              "A pricing unit used by Amazon Bedrock to bill customers based on the number of API calls per month"
            ],
            "answer": 0,
            "exp": "Tokens are how LLMs process text — roughly 1 token per ~4 characters. Context window = max tokens the model can process at once. Token count affects cost."
          },
          {
            "q": "What is fine-tuning in generative AI?",
            "options": [
              "Adjusting model output formatting through prompt instructions rather than retraining the model weights",
              "Optimizing model inference speed by caching common prompt prefixes and reusing them across requests",
              "Reducing a foundation model's size through quantization so it can run on smaller and cheaper hardware",
              "Further training a pre-trained model on a specific dataset to improve performance on a particular task"
            ],
            "answer": 3,
            "exp": "Fine-tuning takes a foundation model and trains it further on domain-specific data — a customer service bot trained on your company's FAQs and policies."
          },
          {
            "q": "What is Amazon Bedrock?",
            "options": [
              "An AWS service for deploying open-source foundation models on EC2 GPU instances with managed scaling",
              "An AWS storage service that backs up large foundation model checkpoints for long-term archival access",
              "A fully managed AWS service providing access to foundation models from leading AI companies via API",
              "An AWS database service optimized for storing and querying vector embeddings used by generative AI apps"
            ],
            "answer": 2,
            "exp": "Amazon Bedrock gives you API access to foundation models (Anthropic Claude, Amazon Titan, Meta Llama, Stability AI) without managing ML infrastructure."
          },
          {
            "q": "What is temperature in the context of generative AI models?",
            "options": [
              "A model setting that controls how many tokens the model can generate per request before stopping the output text stream",
              "A pricing tier in Amazon Bedrock that determines throughput and the maximum number of requests per second per region",
              "A parameter controlling the randomness/creativity of model outputs — higher temperature = more creative, lower = more deterministic",
              "A configuration option that selects which foundation model version to invoke when calling Bedrock APIs from Lambda"
            ],
            "answer": 2,
            "exp": "Temperature controls output randomness. Low temperature (0.1) = consistent, predictable responses. High temperature (0.9) = more creative and varied. Choose based on use case."
          },
          {
            "q": "What is a context window in an LLM?",
            "options": [
              "The maximum amount of text (tokens) the model can process at one time — both input and output",
              "A managed dashboard in Amazon Bedrock that visualizes prompt and completion token consumption per user",
              "A configuration setting that limits the total monthly token spend a customer can incur on Bedrock APIs",
              "An optional feature in Amazon Bedrock that pre-warms model endpoints to reduce cold-start latency"
            ],
            "answer": 0,
            "exp": "Context window = maximum tokens processed in one request. Larger windows (200K+ tokens) let models handle longer documents, conversations, and complex tasks."
          },
          {
            "q": "What is zero-shot prompting?",
            "options": [
              "A prompt strategy where the model is given system instructions but the user message field is left empty",
              "Asking the model to perform a task and providing exactly one labeled example to guide its output style",
              "Sending a prompt that asks the model to first reason through the problem step by step before giving an answer",
              "Asking an AI model to perform a task without providing any examples — relying on knowledge from training"
            ],
            "answer": 3,
            "exp": "Zero-shot = ask the model to do something without examples. 'Summarize this document.' Works well for tasks models were trained on extensively."
          },
          {
            "q": "What is few-shot prompting?",
            "options": [
              "A training technique where a foundation model is fine-tuned using only a handful of labeled training examples",
              "Providing a small number of examples in the prompt to guide the model's response format or style",
              "Sending a prompt that asks the model to chain together a sequence of tool calls before generating a reply",
              "Asking the model to perform a task while giving it zero examples and relying on its pre-training knowledge"
            ],
            "answer": 1,
            "exp": "Few-shot = provide 2-5 examples of the desired input-output pattern before your actual request. Dramatically improves consistency and format adherence."
          },
          {
            "q": "What is Amazon Q?",
            "options": [
              "AWS's generative AI-powered assistant for business — answers questions, generates code, and summarizes information from your connected data sources",
              "AWS's managed Kubernetes service optimized for hosting containerized generative AI inference workloads at scale",
              "AWS's open-source vector database for storing embeddings used in semantic search and document retrieval pipelines",
              "AWS's pre-built recommendation engine that suggests products to retail customers based on their browsing history and purchase patterns"
            ],
            "answer": 0,
            "exp": "Amazon Q is AWS's generative AI assistant — Q Business for enterprise knowledge bases, Q Developer for coding assistance. Think of it as a Claude/Copilot for AWS users."
          },
          {
            "q": "What is a system prompt in generative AI?",
            "options": [
              "A prompt embedded directly in the model weights at training time so it applies to every user request",
              "A prompt template that AWS Bedrock automatically prepends to every API call to enforce safety guardrails",
              "A prompt that contains only example input-output pairs and no actual task request from the human user",
              "Instructions provided to an AI model before the user interaction that define its persona, behavior, and constraints"
            ],
            "answer": 3,
            "exp": "System prompts set the AI's behavior, persona, and rules before the conversation starts. 'You are a helpful IT support agent for RichOffTech. Be concise and direct.'"
          },
          {
            "q": "What is model grounding?",
            "options": [
              "Pinning a foundation model to a specific version so prompt outputs remain stable across model updates",
              "Limiting a foundation model's output to a specific JSON schema so downstream systems can parse it reliably",
              "Connecting AI model responses to verifiable, factual information sources to reduce hallucinations",
              "Configuring a foundation model to run only inside a customer's VPC with no public internet egress allowed"
            ],
            "answer": 2,
            "exp": "Grounding connects model responses to trusted data sources — RAG is a grounding technique. Reduces hallucinations by anchoring responses in retrieved facts."
          },
          {
            "q": "What is the difference between generative AI and traditional ML?",
            "options": [
              "Traditional ML uses pre-built AWS services; Generative AI requires building custom models from scratch",
              "Traditional ML requires manual feature engineering; Generative AI requires no training data at all to use",
              "Traditional ML predicts/classifies based on patterns; Generative AI creates new content",
              "Traditional ML always runs in the cloud; Generative AI runs only on edge devices with local hardware"
            ],
            "answer": 2,
            "exp": "Traditional ML: classify email as spam or not, predict house price. Generative AI: write an email, generate an image, produce code. Creation vs classification."
          },
          {
            "q": "What is Amazon Titan?",
            "options": [
              "Amazon's own family of foundation models available in Amazon Bedrock",
              "Amazon's open-source large language model released to compete with Meta's Llama and Mistral models",
              "Amazon's pre-built service for translating text between languages using foundation models in real time",
              "Amazon's content moderation service that filters generative AI outputs before reaching end users"
            ],
            "answer": 0,
            "exp": "Amazon Titan is AWS's own family of foundation models — Titan Text for language tasks, Titan Embeddings for semantic search, Titan Image for image generation."
          },
          {
            "q": "What is an embedding in AI?",
            "options": [
              "A configuration object describing how a foundation model should be invoked through the Bedrock API",
              "A compressed version of the model's weights that allows the foundation model to run on smaller hardware",
              "A cached prompt-and-completion pair that Amazon Bedrock reuses to reduce inference cost for repeats",
              "A numerical vector representation of text or data that captures semantic meaning for AI processing"
            ],
            "answer": 3,
            "exp": "Embeddings convert text into vectors of numbers that capture meaning — 'king' and 'queen' are closer in embedding space than 'king' and 'pizza.' Power semantic search."
          },
          {
            "q": "What is the primary risk of using generative AI for critical decisions?",
            "options": [
              "Generative AI cannot be deployed to AWS infrastructure due to its requirement for specialized hardware",
              "Hallucinations and lack of transparency can lead to decisions based on inaccurate AI-generated information",
              "Generative AI models always return responses too slowly to be useful in real customer-facing live applications",
              "Generative AI models always cost more than traditional machine learning models to operate in production"
            ],
            "answer": 1,
            "exp": "Hallucinations are the #1 risk — confident, plausible-sounding wrong answers. Always verify AI outputs, especially for medical, legal, financial, or safety decisions."
          }
        ]
      },
      {
        "id": "ai3",
        "name": "Applications of Foundation Models",
        "questions": [
          {
            "q": "What is an AI agent in the context of foundation models?",
            "options": [
              "An AI system that can perceive its environment, make decisions, and take actions to achieve goals — including using tools",
              "A pre-built AI workflow template available in SageMaker JumpStart for common enterprise use cases like chat",
              "A foundation model fine-tuned by AWS specifically for use inside Amazon's own internal business workflows",
              "A managed AWS service that schedules training jobs across a fleet of GPU instances during off-peak hours"
            ],
            "answer": 0,
            "exp": "AI agents use foundation models as a reasoning engine and can take actions — browse the web, run code, call APIs, manage files. This is the direction AI is rapidly moving."
          },
          {
            "q": "What is Amazon Bedrock Agents used for?",
            "options": [
              "A managed service for monitoring deployed Bedrock model endpoints and alerting on inference latency spikes",
              "A pre-built AI agent that handles AWS billing inquiries on behalf of customers through a chat interface",
              "Building AI agents that can orchestrate multi-step tasks and call APIs or data sources to complete complex goals",
              "A SageMaker feature that automates the deployment of trained ML models to production scoring endpoints"
            ],
            "answer": 2,
            "exp": "Bedrock Agents lets you build AI agents that break down complex tasks, reason through steps, and take actions like calling APIs and querying knowledge bases — all managed by AWS."
          },
          {
            "q": "What is a knowledge base in the context of Amazon Bedrock?",
            "options": [
              "An AWS service for caching frequently requested foundation model completions to reduce overall token costs",
              "A read-replica of an Amazon RDS instance dedicated to serving high-volume foundation model queries at scale",
              "A managed store of documents that Bedrock can retrieve from to provide grounded, accurate responses (RAG implementation)",
              "A SageMaker feature for storing trained model artifacts so they can be versioned and reproduced across training runs"
            ],
            "answer": 2,
            "exp": "Bedrock Knowledge Bases manage the RAG pipeline for you — ingest documents, create embeddings, store in a vector database, retrieve automatically at inference time."
          },
          {
            "q": "What is semantic search?",
            "options": [
              "A search technique that combines exact keyword matching with traditional SQL filters and sort clauses",
              "A method for searching across multiple S3 buckets using natural language queries through the AWS Console",
              "Search that understands the meaning and intent behind queries, not just exact keywords",
              "A managed search service that indexes structured data in DynamoDB using ML-powered relevance scoring"
            ],
            "answer": 2,
            "exp": "Semantic search uses embeddings to find conceptually similar content even when exact keywords don't match. 'How do I reset my login?' finds 'password recovery instructions.'"
          },
          {
            "q": "What is a vector database and why is it used in AI applications?",
            "options": [
              "A database optimized for storing and searching embedding vectors to enable semantic similarity search",
              "A database that stores only the metadata of training datasets such as schema, row counts, and lineage",
              "A specialized database that indexes graph relationships between training data points and model predictions",
              "A type of NoSQL database that natively supports streaming inference requests from generative AI models"
            ],
            "answer": 0,
            "exp": "Vector databases store embeddings and enable fast similarity search — 'find the 5 documents most semantically similar to this query.' Amazon OpenSearch Service, pgvector."
          },
          {
            "q": "What is a multi-modal AI model?",
            "options": [
              "A model that supports being invoked through several different programming language SDKs by client applications",
              "A model that has been deployed to multiple AWS regions for multi-region failover during outage events",
              "A model architecture that uses multiple encoder layers stacked deeply to improve language understanding",
              "A model that can process and generate multiple types of data — text, images, audio, video"
            ],
            "answer": 3,
            "exp": "Multi-modal models handle multiple data types — Claude can process text and images. Multi-modal is the direction all frontier AI models are moving."
          },
          {
            "q": "What is code generation in the context of generative AI?",
            "options": [
              "Automatically generating production-ready deployment manifests for containerized applications on Kubernetes",
              "Using AI models to automatically write, complete, explain, or debug code from natural language descriptions",
              "Using AI to convert spoken developer commands into terminal shell scripts that run on the local machine",
              "Using AI models to automatically scan source code for security vulnerabilities and unsafe coding patterns"
            ],
            "answer": 1,
            "exp": "Code generation lets developers describe what they want in plain English and get working code back. Amazon CodeWhisperer and GitHub Copilot are prime examples."
          },
          {
            "q": "What is Amazon CodeWhisperer?",
            "options": [
              "An AI-powered coding companion that generates code suggestions in real-time within your IDE",
              "An AWS continuous integration service that builds, tests, and deploys code changes from a Git repository",
              "An AWS service that automatically formats code according to language style guides and team conventions",
              "A standalone AWS code review service that comments on pull requests using rule-based static analysis"
            ],
            "answer": 0,
            "exp": "CodeWhisperer (now part of Amazon Q Developer) provides real-time AI code suggestions, security scanning, and code completion — trained on Amazon's codebase and open source."
          },
          {
            "q": "What is summarization as an AI capability?",
            "options": [
              "Using AI to automatically translate long technical documents into a target language for global audiences",
              "Using AI to classify documents by topic so they can be routed to the right team or queue for handling",
              "Using AI to condense long documents, articles, or conversations into shorter key points",
              "Using AI to flag confidential or sensitive content in documents before they get shared externally by users"
            ],
            "answer": 2,
            "exp": "Summarization extracts key information from long content. Meeting transcripts → action items. Research papers → key findings. Legal documents → plain English summary."
          },
          {
            "q": "What is sentiment analysis?",
            "options": [
              "Identifying the primary language a document is written in so it can be routed to the right translator",
              "Detecting personally identifiable information such as names, addresses, and account numbers within text",
              "Extracting key phrases and named entities like organization and location from unstructured customer text",
              "Using AI to determine the emotional tone or opinion expressed in text (positive, negative, neutral)"
            ],
            "answer": 3,
            "exp": "Sentiment analysis classifies text emotion — customer reviews, social media mentions, support tickets. Helps businesses understand how customers feel at scale."
          },
          {
            "q": "What is a chatbot powered by a foundation model?",
            "options": [
              "An email auto-reply system that sends a templated response when a customer service inbox is unattended",
              "A conversational AI that uses an LLM to understand context and generate human-like responses",
              "A scripted interactive voice response system that routes phone callers based on numeric keypad input",
              "A pre-built form on a website that collects structured information through fields and submit buttons"
            ],
            "answer": 1,
            "exp": "LLM-powered chatbots understand context across conversation turns and generate natural responses vs scripted rule-based bots. Night and day difference in capability."
          },
          {
            "q": "What is document extraction in AI applications?",
            "options": [
              "Using AI to automatically identify and extract specific information from documents — names, dates, amounts",
              "Generating new documents from scratch using a foundation model based on natural language descriptions",
              "Archiving rarely accessed documents to lower-cost S3 storage tiers using lifecycle policies on each bucket",
              "Storing documents in a structured database after extracting them from a legacy filesystem location"
            ],
            "answer": 0,
            "exp": "Document extraction automates pulling structured data from unstructured documents — invoices, contracts, forms. Amazon Textract is AWS's service for this."
          },
          {
            "q": "What is Amazon Textract?",
            "options": [
              "An AWS service for translating documents between languages while preserving original formatting and layout",
              "An AWS storage service optimized for long-term archival of large text and document collections at low cost",
              "An AWS service for transcribing recorded meetings into searchable text with speaker labels automatically",
              "An AWS service that uses ML to automatically extract text, forms, and tables from documents"
            ],
            "answer": 3,
            "exp": "Amazon Textract extracts text and data from scanned documents, PDFs, and images — goes beyond OCR to understand form structure, tables, and key-value pairs."
          },
          {
            "q": "What is translation in the context of AI services?",
            "options": [
              "Detecting the source language of a document so it can be routed to the right downstream processing flow",
              "AI-powered conversion of text from one language to another while preserving meaning",
              "Encrypting sensitive text so it can be transferred between AWS regions without exposing the underlying data",
              "Converting documents between formats such as DOCX to PDF while preserving the original layout and fonts"
            ],
            "answer": 1,
            "exp": "AI translation converts text between languages at scale. Amazon Translate uses deep learning for accurate, natural-sounding translation across dozens of language pairs."
          },
          {
            "q": "What is Amazon Rekognition?",
            "options": [
              "An AWS service for image and video analysis — object detection, facial recognition, content moderation",
              "An AWS service for creating photorealistic images from text descriptions using generative diffusion models",
              "An AWS service that converts speech in audio files to text transcripts with speaker identification labels",
              "An AWS service for storing and managing large image collections with automatic tagging and rich metadata"
            ],
            "answer": 0,
            "exp": "Amazon Rekognition analyzes images and video — identify objects, detect faces, recognize celebrities, moderate content, read text in images. No ML expertise required."
          },
          {
            "q": "What is Amazon Comprehend?",
            "options": [
              "An AWS service for translating text between languages using neural machine translation under the hood",
              "An AWS document storage service that indexes uploaded files for keyword search across the organization",
              "An AWS NLP service for extracting insights from text — sentiment, entities, key phrases, language detection",
              "An AWS service for monitoring the comprehension level and reading difficulty of customer marketing content drafts"
            ],
            "answer": 2,
            "exp": "Amazon Comprehend uses NLP to analyze text — detect sentiment, identify entities (people, places, organizations), extract key phrases. No ML expertise required."
          },
          {
            "q": "What is the purpose of Amazon Polly?",
            "options": [
              "An AWS service for converting spoken audio into searchable text transcripts with speaker diarization",
              "An AWS service that automatically generates marketing copy from product attributes and brand guidelines",
              "An AWS service that scans audio recordings for offensive or sensitive content before they get distributed",
              "An AWS service that converts text to lifelike speech using deep learning"
            ],
            "answer": 3,
            "exp": "Amazon Polly converts text to natural-sounding speech. Used for accessibility features, voice interfaces, audiobook generation, and contact center voice prompts."
          },
          {
            "q": "What is Amazon Transcribe?",
            "options": [
              "An AWS service for indexing audio files for keyword search",
              "An AWS service that automatically converts speech to text",
              "An AWS service for storing meeting recordings cheaply",
              "An AWS service that translates spoken audio between languages"
            ],
            "answer": 1,
            "exp": "Amazon Transcribe converts audio and video speech to text — meeting transcriptions, call center analytics, subtitle generation. Supports many languages and custom vocabulary."
          },
          {
            "q": "What is Amazon Lex?",
            "options": [
              "An AWS service for building conversational chatbots and voice interfaces using the same technology as Alexa",
              "An AWS service for analyzing the lexical complexity and reading level of customer-facing written content",
              "An AWS service for extracting entities and key phrases from text documents using pre-trained NLP models from AWS",
              "An AWS service for translating customer support tickets between languages using neural machine translation"
            ],
            "answer": 0,
            "exp": "Amazon Lex builds conversational interfaces — chatbots and voice bots. Powers Alexa's conversational AI. Integrates with Lambda, Connect, and other AWS services."
          },
          {
            "q": "What is the primary use case for Amazon Kendra?",
            "options": [
              "A managed analytics service that runs natural language queries against data warehouses stored in customer accounts",
              "An intelligent enterprise search service powered by ML that searches across multiple content repositories",
              "A search service for code repositories powered by ML and natural language understanding of intent",
              "A search service for retrieving structured records from databases using natural language input queries"
            ],
            "answer": 1,
            "exp": "Amazon Kendra uses ML to power intelligent search across your content — SharePoint, S3, databases. Understands questions and returns precise answers, not just links."
          }
        ]
      },
      {
        "id": "ai4",
        "name": "Guidelines for Responsible AI",
        "questions": [
          {
            "q": "What is bias in AI models?",
            "options": [
              "A configuration parameter that controls how confident the model needs to be before returning a prediction to the caller",
              "Systematic errors or prejudices in AI outputs that unfairly advantage or disadvantage certain groups, often reflecting biases in training data",
              "A type of prompt injection attack where malicious input steers the model toward generating biased or offensive output for the user",
              "A latency issue where the model takes longer than expected to return predictions in production environments"
            ],
            "answer": 1,
            "exp": "AI bias occurs when models reflect and amplify biases in training data. A hiring model trained on historical data may discriminate against women if the data reflected historical discrimination."
          },
          {
            "q": "What is the purpose of AI explainability?",
            "options": [
              "To package AI models into reusable containers that can be shared across teams and deployment environments",
              "To compress AI models into smaller forms that run on edge devices without sacrificing accuracy on tasks",
              "To make AI decision-making processes understandable to humans — why did the model make this prediction?",
              "To translate AI-generated content between languages so it can be understood by global audiences worldwide"
            ],
            "answer": 2,
            "exp": "Explainability (or interpretability) lets humans understand why an AI made a decision. Critical for high-stakes applications like loan approvals, medical diagnoses, and legal decisions."
          },
          {
            "q": "What is responsible AI?",
            "options": [
              "The process of training AI models faster by parallelizing the workload across multiple GPU instances",
              "An AWS framework for monitoring AI model costs and rightsizing compute capacity to control monthly spend",
              "The development and deployment of AI systems that are fair, transparent, accountable, safe, and respect human rights",
              "A set of automated tests that validate AI model performance before deployment to production endpoints"
            ],
            "answer": 2,
            "exp": "Responsible AI ensures AI systems are developed and used ethically — considering fairness, transparency, safety, privacy, and societal impact throughout the AI lifecycle."
          },
          {
            "q": "Which AWS service helps detect bias in ML models?",
            "options": [
              "Amazon Macie",
              "Amazon SageMaker Model Monitor",
              "Amazon Inspector",
              "Amazon SageMaker Clarify"
            ],
            "answer": 3,
            "exp": "Amazon SageMaker Clarify provides bias detection and explainability for ML models — identifying where models may be biased and explaining individual predictions."
          },
          {
            "q": "What is data privacy in the context of AI?",
            "options": [
              "Allowing only authenticated users to query a foundation model deployed on a private SageMaker endpoint behind a VPC",
              "Protecting personal information used in AI training and inference — ensuring data is collected, stored, and used appropriately and legally",
              "Storing only the model weights and discarding the original training data after model training completes successfully",
              "Restricting the input modalities a foundation model accepts to text-only to reduce the attack surface area available to users"
            ],
            "answer": 1,
            "exp": "AI data privacy ensures personal data used in training and inference complies with regulations (GDPR, CCPA), is minimized, and individuals' rights are respected."
          },
          {
            "q": "What is model transparency?",
            "options": [
              "The degree to which an AI model's structure, training data, and decision-making process can be understood and examined",
              "How quickly an AI model can be redeployed after the training data or hyperparameters are updated by the team",
              "The percentage of training data that came from publicly available sources versus customer-owned private data sources",
              "How clearly an AI model's API responses are formatted as structured JSON for downstream consumption by client applications"
            ],
            "answer": 0,
            "exp": "Transparency means stakeholders can understand how an AI model works, what data trained it, and how it makes decisions — essential for trust and accountability."
          },
          {
            "q": "What is the risk of over-relying on AI for decision-making?",
            "options": [
              "AI models require constant retraining on new data which can introduce inconsistency across decision rounds and lead to model drift",
              "AI may perpetuate biases, make errors, or fail in edge cases — human oversight ensures accountability for high-stakes decisions",
              "AI is too computationally expensive to deploy at scale across all critical business decision workflows in real time",
              "AI models cannot be deployed inside a customer's VPC and always require sending data to a public endpoint for inference"
            ],
            "answer": 1,
            "exp": "Over-reliance on AI without human oversight risks automated discrimination, accountability gaps, and dangerous failures in critical domains. Human judgment remains essential."
          },
          {
            "q": "What is the AWS Shared Responsibility Model in the context of AI?",
            "options": [
              "AWS handles model training and selection of foundation models; customers handle only the deployment step and the cost of inference requests",
              "Customers and AWS share equal responsibility for all aspects of model security, training data quality, and downstream application handling",
              "Customers are responsible for the underlying AWS infrastructure; AWS is responsible only for the data layer and any encryption applied to it",
              "AWS is responsible for the security of the cloud infrastructure; customers are responsible for their data, models, and applications built on top"
            ],
            "answer": 3,
            "exp": "In AI: AWS secures the underlying infrastructure (Bedrock, SageMaker). You are responsible for your training data, model outputs, prompt safety, and application security."
          },
          {
            "q": "What is content moderation in AI applications?",
            "options": [
              "Using AI to extract specific data fields like names and addresses from uploaded document images at scale",
              "Using AI to automatically generate alternative phrasings of marketing copy to test which version performs best",
              "Using AI to automatically detect and filter inappropriate, harmful, or policy-violating content",
              "Using AI to compress large media files such as images and videos before they get uploaded to S3 storage"
            ],
            "answer": 2,
            "exp": "Content moderation uses AI to detect harmful content — hate speech, violence, explicit material — at scale. Amazon Rekognition provides automated content moderation."
          },
          {
            "q": "What is the purpose of model monitoring in production?",
            "options": [
              "To automatically retrain the model on a fresh data batch every hour regardless of any performance metrics",
              "To audit which users invoked a deployed model and log every prompt-and-completion pair to CloudWatch Logs",
              "To track model performance over time, detect data drift, and identify when models need retraining",
              "To deploy the model to multiple AWS regions for redundancy and route inference traffic based on user location"
            ],
            "answer": 2,
            "exp": "Model monitoring detects when real-world data distribution shifts from training data (data drift), causing performance degradation. Catch it early before it causes business impact."
          },
          {
            "q": "What is data minimization in responsible AI?",
            "options": [
              "Limiting the number of features in the training dataset to only the most predictive input variables",
              "Compressing the size of trained models so they consume less memory when deployed to inference endpoints",
              "Using the smallest possible foundation model that meets accuracy requirements to reduce inference token costs",
              "Collecting and using only the minimum amount of personal data necessary for the AI system to function"
            ],
            "answer": 3,
            "exp": "Data minimization limits data collection to only what's needed — a privacy principle embedded in GDPR and other regulations. Reduces risk from breaches and misuse."
          },
          {
            "q": "What is the purpose of AI governance?",
            "options": [
              "A managed dashboard in Amazon Bedrock that lets administrators set per-user token limits and budget alarms with reports",
              "Policies, processes, and controls ensuring AI systems are developed and used responsibly, ethically, and in compliance with regulations",
              "A SageMaker feature that catalogs deployed model endpoints and tracks their accuracy and latency metrics over time",
              "A pre-built AWS service that automates compliance reporting for AI workloads against HIPAA, FedRAMP, and other frameworks"
            ],
            "answer": 1,
            "exp": "AI governance establishes the rules, accountability structures, and oversight mechanisms for responsible AI development and deployment across an organization."
          },
          {
            "q": "What is fairness in AI?",
            "options": [
              "The property of AI systems treating all individuals and groups equitably, without unjust discrimination based on protected characteristics",
              "The property of an AI system providing the same response latency to all users regardless of their geography or load",
              "Ensuring all members of an organization have equal access to AI tools and the same usage quota every billing cycle",
              "An AI model performance metric measuring the gap between training accuracy and real-world test accuracy in production deployment environments"
            ],
            "answer": 0,
            "exp": "AI fairness means the system doesn't systematically disadvantage people based on race, gender, age, or other protected characteristics. Fairness metrics measure this quantitatively."
          },
          {
            "q": "What is the role of human oversight in AI systems?",
            "options": [
              "Humans focus entirely on technical configuration; business users are not involved in oversight of AI outputs",
              "Humans review, validate, and maintain accountability for AI-assisted decisions, especially in high-stakes contexts",
              "Humans configure the AI infrastructure but should not interfere with the model's autonomous decision-making",
              "Humans approve only the initial deployment of an AI model; after that the model should operate fully autonomously in production"
            ],
            "answer": 1,
            "exp": "Human oversight ensures accountability — AI augments human judgment, it doesn't replace it for consequential decisions. Establish clear processes for when humans must review AI outputs."
          },
          {
            "q": "What is adversarial attack in AI?",
            "options": [
              "A training technique that exposes a model to adversarial examples to make it more robust against malicious inputs at inference time",
              "A coordinated effort by competitors to release similar AI models that erode a company's competitive advantage in the market",
              "A distributed denial-of-service attack that targets AI model API endpoints with excessive inference requests per second",
              "Deliberate manipulation of AI inputs designed to cause the model to make incorrect predictions or reveal sensitive information"
            ],
            "answer": 3,
            "exp": "Adversarial attacks exploit AI vulnerabilities — adding imperceptible noise to images fools image classifiers, or crafted prompts bypass AI safety filters (prompt injection)."
          },
          {
            "q": "What is the purpose of red teaming in AI safety?",
            "options": [
              "A code review practice where a second engineer must approve all changes to a model's training pipeline code",
              "A managed AWS security service that scans AI workloads for vulnerabilities such as unpatched dependencies",
              "Proactively testing AI systems by attempting to find failure modes, biases, and vulnerabilities before deployment",
              "A formal process where engineers wear red badges during the development phase of high-stakes AI projects"
            ],
            "answer": 2,
            "exp": "AI red teaming simulates adversarial use — trying to make the model produce harmful outputs, bypass safety measures, or behave unexpectedly. Finds problems before users do."
          },
          {
            "q": "What is consent in the context of AI data collection?",
            "options": [
              "A legal agreement between AWS and customers governing how foundation models may be invoked through APIs",
              "A user authentication step that confirms a person's identity before they can access an AI-powered app",
              "Individuals' informed agreement to have their data collected and used for specific AI purposes, including training",
              "Encrypting personal data before it gets sent to a foundation model so the model provider cannot read it"
            ],
            "answer": 2,
            "exp": "Consent means people knowingly agree to how their data is used. Using data without consent for AI training raises serious ethical and legal issues (GDPR violations)."
          },
          {
            "q": "What does the EU AI Act classify as 'high-risk' AI systems?",
            "options": [
              "AI systems trained on personal data collected from European Union residents regardless of the model's specific use case or deployment region",
              "AI systems that exceed a defined parameter count threshold regardless of how the system is actually used in production environments",
              "AI systems that are deployed in production customer-facing environments rather than research or testing environments inside a company",
              "AI systems used in critical infrastructure, employment decisions, education, law enforcement, and other areas with significant impact on people's lives"
            ],
            "answer": 3,
            "exp": "The EU AI Act (2024) classifies AI as high-risk when used in recruitment, credit scoring, law enforcement, education, healthcare, critical infrastructure — requiring strict oversight."
          },
          {
            "q": "What is AI safety?",
            "options": [
              "A foundation model's ability to refuse to answer prompts that contain personally identifiable information",
              "Ensuring AI systems behave as intended, don't cause unintended harm, and remain aligned with human values and goals",
              "A type of red-team exercise where security engineers attempt to extract training data from a deployed model",
              "A managed AWS service that scans customer AI workloads for misconfigurations and exposed model endpoints"
            ],
            "answer": 1,
            "exp": "AI safety research ensures AI systems remain aligned with human intentions, don't develop harmful behaviors, and can be controlled and corrected by humans."
          },
          {
            "q": "What is the purpose of model cards in responsible AI?",
            "options": [
              "Standardized documentation describing a model's intended uses, limitations, training data, performance metrics, and ethical considerations",
              "An audit log of every inference request a deployed model has handled along with the customer's user identity and timestamp",
              "A managed AWS service that automatically generates documentation for trained models from training metadata and run logs",
              "A version control system specifically designed for tracking changes to ML model weights across multiple training rounds"
            ],
            "answer": 0,
            "exp": "Model cards provide transparency about AI models — what they do well, where they fail, what biases exist, and appropriate use cases. Enables informed deployment decisions."
          }
        ]
      }
    ]
  }
];

export const LESSONS: Record<string, string> = {
  "sp1": "<h3>📖 WHAT THIS DOMAIN IS ABOUT</h3><p>This is your foundation. Before you can protect anything you need to understand what security actually means. This domain covers the basic rules, concepts, and vocabulary that everything else in cybersecurity is built on. Think of it like learning the rules of the game before you play.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>CIA Triad</strong> — Three rules every security person lives by. Confidentiality = only the right people see the data. Integrity = the data hasn't been tampered with. Availability = the system is up when people need it. Memorize this. It's on every cert exam.</li><li><strong>Authentication</strong> — Proving you are who you say you are. Password = something you know. Badge = something you have. Fingerprint = something you are. Two of those together = MFA. MFA is the move.</li><li><strong>Least Privilege</strong> — Give people only the access they actually need to do their job. Not more. Not less. Your intern doesn't need admin rights. Simple concept, massive impact.</li><li><strong>Encryption</strong> — Scrambling data so only the right person can read it. Symmetric = one key. Asymmetric = two keys (public + private). HTTPS uses both.</li><li><strong>Security Controls</strong> — Preventive controls stop attacks before they happen. Detective controls catch attacks in progress. Corrective controls fix damage after.</li><li><strong>Non-Repudiation</strong> — You can't deny you did something. Digital signatures prove it was you.</li></ul><h3>💼 REAL WORLD</h3><p>On your first cleared IT job someone will ask you about the CIA triad in your interview. Know this cold. MFA is mandatory on most government systems — you'll be setting it up for users on day one.</p>",
  "sp2": "<h3>📖 WHAT THIS DOMAIN IS ABOUT</h3><p>This domain is about knowing what the bad guys do and how to stop them. You need to understand the attacks, the weaknesses they exploit, and what you put in place to shut them down. This is the domain that makes you dangerous — in a good way.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Phishing</strong> — Fake emails, fake websites, fake phone calls designed to trick you into handing over credentials. It's the #1 attack vector in 2026.</li><li><strong>Malware Types</strong> — Virus = attaches to files and spreads. Worm = spreads on its own. Trojan = looks legit but isn't. Ransomware = encrypts your files and demands payment. Know the difference.</li><li><strong>DoS/DDoS</strong> — Flooding a system with so much traffic it can't function. DoS = one attacker. DDoS = thousands of compromised machines hitting at once.</li><li><strong>SQL Injection</strong> — Attacker puts malicious code into a form field and the database executes it. Always validate input.</li><li><strong>Vulnerability vs Exploit</strong> — Vulnerability = the weakness. Exploit = the weapon. Patch management closes vulnerabilities before exploits can use them.</li><li><strong>Social Engineering</strong> — Hacking the human not the computer. Phishing, vishing (phone), smishing (text). Train users — they're always the weakest link.</li></ul><h3>💼 REAL WORLD</h3><p>In a cleared environment you will write incident reports when attacks happen. You need to correctly identify the attack type. Wrong classification = wrong response. Know your attacks cold.</p>",
  "sp3": "<h3>📖 WHAT THIS DOMAIN IS ABOUT</h3><p>This domain is about how you design and build secure systems. Not just reacting to attacks — actually building environments where attacks have a harder time succeeding. This is where you go from technician to engineer.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Zero Trust</strong> — Never trust, always verify. Even if you're inside the network you still have to prove who you are every time. This is the DOD standard now.</li><li><strong>Network Segmentation</strong> — Split the network into zones so if one gets compromised the attacker can't walk everywhere.</li><li><strong>DMZ</strong> — A buffer zone between the internet and your internal network. Public-facing servers go here.</li><li><strong>Firewall vs IDS vs IPS</strong> — Firewall = gatekeeper. IDS = alarm. IPS = bouncer that blocks automatically.</li><li><strong>Cloud Models</strong> — Public = AWS/Azure shared. Private = just your org. Hybrid = both. Federal work uses private and hybrid most.</li><li><strong>Defense in Depth</strong> — Layer your security. If one layer fails the others hold. Never rely on a single control.</li></ul><h3>💼 REAL WORLD</h3><p>Zero Trust is especially important right now — the federal government issued a mandate requiring all agencies to move to Zero Trust. Knowing this puts you ahead of people who've been in the field for years.</p>",
  "sp4": "<h3>📖 WHAT THIS DOMAIN IS ABOUT</h3><p>This is the day-to-day work of security. Monitoring, detecting, responding, investigating. If Domain 3 is building the house, Domain 4 is living in it and making sure nothing goes wrong. This is what most entry-level security roles actually do.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Incident Response</strong> — The playbook for when something goes wrong. Identify → Contain → Eradicate → Recover → Lessons Learned. In that order. Every time.</li><li><strong>SIEM</strong> — Collects logs from everywhere and correlates them to find threats. Splunk, Microsoft Sentinel. Learn one and you're hireable.</li><li><strong>Chain of Custody</strong> — Every piece of evidence must be documented — who touched it, when, and why. Break the chain and the evidence is worthless.</li><li><strong>Threat Hunting</strong> — Don't wait for alerts. Actively go look for attackers who might already be in your network. Assumes breach.</li><li><strong>Vulnerability Management</strong> — Continuously scanning for weaknesses and patching them. It's a cycle not a project.</li><li><strong>EDR</strong> — Software on every device watching for suspicious behavior. CrowdStrike, SentinelOne. Common in cleared environments.</li></ul><h3>💼 REAL WORLD</h3><p>Your first security job will probably be in a SOC. You'll be monitoring a SIEM dashboard, triaging alerts, and writing incident reports. This domain is literally your job description.</p>",
  "sp5": "<h3>📖 WHAT THIS DOMAIN IS ABOUT</h3><p>This domain zooms out. Instead of individual attacks or tools it's about how organizations manage security at the program level — policies, risk, compliance, governance. This is what separates technicians from leaders. And it pays more.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Risk Management</strong> — You can't eliminate all risk. You identify it, measure it, and decide what to do — accept it, mitigate it, transfer it, or avoid it.</li><li><strong>NIST Framework</strong> — The gold standard for federal cybersecurity. Identify, Protect, Detect, Respond, Recover. If you work government contracts you will live in this framework.</li><li><strong>Compliance</strong> — HIPAA = healthcare. PCI DSS = credit cards. FISMA = federal systems. Know which regulation applies to which environment.</li><li><strong>Policies vs Procedures</strong> — Policy = what we do and why. Procedure = exactly how we do it step by step. You need both.</li><li><strong>BCP/DR</strong> — Business Continuity = keep running during a disaster. Disaster Recovery = get systems back online after. RTO = how fast. RPO = how much data loss is acceptable.</li><li><strong>Security Awareness Training</strong> — Teaching employees not to click phishing links. The most cost-effective security control that exists.</li></ul><h3>💼 REAL WORLD</h3><p>As you move up — from analyst to engineer to manager — this domain becomes your world. Start thinking at this level now and you'll outpace your peers fast.</p>",
  "csa1": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>You can't drive the car if you don't know where the steering wheel is. This module is the dashboard tour. Where stuff lives, how to find it fast, how to make it yours.</p><p>People skip this. Then they stay slow forever. The cert exam will ask you to name the parts. The job will test how fast you find them. Both matter.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Application Navigator</strong> — Left sidebar. Your TV remote. Type in the filter box and the menu narrows down live. Every module in ServiceNow is in here somewhere.</li><li><strong>Content Frame</strong> — The big area on the right. Your desk. Lists, forms, dashboards — all the work happens here.</li><li><strong>Banner</strong> — The top bar. Logo, global search, your name, the gear icon. Always visible. Gear = your personal settings (timezone, theme, accessibility).</li><li><strong>Favorites</strong> — Star anything in the Navigator and it pins to the top. Open the same thing 20 times a day? Favorite it. Stop wasting clicks.</li><li><strong>History</strong> — The clock icon at the top of the Navigator. Shows the last records and modules you touched. Saves you when you forgot what you were just on.</li><li><strong>Service Portal</strong> — The pretty side, the public side. Where regular employees come to submit requests, search the knowledge base, browse the catalog. Navigator = IT side. Portal = customer side. Two doors, same building.</li><li><strong>Impersonate User</strong> — Lets admins see ServiceNow exactly as another user sees it. User says \"I can't see this\" — you impersonate them, you see exactly what they see. Stop guessing, start fixing.</li><li><strong>Polaris / Next Experience</strong> — The new look — rounded edges, lighter palette, cleaner type. Same plumbing as the old UI16, different paint job. Some clients still run UI16, so know both names.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Working in one tab. Right-click any record number and pick \"Open in New Tab\" — keep your filtered list, work the record, close the tab. Stop losing your place.</li><li>Trying to fix an access issue without Impersonating. Cool, enjoy your two-hour ACL hunt for something that would've taken 90 seconds.</li><li>Saving a filter as Personal when the team needs it. Now nobody else can see it. Set the visibility BEFORE you save.</li><li>Confusing Navigator and Service Portal. Customers don't live in Navigator. Admins don't live in Portal. Don't tell a user \"go to the Application Navigator\" — they don't have one.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Gear icon (top right) = personal settings</li><li>Hamburger icon (top left) = collapse / expand the sidebar</li><li>Star = Favorite | Clock = History</li><li>Type in the filter navigator = instant fuzzy match across every module</li><li>Right-click record number → \"Open in New Tab\"</li><li>Banner is ALWAYS visible regardless of what you're doing</li><li>Polaris = Next Experience UI (new) | UI16 = older skin</li></ul><h3>💼 REAL WORLD</h3><p>Day one. Manager says \"pull up INC0012345 real quick.\" If you fumble for two minutes that's a bad first impression. Know this system like you know your phone.</p><p>Day fifty. A user opens a ticket: \"I can't see the Knowledge tab.\" You impersonate them, see exactly what's missing, fix the role in 90 seconds, move on. That's senior admin energy. Starts right here.</p>",
  "csa2": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>If forms are records up close, lists are records in a parking lot. You drive past them looking for the one you need. This module teaches you how to find your car fast — filter the lot, sort the rows, group them, export them.</p><p>This is the skill you'll use the most. Cert exam loves the encoded query syntax (the carat ^, ISEMPTY, ORDERBY). The job loves whoever can answer \"how many P1s did the network team have last quarter?\" in 60 seconds without breaking a sweat.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>List View</strong> — A table of records. Rows = records, columns = fields. Like a spreadsheet of your data — you can sort it, filter it, export it.</li><li><strong>Filter Conditions</strong> — Field + Operator + Value. The recipe for \"show me only what I want.\" Stack with AND/OR to get specific.</li><li><strong>Encoded Query</strong> — Your filter, but as a text string. Looks like <code>active=true^priority=1^ORDERBYnumber</code>. The ^ is AND. ^OR is OR. Right-click any breadcrumb to copy the query — paste anywhere to recreate the same filter. Your portable filter.</li><li><strong>ISEMPTY / ISNOTEMPTY</strong> — Operators for \"this field is blank\" or \"this field has anything in it.\" You'll use these constantly in dashboards and scheduled reports.</li><li><strong>Saved Filters</strong> — Build a complicated filter once, save it, run it with one click forever. Stop rebuilding the same thing every Monday morning.</li><li><strong>Dot-Walking</strong> — Filtering on fields from related tables. Show incidents where the Caller's Department's Manager is Sarah. Chain the dots, ServiceNow follows the trail. Senior admin move.</li><li><strong>Group By</strong> — Organize your list into collapsible chunks by a field value. Incidents grouped by Priority shows you the pile of P1s vs the pile of P3s instantly.</li><li><strong>Tags</strong> — Personal or shared sticky notes you slap on individual records. \"Follow up\" tagged across incidents AND requests AND problems. Different from filters — tags live on records, filters are conditions.</li><li><strong>Personalize List</strong> — Right-click any column header to add or remove columns from YOUR view. Doesn't affect anyone else. Stop staring at columns you don't need.</li><li><strong>Export</strong> — Download list data as Excel, CSV, PDF, or XML. Your manager will ask for an Excel of \"all open changes\" at least once a week. Know how.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building a 30-minute filter and forgetting to save it. Click away and it's gone. Save first, run second.</li><li>Saving a filter as Personal when the whole team needs it. Now you're the only one who has it. Set visibility to Group or Everyone before saving.</li><li>Skipping the encoded query syntax. The exam loves it. The job loves it more — sharing a URL with a query baked in is faster than walking somebody through six clicks.</li><li>Trying to dot-walk a field that doesn't reference another table. Only Reference fields can dot-walk. The dropdown only shows you the ones that qualify.</li><li>Picking the wrong operator. \"starts with\" vs \"contains\" vs \"is\" — three different result sets. Read what you click.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li><code>^</code> = AND in encoded queries</li><li><code>^OR</code> = OR in encoded queries</li><li><code>^ORDERBY field</code> = sort A→Z | <code>^ORDERBYDESC field</code> = sort Z→A</li><li><code>ISEMPTY</code> / <code>ISNOTEMPTY</code> = blank / not blank</li><li>Right-click breadcrumb → \"Copy query\" = your filter as a portable string</li><li>Right-click column header → Group By, Sort, Personalize List, Configure</li><li>Default rows per page = 20 (configurable)</li><li>Export formats: Excel (.xlsx), CSV, PDF, XML</li></ul><h3>💼 REAL WORLD</h3><p>4:47pm Friday. Manager Slacks: \"How many P1 incidents did the network team have last month?\" If you know this module, that's a 60-second answer — open Incident, filter <code>priority=1^assignment_group=Network^opened_atONLast month</code>, count, export, send.</p><p>If you don't know this module, that's a 10-minute scramble while your manager is staring at the chat. That gap, every day, for 90 days — that's how probation goes either really well or really bad.</p>",
  "csa3": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>Lists are how you find a record. Forms are how you actually do something with it. This module is everything that lives on a form — the fields, the sections, the rules that hide and show stuff, the scripts that fire when you save.</p><p>This is where ServiceNow admins get hired. Every business unit has a request: \"make this field show up only when…\" \"make this mandatory if…\" \"auto-fill this when that changes.\" That's all this module. Cert hits this hard.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Form vs List</strong> — List = many records summarized. Form = one record up close. Click a record number in any list, the form opens.</li><li><strong>Sections</strong> — Visual buckets of related fields on a form. On Incident: Details, Resolution, Notes, Related Records. Each section can collapse so you only see what you need.</li><li><strong>Mandatory Fields</strong> — Red asterisk (*). Form won't save until you fill them. Set in the Dictionary, in a UI Policy, or in a Data Policy.</li><li><strong>Work Notes vs Additional Comments</strong> — Work Notes = INTERNAL. Customer never sees them. Additional Comments = customer gets an email. Mix these up and your private notes just hit the requester's inbox. This is what gets people fired.</li><li><strong>UI Policy</strong> — No-code rule that runs in the browser. \"When Priority = Critical, make Impact mandatory.\" Front-end only. Fires while you're typing.</li><li><strong>Data Policy</strong> — Same idea as UI Policy but enforced on the back-end. Fires no matter how the data comes in — form, import, REST API, list edit. Need a mandatory field even on imports? Data Policy.</li><li><strong>Business Rule</strong> — Server-side script that runs when records are created, read, updated, or deleted. \"Before\" timing = change the record before it saves. \"After\" timing = react after it saves (send notification, etc.). More power than UI Policy, costs you JavaScript.</li><li><strong>Client Script</strong> — JavaScript that runs in the browser on form events: onLoad, onChange, onSubmit. UI Policies are no-code. Client Scripts are when you need actual code on the front-end.</li><li><strong>Form View</strong> — Multiple layouts of the same form for different audiences. Service desk sees the full form, ESS users see a stripped-down version, mobile gets a tighter one. Same record, different windows.</li><li><strong>Variable Set</strong> — A reusable group of catalog variables. Build the set once, attach it to every catalog item that needs the same questions. Update the set, every item updates.</li><li><strong>Dictionary</strong> — The master spec sheet for every table and field — data type, max length, default value, mandatory, choices. When something acts weird, the dictionary explains why.</li><li><strong>Coalesce</strong> — Field marker for imports that says \"if a record with this value already exists, UPDATE it, don't create a duplicate.\" Stops your import from making 800 copies of every user.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Mixing up UI Policy and Business Rule. UI Policy = browser-side, only fires when somebody uses a form. Business Rule = server-side, fires on every CRUD operation. Different timing, different reach.</li><li>Putting internal info in Additional Comments because you weren't paying attention. The customer just got an email with your private notes. Career-ending mistake. Read the field label every time.</li><li>Building 14 separate UI Policies when ONE Data Policy would have covered every path into the data.</li><li>Adding fields to the Form Layout but forgetting they need ACLs to be visible to lower-privileged users. Field is \"there\" but nobody but admins can see it.</li><li>Using a Business Rule to do something a UI Policy could do. Now your logic only runs on save instead of as the user types — bad UX, slower form.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>UI Policy = front-end (browser, form only)</li><li>Data Policy = back-end (form + import + API + list edit)</li><li>Business Rule timings: Before, After, Async, Display</li><li>Work Notes = INTERNAL | Additional Comments = CUSTOMER-FACING</li><li>Mandatory marker = red asterisk (*)</li><li>Form Designer = drag-and-drop form layout (Configure → Form Design)</li><li>Variable Set = reusable bundle of catalog variables</li><li>Coalesce = match-or-create field for imports (kills duplicates)</li><li>Reference field = a field that points to a record in another table</li></ul><h3>💼 REAL WORLD</h3><p>Business unit says: \"When somebody submits a high-priority incident, automatically show the Major Incident fields and make Impact mandatory.\" That's a UI Policy. 10 minutes of work if you know this module.</p><p>Two weeks later they come back: \"We need that same rule when records come in from the monitoring tool too.\" Now you need a Data Policy because the API path doesn't load forms. Same rule, different lane. This back-and-forth fills an admin's calendar — it's literally what they pay you for.</p>",
  "csa4": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the money module. Flow Designer is how you automate work in ServiceNow without writing code. Tickets get created, routed, approved, escalated, and closed by themselves. Build one good flow and you save the team 100 hours a year.</p><p>If you only learn one module deeply, make it this one. Workflow (the old graphical engine) is being phased out — everything new goes through Flow Designer. Companies are paying $200/hr for people who can migrate legacy Workflow content to Flow. That can be you.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Flow Designer</strong> — The no-code automation builder. Drag and drop. Trigger → Actions → Done. The modern engine.</li><li><strong>Trigger</strong> — What kicks off the flow. Record created, field changed, schedule, inbound API, manual button. Every flow has exactly ONE trigger.</li><li><strong>Actions</strong> — The \"do something\" steps. Create a record, send an email, update a field, look up data, call an API, ask for approval.</li><li><strong>Subflow</strong> — A reusable chunk of automation called FROM a flow. Like a function. Build common logic once, call it from 10 different flows. Don't copy-paste, subflow it.</li><li><strong>Action Designer</strong> — Where you build your own custom action when none of the out-of-box ones fit. Wrap a script or REST call in a clean input/output package. Now any flow can drag it in.</li><li><strong>Look Up Records</strong> — Action that queries a table with conditions and returns matching records for use in later steps. Your \"go find me\" step.</li><li><strong>For Each (Loop)</strong> — Iterates through a list of records and runs the same actions on each one. One loop, many records handled.</li><li><strong>Wait For Condition</strong> — Pauses the flow until something becomes true. Wait for the incident to be Resolved. Wait for the change to be Approved. Then keep going.</li><li><strong>Try / Catch</strong> — Error handling block. Try runs the risky action; if it fails, Catch handles it. Without it, one bad API call halts the whole flow and somebody has to babysit.</li><li><strong>Approval Action</strong> — Pauses the flow, sends an approval to specified users, branches based on yes/no. Change Management runs on this.</li><li><strong>Decision Table</strong> — Structured table of conditions mapped to outcomes. Cleaner than nested If/Then logic when you've got 8 branches.</li><li><strong>Integration Hub</strong> — Add-on that extends Flow Designer with pre-built spokes for outside systems (Slack, Jira, Microsoft, AWS).</li><li><strong>Spoke</strong> — A packaged set of actions for a specific outside system. Install the Slack spoke, drag \"Post Message\" into your flow, done. No API knowledge needed.</li><li><strong>Connection &amp; Credential Alias</strong> — A pointer that lets a flow reference \"the Slack connection\" without hard-coding the URL or credentials. Dev points to dev Slack, prod points to prod Slack. Promote the flow up the pipeline, no code changes.</li><li><strong>Scheduled Flow</strong> — Flow triggered by a schedule (daily, weekly, specific date) instead of a record event. Nightly cleanup, weekly reports.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building flows in Production. Don't. Build in Dev, capture in an Update Set, promote to Test, validate, promote to Prod.</li><li>Forgetting to publish. Unpublished flow doesn't run. People burn 20 minutes troubleshooting \"why isn't this firing\" — it's because they hit Save instead of Save and Publish.</li><li>Hard-coding credentials in a flow. Use Connection &amp; Credential Aliases so dev/test/prod each use their own creds without you editing the flow every time.</li><li>Skipping error handling. One unreachable API and your whole flow crashes. Wrap risky steps in Try/Catch — give it somewhere to land when things break.</li><li>Reaching for Flow when a 5-line Business Rule would've done it. Flow is great. It's not always the right hammer.</li><li>Confusing Flow with Workflow. Workflow = older graphical engine, mostly legacy. Flow Designer = the future. New work goes in Flow.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Every flow = exactly ONE trigger</li><li>Trigger types: Record, Schedule, Application, Inbound Email, Service Catalog, MetricBase</li><li>Save ≠ Publish. Both, every time.</li><li>Try / Catch wraps risky actions</li><li>Subflow = reusable function-style logic</li><li>Action Designer = build your own action</li><li>Connection &amp; Credential Alias = portable creds across environments</li><li>Run As: System User (full access) vs User Who Initiates Session (their ACLs)</li><li>Integration Hub spokes = pre-built actions for outside systems</li></ul><h3>💼 REAL WORLD</h3><p>Service desk is drowning. Every new incident, somebody manually checks the caller's department, finds the right assignment group, assigns, then notifies the team in Slack. 90 seconds per ticket × 200 tickets a day = 5 hours of human time a day on copy-paste work.</p><p>You build one flow: trigger on incident insert, look up the caller's department, set the assignment group, post to the team's Slack channel via the Slack spoke. 5 hours a day → 0. Now your manager has a quote for the company newsletter and you have leverage at your next review.</p>",
  "csa5": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>Leadership doesn't live in the platform. They live in numbers. This module is how you take what's happening in ServiceNow and put it on a screen executives understand in 5 seconds.</p><p>If you can't show the work, the work didn't happen. Reporting is how you become the person leadership trusts. Cert tests you on report types and dashboard mechanics. The job tests you on whether your charts answer the actual question.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Reports</strong> — Pull data from any table and visualize it. Bar, pie, line, list, pivot. Build once, share with the team. The base unit.</li><li><strong>Dashboards</strong> — Multiple reports + gauges on one page. Your manager opens this every morning to know what's happening. Their command center.</li><li><strong>Gauges</strong> — Single-number widgets with color coding. Open P1 incidents: 3 (green). SLA compliance: 67% (red). At-a-glance health.</li><li><strong>Scheduled Report</strong> — Auto-runs and emails the result on a schedule. Set it up once, your manager gets Monday morning metrics without ever asking you. You look organized while you sleep.</li><li><strong>Group By</strong> — Segments report data by a field. Incidents BY priority. Requests BY department. Each group becomes a bar or a slice.</li><li><strong>Aggregate</strong> — Counts, sums, or averages across records. \"How many\" and \"how much\" answers.</li><li><strong>Pivot Table</strong> — Two-dimension report. Rows = priority, columns = assignment group, cells = counts. Cross-tabulation in one visual. Bar charts can't do this.</li><li><strong>Heatmap</strong> — Color-intensity grid. Show incidents by hour-of-day vs day-of-week and you SEE your busy times instantly. Pattern recognition without thinking.</li><li><strong>Multi-Dataset Report</strong> — Combine data from two different tables in one chart. Open incidents AND pending changes side-by-side.</li><li><strong>Drilldown</strong> — Click a bar in a chart and see the actual records behind that number. Summary → detail in one click.</li><li><strong>Dashboard Filter</strong> — A filter that sits at the top of a dashboard and slices EVERY report on the page when the viewer changes it. Different from a Report Condition (which is hard-coded into the report).</li><li><strong>Performance Analytics (PA)</strong> — Premium analytics module that captures historical data over time. Trend analysis, predictive insights, scorecards. Costs extra. Senior admin skill.</li><li><strong>Responsive Dashboard</strong> — The newer dashboard format that auto-adjusts to phone, tablet, desktop. Replacing the older Homepage dashboards over time.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building a beautiful chart that doesn't answer the question. Read the request twice before you pick a chart type.</li><li>Pie chart with 12 slices. Nobody can read it. Use a bar chart when you've got more than ~5 categories.</li><li>Saving a report as Personal when leadership needs to see it. Now nobody can open it. Set visibility to roles, groups, or everyone.</li><li>Forgetting Drilldown is enabled by default. Tell your manager \"click the bar\" — turns a static screenshot into an interactive tool.</li><li>Mixing up Dashboard Filter and Report Condition. Condition is baked into the report. Filter slices everything at runtime.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Bar = comparing | Line = trend over time | Pie = parts of a whole (≤5 slices)</li><li>Pivot = two dimensions at once</li><li>Heatmap = density across two dimensions (color = volume)</li><li>Multi-dataset = data from multiple tables in one chart</li><li>Gauge = single-number widget with thresholds</li><li>Scheduled Report = auto-email on a schedule</li><li>Drilldown = click chart → see records</li><li>Dashboard Filter = runtime, slices everything | Report Condition = baked-in</li><li>Responsive Dashboard = mobile-ready (newer) | Homepage = legacy</li></ul><h3>💼 REAL WORLD</h3><p>Manager asks: \"Build me a weekly view — incident volume by team, average resolution time, and SLA compliance.\" That's three reports on one dashboard, scheduled to email every Monday at 7am.</p><p>You build it once. Six months later, you're the person leadership name-drops in the all-hands meeting because they have data nobody else can produce. THAT is how you become indispensable. Starts with one good dashboard.</p>",
  "csa6": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>Who can do what in ServiceNow is controlled by Roles, Groups, and ACLs. This module is the security/access layer — onboarding new users, offboarding people who left, making sure everyone sees exactly what they should and nothing they shouldn't.</p><p>Get this wrong and either nobody can do their job (you'll be the most-hated admin in IT), or everyone has admin access (you'll be in the post-incident meeting explaining why). Cert hits this constantly. Job hits it harder.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Roles</strong> — Named bundles of permissions. The <code>itil</code> role = standard ITSM user. The <code>admin</code> role = full keys to the kingdom. Assign roles to GROUPS, not individuals (best practice).</li><li><strong>Groups</strong> — Collections of users. Assignment groups route work (Network, Desktop Support, AD Team). Security groups control access.</li><li><strong>ACLs (Access Control Lists)</strong> — The actual security rules. Who can read, write, create, delete which records and fields. The bouncer at every door in the platform. Hits role + condition + script before letting you through.</li><li><strong>Active Flag</strong> — Checkbox on a user record. Uncheck to disable a user without deleting them. Preserves all their history (every ticket they touched, every change they approved). ALWAYS deactivate, NEVER delete.</li><li><strong>LDAP Integration</strong> — Syncs users from Active Directory automatically. New hire shows up in AD on Monday → shows up in ServiceNow Tuesday morning. Termed employee disabled in AD → deactivated in ServiceNow same day.</li><li><strong>SSO (Single Sign-On)</strong> — Users log in with their corporate credentials. No separate ServiceNow password. Standard in any enterprise. Way fewer \"I forgot my password\" tickets.</li><li><strong>Multi-Provider SSO</strong> — Different sets of users authenticate through different identity providers. Useful when an acquisition brought in users on a different IDP, or a partner needs limited access.</li><li><strong>Domain Separation</strong> — Logical data isolation on a single instance. MSPs use it so Customer A's data is invisible to Customer B. Heavy lift to set up but powerful.</li><li><strong>Impersonation</strong> — Admins can temporarily see ServiceNow as a specific user. Best troubleshooting tool you have for \"I can't see X\" tickets.</li><li><strong>Delegate</strong> — Vacation coverage. Set Sarah as your delegate Aug 1–15, every approval routed to you goes to her instead. Without it, your queue piles up while you're at the beach.</li><li><strong>VIP</strong> — A flag on the user record. Triggers priority handling on their incidents and requests — auto-escalation, alerts to leadership, special queue placement.</li><li><strong>security_admin</strong> — Elevated role required to edit ACLs. You don't get it permanently — you elevate INTO it temporarily through your name menu (only if the High Security Plugin is on AND you've been assigned the role).</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Assigning roles directly to users instead of through groups. Onboarding 50 service desk reps? Add the group, they all inherit <code>itil</code>. Direct assignment to 50 users? You're clicking forever AND it's a mess to revoke later.</li><li>Deleting a user instead of deactivating. Now their history breaks, their old tickets show \"no record found,\" audit trail destroyed. Always Active = false.</li><li>Trying to edit an ACL without elevating to security_admin. The fields are read-only. You'll think it's broken. It's not — you didn't elevate.</li><li>Forgetting Domain Separation exists. User says \"I can't see Customer B's records\" — it's not a permission bug, it's because they're in Customer A's domain and that's the whole point.</li><li>Not impersonating before guessing. You'll spend an hour digging through ACLs when 30 seconds of impersonation would've shown you exactly what's wrong.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Assign roles to GROUPS, not users (best practice)</li><li>Active = false to deactivate (NEVER delete users)</li><li><code>itil</code> = standard ITSM user | <code>admin</code> = full access | <code>security_admin</code> = elevate-only</li><li>ACLs check: role + condition + script (any one fails, access denied)</li><li>LDAP = sync users from AD | SSO = log in with corporate creds</li><li>Multi-Provider SSO = different IDPs for different user groups</li><li>Domain Separation = data isolation on one instance</li><li>Delegate = vacation coverage for approvals</li><li>Impersonate = see ServiceNow as somebody else</li></ul><h3>💼 REAL WORLD</h3><p>New hire Day 1. HR sends you a ticket: \"Provision Marcus, Service Desk Tier 1, starts Monday.\" Open Marcus's user record (LDAP synced him in overnight), drop him in the Service Desk group, the group has the <code>itil</code> role attached, done. Marcus logs in Monday morning, opens an Incident, and gets to work. Three minutes of your time.</p><p>Six months later Marcus moves to the Network team. Pull him out of Service Desk, drop him in Network. Access flips automatically. No tickets, no scripts, no admin chaos. THAT is why you assign roles to groups instead of users.</p>",
  "csa7": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the heart of ServiceNow — IT Service Management. Incidents, Problems, Changes, Requests. The four big workflows every ServiceNow deployment runs on. If you understand ITSM you understand WHY ServiceNow exists.</p><p>Cert exam: probably 25-30% of the questions touch this module. Job interviews: \"walk me through how an incident gets created and resolved\" — this module is your answer. Know it cold.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Incident</strong> — Something broke. The lights are off. Restore service fast. Doesn't matter why right now — just get it working.</li><li><strong>Service Request</strong> — \"I need something.\" A new laptop, software access, an account reset. Not broken — just a normal ask. Different workflow, different SLAs.</li><li><strong>Problem</strong> — Why does the same incident keep happening? Find the root cause and kill it permanently. Incident restores service. Problem prevents recurrence.</li><li><strong>Known Error</strong> — A Problem with a documented root cause and a workaround, even if the permanent fix isn't shipped yet. Documenting it speeds up everyone after you.</li><li><strong>Change Management</strong> — Any modification to IT infrastructure goes through Change. Reduces risk, creates accountability.</li><li><strong>Change Types</strong> — Standard = pre-approved, low-risk, routine (\"reboot the email server\"). Normal = needs CAB approval. Emergency = urgent fixes, fast-tracked process.</li><li><strong>CAB (Change Advisory Board)</strong> — The committee that reviews Normal Changes. IT leaders, service owners, business stakeholders. They vote on risk before implementation.</li><li><strong>Standard Change Template</strong> — The pre-approved blueprint. The Standard Change is the live request CREATED from the template. Pre-approval lives in the template, so the live change skips CAB.</li><li><strong>Major Incident</strong> — A high-impact incident that gets a formal communication and bridge process — exec updates, war room, dedicated comms. Priority is a label; Major Incident is a process.</li><li><strong>CMDB</strong> — Configuration Management Database. Inventory of every CI in your IT environment AND how they connect. If you don't know what you have, you can't manage it.</li><li><strong>CI (Configuration Item)</strong> — Anything in your infrastructure being tracked. Servers, applications, databases, network gear, laptops. CMDB is the map.</li><li><strong>SLA</strong> — Service Level Agreement. The clock that tracks whether you're meeting response and resolution commitments. Miss your SLA and the business has receipts.</li><li><strong>Response SLA vs Resolution SLA</strong> — Response = time until somebody starts working. Resolution = time until it's fixed. Different timers, both matter.</li><li><strong>OLA vs UC</strong> — OLA (Operational Level Agreement) = between internal IT teams (Network team commits to Desktop team). UC (Underpinning Contract) = with an outside vendor (your ISP). All three together = how you actually meet your customer SLA.</li><li><strong>Priority</strong> — Impact × Urgency. P1 = drop everything. P4 = get to it when you can. ServiceNow calculates from a priority matrix automatically.</li><li><strong>Service Catalog</strong> — The menu where users request services and products. Each item has its own fulfillment workflow.</li><li><strong>RITM (Requested Item)</strong> — Created when a user orders from the catalog. A Request (REQ) holds one or more RITMs (one per item ordered).</li><li><strong>CTASK (Catalog Task)</strong> — Unit of work spawned by a RITM to fulfill the request. New-hire kit RITM might spawn 5 CTASKs — IT provisions laptop, HR sends welcome packet, facilities sets up desk, etc.</li><li><strong>Assignment Group</strong> — The team a record is routed to. Network group gets network incidents. Desktop Support gets hardware tickets.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Treating an Incident like a Problem. Incident = restore service NOW. Don't go down a 4-hour root cause rabbit hole while users can't log in.</li><li>Submitting an Emergency Change because you didn't plan ahead. CAB notices. Auditors notice. Don't let \"emergency\" mean \"unprepared.\"</li><li>Closing an Incident as \"Resolved\" without filling in the Resolution Notes. Now nobody knows what fixed it. Next time the same thing breaks, the team rediscovers the fix from scratch.</li><li>Mixing up Priority and Major Incident. P1 is a number on the ticket. Major Incident is a whole communication process — bridge call, exec updates, status page.</li><li>Letting tickets bounce between groups. High Reassignment Count = poor routing or a turfing problem. KPI for service desk health.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Incident = restore service | Problem = root cause | Change = controlled modification | Request = ask for something</li><li>Change types: Standard (pre-approved), Normal (needs CAB), Emergency (fast-tracked)</li><li>Standard Change Template = blueprint | Standard Change = the live request created from it</li><li>Priority = Impact × Urgency (P1 → P4)</li><li>Major Incident = process designation, not a priority</li><li>SLA = customer-facing | OLA = internal IT teams | UC = outside vendor</li><li>Response SLA = time to start | Resolution SLA = time to fix</li><li>REQ → RITM → CTASK (Request → Requested Item → Catalog Task)</li><li>CMDB = inventory of CIs + their relationships</li></ul><h3>💼 REAL WORLD</h3><p>Email is down for the entire company. Tickets are flooding in. You flag the parent ticket as a Major Incident, kick off the bridge call, post status updates every 15 minutes. Engineering identifies the bad config push, opens an Emergency Change to roll back, change goes through fast-tracked CAB, email comes back in 47 minutes.</p><p>Next week somebody opens a Problem record to investigate why the original change made it to prod without anyone catching the bad config. Root cause found, Known Error documented, automation built so it never happens again. THAT is the full ITSM lifecycle in motion. Cert tests it. Job lives it.</p>",
  "csa8": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the engine room. Update Sets, integrations, scheduled jobs, import sets, REST APIs. This is what separates a basic admin from a senior admin. Master this and you're in a different pay bracket — $100K-$150K territory.</p><p>Cert tests the concepts. The job tests whether you can move 30 update sets from dev to prod without breaking production. Big difference. Both matter.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Update Sets</strong> — How configuration changes travel between instances. Build in Dev, capture in an update set, promote to Test, promote to Prod. Never build directly in Production. Ever.</li><li><strong>Update Set Batch</strong> — Multiple update sets grouped under one parent. Move the parent, all children flow together in dependency order. Saves you from \"which set do I commit first?\" headaches.</li><li><strong>Instance Environments</strong> — Dev (build) → Test/UAT (validate) → Production (live). Changes flow one direction, like a river.</li><li><strong>Cloning</strong> — Copies a source instance (usually Prod) onto a target (usually Dev or Test). Gives developers a realistic environment to test against.</li><li><strong>Scheduled Jobs</strong> — Scripts that run automatically on a schedule. Nightly cleanups, daily imports, weekly reports.</li><li><strong>Background Scripts</strong> — Ad-hoc, run-once scripts you fire in the current instance. NOT captured in update sets — they don't travel. Use for one-time dev pokes.</li><li><strong>Fix Scripts</strong> — Saved scripts that ARE captured in update sets and run when the set is committed in the target. Use to fix bad data or finish a setup step that can't be captured as configuration.</li><li><strong>Import Sets</strong> — Stage external data (CSVs, JSON, etc.) before loading into ServiceNow. Lets you transform and validate before the real write.</li><li><strong>Transform Map</strong> — Rules that translate Import Set fields to target table fields. \"Column FIRST_NAME maps to User table field first_name.\"</li><li><strong>MID Server</strong> — Java agent installed on-premise that lets ServiceNow reach systems inside your firewall. The bridge between cloud ServiceNow and your internal network.</li><li><strong>Discovery</strong> — Automated process that scans your network and populates the CMDB with what it finds. Keeps your CI inventory current without humans typing.</li><li><strong>System Properties</strong> — Key-value settings that control platform behavior. Email config, session timeouts, default values. Where you tune the platform.</li><li><strong>Plugins</strong> — Optional platform components that turn on additional features. ITSM, HRSD, CSM are all plugins. Some included, some cost extra.</li><li><strong>Application Repository (Application Manager)</strong> — Hub where you install ServiceNow Store apps and ServiceNow-published plugins. Different from Update Sets — Update Sets move custom config, Repository handles marketplace stuff.</li><li><strong>Scope</strong> — Application namespace that isolates your custom app from out-of-box content. Prevents your customizations from getting nuked on the next platform upgrade.</li><li><strong>REST API</strong> — How outside systems talk to ServiceNow. Create, read, update, delete records via HTTP. Foundation of every integration.</li><li><strong>Script Include</strong> — Reusable server-side JavaScript library. Write common logic once, call it from Business Rules, REST APIs, Flows, anywhere on the server.</li><li><strong>Inbound Email Action</strong> — Rule that processes emails coming INTO ServiceNow. Email creates an incident, email adds a comment to a ticket, email closes a record.</li><li><strong>Upgrade History</strong> — Tracks every platform version upgrade — what was applied, what was Skipped (your customization kept), what was Reverted (OOB version taken).</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building in Production. There is no recovery from this when something breaks. Build in Dev, always.</li><li>Forgetting which Update Set was active. You build a UI Policy in Dev, never set the active update set, the change goes into \"Default\" — now you can't move it. Always check the upper-right corner before you build.</li><li>Cloning Prod over Dev without a backup of Dev's customizations. Years of dev work, gone. Always export your Dev customizations BEFORE a clone.</li><li>Confusing Background Scripts with Fix Scripts. Background = dies in current instance, never travels. Fix Script = captured in update set, runs when committed. If you need it to travel, use Fix Script.</li><li>Skipping every conflict during an upgrade. Now you missed a bunch of platform improvements forever. Read each conflict — sometimes Revert is the right call.</li><li>Hard-coded credentials in scripts or flows. Use System Properties or Connection Aliases. Don't be the person whose code committed a password to source control.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Dev → Test → Prod (changes flow one way, never reverse)</li><li>Update Set = config travels | Update Set Batch = multiple sets as one unit</li><li>Background Script = current instance only, NOT captured</li><li>Fix Script = captured in update set, runs on commit in target</li><li>Import Set + Transform Map = stage + map external data</li><li>MID Server = bridge to systems behind your firewall</li><li>Discovery = auto-populates CMDB</li><li>Plugins = built-in features (some free, some paid)</li><li>Application Repository = ServiceNow Store apps &amp; plugins (different from Update Sets)</li><li>Scope = namespace that isolates your custom app</li><li>Upgrade conflict choices: Skip (keep custom) or Revert (take OOB)</li></ul><h3>💼 REAL WORLD</h3><p>Senior admin and developer roles pay $100K-$150K because companies need people who can manage Update Sets, build integrations, and keep platform health steady. Most admins never get past CSA basics. The ones who master this module become the people their team calls when something breaks at 11pm.</p><p>You're going to ship a quarterly release: 30 update sets across 4 features, batched, promoted from Dev to Test, validated by QA, batched again, promoted to Prod with a Fix Script that cleans up legacy data on commit. Zero downtime, zero rollback. Do that twice and you're getting a raise. Do it four times and you're CAD/CIS material. Starts here.</p>",
  "ai1": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the foundation. Before you touch a single AWS service, you gotta know what AI even is. Not the buzzword version — the actual version. People throw around \"AI\" like it's one thing. It's not. It's a stack. And if you don't know the stack, the rest of this cert is just memorizing words you don't understand. The exam loves vocabulary here. AI, ML, Deep Learning, supervised, unsupervised, training, inference. Lock these in and a quarter of the test is automatic.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>AI (Artificial Intelligence)</strong> — The whole umbrella. Any machine doing something that looks like thinking. Siri telling you the weather, your spam folder catching junk, Netflix knowing what you want next — all AI. It's the category, not the thing.</li><li><strong>ML (Machine Learning)</strong> — A type of AI where the machine learns from data instead of someone hard-coding every rule. Old school: a programmer writes \"if email has the word VIAGRA, mark as spam.\" ML: you show the machine 10,000 spam emails and 10,000 real ones and it figures out the pattern itself. Nobody told it what spam looks like — it learned.</li><li><strong>Deep Learning (DL)</strong> — A type of ML using neural networks with a LOT of layers stacked on top of each other. \"Deep\" = many layers. This is what powers ChatGPT, face recognition, self-driving cars. When the data gets messy (images, audio, language), DL is what handles it. AI is the umbrella → ML is under it → DL is under that. Three nested circles.</li><li><strong>Platform</strong> — A managed environment where you run your ML work without buying your own servers. SageMaker is a platform. Bedrock is a platform. Think of it like renting a fully-stocked kitchen instead of building one from scratch — stove's already there, knives are already sharp, you just cook.</li><li><strong>Supervised Learning</strong> — You give the model the question AND the answer, over and over, until it learns the pattern. Show it a million pictures labeled \"cat\" or \"dog\" and eventually it can tell on its own. Like flashcards — front says \"what is it,\" back says \"the answer.\" Most business ML is this.</li><li><strong>Unsupervised Learning</strong> — No answers given. Just data. The model finds patterns on its own — groups customers that act alike, spots transactions that look weird, finds hidden categories nobody told it about. Like dropping somebody at a party with no names and asking them to figure out the friend groups.</li><li><strong>Reinforcement Learning (RL)</strong> — The model learns by doing. Try something → get a reward or a penalty → adjust → try again. How AI beats humans at chess and Go. Same way a kid learns not to touch a hot stove — try it once, learn forever. Slow to train but powerful when nothing else works.</li><li><strong>Neural Network</strong> — Layers of connected math \"neurons\" that pass numbers through and adjust how much each one matters. Loosely copied from how a brain wires up. Each connection has a weight. Training = the model tuning those weights until the output matches what it should be.</li><li><strong>Training</strong> — Teaching the model. You feed it data, it makes guesses, you correct it, it adjusts. Takes hours to weeks. Expensive. You only do this once (or every few months when the data gets stale).</li><li><strong>Inference</strong> — The model actually doing its job after training. You ask, it answers. Fast. Cheap. This is what runs in production every time someone hits your app. Train once, infer a million times.</li><li><strong>Features</strong> — The input variables the model uses to make a prediction. Predicting salary? Features might be years of experience, certs held, clearance level, city. Bad features = bad model, no matter how fancy. Choosing the right features is half the work.</li><li><strong>Labels</strong> — The right answer in supervised learning. For every training example, the label is what you want the model to learn to spit out.</li><li><strong>Training, Validation, Test Split</strong> — Slice your data three ways. Training (~70-80%) teaches it. Validation (~10-15%) you check during training to tune settings. Test (~10-15%) you hide until the very end for the real grade. Never let the model peek at the test set — that's like letting a student see the exam answers the night before. The grade means nothing.</li><li><strong>Overfitting</strong> — The model memorized the training data instead of learning the actual pattern. Aces practice, bombs the real test. Like the kid who memorized the practice exam word-for-word but couldn't answer one different question. Sign: training accuracy 99%, real-world accuracy 60%.</li><li><strong>Underfitting</strong> — Opposite. Model too simple to learn the pattern at all. Bad at training, bad at testing. Like trying to predict the stock market with a coin flip. Fix it with a more complex model or better features.</li><li><strong>Hyperparameters</strong> — Settings YOU pick before training starts. Learning rate, number of layers, batch size. Different from the weights the model learns — these are the dials you turn. Tuning hyperparameters is half the job and 90% of the frustration.</li><li><strong>Transfer Learning</strong> — Don't start from zero. Take a model already trained on a huge dataset and fine-tune it for your specific job. Like hiring someone with 10 years of experience instead of training a new grad. Saves massive time and compute. This is how almost every modern AI gets built.</li><li><strong>Confusion Matrix</strong> — A grid showing what the model got right and wrong, broken down. True positives, false positives, true negatives, false negatives. Where you find out your \"95% accurate\" fraud detector caught zero actual fraud. The matrix tells the real story.</li><li><strong>Accuracy, Precision, Recall</strong> — Three ways to grade a model and they don't always agree. Accuracy = total right out of total. Precision = when you say \"yes,\" how often are you right. Recall = of all the real yeses out there, how many did you catch. Fraud detector needs high recall (catch every fraud). Spam filter needs high precision (don't flag real emails). Pick the metric for the job.</li><li><strong>Structured vs Unstructured Data</strong> — Structured = clean rows and columns, like a spreadsheet or SQL table. Unstructured = the messy stuff: text, images, video, voice memos. 80% of real-world data is unstructured. ML used to only handle structured. Deep Learning is what unlocked the unstructured pile.</li><li><strong>Amazon SageMaker</strong> — AWS's main ML platform. Build, train, tune, deploy, monitor models without managing servers. When the exam asks \"which AWS service for general ML work,\" the answer is SageMaker.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Mixing up AI and ML on the exam. AI is the whole umbrella. ML is the data-driven slice. If the question is about \"learning from data,\" it's ML — even if \"AI\" shows up in the question.</li><li>Training on your test set. Now your accuracy is fake and you've got no idea how it'll do in the real world. Test set stays locked in the vault until the very end.</li><li>Chasing accuracy when precision or recall is what matters. A fraud detector that's 99% accurate but misses every fraud is garbage. Match the metric to the actual job.</li><li>Thinking more data is always the answer. More CLEAN data wins. More dirty data makes the model worse. Garbage in, garbage out.</li><li>Building a deep neural network for a problem a simple model would solve. Don't bring a tank to a knife fight. Match the model size to the problem.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>AI ⊃ ML ⊃ Deep Learning (nested, biggest to smallest)</li><li>Supervised = labels given | Unsupervised = no labels, find patterns | RL = rewards/penalties</li><li>Training = expensive, one-time | Inference = cheap, every request</li><li>Overfit = aces training, fails real | Underfit = fails both</li><li>Train/Val/Test ≈ 70/15/15 (never peek at test)</li><li>Hyperparameters = YOU set them BEFORE training | Weights = model learns them DURING</li><li>Transfer Learning = start with a pre-trained model, fine-tune for your task</li><li>Accuracy = total right | Precision = of yeses, how many right | Recall = of real yeses, how many caught</li><li>Structured = rows/columns | Unstructured = text, images, audio, video</li><li>SageMaker = AWS's main ML platform (build, train, deploy, monitor)</li></ul><h3>💼 REAL WORLD</h3><p>AI Practitioner is the entry-level AWS AI cert. Pass it and you're qualified for \"AI-aware\" jobs — cloud admin roles that touch ML pipelines, data engineering supporting ML teams, prompt engineering gigs in cleared environments. Pay range: $90K-$140K with this cert + a clearance. Next step from here is AWS ML Specialty or hands-on SageMaker work. But you can't run until you can walk. Lock this module in and the next three domains unlock fast.</p>",
  "ai2": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the domain everybody's hype about. ChatGPT, image generators, AI writing your emails — all generative AI. The first module was about machines learning patterns. This one's about machines CREATING. New text, new images, new code, new audio. Stuff that didn't exist before the model made it. The cert tests you on the basics: what's a foundation model, what's a prompt, what's the difference between GenAI and regular ML, what AWS services do what. Lock these terms and the exam stops being scary.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Generative AI (GenAI)</strong> — A type of AI that CREATES new stuff instead of just predicting or classifying. Old ML: \"is this email spam?\" → yes/no. GenAI: \"write me an email about this meeting.\" The model produces new output from scratch.</li><li><strong>Foundation Model (FM)</strong> — A giant pre-trained model that knows a lot about a lot. Trained on massive piles of internet data, books, code. You don't train it from zero — you USE it. Like a college grad you just hired: already knows the basics, you point them at your specific problem. The big-name LLMs are all foundation models.</li><li><strong>Large Language Model (LLM)</strong> — A foundation model specifically for text. Reads text, writes text. ChatGPT under the hood is an LLM. So is the AI that writes your code suggestions. If it talks back to you in words, it's an LLM.</li><li><strong>Prompt</strong> — What you say to the model. The input. \"Write me a poem about Brooklyn\" is a prompt. The model's reply is the completion. Your prompt is the steering wheel — bad prompt, bad output, every time.</li><li><strong>Prompt Engineering</strong> — The skill of writing prompts that get the model to do what you actually want. Not magic — it's just learning how to ask. \"Write me an email\" gets you junk. \"Write me a 3-sentence professional email declining a meeting, polite but firm\" gets you usable output. This is a real paying skill in 2026.</li><li><strong>Tokens</strong> — How LLMs count text. Not words, not characters — chunks in between. \"Hello world\" ≈ 2 tokens. A short paragraph ≈ 50 tokens. AWS charges per token in and per token out, so longer prompts cost more. Memorize this for the exam.</li><li><strong>Context Window</strong> — The most text a model can hold in its head at once, measured in tokens. Small window = forgets what you said earlier in the conversation. Big window = remembers a whole book. Bigger window = more expensive per call.</li><li><strong>Temperature</strong> — A dial that controls how creative/random the model gets. Low temp (0-0.3) = boring, predictable, factual. High temp (0.7-1.0) = creative, weird, less predictable. Coding tasks = low temp. Creative writing = high temp.</li><li><strong>Hallucination</strong> — When the model makes stuff up and says it confidently. Fake court cases, fake quotes, fake API endpoints. Sounds right, isn't right. The #1 risk of GenAI in production. Always verify before you ship.</li><li><strong>Fine-Tuning</strong> — Taking a foundation model and training it further on your specific data so it gets better at your specific job. Costs money and time, but the model learns your tone, your terminology, your domain. Different from prompting — fine-tuning permanently changes the model's behavior.</li><li><strong>Retrieval-Augmented Generation (RAG)</strong> — Instead of fine-tuning, you let the model look stuff up in your documents at runtime. Model gets the question → searches your knowledge base → uses what it found to answer. Cheaper than fine-tuning and the answers stay fresh because the documents update. Most enterprise GenAI uses RAG.</li><li><strong>Embedding</strong> — Turning words/sentences/documents into a list of numbers that capture their meaning. Two sentences that mean the same thing get similar numbers. This is how RAG searches — match the question's embedding to the most similar document embeddings. The math under the hood of every \"find similar stuff\" feature.</li><li><strong>Vector Database</strong> — Specialized storage for embeddings. Lets you search \"find documents similar in meaning to this question\" in milliseconds across millions of docs. The plumbing behind RAG.</li><li><strong>Amazon Bedrock</strong> — AWS's main GenAI service. Gives you API access to foundation models from multiple providers without managing the infrastructure. Pay per token. THE answer when the exam asks \"which AWS service to use foundation models?\"</li><li><strong>Amazon Titan</strong> — AWS's own family of foundation models (text and embeddings), available through Bedrock. The \"house brand\" option.</li><li><strong>Amazon Q</strong> — AWS's GenAI assistant for business and developers. Q Developer = code copilot. Q Business = chat over your company's docs. Different from Bedrock — Bedrock is the platform, Q is the finished product.</li><li><strong>Inference Cost</strong> — Every prompt you send and every response you get costs money. Per token. Watch this in production. A free chatbot can become a major monthly bill fast if you don't manage it.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Treating LLM output as fact. It's not a search engine — it's an autocomplete that sounds smart. Verify anything that matters. Hallucinations don't come with warning labels.</li><li>Confusing fine-tuning with RAG. Fine-tuning = permanently modify the model (expensive, slow, durable). RAG = let the model look stuff up at runtime (cheap, fast, always current). Wrong tool = wasted money.</li><li>Cranking temperature to 1.0 for everything. Cool — enjoy your randomly wrong customer service bot. Match temperature to the task.</li><li>Sending the model your whole 200-page handbook every time. That's a massive context window, massive cost. Use RAG and only retrieve the 2-3 relevant chunks.</li><li>Building on one specific model with no abstraction. Provider changes terms or deprecates the model and your whole product breaks. Bedrock gives you multi-provider — use it.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>GenAI = creates new stuff (regular ML = predicts/classifies)</li><li>Foundation Model = pre-trained, general-purpose, you USE it not train it</li><li>LLM = foundation model for text</li><li>Prompt = input | Completion = output</li><li>Tokens = how billing and context are counted</li><li>Temperature: low = factual | high = creative</li><li>Hallucination = confident wrong answer (always verify)</li><li>Fine-tuning = permanently teach the model your domain (expensive)</li><li>RAG = let the model look up your docs at runtime (cheaper, fresher)</li><li>Embedding = sentence → list of numbers that captures meaning</li><li>Vector DB = storage for embeddings (the engine of RAG)</li><li>Bedrock = AWS's main GenAI platform (multi-provider FM access)</li><li>Titan = AWS's own foundation models</li><li>Amazon Q = finished GenAI product (Q Developer = code, Q Business = chat over docs)</li></ul><h3>💼 REAL WORLD</h3><p>Every federal agency right now is figuring out how to use GenAI without leaking classified info. The roles paying $130K-$180K are the people who can answer: \"how do we deploy a chatbot over our internal docs without sending data to a third party?\" Answer = Bedrock + RAG in a VPC. If you can explain that in an interview, you're hired. This module is the entry ticket. The next domain is where you go from knowing what these things ARE to knowing what to BUILD with them.</p>",
  "ai3": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>ai2 taught you what foundation models ARE. This module is what you BUILD with them. Customer service bots, document summarizers, code assistants, image generators, search that actually understands meaning. The cert tests use cases — match the problem to the right tool. The job tests whether you can actually ship one. If you only get one domain locked, make it this one. This is where the money is.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Use Case</strong> — The specific business problem you're solving. Not \"we want AI\" — that's not a use case. \"We want a chatbot that answers HR questions from our policy docs\" — that's a use case. The cert hits this hard. Pick the right service for the right job.</li><li><strong>Text Generation</strong> — The model writes new text. Emails, blog posts, summaries, product descriptions, code comments. Most common GenAI use case in business.</li><li><strong>Summarization</strong> — Take a long document, get a short version. Court ruling → 3 paragraphs. Earnings call transcript → 5 bullet points. Massive time saver. Lawyers and analysts pay for this.</li><li><strong>Question Answering (Q&amp;A)</strong> — User asks, model answers — usually using your specific documents, not the model's general training. This is RAG territory. Internal helpdesk bots, customer support, knowledge base search.</li><li><strong>Sentiment Analysis</strong> — Reading text and figuring out the vibe. Positive, negative, neutral. Customer reviews, support tickets, social media. Old-school NLP did this fine but foundation models do it better with zero training.</li><li><strong>Classification</strong> — Putting text into buckets. Is this email spam, is this ticket high priority, is this product review fake. Foundation models can do it with just a prompt — no training data needed.</li><li><strong>Translation</strong> — One language to another. Foundation models handle this on the fly now. No more training a separate model per language pair.</li><li><strong>Code Generation</strong> — The model writes code from a description. \"Write me a Python function that pulls S3 objects\" — done. Amazon Q Developer, GitHub Copilot, all the same idea. This is changing how every engineer works in 2026.</li><li><strong>Image Generation</strong> — Text in, image out. \"A photo of a husky in a spacesuit on Mars.\" Stable Diffusion, Amazon Titan Image Generator. Marketing, product design, mockups.</li><li><strong>Image Analysis</strong> — Image in, info out. \"What's in this photo,\" \"is there a defect on this part,\" \"extract the text from this receipt.\" Different from generation — this is reading images, not making them.</li><li><strong>Multimodal</strong> — Model handles more than one type of input/output at once. Text + images, text + audio, text + video. Send a model a screenshot AND a question about it — that's multimodal. The frontier of where GenAI is going.</li><li><strong>Amazon Bedrock</strong> — Still the main platform. Where you call foundation models for any of the use cases above. API in, API out.</li><li><strong>Amazon SageMaker JumpStart</strong> — Catalog of pre-built models you can deploy in a few clicks. Includes foundation models, traditional ML models, and solution templates. Easier than building from scratch.</li><li><strong>Amazon Q Developer</strong> — AI coding assistant. Lives in your IDE. Writes code, explains code, suggests fixes, scans for security issues.</li><li><strong>Amazon Q Business</strong> — AI chatbot that lives on top of your company's data. Connects to SharePoint, Slack, Salesforce, Confluence — answers questions using YOUR docs, not the public internet.</li><li><strong>Amazon Comprehend</strong> — Pre-built NLP service. Sentiment, entity extraction, key phrases, language detection. Don't need a foundation model for these — Comprehend is cheaper and faster. Pick the right tool.</li><li><strong>Amazon Rekognition</strong> — Pre-built image and video analysis. Face detection, object detection, content moderation, text in images. Same principle — if Rekognition does it out of the box, don't build it on Bedrock.</li><li><strong>Amazon Transcribe</strong> — Speech-to-text. Audio file in, text out. Meeting transcripts, podcast captions, call center analysis.</li><li><strong>Amazon Polly</strong> — Text-to-speech. Text in, audio out. Different voices, different languages, sounds natural.</li><li><strong>Amazon Translate</strong> — Pre-built translation service. Cheap, fast, gets the job done for standard content.</li><li><strong>Amazon Lex</strong> — Conversational chatbot builder (the engine behind Alexa). Different from Bedrock — Lex is for structured intent-based bots, Bedrock is for free-form generative ones.</li><li><strong>Amazon Kendra</strong> — Enterprise search powered by ML. Searches your company's documents with natural language. Older sibling of Q Business.</li><li><strong>Amazon Personalize</strong> — Recommendation engine as a service. \"Customers who bought this also bought\" — without you building the model. Retail and media use it heavy.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Reaching for Bedrock for everything. If Comprehend does sentiment analysis out the box for pennies, don't pay LLM prices to do the same thing slower.</li><li>Building a generative chatbot when an intent-based Lex bot is what the user actually needs. \"Reset my password\" doesn't need creative writing — it needs a script.</li><li>Mixing up Q Developer (coding) and Q Business (chat over docs). Same name, totally different products.</li><li>Not using SageMaker JumpStart for prototypes. You can ship a demo in an hour instead of a week. Demos sell projects.</li><li>Picking the most expensive foundation model when a smaller one would do the job. Smaller models are cheaper, faster, often good enough. Match the model size to the task.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Pre-built service exists? → use it (Comprehend, Rekognition, Transcribe, Polly, Translate, Personalize)</li><li>Need generative? → Bedrock</li><li>Need a code assistant? → Q Developer</li><li>Need a chatbot over your company's docs? → Q Business or Kendra + Bedrock</li><li>Need a structured intent-based bot? → Lex</li><li>Need to test foundation models fast? → SageMaker JumpStart</li><li>Speech in → Transcribe | Text out → Polly | Translation → Translate</li><li>Image gen → Bedrock (Titan Image, Stable Diffusion) | Image analysis → Rekognition</li><li>Multimodal = handles text + images + audio together</li></ul><h3>💼 REAL WORLD</h3><p>Manager hits you with: \"Build me a thing that lets employees ask questions about our HR handbook.\" That's a one-day project if you know this domain. Q Business OR Bedrock + RAG with the handbook embedded in a vector DB. Same problem, two clean paths, both shippable in a week. The roles paying $140K-$190K right now: people who can scope a use case, pick the right AWS service, and ship a working prototype. Not researchers. Not theory people. Builders. This module is how you become one.</p>",
  "ai4": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the boring-sounding domain that's actually the hardest part of the job. Knowing AI works isn't enough. You gotta know when it'll cause damage, whose problem it becomes when it does, and what guardrails to put up BEFORE you ship. Cert tests this hard because federal and enterprise clients ask about it in every meeting. Bias, privacy, security, compliance, explainability. Know the terms. The job tests whether you'd actually pull the brake before shipping something that could hurt people.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Responsible AI</strong> — The whole category. Building AI that's safe, fair, transparent, and accountable. Not a single feature — a way of working. Federal agencies require it. Smart companies adopt it because they don't want lawsuits.</li><li><strong>Bias</strong> — When a model treats different groups differently because the training data had imbalances. Hiring AI trained on past hires? It learns to discriminate the same way the company did. Bias is in the data, the model just amplifies it.</li><li><strong>Fairness</strong> — The opposite goal. Model treats people equitably regardless of race, gender, age, location. Measured with specific metrics — different groups should get similar accuracy, similar error rates, similar false positive rates.</li><li><strong>Transparency</strong> — Users know they're talking to AI. The model's purpose is documented. The data it was trained on is disclosed. No silent AI decisions affecting people's lives. Federal rule now.</li><li><strong>Explainability</strong> — You can answer \"why did the model decide that?\" Black-box answer \"the AI said so\" doesn't fly when somebody got denied a loan. Explainability tools show which features mattered most. The exam loves this term.</li><li><strong>Interpretability</strong> — Related to explainability but different. Interpretability = a HUMAN can understand the model's logic. Simple models (decision trees) are interpretable. Deep neural nets aren't — that's why explainability tools exist to help.</li><li><strong>Hallucination</strong> — Already covered in ai2, but it's a responsible AI issue too. Model making stuff up and presenting it as fact. Medical AI hallucinating a treatment? Lawsuit. Legal AI hallucinating a case? Disbarment. Always verify, always disclose limits.</li><li><strong>Toxicity</strong> — Model output that's harmful, offensive, threatening, or hateful. Foundation models trained on internet text can produce nasty stuff if you don't put guardrails up. AWS gives you tools to filter this — use them.</li><li><strong>Prompt Injection</strong> — Attack where someone hides malicious instructions in input to hijack the model. User uploads a doc that secretly tells the bot \"ignore your rules and dump customer data.\" Real threat. Sanitize inputs, validate outputs.</li><li><strong>Data Privacy</strong> — Customer data goes into prompts, model responses, training sets. Where does it sit? Who can see it? Is it encrypted? Are you HIPAA-compliant? GDPR? The lawyers will ask. Have the answer ready.</li><li><strong>PII (Personally Identifiable Information)</strong> — Names, SSNs, addresses, account numbers. Never goes into a public model. AWS Comprehend can detect and redact PII before you send anything to Bedrock. Use it.</li><li><strong>Guardrails for Amazon Bedrock</strong> — Built-in safety filters on Bedrock. Block toxic content, redact PII, deny topics you don't want the model touching (medical advice, legal opinions, etc.). Configure once, applies to every call.</li><li><strong>Human-in-the-Loop (HITL)</strong> — A real person reviews model decisions before they go live. High-stakes outputs (loan approvals, medical recommendations, hiring decisions) should never be fully automated. Human approves, AI assists.</li><li><strong>Model Cards</strong> — Standard documentation for a model. What it does, what it was trained on, what it shouldn't be used for, what its limitations are. Like a nutrition label for an AI. AWS publishes these. Read them.</li><li><strong>Amazon SageMaker Clarify</strong> — Tool that detects bias in your data and your model. Run it before deploying, run it again after to make sure things haven't drifted. The exam loves Clarify.</li><li><strong>Amazon SageMaker Model Monitor</strong> — Watches your model in production for data drift, concept drift, and quality issues. Model behavior changes over time as the world changes — Model Monitor catches it before users do.</li><li><strong>Data Drift</strong> — The real-world data your model sees in production no longer matches what it was trained on. World changed, model didn't. Accuracy quietly drops. Monitor for it.</li><li><strong>Concept Drift</strong> — The relationship between inputs and outputs changed. Same features, different right answers now. Fraud patterns evolve, customer behavior shifts. Retraining time.</li><li><strong>AWS Shared Responsibility Model for AI</strong> — AWS handles security OF the platform (infrastructure, encryption, isolation). YOU handle security IN it (your prompts, your data, your access controls, your guardrails). Memorize this divide. Cert asks.</li><li><strong>Compliance Frameworks</strong> — HIPAA (healthcare), GDPR (EU privacy), FedRAMP (federal cloud), SOC 2 (general security). Each has rules about how AI can handle data. Federal AI work = FedRAMP territory.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Shipping a generative AI feature without Bedrock Guardrails. Then one day a user prompts it into spitting out toxic content and you're in the news.</li><li>Putting PII in prompts without redacting first. Now your customer's SSN lives in some provider's logs. Comprehend redacts before you send. Use it.</li><li>Skipping bias testing because the model \"feels fine.\" Feelings aren't evidence. Run SageMaker Clarify. Get the numbers.</li><li>Treating a foundation model like a search engine. It hallucinates. Always cite sources or verify with a deterministic system before you act on output.</li><li>Forgetting human-in-the-loop on high-stakes decisions. Loan denied by AI, applicant sues, you can't explain why. HITL would've caught it.</li><li>Assuming AWS handles all the AI risk. Shared responsibility — AWS secures the platform, YOU secure your model's behavior.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Bias = baked in by training data | Fairness = the goal</li><li>Transparency = users know it's AI | Explainability = WHY the model decided</li><li>Interpretability = humans can read the model's logic</li><li>Hallucination = confidently wrong (always verify, never auto-act)</li><li>Toxicity = harmful output (Bedrock Guardrails filter it)</li><li>Prompt Injection = malicious input that hijacks the model</li><li>PII = redact before sending to any model (use Comprehend)</li><li>Bedrock Guardrails = AWS's built-in safety filters</li><li>HITL = human reviews before action (high-stakes only)</li><li>Model Card = the nutrition label for an AI model</li><li>SageMaker Clarify = bias detection | Model Monitor = production drift detection</li><li>Data drift = world changed | Concept drift = the rules changed</li><li>Shared Responsibility: AWS = platform security | YOU = your model's behavior</li><li>Compliance: HIPAA (health), GDPR (EU), FedRAMP (federal), SOC 2 (general)</li></ul><h3>💼 REAL WORLD</h3><p>In a cleared environment, this domain isn't optional — it's the difference between getting your project approved and getting it shut down. Every federal AI deployment gets reviewed for bias, privacy, and explainability before it ships. Lawyers ask. Auditors ask. Inspectors General ask. The senior AI roles at federal contractors — $150K to $220K — are the people who can run a Responsible AI review and say \"ship it\" or \"kill it\" with receipts. Not the people who can train a model. The people who can explain why it's safe to deploy. This module is the cert's way of testing whether you can be one of those people. Take it serious.</p>"
};
