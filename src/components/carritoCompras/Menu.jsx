"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  IconButton,
  Snackbar,
  ListItemText,
  Alert,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react";

const MenuModal = ({ open, onClose, products, stationName }) => {
  const [quantities, setQuantities] = useState(Array(products.length).fill(0));
  const [alertOpen, setAlertOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const increaseQuantity = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1;
    setQuantities(newQuantities);
  };

  const decreaseQuantity = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) {
      newQuantities[index] -= 1;
      setQuantities(newQuantities);
    }
  };

  const totalQuantity = quantities.reduce((acc, curr) => acc + curr, 0);

  const handleClose = () => {
    if (totalQuantity > 0) {
      setAlertOpen(true); // Abre el modal de alerta si hay productos seleccionados
    } else {
      resetQuantities();
      onClose(); // Cierra el modal si no hay productos seleccionados
    }
  };

  const handleAlertClose = (confirm) => {
    if (confirm) {
      resetQuantities();
      onClose(); // Cierra el modal principal
    }
    setAlertOpen(false); // Siempre cierra el modal de alerta
  };

  const resetQuantities = () => {
    setQuantities(Array(products.length).fill(0)); // Reinicia los contadores a cero
  };

  const handleAddToCart = () => {
    // Lógica para añadir al carrito
    console.log('Añadir al carrito:', quantities);

    // Mostrar el Snackbar
    setSnackbarMessage("Productos añadidos al carrito!");
    setSnackbarOpen(true);

    // Cerrar el modal principal
    onClose();
    resetQuantities(); // Reiniciar cantidades después de añadir al carrito
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4" sx={{ padding: 2, color: 'white', bgcolor: '#077d6b' }}>
            Estación: {stationName}
          </Typography>
        </DialogTitle>
        <Divider sx={{ bgcolor: 'black' }} />
        <DialogContent>
          <Typography variant="h6">Productos Disponibles:</Typography>
          <Divider sx={{ bgcolor: '#077d6b' }} />
          <br />
          <List dense>
            {products.map((producto, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={producto}
                  secondary={`Detalles de ${producto}`}
                />
                <IconButton edge="end" aria-label="remove" onClick={() => decreaseQuantity(index)}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>
                  {quantities[index]}
                </Typography>
                <IconButton edge="end" aria-label="add" onClick={() => increaseQuantity(index)}>
                  <AddIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ bgcolor: 'black', my: 2 }} />
          <Typography variant="h6">Total de productos: {totalQuantity}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
          <Button
            onClick={handleAddToCart}
            color="primary"
            disabled={totalQuantity === 0}
          >
            Añadir al carrito
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de alerta */}
      <Dialog open={alertOpen} onClose={() => handleAlertClose(false)}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          <Typography>
            Se perderán los artículos seleccionados. ¿Deseas continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: '#077d6b' }} onClick={() => handleAlertClose(true)}>
            Confirmar
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#077d6b' }} onClick={() => handleAlertClose(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar mensaje de éxito */}
      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={handleClose}>
  <Alert
     onClose={() => setSnackbarOpen(false)}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Los Productos se añadieron al carrito exitosamente!
  </Alert>
</Snackbar>

    </>
  );
};

export default MenuModal;
