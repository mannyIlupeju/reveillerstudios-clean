import React, {useState, useEffect} from 'react'


export default function Newsletter() {
  const [showModal, setShowModal] = useState(false);
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
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [showModal]);

  if (!showModal) return null;




  async function submitRegistration() {
   
    console.log(userData)
    
    if(!userData.termsAgreed){
      alert("Please agree to the Terms of Service & Privacy Policy");
      return;
    }


    try {
      console.log("Submitting:", userData)
      
      const res = await fetch('/api/registerSubscriber', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      console.log(res)
      
      const data = await res.json()
      console.log(data)

      if(!res.ok) {
        console.error("Registration failed:", res);
        alert(data.error || `Registration failed with status: ${res.status}`);
      } else {
        console.log("User registered:", data)
        alert("Registration successful!")
      }

    } catch (error){
      console.error("Unexpected error:", error)
      alert("Something went wrong. Please try again.");

    }
  
  }

  

  return (
    <main className="fixed z-10 translate-y-50 inset-0 flex items-center justify-center xl:top-22 top-32 ">
        <div className="w-96 glassBox  p-5 flex flex-col justify-center gap-10 text-sm  ">
           <div className="flex justify-end button">
            <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="1.5" 
                  stroke="currentColor" 
                  className="size-6 transition-transform duration-300 w-10 h-10 cursor-pointer rotate-0 hover:rotate-45 active:rotate-45 focus:rotate-45"
                  onClick={() => setShowModal(false)}
                  onTouchStart={e => e.currentTarget.classList.add('rotate-45')}
                  onTouchEnd={e => e.currentTarget.classList.remove('rotate-45')}
                  onMouseDown={e => e.currentTarget.classList.add('rotate-45')}
                  onMouseUp={e => e.currentTarget.classList.remove('rotate-45')}
                  tabIndex={0}
              >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
           </div>

          <div className="">
           <h1 className="text-xl items-center">Join the RVS community</h1>
           <p>Be the first to know about exclusive drops, restocks and special offers - straight to your inbox</p>
          </div>
           

            <div className="flex flex-col gap-4">
           <input 
            type="name"
            id="fullName"
            name="fullName"
            value={userData.fullName}
            onChange={(e) => setUserData({...userData, fullName: e.target.value})}
            required
            placeholder='Full Name'
            className="p-2 border border-zinc-400 rounded-md"
           />
           <input 
            type="email"
            id="email"  
            name="email"
            value={userData.email}  
            onChange={(e) => setUserData({...userData, email: e.target.value})}
            required
            placeholder='Email Address'
            className="p-2 border border-zinc-400 rounded-md"
           />
           </div>

           <form className="flex flex-col  gap-4">
           <div className="flex justify-start gap-2">
                <input
                type="checkbox"
                id="requestUpdate" 
                onChange={(e) => setUserData({...userData, requestUpdate: e.target.checked})}
                checked={userData.requestUpdate} 
                name="requestUpdate"
                value="requestUpdate"
                />
                <label htmlFor="continueUpdate">
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
           </form>

           <button className="text-xl" onClick={submitRegistration}>Subscribe</button>
        </div>
    </main>
  )
}