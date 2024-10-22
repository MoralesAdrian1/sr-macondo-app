import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { createOrder } from '../utils/createOrder';
import { Divider } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',  // Ancho completo para pantallas pequeñas
  maxWidth: 400,  // Ancho máximo en pantallas grandes
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflow: 'auto',  // Para manejar contenidos largos
  maxHeight: '90vh',  // Limitar altura en pantallas pequeñas
};

export default function ConfirmModal({ userId, total, products = {}, open, handleClose }) {
  const [code, setCode] = useState('');
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
    code: ''  // Inicializamos el campo de código aquí
  });

  // Función para generar un código de 5 dígitos aleatorio
  const generateCode = () => {
    const code1 = Math.floor(10000 + Math.random() * 90000);  // Genera un número aleatorio de 5 dígitos
    setCode(code1.toString());  // Almacena el código como cadena en el estado
  };

  const extractStandId = (standKey) => {
    const match = standKey.match(/\(([^)]+)\)/);
    if (match) {
      return match[1];
    }
    return '';
  };

  // Generamos el código una vez al montar el componente
  useEffect(() => {
    generateCode();
  }, []);  // El código solo se generará una vez cuando se monte el componente

  // Transformar los productos y actualizar el formulario con el código generado
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
      code: code  // Actualizamos el código generado en el formulario
    }));
  }, [products, code]);  // Dependemos de `products` y `code` para actualizar `dataForm`

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
    console.log('Datos del formulario:', dataForm);
    createOrder(dataForm, userId);  // Enviamos el formulario con el código generado
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          width: { xs: '90%', sm: '70%', md: '50%' },  // Ancho responsivo para pantallas móviles
        }}
      >
        <Typography sx={{ margin: 1 }} id="modal-modal-title" variant="h4" component="h2">
          Confirmar Pedido
        </Typography>
        <Divider sx={{ bgcolor: '#077d6b', margin: 1 }} />
        <form>
          {/* Fecha y hora */}
          <TextField
            label="Fecha y Hora para tu pedido"
            type="datetime-local"
            name="date"
            value={dataForm.date.slice(0, 16)} // Solo el formato YYYY-MM-DDTHH:MM
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Método de pago */}
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

          {/* Tipo de entrega */}
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

          {/* Mostrar campos adicionales si la entrega es A Domicilio */}
          {dataForm.type_delivery === 'Envio' && (
            <>
              {/* Seleccionar Edificio */}
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

              {/* Texto libre para salón */}
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
  );
}
