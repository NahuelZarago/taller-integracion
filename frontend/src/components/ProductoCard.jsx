const ESTADOS = {
  DISPONIBLE: { texto: 'En stock', clase: 'text-verde', punto: 'bg-verde' },
  STOCK_BAJO: { texto: 'Ultimas unidades', clase: 'text-naranja-fuerte', punto: 'bg-naranja' },
  SIN_STOCK: { texto: 'Sin stock por ahora', clase: 'text-rojo', punto: 'bg-rojo' },
};

const pesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function ProductoCard({ producto }) {
  const estado = ESTADOS[producto.estadoStock] ?? ESTADOS.SIN_STOCK;
  const hayStock = producto.stock > 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-linea bg-white">
      {/* Cuando esten las fotos reales va la imagen del producto */}
      <div className="grid aspect-[4/3] place-items-center bg-naranja-tinte text-4xl">
        🐾
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex flex-wrap gap-1">
          {producto.etiquetas.slice(0, 3).map((e) => (
            <span
              key={e.id}
              className="rounded-full bg-azul-tinte px-2 py-0.5 text-[11px] font-bold"
            >
              {e.nombre}
            </span>
          ))}
        </div>

        <h3 className="mt-1 font-extrabold leading-tight">{producto.nombre}</h3>

        <p className="text-lg font-extrabold tabular-nums">
          {pesos.format(producto.precio)}
        </p>

        <p className={`flex items-center gap-2 text-xs font-bold ${estado.clase}`}>
          <span className={`h-2 w-2 rounded-full ${estado.punto}`} />
          {estado.texto}
          {producto.estadoStock === 'STOCK_BAJO' && ` (${producto.stock})`}
        </p>

        <button
          type="button"
          disabled={!hayStock}
          className={`mt-auto rounded-lg py-2 text-sm font-extrabold ${
            hayStock
              ? 'bg-naranja text-[#3A2A14] hover:bg-naranja-fuerte'
              : 'border border-azul-tinte bg-white text-azul'
          }`}
        >
          {hayStock ? 'Agregar al carrito' : 'Avisame cuando haya'}
        </button>
      </div>
    </article>
  );
}
