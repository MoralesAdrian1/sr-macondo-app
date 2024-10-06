"use client";
import React, { useState, useEffect } from "react";
import {
  Container, TextField, Button, Grid, Typography, 
  IconButton, Box, Snackbar, Alert, Dialog, DialogActions,
  DialogContent, DialogTitle
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Crud() {
  const [formData, setFormData] = useState({ name: "" });
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
      const response = await fetch(`${API_URL}/rol`);
      const result = await response.json();
      setData(result);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Actualizar registro
        await fetch(`${API_URL}/rol/${editId}`, {
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
        const response = await fetch(`${API_URL}/rol`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const newItem = await response.json();
        setData([...data, newItem]);
      }
      setFormData({ name: "" });
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
      await fetch(`${API_URL}/rol/${id}`, { method: "DELETE" });
      setData(data.filter((item) => item._id !== id));
      setPositive(true);
    } catch (error) {
      setNegative(true);
      console.error("Error deleting data:", error);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Rol', width: 300 },
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
        CRUD de Entidades
      </Typography>

      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Agregar Rol
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ height: 400, width: '100%', marginTop: 4 }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editId ? "Actualizar Rol" : "Agregar Rol"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Rol"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
          />
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
  );
}
