"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Cargar los componentes dinámicamente sin SSR
const DynamicMap = dynamic(() => import('pigeon-maps').then((mod) => mod.Map), { ssr: false });
const DynamicMarker = dynamic(() => import('pigeon-maps').then((mod) => mod.Marker), { ssr: false });

export default function MiMapa() {
  const [isClient, setIsClient] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // Estado para controlar la visibilidad de la información

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // No mostrar nada hasta que esté en el cliente
  }

  // Función para manejar el clic en el marcador
  const handleMarkerClick = () => {
    setShowInfo(!showInfo); // Alterna la visibilidad de la información
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', marginTop: '60px' }}> {/* Ajusta el margen superior */}
      <DynamicMap height={500} defaultCenter={[21.1561, -100.9317]} defaultZoom={14}>
        {/* Marcador en UTNG */}
        <DynamicMarker width={40} anchor={[21.1817, -100.9310]} onClick={handleMarkerClick} /> {/* UTNG */}
      </DynamicMap>

      {/* Mostrar información al hacer clic en el marcador */}
      {showInfo && (
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
          <h3>Universidad Tecnológica del Norte de Guanajuato</h3>
          <p>La UTNG está ubicada en Dolores Hidalgo, Guanajuato.</p>
        </div>
      )}
    </div>
  );
}
