import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CardProducto({
    id,
    nombre,
    categoria,
    precio,
    disponible,
    stock,
    agregar,
    onTotalChange,
    imagen,
    descripcion,
    esCatalogo = false
}) {
    const [contador, setContador] = useState(0);
    const [descuento, setDescuento] = useState(1);

    function agregarProducto() {
        if (disponible && stock > 0 && agregar) {
            agregar(nombre, precio);
        }
    }

    function mostrarProducto() {
        if (disponible && contador < stock) {
            setContador(contador + 1);

            // Los productos de la API se agregan también a Venta.
            if (id) {
                agregarProducto();
            }
        }
    }

    const iva = precio * 0.15;
    const total = precio + iva;

    function calcularTotal() {
        return total * contador;
    }

    function calcularDescuento() {
        return calcularTotal() * (1 - descuento / 100);
    }

    const totalConDescuento = calcularDescuento();

    useEffect(() => {
        if (onTotalChange) {
            onTotalChange(nombre, totalConDescuento);
        }
    }, [nombre, totalConDescuento, onTotalChange]);

    return (
        <div
            className={
                esCatalogo
                    ? "card h-100 shadow-sm border-0 rounded-3"
                    : "card"
            }
            style={esCatalogo ? {} : { width: "18rem" }}
        >
            {esCatalogo && imagen && (
                <div className="bg-light text-center p-3">
                    <img
                        src={imagen}
                        alt={nombre}
                        className="img-fluid"
                        style={{
                            height: "180px",
                            width: "100%",
                            objectFit: "contain"
                        }}
                    />
                </div>
            )}

            <div className="card-body">
                {categoria && (
                    <p className="badge bg-secondary">
                        {categoria}
                    </p>
                )}

                <h5
                    className={
                        esCatalogo
                            ? "card-title fw-bold"
                            : "card-title badge bg-success"
                    }
                >
                    {nombre}
                </h5>

                {esCatalogo && descripcion && (
                    <p className="card-text text-muted small">
                        {descripcion}
                    </p>
                )}

                {!esCatalogo && (
                    <p className="card-text">
                        Producto a precio ${precio.toFixed(2)}.
                    </p>
                )}

                <p className="mb-1">
                    Precio: ${precio.toFixed(2)}
                </p>

                <p className="fw-bold">
                    IVA (15%): ${iva.toFixed(2)}
                </p>

                <p className="fw-bold badge bg-success">
                    Total: ${total.toFixed(2)}
                </p>

                <p>
                    <span
                        className={
                            disponible && stock > 0
                                ? "badge bg-success"
                                : "badge bg-danger"
                        }
                    >
                        {disponible && stock > 0
                            ? "Disponible"
                            : "Agotado"}
                    </span>
                </p>

                <p>Stock: {stock} unidades</p>

                {disponible && stock > 0 && stock < 10 && (
                    <p className="badge bg-warning text-dark">
                        ¡Últimas unidades!
                    </p>
                )}

                <div className="d-flex gap-2 mb-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={mostrarProducto}
                        disabled={!disponible || contador >= stock}
                    >
                        Agregar
                    </button>

                    {!id && (
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={agregarProducto}
                            disabled={!disponible || stock <= 0}
                        >
                            Comprar
                        </button>
                    )}
                </div>

                {id && (
                    <Link
                        to={"/producto/" + id}
                        className="btn btn-link btn-sm w-100"
                    >
                        Ver detalle
                    </Link>
                )}

                <h3>Cantidad: {contador}</h3>

                <h3 className="fw-bold">
                    Total: ${calcularTotal().toFixed(2)}
                </h3>

                {!esCatalogo && (
                    <>
                        <label className="form-label">
                            Descuento (%)
                            <input
                                className="form-control form-control-sm"
                                type="number"
                                min="0"
                                max="100"
                                value={descuento}
                                onChange={(e) =>
                                    setDescuento(
                                        Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                Number(e.target.value) || 0
                                            )
                                        )
                                    )
                                }
                            />
                        </label>

                        <p>
                            Total con descuento: $
                            {totalConDescuento.toFixed(2)}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default CardProducto;