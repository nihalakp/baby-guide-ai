import { API_URL } from './config';

// The backend contract: POST /ask with { question, age } returns
// { answer, age_relevance, when_to_call_doctor, safe_at_home, source, chunks_used }.
export async function askGuide({ question, age }) {
  const response = await fetch(`${API_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, age }),
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}
