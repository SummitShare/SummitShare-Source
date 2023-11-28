import EventFormOne from "./components/EventFormOne";
import FileUploadForm from "./components/EventFormThree";
import EventFormTwo from "./components/EventFormTwo";

const EventsFormData = () => {
  return (
    <div className="ml-[250px]">
      <EventFormOne />
      <EventFormTwo />
      <FileUploadForm />
    </div>
  );
};

export default EventsFormData;
