"use client"
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import React from 'react'

const LoginCard = () => {
  return (
    <div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 transition-all duration-300'>
      <div className='space-y-8'>
          <img src='/half-logo.png' alt='Pixilo Logo' className='w-[20%] h-20 mx-auto mb-4' />
          <div className='text-center'>
            <h3 className='text-2xl font-bold text-gray-800'>Jump back in!</h3>
            <p className='mt-3 text-gray-500'>Sign in to continue to Pixilo</p>
          </div>

          <Button onClick={() => signIn(`google`, {callbackUrl: '/'})} variant='outline' className={'w-full flex items-center justify-center cursor-pointer gap-3 py-6 text-gray-700 border-gray-300 hover:border-[#8b3dff]  hover:text-[#8b3dff] hover:bg-white transition-all duration-300 group transform hover:scale-[1.01] active:scale[0.99]'}>
            <div className='bg-white rounded-full p-1 flex items-center justify-center group-hover:bg-[#8b3dff]/10 transition-colors duration-300'>
              <LogIn className='w-5 h-5 group-hover: text-[#8b3dff] transition-colors duration-300' />
            </div>
            <span className='text-base font-semibold'>Continue with Google</span>
          </Button>
      </div>
    </div>
  )
}

export default LoginCard
