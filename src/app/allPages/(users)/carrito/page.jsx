"use client";
import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, Box, Divider, ListItemButton, Button } from "@mui/material";

//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "http://localhost:3001/api";

const Carrito = () => {
  const [data, setData] = useState([]); // Data de usuarios
  const [data2, setData2] = useState([]); // Data de productos
  const [data3, setData3] = useState([]); // Data de stands
  const [groupedProducts, setGroupedProducts] = useState({}); // Productos agrupados por stands

  useEffect(() => {
    fetchData();
  }, []);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/user`);
      const users = await response.json();
      setData(users);

      const response2 = await fetch(`${API_URL}/product`);
      const products = await response2.json();
      setData2(products);

      const response3 = await fetch(`${API_URL}/stand`);
      const stands = await response3.json();
      setData3(stands);

      groupProductsByStand(users, products, stands);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Función para agrupar los productos por stand
  const groupProductsByStand = (users, products, stands) => {
    const cartProducts = users.flatMap(user => user.cart?.products || []); // Obtener todos los productos del carrito

    const matchingProducts = cartProducts.map(cartItem => {
      const product = products.find(p => p._id === cartItem.product_id); // Buscar el producto
      if (product) {
        const stand = stands.find(s => s._id === product.standId); // Buscar el stand correspondiente

        if (stand) {
          return {
            standName: stand.name,
            standId: stand._id,
            productId: product._id,
            productName: product.name,
            quantity: cartItem.quantity, // Agregar cantidad del carrito
          };
        }
      }
      return null;
    }).filter(Boolean); // Filtrar valores nulos

    // Agrupar productos por stand
    const grouped = matchingProducts.reduce((acc, item) => {
      const { standName, standId, productId, productName, quantity } = item;

      const standKey = `${standName} (${standId})`;

      if (!acc[standKey]) {
        acc[standKey] = [];
      }
      acc[standKey].push({
        _id: productId,
        name: productName,
        quantity,
      });

      return acc;
    }, {});

    setGroupedProducts(grouped);
  };

  console.log(groupedProducts); // Verificar la agrupación

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginLeft: { xs: 0, sm: "240px" },
        width: { sm: `calc(100% - 240px)` },
      }}
    >
      <Typography variant="h4" color="black">
        Tu Carrito
      </Typography>

      <Divider sx={{ my: 2 }} />

      {Object.entries(groupedProducts).map(([standKey, products]) => (
        <Box key={standKey} sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{ bgcolor: "#077d6b", color: "white" }}
          >
            {standKey}
          </Typography>
          <List>
            {products.map((product) => (
              <ListItem key={product._id}>
                <ListItemText
                  primary={`${product.name} (Cantidad: ${product.quantity})`}
                  secondary={`ID: ${product._id}`}
                />
              </ListItem>
            ))}
          </List>
          <Button sx={{marginLeft:2,bgcolor: "#077d6b", color: "white" }}>
            Pagar
          </Button>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
    </Box>
  );
};

export default Carrito;
