"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Divider, List, ListItem, ListItemText, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
//const testId = "6717db6fc35afa2112c573d5"; // ID del empleado
const testId = "6717f74f5a34ba5606cec223";
export default function OrdersPerStandComponent() {
  const [orders, setOrders] = useState([]); // Pedidos
  const [stands, setStands] = useState([]); // Stands
  const [employees, setEmployees] = useState([]); // Empleados
  const [filteredOrders, setFilteredOrders] = useState([]); // Pedidos filtrados por el stand
  const [stationName, setStationName] = useState(""); // Nombre de la estación

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseOrders = await fetch(`${API_URL}/order`);
      const orders = await responseOrders.json();
      const responseStands = await fetch(`${API_URL}/stand`);
      const stands = await responseStands.json();
      const responseEmployees = await fetch(`${API_URL}/employee`);
      const employees = await responseEmployees.json();

      // Buscar el empleado por testId
      const employee = employees.find((emp) => emp._id === testId);
      if (employee) {
        const standId = employee.stand_id;

        // Buscar el stand correspondiente al stand_id del empleado
        const stand = stands.find((s) => s._id === standId);
        if (stand) {
          setStationName(stand.name); // Establecer el nombre de la estación

          // Filtrar las órdenes que coinciden con el stand_id del empleado
          const filtered = orders.filter((order) =>
            order.products.some((product) => product.station_id === standId)
          );
          setFilteredOrders(filtered);
        }
      }

      setOrders(orders);
      setStands(stands);
      setEmployees(employees);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const updateStatus = async (orderId, currentStatus, typeDelivery) => {
    let newStatus = '';

    if (currentStatus === 'Pendiente') {
      newStatus = 'Preparando';
    } else if (currentStatus === 'Preparando') {
      newStatus = 'Listo';
    } else if (currentStatus === 'Listo') {
      newStatus = typeDelivery === 'Envio' ? 'Enviado' : 'Entregado';
    } else if (currentStatus === 'Enviado') {
      newStatus = 'Entregado';
    }

    try {
      const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrders = filteredOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setFilteredOrders(updatedOrders);
      }
    } catch (error) {
      console.log("Error updating order status", error);
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
      <Typography variant="h4" textAlign="center" sx={{ paddingTop: 6 }}>
        Estación: <strong>{stationName}</strong>
      </Typography>
      <Divider sx={{ bgcolor: "#077d6b", my: 1, paddingBottom: 1 }} />
      {filteredOrders.map((order) => (
        <Box key={order._id}>
          {order.status !== "Entregado" ? (
            <Card sx={{ minWidth: 275, mb: 2 }}>
              <CardContent>
                <Typography variant="h5">Mi Pedido: {order._id}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Fecha del Pedido:<strong> {formatDate(order.date)}</strong>
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
                  Tipo de Entrega:<strong>{order.type_delivery}</strong>
                </Typography>

                <Typography variant="body1">
                  Total a Pagar:<strong>{order.total}</strong>
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

                {order.status !== "Entregado" && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2, color: "white", bgcolor: "#077d6b" }}
                    onClick={() => updateStatus(order._id, order.status, order.type_delivery)}
                  >
                    {order.status === "Pendiente"
                      ? "Preparando"
                      : order.status === "Preparando"
                      ? "Listo"
                      : order.status === "Listo"
                      ? order.type_delivery === "Envio"
                        ? "Enviando"
                        : "Entregado"
                      : order.status === "Enviado"
                      ? "Entregado"
                      : null}
                  </Button>
                )}
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
