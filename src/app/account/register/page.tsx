'use client'

import React, {useState} from 'react'
import PhoneInput from 'react-phone-number-input'


function Register() {
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName:string;
    phone: string | undefined;
    email:string;
    password:string;
    termsAgreed: boolean;
    acceptsMarketing: boolean
  }>({ 
    firstName: '', 
    lastName: '', 
    phone:'', 
    email: '', 
    password: '', 
    termsAgreed:false, 
    acceptsMarketing:false
  });

  console.log(userData)



  async function submitRegistration() {
   
    console.log(userData)
    
    if(!userData.termsAgreed){
      alert("Please agree to the Terms of Service & Privacy Policy");
      return;
    }


    try {
      console.log("Submitting:", userData)
      
      const res = await fetch('/api/register', {
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

  const handleChange = (e:any) => {
    const { name, type, checked, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <section className="flex flex-col gap-8">
      <div className="justify-items-start flex flex-col gap-2">
          <h1>Join the Community !</h1>
          <label htmlFor="registerEmail">Email</label>
          <input 
            type="email"
            id="registerEmail"
            value={userData.email}
            onChange={(e)=> {
              e.preventDefault()
              setUserData({...userData, email:e.target.value})
            }}
            placeholder='Email Address'
            className="p-2 border border-zinc-400 rounded-md min-w-72"
            required
          />

          <div className="flex gap-4">
            <div className="flex flex-col">
                <PhoneInput
                  defaultCountry='US'
                  placeholder="Enter phone number"
                  value={userData.phone} 
                  onChange={(value)=> {setUserData({...userData, phone:value})
                  }}                             
                />
            </div>
          </div>

         
          <label htmlFor="password">Password</label>
          <input 
            type='password'
            placeholder='Password'
            value={userData.password} 
            onChange={(e) => {
              setUserData({ ...userData, password: e.target.value })
            }} 
            required 
            className='p-2 border border-zinc-400 rounded-md min-w-48'
          />


          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex flex-col">
              <label htmlFor="name">First Name</label>
              <input 
                type='text'
                placeholder='Name'
                className='p-2 border border-zinc-400 rounded-md min-w-72'
                value={userData.firstName}
                onChange={(e) => {
                  setUserData({...userData, firstName: e.target.value})
                }}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Last Name</label>
              <input 
                type='text'
                placeholder='Name'
                className='p-2 border border-zinc-400 rounded-md min-w-72'
                value={userData.lastName}
                onChange={(e) => {
                  setUserData({...userData, lastName: e.target.value})
                }}
                required
              />
            </div>
          </div>
        
        <div className="flex gap-2 flex-col text-zinc-800">
        <div className="flex gap-2">
          <input 
          type="checkbox" 
          id="termsAgreed" 
          name='termsAgreed'
          checked={userData.termsAgreed}
          onChange={handleChange}
          required
          />
          <label htmlFor="termsAgreed">I agree to the Terms of Service and Privacy Policy</label>
        </div>
        <div className="flex gap-2">
          <input 

          type="checkbox" 
          id="acceptsMarketing" 
          name='acceptsMarketing'
          checked={userData.acceptsMarketing}
          onChange={handleChange}
          />
          <label htmlFor="acceptsMarketing">Sign up for emails on Products and events</label>
          </div>
        </div>

        <button 
        onClick={submitRegistration}
        className="bg-zinc-400 p-4 mt-3 h-10 text-white w-48 flex justify-center items-center"
        >
          Register
        </button>
      
      </div>
     </section>
  )
}

export default Register