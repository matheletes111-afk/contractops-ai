"use client";

interface PayphoneQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
}

export default function PayphoneQRModal({
  isOpen,
  onClose,
  planName,
  amount,
}: PayphoneQRModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pay via Payphone
          </h2>
          <p className="text-gray-600">
            Scan the QR code below to pay ₹{amount} for {planName} plan
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-gray-100 rounded-lg p-8 mb-6 flex items-center justify-center">
          <div className="text-center">
            <img
              src="/Qr_code.jpeg"
              alt="Payphone QR Code"
              className="w-48 h-48 mx-auto rounded-lg"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] transition-all"
          >
            I've Paid
          </button>
        </div>
      </div>
    </div>
  );
}

