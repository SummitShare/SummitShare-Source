import Inputs from "@/app/components/common/inputs/input/Inputs";
import Details from "../../components/details/details";
import ProfileForm from "../../components/profile/components/from";
import Buttons from "@/app/components/common/button/Butons";



function Profile() {
  return (
    <div>
       <nav className="w-full flex flex-row  items-end">
       
        <p>Exit</p>          
      </nav>
      <header className="text-center space-y-2">
        <h2>Leading ladies</h2>
        <p>Learn about the history you love!</p>
      </header>
      <div>
      <Inputs type="input" label="username" state="active" defaultValue="" />
      <Inputs type="input" label="Email" state="active" defaultValue=""/>
      </div>
      <Buttons type="primary" size="large">Update</Buttons>

    </div>
  );
}

export default Profile;
