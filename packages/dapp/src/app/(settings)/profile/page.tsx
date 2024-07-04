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
          <h3>Email</h3>

          <p>Receive news letters and sign in using this addresses.</p>
        </div>
        <Container>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-secondary-900 font-semibold">
                Maxine.Runolfsdottir-Keebler@hotmail.com
              </p>
              <p className="text-xs">
                This email will be shared with hosts for events.
              </p>
            </div>
            <Input type="input" state="active" />
            <div className="w-fit">
              <Buttons type="primary" size="small">
                Update
              </Buttons>
            </div>
          </div>
        </Container>
      </form>
      <Line />
      <form className="space-y-4">
        <div className="space-y-1">
          <h3>Password</h3>

          <p>Secure your account with password and update it if necessary.</p>
        </div>
        <Container>
          <div className="flex gap-4">
            <div className="space-y-3 w-full">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-secondary-900 font-semibold">
                  Account Password
                </p>
                <p className="text-xs">
                  Please follow the instructions in the email to finish setting
                  your password.
                </p>
              </div>
              <Input type="input" state="active" />
              <div className="w-fit">
                <Buttons type="primary" size="small">
                  Change password
                </Buttons>
              </div>
            </div>
          </div>
        </Container>
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
