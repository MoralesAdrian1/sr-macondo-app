"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Divider, List, ListItem, ListItemText, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersEmployees() {
  const [data, setData] = useState([]); // Pedidos
  const [data2, setData2] = useState([]); // Stands
  const [selectedTab, setSelectedTab] = useState(0); // Estado para la pestaña seleccionada

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/order`);
      const orders = await response.json();
      const response2 = await fetch(`${API_URL}/stand`);
      const stands = await response2.json();

      const sortedOrders = orders.sort((a, b) => new Date(a.date) - new Date(b.date));

      setData(sortedOrders);  // Actualizar pedidos ordenados
      setData2(stands);  // Actualizar los stands
    } catch (error) {
      console.log("error fetching data", error);
    }
  };

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

  // Cambiar la pestaña activa
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
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
      {/* Contenedor de pestañas */}
      <Box sx={{ width: '100%', paddingTop: 5.05 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {/* Tabs para seleccionar el stand */}
          <Tabs
  sx={{ color: "#077d6b" }}
  TabIndicatorProps={{
    sx: { backgroundColor: "#077d6b" }
  }}
  value={selectedTab}
  onChange={handleTabChange}
  aria-label="basic tabs example"
>
  {data2.map((stand, index) => (
    <Tab
      sx={{
        backgroundColor: selectedTab === index ? "#077d6b" : "white", // Controla el color según la pestaña activa
        color: selectedTab === index ? "white" : "#077d6b", // Color del texto dependiendo de si está activa o no
        '&:hover': {
          backgroundColor: selectedTab === index ? "#077d6b" : "rgba(7, 125, 107, 0.1)", // Efecto hover
        },
        '&.Mui-selected': {
          color: "white !important", // Texto blanco cuando la pestaña está seleccionada
        },
      }}
      key={stand._id}
      label={stand.name}
    />
  ))}
</Tabs>

        </Box>
      </Box>

      {/* Mostrar los pedidos del stand seleccionado */}
      {data
        .filter((order) => order.products.some((product) => product.station_id === data2[selectedTab]?._id)) // Filtrar pedidos por stand
        .map((order) => (
        <Box key={order._id}>
          {order.status !== "Entregado" ? (
            <Card sx={{ minWidth: 275, mb: 2 }}>
              <CardContent>
                <Typography variant="h5">Mi Pedido: {order._id}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Fecha del Pedido:<strong> {formatDate(order.date)}</strong>{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Código del Pedido: <strong>{order.code}</strong>
                </Typography>
                <Typography variant="body1">Productos:</Typography>

                <List>
                  {order.products.map((product, index) => (
                    <ListItem key={product.product_id || index}>
                      <ListItemText
                        primary={`${product.name}`}
                        secondary={`cantidad: ${product.amount}`}
                      />
                    </ListItem>
                  ))}
                </List>

                {order.address && order.address.building && (
                  <>
                    <Divider sx={{ bgcolor: "#077d6b", my: 1 }} />
                    <Typography variant="body1"><strong>Dirección de Entrega:</strong></Typography>
                    <List>
                      <ListItem key={order._id}>
                        <ListItemText
                          primary={`Edificio: ${order.address.building}`}
                          secondary={`Salón: ${order.address.classroom}`}
                        />
                      </ListItem>
                    </List>
                  </>
                )}

                <Divider sx={{ bgcolor: "#077d6b", my: 1 }} />
                <Typography variant="body1">
                  Tipo de Entrega:<strong>{order.type_delivery} </strong>
                </Typography>

                <Typography variant="body1">
                  Total a Pagar:<strong>{order.total} </strong>
                </Typography>
                <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <Typography variant="body1">
                    Status del Pedido: <strong>{order.status}</strong>
                  </Typography>
                  {order.status === "Pendiente" && (
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      alt="gift"
                      variant="square"
                      src="/iconos/cacerola.gif"
                    />
                  )}
                  {order.status === "Preparando" && (
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      alt="gift"
                      variant="square"
                      src="/iconos/remover.gif"
                    />
                  )}
                  {order.status === "Listo" && (
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      alt="gift"
                      variant="square"
                      src="/iconos/bolsa-de-papel.gif"
                    />
                  )}
                  {order.status === "Entregado" && (
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      alt="gift"
                      variant="square"
                      src="/iconos/bolsa2.gif"
                    />
                  )}
                  {order.status === "Enviado" && (
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      variant="square"
                      alt="gift"
                      src="/iconos/scooter.gif"
                    />
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
