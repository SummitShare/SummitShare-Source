import Link from "next/link";
import EmailForm from "./EmailForm";

function Footer() {
  return (
    <div className="w-full h-fit">
      <div className="flex flex-row gap-40 ">
        <EmailForm />
        <div className="space-y-2">
          <p className="title-h5-slate">Exhibit</p>
          <div className="flex flex-col gap-2 body-text-h4">
            <Link href={""}>Blog</Link>
            <Link href={""}>Partners</Link>
            <Link href={""}>Help</Link>
            <Link href={""}>GitHub</Link>
          </div>
        </div>
        <div className="space-y-2">
          <p className="title-h5-slate">Link</p>
          <div className="flex flex-col gap-2 body-text-h3">
            <Link href={""}>signUp</Link>
            <Link href={""}>signIn</Link>
            <Link href={""}>Exhibitor signUp</Link>
            <Link href={""}>Tickets</Link>
          </div>
        </div>
        <div className="space-y-2">
          <p className="title-h5-slate">Join Us</p>
          <div className="flex flex-col gap-2 body-text-h3">
            <Link href={""}>x</Link>
            <Link href={""}>Github</Link>
            <Link href={""}>facebook</Link>
            <Link href={""}>Instagram</Link>
          </div>
        </div>
      </div>
      <div className="border-t w-full flex flex-row gap-6 justify-center body-text-h4 h-fit py-5">
        copyRight@2023
        <Link href={""}>Community guidelines</Link>
        <Link href={""}>Terms</Link>
        <Link href={""}>Privacy policy</Link>
      </div>
    </div>
  );
}

export default Footer;
