import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { LogOut, Search } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const HomeHeader = () => {
  const {data: session} = useSession();


  const handleLogOut =  async() => {
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <header className='h-16 border-b border-gray-200 bg-purple-200 flex items-center px-6 fixed top-0 right-0 left-[72px] z-10'>
      <div className='flex-1 max-w-2xl mx-auto relative'>
        <Search className='absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
        <Input placeholder='Search your Projects' className={'pl-10 py-6 border-gray-200 bg-gray-50 focus-visible:ring-purple-500 text-base'} />
      </div>

      <div className='flex items-center gap-5 ml-4'>
        <div className='flex items-center gap-1 cursor-pointer'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex items-center cursor-pointer space-x-2 focus:outline-none'>
                <Avatar>
                  <AvatarImage src={session?.user?.image} alt="Image" className='w-8 h-8' />
                  <AvatarFallback>
                    {session?.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm font-medium hidden lg:block'>
                  {session?.user?.name || "User"}
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuItem onClick={handleLogOut} className='cursor-pointer'>
                <LogOut className='mr-2 w-4 h-4' />
                <span className='font-bold'>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default HomeHeader
