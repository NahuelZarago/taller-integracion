import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import ProductoCard from '../components/ProductoCard.jsx';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [soloConStock, setSoloConStock] = useState(false);

  useEffect(() => {
    let cancelado = false;

    // Esperamos un poco antes de consultar, para no pegarle
    // al servidor en cada tecla que escribe la persona.
    const t = setTimeout(async () => {
      setCargando(true);
      setError(null);
      try {
        const r = await api.listarProductos({
          q: busqueda,
          soloConStock: soloConStock ? 'true' : undefined,
        });
        if (!cancelado) setProductos(r.datos);
      } catch (e) {
        if (!cancelado) setError(e.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }, 300);

    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }, [busqueda, soloConStock]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">Catalogo</h1>
      <p className="mt-1 text-sm text-azul-suave">
        Productos para perros, gatos y peces.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar alimento, shampoo, juguetes..."
          className="min-w-[240px] flex-1 rounded-full border border-linea bg-white px-4 py-2 text-sm outline-none focus:border-naranja"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={soloConStock}
            onChange={(e) => setSoloConStock(e.target.checked)}
          />
          Solo con stock
        </label>
      </div>

      {/* TODO Sprint 2: filtros por especie, edad y tamano usando las etiquetas */}

      <div className="mt-6">
        {cargando && <p className="text-sm text-azul-suave">Cargando productos...</p>}

        {error && (
          <div className="rounded-xl border border-rojo bg-[#FBEAE5] p-4 text-sm font-bold text-[#A4503A]">
            {error}
            <p className="mt-1 font-normal">
              Verifica que el backend este corriendo en el puerto 3000.
            </p>
          </div>
        )}

        {!cargando && !error && productos.length === 0 && (
          <p className="text-sm text-azul-suave">
            No encontramos productos con esos filtros.
          </p>
        )}

        {!cargando && !error && productos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
