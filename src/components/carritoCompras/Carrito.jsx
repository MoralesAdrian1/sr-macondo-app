import { useState, useEffect, useCallback } from "react";
import { List, ListItem, ListItemText, Typography, Box, Divider, Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ConfirmModal from "./ConfirmModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const idTest = "6701c1f1622fbf1ad45cbed9";

const Carrito = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [productsEnv, setProductsEnv] = useState([]); 
  const [groupedProducts, setGroupedProducts] = useState({});
  const [total, setTotal] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/user`);
      const users = await response.json();
      setData(users);

      const response2 = await fetch(`${API_URL}/product`);
      const products = await response2.json();
      setData2(products);

      const response3 = await fetch(`${API_URL}/stand`);
      const stands = await response3.json();
      setData3(stands);

      groupProductsByStand(users, products, stands);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const groupProductsByStand = (users, products, stands) => {
    const cartProducts = users.flatMap(user => user.cart?.products || []);

    const matchingProducts = cartProducts.map(cartItem => {
      const product = products.find(p => p._id === cartItem.product_id);
      if (product) {
        const stand = stands.find(s => s._id === product.standId);

        if (stand) {
          return {
            standName: stand.name,
            standId: stand._id,
            productId: product._id,
            productName: product.name,
            quantity: cartItem.quantity,
            price: product.price
          };
        }
      }
      return null;
    }).filter(Boolean);

    const grouped = matchingProducts.reduce((acc, item) => {
      const { standName, standId, productId, productName, quantity, price } = item;

      const standKey = `${standName} (${standId})`;

      if (!acc[standKey]) {
        acc[standKey] = [];
      }
      acc[standKey].push({
        _id: productId,
        name: productName,
        quantity,
        price
      });

      return acc;
    }, {});

    setGroupedProducts(grouped);
  };

  const calculateTotal = useCallback(() => {
    const newTotal = Object.values(groupedProducts)
      .flat()
      .reduce((acc, product) => acc + (product.price * product.quantity), 0);

    setTotal(newTotal);
  }, [groupedProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    calculateTotal();
  }, [groupedProducts, calculateTotal]);

  const handleQuantityChange = (productId, delta) => {
    setGroupedProducts(prevState => {
      const updatedProducts = { ...prevState };

      Object.keys(updatedProducts).forEach(standKey => {
        updatedProducts[standKey] = updatedProducts[standKey]
          .map(product => {
            if (product._id === productId) {
              const newQuantity = product.quantity + delta;
              return { ...product, quantity: newQuantity };
            }
            return product;
          })
          .filter(product => product.quantity > 0);
      });

      return updatedProducts;
    });
  };

  const handleCheckout = async () => {
    try {
      const transformedProducts = Object.values(groupedProducts)
        .flat()
        .filter(product => product.quantity > 0)
        .map(product => ({
          product_id: product._id,
          quantity: product.quantity,
        }));

      setProductsEnv(transformedProducts);

      const response = await fetch(`${API_URL}/user/${idTest}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: {
            total: total,
            products: transformedProducts,
          },
        }),
      });

      if (response.ok) {
        console.log("Carrito actualizado correctamente");
        setOpenConfirmation(true);
      } else {
        console.error("Error al actualizar el carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: { xs: 0, sm: "240px" }, width: { sm: `calc(100% - 240px)` } }}>
      <Typography variant="h4" color="black">Tu Carrito</Typography>
      <Divider sx={{ my: 2 }} />

      {Object.entries(groupedProducts).map(([standKey, products]) => (
        <Box key={standKey} sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ color: "black" }}>{standKey}</Typography>
          <List>
            {products.map((product) => (
              <ListItem key={product._id}>
                <ListItemText primary={`${product.name} Precio: ${product.price} c/u`} secondary={`ID: ${product._id}`} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleQuantityChange(product._id, -1)} size="small">
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ mx: 2 }}>{product.quantity}</Typography>
                  <IconButton onClick={() => handleQuantityChange(product._id, 1)} size="small">
                    <AddIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}

      <Button sx={{ bgcolor: "#077d6b", color: "white" }} onClick={handleCheckout}>
        Pagar (Total: {total.toFixed(2)} $)
      </Button>

      {openConfirmation && (
        <ConfirmModal
          userId={idTest}
          total={total}
          products={groupedProducts}
          open={openConfirmation}
          handleClose={() => setOpenConfirmation(false)}
        />
      )}
    </Box>
  );
};

export default Carrito;
