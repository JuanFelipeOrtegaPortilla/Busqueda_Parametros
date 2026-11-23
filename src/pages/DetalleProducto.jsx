import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";


function DetalleProducto({ agregar }) {
    const { id } = useParams();

    const [producto, setProducto] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const controlador = new AbortController();

        setProducto(null);
        setError("");

        fetch("https://dummyjson.com/products/" + id, {
            signal: controlador.signal
        })
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error("No se encontró el producto");
                }

                return respuesta.json();
            })
            .then((datos) => {
                setProducto(datos);
            })
            .catch((fallo) => {
                if (fallo.name !== "AbortError") {
                    setError("No se pudo cargar el producto.");
                }
            });

        return () => controlador.abort();
    }, [id]);

    if (error !== "") {
        return (
            <div className="my-4">
                <p className="alert alert-danger">{error}</p>

                <Link
                    to="/buscar"
                    className="btn btn-outline-secondary"
                >
                    Volver
                </Link>
            </div>
        );
    }

    if (producto === null) {
        return (
            <p className="alert alert-info">
                Cargando producto...
            </p>
        );
    }

    return (
        <div className="card shadow-sm my-4">
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={producto.thumbnail}
                        alt={producto.title}
                        className="img-fluid p-3"
                    />
                </div>

                <div className="col-md-8">
                    <div className="card-body">
                        <span className="badge bg-secondary mb-2">
                            {producto.category}
                        </span>

                        <h2>{producto.title}</h2>

                        <p>{producto.description}</p>

                        <p className="fs-4 fw-bold">
                            ${producto.price.toFixed(2)}
                        </p>

                        <p>Stock: {producto.stock} unidades</p>
                        {producto.stock > 0 && producto.stock < 10 && (
                            <p>
                                <span className="badge bg-warning text-dark">
                                    ¡Últimas unidades!
                                </span>
                            </p>
                        )}

                        {producto.stock === 0 && (
                            <p className="text-danger fw-bold">
                                Agotado
                            </p>
                        )}

                        {producto.stock > 0 && producto.stock < 10 && (
                            <p className="text-danger fw-bold">
                                ¡Últimas unidades!
                            </p>
                        )}

                        {producto.stock === 0 && (
                            <p className="text-danger">Agotado</p>
                        )}

                        <button
                            type="button"
                            className="btn btn-primary me-2"
                            disabled={producto.stock <= 0}
                            onClick={() =>
                                agregar(producto.title, producto.price)
                            }
                        >
                            Agregar
                        </button>

                        <Link
                            to="/buscar"
                            className="btn btn-outline-secondary"
                        >
                            Volver
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleProducto;