import Image from 'next/image'
import React from 'react'
import LoginCard from '../_components/login/login-card'

export const metadata = {
  title: "Pixilo | Login",
  description: "Sign In to Continue with Pixilo",
};

const LoginPage = () => {
  return (
    <div className='min-h-screen relative'>
      <div className='absolute inset-0 bg-cover bg-center'
           style={{backgroundImage: "url(https://wallpapercave.com/wp/wp12029246.png)", backgroundSize: 'cover'}}
      >
        <div className='absolute inset-0 backdrop-blur-xs bg-black/50'></div>
        <div className='absolute inset-0'
             style={{background:'linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.4))'}}
        ></div>
      </div>

      <div className='absolute top-4 left-4 z-10'>
        <img src={'/full-logo-white.png'} alt="Logo" className='w-[100%] h-15' />
      </div>

      <div className='relative z-10 flex items-center justify-center h-screen'>
        <LoginCard />
      </div>
    </div>
  )
}

export default LoginPage
