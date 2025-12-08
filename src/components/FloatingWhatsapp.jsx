import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsapp() {
  return (
    <a
      href="https://chat.whatsapp.com/LTNJIwvUU7GInKRdymGzVf"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-xl z-[9999] hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
    >
      <FaWhatsapp size={32} />
    </a>
  );
}
