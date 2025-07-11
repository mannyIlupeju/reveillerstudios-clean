'use client'

import React, {useState} from 'react'
import { useGlobalContext } from '@/Context/GlobalContext'
import Register from './register/page'
import Login from './login/page'
import useIsMobile from '../../../hooks/useIsMobile'

export default function LoginSignUp() {
  const{loginClicked, setIsLoginClick, registerClicked, setIsRegisterClick, LoginHere, RegisterHere} = useGlobalContext()

 

  return (
    <section className={`lg:justify-center xl:mt-24 mb-24 flex xl:flex-row gap-10 flex-col xl:p-12 p-5`}>
        <section className=" flex lg:justify-center justify-items-start">
          <div className=" flex flex-col gap-10">
            <div className="flex flex-col gap-3">
            <h1 className="text-md capitalize">Enjoy a tailored Experience.</h1>
            <p className='text-sm'>Register / Sign in to enjoy perks and access all our services</p>
            </div>

            <div className="flex flex-col w-fit gap-4">
              <button onClick={LoginHere} className={`${loginClicked ? 'bg-zinc-200' : 'bg-zinc-800'} p-4 h-10 text-white w-60 flex justify-center items-center`}>
                LOG IN
              </button>
              <button onClick={RegisterHere} className="bg-zinc-400 p-4 h-10 text-white w-60 flex justify-center items-center">
                REGISTER
              </button>
            </div>
          </div>
        </section>

        <section className="flex lg:justify-center justify-items-start">
        {loginClicked && <Login/>}

        {registerClicked && <Register/>}
        </section>


     
    </section>
  )
}
