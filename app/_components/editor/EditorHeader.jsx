"use client"
import { useEditorStore } from '@/app/_store/store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ChevronDown, Eye, Pencil, Save, Star, LogOut, ChevronLeft, Download, Loader2, DeleteIcon, Trash2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getSession, useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import EditorExport from './EditorExport'
import { useParams } from 'next/navigation'
import { deleteDesign } from '@/app/_services/design-service'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

const EditorHeader = () => {
  const {isEditing, setIsEditing, name, setName, canvas, markAsModified, saveStatus} = useEditorStore();
  const {data: session} = useSession();
  const router = useRouter();
  const params = useParams();
  const designId = params?.slug;

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [savingData, setSavingData] = useState(true);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const handleLogOut =  async() => {
      await signOut({ callbackUrl: '/login' });
  }

  useEffect(() => {
    if(!canvas) return;

    canvas.selection = isEditing
    canvas.getObjects().forEach((obj) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    })
  }, [isEditing]);

  useEffect(() => {
    markAsModified();
  }, [name]);

  const handleDeleteDesign = async() => {
    try {
      await deleteDesign(designId);
      router.push('/');
    } catch (error) {
      console.log("UNABLE TO DELETE DESIGN :", error);
    }
    
  }


  return (
    <header className='header-gradient header flex items-center justify-between px-4 h-14'>
        <div className='flex items-center space-x-2'>
            <button className='header-button cursor-pointer' onClick={() => router.push('/')}>
              <ChevronLeft />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild='true'>
                  <div className='header-button flex items-center text-white'>
                    <span>{isEditing ? 'Editing' : 'Viewing'}</span> 
                    <ChevronDown className='ml-1 h-4 w-4' />
                  </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='start'>
                <DropdownMenuItem onClick={() => setIsEditing(true)} className={'cursor-pointer'}>
                  <Pencil className='mr-2 h-4 w-4' />
                  <span>Editing</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsEditing(false)} className={'cursor-pointer'}>
                  <Eye className='mr-2 h-4 w-4' />
                  <span>Viewing</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex flex-row w-[100%]'>
              <button className='header-button relative' title='Save'>
                {
                    saveStatus === 'Saving...' ? 
                    <Loader2 className='w-6 h-6 animate-spin' />
                    :
                    <Save onClick={() => markAsModified()} className='w-6 h-6' />
                }
              </button>

              <button title='Download' onClick={() => setShowDownloadModal(true)} className='header-button relative'>
                <Download className='w-6 h-6' />
              </button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button title='Delete' className='header-button relative'>
                    <Trash2Icon className='w-6 h-6' />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to delete the design?</DialogTitle>
                  </DialogHeader>

                  <DialogFooter>
                    <Button className={'cursor-pointer'} onClick={() => handleDeleteDesign()} variant='destructive'>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
           
            </div>

        </div>

        <div className='w-[100%] flex justify-center max-w-md'>
            <Input className={'w-full text-white'} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className='flex flex-row'>
            <div className='flex items-center space-x-3'>
              <button className='upgrade-button flex cursor-pointer items-center bg-white/10 hover:bg-white/20 text-white rounded-md h-9 px-3 transition-colors'>
                <Star className='mr-1 h-8 w-8 text-yellow-400' />
                <span>Upgrade your Plan</span>
              </button>
            </div>

            <div className='flex items-center gap-5 ml-4'>
              <div className='flex items-center gap-1 cursor-pointer'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className='flex items-center cursor-pointer space-x-2 focus:outline-none'>
                      <Avatar>
                        <AvatarImage src={session?.user?.image} alt="Image" className='w-10 h-10' />
                        <AvatarFallback>
                          {session?.user?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
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
        </div>

       <EditorExport isOpen={showDownloadModal} onClose={setShowDownloadModal} />
    </header>
  )
}

export default EditorHeader
