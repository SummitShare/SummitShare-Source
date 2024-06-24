import Inputs from "@/app/components/inputs/Inputs";
import Details from "../../components/details/details";
import ProfileForm from "../../components/profile/components/from";
import Buttons from "@/app/components/button/Butons";



function Profile() {
  return (
    <div className="mx-6 mt-6 mb-[48px] min-h-screen flex flex-col justify-between ">
       <nav className="w-full flex flex-row  justify-end">
        <p>Exit</p>          
      </nav>
      <header className="text-center space-y-2">
        <h2>Delete account</h2>
        <p>Learn about the history you love!</p>
      </header>
     
     <div className="w-full h-[335px]">

     </div>
          
      <Buttons type="primary" size="large">Update</Buttons>

    </div>
  );
}

export default Profile;
