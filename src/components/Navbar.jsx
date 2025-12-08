import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">NotesHub</h1>

        <div className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#notes" className="text-gray-700 hover:text-blue-600">Notes</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>

          <a
            href="https://chat.whatsapp.com/LTNJIwvUU7GInKRdymGzVf"
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600"
          >
            <FaWhatsapp size={20} /> Join Group
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-4">
          <a href="#home" className="block text-gray-700 hover:text-blue-600">Home</a>
          <a href="#notes" className="block text-gray-700 hover:text-blue-600">Notes</a>
          <a href="#contact" className="block text-gray-700 hover:text-blue-600">Contact</a>

          <a
            href="https://wa.me/your-group-link"
            className="w-full flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600"
          >
            <FaWhatsapp size={20} /> Join Group
          </a>
        </div>
      )}
    </nav>
  );
}
