import EventFormOne from "./components/EventFormOne";
import FileUploadForm from "./components/EventFormThree";
import EventFormTwo from "./components/EventFormTwo";

const EventsFormData = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-950/10">
      {/* <EventFormTwo /> */}
      <EventFormOne />
      {/* <FileUploadForm /> */}
    </div>
  );
};

export default EventsFormData;
