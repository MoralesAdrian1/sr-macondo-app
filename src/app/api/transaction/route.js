import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
//import modelo from '../models/transaccionModel'; 

const stripe = new Stripe('sk_test_51Q6gPLKGfB5KCqT4Y0RNks15CSeM1ZrS3pwQ8woHxqqqrlkFa2oq63ohhMsUXeTiRNS9pAtPd6vcBloqQZ1zlGwC00qYiO6cAh');
const firma = "whsec_gwsRagzDTWAveFGcAgv2g9Ixhva2U6LL";

export async function POST(request) {
    const body = await request.json();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, firma);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed":
            const SessionCompleted = event.data.object;

            
            const newTransaction = new modelo({
                stand_id: "1",
                pedido_id: SessionCompleted.metadata.order_id,
                usuario_id: SessionCompleted.metadata.usuario_id,
                metodo_pago: "tarjeta",  
                total: SessionCompleted.amount_total / 100,  
                fecha_transaccion: new Date(SessionCompleted.created * 1000),  
                estado: SessionCompleted.payment_status === "paid" ? "pagado" : "pendiente"
            });

            try {
                const itemSaved = await newTransaction.save();
                console.log("Transacción guardada:", itemSaved);
            } catch (error) {
                console.log("Error guardando la transacción:", error.message);
            }

           
            break;

        default:
            console.log(`Evento no manejado: ${event.type}`);
    }

    return new Response(null, { status: 200 });
}
