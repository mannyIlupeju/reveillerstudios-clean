'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import ConfirmationMessage from '@/components/ResponseMessages/confirmationMessage'
import { AnimatePresence } from 'motion/react'

interface ShopWaitlistFormProps {
  heading?: string
  message?: string
  backgroundImage?: string
}

// Shop-specific variant of NewsletterFooter/Newsletterfooter.tsx: same fields
// and /api/registerSubscriber submit logic, but with a bolder "Shop Closed"
// heading, visibly bordered input fields, and a background image behind the
// form. `backgroundImage` defaults to an existing brand still (already used
// as the /password page's video poster) -- swap it for whatever image you'd
// rather use here.
export default function ShopWaitlistForm({
  heading = 'Shop Closed',
  message = 'Join our waitlist to hear about the next drop.',
  backgroundImage = '/images/password-bg-poster.jpg',
}: ShopWaitlistFormProps) {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    smsConsent: false,
    requestUpdate: false,
    termsAgreed: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  async function submitRegistration(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!userData.termsAgreed) {
      alert("Please agree to the Terms of Service & Privacy Policy");
      return;
    }
    if (userData.smsConsent && !userData.phone.trim()) {
      alert("Please enter a phone number to receive SMS updates");
      return;
    }
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch('/api/registerSubscriber', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || "Registration failed");
        setStatus("error");
        setShowConfirmation(true);
      } else {
        setStatus("success");
        setShowConfirmation(true);
        setUserData({
          fullName: '',
          email: '',
          phone: '',
          smsConsent: false,
          requestUpdate: false,
          termsAgreed: false,
        });
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
      setShowConfirmation(true);
    }
  }

  function handleCloseConfirmation() {
    setShowConfirmation(false);
  }

  // Visible red border by default, turning white on focus -- reads clearly
  // against the dark overlay over the background image.
  const inputClasses =
    'bg-black/40 text-white placeholder-white/60 border-2 border-[#f60505] focus:border-white outline-none rounded-md p-2 transition-colors';

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Background image + dark overlay so text/inputs stay readable */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 480px"
        className="object-cover -z-20"
      />
      <div className="absolute inset-0 bg-black/70 -z-10" />

      <div className="relative text-sm xl:w-96 w-full mx-auto px-6 py-12 text-white">
        {/* Confirmation overlay, centered, but form remains visible */}
        <AnimatePresence>
          {(status === 'success' || status === 'error') && showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <ConfirmationMessage key={status} status={status} errorMsg={errorMsg} onClose={handleCloseConfirmation} />
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2 text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            {heading}
          </h1>
          <p className="text-white/80">{message}</p>
        </div>

        <div className="flex flex-col gap-4 my-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
              required
              id="shop-waitlist-name"
              placeholder="Enter your full name"
              className={inputClasses}
            />
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
              id="shop-waitlist-email"
              placeholder="Enter email address"
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col">
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              id="shop-waitlist-phone"
              placeholder="Phone number (optional, e.g. +12125551234)"
              className={`${inputClasses} w-full`}
            />
          </div>
        </div>

        <div className="flex justify-start gap-2">
          <input
            type="checkbox"
            id="shop-waitlist-requestUpdate"
            onChange={(e) => setUserData({ ...userData, requestUpdate: e.target.checked })}
            checked={userData.requestUpdate}
            name="requestUpdate"
          />
          <label htmlFor="shop-waitlist-requestUpdate">
            Keep me updated with the latest news and best offers
          </label>
        </div>
        <div className="flex justify-start items-start gap-2 mt-2">
          <input
            type="checkbox"
            id="shop-waitlist-smsConsent"
            onChange={(e) => setUserData({ ...userData, smsConsent: e.target.checked })}
            checked={userData.smsConsent}
            name="smsConsent"
          />
          <label htmlFor="shop-waitlist-smsConsent">
            Sign up for SMS updates. By checking this box, you agree to receive recurring
            automated marketing text messages from Reveillerstudios at the phone number
            provided. Consent is not a condition of purchase. Msg &amp; data rates may apply.
            Msg frequency varies. Reply STOP to cancel, HELP for help.
          </label>
        </div>
        <div className="flex justify-start gap-2 mt-2">
          <input
            type="checkbox"
            id="shop-waitlist-termsAgreed"
            name="termsAgreed"
            onChange={(e) => setUserData({ ...userData, termsAgreed: e.target.checked })}
            checked={userData.termsAgreed}
          />
          <label htmlFor="shop-waitlist-termsAgreed">
            I agree to the Privacy Policy and Cookie Policy
          </label>
        </div>

        <div className="my-6 flex justify-center">
          <button
            className="text-lg waitlist-signup-button"
            onClick={submitRegistration}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Submitting…' : 'JOIN WAITLIST'}
          </button>
        </div>

        <p className="text-xs text-white/60 text-center">
          By clicking submit you agree to receive emails from Reveillerstudios
          and accept our web terms of use and privacy and cookie policy apply.
        </p>
      </div>
    </div>
  );
}
