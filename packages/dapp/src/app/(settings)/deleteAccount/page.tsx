import Details from "../../components/details/details";


function DeleteAccount() {
  return (
    <div className="space-y-6 mt-20 mx-3">
      <Details
        title="Delete account"
        info="No longer want to use our service? You can delete your account here. This action is not reversible.All information related to this account will be deleted permanently.
"
      />
      <button
        type="submit"
        className="bg-red-500 text-gray-50 font-bold  rounded-md  px-6 py-3 "
      >
        Delete
      </button>
    </div>
  );
}

export default DeleteAccount;
