import React from 'react'

export default function Login() {
  return (
    <section className=" flex flex-col gap-4">
        <div className="justify-items-start flex flex-col gap-2">
            <h1>Welcome back !</h1>

            <input 
            type="loginEmail"
            placeholder='Email Address'
            className="p-2 border border-zinc-400 rounded-md min-w-96"
            />
            <input type='text'
            placeholder='Password'
            className='p-2 border border-zinc-400 rounded-md min-w-96'
            />
        </div>
        <button className="bg-zinc-400 p-4 h-10 text-white w-48 flex justify-center items-center">
            Login
        </button>
    </section>
  )
}
