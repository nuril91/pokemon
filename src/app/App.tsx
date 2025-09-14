import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import ListPage from '../pages/ListPage'
import PokemonDetailPage from '../pages/PokemonDetailPage'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-black/5 dark:bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-bold text-lg">Pokedex</Link>
          <span className="text-sm text-slate-500">by Ilham</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  )
}