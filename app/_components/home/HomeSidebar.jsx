import { CreditCard, FolderOpen, Home, Loader, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { saveDesign } from '@/app/_services/design-service';
import { useEditorStore } from '@/app/_store/store';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const menu = [
    {
        icon: <Home className='h-6 w-6' />,
        label: 'Home',
        href: '/',
      },
      {
        icon: <FolderOpen className='h-6 w-6' />,
        label: 'Projects',
        href: '/projects',
      },
      {
        icon: <CreditCard className='h-6 w-6' />,
        label: 'Billing',
        href: '/billing',
      },
]

const HomeSidebar = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {designsCount, userSubscription} = useEditorStore();

    const [customName, setCustomName] = useState('Untitled Design');
    const [customWidth, setCustomWidth] = useState(825);
    const [customHeight, setCustomHeight] = useState(465);

    
    const handleCreateNewDesign = async() => {
      if(designsCount >= 5 && !userSubscription){
        toast.error("PLEASE UPGRADE TO PREMIUM!!", {
        description: "Free users can only create 5 designs",
        
        });
        return;
      }

        if(loading) return;
    
        try {
          setLoading(true);
    
          const initialDesignData = {
            name: customName,
            canvasData: null,
            width: customWidth,
            height: customHeight,
            category: 'youtube_thumbnail'
          };
    
          const newDesign = await saveDesign(initialDesignData);
    
          if(newDesign?.success){
            router.push(`/editor/${newDesign?.data?._id}`);
            setLoading(false);
          } else{
            throw new Error('Failed to create new design');
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
    }

  return (
    <aside className='w-[72px] bg-[#f8f8fc] border-r border-1 flex flex-col items-center py-4 fixed left-0 top-0 h-full z-20'>
        <Dialog>
          <DialogTrigger asChild>
              <div className='flex flex-col items-center cursor-pointer hover:scale-105'>
                <button className='w-12 h-12 bg-purple-600 rounded-full flex items-center cursor-pointer justify-center text-white shadow-md hover:bg-purple-700 transition-colors duration-200 ease-in-out'>
                    {
                        loading ? 
                        <Loader className='w-6 h-6' />
                        :
                        <Plus className='w-6 h-6' />
                    }
                </button>
                <div className='text-xs font-medium text-center mt-1 text-gray-700'>
                    Create
                </div>
              </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create custom canvas</DialogTitle>
              <DialogDescription>
                Please provide the details for custom canvas
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={customName} onChange={(e) => setCustomName(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="width" className="text-right">
                  Width
                </Label>
                <Input id="name" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="width" className="text-right">
                  Height
                </Label>
                <Input id="name" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className="col-span-3" />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => handleCreateNewDesign()} className={'bg-purple-600 hover:bg-purple-800 cusror-pointer'} type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <nav className='mt-8 flex flex-col items-center space-y-6 w-full'>
            {
                menu.map((menuItem, index) => (
                    <Link key={index} href='#'>
                        <button className={`flex flex-col items-center cursor-pointer text-gray-500 hover:text-purple-600 transition-colors duration-200 ease-in-out ${menuItem.active ? 'text-purple-600' : ''}`}>
                            {menuItem.icon}
                            <span className='text-xs font-medium mt-1'>{menuItem.label}</span>
                        </button>
                    </Link>
                ))
            }
        </nav>
    </aside>
  )
}

export default HomeSidebar
