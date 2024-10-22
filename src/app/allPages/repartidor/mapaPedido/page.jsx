"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Cargar Google Maps dinámicamente sin SSR
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript), { ssr: false });
const GoogleMap = dynamic(() => import('@react-google-maps/api').then(mod => mod.GoogleMap), { ssr: false });
const DirectionsRenderer = dynamic(() => import('@react-google-maps/api').then(mod => mod.DirectionsRenderer), { ssr: false });

const puntosDeEntrega = [
  { lat: 21.1817, lng: -100.9310, label: 'UTNG' }, 
  { lat: 21.1717, lng: -100.9315, label: 'Cliente 1' },
  { lat: 21.1917, lng: -100.9400, label: 'Cliente 2' }
];

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = { lat: 21.1817, lng: -100.9310 }; // Centro inicial del mapa

export default function RutasDePedidos() {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isClient, setIsClient] = useState(false); // Asegurarse de que estamos en el cliente

  useEffect(() => {
    setIsClient(true); // Establecer que estamos en el cliente
    if (isClient) {
      calcularRuta();
    }
  }, [isClient]);

  // Función para calcular la ruta entre los puntos de entrega
  const calcularRuta = () => {
    if (window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      
      // Configuración de la solicitud de ruta
      const request = {
        origin: puntosDeEntrega[0], // Punto de inicio
        destination: puntosDeEntrega[2], // Punto de fin
        waypoints: [{ location: puntosDeEntrega[1] }], // Paradas intermedias
        travelMode: window.google.maps.TravelMode.DRIVING // Modo de transporte
      };

      // Llamada a la API Directions de Google Maps para calcular la ruta
      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`Error al calcular la ruta: ${status}`);
        }
      });
    }
  };

  if (!isClient) {
    return null; // No renderizamos nada hasta que estemos en el cliente
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyB5baWGKSSp6MC2yfpcVrkWu9nwS_3Gm7Y">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {/* Servicio de Direcciones de Google */}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{ polylineOptions: { strokeColor: '#ff0000', strokeWeight: 5 }}} // Personalización del estilo de la ruta
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
