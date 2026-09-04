'use client';

import { useState, useEffect } from 'react';
import { setCookie, hasCookie } from 'cookies-next'; // Install via `npm install cookies-next`
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export default function CookieConsentModal() {
  const [showModal, setShowModal] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-16 left-4 right-4 md:left-8 md:right-8 p-4 bg-white shadow-md border border-gray-200 rounded-xl z-50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-satoshi"
        >
          <p>
            We use cookies to improve your experience. By using our site, you agree to our cookie policy.
          </p>
          <button
            onClick={acceptCookies}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
