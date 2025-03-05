import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "sonner";
import PrimaryButton from "./PrimaryButton";
import { useNavigate } from "react-router-dom";

const AccessTree = () => {
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [history, setHistory] = useState([]); // Stack to track previous selections
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("selected user : ", selectedUser);
  }, [selectedUser]);

  // Fetch hierarchy data from API
  const fetchHierarchy = async () => {
    try {
      const response = await axios.get("/api/company/company-hierarchy");
      return response.data.generateHierarchy; // Extract main hierarchy object
    } catch (error) {
      toast.error(error.message);
      throw new Error(error);
    }
  };

  const fetchUserPermissions = async (id) => {
    try {
      const response = await axios.get(`/api/company/user-permissions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const {
    data: hierarchy,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["hierarchy"],
    queryFn: fetchHierarchy,
  });

  // Handle selecting a user
  const handleSelectUser = (user) => {
    if (!user.subordinates.length) return; // Prevent selecting users with no subordinates

    setHistory((prev) => [...prev, selectedUser]); // Push current selection to history
    setSelectedUser(user); // Set new selected user
    navigate("permissions", { state: { user } });
  };

  // Handle going back to the previous user
  const handleBack = () => {
    if (history.length === 0) {
      setSelectedUser(null); // If no history, reset to default
      return;
    }
    const previousUser = history.pop(); // Get the last selected user
    setSelectedUser(previousUser); // Set as selected
    setHistory([...history]); // Update history state
  };

  if (isPending)
    return <p className="text-center mt-6">Loading hierarchy...</p>;
  if (isError || !hierarchy)
    return (
      <p className="text-center text-red-500 mt-6">Failed to load hierarchy.</p>
    );

  return (
    <div className="flex flex-col items-center  p-6 pt-10 min-h-screen">
      {/* Higher-up card */}
      <HierarchyCard
        user={hierarchy}
        handleSelectUser={handleSelectUser}
        selectedUser={selectedUser}
      />

      {/* Subordinates Section (separate div) */}

      {selectedUser && selectedUser.subordinates.length > 0 && (
        <>
          <div className="w-full flex">
            <div className="w-full h-16 border-r-default border-borderGray"></div>
            <div className="w-full"></div>
          </div>
          <div className="w-full p-4 border-t-default border-borderGray rounded-lg">
            <div className="flex items-center">
              <div className="w-[10%]">
                <PrimaryButton title={"Back"} handleSubmit={handleBack} />
              </div>
              <div className="w-full text-center">
                <span className="w-full text-subtitle font-pmedium mr-8">
                  Subordinates of {selectedUser.name}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-10 mt-6">
              {selectedUser.subordinates.map((subordinate) => (
                <HierarchyCard
                  key={subordinate.empId}
                  user={subordinate}
                  handleSelectUser={handleSelectUser}
                  selectedUser={selectedUser}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const HierarchyCard = ({ user, handleSelectUser }) => {
  return (
    <div
      className={`bg-white flex flex-col shadow-primary border-primary border-default rounded-lg p-4 pt-0 px-0  text-center cursor-pointer relative w-60 transition `}
      onClick={() => handleSelectUser(user)} // Select user
    >
      <div className="w-full flex flex-col justify-center">
        <div className="absolute -top-7 left-[6rem] border-default border-primary rounded-full w-12 h-12 bg-red-50"></div>
      </div>
      <div className="bg-primary text-white p-2 pt-4">
        <span className="text-subtitle font-semibold">{user.name}</span>
      </div>
      <span className="text-content mt-2">
        {user.designation.length > 20
          ? user.designation.slice(0, 20) + "..."
          : user.designation}
      </span>

      <span className="text-content">{user.workLocation}</span>
      <span className="text-small text-primary">{user.email}</span>

      {/* Show subordinates count if applicable */}
      {user.subordinates && user.subordinates.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          {user.subordinates.length} Subordinate
          {user.subordinates.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default AccessTree;
