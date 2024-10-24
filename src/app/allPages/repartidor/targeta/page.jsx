"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, Typography, CardMedia, Container, Grid } from '@mui/material';
import axios from 'axios';

// Cargar la clave pública de Stripe
const stripePromise = loadStripe('pk_test_51QDVhZPpgnD8DjtkRvpZBkATGjffn8MEg8yaTTSAbG7ScvBedr9XjvlrjSNgWp1uiKvLQvLnNboxgN3xA4ypHPqN00tMUZB0zI');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(`${API_URL}/checkout`, {
          id,
          amount: 10000, // amount in cents
        });
        console.log('Payment successful:', data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.error('Payment error:', error);
        setError('Payment failed. Please try again.');
      }
      setLoading(false);
    } else {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
      {/* Información del producto */}
      <Typography variant="h5" align="center" gutterBottom>
        Precio: $100
      </Typography>

      {/* Input de tarjeta */}
      <Box sx={{ mb: 2 }}>
        <CardElement />
      </Box>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth disabled={!stripe || loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Comprar'}
      </Button>
    </Box>
  );
};

export default function CheckoutPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Asegura que solo se renderice en el cliente
  }

  return (
    <Elements stripe={stripePromise}>
      <Container sx={{ py: 5 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <CheckoutForm />
          </Grid>
        </Grid>
      </Container>
    </Elements>
  );
}
