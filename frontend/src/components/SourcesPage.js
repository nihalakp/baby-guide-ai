import { SOURCES } from '../config';
import { FileTextIcon } from './Icons';

export default function SourcesPage() {
  return (
    <div className="sources-grid">
      <section aria-labelledby="sources-title">
        <p className="eyebrow eyebrow-green">Knowledge library</p>
        <h1 id="sources-title" className="hero-title hero-title-sm">
          Source library
        </h1>
        <p className="hero-sub">
          BabyGuide answers only from the documents listed here. If a question isn't covered,
          it says so instead of guessing.
        </p>
        <div className="stat-row">
          <div className="stat stat-a">
            <span className="stat-num">{SOURCES.length}</span>
            <span className="stat-label">Documents</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="indexed-title">
        <h2 id="indexed-title" className="section-title">
          Indexed documents
        </h2>
        <ul className="doc-list">
          {SOURCES.map((doc) => (
            <li key={doc.file} className="card doc-card">
              <span className="doc-icon">
                <FileTextIcon size={22} />
              </span>
              <div>
                <p className="doc-title">{doc.title}</p>
                <p className="doc-meta">
                  {doc.file} &middot; {doc.publisher}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
