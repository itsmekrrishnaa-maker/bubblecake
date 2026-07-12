import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/orders — Get orders
// - Admin (authenticated): can see ALL orders
// - Customer (with phone param): can see their own orders
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  // Check if user is authenticated (admin)
  const { data: { session } } = await supabase.auth.getSession();
  const isAdmin = !!session;

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (phone) {
    // Customers can see their own orders by phone number
    query = query.eq('phone', phone);
  } else if (!isAdmin) {
    // Non-admin without phone param cannot see all orders
    return NextResponse.json([]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/orders — Create a new order (anyone can place orders)
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      id: body.id,
      items: body.items,
      total: body.total,
      delivery_fee: body.deliveryFee || 0,
      name: body.name,
      recipient_name: body.recipientName || null,
      phone: body.phone,
      address: body.address,
      payment_method: body.paymentMethod,
      advance_paid: body.advancePaid || 0,
      payment_screenshot: body.paymentScreenshot || null,
      remarks: body.remarks || null,
      reference_image: body.referenceImage || null,
      delivery_date: body.deliveryDate,
      delivery_zone: body.deliveryZone,
      delivery_area: body.deliveryArea,
      status: body.status || 'pending',
      created_at: body.createdAt || new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
