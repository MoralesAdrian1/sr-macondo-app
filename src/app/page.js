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

const images = [
  { label: 'Imagen 1', imgPath: '/img1.jpg' },
  { label: 'Imagen 2', imgPath: '/img2.jpg' },
  { label: 'Imagen 3', imgPath: '/img3.jpg' }
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0); 
  const maxSteps = images.length;

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer); 
  }, [activeStep]);

  const handleNext = () => {
    setDirection(1); 
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setDirection(-1); 
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Barra superior */}
      <AppBar position="static" sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '2.5rem', color: '#077d6b' }}>
            Sr. Macondo
          </Typography>
          <Button variant="outlined" color="inherit" sx={{ fontSize: '1.5rem', bgcolor: '#077d6b' }} href='/auth'>
            Iniciar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Carrusel de imágenes */}
      <Box sx={{ position: 'relative', width: '100%', height: 475, overflow: 'hidden' }}>
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
              <Image
                src={step.imgPath}
                alt={step.label}
                layout="fill"
                objectFit="cover"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              />
              {/* Texto centrado en el carrusel */}
              {index === activeStep && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Cafetería Sr. Macondo
                  </Typography>
                  <Typography variant="h6" sx={{fontWeight: 'bold', mb: 3 }}>
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

        {/* Controles del carrusel dentro del área del carrusel */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>
    </Box>
  );
}
