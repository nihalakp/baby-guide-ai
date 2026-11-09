import { BRAND } from '../config';
import { BookIcon, HeartIcon, ShieldCheckIcon } from './Icons';

export default function Header({ page, onNavigate }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          type="button"
          className="brand"
          onClick={() => onNavigate('ask')}
          aria-label={`${BRAND.name}, go to the question page`}
        >
          <span className="brand-mark">
            <HeartIcon size={22} />
          </span>
          <span className="brand-text">
            <span className="brand-name">{BRAND.name}</span>
            <span className="brand-badge">
              <ShieldCheckIcon size={13} />
              {BRAND.badge}
            </span>
          </span>
        </button>

        <nav className="main-nav" aria-label="Main">
          <button
            type="button"
            className={`nav-button${page === 'ask' ? ' is-active' : ''}`}
            aria-current={page === 'ask' ? 'page' : undefined}
            onClick={() => onNavigate('ask')}
          >
            Ask the guide
          </button>
          <button
            type="button"
            className={`nav-button${page === 'sources' ? ' is-active' : ''}`}
            aria-current={page === 'sources' ? 'page' : undefined}
            onClick={() => onNavigate('sources')}
          >
            <BookIcon size={16} />
            Sources
          </button>
        </nav>
      </div>
    </header>
  );
}
