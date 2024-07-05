'use client';
import Buttons from '@/app/components/button/Butons';
import TicketPurchaseComponent from '@/functonality/ticketpurchasecomponent';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import WalletStatus from '@/functonality/walletStatus';
import { useAccount } from 'wagmi';

export default function Home() {
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const userAddress = address;
  const women = [
    {
      name: 'Julia Chikamoneka',
      img: '/women/julia.png',
      link: '/exhibit/julia-chikamoneka',
    },
    { name: 'Loongo', img: '/women/loongo.png', link: '/exhibit/loongo' },
    {
      name: 'lueji wa nkonde',
      img: '/women/lueji.png',
      link: '/exhibit/lueji-wa-nkonde',
    },
    { name: 'Mukwae', img: '/women/mukwae.png', link: '/exhibit/mukwae' },
    { name: 'Mwape', img: '/women/mwape.png', link: '/exhibit/mwape' },
    {
      name: 'Mwenya',
      img: '/women/mwenya.png',
      link: '/exhibit/mwenya-mukulu',
    },
  ];

  return (
    <div className="space-y-24 mx-6 my-28 lg:mx-[15%]">
      <section className="border-b md:border-b-0 border-primary-900-5 space-y-[48px] pb-6 md:flex md:flex-row md:gap-4">
        <div className="w-full md:w-[45%] h-[342px] rounded-[0.5rem] overflow-hidden bg-[url('https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650963860604-LGJSBAWOMLQIU9ZXUK1K/all-women.71ba3487f51cab4dc38a.png?format=2500w')] bg-cover bg-primary-50 bg-center "></div>

        <div className="space-y-6 md:w-[45%] md:flex md:flex-col md:justify-between">
          <div className="space-y-2">
            <h2>The Leading Ladies</h2>
            <p>
              Those who walked before us and those to come. Those who wore red
              clay masks and rested their heads on bended knees. Those who
              washed the cowry bead and swung the snuff cup.Those who weaved the
              baskets and wrapped the cloth. Those who fought for peace and
              danced to the drum.
            </p>
          </div>
          <TicketPurchaseComponent userAddress={''} />
        </div>
      </section>

      {/* <div className="w-full rounded-[0.5rem] bg-primary-50 space-y-4 px-12 py-6">
      <div className="w-full ">
        <XMarkIcon className="w-6 float-end" />
      </div>

      <div className="space-y-2">
        <h3>How to purchase a ticket</h3>
        <p>Those who walked before us and those to come.</p>
      </div>

      <div className="w-[118px]">
        <Buttons type="subTartary" size="small">Help me</Buttons>
      </div>
    </div> */}

      <section className="w-full space-y-6">
        <h2>Meet the Leading Ladies and Explore Their Lives</h2>

        <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
          {women.map((item) => (
            <Link href={item.link} key={item.name}>
              <div
                className="bg-gradient-to-b from-orange-100 to-orange-50 relative flex flex-col gap-6 justify-end h-[18rem] md:h-[20rem] lg:h-[22rem] rounded-[0.5rem] px-4 py-6 overflow-hidden cursor-pointer"
                style={{
                  transition: 'all 0.3s ease',
                  boxShadow:
                    '0 6px 8px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div className="absolute inset-0 bg-primary-900/25 z-[4] rounded-[0.5rem]"></div>
                <Image
                  className="absolute -bottom-10 inset-x-0 w-full h-full object-cover"
                  src={item.img}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                />

                <div className="z-[5] space-y-2">
                  <h3 className="text-white">{item.name}</h3>
                  <div className="w-[66px]">
                    <Buttons type="tartary" size="small">
                      View
                    </Buttons>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </section>

      <section className="bg-primary-400 rounded-[0.5rem] w-full h-[21.375rem] flex flex-col items-center px-[2.813rem] justify-center space-y-12 ">
        <div className="space-y-2 text-center">
          <h3 className="text-white">Collaborate with us</h3>
          <p className="text-center text-white">
            Learn more and contribute to shaping this narrative. Every voice
            matters, every insight adds to our shared heritage.
          </p>
        </div>
        <div className="w-[164px]">
          <Link href="https://forms.gle/rXvQy25pqEagxHoq9">
            <Buttons type="tartary" size="large">
              Register today
            </Buttons>
          </Link>
        </div>
      </section>
    </div>
  );
}
