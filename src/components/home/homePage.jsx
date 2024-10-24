"use client";
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Grid, List, ListItem, ListItemText } from '@mui/material';

const images = [
  { label: 'Imagen 1', imgPath: '/img1.jpg' },
  { label: 'Imagen 2', imgPath: '/img2.jpg' },
  { label: 'Imagen 3', imgPath: '/img3.jpg' }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function HomeComponent() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  const maxSteps = images.length;
useEffect(() => {
  if (!data.length && !data2.length) {
    fetchData();
  }
}, [data.length, data2.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [activeStep]);
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/stand`);
      const result = await response.json();
      setData(result);
      const response2 = await fetch(`${API_URL}/product`);
      const result2 = await response2.json();
      setData2(result2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const groupedProducts = data2.reduce((acc, product) => {
    const stand = data.find(stand => stand._id === product.standId);
    if (!stand) return acc;
    if (!acc[product.standId]) {
      acc[product.standId] = {
        standId: product.standId,
        standName: stand.name,
        products: []
      };
    }
 acc[product.standId].products.push({
      productName: product.name
    });
  
    return acc;
  }, {});
  const result = Object.values(groupedProducts);
  
  console.log(result);
  
  
  console.log(data);
  console.log(data2);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" sx={{ bgcolor: 'white' }}>
      <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: '#077d6b' }}>
          Sr. Macondo
        </Typography>
        <Button variant="outlined" color="inherit" sx={{ fontSize: { xs: '1rem', sm: '1.5rem' }, bgcolor: '#077d6b' }} href='/auth'>
          Iniciar Sesión
        </Button>
      </Toolbar>
    </AppBar>

    <Box sx={{ position: 'relative', width: '100%', height: { xs: 300, sm: 475 }, overflow: 'hidden' }}>
      {images.map((step, index) => {
        const offset = (index - activeStep) * 100;
        return (
          <Box
            key={step.label}
            sx={{
              position: 'absolute',
              top: 0,
              left: `${offset}%`,
              width: '100%',
              height: '100%',
              transition: 'left 0.5s ease',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                src={step.imgPath}
                alt={step.label}
                layout="fill"
                objectFit="cover"
              />
            </Box>
            {index === activeStep && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  textAlign: 'center',
                  padding: { xs: '1rem', sm: '0' },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.5rem', sm: '2.5rem' } }}>
                  Cafetería Sr. Macondo
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1rem', sm: '1.5rem' } }}>
                  ahora puedes realizar tus pedidos mediante la app
                </Typography>
                <Button href='/auth' variant="contained" sx={{ bgcolor: '#077d6b' }}>
                  Ver Menú
                </Button>
              </Box>
            )}
          </Box>
        );
      })}

      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 0,
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>

    {/* sección de cards*/}
    <Box sx={{ p: 2 }}>
  <Grid container spacing={2}>
    {result.map((stand, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
          {/* Aquí deberías asignar una imagen si corresponde */}
          <CardMedia
            component="img"
            height="140"
            image="/img1.jpg" // Puedes asignar dinámicamente las imágenes si las tienes disponibles
            alt={stand.standName}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {stand.standName}
            </Typography>

            {/* Título de Productos */}
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Productos
            </Typography>

            {/* Lista de productos */}
            <List sx={{ p: 0, mb: 2 }}> {/* Ajusta el padding y margen inferior */}
              {stand.products.map((product, idx) => (
                <ListItem key={idx} sx={{ padding: 0 }}> {/* Elimina el padding de ListItem */}
                  <ListItemText primary={product.productName} />
                </ListItem>
              ))}
            </List>

            <Button 
              href='/auth' 
              variant="contained" 
              sx={{ bgcolor: '#077d6b', mt: 2, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} // Centra el botón
            >
              Hacer mi pedido
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>


  </Box>
  );
}
