import Container from '@/app/components/Container';
import Line from '@/app/components/Line';
import Buttons from '@/app/components/button/Butons';
import Input from '@/app/components/inputs/Inputs';

function ProfileSettings() {
  return (
    <div className="m-6 lg:mx-[20%] space-y-8">
      <form className="space-y-4 md:grid md:grid-cols-2 md:gap-20">
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-inter">Your Profile</h3>

            <p>Choose how you are displayed.</p>
          </div>
          <Input type="input" state="active" label="Username" />

          <div className="w-fit">
            <Buttons type="primary" size="small">
              Save changes
            </Buttons>
          </div>
        </section>
      </form>

      <Line />
      <form className="space-y-4">
        <div className="space-y-1">
          <h3>Delete Account</h3>

          <p>you can permanently delete your account at any time.</p>
        </div>
        <div className="w-fit">
          <Buttons type="primary" size="small">
            Delete my account
          </Buttons>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
