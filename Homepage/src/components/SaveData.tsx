import { useState } from "react";

interface FormData {
  id: number; // Unique identifier for each piece of data
  eventName: string; // The name of the event
  eventDate: number; // Date of the event
  eventTime: number; // Time of the event
  eventLocation: string; // Location of the event
  ticketCost: string; // Cost of the event ticket
  walletOne: string; // First wallet information
  walletTwo: string; // Second wallet information
  split: number; // How the cost is split (percentage or value)
}

export interface SavedDataProps {
  dataArray: FormData[];
  onSaveEdit: (itemId: number, editedData: FormData) => void;
}
export const SavedData = ({ dataArray, onSaveEdit }: SavedDataProps) => {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const handleEditClick = (itemId: number) => {
    setEditingItemId(itemId);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  return (
    <div>
      <h2>Saved Data</h2>
      <ul>
        {dataArray.map((item) => (
          <li key={item.id}>
            {item.eventName}, {item.eventLocation}, {item.eventTime},
            {item.eventDate}, {item.ticketCost}
            {item.walletOne}, {item.walletTwo}, {item.split}
            {editingItemId === item.id ? (
              <EditForm
                formData={item}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={(editedData) => onSaveEdit(item.id, editedData)}
              />
            ) : (
              <button onClick={() => handleEditClick(item.id)}>Edit</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export interface EditFormProps {
  formData: FormData;
  onCancelEdit: () => void;
  onSaveEdit: (editedData: FormData) => void;
}
export const EditForm = ({
  formData,
  onCancelEdit,
  onSaveEdit,
}: EditFormProps) => {
  const [editedData, setEditedData] = useState<FormData>({
    id: 1,
    eventName: "",
    eventDate: 0,
    eventTime: 0,
    eventLocation: "",
    ticketCost: "",
    walletOne: "",
    walletTwo: "",
    split: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEdit(editedData);
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="eventName"
          value={editedData.eventName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="text"
          name="eventLocation"
          value={editedData.eventLocation}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="date"
          name="eventDate"
          value={editedData.eventDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="text"
          name="eventTime"
          value={editedData.eventTime}
          onChange={handleChange}
        />
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="ticketCost"
            value={editedData.ticketCost}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="walletOne"
            value={editedData.walletOne}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="walletTwo"
            value={formData.walletTwo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="split"
            value={formData.split}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancelEdit}>
        Cancel
      </button>
    </form>
  );
};
