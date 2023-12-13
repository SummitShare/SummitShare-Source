import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import React, { useState } from 'react'

function ProfileIconDropDown() {

    const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className='space-y-10'>

       <div  onClick={handleOpen} className='w-fit h-fit flex items-center justify-center cursor-pointer'>
      <UserCircleIcon className="w-8 h-8 text-black" />
    </div>
    {
        isOpen && (
            <div className='absolute right-0 w-40 h-fit rounded-xl rounded-r-none border-slate-100 border flex flex-col  items-start gap-1 shadow-md px-3 py-2 body-text-h4 z-30 bg-white  transotion-all'>
               
                    <Link href="/AdminDashboard" className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950">Dashboard</Link>
                    <Link href="#" className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950">My Tickets</Link>
                      <Link href="#" className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950">Settings</Link>
                       <Link href="#" className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950 flex flex-row gap-2 items-center">Sign Out <ArrowRightOnRectangleIcon className='w-4 h-4 text-red-500'/> </Link>
              
            </div>
        )
    }
     
    </div>
   
  )
}

export default ProfileIconDropDown
