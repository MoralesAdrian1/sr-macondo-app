"use client";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import MopedIcon from '@mui/icons-material/Moped';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { Home } from '@mui/icons-material';
const drawerWidth = 240;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  
  const routes = [
    { route: 'allPages/', label: 'Home', icon: <Home /> },
    { route: 'allPages/carrito', label: 'Mi Carrito', icon: <ShoppingCartIcon /> },
    { route: 'allPages/pedido', label: 'Mi Pedido', icon: <MopedIcon /> },
    { route: 'allPages/historal', label: 'Historial de compras', icon: <HistoryIcon /> },
    { route: 'allPages/payment', label: 'Formas de Pago', icon: <PaymentIcon /> },
    { route: '/', label: 'Salir', icon: <LogoutIcon /> },
  ];
  const cruds = [
    {route:'allPages/productos', label:'Productos',icon: <Home/>},
    {route:'allPages/rol', label:'Productos',icon: <Home/>},
    {route:'allPages/puesto', label:'Productos',icon: <Home/>},
    {route:'allPages/productos', label:'Productos',icon: <Home/>},
  ]
  
  const drawer = (
    <div>
      <List >
        <ListItem disablePadding>
          <ListItemButton sx={{height:47}} href='/allPages/profile'>
            <ListItemIcon>
              <Avatar  {...stringAvatar('Adrian Morales')} />
            </ListItemIcon>
            <ListItemText primary="Hola Adrian" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {routes.map((route, index) => (
          <ListItem key={route.route} disablePadding>
            <ListItemButton href={`/${route.route}`}>
              <ListItemIcon>
                {route.icon}
              </ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
      position="fixed"
      sx={{
        bgcolor: '#077d6b',
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Sr. Macondo App
        </Typography>
        
        {/* Icono de carrito de compras */}
        <IconButton color="inherit" aria-label="shopping cart" sx={{ ml: 2 }} href='/allPages/carrito'>
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
