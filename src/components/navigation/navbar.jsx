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
import Badge from '@mui/material/Badge';
import MapIcon from '@mui/icons-material/Map';
import { useEffect, useState } from 'react';
import { Home } from '@mui/icons-material';
import { getUser, logout } from '@/services/auth';
import { useRouter } from "next/navigation"; // Importa el hook useRouter
const drawerWidth = 240;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const idTest = "6701c1f1622fbf1ad45cbed9";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [invisible, setInvisible] = useState(false);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(null); // Estado inicial

  const settings = userData
  ? [
      { name: userData.nombre, action: null },
      { name: "Account", action: null },
      { name: "Dashboard", action: null },
      { name: "Logout", action: logout },
    ]
  : [];

  const handleCloseUserMenu = () => {
      logout();
      router.push("/");
  };
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
  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUserData(fetchedUser);
    }
    const user = getUser();
    setUserData(user);
  }, []);
console.log(user);
  // useEffect(() => {
  //   fetchData();
  //   compareId();
  // }, []);
  // const fetchData = async () =>{
  //   try {
  //     const response = await fetch(`${API_URL}/user`);
  //     const users = await response.json();
  //     setData(users);

  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }
  // const compareId = () => {
  //   data.forEach((user) => {
  //     // Comparar el _id del usuario con idTest
  //     if (user._id === idTest) {
  //       user.cart.forEach((cart)=>{
  //         if (cart.total === 0) {
  //           console.log("El carrito está vacío");
  //           setInvisible(false);
  //         } else {
  //           console.log("El carrito tiene productos:", user.cart.products);
  //           setInvisible(true);
  //         }
  //       })
  //       // Verificar si el carrito del usuario está vacío
        
  //     }
  //   });
  // };

  //user
  const routes = [
    { route: 'allPages/', label: 'Home', icon: <Home /> },
    { route: 'allPages/carrito', label: 'Mi Carrito', icon: <ShoppingCartIcon /> },
    { route: 'allPages/Pedido', label: 'Mi Pedido', icon: <MopedIcon /> },
    { route: 'allPages/historial', label: 'Historial de compras', icon: <HistoryIcon /> },
    { route: 'allPages/payment', label: 'Formas de Pago', icon: <PaymentIcon /> },
    { route: '/', label: 'Salir', icon: <LogoutIcon /> },
    {route:'allPages/repartidor/mapa', label:'Ver Locaciones',icon: <MapIcon/>},
    {route:'allPages/encargados/encargos', label:'Todas las Ordenes',icon: <Home/>},
    {route:'allPages/encargados/Pedido', label:'Pedidos por Stands',icon: <Home/>},
    {route:'allPages/encargados/productos', label:'Actualizar Productos',icon: <Home/>},

  ];
  //solo superAdmin
  const cruds = [
    {route:'allPages/cruds/productos', label:'Productos',icon: <Home/>},
    {route:'allPages/cruds/rol', label:'rol',icon: <Home/>},
    {route:'allPages/cruds/pedidos', label:'pedidos',icon: <Home/>},
    {route:'allPages/cruds/puesto', label:'puesto',icon: <Home/>},
    {route:'allPages/cruds/transacciones', label:'transacciones',icon: <Home/>},
  ]
  //admin
  const adminRoutes =[
    {route:'allPages/ingresos', label:'Productos',icon: <Home/>},
  ]

  //encargado
  const encargadosRoutes =[
    {route:'allPages/encargados/encargos', label:'Productos',icon: <Home/>},
    {route:'allPages/encargados/tacos', label:'Productos',icon: <Home/>},
    {route:'allPages/encargados/tiendita', label:'Productos',icon: <Home/>},
    {route:'allPages/encargados/principal', label:'Productos',icon: <Home/>},
    {route:'allPages/encargados/guisados', label:'Productos',icon: <Home/>},
    {route:'allPages/encargados/pizza', label:'Productos',icon: <Home/>},
    {route:'allPages/encargados/fsodas', label:'Productos',icon: <Home/>},
  ]
  //repartidor
  const repartidor = [
    {route:'allPages/repartidor', label:'Productos',icon: <Home/>},
    {route:'allPages/repartidor/encargos', label:'Productos',icon: <Home/>},
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
      <ListItem>
            <ListItemButton  onClick={() => handleCloseUserMenu()}>
              <ListItemIcon>
                <LogoutIcon/>
              </ListItemIcon>
              <ListItemText primary="Salir" />
            </ListItemButton>
          </ListItem>
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
        <Badge color="error" variant="dot" invisible={invisible}>
        <ShoppingCartIcon />
        </Badge>
          
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
