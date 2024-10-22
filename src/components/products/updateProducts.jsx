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
  Switch,
  Divider,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const testId = "6717f74f5a34ba5606cec223"; // ID del empleado

export default function ProductoCrud() {
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
  const [stationName, setStationName] = useState(""); // Nombre de la estación
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    availability: false,
    standId: "",
    catProductId: "",
  });
  const [data, setData] = useState([]); // Lista de productos
  const [dataStand, setDataStand] = useState([]); // Lista de stands
  const [employees, setEmployees] = useState([]); // Lista de empleados
  const [dataCat, setDataCat] = useState([]); // Lista de categorías de productos
  const [editId, setEditId] = useState(null); // ID del producto a editar
  const [dialogOpen, setDialogOpen] = useState(false); // Control de apertura del diálogo
  const [positive, setPositive] = useState(false); // Control de mensaje positivo
  const [negative, setNegative] = useState(false); // Control de mensaje negativo
  const [snackMessage, setSnackMessage] = useState(""); // Mensaje de los snackbars

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener productos
      const response = await fetch(`${API_URL}/product`);
      const products = await response.json();
      setData(products);
  
      // Obtener stands
      const response2 = await fetch(`${API_URL}/stand`);
      const stands = await response2.json();
      setDataStand(stands);
  
      // Obtener categorías de productos
      const response3 = await fetch(`${API_URL}/catProduct`);
      const categories = await response3.json();
      setDataCat(categories);
  
      // Obtener empleados
      const responseEmployees = await fetch(`${API_URL}/employee`);
      const employees = await responseEmployees.json();
      setEmployees(employees);
      // Filtrar datos para el empleado actual basado en testId
      const employee = employees.find((emp) => emp._id === testId);
      if (employee) {
        const standId = employee.stand_id;
  
        // Establecer el standId en formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          standId: standId, // Llenar el campo standId con el id del stand
        }));
  
        // Buscar el stand correspondiente al stand_id del empleado
        const stand = stands.find((s) => s._id === standId);
        if (stand) {
          setStationName(stand.name); // Establecer el nombre de la estación
  
          // Filtrar los productos que coinciden con el standId del empleado
          const filtered = products.filter((product) => product.standId === standId);
          setFilteredProducts(filtered); // Actualizar los productos filtrados
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  
  console.log(filteredProducts);

  const handleCloseEvent = () => {
    setNegative(false);
    setPositive(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseDialog = () => {
    // Mantener solo el standId, limpiar el resto del formData
    setFormData((prevFormData) => ({
      name: "",
      description: "",
      price: 0,
      availability: false,
      standId: prevFormData.standId, // Mantener el standId
      catProductId: "",
    }));
    setEditId(null);
    setDialogOpen(false); // Cerrar el diálogo
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/product`, {
        method: editId ? "PUT" : "POST", // PUT si es edición, POST si es nuevo producto
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        if (editId) {
          setData(data.map((item) => (item._id === editId ? result : item)));
          setSnackMessage("Producto actualizado exitosamente");
        } else {
          setData([...data, result]);
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
      setDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        price: 0,
        availability: false,
        standId: formData.standId, // Mantener el standId cuando el diálogo se cierra
        catProductId: "",
      });
      setEditId(null);
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
        setData(data.filter((item) => item._id !== id));
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
        <Typography sx={{paddingTop:5}} variant="h4" gutterBottom>
          Administración de Productos : {stationName}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
              sx={{bgcolor:"#077d6b", color:"white"}}
            >
              Agregar Producto
            </Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              rows={filteredProducts} // Mostrar solo productos filtrados
              getRowId={(row) => row._id}
              columns={[
                { field: "name", headerName: "Nombre", flex: 1 },
                { field: "description", headerName: "Descripción", flex: 1 },
                { field: "price", headerName: "Precio", flex: 1 },
                {
                  field: "availability",
                  headerName: "Disponibilidad",
                  flex: 1,
                  renderCell: (params) =>
                    params.row.availability ? "Disponible" : "No Disponible",
                },
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
          <TextField
  margin="dense"
  name="standId"
  label="Stand"
  disabled
  fullWidth
  value={formData.standId} // Accede a formData, que contiene el standId del empleado
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
            <InputLabel>Seleccionar Categoria</InputLabel>
            <Select
              name="catProductId"
              value={formData.catProductId}
              onChange={handleSelectChange}
              label="Seleccionar Categoria"
              required
            >
              {dataCat.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
        <Button variant="contained" color="error" onClick={handleCloseDialog}>
    Cancelar
  </Button>
          <Button sx={{bgcolor:"#077d6b", color:"white"}} onClick={handleSubmit}>{editId ? "Actualizar" : "Agregar"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={positive}
        autoHideDuration={6000}
        onClose={handleCloseEvent}
      >
        <Alert
          onClose={handleCloseEvent}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={negative}
        autoHideDuration={6000}
        onClose={handleCloseEvent}
      >
        <Alert
          onClose={handleCloseEvent}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
