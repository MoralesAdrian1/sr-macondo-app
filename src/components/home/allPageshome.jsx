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
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomeAllPages() {
  const [data, setData] = useState([]);  // Stands
  const [data2, setData2] = useState([]);  // Productos
  const [data3, setData3] = useState([]);  // Categorías de productos
  const [data4, setData4] = useState([]);  // Categorías de stands
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [station, setStation] = useState("");
  const [selectedStandId, setSelectedStandId] = useState(""); 
  const [cart, setCart] = useState([]);
  const [filteredStands, setFilteredStands] = useState([]);  // Stands filtrados

  const getImageSource = (standName) => {
    if (standName === "Desayunos") {
      return "/iconos/huevos.gif"; 
    } else if (standName === "Comida Méxicana") {
      return "/iconos/tacos.gif"; 
    } else if (standName === "Comida Rapida") {
      return "/iconos/comida-rapida.gif"; 
    } else if (standName === "Mercado") {
      return "/iconos/establos.gif"; 
    }
    return "/default/path/to/defaultImage.jpg"; 
  };

  useEffect(() => {
    if (!data.length && !data2.length) {
      fetchData();
    }
  }, [data.length, data2.length]);
  

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/stand`);
      const result = await response.json();
      setData(result);  
      
      const response2 = await fetch(`${API_URL}/product`);
      const result2 = await response2.json();
      setData2(result2);  
      
      const response3 = await fetch(`${API_URL}/catProduct`);
      const result3 = await response3.json();
      setData3(result3);  
      
      const response4 = await fetch(`${API_URL}/catstand`);
      const result4 = await response4.json(); // Corregido para obtener las categorías de stands
      setData4(result4);
      
      // Inicialmente, todos los stands están filtrados
      setFilteredStands(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStandFilter = (categoryId) => {
    if (categoryId === "") {
      // Si no hay filtro, mostrar todos los stands
      setFilteredStands(data);
    } else {
      // Filtrar stands según la categoría
      const filtered = data.filter(stand => stand.catStandId === categoryId); // Ajusta esta línea según tu estructura de datos
      setFilteredStands(filtered);
    }
  };

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

  const handleOpen = (stationName, standId) => {
    setStation(stationName);
    setSelectedStandId(standId);
    const selectedProducts = data2.filter(product => product.standId === standId);
    setSelectedProducts(selectedProducts);  
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
        
        {/* Filtro de Todos y Categorías */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto", // Permite el desplazamiento horizontal
            whiteSpace: "nowrap",
            p: 1,
            justifyContent: { xs: "flex-start", md: "center" },  // Centramos en pantallas grandes
          }}
          
        >
          {/* Filtro de Todos */}
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              textAlign: "center",
              marginRight: "16px", // Espacio entre filtros
            }}
            onClick={() => handleStandFilter("")}
          >
            <Image
  src="/iconos/cocinero.gif"
  alt="Todos los stands"
  width={100}
  height={100}
  style={{ objectFit: "cover" }}
/>

            <Typography
  variant="subtitle1"
  sx={{
    whiteSpace: "normal", 
    fontSize: { xs: "12px", sm: "16px" },
    textAlign: "center",
  }}
            >
              Todos
            </Typography>
          </div>

          {/* Filtros individuales para cada stand */}
          {data4.map((category) => (
            <div
              key={category._id}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                textAlign: "center",
                marginRight: "16px", // Espacio entre filtros
              }}
              onClick={() => handleStandFilter(category._id)} // Filtramos por la categoría seleccionada
            >
              <Image
  src={getImageSource(category.name)}
  alt={category.name}
  width={100}
  height={100}
  style={{ objectFit: "cover" }}
/>

             <Typography
  variant="subtitle1"
  sx={{
    whiteSpace: "normal", 
    fontSize: { xs: "12px", sm: "16px" },
    textAlign: "center",
  }}
>
  {category.name}
</Typography>
            </div>
          ))}
        </Box>

        {/* Mostrar Productos filtrados */}
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {filteredStands.map((stand, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/img1.jpg"
                    alt={stand.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {stand.name}
                    </Typography>
                    <Button
                      onClick={() => handleOpen(stand.name, stand._id)} // Pasamos el standId al abrir el modal
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
