const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_URL = "http://localhost:3001/api";

export const createOrder = async (dataForm, userId) => {
  console.log(dataForm);  // Asegúrate de que los datos son correctos antes de enviarlos
  console.log(dataForm.user_id);

  try {
    // Crear la orden
    const response = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),  // Aquí usamos dataForm con la F mayúscula
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud de creación de la orden: ${response.status}`);
    }

    const orderResult = await response.json();  // Procesar la respuesta de la orden
    console.log("Orden creada:", orderResult);

    // Ahora que la orden se ha creado correctamente, actualizamos el carrito del usuario
    const response2 = await fetch(`${API_URL}/user/${dataForm.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: {
          total: 0,     // Reiniciar el total a 0
          products: [], // Vaciar el carrito
        },
      }),
    });

    if (!response2.ok) {
      throw new Error(`Error al actualizar el carrito: ${response2.status}`);
    }

    const cartResult = await response2.json();  // Procesar la respuesta de la actualización del carrito
    console.log("Carrito actualizado correctamente:", cartResult);

    return { order: orderResult, cart: cartResult };  // Devolver ambos resultados

  } catch (error) {
    console.error("Error en el proceso:", error);
  }
};
