'use client';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../button/Button';
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserCircle } from 'lucide-react';

const NeutralNav: React.FC = () => {
   const router = useRouter();
   const session = useSession();

   const handleAuthClick = async () => {
      if (session.status === 'authenticated') {
         await signOut();
         router.push('/auth-sign-in');
         return;
      } else {
         router.push('/auth-sign-in');
         return;
      }
   };

   const items: { name: string; link: string }[] = [
      { name: 'Home', link: '/' },
      { name: 'Exhibit', link: '/exhibit' },
      { name: 'Blog', link: '/blog' },
      { name: 'Support Us', link: '/donate' },
      { name: 'Insights', link: '/distribution' },
      { name: 'Help', link: '/help' },
   ];

   const menuItems = [
      {
         title: 'Pages',
         items: [
            { name: 'Home', link: '/' },
            { name: 'Exhibit', link: '/exhibit' },
            { name: 'Blog', link: '/blog' },
            { name: 'Support Us', link: '/donate' },
            { name: 'Insights', link: '/distribution' },
         ],
      },
      {
         title: 'Help',
         items: [{ name: 'Help', link: '/help' }],
      },
      {
         title: 'Settings',
         items: [
            { name: 'Profile', link: '/profile' },
            {
               name: session?.status === 'authenticated' ? 'Log Out' : 'Log In',
               link: '/auth-sign-in',
            },
         ],
      },
   ];

   const [openMenu, setOpenMenu] = useState<boolean>(false);
   const pathname = usePathname();
   const { address } = useAccount();
   const userAddress = address;

   return (
      <nav className="w-full">
         <ul className="fixed top-0 inset-x-0 px-6 py-4 lg:px-[15%] lg:py-6 flex flex-row justify-between items-center border-b border-neutral-900-5 text-neutral-900 z-10 bg-white">
            <li>
               <Link href="/">
                  <h1 className="text-neutral-900">
                     <span className="text-orange-500">Summit</span>Share
                  </h1>
               </Link>
            </li>
            <li className="sm:block hidden md:hidden lg:block">
               <ul className="flex flex-row gap-6 text-p1-m text-neutral-100">
                  {items.map((item, index) => (
                     <li
                        key={index}
                        className={`hover:text-neutral-700 hover:underline underline-offset-[0.625rem] cursor-pointer ${
                           pathname === item.link &&
                           'text-neutral-900 font-bold underline underline-offset-[0.625rem]'
                        }`}
                     >
                        <a href={item.link}>{item.name}</a>
                     </li>
                  ))}
               </ul>
            </li>
            <li className="sm:block hidden md:hidden lg:block w-fit">
               <ul className="flex flex-row gap-2 items-center">
                  <li>
                     <ConnectKitButton.Custom>
                        {({ show }) => (
                           <Button onClick={show}>
                              {!userAddress ? 'Connect Wallet' : 'Connected'}
                           </Button>
                        )}
                     </ConnectKitButton.Custom>
                  </li>
                  <li>
                     {session.status !== 'authenticated' && (
                        <Button
                           variant={'outline'}
                           onClick={() => handleAuthClick()}
                        >
                           Sign In or Register
                        </Button>
                     )}
                  </li>
                  {session.status === 'authenticated' && (
                     <li className="group bg-gradient-to-br from-neutral-50 to-neutral-100 w-10 h-10 rounded-full flex items-center justify-center transition-all">
                        <Link href={'/profile'}>
                           <UserCircle className="w-8 h-8 text-neutral-600 group-hover:text-neutral-900/80 transition-all" />
                        </Link>
                     </li>
                  )}
               </ul>
            </li>
            <li onClick={() => setOpenMenu(!openMenu)} className="lg:hidden">
               <Bars3Icon className="w-4" />
            </li>
         </ul>
         {openMenu && (
            <div
               className="fixed inset-0 bg-black/40 z-40"
               onClick={() => setOpenMenu(false)}
            />
         )}
         <nav
            className={`fixed inset-y-0 left-0 w-[70%] md:w-[40%] bg-white z-50 transform border-r border-neutral-900-5 ${
               openMenu ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out`}
         >
            <div className="border-b border-neutral-900-5 py-[18px]">
               <div className="px-6 flex flex-row justify-between text-neutral-900">
                  <h2 className="text-neutral-900">
                     <span className="text-orange-500">Summit</span>Share
                  </h2>
                  <XMarkIcon
                     onClick={() => setOpenMenu(!openMenu)}
                     className="w-4 cursor-pointer"
                  />
               </div>
            </div>
            <ul className="px-6 mt-6 max-h-[80%] flex flex-col gap-6 justify-between overflow-y-auto">
               {menuItems.map((menu, index) => (
                  <li
                     key={index}
                     className={`space-y-4 py-2 ${
                        index !== menuItems.length - 1
                           ? 'border-b border-neutral-900-5'
                           : ''
                     }`}
                  >
                     <h4 className="font-normal text-neutral-400">
                        {menu.title}
                     </h4>
                     <ul className="space-y-1">
                        {menu.items.map((subItem, subIndex) => {
                           const dynamicName =
                              subItem.name === 'Log In' ||
                              subItem.name === 'Log Out'
                                 ? session.status === 'authenticated'
                                    ? 'Log Out'
                                    : 'Log In'
                                 : subItem.name;
                           const dynamicLink =
                              subItem.name === 'Log In' ||
                              subItem.name === 'Log Out'
                                 ? '/auth-sign-in'
                                 : subItem.link;

                           return (
                              <li
                                 key={subIndex}
                                 className={`text-[1.25rem] text-neutral-700 font-normal ${
                                    pathname === subItem.link &&
                                    'text-neutral-400'
                                 }`}
                              >
                                 <a
                                    href={dynamicLink}
                                    onClick={
                                       dynamicName === 'Log Out'
                                          ? async () => await signOut()
                                          : undefined
                                    }
                                 >
                                    {dynamicName}
                                 </a>
                              </li>
                           );
                        })}
                     </ul>
                  </li>
               ))}
               <li>
                  <ConnectKitButton.Custom>
                     {({ show }) => (
                        <Button onClick={show} size={'medium'} className="w-full">
                           {!userAddress ? 'Connect Wallet' : 'Connected'}
                        </Button>
                     )}
                  </ConnectKitButton.Custom>
               </li>
            </ul>
         </nav>
      </nav>
   );
};

export default NeutralNav;
