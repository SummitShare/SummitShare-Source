import Details from "../../components/details/details";
import ProfileForm from "../../components/profile/components/from";



function Profile() {
  return (
    <div className="space-y-6 mt-20 ">
      <Details
        title="Personal Information"
        info="Use a permanent address where you can receive mail."
      />
      <ProfileForm />
    </div>
  );
}

export default Profile;
