import React, { useState, useEffect } from 'react'
import ConfirmationMessage from '../ResponseMessages/confirmationMessage';

export default function Newsletter() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    requestUpdate: false,
    termsAgreed: false,
  });

  useEffect(() => {
    const hasShownModal = sessionStorage.getItem("hasSeenNewsletterPopup");
    if (!hasShownModal) {
      setShowModal(true);
      sessionStorage.setItem("hasSeenNewsletterPopup", "true");
    }
  }, []);

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

  if (!showModal && !showConfirmation) return null;

  // Restore submitRegistration function
  async function submitRegistration(e?: React.FormEvent) {
    console.log('clicked')
    if (e) e.preventDefault();
    if (!userData.termsAgreed) {
      alert("Please agree to the Terms of Service & Privacy Policy");
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
        setShowModal(false);
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
      setShowConfirmation(true);
    }
  }
 

  // Handler to close the confirmation modal
  function handleCloseConfirmation() {
    setShowConfirmation(false);
  }

  return (
    <>
      {(status === 'success' || status === 'error') && showConfirmation && (
        <ConfirmationMessage status={status} errorMsg={errorMsg} onClose={handleCloseConfirmation}/>
      )}
      {showModal && !showConfirmation && (
        <main className="fixed md:-translate-y-[6rem] z-20 translate-y-[1rem] text-zinc-900 inset-0 flex items-center justify-center md:top-22 top-6 p-4">
          <div className="max-w-sm md:w-fit subscriptionBox p-5 flex flex-col justify-center md:gap-5 gap-2 md:text-md text-sm ">
            <div className="flex justify-end button">
              <button 
                aria-label="Close"
                onClick={() => setShowModal(false)}
                onTouchStart={e => e.currentTarget.classList.add('rotate-45')}
                onTouchEnd={e => e.currentTarget.classList.remove('rotate-45')}
                onMouseDown={e => e.currentTarget.classList.add('rotate-45')}
                onMouseUp={e => e.currentTarget.classList.remove('rotate-45')}
              >
          
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 transition-transform duration-300 md:w-10 md:h-10  cursor-pointer rotate-0 hover:rotate-45 active:rotate-45 focus:rotate-45"
                
                tabIndex={0}
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              </button>
            </div>
            <div className="">
              <h1 className="md:text-xl text-md items-center">Join the RVS community</h1>
              <p>Get 20% off your first order and be the first to know about exclusive drops, restocks and special offers - straight to your inbox</p>
            </div>
            <div className="flex flex-col md:gap-4 gap-2">
              <input
                type="name"
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={e => setUserData({ ...userData, fullName: e.target.value })}
                required
                placeholder='Full Name'
                className="p-2 border border-zinc-400 text-zinc-800 rounded-md"
              />
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={e => setUserData({ ...userData, email: e.target.value })}
                required
                placeholder='Email Address'
                className="p-2 border md:text-md text-sm border-zinc-400 rounded-md text-zinc-800"
              />
            </div>
            <form className="flex flex-col gap-" onSubmit={submitRegistration}>
              <div className="flex justify-start gap-2">
                <input
                  type="checkbox"
                  id="requestUpdate"
                  onChange={e => setUserData({ ...userData, requestUpdate: e.target.checked })}
                  checked={userData.requestUpdate}
                  name="requestUpdate"
                  value="requestUpdate"
                  className="md:text-md text-sm"
                />
                <label htmlFor="continueUpdate" >
                  Keep me updated with the latest news and best offers
                </label>
              </div>
              <div className="flex justify-start gap-2 md:text-md text-sm">
                <input
                  type="checkbox"
                  id="termsAgreed"
                  name="termsAgreed"
                  onChange={e => setUserData({ ...userData, termsAgreed: e.target.checked })}
                  checked={userData.termsAgreed}
                  value="termsAgreed"
                />
                <label htmlFor="privacyPolicyAgreement">
                  I agree to the Privacy Policy and Cookie Policy
                </label>
              </div>

              
            </form>
              <button 
              onClick={submitRegistration}
              className="md:text-xl signUp-button mt-12 text-sm" 
              type="submit" 
              disabled={status === "loading"}>
                {status === "loading" ? "Submitting…" : "Subscribe"}
              </button>
              
          </div>
        </main>
      )}
    </>
  );
}