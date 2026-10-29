import Catalogo from './pages/Catalogo.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-linea bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFD37E]">
            🐾
          </span>
          <span className="text-lg font-extrabold">
            Pet<span className="text-naranja-fuerte">Market</span> Club
          </span>
        </div>
      </header>

      {/* TODO: router cuando haya mas de una pagina */}
      <Catalogo />

      <footer className="border-t border-linea bg-white py-4 text-center text-xs text-azul-suave">
        Pet Market Club · Concepcion del Uruguay, Entre Rios
      </footer>
    </div>
  );
}
