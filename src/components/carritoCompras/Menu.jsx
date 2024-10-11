import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const MenuModal = ({ open, onClose, products, standName, setCart, categories = [] }) => {
  const [quantities, setQuantities] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [warningModalOpen, setWarningModalOpen] = useState(false); // Estado para el modal de advertencia
  const [value, setValue] = React.useState(2);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  // Filtrar las categorías relevantes solo para los productos de este stand
  const relevantCategories = categories.filter(category =>
    products.some(product => product.catProductId === category._id)
  );

  const handleChange = (event, newValue) => {
    setSelectedCategoryId(newValue === 0 ? null : relevantCategories[newValue - 1]._id); // Seteamos la categoría seleccionada o todas
  };
  
  // Filtramos los productos por la categoría seleccionada
  const filteredProducts = selectedCategoryId
    ? products.filter(product => product.catProductId === selectedCategoryId)
    : products; // Si no hay categoría seleccionada, mostramos todos los productos

  useEffect(() => {
    setQuantities(Array(products.length).fill(0)); // Reinicia las cantidades al abrir el modal
  }, [products]);

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

  // Calcular el precio total de los productos seleccionados
  const totalPrice = products.reduce((acc, product, index) => {
    return acc + product.price * quantities[index];
  }, 0);

  // Guardar los productos seleccionados en el carrito
  const handleAddToCart = () => {
    const selectedProducts = products
      .map((product, index) => ({
        name: product.name,
        standName: standName,
        price: product.price,
        quantity: quantities[index], // Incluir la cantidad seleccionada
      }))
      .filter((item) => item.quantity > 0); // Solo guardar los productos con cantidad mayor a 0

    // Actualizar el carrito con los productos seleccionados
    setCart((prevCart) => [...prevCart, ...selectedProducts]);

    console.log("Productos añadidos al carrito:", selectedProducts);
    setSnackbarMessage("Productos añadidos al carrito!");
    setSnackbarOpen(true);
    resetQuantities();
    onClose();
  };

  const resetQuantities = () => {
    setQuantities(Array(products.length).fill(0));
  };

  const handleClose = () => {
    if (totalQuantity > 0) {
      setWarningModalOpen(true); // Mostrar el modal de advertencia
    } else {
      onClose(); // Cerrar normalmente
    }
  };

  const handleWarningClose = () => {
    setWarningModalOpen(false); // Cerrar el modal de advertencia
  };

  const handleConfirmClose = () => {
    resetQuantities(); // Reiniciar cantidades al confirmar cierre
    setWarningModalOpen(false); // Cerrar modal de advertencia
    onClose(); // Cerrar modal principal
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", color: "white", bgcolor: "#077d6b" }}>
          {standName ? `Menú de ${standName}` : "Menú"}
        </DialogTitle>
        
        <Tabs
  variant="fullWidth"
  sx={{ color: "#077d6b" }}
  value={selectedCategoryId === null ? 0 : relevantCategories.findIndex(cat => cat._id === selectedCategoryId) + 1}
  onChange={handleChange}
  aria-label="category tabs"
  TabIndicatorProps={{
    sx: { backgroundColor: "#077d6b" }
  }}
>
  <Tab
    sx={{
      backgroundColor: selectedCategoryId === null ? "#077d6b" : "white",
      color: selectedCategoryId === null ? "white" : "#077d6b",
      '&:hover': {
        backgroundColor: selectedCategoryId === null ? "#077d6b" : "rgba(7, 125, 107, 0.1)",
      },
      '&.Mui-selected': {
        color: "white !important", // Asegúrate de que el texto seleccionado sea blanco
      },
    }}
    label="Todos"
  />
  {relevantCategories.map((category) => (
    <Tab
      key={category._id}
      sx={{
        backgroundColor: selectedCategoryId === category._id ? "#077d6b" : "white",
        color: selectedCategoryId === category._id ? "white" : "#077d6b",
        '&:hover': {
          backgroundColor: selectedCategoryId === category._id ? "#077d6b" : "rgba(7, 125, 107, 0.1)",
        },
        '&.Mui-selected': {
          color: "white !important", // Asegúrate de que el texto seleccionado sea blanco
        },
      }}
      label={category.name}
    />
  ))}
</Tabs>

        <DialogContent>
          {filteredProducts.length > 0 ? (
            <List>
              {filteredProducts.map((product, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body4" color="text.primary" sx={{ fontSize: '0.8rem' }}>
                            {product.description}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                            Precio: ${product.price.toFixed(2)}
                          </Typography>
                        </>
                      }
                    />
                    <IconButton onClick={() => decreaseQuantity(index)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      {quantities[index]}
                    </Typography>
                    <IconButton onClick={() => increaseQuantity(index)}>
                      <AddIcon />
                    </IconButton>
                  </ListItem>
                  {index < products.length - 1 && <Divider sx={{ bgcolor: "#077d6b" }} />} {/* Divide entre productos */}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No hay productos disponibles para este stand.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddToCart}
            color="primary"
            disabled={totalQuantity === 0}
            variant="contained"
            sx={{ bgcolor: "#077d6b" }}
          >
            Añadir al carrito (${totalPrice.toFixed(2)})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de advertencia */}
      <Dialog open={warningModalOpen} onClose={handleWarningClose}>
        <DialogTitle sx={{ textAlign: "center", color: "white", bgcolor: "#FF474C" }}>Advertencia</DialogTitle>
        <DialogContent>
          <Typography>
            Tienes productos seleccionados. Si cierras el menú, perderás los cambios. ¿Estás seguro de que deseas cerrar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleConfirmClose} color="error">
            Cerrar y perder cambios
          </Button>
          <Button variant="contained" onClick={handleWarningClose} sx={{ bgcolor: "#077d6b" }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuModal;
