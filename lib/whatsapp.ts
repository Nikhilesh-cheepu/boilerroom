/** Digits only, country code included, no leading + (WhatsApp wa.me format). */
export function buildWhatsAppHref(phoneE164: string, message: string) {
  const digits = phoneE164.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export function parsePriceToNumber(price: string): number {
  const n = parseFloat(price.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export type CartLineForMessage = {
  name: string;
  qty: number;
  unitPriceLabel: string;
};

export function buildCartOrderWhatsAppMessage(
  lines: CartLineForMessage[],
  venueName = "Boiler Room",
): string {
  if (lines.length === 0) {
    return `Hi ${venueName} — I'd like to place an order.`;
  }
  const body = lines.map((l) => {
    const unit = parsePriceToNumber(l.unitPriceLabel);
    const lineTotal = unit * l.qty;
    return `• ${l.name} × ${l.qty} — ₹${lineTotal.toFixed(0)}`;
  });
  const total = lines.reduce(
    (s, l) => s + parsePriceToNumber(l.unitPriceLabel) * l.qty,
    0,
  );
  return [
    `*Order — ${venueName}*`,
    "",
    ...body,
    "",
    `*Total (approx): ₹${total.toFixed(0)}*`,
  ].join("\n");
}
