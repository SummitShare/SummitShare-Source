import Buttons from '@/app/components/button/Butons'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

function Success() {
  return (
    <div className='bg-stone-900/50 fixed inset-0 flex items-center justify-center'>
  <div className='border w-[90%] md:w-[30%] rounded-[0.5rem] bg-white space-y-6 text-center flex flex-col items-center p-6'> 
    <div className='space-y-2'>
    <h1 >Woohoo!</h1>
    <p>you payment has been successful</p>
    </div>
   {/* <XCircleIcon className='text-red-500 w-32'/> */}
   <CheckCircleIcon className="w-32 text-green-500"/>
   <Buttons type="secondary" size="small">Done</Buttons>
    </div>
    </div>
  
  )
}

export default Success
