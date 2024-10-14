import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "http://localhost:3001/api";
export default function AddToCart({ exporProducts, onClose }) {
  const idTest = "6701c1f1622fbf1ad45cbed9"; // ID del usuario de prueba
  // useEffect para enviar la actualización del carrito al cargar el componente
  useEffect(() => {
    if (exporProducts && exporProducts.length > 0) {
      updateCart();
    }
  }, [exporProducts]);
  console.log(exporProducts);

  // Función para actualizar el carrito del usuario
  const updateCart = async () => {
    try {
      // Mapeamos los productos con la estructura que el backend espera
      const transformedProducts = exporProducts.map(product => ({
        product_id: product.productId, // Renombramos el campo a product_id
        quantity: product.quantity,
      }));
  
      // Verificamos el cuerpo de la solicitud
      console.log("Cuerpo de la solicitud:", JSON.stringify({
        cart: {
          total: 0,
          products: transformedProducts,
        },
      }));
  
      const response = await fetch(`${API_URL}/user/${idTest}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: {
            total: 0,
            products: transformedProducts,
          },
        }),
      });
  
      if (response.ok) {
        console.log("Carrito actualizado correctamente");
      } else {
        console.error("Error al actualizar el carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", bgcolor: "#077d6b", color: "white" }}>
        Productos Añadidos al Carrito
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        <img
          src="gifts/verificado.gif"
          alt="Productos añadidos"
          style={{ width: "100%", maxWidth: "200px", marginBottom: "5px" }}
        />
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Los productos se han añadido al carrito correctamente.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ bgcolor: "#077d6b" }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
