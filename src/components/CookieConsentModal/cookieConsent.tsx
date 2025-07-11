'use client';

import { useState, useEffect } from 'react';
import { setCookie, hasCookie } from 'cookies-next'; // Install via `npm install cookies-next`

export default function CookieConsentModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check for the presence of the consent cookie
    if (!hasCookie('cookie-consent')) {
      setShowModal(true);
    }
  }, []);

  const acceptCookies = () => {
    setCookie('cookie-consent', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 md:left-8 md:right-8 p-4 bg-white shadow-md border border-gray-200 rounded-xl z-50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-satoshi">
      <p>
        We use cookies to improve your experience. By using our site, you agree to our cookie policy.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
      >
        Accept
      </button>
    </div>
  );
}
