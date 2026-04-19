/** Digits only, country code included, no leading + (WhatsApp wa.me format). */
export function buildWhatsAppHref(phoneE164: string, message: string) {
  const digits = phoneE164.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}
