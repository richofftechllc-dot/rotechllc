export type ContactInfo = {
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  links?: { linkedin?: string; github?: string; website?: string };
};

export type ExperienceEntry = {
  title: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
};

export type EducationEntry = {
  school: string;
  degree?: string;
  field?: string;
  start?: string;
  end?: string;
  honors?: string;
};

export type SkillsGroup = {
  category: string;
  items: string[];
};

export type CertificationEntry = {
  name: string;
  issuer?: string;
  date?: string;
  id?: string;
};

export type ClearanceEntry = {
  level: string;
  status: string;
  type?: string;
  granted_date?: string;
};

export type StructuredResume = {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillsGroup[];
  certifications: CertificationEntry[];
  clearances: ClearanceEntry[];
};

export type TargetJob = {
  title: string;
  company?: string;
  description: string;
};

export type GeneratedResume = {
  generated_at: string;
  target_job: TargetJob;
  content_markdown: string;
  flagged_unverifiable: string[];
};
