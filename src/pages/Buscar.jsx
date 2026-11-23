import { useState } from "react";
import CardProducto from "../components/cardProducto.jsx";

function Buscar({ agregar }) {
    const [texto, setTexto] = useState("");
    const [consulta, setConsulta] = useState("");
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [buscado, setBuscado] = useState(false);
    const [error, setError] = useState("");

    function buscar(e) {
        e.preventDefault();

        const palabra = texto.trim();

        if (palabra === "" || cargando) {
            return;
        }

        setCargando(true);
        setBuscado(false);
        setError("");
        setProductos([]);
        setConsulta(palabra);

        fetch(
            "https://dummyjson.com/products/search?q=" +
            encodeURIComponent(palabra)
        )
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error("Error al buscar");
                }

                return respuesta.json();
            })
            .then((datos) => {
                setProductos(datos.products);
                setBuscado(true);
            })
            .catch(() => {
                setError("No se pudieron cargar los productos.");
            })
            .finally(() => {
                setCargando(false);
            });
    }

    function limpiar() {
        setTexto("");
        setConsulta("");
        setProductos([]);
        setBuscado(false);
        setError("");
    }

    return (
        <div className="container my-4">
            <h2 className="mb-3">Buscar productos</h2>

            <form
                className="d-flex gap-2 mb-4"
                onSubmit={buscar}
            >
                <input
                    type="text"
                    className="form-control"
                    aria-label="Buscar productos"
                    placeholder="Ejemplo: phone, laptop, perfume"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={cargando}
                >
                    Buscar
                </button>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={limpiar}
                    disabled={cargando}
                >
                    Limpiar
                </button>
            </form>

            {cargando && (
                <p className="alert alert-info">
                    Buscando...
                </p>
            )}

            {error !== "" && (
                <p className="alert alert-danger">
                    {error}
                </p>
            )}

            {buscado && !cargando && (
                <p className="text-muted">
                    Se encontraron {productos.length} productos
                    para "{consulta}"
                </p>
            )}

            {buscado && !cargando && productos.length === 0 && (
                <p className="alert alert-danger">
                    No hay productos que coincidan
                </p>
            )}

            <div className="row g-4">
                {productos.map((p) => (
                    <div
                        key={p.id}
                        className="col-12 col-md-6 col-lg-4"
                    >
                        <CardProducto
                            id={p.id}
                            nombre={p.title}
                            categoria={p.category}
                            precio={p.price}
                            disponible={p.stock > 0}
                            stock={p.stock}
                            imagen={p.thumbnail}
                            descripcion={p.description}
                            esCatalogo={true}
                            agregar={agregar}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Buscar;