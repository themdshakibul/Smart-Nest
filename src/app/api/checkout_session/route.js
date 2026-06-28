import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { getUserSession } from '@/lib/core/session';



export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const user= await getUserSession();

    const formData=await request.formData();
    const price=formData.get('price');
    const rentType=formData.get('rentType');
    const title=formData.get('title');
    const location=formData.get('location');
    const image=formData.get('image');
    const propertyId=formData.get('propertyId');
    const tenantFullName=formData.get('tenantFullName');
    const moveInDate=formData.get('moveInDate');
    const contactNumber=formData.get('contactNumber');
    const additionalNotes=formData.get('additionalNotes');
    const ownerId=formData.get('ownerId');
    const ownerName=formData.get('ownerName');
    const ownerEmail=formData.get('ownerEmail');


    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
        customer_email:user?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price_data:{
           currency:"usd",
           unit_amount:Number(price)*100,
           product_data:{
            name:title,
           } 

          },
          quantity: 1,
        },
      ],
      metadata:{
        price:Number(price),
        tenantId:user?.id,
        tenantEmail:user?.email,
        BookingStatus:"Pending",
        title,
        propertyId,
        image,
        location,
        rentType,
        tenantFullName,
        moveInDate,
        contactNumber,
        additionalNotes,
        ownerId,
        ownerName,
        ownerEmail

      },
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}