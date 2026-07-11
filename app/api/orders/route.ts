import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/orders — Get all orders (or filter by phone)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (phone) {
    query = query.eq('phone', phone);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/orders — Create a new order
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
