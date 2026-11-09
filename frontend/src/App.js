import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import AskPage from './components/AskPage';
import SourcesPage from './components/SourcesPage';
import Footer from './components/Footer';
import { THEMES } from './config';
import { loadTheme, saveTheme } from './storage';

function App() {
  const [page, setPage] = useState('ask');
  const [theme, setTheme] = useState(() => {
    const saved = loadTheme();
    return THEMES.some((t) => t.id === saved) ? saved : THEMES[0].id;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page={page} onNavigate={setPage} theme={theme} onThemeChange={setTheme} />
      <main id="main" className="container main">
        {/* Both pages stay mounted so the form and answer survive switching tabs. */}
        <div hidden={page !== 'ask'}>
          <AskPage />
        </div>
        <div hidden={page !== 'sources'}>
          <SourcesPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
