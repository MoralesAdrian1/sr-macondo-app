"use client";
import { useEffect, useState } from "react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomeAllPages() {
  const [data, setData] = useState([]);  // Stands
  const [data2, setData2] = useState([]);  // Productos
  const [data3,setData3]= useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [station, setStation] = useState("");
  const [selectedStandId, setSelectedStandId] = useState(""); 
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!data.length && !data2.length) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/stand`);
      const result = await response.json();
      setData(result);  // Guardamos los stands
      const response2 = await fetch(`${API_URL}/product`);
      const result2 = await response2.json();
      setData2(result2);  // Guardamos los productos
      const response3 = await fetch(`${API_URL}/catProduct`);
      const result3 = await response3.json();
      setData3(result3);  // Guardamos las categorias de productos
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(data2)

  // Agrupamos los productos por standId
  const groupedProducts = data2.reduce((acc, product) => {
    const stand = data.find((stand) => stand._id === product.standId);
    const category = data3.find((cat) => cat._id === product.catProductId);
    
    if (!stand || !category) return acc;
  
    // Si el stand no existe en acc, lo creamos
    if (!acc[product.standId]) {
      acc[product.standId] = {
        standId: product.standId,
        standName: stand.name,
        categories: {},
      };
    }
  
    // Si la categoría no existe dentro del stand, la creamos
    if (!acc[product.standId].categories[category._id]) {
      acc[product.standId].categories[category._id] = {
        categoryId: category._id,
        categoryName: category.name,
        products: [],
      };
    }
  
    // Añadimos el producto a la categoría correspondiente
    acc[product.standId].categories[category._id].products.push({
      productName: product.name,
      description: product.description,
      price: product.price,
    });
  
    return acc;
  }, {});
  
  const result = Object.values(groupedProducts);  // Convertir en array para iterar fácilmente
  console.log(result);

  const handleOpen = (stationName, standId) => {
    setStation(stationName);
    setSelectedStandId(standId); // Guardamos el standId seleccionado
    // Filtramos los productos del stand seleccionado
    const selectedProducts = data2.filter(product => product.standId === standId);
    setSelectedProducts(selectedProducts);  // Guardamos los productos filtrados
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
            {result.map((stand, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/img1.jpg"
                    alt={stand.standName}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {stand.standName}
                    </Typography>
                    <Button
                      onClick={() => handleOpen(stand.standName, stand.standId)} // Solo pasamos el standId al abrir el modal
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

      {/* Pasamos los productos filtrados y el nombre del stand al modal */}
      <MenuModal
  open={open}
  onClose={handleClose}
  products={selectedProducts}  // Los productos filtrados se envían aquí
  standName={station}  // Enviamos el nombre del stand seleccionado
  setCart={setCart}
  categories={data3}  // Pasamos las categorías de productos al modal
/>
    </>
  );
}
