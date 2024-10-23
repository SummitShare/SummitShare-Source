'use client';

import Link from 'next/link';
import Buttons from '@/app/components/button/Butons';
import { useState } from 'react';

const Unauthorized401 = () => {
   const [isPurchaseHovered, setIsPurchaseHovered] = useState(false);
   const [isHomeHovered, setIsHomeHovered] = useState(false);

   return (
      <div
         style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF8F5',
            fontFamily: 'system-ui, sans-serif',
            padding: '20px',
         }}
      >
         <div
            style={{
               backgroundColor: 'white',
               borderRadius: '16px',
               padding: '40px',
               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
               maxWidth: '400px',
               width: '100%',
               textAlign: 'center',
            }}
         >
            {/* Dog SVG remains the same */}
            <svg
               viewBox="0 0 200 200"
               style={{
                  width: '180px',
                  height: '180px',
                  margin: '0 auto 24px',
               }}
            >
               <circle cx="100" cy="100" r="70" fill="#B88E66" />
               <circle cx="75" cy="85" r="10" fill="#4A3526" />
               <circle cx="125" cy="85" r="10" fill="#4A3526" />
               <circle cx="75" cy="82" r="3" fill="white" />
               <circle cx="125" cy="82" r="3" fill="white" />
               <circle cx="100" cy="105" r="12" fill="#4A3526" />
               <path
                  d="M 85 120 Q 100 135 115 120"
                  stroke="#4A3526"
                  strokeWidth="4"
                  fill="none"
               />
               <path d="M 45 65 Q 50 40 75 55" fill="#8B6B4D" />
               <path d="M 155 65 Q 150 40 125 55" fill="#8B6B4D" />
               <path
                  d="M 95 130 Q 100 140 105 130"
                  fill="#FF9999"
                  stroke="#FF7777"
               />
            </svg>

            <h1
               style={{
                  fontSize: '2rem',
                  color: '#4A3526',
                  marginBottom: '16px',
                  fontWeight: 'bold',
               }}
            >
               Oops! No Ticket Found
            </h1>

            <p
               style={{
                  fontSize: '1.1rem',
                  color: '#666',
                  marginBottom: '32px',
                  lineHeight: '1.6',
               }}
            >
               Looks like you need a ticket to view this exhibit! Don&apos;t
               worry, our friendly guard dog is just doing his job.
            </p>

            <div
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
               }}
            >
               <div
                  onMouseEnter={() => setIsPurchaseHovered(true)}
                  onMouseLeave={() => setIsPurchaseHovered(false)}
                  style={{ position: 'relative' }}
               >
                  <Link href="/cya">
                     <div
                        style={{
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           gap: '8px',
                        }}
                     >
                        <Buttons
                           type={isPurchaseHovered ? 'secondary' : 'primary'}
                           size="large"
                        >
                           Purchase Ticket
                           {isPurchaseHovered && (
                              <span style={{ marginLeft: '8px' }}>→</span>
                           )}
                        </Buttons>
                     </div>
                  </Link>
               </div>

               <div
                  onMouseEnter={() => setIsHomeHovered(true)}
                  onMouseLeave={() => setIsHomeHovered(false)}
                  style={{ position: 'relative' }}
               >
                  <Link href="/">
                     <div
                        style={{
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           gap: '8px',
                        }}
                     >
                        <Buttons
                           type={isHomeHovered ? 'secondary' : 'primary'}
                           size="large"
                        >
                           {isHomeHovered && (
                              <span style={{ marginRight: '8px' }}>←</span>
                           )}
                           Go Home
                        </Buttons>
                     </div>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Unauthorized401;
