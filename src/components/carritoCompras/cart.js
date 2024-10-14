import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
  } from "@mui/material";

export default function AddToCart({ exporProducts, onClose }) {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/user`);
            const result = await response.json();
            setData(result);  
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    console.log(data);
    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: "center", bgcolor: "#077d6b", color: "white" }}>
            Productos Añadidos al Carrito
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <img 
                    src="gifts/verificado.gif" 
                    alt="Productos añadidos"
                    style={{ width: "100%", maxWidth: "200px", marginBottom: "5px" }}
                />
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Los productos se han añadido al carrito correctamente.
                </Typography>
                </DialogContent>
          <DialogActions sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={onClose} sx={{ bgcolor: "#077d6b" }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      );
}
