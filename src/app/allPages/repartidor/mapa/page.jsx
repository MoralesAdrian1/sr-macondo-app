"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Cargar los componentes dinámicamente sin SSR
const DynamicMap = dynamic(() => import('pigeon-maps').then((mod) => mod.Map), { ssr: false });
const DynamicMarker = dynamic(() => import('pigeon-maps').then((mod) => mod.Marker), { ssr: false });
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function MiMapa() {
  const [isClient, setIsClient] = useState(false);
  const [stands, setStands] = useState([]); // Guardar los stands obtenidos de la API
  const [hue, setHue] = useState(0); // Estado para controlar el color de los marcadores
  const [selectedStand, setSelectedStand] = useState(null); // Stand seleccionado para mostrar información

  useEffect(() => {
    setIsClient(true);
    fetchData(); // Obtener los datos de la API
  }, []);

  // Peticiones
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/stand`);
      const result = await response.json();

      // Añadir el console.log para ver los datos obtenidos de la API
      console.log("Datos recibidos de la API:", result);

      setStands(result); // Guardar los datos de los stands en el estado
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!isClient) {
    return null; // No mostrar nada hasta que esté en el cliente
  }

  // Función para manejar el clic en el marcador
  const handleMarkerClick = (stand) => {
    setSelectedStand(stand); // Al hacer clic en un marcador, se selecciona ese stand para mostrar su información
    setHue(hue + 20); // Cambiar el color del marcador al hacer clic
  };

  const markerColor = `hsl(${hue % 360}deg 39% 70%)`; // Definir color dinámico basado en el estado `hue`

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', marginTop: '60px' }}>
      <DynamicMap height={500} defaultCenter={[21.1561, -100.9317]} defaultZoom={14}>
        {/* Iterar sobre los stands y mostrar un marcador para cada uno */}
        {stands.map((stand) => {
          // Verificar si el stand tiene latitud y longitud válidos
          if (stand.address && stand.address.latitud && stand.address.longitud) {
            return (
              <DynamicMarker
                key={stand._id}
                width={60}
                anchor={[parseFloat(stand.address.latitud), parseFloat(stand.address.longitud)]} // Convertir las coordenadas a números
                color={markerColor} // Usar el color dinámico
                onClick={() => handleMarkerClick(stand)} // Manejador del clic en el marcador
              />
            );
          }
          // Si no hay latitud o longitud, no renderizar el marcador
          return null;
        })}
      </DynamicMap>

      {/* Mostrar información del stand seleccionado */}
      {selectedStand && (
        <div style={{
          position: 'absolute',
          top: '20px', // Posición vertical
          right: '20px', // Posición horizontal (a la derecha del mapa)
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1000, // Asegura que esté sobre el mapa
          maxWidth: '200px' // Limita el ancho de la caja de información
        }}>
          <h3>{selectedStand.name}</h3>
          {/* <p>Latitud: {selectedStand.address.latitud}</p>
          <p>Longitud: {selectedStand.address.longitud}</p> */}
        </div>
      )}
    </div>
  );
}
