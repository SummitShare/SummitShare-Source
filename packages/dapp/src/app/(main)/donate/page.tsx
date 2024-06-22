import Buttons from '@/app/components/common/button/Butons'
import Inputs from '@/app/components/common/inputs/input/Inputs'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'

function page() {

  return (

    <div className=' mx-6 mt-[96px] space-y-[48px]'>
      <header className='text-center space-y-2'>
        <h2>Donate to  project</h2>
        <p>Figma ipsum component variant main layer. </p>
      </header>
      <div className="w-full rounded-[8px] bg-primary-50 space-y-4 px-[45px] py-6">
        <div className="w-full ">
          <XMarkIcon className="w-6 float-end" />
        </div>

        <div className="space-y-2">
          <h3>How to donate</h3>
          <p>Those who walked before us and those to come.</p>
        </div>


        <div className="w-[118px]">
          <Buttons type="subTartary" size="small">Help me</Buttons>
        </div>
      </div> 

      <Inputs type="select" label="Chain" state="active" options={['Eth', 'Bitcoin', 'Base']} />
      <div className='w-full h-[358px]'>
  <img src="" alt="" />
</div>
      <Inputs type="input" label="Wallet address" state="inactive" defaultValue="Value" />
 
      <Buttons type='primary'>Copy wallet address</Buttons>

    </div>


  )
}

export default page
