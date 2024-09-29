"use client";
import { useState } from 'react';
import { Box, Button, Divider, TextField, Typography, Grid } from '@mui/material';
import Image from 'next/image';

export default function Auth() {
    const [isSignIn, setIsSignIn] = useState(true); // Estado para controlar el formulario activo

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
                padding: { xs: '1rem', sm: '2rem' }, // Padding responsivo
            }}
        >
            {/* Formulario basado en el estado */}
            <Grid container spacing={2} sx={{ width: '100%', maxWidth: '400px', marginBottom: '1rem' }}>
                <Grid item xs={6}>
                    <Button
                        variant={isSignIn ? 'contained' : 'outlined'}
                        sx={{
                            width: '100%',
                            bgcolor: isSignIn ? '#077d6b' : 'transparent',
                            color: isSignIn ? 'white' : '#077d6b',
                            borderColor: '#077d6b',
                            '&:hover': { bgcolor: isSignIn ? '#065b52' : '#e0f2f1' }
                        }}
                        onClick={() => setIsSignIn(true)} // Cambiar a Iniciar Sesión
                    >
                        Iniciar Sesión
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant={!isSignIn ? 'contained' : 'outlined'}
                        sx={{
                            width: '100%',
                            bgcolor: !isSignIn ? '#077d6b' : 'transparent',
                            color: !isSignIn ? 'white' : '#077d6b',
                            borderColor: '#077d6b',
                            '&:hover': { bgcolor: !isSignIn ? '#065b52' : '#e0f2f1' }
                        }}
                        onClick={() => setIsSignIn(false)} // Cambiar a Registro
                    >
                        Registrarme
                    </Button>
                </Grid>
            </Grid>
            
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

                {/* Texto dinámico según el estado */}
                <Typography variant="h4" sx={{ marginBottom: '2rem', color: "black", textAlign: 'center' }}>
                    {isSignIn ? 'Iniciar Sesión' : 'Registro'}
                </Typography>

                {/* Campos del formulario */}
                {isSignIn ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                        />
                        <TextField
                            label="Correo Electrónico"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                        />
                        <TextField
                            label="Teléfono"
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
                        <TextField
                            label="Confirma Contraseña"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                        />
                    </>
                )}

                {/* Botón para enviar el formulario */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        marginTop: '1rem',
                        bgcolor: '#077d6b',
                        width: '100%',
                        '&:hover': { bgcolor: '#065b52' },
                    }}
                    type="submit"
                    href={isSignIn ? '/allPages' : '/auth'}
                >
                    {isSignIn ? 'Iniciar Sesión' : 'Registrarme'}
                </Button>

                {/* Divider */}
                <Divider sx={{ bgcolor: 'black', marginTop: 2, marginBottom: 1, width: '100%' }} />
            </Box>
        </Box>
    );
}
