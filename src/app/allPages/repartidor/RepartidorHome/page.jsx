"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Cargar los componentes dinámicamente sin SSR
const DynamicMap = dynamic(() => import('pigeon-maps').then((mod) => mod.Map), { ssr: false });
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MiMapa() {
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState([]); // Guardar las órdenes obtenidas de la API
  const [newOrders, setNewOrders] = useState([]); // Guardar los nuevos pedidos "Recoger"
  const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada para mostrar en el modal

  useEffect(() => {
    setIsClient(true);
    fetchOrders(); // Obtener los pedidos iniciales

    // Ejecutar la función de polling cada 10 segundos para obtener nuevas órdenes
    const intervalId = setInterval(fetchOrders, 10000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  // Petición para obtener las órdenes desde la API
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/order`);
      const result = await response.json();

      // Filtrar las órdenes con `type_delivery` igual a "Recoger"
      const filteredOrders = result.filter(order => order.type_delivery === "Recoger");
      
      // Comprobar si hay nuevos pedidos que no estaban antes
      const newOrdersList = filteredOrders.filter(order => !orders.find(o => o._id === order._id));

      if (newOrdersList.length > 0) {
        // Si hay nuevos pedidos, actualizarlos en el estado y mostrarlos
        setNewOrders(newOrdersList);
        setSelectedOrder(newOrdersList[0]); // Mostrar el primero en el modal
      }

      setOrders(filteredOrders); // Actualizar las órdenes en el estado
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  if (!isClient) {
    return null; // No mostrar nada hasta que esté en el cliente
  }

  // Función para aceptar el pedido y cerrar el modal
  const acceptOrder = () => {
    // Lógica para aceptar el pedido podría ir aquí
    console.log("Pedido aceptado:", selectedOrder);
    setSelectedOrder(null); // Cerrar el modal
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '900px', marginTop: '60px' }}>
      <DynamicMap height={700} defaultCenter={[21.1561, -100.9317]} defaultZoom={14} />

      {/* Mostrar información de la nueva orden en un modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Centrando el modal
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxWidth: '90%', // Hacerlo responsivo
          width: '400px', // Ancho fijo en pantallas grandes
        }}>
          <h3 style={{ textAlign: 'center' }}>Nuevo pedido para recoger</h3>
          <p><strong>Pedido ID:</strong> {selectedOrder._id}</p>
          <p><strong>Usuario:</strong> {selectedOrder.user_id}</p>
          <p><strong>Productos:</strong></p>
          <ul>
            {selectedOrder.products.map((product) => (
              <li key={product.product_id}>
                {product.amount}x {product.name}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${selectedOrder.total}</p>
          <p><strong>Método de Pago:</strong> {selectedOrder.paymentMethod}</p>
          
          {/* Botones para aceptar o cerrar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button 
              onClick={acceptOrder} 
              style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Aceptar pedido
            </button>
            <button 
              onClick={() => setSelectedOrder(null)} 
              style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
