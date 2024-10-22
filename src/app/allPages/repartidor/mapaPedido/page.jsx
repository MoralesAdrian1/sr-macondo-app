"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Map, Marker } from 'pigeon-maps';

// Cargar los componentes dinámicamente sin SSR
const DynamicOverlay = dynamic(() => import('pigeon-maps').then((mod) => mod.Overlay), { ssr: false });

// Coordenadas de puntos de entrega
const puntosDeEntrega = [
  { lat: 21.1817, lon: -100.9310, label: 'UTNG' }, 
  { lat: 21.1717, lon: -100.9315, label: 'Cliente 1' },
  { lat: 21.1917, lon: -100.9400, label: 'Cliente 2' }
];

export default function RutasDePedidos() {
  const [isClient, setIsClient] = useState(false);
  const [route, setRoute] = useState([]); // Para almacenar la ruta

  useEffect(() => {
    setIsClient(true);
    obtenerRuta(); // Llamar a la función para obtener la ruta
  }, []);

  // Función para obtener la ruta de GraphHopper
  const obtenerRuta = async () => {
    const apiKey = '87c62134-8c14-421d-bf88-376c51e60adb'; // Coloca tu API Key de GraphHopper aquí
    const url = `https://graphhopper.com/api/1/route?point=${puntosDeEntrega[0].lat},${puntosDeEntrega[0].lon}&point=${puntosDeEntrega[1].lat},${puntosDeEntrega[1].lon}&point=${puntosDeEntrega[2].lat},${puntosDeEntrega[2].lon}&vehicle=car&locale=es&key=${apiKey}&type=json&points_encoded=false`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Extraemos la geometría de la ruta
      const coordinates = data.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]); // Lat, Lon
      setRoute(coordinates); // Guardar las coordenadas de la ruta
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
    }
  };

  if (!isClient) {
    return null; // No mostrar nada hasta que esté en el cliente
  }

  // Función para dibujar líneas entre los puntos utilizando la conversión de coordenadas
  const dibujarRuta = (map) => {
    if (route.length === 0) return null;

    const points = route.map(coord => {
      const [x, y] = map.latLngToPixel(coord[0], coord[1]); // Convertir coordenadas geográficas a píxeles
      return `${x},${y}`;
    }).join(' ');

    return (
      <DynamicOverlay anchor={route[0]}>
        <svg width="600" height="600" style={{ position: 'absolute', top: 0, left: 0 }}>
          <polyline
            points={points}
            stroke="red"
            strokeWidth={4}
            fill="none"
          />
        </svg>
      </DynamicOverlay>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      <Map height={600} defaultCenter={[21.1817, -100.9310]} defaultZoom={13}>
        {(map) => (
          <>
            {/* Marcadores de puntos de entrega */}
            {puntosDeEntrega.map((punto, index) => (
              <Marker key={index} width={40} anchor={[punto.lat, punto.lon]}>
                <div style={{
                  backgroundColor: 'blue',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }} />
              </Marker>
            ))}

            {/* Dibujar la ruta */}
            {dibujarRuta(map)}
          </>
        )}
      </Map>
    </div>
  );
}
