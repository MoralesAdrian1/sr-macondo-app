"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyOrder() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/order`);
      const orders = await response.json();
      setData(orders);
    } catch (error) {
      console.log("error fetching data", error);
    }
  };
  console.log(data);

  // Función para formatear la fecha en un formato más legible
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginLeft: { xs: 0, sm: "240px" },
        paddingBottom: 4,
        width: { sm: `calc(100% - 240px)` },
      }}
    >
      <br />
      <br />
      <Typography variant="h4" sx={{paddingTop:4}} textAlign="center">Mis Pedidos</Typography>
      <Divider sx={{ bgcolor: "#077d6b", my: 1, paddingBottom: 1 }} />

      {data.map((order) => (
        <Box>
          {order.user_id === "6701c1f1622fbf1ad45cbed9" && order.status !=="Entregado" ? (
            <Card key={order._id} sx={{ minWidth: 275, mb: 2 }}>
              <CardContent>
              <Typography variant="h5">Pedido: {order._id}</Typography>
                {/* Mostrar la fecha del pedido */}
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Fecha del Pedido:<strong> {formatDate(order.date)}</strong>{" "}
                  {/* Formateamos la fecha usando la función */}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Código del Pedido: <strong>{order.code}</strong>
                </Typography>
                <Typography variant="body1" >
                  Productos:
                </Typography>

                <List>
                  {/* Mapeo de los productos del pedido */}
                  {order.products.map((product, index) => (
                    <ListItem key={product.product_id || index}>
                      <ListItemText
                        primary={`${product.name}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ bgcolor: "#077d6b", my: 1 }} />
                <Typography variant="body1" >
                  Total a Pagar:<strong>{order.total} </strong>
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
  
  <Typography variant="body1">
    Status del Pedido: <strong>{order.status}</strong>
  </Typography>
  {order.status ==="Pendiente" && (
      <Avatar sx={{ width: 56, height: 56 }} alt="gift" variant="square" src="/iconos/cacerola.gif" />
  )}
  {order.status ==="Preparando" && (
      <Avatar sx={{ width: 56, height: 56 }} alt="gift" variant="square" src="/iconos/remover.gif" />
  )}
  {order.status ==="Listo" && (
      <Avatar sx={{ width: 56, height: 56 }} alt="gift" variant="square" src="/iconos/bolsa-de-papel.gif" />
  )}
  {order.status ==="Entregado" && (
      <Avatar sx={{ width: 56, height: 56 }} alt="gift" variant="square" src="/iconos/bolsa2.gif" />
  )}
  {order.status ==="Enviado" && (
      <Avatar sx={{ width: 56, height: 56 }} variant="square"alt="gift" src="/iconos/scooter.gif" />
  )}

</Box>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="h3  "></Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
