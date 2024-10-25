import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { createOrder } from '../utils/createOrder';
import { Divider } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflow: 'auto',
  maxHeight: '90vh',
};

const stripePromise = loadStripe('pk_test_51QDVhZPpgnD8DjtkRvpZBkATGjffn8MEg8yaTTSAbG7ScvBedr9XjvlrjSNgWp1uiKvLQvLnNboxgN3xA4ypHPqN00tMUZB0zI');

export default function ConfirmModal({ userId, total, products = {}, open, handleClose, refreshCart }) {
  const [code, setCode] = useState('');
  const [openStripeModal, setOpenStripeModal] = useState(false);
  const [dataForm, setDataForm] = useState({
    user_id: userId,
    products: [],
    total: total,
    date: new Date().toISOString(),
    paymentMethod: '',
    type_delivery: '',
    status: 'Pendiente',
    address: {
      building: '',
      classroom: '',
    },
    code: ''
  });

  const generateCode = () => {
    const code1 = Math.floor(10000 + Math.random() * 90000);
    setCode(code1.toString());
  };

  const extractStandId = (standKey) => {
    const match = standKey.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
  };

  useEffect(() => {
    generateCode();
  }, []);

  useEffect(() => {
    const transformedProducts = Object.entries(products).flatMap(([standKey, productArray]) => {
      const standId = extractStandId(standKey);
      return productArray.map((product) => ({
        station_id: standId,
        product_id: product._id,
        name: product.name,
        amount: product.quantity,
        unit_price: product.price,
      }));
    });

    setDataForm((prevForm) => ({
      ...prevForm,
      products: transformedProducts,
      code: code
    }));
  }, [products, code]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prevForm) => ({
      ...prevForm,
      address: {
        ...prevForm.address,
        [name]: value,
      },
    }));
  };

  const handleConfirmClick = () => {
    if (dataForm.paymentMethod === 'tarjeta') {
      setOpenStripeModal(true);
    } else {
      createOrder(dataForm, userId);
      handleClose();
      refreshCart(); // Recargar carrito
    }
  };

  const handleStripePaymentSuccess = () => {
    setOpenStripeModal(false);
    createOrder(dataForm, userId);
    handleClose();
    refreshCart(); // Recargar carrito
    alert('Pago exitoso'); // Mostrar alerta de pago exitoso
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: { xs: '90%', sm: '70%', md: '50%' },
          }}
        >
          <Typography sx={{ margin: 1 }} id="modal-modal-title" variant="h4" component="h2">
            Confirmar Pedido
          </Typography>
          <Divider sx={{ bgcolor: '#077d6b', margin: 1 }} />
          <form>
            <TextField
              label="Fecha y Hora para tu pedido"
              type="datetime-local"
              name="date"
              value={dataForm.date.slice(0, 16)}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              select
              label="Método de Pago"
              name="paymentMethod"
              value={dataForm.paymentMethod}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="tarjeta">Tarjeta de Crédito</MenuItem>
              <MenuItem value="efectivo">Efectivo</MenuItem>
            </TextField>

            <TextField
              select
              label="Tipo de Entrega"
              name="type_delivery"
              value={dataForm.type_delivery}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Envio">A Domicilio</MenuItem>
              <MenuItem value="Recoger">Recoger en Tienda</MenuItem>
            </TextField>

            {dataForm.type_delivery === 'Envio' && (
              <>
                <TextField
                  select
                  label="Edificio"
                  name="building"
                  value={dataForm.address.building}
                  onChange={handleAddressChange}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="A">Edificio A</MenuItem>
                  <MenuItem value="C">Edificio C</MenuItem>
                  <MenuItem value="D">Edificio D</MenuItem>
                  <MenuItem value="F">Edificio F</MenuItem>
                  <MenuItem value="CGTI">Edificio CGTI</MenuItem>
                </TextField>

                <TextField
                  label="Salón"
                  name="classroom"
                  value={dataForm.address.classroom}
                  onChange={handleAddressChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}

            <Box sx={{ mt: 2 }}>
              <Button sx={{ bgcolor: '#077d6b' }} variant="contained" color="primary" fullWidth onClick={handleConfirmClick}>
                Confirmar Pedido
              </Button>
            </Box>
          </form>
          <Button color="error" variant="contained" onClick={handleClose} fullWidth sx={{ mt: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      {openStripeModal && (
        <Modal open={openStripeModal} onClose={() => setOpenStripeModal(false)}>
          <Box sx={{ ...style }}>
            <Typography variant="h5" align="center">
              Procesar Pago
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Elements stripe={stripePromise}>
              <StripePaymentModal onSuccess={handleStripePaymentSuccess} total={total} />
            </Elements>
          </Box>
        </Modal>
      )}
    </>
  );
}

function StripePaymentModal({ onSuccess, total }) {
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
          amount: total* 100,
        });
        console.log('Payment successful:', data);
        elements.getElement(CardElement).clear();
        onSuccess();
      } catch (error) {
        console.error('Payment error:', error);
        setError('El pago ha fallado, intenta nuevamente.');
      }
      setLoading(false);
    } else {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Total a pagar: ${total}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <CardElement />
      </Box>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Pagar'}
      </Button>
    </Box>
  );
}
