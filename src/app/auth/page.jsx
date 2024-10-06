"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignIn() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                localStorage.setItem('token', data.token);
                router.push('/');
            } else {
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
                onSubmit={handleSubmit}
            >
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={100} 
                    height={100} 
                    style={{ marginBottom: '1rem' }}
                />

                <Typography variant="h4" sx={{ marginBottom: '2rem', color: "black", textAlign: 'center' }}>
                    Iniciar Sesión
                </Typography>

                {errorMessage && (
                    <Typography color="error" sx={{ marginBottom: '1rem' }}>
                        {errorMessage}
                    </Typography>
                )}


                <TextField
                    label="Numero de telefono"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
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
            </Box>
        </Box>
    );
}
