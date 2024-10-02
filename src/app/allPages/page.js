"use client";
import { useState } from "react";
import Navbar from "@/components/navigation/navbar";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuModal from "@/components/carritoCompras/Menu";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [station, setStation] = useState("");

  const stations = [
    {
      label: "Principal",
      description: "Café, Ensaladas, Fruta y más",
      imgPath: "/img1.jpg",
      productos: [
        { producto: "Torta", precio: 35 },
        { producto: "Chilaquiles", precio: 35 },
      ],
    },
    {
      label: "Tiendita",
      description: "Sabritas, Refrescos, dulces y más",
      imgPath: "/img1.jpg",
      productos: [
        { producto: "Papas", precio: 20 },
        { producto: "Refrescos", precio: 20 },
      ],
    },
    {
      label: "Fuente de Sodas",
      description: "Café, Ensaladas, Fruta y más",
      imgPath: "/img1.jpg",
      productos: [
        { producto: "Frape", precio: 20 },
        { producto: "Café de olla", precio: 20 },
      ],
    },
    {
      label: "Guisados",
      description: "Guisados, Gorditas y Quesadillas",
      imgPath: "/img1.jpg",
      productos: [
        { producto: "Guisados", precio: 20 },
        { producto: "Gorditas", precio: 20 },
      ],
    },
    {
      label: "Tacos",
      description: "Tacos, Quesadillas y Tortas",
      imgPath: "/img1.jpg",
      productos: [
        { producto: "Orden de Suadero", precio: 60 },
        { producto: "Orden de Pastor", precio: 60 },
      ],
    },
  ];

  const handleOpen = (productos, station) => {
    setStation(station);
    setSelectedProducts(productos); // Aquí pasamos directamente los productos sin descomponer
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            {stations.map((station, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={station.imgPath}
                    alt={station.label}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {station.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {station.description}
                    </Typography>
                    <Button
                      onClick={() => handleOpen(station.productos, station.label)} // Pasamos directamente los productos
                      variant="contained"
                      sx={{
                        bgcolor: "#077d6b",
                        mt: 2,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        textAlign: "center",
                      }}
                    >
                      Ver Menú
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <MenuModal open={open} onClose={handleClose} products={selectedProducts} stationName={station} /> {/* Usamos el estado station aquí */}
    </>
  );
}
