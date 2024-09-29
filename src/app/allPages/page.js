import Navbar from "@/components/navigation/navbar";
import { Box, Button, Card, CardContent, CardMedia, Grid, List, ListItem, ListItemText, Toolbar, Typography } from "@mui/material";

export default function Home(){
    const stations = [
        {label: 'Principal',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']},
        {label: 'Tiendita',description:'Sabritas, Refrescos, dulces y mas', imgPath:'/img1.jpg',prouctos:['Papas','Refrescos']},
        {label: 'Fuente de Sodas',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']},
        {label: 'Guisados',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']},
        {label: 'Tacos',description:'Café, Ensaladas, Fruta y mas', imgPath:'/img1.jpg',prouctos:['Frape','Cafe de olla']}
      ]
    return(
        <>
              {/* contenido de la pagina */}
              <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    marginLeft: { xs: 0, sm: '240px' }, // 0 en pantallas pequeñas y 240px en pantallas medianas en adelante
    width: { sm: `calc(100% - 240px)` },
  }}
>
        <Toolbar />
        <Box sx={{ p: 2 }}>
  <Grid container spacing={2}>
    {stations.map((station, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={station.imgPath}
            alt={station.label}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {station.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {station.description}
            </Typography>

            <Button 
              href='/auth' 
              variant="contained" 
              sx={{ bgcolor: '#077d6b', mt: 2, display: 'block', marginLeft: 'auto', marginRight: 'auto',textAlign:'center' }} // Centra el botón
            >
              Ver Menú
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>
      </Box>
        </>
    )
}