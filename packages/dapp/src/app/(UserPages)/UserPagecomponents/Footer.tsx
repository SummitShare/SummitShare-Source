import Link from "next/link";
import EmailForm from "./EmailForm";

function Footer() {
  return (
    <div className="w-full h-fit space-y-6">
      <div className="flex flex-row gap-40 ">
        <EmailForm />
        <div className="space-y-2">
          <p className="text-2xl font-poppins font-bold">Exhibit</p>
          <div className="font-opensans text-slate-500 flex flex-col gap-2">
            <Link href={""}>Blog</Link>
            <Link href={""}>Partners</Link>
            <Link href={""}>Help</Link>
                <div className="flex flex-flex-row items-center w-fit h-fit gap-2">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
 <Link className="transition-all cursor-pointer hidden lg:block md:hidden font-open-sans text-base" href="#">
              GitHub
            </Link>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-poppins font-bold">Link</p>
          <div className="font-opensans text-slate-500 flex flex-col gap-2">
            <Link href={""}>signUp</Link>
            <Link href={""}>signIn</Link>
            <Link href={""}>Exhibitor signUp</Link>
            <Link href={""}>Tickets</Link>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-poppins font-bold">Join Us</p>
          <div className="font-opensans text-slate-500 flex flex-col gap-2">
            <Link href={""}>x</Link>
                      <div className="flex flex-flex-row items-center w-fit h-fit gap-2">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
 <Link className="transition-all cursor-pointer hidden lg:block md:hidden font-open-sans text-base" href="#">
              GitHub
            </Link>
            </div>
            <Link href={""}>facebook</Link>
            <Link href={""}>Instagram</Link>
          </div>
        </div>
      </div>
      <div className="border-t w-full flex flex-row gap-6 justify-center font-opensans text-slate-500 h-fit py-5 text-sm">
        copyRight@2023
        <Link href={""}>Community guidelines</Link>
        <Link href={""}>Terms</Link>
        <Link href={""}>Privacy policy</Link>
      </div>
    </div>
  );
}

export default Footer;
