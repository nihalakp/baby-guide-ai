import { useEffect, useRef } from 'react';
import { HeartIcon } from './Icons';

const LIVE_MESSAGES = {
  idle: '',
  loading: 'Searching the guidelines.',
  done: 'Answer ready.',
  error: 'Something went wrong.',
};

export default function AnswerPanel({ status, result, slow, onRetry }) {
  const headingRef = useRef(null);

  // Move focus to the answer so screen reader users land on it.
  useEffect(() => {
    if (status === 'done' && headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, [status, result]);

  const chunks = result && Array.isArray(result.chunks_used) ? result.chunks_used : [];

  return (
    <div className="answer-panel" aria-busy={status === 'loading'}>
      <p className="sr-only" role="status">
        {LIVE_MESSAGES[status]}
      </p>

      {status === 'idle' && (
        <div className="card empty-card">
          <span className="empty-icon">
            <HeartIcon size={40} />
          </span>
          <h2 className="empty-title">Your answer will appear here</h2>
          <p className="muted">
            Every answer has four parts: a direct answer, guidance for your child's age group,
            when to call the doctor, and the source passages it came from.
          </p>
        </div>
      )}

      {status === 'loading' && (
        <div className="card loading-card">
          <h2 className="empty-title">Searching the guidelines&hellip;</h2>
          <div className="skeleton" />
          <div className="skeleton skeleton-short" />
          <div className="skeleton" />
          {slow && (
            <p className="muted slow-note">
              The server may be waking up after a quiet spell. This can take up to a minute.
            </p>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="card error-card" role="alert">
          <h2 className="empty-title">We couldn't get an answer</h2>
          <p className="muted">
            Check your connection and try again. If it keeps happening, the server may still be
            waking up, so give it a minute.
          </p>
          <button type="button" className="btn-secondary" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {status === 'done' && result && (
        <article className="card answer-card">
          <p className="eyebrow">{result.age}</p>
          <p className="asked">&ldquo;{result.question}&rdquo;</p>

          <h2 className="answer-title" ref={headingRef} tabIndex={-1}>
            Answer
          </h2>
          <p className="answer-text">{result.answer}</p>

          {result.age_relevance && (
            <section className="answer-section">
              <h3>For your child's age</h3>
              <p>{result.age_relevance}</p>
            </section>
          )}

          {result.when_to_call_doctor && (
            <section className="answer-section callout">
              <h3>When to call the doctor</h3>
              <p>{result.when_to_call_doctor}</p>
            </section>
          )}

          {(result.source || chunks.length > 0) && (
            <section className="answer-section">
              <h3>Where this came from</h3>
              {result.source && <p className="source-text">{result.source}</p>}
              {chunks.length > 0 && (
                <details className="passages">
                  <summary>View source passages ({chunks.length})</summary>
                  <ol>
                    {chunks.map((chunk, index) => (
                      <li key={index}>{chunk}</li>
                    ))}
                  </ol>
                </details>
              )}
            </section>
          )}
        </article>
      )}
    </div>
  );
}
