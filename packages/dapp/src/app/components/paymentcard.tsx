import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAddress } from '@thirdweb-dev/react';
import React from 'react'
import Buttons from './button/Butons';

function Paymentcard() {

  const userAddress = useAddress();
  return (
    <div className="fixed inset-x-0 top-0 bottom-0 bg-primary-900/50 flex items-center justify-center z-10">
      <div className="space-y-6 p-6 rounded-[0.8rem] border border-primary-100 bg-white w-[90%] lg:w-[30%]">
        <div className="w-full">
          <XMarkIcon className="float-end w-6" />
        </div>

        <h3>The Leading Ladies</h3>

        <p className="text-2xl font-bold text-ge-500">20USDT</p>

        <div className="space-y-4" >
          <div className="space-y-3">
            <p className="p1-m font-semibold">From</p>
            <p className="w-full rounded-[6px] border text-primary-900 text-p1-r p border-gray-300 bg-gray-100 cursor-not-allowed  px-4 py-3 truncate ">{userAddress}</p>
          </div>
          <div className="space-y-3">
            <p className="p1-m font-semibold">To</p>
            <p className="w-full rounded-[6px] border text-primary-900 text-p1-r p border-gray-300 bg-gray-100 cursor-not-allowed  px-4 py-3 truncate ">{userAddress}</p>
          </div>

        </div>
        <Buttons type="primary" size="large">Buy for 20USDT</Buttons>

      </div>
    </div>
  )
}

export default Paymentcard
