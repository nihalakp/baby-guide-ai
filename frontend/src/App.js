import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import AskPage from './components/AskPage';
import SourcesPage from './components/SourcesPage';
import Footer from './components/Footer';

function App() {
  const [page, setPage] = useState('ask');

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page={page} onNavigate={setPage} />
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
