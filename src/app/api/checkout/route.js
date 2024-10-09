import { NextResponse } from 'next/server';
import Stripe from 'stripe'; 

const stripe = new Stripe('sk_test_51Q6gPLKGfB5KCqT4Y0RNks15CSeM1ZrS3pwQ8woHxqqqrlkFa2oq63ohhMsUXeTiRNS9pAtPd6vcBloqQZ1zlGwC00qYiO6cAh');

export async function POST(request) {
   const body = await request.json();
   console.log(body);

   // Calcular el total con comisiones
   const calcularTotalConComision = (total) => {
      const porcentajeComision = 0.036; 
      const comisionFija = 3.50; 
      const totalConComision = (total + comisionFija) / (1 - porcentajeComision);
      return Math.round(totalConComision * 100); 
   };

   const totalConComision = calcularTotalConComision(body.total);

   // Crear pago 
   const lineItems = [{
      price_data: {
         currency: "mxn", 
         product_data: {
            name: body.name, 
            description: 'Orden total con comision',
            images: [body.image], 
         },
        
         unit_amount: totalConComision, 
      },
      quantity: 1, 
   }];

   // Mandar datos del pago
   const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:3000/success",
      line_items: lineItems, 
      metadata: {
         order_id: body.id, 
         order_name: body.name, 
         usuario_id: body.usuario_id, 
         total: totalConComision, 
         productos: JSON.stringify(body.productos) 
      },
      mode: "payment"
   });

   console.log(session);
   return NextResponse.json(session);
}
