"use client";
import { useState } from "react";
import { List, ListItem, ListItemText, Typography, Button, Divider } from "@mui/material";

const Carrito = ({ productos }) => {
  const [carrito, setCarrito] = useState(productos || []);

  // Calcular el total del carrito
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Eliminar un producto del carrito
  const eliminarProducto = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1); // Elimina el producto seleccionado
    setCarrito(nuevoCarrito);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ padding: 2, color: "white", bgcolor: "#077d6b" }}>
        Tu Carrito
      </Typography>
      <Divider sx={{ bgcolor: "black", marginBottom: 2 }} />
      <List>
        {carrito.length > 0 ? (
          carrito.map((producto, index) => (
            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemText
                primary={`${producto.producto} (x${producto.cantidad})`}
                secondary={`Estación: ${producto.estacion}`}
              />
              <Typography variant="body1">${(producto.precio * producto.cantidad).toFixed(2)}</Typography>
              <Button variant="contained" color="secondary" onClick={() => eliminarProducto(index)}>
                Eliminar
              </Button>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" sx={{ padding: 2 }}>
            No hay productos en el carrito.
          </Typography>
        )}
      </List>
      {carrito.length > 0 && (
        <>
          <Divider sx={{ bgcolor: "black", marginTop: 2 }} />
          <Typography variant="h6" sx={{ padding: 2 }}>
            Total: ${total.toFixed(2)}
          </Typography>
          <Button variant="contained" color="primary">
            Proceder al pago
          </Button>
        </>
      )}
    </div>
  );
};

export default Carrito;
