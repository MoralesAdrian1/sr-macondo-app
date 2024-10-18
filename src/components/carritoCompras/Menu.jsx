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
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddToCart from "./cart";

const MenuModal = ({ open, onClose, products, standName, setCart, categories = [] }) => {
  const [quantities, setQuantities] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [exporProducts, setExporProducts] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false); // Estado para controlar el modal AddToCart

  // Filtrar las categorías relevantes solo para los productos de este stand
  const relevantCategories = categories.filter(category =>
    products.some(product => product.catProductId === category._id)
  );

  const handleChange = (event, newValue) => {
    setSelectedCategoryId(newValue === 0 ? null : relevantCategories[newValue - 1]._id);
  };

  const filteredProducts = selectedCategoryId
    ? products.filter(product => product.catProductId === selectedCategoryId)
    : products;

  useEffect(() => {
    const initialQuantities = products.reduce((acc, product) => {
      acc[product._id] = 0;
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, [products]);

  const increaseQuantity = (productId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(prevQuantities[productId] - 1, 0),
    }));
  };

  const totalQuantity = Object.values(quantities).reduce((acc, curr) => acc + curr, 0);

  const totalPrice = products.reduce((acc, product) => {
    return acc + product.price * quantities[product._id];
  }, 0);

  const handleAddToCart = () => {
    const selectedProducts = products
      .map((product) => ({
        productId: product._id,
        standId: product.standId,
        quantity: quantities[product._id],
      }))
      .filter((item) => item.quantity > 0);

    setCart((prevCart) => [...prevCart, ...selectedProducts]);

    setExporProducts(selectedProducts);
    setSnackbarMessage("Productos añadidos al carrito!");
    setSnackbarOpen(true);
    resetQuantities();
    onClose();
    setShowCartModal(true); // Abrir el modal AddToCart
  };

  const resetQuantities = () => {
    const resetQuantities = products.reduce((acc, product) => {
      acc[product._id] = 0;
      return acc;
    }, {});
    setQuantities(resetQuantities);
  };

  const handleClose = () => {
    if (totalQuantity > 0) {
      setWarningModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleWarningClose = () => {
    setWarningModalOpen(false);
  };

  const handleConfirmClose = () => {
    resetQuantities();
    setWarningModalOpen(false);
    onClose();
  };

  // Manejar el cierre del modal AddToCart
  const handleAddToCartClose = () => {
    setShowCartModal(false);
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
                color: "white !important",
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
                  color: "white !important",
                },
              }}
              label={category.name}
            />
          ))}
        </Tabs>

        <DialogContent>
          {filteredProducts.length > 0 ? (
            <List>
              {filteredProducts.map((product) => (
                <React.Fragment key={product._id}>
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
                    <IconButton onClick={() => decreaseQuantity(product._id)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      {quantities[product._id]}
                    </Typography>
                    <IconButton onClick={() => increaseQuantity(product._id)}>
                      <AddIcon />
                    </IconButton>
                  </ListItem>
                  <Divider sx={{ bgcolor: "#077d6b" }} />
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

      {/* Modal de productos añadidos al carrito */}
      {showCartModal && <AddToCart exporProducts={exporProducts} onClose={handleAddToCartClose} />}
      
      {/* Snackbar para mostrar el mensaje de éxito */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuModal;
