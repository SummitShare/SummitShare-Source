import Button from "@/components/reusebaeComponents/button";
import ContactUs from "./ContactUsEmail";

function AdminSignUpCard() {
  return (
    <div className="flex items-center title-h4-slate w-full h-60 rounded-xl bg-orange-500 p-5 pr-20 px-10 justify-between ">
      <div className="text-2xl text-white">
        Interested In Uploading your events or Works
        <br />{" "}
        <span className="text-slate-100/50">
          {" "}
          Sign up to become an Exhibitor
        </span>
      </div>
      <div>
        <Button
          text="Sign Up"
          backGroundColor="bg-white"
          textColor="white"
          type="button"
        />
      </div>
    </div>
  );
}

export default AdminSignUpCard;
