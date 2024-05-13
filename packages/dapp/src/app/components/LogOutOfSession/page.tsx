import LogOutOfSessionForm from "./components/from";
import Details from "@/components/ditails";

function LogOutOfSession() {
  return (
    <div className="space-y-6 mx-[10px]">
      <Details
        title="Log Out Of Session"
        info="Please enter your password to confirm you would like to log 
out of your other sessions across all of your devices."
      />
      <LogOutOfSessionForm />
    </div>
  );
}

export default LogOutOfSession;
