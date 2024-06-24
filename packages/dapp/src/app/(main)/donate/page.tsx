import Buttons from '@/app/components/button/Butons'
import Inputs from '@/app/components/inputs/Inputs'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'

function page() {

  return (

    <div className=' space-y-10 mx-6 my-28'>
      <header className='text-left space-y-2'>
        <h2>Donate to  project</h2>
        <p>Figma ipsum component variant main layer. </p>
      </header>



<div className='md:grid md:grid-cols-2 gap-4 '>
<section className='space-y-6 md:flex md:flex-col md:justify-between md:h-full'>
        <div className='space-y-6'>
          <Inputs type="select" label="Chain" state="active" options={['Eth', 'Bitcoin', 'Base']} />
          <div className='w-full h-[358px] lg:hidden md:hidden bg-blue-200'>
            <img src="" alt="" />
          </div>
        </div>


        <div className='space-y-4'>
          <Inputs type="input" label="Wallet address" state="inactive" defaultValue="Value" />
          <Buttons type='primary'>Copy wallet address</Buttons>
        </div>

      </section>

      <div className='w-full h-[358px] sm:block hidden bg-blue-200'>
        <img src="" alt="" />
      </div>
</div>

      

    </div>


  )
}

export default page
