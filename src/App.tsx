//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ComparisonPage from './pages/ComparisonPage';
import FavoritesPage from './pages/FavoritesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/buscar" element={<SearchPage />} />
              <Route path="/comparar" element={<ComparisonPage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;