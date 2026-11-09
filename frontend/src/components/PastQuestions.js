import { timeAgo } from '../utils';
import { HistoryIcon, TrashIcon } from './Icons';

export default function PastQuestions({ items, onOpen, onDelete, onClear }) {
  if (items.length === 0) return null;

  return (
    <section className="card history-card" aria-labelledby="history-title">
      <div className="history-head">
        <h2 id="history-title" className="history-title">
          <HistoryIcon size={20} />
          Past questions
        </h2>
        <button type="button" className="link-button" onClick={onClear}>
          Clear all
        </button>
      </div>

      <ul className="history-list">
        {items.map((item) => (
          <li key={item.id} className="history-item">
            <button type="button" className="history-open" onClick={() => onOpen(item)}>
              <span className="history-q">{item.question}</span>
              <span className="history-meta">
                {item.age} &middot; {timeAgo(item.ts)}
              </span>
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => onDelete(item.id)}
              aria-label={`Delete question: ${item.question}`}
            >
              <TrashIcon size={18} />
            </button>
          </li>
        ))}
      </ul>

      <p className="hint">Saved on this device only.</p>
    </section>
  );
}
