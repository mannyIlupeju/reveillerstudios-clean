'use client';
import { useEffect, useState } from 'react';

type Props = {
  detectedCountry: 'CA' | 'US';
};

const CountrySwitchModal = ({ detectedCountry }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [savedCountry, setSavedCountry] = useState<'CA' | 'US' | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/user-country=(CA|US)/);
    const stored = match?.[1] === 'CA' || match?.[1] === 'US' ? match[1] as 'CA' | 'US' : null;
    setSavedCountry(stored);

    // Show modal if detected country and stored country do not match
    if (detectedCountry && stored && detectedCountry !== stored) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [detectedCountry]);

  const switchCountry = () => {
    document.cookie = `user-country=${detectedCountry}; path=/; max-age=31536000`;
    location.reload();
  };

  return (
    showModal ? (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl text-center max-w-md shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Switch Store?</h2>
          <p className="mb-4">
            {detectedCountry === 'US'
              ? `You're browsing from US. Would you like to switch to the US store?`
              : `You're browsing from CA. Would you like to switch to the CA store?`}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={switchCountry}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Yes, switch
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="border border-gray-300 px-4 py-2 rounded"
            >
              No, stay here
            </button>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default CountrySwitchModal;
