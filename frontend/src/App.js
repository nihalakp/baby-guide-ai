import { useState } from 'react';
import './App.css';

function App() {
  const [age, setAge] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer(null);

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, age }),
      });
      const data = await response.json();
      setAnswer(data);
    } catch (error) {
      setAnswer({ answer: 'Something went wrong. Please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Baby Guide AI</h1>
      <p className="subtitle">Pediatric answers grounded in real CDC/AAP guidelines</p>

      <div className="form">
        <input
          type="text"
          placeholder="Child's age (e.g. 2 years)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <textarea
          placeholder="Your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={handleAsk} disabled={loading || !question || !age}>
          {loading ? 'Searching guidelines...' : 'Ask Baby Guide AI'}
        </button>
      </div>

      {answer && (
        <div className="answer-card">
          <h3>Answer</h3>
          <p>{answer.answer}</p>

          {answer.age_relevance && (
            <>
              <h3>For your age group</h3>
              <p>{answer.age_relevance}</p>
            </>
          )}

          {answer.when_to_call_doctor && (
            <>
              <h3>Call the doctor if</h3>
              <p>{answer.when_to_call_doctor}</p>
            </>
          )}

          {answer.source && (
            <p className="source">Source: {answer.source}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;