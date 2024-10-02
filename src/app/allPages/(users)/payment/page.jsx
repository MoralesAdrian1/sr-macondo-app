"use client";
import { useState } from "react";
import Navbar from "@/components/navigation/navbar";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Toolbar,
  Typography,
  Checkbox,
} from "@mui/material";

export default function Payment() {
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [station, setStation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash' o 'card'

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { xs: 0, sm: "240px" },
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Métodos de Pago
                  </Typography>
                  <Divider />

                  {/* Contenedor para las cards de métodos de pago */}
                  <Grid container spacing={2} sx={{ marginTop: 1 }}>
                    {/* Card para Efectivo */}
                    <Grid item xs={6}>
                      <Card>
                        <CardContent>
                          <Grid container alignItems="center">
                            <Grid item>
                              <Checkbox
                                checked={paymentMethod === "cash"}
                                onChange={handlePaymentMethodChange}
                                value="cash"
                              />
                            </Grid>
                            <Grid item>
                              <Typography gutterBottom variant="h6" component="div">
                                Efectivo
                              </Typography>
                            </Grid>
                          </Grid>
                          <Divider sx={{ mt: 1 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            El pedido se paga al momento de recibir el pedido en la estación o estaciones.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Card para Pago con Tarjeta */}
                    <Grid item xs={6}>
                      <Card>
                        <CardContent>
                          <Grid container alignItems="center">
                            <Grid item>
                              <Checkbox
                                checked={paymentMethod === "card"}
                                onChange={handlePaymentMethodChange}
                                value="card"
                              />
                            </Grid>
                            <Grid item>
                              <Typography gutterBottom variant="h6" component="div">
                                Pago con Tarjeta
                              </Typography>
                            </Grid>
                          </Grid>
                          <Divider sx={{ mt: 1 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Paga con tu tarjeta de debito
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
