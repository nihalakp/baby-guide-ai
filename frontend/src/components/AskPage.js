import { useEffect, useRef, useState } from 'react';
import { AGE_UNITS, SUGGESTIONS } from '../config';
import { askGuide } from '../api';
import { loadHistory, saveHistory } from '../storage';
import { formatAge } from '../utils';
import AnswerPanel from './AnswerPanel';
import PastQuestions from './PastQuestions';

const MAX_HISTORY = 10;
const SLOW_AFTER_MS = 8000;

export default function AskPage() {
  const [ageValue, setAgeValue] = useState('');
  const [unit, setUnit] = useState('months');
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [slow, setSlow] = useState(false);
  const [history, setHistory] = useState(() => loadHistory());
  const answerRef = useRef(null);

  const unitConfig = AGE_UNITS.find((u) => u.value === unit);
  const ageNumber = Number(ageValue);
  const ageValid = Number.isInteger(ageNumber) && ageNumber >= 1 && ageNumber <= unitConfig.max;
  const showAgeHint = ageValue !== '' && !ageValid;
  const canSubmit = ageValid && question.trim().length > 0 && status !== 'loading';

  // On narrow screens the answer sits below the form, so bring it into view.
  useEffect(() => {
    if (status === 'idle' || !window.matchMedia) return;
    if (window.matchMedia('(max-width: 899px)').matches && answerRef.current) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      answerRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }, [status]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    const age = formatAge(ageNumber, unitConfig);
    const trimmed = question.trim();

    setStatus('loading');
    setResult(null);
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);

    try {
      const data = await askGuide({ question: trimmed, age });
      const entry = {
        id: String(Date.now()),
        question: trimmed,
        age,
        ageValue: ageNumber,
        unit,
        ts: Date.now(),
        result: data,
      };
      const next = [entry, ...history].slice(0, MAX_HISTORY);
      setResult({ ...data, question: trimmed, age });
      setHistory(next);
      saveHistory(next);
      setStatus('done');
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
    }
  }

  function openPast(entry) {
    setAgeValue(String(entry.ageValue));
    setUnit(entry.unit);
    setQuestion(entry.question);
    setResult({ ...entry.result, question: entry.question, age: entry.age });
    setStatus('done');
  }

  function deletePast(id) {
    const next = history.filter((entry) => entry.id !== id);
    setHistory(next);
    saveHistory(next);
  }

  function clearPast() {
    setHistory([]);
    saveHistory([]);
  }

  return (
    <div className="ask-grid">
      <section className="ask-left" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero-title">
          What's going on with your little one?
        </h1>
        <p className="hero-sub">
          Share your child's age and concern. BabyGuide answers only from the pediatric guidance
          in its library, and tells you when to call the doctor.
        </p>

        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          <p className="step-label">Step 1 &middot; Your child</p>
          <label className="field-label" htmlFor="age-value">
            How old is your child?
          </label>
          <div className="age-row">
            <input
              id="age-value"
              className="text-input age-input"
              type="number"
              inputMode="numeric"
              min="1"
              max={unitConfig.max}
              step="1"
              placeholder="e.g. 2"
              value={ageValue}
              onChange={(e) => setAgeValue(e.target.value)}
              aria-describedby={showAgeHint ? 'age-hint' : undefined}
              aria-invalid={showAgeHint}
            />
            <div className="segmented" role="group" aria-label="Age unit">
              {AGE_UNITS.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  className={`segment${unit === u.value ? ' is-active' : ''}`}
                  aria-pressed={unit === u.value}
                  onClick={() => setUnit(u.value)}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          {showAgeHint && (
            <p id="age-hint" className="hint hint-error">
              Enter a whole number from 1 to {unitConfig.max} {unitConfig.value}.
            </p>
          )}

          <p className="step-label">Step 2 &middot; The concern</p>
          <label className="field-label" htmlFor="concern">
            What's worrying you?
          </label>
          <textarea
            id="concern"
            className="text-input"
            rows={3}
            placeholder="e.g. Baby running 100°F fever since this morning"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="chips" role="group" aria-label="Example concerns">
            {SUGGESTIONS.map((text) => (
              <button key={text} type="button" className="chip" onClick={() => setQuestion(text)}>
                {text}
              </button>
            ))}
          </div>

          <button type="submit" className="btn-primary" disabled={!canSubmit}>
            {status === 'loading' ? 'Searching the guidelines…' : 'Get guidance'}
          </button>
          <p className="hint emergency-note">
            In an emergency, call 911. Don't wait for an answer here.
          </p>
        </form>

        <PastQuestions
          items={history}
          onOpen={openPast}
          onDelete={deletePast}
          onClear={clearPast}
        />
      </section>

      <section className="ask-right" ref={answerRef} aria-label="Answer">
        <AnswerPanel
          status={status}
          result={result}
          slow={slow}
          onRetry={() => handleSubmit({ preventDefault() {} })}
        />
      </section>
    </div>
  );
}
