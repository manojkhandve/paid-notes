import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";

const paidNotes = [
  { id: 1, subject: "DAA SAMPLE SOLVED PAPER", price: 59, backendFile: "DAA-SOLVED-PAPER.pdf", initialDownloads: 12 },
  { id: 2, subject: "ML SAMPLE SOLVED PAPER", price: 59, backendFile: "ML-SOLVED-PAPER.pdf", initialDownloads: 29 },
  { id: 3, subject: "DAA + ML SAMPLE SOLVED PAPER", price: 90, backendFile: "DAA-ML-SOLVED-PAPER.pdf", initialDownloads: 17 },
];

const VALID_COUPON = "ENOTES20";
const COUPON_DISCOUNT = 20;

const BACKEND_URL = "https://paid-notes.onrender.com";

const PaidNotes = () => {
  const [downloads, setDownloads] = useState({});
  const [razorpayKey, setRazorpayKey] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);

  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/razorpay-key`);
        const data = await res.json();
        setRazorpayKey(data.key);
      } catch (err) {
        console.error("Failed to fetch Razorpay key:", err);
      }
    };

    fetchRazorpayKey();

    const storedCounts = JSON.parse(localStorage.getItem("downloadCounts")) || {};
    const initializedCounts = { ...storedCounts };

    paidNotes.forEach((note) => {
      if (!(note.id in initializedCounts)) {
        initializedCounts[note.id] = note.initialDownloads;
      }
    });

    setDownloads(initializedCounts);
    localStorage.setItem("downloadCounts", JSON.stringify(initializedCounts));
  }, []);

  const updateDownloadCount = (id) => {
    const updated = { ...downloads, [id]: (downloads[id] || 0) + 1 };
    setDownloads(updated);
    localStorage.setItem("downloadCounts", JSON.stringify(updated));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === VALID_COUPON) {
      setAppliedCoupon(true);
      alert("✅ Coupon applied! ₹20 discount will be applied at checkout.");
    } else {
      setAppliedCoupon(false);
      alert("❌ Invalid coupon code.");
    }
  };

  const handleBuy = async (note) => {
    if (!razorpayKey) {
      alert("Razorpay key not loaded yet. Please try again.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) return alert("Failed to load Razorpay SDK.");

    const finalAmount = appliedCoupon ? Math.max(note.price - COUPON_DISCOUNT, 1) : note.price;

    const options = {
      key: razorpayKey,
      amount: finalAmount * 100,
      currency: "INR",
      name: "ENotes Premium",
      description: `Purchase ${note.subject}`,
      image: "https://razorpay.com/favicon.png",

      handler: async function () {
        updateDownloadCount(note.id);

        const res = await fetch(`${BACKEND_URL}/create-download-link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify({ file: note.backendFile }),
        });

        const data = await res.json();

        if (data.link) {
          window.open(data.link, "_blank");
        }

        alert(`✅ Payment Successful! Download started for ${note.subject}`);

        setAppliedCoupon(false);
        setCoupon("");
      },

      theme: { color: "#059669" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="flex mt-17 flex-col items-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Premium Notes 💎</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />
        <button
          onClick={handleApplyCoupon}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Apply
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {paidNotes.map((note) => (
          <div key={note.id} className="border border-gray-200 bg-white rounded-2xl p-6 shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">{note.subject}</h2>
            <p className="text-gray-500 mb-4 text-sm">
              Price: ₹{appliedCoupon ? Math.max(note.price - COUPON_DISCOUNT, 1) : note.price}
            </p>
            <button
              onClick={() => handleBuy(note)}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition flex justify-center items-center gap-2 mx-auto"
            >
              <FaDownload className="text-lg" /> Get Notes Instantly
            </button>
            <p className="text-sm text-gray-600 mt-4 italic">
              👥 {downloads[note.id] || 0} students downloaded
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaidNotes;
