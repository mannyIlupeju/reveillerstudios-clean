import React, {useState} from 'react'

export default function NewsletterFooter() {

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    requestUpdate: false,
    termsAgreed: false,
  });

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
    <div className='text-sm xl:w-fit'>
    
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl'>Join the RVS community</h1>
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <p className='text-sm'>Be the first to know about exclusive drops, restocks and special offers - straight to your inbox</p>
       
      </div>
      <div className='flex flex-col lg:flex-row gap-4 my-4 '>
        <input
          type='Full Name'
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
      <button className='text-md mt-8' onClick={submitRegistration}>SIGN UP</button>
     
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
