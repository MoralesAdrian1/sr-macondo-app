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
  const totalPrice = products.reduce((acc, curr, index) => acc + curr.precio * quantities[index], 0);

  const handleClose = () => {
    if (totalQuantity > 0) {
      setAlertOpen(true);
    } else {
      resetQuantities();
      onClose();
    }
  };

  const handleAlertClose = (confirm) => {
    if (confirm) {
      resetQuantities();
      onClose();
    }
    setAlertOpen(false);
  };

  const resetQuantities = () => {
    setQuantities(Array(products.length).fill(0));
  };

  const handleAddToCart = () => {
    console.log('Añadir al carrito:', quantities);
    setSnackbarMessage("Productos añadidos al carrito!");
    setSnackbarOpen(true);
    onClose();
    resetQuantities();
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
                  primary={`${producto.producto} - $${producto.precio}`} // Display name and price
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
          <Typography variant="h6">Total a pagar: ${totalPrice}</Typography> {/* Display total price */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined"
            >
            Cerrar
          </Button>
          <Button
            onClick={handleAddToCart}
            color="primary"
            disabled={totalQuantity === 0}
            variant="contained"
            sx={{bgcolor:"#077d6b"}}
          >
            Añadir al carrito
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={alertOpen} onClose={() => handleAlertClose(false)}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          <Typography>
            Se perderán los artículos seleccionados. ¿Deseas continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={() => handleAlertClose(true)}>
            Confirmar
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#077d6b' }} onClick={() => handleAlertClose(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
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
