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
const stations = [
  {label: 'Principal',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']},
  {label: 'Tiendita',description:'Sabritas, Refrescos, dulces y mas', imgPath:'/img1.jpg',prouctos:['Papas','Refrescos']},
  {label: 'Fuente de Sodas',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']},
  {label: 'Guisados',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']},
  {label: 'Tacos',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']}
]

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [activeStep]);

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
            {/* Título de Productos */}
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Productos
            </Typography>
            {/* Lista de productos */}
            <List sx={{ p: 0, mb: 2 }}> {/* Ajusta el padding y margen inferior */}
              {station.prouctos.map((producto, idx) => (
                <ListItem key={idx} sx={{ padding: 0 }}> {/* Elimina el padding de ListItem */}
                  <ListItemText primary={producto} />
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
