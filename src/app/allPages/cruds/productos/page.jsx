"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch, // Importar Switch para un toggle de disponibilidad
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductoCrud() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    availability: false, // Cambiado de 0 a false
    standId: "",
    catProductId:""
  });
  const [data, setData] = useState([]);
  const [dataStand, setDataStand] = useState([]);
  const [dataCat,setDataCat] = useState([]);
  const [editId, setEditId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [positive, setPositive] = useState(false);
  const [negative, setNegative] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/product`);
      const result = await response.json();
      setData(result);
      
      const response2 = await fetch(`${API_URL}/stand`);
      const result2 = await response2.json(); // Cambiado para usar response2
      setDataStand(result2); // Asignar los datos de los stands

      const response3 = await fetch(`${API_URL}/catProduct`);
      const result3 = await response3.json(); 
      setDataCat(result3); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseEvent = () => {
    setNegative(false);
    setPositive(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Manejar los valores booleanos correctamente
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log("Select change:", name, value); // Debug para ver el valor seleccionado
    setFormData({ ...formData, [name]: value }); // Actualiza el campo correcto
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    try {
      const response = await fetch(`${API_URL}/product`, {
        method: editId ? "PUT" : "POST", // Usar PUT si es edición
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        if (editId) {
          setData(data.map(item => item._id === editId ? result : item));
          setSnackMessage("Producto actualizado exitosamente");
        } else {
          setData([...data, result]); // Actualiza el estado con el nuevo producto
          setSnackMessage("Producto creado exitosamente");
        }
        setPositive(true);
      } else {
        setSnackMessage("Error al guardar producto");
        setNegative(true);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackMessage("Error al guardar producto");
      setNegative(true);
    } finally {
      setDialogOpen(false); // Cierra el diálogo después de enviar
      setFormData({ name: "", description: "", price: 0, availability: false, standId: "",catProductId:"" }); // Reinicia el formulario
      setEditId(null); // Reinicia el ID de edición
    }
  };

  const handleEdit = (id) => {
    const productToEdit = data.find((item) => item._id === id);
    if (productToEdit) {
      setFormData(productToEdit);
      setEditId(id);
      setDialogOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setData(data.filter((item) => item._id !== id)); // Elimina el producto del estado
        setSnackMessage("Producto eliminado exitosamente");
        setPositive(true);
      } else {
        setSnackMessage("Error al eliminar producto");
        setNegative(true);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setSnackMessage("Error al eliminar producto");
      setNegative(true);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginLeft: { xs: 0, sm: "240px" },
        width: { sm: `calc(100% - 240px)` },
      }}
    >
      <Container>
        <Typography variant="h4" gutterBottom>
          Administración de Productos
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Agregar Producto
            </Button>
          </Grid>
          <Grid item xs={12}>
  <DataGrid
    rows={data}
    getRowId={(row) => row._id}
    columns={[
      { field: "name", headerName: "Nombre", flex: 1 },
      { field: "description", headerName: "Descripción", flex: 1 },
      { field: "price", headerName: "Precio", flex: 1 },
      {
        field: "availability",
        headerName: "Disponibilidad",
        flex: 1,
        renderCell: (params) => (params.row.availability ? "Disponible" : "No Disponible"), // Cambia el valor 0 o 1 por true o false.
      },
      { field: "standId", headerName: "ID Stand", flex: 1 },
      { field: "catProductId", headerName: "ID Categoría Producto", flex: 1 }, // Nueva columna para catProductId
      { field: "_id", headerName: "ID Producto", flex: 1 }, // Nueva columna para _id
      {
        field: "actions",
        headerName: "Acciones",
        renderCell: (params) => (
          <>
            <IconButton onClick={() => handleEdit(params.row._id)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <Delete />
            </IconButton>
          </>
        ),
      },
    ]}
    autoHeight
    pageSize={5}
  />
</Grid>

        </Grid>
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editId ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Nombre"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="price"
            label="Precio"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.availability}
                onChange={handleChange}
                name="availability"
                color="primary"
              />
            }
            label="Disponible"
          />
          <FormControl fullWidth margin="dense">
  <InputLabel>Seleccionar Stand</InputLabel>
  <Select
    name="standId" // Añadir el atributo name para identificar el campo
    value={formData.standId}
    onChange={handleSelectChange} // Usar una sola función para ambos selects
    label="Seleccionar Stand"
    required
  >
    {dataStand.map((stand) => (
      <MenuItem key={stand._id} value={stand._id}>
        {stand.name} {/* Aquí puedes mostrar el nombre del stand */}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl fullWidth margin="dense">
  <InputLabel>Seleccionar Categoria</InputLabel>
  <Select
    name="catProductId" // Añadir el atributo name para identificar el campo
    value={formData.catProductId}
    onChange={handleSelectChange} // Usar la misma función para ambos selects
    label="Seleccionar Categoria"
    required
  >
    {dataCat.map((cat) => (
      <MenuItem key={cat._id} value={cat._id}>
        {cat.name} {/* Aquí puedes mostrar el nombre de la categoría */}
      </MenuItem>
    ))}
  </Select>
</FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{editId ? "Actualizar" : "Agregar"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={positive} autoHideDuration={6000} onClose={handleCloseEvent}>
        <Alert onClose={handleCloseEvent} severity="success" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={negative} autoHideDuration={6000} onClose={handleCloseEvent}>
        <Alert onClose={handleCloseEvent} severity="error" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
