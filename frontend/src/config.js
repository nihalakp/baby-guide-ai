// Where the frontend sends questions.
// Local dev:  put REACT_APP_API_URL=http://localhost:8000 in frontend/.env.local
// Production: set REACT_APP_API_URL in your Vercel project settings.
export const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://baby-guide-ai.onrender.com');

export const BRAND = {
  name: 'BabyGuide',
  badge: 'AAP & CDC sources only',
};

export const SUGGESTIONS = [
  'Running a 100\u00B0F fever',
  "Fever that won't go away",
  'Unexplained rash with fever',
  'Very fussy and drowsy',
];

export const AGE_UNITS = [
  { value: 'weeks', label: 'Weeks', singular: 'week', max: 104 },
  { value: 'months', label: 'Months', singular: 'month', max: 60 },
  { value: 'years', label: 'Years', singular: 'year', max: 18 },
];

// Keep this list in sync with the PDFs in docs/ whenever you re-run load_docs.py.
// The titles and publishers below are placeholders: set them to match your actual files.
export const SOURCES = [
  { file: 'fever_guidelines.pdf', title: 'Fever and your baby', publisher: 'AAP HealthyChildren.org' },
  { file: 'vaccination_guidelines.pdf', title: 'Immunization schedule', publisher: 'AAP' },
  { file: 'rashes.pdf', title: 'Rash or redness (widespread)', publisher: 'AAP HealthyChildren.org' },
];
