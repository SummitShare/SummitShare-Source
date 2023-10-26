import DashboardAdminInfo from "../DashboardComponents/DashboardAdminInfo";
import DashboardAdminStats from "../DashboardComponents/DashboardAdminStats";
import DashboardAdminActivity from "../DashboardComponents/DashboardAdminActivity";
import DashboardAdminUpComingEvents from "../DashboardComponents/DashboardAdminUpComingEvents";
import DashboardAdminProfits from "../DashboardComponents/DashboardAdminProfits";
import DashboardAdminTransactionsHome from "../DashboardComponents/DashboardAdminTransactionsHome";

const EventCreatorDashboard = async () => {
  // const session = await getServerSession(authOptions);

  return (
    <div className=" px-6 my-24 lg:ml-[215px] lg:my-8 lg:flex lg:flex-row space-y-6">
      <div className="space-y-6">
        <DashboardAdminInfo />
        <DashboardAdminStats />
        <DashboardAdminActivity />
        <DashboardAdminUpComingEvents />
      </div>
      <div className="lg:px-6 lg:space-y-6 lg:fixed lg:top-0 lg:right-0 space-y-6">
        <DashboardAdminProfits />
        <DashboardAdminTransactionsHome />
      </div>
    </div>
  );
};

export default EventCreatorDashboard;
