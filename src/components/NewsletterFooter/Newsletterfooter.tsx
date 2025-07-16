import React, {useState} from 'react'
import ConfirmationMessage from '../ResponseMessages/confirmationMessage';

export default function NewsletterFooter() {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
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

  // Handler to close the confirmation modal
  function handleCloseConfirmation() {
    setShowConfirmation(false);
  }

  return (
    <div className='text-sm xl:w-96 relative'>
      {/* Confirmation overlay, centered, but form remains visible */}
      {(status === 'success' || status === 'error') && showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <ConfirmationMessage status={status} errorMsg={errorMsg} onClose={handleCloseConfirmation} />
        </div>
      )}
      {/* Form always visible */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl'>Join the RVS community</h1>
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <p className='text-sm'>Be the first to know about exclusive drops, restocks and special offers - straight to your inbox</p>
      </div>
      <div className='flex flex-col lg:flex-row gap-4 my-4 '>
        <input
          type='text'
          name='fullName'
          value={userData.fullName}
          onChange={(e) => setUserData({...userData, fullName: e.target.value})}
          required  
          id='name'
          placeholder='Enter your full name'
          className='text-zinc-800 p-2'
        />
        <input
          type='email'
          name='email'
          value={userData.email}  
          onChange={(e) => setUserData({...userData, email: e.target.value})}
          required  
          id='email'
          placeholder='Enter email address'
          className='text-zinc-800 p-2 '
        />
      </div>
      <div className="flex justify-start gap-2">
        <input
          type="checkbox"
          id="requestUpdate" 
          onChange={(e) => setUserData({...userData, requestUpdate: e.target.checked})}
          checked={userData.requestUpdate}
          name="requestUpdate"
          value="requestUpdate"
        />
        <label htmlFor="requestUpdate">
          Keep me updated with the latest news and best offers
        </label>
      </div>
      <div className="flex justify-start gap-2">
        <input
          type="checkbox"
          id="termsAgreed"  
          name="termsAgreed"
          onChange={(e) => setUserData({...userData, termsAgreed: e.target.checked})} 
          checked={userData.termsAgreed}
          value="termsAgreed"
        />
        <label htmlFor="privacyPolicyAgreement">
          I agree to the Privacy Policy and Cookie Policy
        </label>
      </div>
      <button
        className='text-md mt-8'
        onClick={submitRegistration}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting…' : 'SIGN UP'}
      </button>
      <div className='mt-12'>
        <p className='text-sm'>
          By clicking submit you agree to receive emails from Reveillerstudios
          and accept our web terms of use and privacy and cookie apply. Terms
          apply
        </p>
      </div>
    </div>
  );
}