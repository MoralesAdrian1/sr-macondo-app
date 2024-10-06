"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignIn() {
    // Estado para capturar los inputs
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        //`${API_URL}/rol`
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Si la autenticación es exitosa, guarda el token en el almacenamiento local
                localStorage.setItem('token', data.token);

                // Redirigir a la página deseada después del login exitoso
                router.push('/dashboard'); // Cambia '/dashboard' a la ruta de tu aplicación deseada
            } else {
                // Si hay algún error, muestra el mensaje
                setErrorMessage(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            setErrorMessage('Error en la conexión con el servidor');
        }
    };

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
                    marginTop: { xs: '1rem', md: '0' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit} // Aquí se llama la función handleSubmit
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

                {/* Mostrar mensaje de error si existe */}
                {errorMessage && (
                    <Typography color="error" sx={{ marginBottom: '1rem' }}>
                        {errorMessage}
                    </Typography>
                )}

                {/* Campos del formulario */}
                <TextField
                    label="Numero de telefono"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} // Captura el valor del teléfono
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Captura el valor de la contraseña
                />

                {/* Botón de Iniciar Sesión */}
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
                >
                    Iniciar Sesión
                </Button>

                {/* Divider
                <Divider sx={{ bgcolor: 'black', marginTop: 2, marginBottom: 1, width: '100%' }} /> */}
            </Box>
        </Box>
    );
}
