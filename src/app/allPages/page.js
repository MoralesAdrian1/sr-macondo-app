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
 // Asegúrate de que la ruta sea correcta

export default function Home() {
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const stations = [
    {
      label: "Principal",
      description: "Café, Ensaladas, Fruta y más",
      imgPath: "/img1.jpg",
      productos: ["Frape", "Café de olla"],
    },
    {
      label: "Tiendita",
      description: "Sabritas, Refrescos, dulces y más",
      imgPath: "/img1.jpg",
      productos: ["Papas", "Refrescos"],
    },
    {
      label: "Fuente de Sodas",
      description: "Café, Ensaladas, Fruta y más",
      imgPath: "/img1.jpg",
      productos: ["Frape", "Café de olla"],
    },
    {
      label: "Guisados",
      description: "Guisados, Gorditas y Quesadillas",
      imgPath: "/img1.jpg",
      productos: ["Guisados", "Gorditas" , "Quesadillas"],
    },
    {
      label: "Tacos",
      description: "Tacos, Quesadillas y Tortas",
      imgPath: "/img1.jpg",
      productos: ["Orden de Suadero", "Orden de Pastor"],
    },
  ];

  const handleOpen = (productos) => {
    setSelectedProducts(productos);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* contenido de la página */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { xs: 0, sm: "240px" }, // 0 en pantallas pequeñas y 240px en pantallas medianas en adelante
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
                      onClick={() => handleOpen(station.productos)} // Llama a handleOpen con los productos de la estación
                      variant="contained"
                      sx={{
                        bgcolor: "#077d6b",
                        mt: 2,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        textAlign: "center",
                      }} // Centra el botón
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

      {/* Modal para mostrar productos */}
      <MenuModal open={open} onClose={handleClose} products={selectedProducts} />
    </>
  );
}
