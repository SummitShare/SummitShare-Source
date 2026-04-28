'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import Line from '@/components/Line';
import { Button } from '@/components/button/Button';
import { Trash, XCircle } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { TextInput } from '@/components/inputs/TextInput';
import { setInterval } from 'timers';

export default function ProfileSettings() {
   const router = useRouter();
   const { data: session } = useSession();
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [response, setResponse] = useState<string | null>();
   const [status, setStatus] = useState<number>();

   const userId = session?.user?.id || '';
   const userEmail = session?.user?.email || '';
   const user_name = session?.user?.username || '';

   const sessions = useSession();

   const handleAuthClick = async () => {
      if (sessions.status === 'authenticated') {
         await signOut();
         router.push('/auth-sign-in');
         return;
      } else {
         router.push('/auth-sign-in');
         return;
      }
   };

   useEffect(() => {
      if (sessions.status !== 'loading' && sessions.status !== 'authenticated') {
         router.push('/auth-register');
      }
   }, [sessions.status, router]);

   const handleDeleteAccount = async () => {
      try {
         setIsDeleting(true);
         const response = await fetch('api/v1/user/delete', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               userId: userId,
               email: userEmail,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to send email account');
         }

         if (response.status <= 299) {
            setStatus(await response.status);
            router.push('/account/delete-account');
         } else if (response.status > 200) {
            setResponse('Faild to delete Contact Support');
         }
      } catch (error) {
         console.error('Error deleting account:', error);
         toast.error('Failed to delete account');
      } finally {
         setIsDeleting(false);
         setIsDeleteDialogOpen(false);
      }
   };

   return (
      <>
         <div className="space-y-8 w-full mt-28">
            <section className="space-y-6 ">
               <div className="space-y-2">
                  <h3>
                     Hi {user_name.charAt(0).toUpperCase() + user_name.slice(1)}
                  </h3>
                  <p>Let&apos;s manage your account settings.</p>
               </div>
               <div className="space-y-4">
                  <TextInput
                     label="Username"
                     value={user_name}
                     disabled={true}
                     type="text"
                     className="text-neutral-950 cursor-not-allowed md:w-[30%]"
                  ></TextInput>
                  <TextInput
                     label="Email"
                     value={userEmail}
                     disabled={true}
                     type="email"
                     className="text-neutral-950 cursor-not-allowed md:w-[40%] "
                  ></TextInput>
               </div>
               {/* Password Change Button */}
            </section>

            <Line />

            <div className="space-y-4">
               <div className="space-y-2">
                  <h4>Password</h4>
                  <p>Change your Password using the button below.</p>
               </div>

               <Button onClick={() => router.push('/account/forgot-request')}>
                  Change Password
               </Button>
            </div>

            <Line />
            <div className="space-y-4">
               <div className="space-y-2">
                  <h4>Sign Out</h4>
                  <p>Sign out of your account with the button.</p>
               </div>

               <Button variant={'outline'} onClick={() => handleAuthClick()}>
                  Sign Out
               </Button>
            </div>

            <Line />

            {/* Danger Zone */}
            <div className="space-y-4 ">
               <div className="space-y-2">
                  <h4 className=" text-red-500">Delete account</h4>

                  <p>
                     Once you delete your account, there is no going back. Please
                     be certain.
                  </p>
               </div>
               <div className="w-fit">
                  <Button
                     variant={'danger'}
                     onClick={() => setIsDeleteDialogOpen(true)}
                  >
                     Delete my account
                  </Button>
               </div>
            </div>
         </div>

         {/* Custom Modal */}
         {isDeleteDialogOpen && (
            <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
               <div className="bg-white rounded-md p-6 space-y-4 shadow-lg ring-1 ring-neutral-300 max-w-md w-full mx-4">
                  {/* Modal Header */}
                  <div className="flex items-centerx">
                     <h3 className=" text-red-500 flex items-center gap-2">
                        Delete Account
                        <Trash className="w-5 h-5" />
                     </h3>
                  </div>

                  {/* Modal Content */}
                  <p>
                     This will permanently delete your account and remove all
                     associated data from our servers.
                  </p>

                  {/* Modal Footer */}
                  <div className="flex gap-2 mb-20">
                     <Button
                        variant={'danger'}
                        onClick={handleDeleteAccount}
                        disabled={
                           (status !== undefined && status <= 200) || isDeleting
                        }
                        className={` ${isDeleting && 'cursor-wait'} ${
                           status === 200 && 'cursor-not-allowed'
                        }`}
                     >
                        {isDeleting ? 'Confirming...' : 'Confirm'}
                     </Button>
                     <Button
                        variant={'outline'}
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isDeleting}
                     >
                        Keep
                     </Button>
                  </div>
                  {response && <p className="text-red-500">{response}</p>}
               </div>
            </div>
         )}
      </>
   );
}
