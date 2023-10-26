import DashboardAdminInfo from "../DashboardComponents/DashboardAdminInfo";
import DashboardAdminStats from "../DashboardComponents/DashboardAdminStats";
import DashboardAdminActivity from "../DashboardComponents/DashboardAdminActivity";
import DashboardAdminUpComingEvents from "../DashboardComponents/DashboardAdminUpComingEvents";
import DashboardAdminProfits from "../DashboardComponents/DashboardAdminProfits";
import DashboardAdminTransactionsHome from "../DashboardComponents/DashboardAdminTransactionsHome";

const EventCreatorDashboard = async () => {
  // const session = await getServerSession(authOptions);

  return (
    <div className="lg:space-y-6 px-6 mt-20 lg:ml-[230px] lg:mt-8 lg:flex lg:flex-row mb-40">
      <div className="space-y-6">
        <DashboardAdminInfo />
        <DashboardAdminStats />
        <DashboardAdminActivity />
        <DashboardAdminUpComingEvents />
      </div>
      <div className="lg:px-6 lg:space-y-6">
        <DashboardAdminProfits />
        <DashboardAdminTransactionsHome />
      </div>
    </div>
  );
};

export default EventCreatorDashboard;
