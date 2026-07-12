import { OrderDetails } from '@/context/CartContext';
import { addons as addonData } from '@/data';
import { deliveryZones } from '@/data/locations';

const OWNER_WHATSAPP = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || '9779848874295';

function getAddonName(id: string): string {
  const addon = addonData.find(a => a.id === id);
  return addon ? `${addon.emoji} ${addon.name}` : id;
}

function formatOrderItems(order: OrderDetails): string {
  return order.items.map(item => {
    const addons = Object.entries(item.addons)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => `  ${getAddonName(id)} x${qty}`)
      .join('\n');

    let line = `- ${item.name} (${item.size}, ${item.flavor}) x${item.quantity}`;
    line += `\n  Price: NPR ${item.price.toLocaleString()}`;
    if (item.message) line += `\n  Message: "${item.message}"`;
    if (addons) line += `\n${addons}`;
    return line;
  }).join('\n');
}

export function getOrderWhatsAppMessage(order: OrderDetails): string {
  const orderZone = deliveryZones.find(z => z.id === order.deliveryZone);

  let msg = `🎂 *NEW ORDER - Bubble Cake*\n\n`;
  msg += `📦 Order #${order.id.slice(0, 8).toUpperCase()}\n`;
  msg += `👤 Sender: ${order.name}\n`;
  if (order.recipientName) {
    msg += `🎁 Recipient: ${order.recipientName}\n`;
  }
  msg += `📞 Recipient Phone: ${order.phone}\n\n`;
  msg += `🍰 *Items:*\n${formatOrderItems(order)}\n\n`;
  msg += `💰 *Total: NPR ${order.total.toLocaleString()}*\n`;
  msg += `💳 Payment: ${order.paymentMethod === 'qr' ? 'QR Payment (Advance Paid)' : 'Cash on Delivery'}\n`;
  if (order.paymentMethod === 'qr' && order.advancePaid > 0) {
    msg += `💵 Advance: NPR ${order.advancePaid.toLocaleString()}\n`;
    msg += `💵 Remaining: NPR ${(order.total - order.advancePaid).toLocaleString()}\n`;
  }
  msg += `📦 Delivery: ${order.deliveryDate}\n`;
  if (orderZone) {
    msg += `📍 Zone: ${orderZone.name} - ${order.deliveryArea}\n`;
  }
  msg += `🏠 Address: ${order.address}\n`;
  if (order.remarks) msg += `💬 Remarks: ${order.remarks}\n`;

  return msg;
}

export function getOrderConfirmationMessage(order: OrderDetails): string {
  let msg = `✅ *Order Confirmed - Bubble Cake*\n\n`;
  msg += `Thank you, ${order.name}!\n\n`;
  msg += `📦 Order #${order.id.slice(0, 8).toUpperCase()}\n`;
  msg += `🍰 ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}\n`;
  msg += `💰 Total: NPR ${order.total.toLocaleString()}\n`;
  msg += `📅 Delivery: ${order.deliveryDate}\n\n`;
  msg += `We'll contact you shortly to confirm!`;

  return msg;
}

export function sendWhatsAppMessage(phone: string, message: string): void {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank');
}

export function sendOrderToOwner(order: OrderDetails): void {
  const message = getOrderWhatsAppMessage(order);
  sendWhatsAppMessage(OWNER_WHATSAPP, message);
}

export function sendOrderConfirmation(order: OrderDetails): void {
  const message = getOrderConfirmationMessage(order);
  const phone = order.phone.replace(/[^0-9]/g, '');
  sendWhatsAppMessage(phone, message);
}
