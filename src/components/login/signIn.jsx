"use client";
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import Image from 'next/image';

export default function SignIn() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
            }}
        >
            {/* Formulario de inicio de sesión */}
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: 1,
                    padding: '2rem',
  
                    bgcolor: 'white',
                    // Responsividad: Margen superior dinámico según el tamaño de pantalla
                    marginTop: { xs: '1rem', md: '0' },
                }}
                noValidate
                autoComplete="off"
            >
                {/* Imagen centrada arriba del texto */}
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={100} 
                    height={100} 
                    style={{ marginBottom: '1rem' }}
                />

                {/* Texto "Iniciar Sesión" centrado */}
                <Typography variant="h4" sx={{ marginBottom: '2rem', color: "black", textAlign: 'center' }}>
                    Iniciar Sesión
                </Typography>

                {/* Campos del formulario */}
                <TextField
                    label="Correo Electrónico"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />

                {/* Botón de Iniciar Sesión */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ 
                        marginTop: '1rem', 
                        bgcolor: '#077d6b', 
                        width: '100%', 
                        '&:hover': { bgcolor: '#065b52' }, // Cambiar color al pasar el cursor
                    }}
                    type="submit"
                >
                    Iniciar Sesión
                </Button>

                {/* Divider */}
                <Divider sx={{ bgcolor: 'black', marginTop: 2, marginBottom: 1, width: '100%' }} />

                {/* Botón de Registrarse */}
                {/* <Button
                    variant="outlined"
                    sx={{ 
                        marginTop: '1rem', 
                        borderColor: '#077d6b', 
                        color: '#077d6b', 
                        width: '100%', 
                        '&:hover': { 
                            bgcolor: '#077d6b', 
                            color: 'white',
                        },
                    }}
                    type="submit"
                >
                    Registrarse
                </Button> */}
            </Box>
        </Box>
    );
}
