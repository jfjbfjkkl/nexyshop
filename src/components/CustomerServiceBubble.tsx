export default function CustomerServiceBubble() {
  return (
    <a
      className="customer-service-bubble"
      href="https://wa.me/qr/Z5IJSITCHOHFE1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter le service client NEXY SHOP sur WhatsApp au +228 98309566"
    >
      <span className="customer-service-icon">
        <WhatsAppIcon />
      </span>
      <span className="customer-service-label">WhatsApp</span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 3.5a8.37 8.37 0 0 0-7.1 12.8L4 20.5l4.3-1.12A8.38 8.38 0 1 0 12.04 3.5Z" />
      <path d="M9.16 8.14c-.18-.4-.37-.41-.54-.42h-.46c-.16 0-.42.06-.64.31-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.68 4.16 3.65 2.06.8 2.48.64 2.93.6.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28l-1.62-.8c-.24-.12-.42-.18-.6.18-.18.36-.69.88-.84 1.06-.15.18-.31.2-.55.08-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.38.1-.5.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42l-.68-1.92Z" />
    </svg>
  );
}
