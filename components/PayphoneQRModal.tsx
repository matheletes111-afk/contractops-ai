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

        {/* Placeholder QR Code */}
        <div className="bg-gray-100 rounded-lg p-8 mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-48 h-48 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">QR Code Placeholder</p>
            <p className="text-xs text-gray-400 mt-2">
              Replace with actual Payphone QR code
            </p>
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

