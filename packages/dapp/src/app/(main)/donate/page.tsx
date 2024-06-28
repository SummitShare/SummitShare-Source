import Buttons from '@/app/components/button/Butons'
import Inputs from '@/app/components/inputs/Inputs'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Image from 'next/image'

function page() {

  return (

    <div className=' space-y-10 mx-6 my-28'>
      <header className='text-left space-y-2'>
        <h2> Support Our Multidisciplinary Project</h2>
        <p>
            Our project is a vibrant fusion of art, science, and community engagement. We strive to create meaningful change and experiences.
            Your generous contribution fuels our mission. By donating, you become an essential part of our creative ecosystem, enabling us to continue pushing boundaries and inspiring change.
         </p>
      </header>



<div className='md:grid md:grid-cols-2 gap-4 '>
<section className='space-y-6 md:flex md:flex-col md:justify-between md:h-full'>
        <div className='space-y-6'>
          <Inputs type="select" label="Chain" state="active" options={['Ethereum Mainet', 'Bitcoin', 'Base', 'Optimism']} />
          <div className='w-full h-[358px] lg:hidden md:hidden bg-blue-200'>
          <Image src="" alt="Description" width={500} height={358} />
          </div>
        </div>


        <div className='space-y-4'>
          <Inputs type="input" label="Wallet address" state="inactive" defaultValue="Value" />
          <Buttons type='primary'>Copy wallet address</Buttons>
        </div>

      </section>

      <div className='w-full h-[358px] sm:block hidden bg-blue-200'>
      <Image src="/path/to/image.jpg" alt="Description" width={500} height={358} />
      </div>
</div>

      

    </div>


  )
}

export default page
