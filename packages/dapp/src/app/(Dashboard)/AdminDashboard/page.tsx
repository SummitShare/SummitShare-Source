
import WidgetsSection from "../DashboardComponents/components-new/widgetsSection";
import EventsCarsSection from "../DashboardComponents/components-new/eventsCarsSection";
import DashboardAdminInfo from "../DashboardComponents/components-new/infoBar";
import DashboardAdminActivity from "../DashboardComponents/DashboardAdminActivity";
import DashboardAdminProfits from "../DashboardComponents/DashboardAdminProfits";
import PartnersStatusSection from "../DashboardComponents/components-new/partnersStatusSection";

const EventCreatorDashboard = async () => {
  // const session = await getServerSession(authOptions);

  return (

    <div className="ml-[250px] mr-5  flex flex  gap-6 grow srink mb-10   ">
   <div className=" flex flex-col grow gap-6 base-1/2 mt-10 shrink ">
     <DashboardAdminInfo />
      <WidgetsSection />
      <DashboardAdminActivity />
      <EventsCarsSection />
      </div>

      <div className=" sticky top-5 right-5 h-full base-1/4 grow srink mt-5 ">
     <div className=" space-y-6 ">   
        <DashboardAdminProfits />
        <PartnersStatusSection/>
      </div>
      </div>
 
 
    </div>
  
   
  
  );
};

export default EventCreatorDashboard;
