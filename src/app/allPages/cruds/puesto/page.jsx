"use client";
import React, { useState, useEffect } from "react";
import {
  Container, TextField, Button, Grid, Typography, 
  IconButton, Box, Snackbar, Alert, Dialog, DialogActions,
  DialogContent, DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Crud() {
  const [formData, setFormData] = useState({ name: "",catStandId:"" });
  const [dataCat,setDataCat] = useState([]);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [positive, setPositive] = useState(false);
  const [negative, setNegative] = useState(false);

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/stand`);
      const result = await response.json();
      setData(result);

      const response3 = await fetch(`${API_URL}/catStand`);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log("Select change:", name, value); // Debug para ver el valor seleccionado
    setFormData({ ...formData, [name]: value }); // Actualiza el campo correcto
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Actualizar registro
        await fetch(`${API_URL}/stand/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        setData(data.map((item) => (item._id === editId ? { ...item, ...formData } : item)));
        setEditId(null);
      } else {
        // Crear nuevo registro
        const response = await fetch(`${API_URL}/stand`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const newItem = await response.json();
        setData([...data, newItem]);
      }
      setFormData({ name: "", catStandId:"" });
      setDialogOpen(false);
      setPositive(true);
    } catch (error) {
      setNegative(true);
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = (id) => {
    setDialogOpen(true);
    const item = data.find((item) => item._id === id);
    setFormData(item);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/stand/${id}`, { method: "DELETE" });
      setData(data.filter((item) => item._id !== id));
      setPositive(true);
    } catch (error) {
      setNegative(true);
      console.error("Error deleting data:", error);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Stand', width: 300 },
    { field: "catStandId", headerName: "ID Categoría stand", flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
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
      width: 150,
    },
  ];

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
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={positive} autoHideDuration={4000} onClose={handleCloseEvent}>
        <Alert onClose={handleCloseEvent} severity="success" variant="filled" sx={{ width: '100%' }}>
          ¡Proceso completado con éxito!
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={negative} autoHideDuration={4000} onClose={handleCloseEvent}>
        <Alert onClose={handleCloseEvent} severity="error" variant="filled" sx={{ width: '100%' }}>
          Proceso no realizado
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        CRUD de Stands
      </Typography>

      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor:"#077d6b" }}
          >
            Agregar Stand
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editId ? "Actualizar Stand" : "Agregar Stand"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Stand"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
  <InputLabel>Seleccionar Categoria</InputLabel>
  <Select
    name="catStandId" // Cambié catProductId por catStandId para que coincida con formData
    value={formData.catStandId}
    onChange={handleSelectChange} // Usar la misma función para manejar el cambio
    label="Seleccionar Categoria"
    required
  >
    {dataCat.map((cat) => (
      <MenuItem key={cat._id} value={cat._id}>
        {cat.name} {/* Mostrar el nombre de la categoría */}
      </MenuItem>
    ))}
  </Select>
</FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editId ? "Actualizar" : "Agregar"}
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="error" variant="contained">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  </Box>
  );
}
