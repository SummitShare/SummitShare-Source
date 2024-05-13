import ChangePasswordForm from "../../components/Changepassword/components/from";
import Details from "../../components/details/details";


function ChangePassword() {
  return (
    <div className="space-y-6 mt-20">
      <Details
        title="Change password"
        info="Update your password associated with your account."
      />
      <ChangePasswordForm />
    </div>
  );
}

export default ChangePassword;
