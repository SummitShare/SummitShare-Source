import Button from "@/components/reusebaeComponents/button";
import ContactUs from "./ContactUsEmail";

function AdminSignUpCard() {
  return (
    <div className="flex flex-col items-start title-h4-slate w-full h-60 rounded-xl bg-[#FF7324] p-5 pr-20 px-10 justify-center gap-6">
      <div className="text-[28px] font-bold font-inter text-white text-left">
        Interested In Uploading your events or Works
        <br />{" "}
        <span className="text-slate-100/50">
          {" "}
          Sign up to become an Exhibitor
        </span>
      </div>
      <div className="flex flex-row gap-3">
        <Button
          text="Sign Up"
          backGroundColor="bg-white"
          textColor=" text-base font-bold font-roboto"
          type="button"
        />
         <Button
          text="Learn More"
          backGroundColor="bg-white/20"
          textColor="text-white text-base font-bold font-roboto"
          type="button"
        />
      </div>
    </div>
  );
}

export default AdminSignUpCard;
