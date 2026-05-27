// Auto-generated from rot-quiz/index.html. Regenerate: node scripts/extract-quiz-data.js
export type Question = { q: string; options: string[]; answer: number; exp: string };
export type Domain = { id: string; name: string; questions: Question[] };
export type Track = { id: string; name: string; domains: Domain[] };

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
  }
];

export const LESSONS: Record<string, string> = {
  "csa1": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>You can't drive the car if you don't know where the steering wheel is. This module is the dashboard tour. Where stuff lives, how to find it fast, how to make it yours.</p><p>People skip this. Then they stay slow forever. The cert exam will ask you to name the parts. The job will test how fast you find them. Both matter.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Application Navigator</strong> — Left sidebar. Your TV remote. Type in the filter box and the menu narrows down live. Every module in ServiceNow is in here somewhere.</li><li><strong>Content Frame</strong> — The big area on the right. Your desk. Lists, forms, dashboards — all the work happens here.</li><li><strong>Banner</strong> — The top bar. Logo, global search, your name, the gear icon. Always visible. Gear = your personal settings (timezone, theme, accessibility).</li><li><strong>Favorites</strong> — Star anything in the Navigator and it pins to the top. Open the same thing 20 times a day? Favorite it. Stop wasting clicks.</li><li><strong>History</strong> — The clock icon at the top of the Navigator. Shows the last records and modules you touched. Saves you when you forgot what you were just on.</li><li><strong>Service Portal</strong> — The pretty side, the public side. Where regular employees come to submit requests, search the knowledge base, browse the catalog. Navigator = IT side. Portal = customer side. Two doors, same building.</li><li><strong>Impersonate User</strong> — Lets admins see ServiceNow exactly as another user sees it. User says \"I can't see this\" — you impersonate them, you see exactly what they see. Stop guessing, start fixing.</li><li><strong>Polaris / Next Experience</strong> — The new look — rounded edges, lighter palette, cleaner type. Same plumbing as the old UI16, different paint job. Some clients still run UI16, so know both names.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Working in one tab. Right-click any record number and pick \"Open in New Tab\" — keep your filtered list, work the record, close the tab. Stop losing your place.</li><li>Trying to fix an access issue without Impersonating. Cool, enjoy your two-hour ACL hunt for something that would've taken 90 seconds.</li><li>Saving a filter as Personal when the team needs it. Now nobody else can see it. Set the visibility BEFORE you save.</li><li>Confusing Navigator and Service Portal. Customers don't live in Navigator. Admins don't live in Portal. Don't tell a user \"go to the Application Navigator\" — they don't have one.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Gear icon (top right) = personal settings</li><li>Hamburger icon (top left) = collapse / expand the sidebar</li><li>Star = Favorite | Clock = History</li><li>Type in the filter navigator = instant fuzzy match across every module</li><li>Right-click record number → \"Open in New Tab\"</li><li>Banner is ALWAYS visible regardless of what you're doing</li><li>Polaris = Next Experience UI (new) | UI16 = older skin</li></ul><h3>💼 REAL WORLD</h3><p>Day one. Manager says \"pull up INC0012345 real quick.\" If you fumble for two minutes that's a bad first impression. Know this system like you know your phone.</p><p>Day fifty. A user opens a ticket: \"I can't see the Knowledge tab.\" You impersonate them, see exactly what's missing, fix the role in 90 seconds, move on. That's senior admin energy. Starts right here.</p>",
  "csa2": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>If forms are records up close, lists are records in a parking lot. You drive past them looking for the one you need. This module teaches you how to find your car fast — filter the lot, sort the rows, group them, export them.</p><p>This is the skill you'll use the most. Cert exam loves the encoded query syntax (the carat ^, ISEMPTY, ORDERBY). The job loves whoever can answer \"how many P1s did the network team have last quarter?\" in 60 seconds without breaking a sweat.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>List View</strong> — A table of records. Rows = records, columns = fields. Like a spreadsheet of your data — you can sort it, filter it, export it.</li><li><strong>Filter Conditions</strong> — Field + Operator + Value. The recipe for \"show me only what I want.\" Stack with AND/OR to get specific.</li><li><strong>Encoded Query</strong> — Your filter, but as a text string. Looks like <code>active=true^priority=1^ORDERBYnumber</code>. The ^ is AND. ^OR is OR. Right-click any breadcrumb to copy the query — paste anywhere to recreate the same filter. Your portable filter.</li><li><strong>ISEMPTY / ISNOTEMPTY</strong> — Operators for \"this field is blank\" or \"this field has anything in it.\" You'll use these constantly in dashboards and scheduled reports.</li><li><strong>Saved Filters</strong> — Build a complicated filter once, save it, run it with one click forever. Stop rebuilding the same thing every Monday morning.</li><li><strong>Dot-Walking</strong> — Filtering on fields from related tables. Show incidents where the Caller's Department's Manager is Sarah. Chain the dots, ServiceNow follows the trail. Senior admin move.</li><li><strong>Group By</strong> — Organize your list into collapsible chunks by a field value. Incidents grouped by Priority shows you the pile of P1s vs the pile of P3s instantly.</li><li><strong>Tags</strong> — Personal or shared sticky notes you slap on individual records. \"Follow up\" tagged across incidents AND requests AND problems. Different from filters — tags live on records, filters are conditions.</li><li><strong>Personalize List</strong> — Right-click any column header to add or remove columns from YOUR view. Doesn't affect anyone else. Stop staring at columns you don't need.</li><li><strong>Export</strong> — Download list data as Excel, CSV, PDF, or XML. Your manager will ask for an Excel of \"all open changes\" at least once a week. Know how.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building a 30-minute filter and forgetting to save it. Click away and it's gone. Save first, run second.</li><li>Saving a filter as Personal when the whole team needs it. Now you're the only one who has it. Set visibility to Group or Everyone before saving.</li><li>Skipping the encoded query syntax. The exam loves it. The job loves it more — sharing a URL with a query baked in is faster than walking somebody through six clicks.</li><li>Trying to dot-walk a field that doesn't reference another table. Only Reference fields can dot-walk. The dropdown only shows you the ones that qualify.</li><li>Picking the wrong operator. \"starts with\" vs \"contains\" vs \"is\" — three different result sets. Read what you click.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li><code>^</code> = AND in encoded queries</li><li><code>^OR</code> = OR in encoded queries</li><li><code>^ORDERBY field</code> = sort A→Z | <code>^ORDERBYDESC field</code> = sort Z→A</li><li><code>ISEMPTY</code> / <code>ISNOTEMPTY</code> = blank / not blank</li><li>Right-click breadcrumb → \"Copy query\" = your filter as a portable string</li><li>Right-click column header → Group By, Sort, Personalize List, Configure</li><li>Default rows per page = 20 (configurable)</li><li>Export formats: Excel (.xlsx), CSV, PDF, XML</li></ul><h3>💼 REAL WORLD</h3><p>4:47pm Friday. Manager Slacks: \"How many P1 incidents did the network team have last month?\" If you know this module, that's a 60-second answer — open Incident, filter <code>priority=1^assignment_group=Network^opened_atONLast month</code>, count, export, send.</p><p>If you don't know this module, that's a 10-minute scramble while your manager is staring at the chat. That gap, every day, for 90 days — that's how probation goes either really well or really bad.</p>",
  "csa3": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>Lists are how you find a record. Forms are how you actually do something with it. This module is everything that lives on a form — the fields, the sections, the rules that hide and show stuff, the scripts that fire when you save.</p><p>This is where ServiceNow admins get hired. Every business unit has a request: \"make this field show up only when…\" \"make this mandatory if…\" \"auto-fill this when that changes.\" That's all this module. Cert hits this hard.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Form vs List</strong> — List = many records summarized. Form = one record up close. Click a record number in any list, the form opens.</li><li><strong>Sections</strong> — Visual buckets of related fields on a form. On Incident: Details, Resolution, Notes, Related Records. Each section can collapse so you only see what you need.</li><li><strong>Mandatory Fields</strong> — Red asterisk (*). Form won't save until you fill them. Set in the Dictionary, in a UI Policy, or in a Data Policy.</li><li><strong>Work Notes vs Additional Comments</strong> — Work Notes = INTERNAL. Customer never sees them. Additional Comments = customer gets an email. Mix these up and your private notes just hit the requester's inbox. This is what gets people fired.</li><li><strong>UI Policy</strong> — No-code rule that runs in the browser. \"When Priority = Critical, make Impact mandatory.\" Front-end only. Fires while you're typing.</li><li><strong>Data Policy</strong> — Same idea as UI Policy but enforced on the back-end. Fires no matter how the data comes in — form, import, REST API, list edit. Need a mandatory field even on imports? Data Policy.</li><li><strong>Business Rule</strong> — Server-side script that runs when records are created, read, updated, or deleted. \"Before\" timing = change the record before it saves. \"After\" timing = react after it saves (send notification, etc.). More power than UI Policy, costs you JavaScript.</li><li><strong>Client Script</strong> — JavaScript that runs in the browser on form events: onLoad, onChange, onSubmit. UI Policies are no-code. Client Scripts are when you need actual code on the front-end.</li><li><strong>Form View</strong> — Multiple layouts of the same form for different audiences. Service desk sees the full form, ESS users see a stripped-down version, mobile gets a tighter one. Same record, different windows.</li><li><strong>Variable Set</strong> — A reusable group of catalog variables. Build the set once, attach it to every catalog item that needs the same questions. Update the set, every item updates.</li><li><strong>Dictionary</strong> — The master spec sheet for every table and field — data type, max length, default value, mandatory, choices. When something acts weird, the dictionary explains why.</li><li><strong>Coalesce</strong> — Field marker for imports that says \"if a record with this value already exists, UPDATE it, don't create a duplicate.\" Stops your import from making 800 copies of every user.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Mixing up UI Policy and Business Rule. UI Policy = browser-side, only fires when somebody uses a form. Business Rule = server-side, fires on every CRUD operation. Different timing, different reach.</li><li>Putting internal info in Additional Comments because you weren't paying attention. The customer just got an email with your private notes. Career-ending mistake. Read the field label every time.</li><li>Building 14 separate UI Policies when ONE Data Policy would have covered every path into the data.</li><li>Adding fields to the Form Layout but forgetting they need ACLs to be visible to lower-privileged users. Field is \"there\" but nobody but admins can see it.</li><li>Using a Business Rule to do something a UI Policy could do. Now your logic only runs on save instead of as the user types — bad UX, slower form.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>UI Policy = front-end (browser, form only)</li><li>Data Policy = back-end (form + import + API + list edit)</li><li>Business Rule timings: Before, After, Async, Display</li><li>Work Notes = INTERNAL | Additional Comments = CUSTOMER-FACING</li><li>Mandatory marker = red asterisk (*)</li><li>Form Designer = drag-and-drop form layout (Configure → Form Design)</li><li>Variable Set = reusable bundle of catalog variables</li><li>Coalesce = match-or-create field for imports (kills duplicates)</li><li>Reference field = a field that points to a record in another table</li></ul><h3>💼 REAL WORLD</h3><p>Business unit says: \"When somebody submits a high-priority incident, automatically show the Major Incident fields and make Impact mandatory.\" That's a UI Policy. 10 minutes of work if you know this module.</p><p>Two weeks later they come back: \"We need that same rule when records come in from the monitoring tool too.\" Now you need a Data Policy because the API path doesn't load forms. Same rule, different lane. This back-and-forth fills an admin's calendar — it's literally what they pay you for.</p>",
  "csa4": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the money module. Flow Designer is how you automate work in ServiceNow without writing code. Tickets get created, routed, approved, escalated, and closed by themselves. Build one good flow and you save the team 100 hours a year.</p><p>If you only learn one module deeply, make it this one. Workflow (the old graphical engine) is being phased out — everything new goes through Flow Designer. Companies are paying $200/hr for people who can migrate legacy Workflow content to Flow. That can be you.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Flow Designer</strong> — The no-code automation builder. Drag and drop. Trigger → Actions → Done. The modern engine.</li><li><strong>Trigger</strong> — What kicks off the flow. Record created, field changed, schedule, inbound API, manual button. Every flow has exactly ONE trigger.</li><li><strong>Actions</strong> — The \"do something\" steps. Create a record, send an email, update a field, look up data, call an API, ask for approval.</li><li><strong>Subflow</strong> — A reusable chunk of automation called FROM a flow. Like a function. Build common logic once, call it from 10 different flows. Don't copy-paste, subflow it.</li><li><strong>Action Designer</strong> — Where you build your own custom action when none of the out-of-box ones fit. Wrap a script or REST call in a clean input/output package. Now any flow can drag it in.</li><li><strong>Look Up Records</strong> — Action that queries a table with conditions and returns matching records for use in later steps. Your \"go find me\" step.</li><li><strong>For Each (Loop)</strong> — Iterates through a list of records and runs the same actions on each one. One loop, many records handled.</li><li><strong>Wait For Condition</strong> — Pauses the flow until something becomes true. Wait for the incident to be Resolved. Wait for the change to be Approved. Then keep going.</li><li><strong>Try / Catch</strong> — Error handling block. Try runs the risky action; if it fails, Catch handles it. Without it, one bad API call halts the whole flow and somebody has to babysit.</li><li><strong>Approval Action</strong> — Pauses the flow, sends an approval to specified users, branches based on yes/no. Change Management runs on this.</li><li><strong>Decision Table</strong> — Structured table of conditions mapped to outcomes. Cleaner than nested If/Then logic when you've got 8 branches.</li><li><strong>Integration Hub</strong> — Add-on that extends Flow Designer with pre-built spokes for outside systems (Slack, Jira, Microsoft, AWS).</li><li><strong>Spoke</strong> — A packaged set of actions for a specific outside system. Install the Slack spoke, drag \"Post Message\" into your flow, done. No API knowledge needed.</li><li><strong>Connection &amp; Credential Alias</strong> — A pointer that lets a flow reference \"the Slack connection\" without hard-coding the URL or credentials. Dev points to dev Slack, prod points to prod Slack. Promote the flow up the pipeline, no code changes.</li><li><strong>Scheduled Flow</strong> — Flow triggered by a schedule (daily, weekly, specific date) instead of a record event. Nightly cleanup, weekly reports.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building flows in Production. Don't. Build in Dev, capture in an Update Set, promote to Test, validate, promote to Prod.</li><li>Forgetting to publish. Unpublished flow doesn't run. People burn 20 minutes troubleshooting \"why isn't this firing\" — it's because they hit Save instead of Save and Publish.</li><li>Hard-coding credentials in a flow. Use Connection &amp; Credential Aliases so dev/test/prod each use their own creds without you editing the flow every time.</li><li>Skipping error handling. One unreachable API and your whole flow crashes. Wrap risky steps in Try/Catch — give it somewhere to land when things break.</li><li>Reaching for Flow when a 5-line Business Rule would've done it. Flow is great. It's not always the right hammer.</li><li>Confusing Flow with Workflow. Workflow = older graphical engine, mostly legacy. Flow Designer = the future. New work goes in Flow.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Every flow = exactly ONE trigger</li><li>Trigger types: Record, Schedule, Application, Inbound Email, Service Catalog, MetricBase</li><li>Save ≠ Publish. Both, every time.</li><li>Try / Catch wraps risky actions</li><li>Subflow = reusable function-style logic</li><li>Action Designer = build your own action</li><li>Connection &amp; Credential Alias = portable creds across environments</li><li>Run As: System User (full access) vs User Who Initiates Session (their ACLs)</li><li>Integration Hub spokes = pre-built actions for outside systems</li></ul><h3>💼 REAL WORLD</h3><p>Service desk is drowning. Every new incident, somebody manually checks the caller's department, finds the right assignment group, assigns, then notifies the team in Slack. 90 seconds per ticket × 200 tickets a day = 5 hours of human time a day on copy-paste work.</p><p>You build one flow: trigger on incident insert, look up the caller's department, set the assignment group, post to the team's Slack channel via the Slack spoke. 5 hours a day → 0. Now your manager has a quote for the company newsletter and you have leverage at your next review.</p>",
  "csa5": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>Leadership doesn't live in the platform. They live in numbers. This module is how you take what's happening in ServiceNow and put it on a screen executives understand in 5 seconds.</p><p>If you can't show the work, the work didn't happen. Reporting is how you become the person leadership trusts. Cert tests you on report types and dashboard mechanics. The job tests you on whether your charts answer the actual question.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Reports</strong> — Pull data from any table and visualize it. Bar, pie, line, list, pivot. Build once, share with the team. The base unit.</li><li><strong>Dashboards</strong> — Multiple reports + gauges on one page. Your manager opens this every morning to know what's happening. Their command center.</li><li><strong>Gauges</strong> — Single-number widgets with color coding. Open P1 incidents: 3 (green). SLA compliance: 67% (red). At-a-glance health.</li><li><strong>Scheduled Report</strong> — Auto-runs and emails the result on a schedule. Set it up once, your manager gets Monday morning metrics without ever asking you. You look organized while you sleep.</li><li><strong>Group By</strong> — Segments report data by a field. Incidents BY priority. Requests BY department. Each group becomes a bar or a slice.</li><li><strong>Aggregate</strong> — Counts, sums, or averages across records. \"How many\" and \"how much\" answers.</li><li><strong>Pivot Table</strong> — Two-dimension report. Rows = priority, columns = assignment group, cells = counts. Cross-tabulation in one visual. Bar charts can't do this.</li><li><strong>Heatmap</strong> — Color-intensity grid. Show incidents by hour-of-day vs day-of-week and you SEE your busy times instantly. Pattern recognition without thinking.</li><li><strong>Multi-Dataset Report</strong> — Combine data from two different tables in one chart. Open incidents AND pending changes side-by-side.</li><li><strong>Drilldown</strong> — Click a bar in a chart and see the actual records behind that number. Summary → detail in one click.</li><li><strong>Dashboard Filter</strong> — A filter that sits at the top of a dashboard and slices EVERY report on the page when the viewer changes it. Different from a Report Condition (which is hard-coded into the report).</li><li><strong>Performance Analytics (PA)</strong> — Premium analytics module that captures historical data over time. Trend analysis, predictive insights, scorecards. Costs extra. Senior admin skill.</li><li><strong>Responsive Dashboard</strong> — The newer dashboard format that auto-adjusts to phone, tablet, desktop. Replacing the older Homepage dashboards over time.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building a beautiful chart that doesn't answer the question. Read the request twice before you pick a chart type.</li><li>Pie chart with 12 slices. Nobody can read it. Use a bar chart when you've got more than ~5 categories.</li><li>Saving a report as Personal when leadership needs to see it. Now nobody can open it. Set visibility to roles, groups, or everyone.</li><li>Forgetting Drilldown is enabled by default. Tell your manager \"click the bar\" — turns a static screenshot into an interactive tool.</li><li>Mixing up Dashboard Filter and Report Condition. Condition is baked into the report. Filter slices everything at runtime.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Bar = comparing | Line = trend over time | Pie = parts of a whole (≤5 slices)</li><li>Pivot = two dimensions at once</li><li>Heatmap = density across two dimensions (color = volume)</li><li>Multi-dataset = data from multiple tables in one chart</li><li>Gauge = single-number widget with thresholds</li><li>Scheduled Report = auto-email on a schedule</li><li>Drilldown = click chart → see records</li><li>Dashboard Filter = runtime, slices everything | Report Condition = baked-in</li><li>Responsive Dashboard = mobile-ready (newer) | Homepage = legacy</li></ul><h3>💼 REAL WORLD</h3><p>Manager asks: \"Build me a weekly view — incident volume by team, average resolution time, and SLA compliance.\" That's three reports on one dashboard, scheduled to email every Monday at 7am.</p><p>You build it once. Six months later, you're the person leadership name-drops in the all-hands meeting because they have data nobody else can produce. THAT is how you become indispensable. Starts with one good dashboard.</p>",
  "csa6": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>Who can do what in ServiceNow is controlled by Roles, Groups, and ACLs. This module is the security/access layer — onboarding new users, offboarding people who left, making sure everyone sees exactly what they should and nothing they shouldn't.</p><p>Get this wrong and either nobody can do their job (you'll be the most-hated admin in IT), or everyone has admin access (you'll be in the post-incident meeting explaining why). Cert hits this constantly. Job hits it harder.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Roles</strong> — Named bundles of permissions. The <code>itil</code> role = standard ITSM user. The <code>admin</code> role = full keys to the kingdom. Assign roles to GROUPS, not individuals (best practice).</li><li><strong>Groups</strong> — Collections of users. Assignment groups route work (Network, Desktop Support, AD Team). Security groups control access.</li><li><strong>ACLs (Access Control Lists)</strong> — The actual security rules. Who can read, write, create, delete which records and fields. The bouncer at every door in the platform. Hits role + condition + script before letting you through.</li><li><strong>Active Flag</strong> — Checkbox on a user record. Uncheck to disable a user without deleting them. Preserves all their history (every ticket they touched, every change they approved). ALWAYS deactivate, NEVER delete.</li><li><strong>LDAP Integration</strong> — Syncs users from Active Directory automatically. New hire shows up in AD on Monday → shows up in ServiceNow Tuesday morning. Termed employee disabled in AD → deactivated in ServiceNow same day.</li><li><strong>SSO (Single Sign-On)</strong> — Users log in with their corporate credentials. No separate ServiceNow password. Standard in any enterprise. Way fewer \"I forgot my password\" tickets.</li><li><strong>Multi-Provider SSO</strong> — Different sets of users authenticate through different identity providers. Useful when an acquisition brought in users on a different IDP, or a partner needs limited access.</li><li><strong>Domain Separation</strong> — Logical data isolation on a single instance. MSPs use it so Customer A's data is invisible to Customer B. Heavy lift to set up but powerful.</li><li><strong>Impersonation</strong> — Admins can temporarily see ServiceNow as a specific user. Best troubleshooting tool you have for \"I can't see X\" tickets.</li><li><strong>Delegate</strong> — Vacation coverage. Set Sarah as your delegate Aug 1–15, every approval routed to you goes to her instead. Without it, your queue piles up while you're at the beach.</li><li><strong>VIP</strong> — A flag on the user record. Triggers priority handling on their incidents and requests — auto-escalation, alerts to leadership, special queue placement.</li><li><strong>security_admin</strong> — Elevated role required to edit ACLs. You don't get it permanently — you elevate INTO it temporarily through your name menu (only if the High Security Plugin is on AND you've been assigned the role).</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Assigning roles directly to users instead of through groups. Onboarding 50 service desk reps? Add the group, they all inherit <code>itil</code>. Direct assignment to 50 users? You're clicking forever AND it's a mess to revoke later.</li><li>Deleting a user instead of deactivating. Now their history breaks, their old tickets show \"no record found,\" audit trail destroyed. Always Active = false.</li><li>Trying to edit an ACL without elevating to security_admin. The fields are read-only. You'll think it's broken. It's not — you didn't elevate.</li><li>Forgetting Domain Separation exists. User says \"I can't see Customer B's records\" — it's not a permission bug, it's because they're in Customer A's domain and that's the whole point.</li><li>Not impersonating before guessing. You'll spend an hour digging through ACLs when 30 seconds of impersonation would've shown you exactly what's wrong.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Assign roles to GROUPS, not users (best practice)</li><li>Active = false to deactivate (NEVER delete users)</li><li><code>itil</code> = standard ITSM user | <code>admin</code> = full access | <code>security_admin</code> = elevate-only</li><li>ACLs check: role + condition + script (any one fails, access denied)</li><li>LDAP = sync users from AD | SSO = log in with corporate creds</li><li>Multi-Provider SSO = different IDPs for different user groups</li><li>Domain Separation = data isolation on one instance</li><li>Delegate = vacation coverage for approvals</li><li>Impersonate = see ServiceNow as somebody else</li></ul><h3>💼 REAL WORLD</h3><p>New hire Day 1. HR sends you a ticket: \"Provision Marcus, Service Desk Tier 1, starts Monday.\" Open Marcus's user record (LDAP synced him in overnight), drop him in the Service Desk group, the group has the <code>itil</code> role attached, done. Marcus logs in Monday morning, opens an Incident, and gets to work. Three minutes of your time.</p><p>Six months later Marcus moves to the Network team. Pull him out of Service Desk, drop him in Network. Access flips automatically. No tickets, no scripts, no admin chaos. THAT is why you assign roles to groups instead of users.</p>",
  "csa7": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the heart of ServiceNow — IT Service Management. Incidents, Problems, Changes, Requests. The four big workflows every ServiceNow deployment runs on. If you understand ITSM you understand WHY ServiceNow exists.</p><p>Cert exam: probably 25-30% of the questions touch this module. Job interviews: \"walk me through how an incident gets created and resolved\" — this module is your answer. Know it cold.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Incident</strong> — Something broke. The lights are off. Restore service fast. Doesn't matter why right now — just get it working.</li><li><strong>Service Request</strong> — \"I need something.\" A new laptop, software access, an account reset. Not broken — just a normal ask. Different workflow, different SLAs.</li><li><strong>Problem</strong> — Why does the same incident keep happening? Find the root cause and kill it permanently. Incident restores service. Problem prevents recurrence.</li><li><strong>Known Error</strong> — A Problem with a documented root cause and a workaround, even if the permanent fix isn't shipped yet. Documenting it speeds up everyone after you.</li><li><strong>Change Management</strong> — Any modification to IT infrastructure goes through Change. Reduces risk, creates accountability.</li><li><strong>Change Types</strong> — Standard = pre-approved, low-risk, routine (\"reboot the email server\"). Normal = needs CAB approval. Emergency = urgent fixes, fast-tracked process.</li><li><strong>CAB (Change Advisory Board)</strong> — The committee that reviews Normal Changes. IT leaders, service owners, business stakeholders. They vote on risk before implementation.</li><li><strong>Standard Change Template</strong> — The pre-approved blueprint. The Standard Change is the live request CREATED from the template. Pre-approval lives in the template, so the live change skips CAB.</li><li><strong>Major Incident</strong> — A high-impact incident that gets a formal communication and bridge process — exec updates, war room, dedicated comms. Priority is a label; Major Incident is a process.</li><li><strong>CMDB</strong> — Configuration Management Database. Inventory of every CI in your IT environment AND how they connect. If you don't know what you have, you can't manage it.</li><li><strong>CI (Configuration Item)</strong> — Anything in your infrastructure being tracked. Servers, applications, databases, network gear, laptops. CMDB is the map.</li><li><strong>SLA</strong> — Service Level Agreement. The clock that tracks whether you're meeting response and resolution commitments. Miss your SLA and the business has receipts.</li><li><strong>Response SLA vs Resolution SLA</strong> — Response = time until somebody starts working. Resolution = time until it's fixed. Different timers, both matter.</li><li><strong>OLA vs UC</strong> — OLA (Operational Level Agreement) = between internal IT teams (Network team commits to Desktop team). UC (Underpinning Contract) = with an outside vendor (your ISP). All three together = how you actually meet your customer SLA.</li><li><strong>Priority</strong> — Impact × Urgency. P1 = drop everything. P4 = get to it when you can. ServiceNow calculates from a priority matrix automatically.</li><li><strong>Service Catalog</strong> — The menu where users request services and products. Each item has its own fulfillment workflow.</li><li><strong>RITM (Requested Item)</strong> — Created when a user orders from the catalog. A Request (REQ) holds one or more RITMs (one per item ordered).</li><li><strong>CTASK (Catalog Task)</strong> — Unit of work spawned by a RITM to fulfill the request. New-hire kit RITM might spawn 5 CTASKs — IT provisions laptop, HR sends welcome packet, facilities sets up desk, etc.</li><li><strong>Assignment Group</strong> — The team a record is routed to. Network group gets network incidents. Desktop Support gets hardware tickets.</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Treating an Incident like a Problem. Incident = restore service NOW. Don't go down a 4-hour root cause rabbit hole while users can't log in.</li><li>Submitting an Emergency Change because you didn't plan ahead. CAB notices. Auditors notice. Don't let \"emergency\" mean \"unprepared.\"</li><li>Closing an Incident as \"Resolved\" without filling in the Resolution Notes. Now nobody knows what fixed it. Next time the same thing breaks, the team rediscovers the fix from scratch.</li><li>Mixing up Priority and Major Incident. P1 is a number on the ticket. Major Incident is a whole communication process — bridge call, exec updates, status page.</li><li>Letting tickets bounce between groups. High Reassignment Count = poor routing or a turfing problem. KPI for service desk health.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Incident = restore service | Problem = root cause | Change = controlled modification | Request = ask for something</li><li>Change types: Standard (pre-approved), Normal (needs CAB), Emergency (fast-tracked)</li><li>Standard Change Template = blueprint | Standard Change = the live request created from it</li><li>Priority = Impact × Urgency (P1 → P4)</li><li>Major Incident = process designation, not a priority</li><li>SLA = customer-facing | OLA = internal IT teams | UC = outside vendor</li><li>Response SLA = time to start | Resolution SLA = time to fix</li><li>REQ → RITM → CTASK (Request → Requested Item → Catalog Task)</li><li>CMDB = inventory of CIs + their relationships</li></ul><h3>💼 REAL WORLD</h3><p>Email is down for the entire company. Tickets are flooding in. You flag the parent ticket as a Major Incident, kick off the bridge call, post status updates every 15 minutes. Engineering identifies the bad config push, opens an Emergency Change to roll back, change goes through fast-tracked CAB, email comes back in 47 minutes.</p><p>Next week somebody opens a Problem record to investigate why the original change made it to prod without anyone catching the bad config. Root cause found, Known Error documented, automation built so it never happens again. THAT is the full ITSM lifecycle in motion. Cert tests it. Job lives it.</p>",
  "csa8": "<h3>📖 WHAT THIS MODULE IS ABOUT</h3><p>This is the engine room. Update Sets, integrations, scheduled jobs, import sets, REST APIs. This is what separates a basic admin from a senior admin. Master this and you're in a different pay bracket — $100K-$150K territory.</p><p>Cert tests the concepts. The job tests whether you can move 30 update sets from dev to prod without breaking production. Big difference. Both matter.</p><h3>🔑 KEY CONCEPTS IN BO TERMS</h3><ul><li><strong>Update Sets</strong> — How configuration changes travel between instances. Build in Dev, capture in an update set, promote to Test, promote to Prod. Never build directly in Production. Ever.</li><li><strong>Update Set Batch</strong> — Multiple update sets grouped under one parent. Move the parent, all children flow together in dependency order. Saves you from \"which set do I commit first?\" headaches.</li><li><strong>Instance Environments</strong> — Dev (build) → Test/UAT (validate) → Production (live). Changes flow one direction, like a river.</li><li><strong>Cloning</strong> — Copies a source instance (usually Prod) onto a target (usually Dev or Test). Gives developers a realistic environment to test against.</li><li><strong>Scheduled Jobs</strong> — Scripts that run automatically on a schedule. Nightly cleanups, daily imports, weekly reports.</li><li><strong>Background Scripts</strong> — Ad-hoc, run-once scripts you fire in the current instance. NOT captured in update sets — they don't travel. Use for one-time dev pokes.</li><li><strong>Fix Scripts</strong> — Saved scripts that ARE captured in update sets and run when the set is committed in the target. Use to fix bad data or finish a setup step that can't be captured as configuration.</li><li><strong>Import Sets</strong> — Stage external data (CSVs, JSON, etc.) before loading into ServiceNow. Lets you transform and validate before the real write.</li><li><strong>Transform Map</strong> — Rules that translate Import Set fields to target table fields. \"Column FIRST_NAME maps to User table field first_name.\"</li><li><strong>MID Server</strong> — Java agent installed on-premise that lets ServiceNow reach systems inside your firewall. The bridge between cloud ServiceNow and your internal network.</li><li><strong>Discovery</strong> — Automated process that scans your network and populates the CMDB with what it finds. Keeps your CI inventory current without humans typing.</li><li><strong>System Properties</strong> — Key-value settings that control platform behavior. Email config, session timeouts, default values. Where you tune the platform.</li><li><strong>Plugins</strong> — Optional platform components that turn on additional features. ITSM, HRSD, CSM are all plugins. Some included, some cost extra.</li><li><strong>Application Repository (Application Manager)</strong> — Hub where you install ServiceNow Store apps and ServiceNow-published plugins. Different from Update Sets — Update Sets move custom config, Repository handles marketplace stuff.</li><li><strong>Scope</strong> — Application namespace that isolates your custom app from out-of-box content. Prevents your customizations from getting nuked on the next platform upgrade.</li><li><strong>REST API</strong> — How outside systems talk to ServiceNow. Create, read, update, delete records via HTTP. Foundation of every integration.</li><li><strong>Script Include</strong> — Reusable server-side JavaScript library. Write common logic once, call it from Business Rules, REST APIs, Flows, anywhere on the server.</li><li><strong>Inbound Email Action</strong> — Rule that processes emails coming INTO ServiceNow. Email creates an incident, email adds a comment to a ticket, email closes a record.</li><li><strong>Upgrade History</strong> — Tracks every platform version upgrade — what was applied, what was Skipped (your customization kept), what was Reverted (OOB version taken).</li></ul><h3>🎯 COMMON PITFALLS</h3><ul><li>Building in Production. There is no recovery from this when something breaks. Build in Dev, always.</li><li>Forgetting which Update Set was active. You build a UI Policy in Dev, never set the active update set, the change goes into \"Default\" — now you can't move it. Always check the upper-right corner before you build.</li><li>Cloning Prod over Dev without a backup of Dev's customizations. Years of dev work, gone. Always export your Dev customizations BEFORE a clone.</li><li>Confusing Background Scripts with Fix Scripts. Background = dies in current instance, never travels. Fix Script = captured in update set, runs when committed. If you need it to travel, use Fix Script.</li><li>Skipping every conflict during an upgrade. Now you missed a bunch of platform improvements forever. Read each conflict — sometimes Revert is the right call.</li><li>Hard-coded credentials in scripts or flows. Use System Properties or Connection Aliases. Don't be the person whose code committed a password to source control.</li></ul><h3>📝 BO CHEAT SHEET</h3><ul><li>Dev → Test → Prod (changes flow one way, never reverse)</li><li>Update Set = config travels | Update Set Batch = multiple sets as one unit</li><li>Background Script = current instance only, NOT captured</li><li>Fix Script = captured in update set, runs on commit in target</li><li>Import Set + Transform Map = stage + map external data</li><li>MID Server = bridge to systems behind your firewall</li><li>Discovery = auto-populates CMDB</li><li>Plugins = built-in features (some free, some paid)</li><li>Application Repository = ServiceNow Store apps &amp; plugins (different from Update Sets)</li><li>Scope = namespace that isolates your custom app</li><li>Upgrade conflict choices: Skip (keep custom) or Revert (take OOB)</li></ul><h3>💼 REAL WORLD</h3><p>Senior admin and developer roles pay $100K-$150K because companies need people who can manage Update Sets, build integrations, and keep platform health steady. Most admins never get past CSA basics. The ones who master this module become the people their team calls when something breaks at 11pm.</p><p>You're going to ship a quarterly release: 30 update sets across 4 features, batched, promoted from Dev to Test, validated by QA, batched again, promoted to Prod with a Fix Script that cleans up legacy data on commit. Zero downtime, zero rollback. Do that twice and you're getting a raise. Do it four times and you're CAD/CIS material. Starts here.</p>"
};
