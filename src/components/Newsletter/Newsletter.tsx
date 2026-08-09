import React, { useState, useEffect } from 'react';
import ConfirmationMessage from '../ResponseMessages/confirmationMessage';

type NewsletterProps = {
  /** If true, always open when mounted (ignore sessionStorage) */
  forceShowOnMount?: boolean;
  /** Called when the modal + confirmation are both closed */
  onClose?: () => void;
};

export default function Newsletter({ forceShowOnMount = false, onClose }: NewsletterProps) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    smsConsent: false,
    requestUpdate: false,
    termsAgreed: false,
  });

  // Decide when to open the modal
  useEffect(() => {
    if (forceShowOnMount) {
      // Always show when this prop is true
      setShowModal(true);
      return;
    }

    const hasShownModal = sessionStorage.getItem("hasSeenNewsletterPopup");
    if (!hasShownModal) {
      setShowModal(true);
      sessionStorage.setItem("hasSeenNewsletterPopup", "true");
    }
  }, [forceShowOnMount]);

  // Scroll lock
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // When everything is closed, tell parent
  useEffect(() => {
    if (!showModal && !showConfirmation && onClose) {
      onClose();
    }
  }, [showModal, showConfirmation, onClose]);

  if (!showModal && !showConfirmation) return null;

  // Helper to close modal (for X button, etc.)
  function closeModal() {
    setShowModal(false);
    setShowConfirmation(false);
  }

  async function submitRegistration(e?: React.FormEvent) {
    console.log("clicked");
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
      const res = await fetch("/api/registerSubscriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || "Registration failed");
        setStatus("error");
        setShowConfirmation(true);
        setShowModal(false);
      } else {
        setStatus("success");
        setShowConfirmation(true);
        setShowModal(false);
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
      setShowConfirmation(true);
      setShowModal(false);
    }
  }

  function handleCloseConfirmation() {
    setShowConfirmation(false);
    // onClose will be called by the useEffect above when both are false
  }

  return (
    <>
      {(status === "success" || status === "error") && showConfirmation && (
        <ConfirmationMessage
          status={status}
          errorMsg={errorMsg}
          onClose={handleCloseConfirmation}
        />
      )}

      {showModal && !showConfirmation && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={closeModal} 
          />
          <main className="fixed md:-translate-y-[2rem] z-50 translate-y-[1rem] text-zinc-900 inset-0 flex items-center justify-center md:top-22 top-6 p-4">
          <div
          className="max-w-sm md:w-fit subscriptionBox p-5 flex flex-col justify-center md:gap-5 gap-2"
          >
            <div className="flex justify-end button">
              <button
                aria-label="Close"
                onClick={closeModal}
                onTouchStart={(e) =>
                  e.currentTarget.classList.add("rotate-45")
                }
                onTouchEnd={(e) =>
                  e.currentTarget.classList.remove("rotate-45")
                }
                onMouseDown={(e) =>
                  e.currentTarget.classList.add("rotate-45")
                }
                onMouseUp={(e) =>
                  e.currentTarget.classList.remove("rotate-45")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 transition-transform duration-300 md:w-10 md:h-10 cursor-pointer rotate-0 hover:rotate-45 active:rotate-45 focus:rotate-45"
                  tabIndex={0}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h1 className="md:text-sm text-xs items-center">
                Join the RVS community
              </h1>
              <p className="text-xs">
                <br></br>
                Sign up for updates on exclusive Drops and New Releases
              </p>
            </div>
            <div className="flex flex-col md:gap-4 gap-2">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={(e) =>
                  setUserData({ ...userData, fullName: e.target.value })
                }
                required
                placeholder="Full Name"
                className="p-2 border border-zinc-400 text-zinc-800 rounded-md text-xs"
              />
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
                placeholder="Email Address"
                className="p-2 border text-xs border-zinc-400 rounded-md  text-zinc-800"
              />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                placeholder="Phone Number (optional, e.g. +12125551234)"
                className="p-2 border text-xs border-zinc-400 rounded-md text-zinc-800"
              />
            </div>
            <form className="flex flex-col gap-" onSubmit={submitRegistration}>
              <div className="flex justify-start gap-2">
                <input
                  type="checkbox"
                  id="requestUpdate"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      requestUpdate: e.target.checked,
                    })
                  }
                  checked={userData.requestUpdate}
                  name="requestUpdate"
                  value="requestUpdate"
                  className="md:text-md text-sm"
                />
                <label htmlFor="continueUpdate" className="text-xs">
                  Keep me updated with the latest news and best offers
                </label>
              </div>
              <div className="flex justify-start items-start gap-2">
                <input
                  type="checkbox"
                  id="smsConsent"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      smsConsent: e.target.checked,
                    })
                  }
                  checked={userData.smsConsent}
                  name="smsConsent"
                  value="smsConsent"
                  className="md:text-md text-sm"
                />
                <label htmlFor="smsConsent" className="text-xs">
                  Sign up for SMS updates. By checking this box, you agree to receive recurring
                  automated marketing text messages from Reveillerstudios at the phone number
                  provided. Consent is not a condition of purchase. Msg &amp; data rates may
                  apply. Msg frequency varies. Reply STOP to cancel, HELP for help.
                </label>
              </div>
              <div className="flex justify-start gap-2 md:text-md text-sm">
                <input
                  type="checkbox"
                  id="termsAgreed"
                  name="termsAgreed"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      termsAgreed: e.target.checked,
                    })
                  }
                  checked={userData.termsAgreed}
                  value="termsAgreed"
                />
                <label htmlFor="privacyPolicyAgreement" className="text-xs">
                  I agree to the Privacy Policy and Cookie Policy
                </label>
              </div>
            </form>
            <button
              onClick={submitRegistration}
              className="md:text-md signUp-button mt-12 text-xs"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Submitting…" : "Subscribe"}
            </button>
          </div>
        </main>
      
      </>
      )}
    </>
  );
}
