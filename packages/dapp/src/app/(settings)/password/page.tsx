import Inputs from "@/app/components/common/inputs/input/Inputs";
import Details from "../../components/details/details";
import ProfileForm from "../../components/profile/components/from";
import Buttons from "@/app/components/common/button/Butons";



function Profile() {
  return (
    <div className="mx-6 mt-6 space-y-[48px] ">
       <nav className="w-full flex flex-row  justify-end">
        <p>Exit</p>          
      </nav>
      <header className="text-center space-y-2">
        <h2>Change password</h2>
        <p>Learn about the history you love!</p>
      </header>
      <div className="space-y-4">
      <Inputs type="input" label="New password" state="active" defaultValue="" />
      <Inputs type="input" label="Confirm passwrd" state="active" defaultValue=""/>
      </div>
      <Buttons type="primary" size="large">Update</Buttons>

    </div>
  );
}

export default Profile;
