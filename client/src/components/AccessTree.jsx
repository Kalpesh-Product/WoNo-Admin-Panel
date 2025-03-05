import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "sonner";
import PrimaryButton from "./PrimaryButton";
import { useNavigate } from "react-router-dom";

const AccessTree = () => {
  const [selectedUsers, setSelectedUsers] = useState([]); // Stack to track selected users
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Selected Users Stack: ", selectedUsers);
  }, [selectedUsers]);

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

  const {
    data: hierarchy,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["hierarchy"],
    queryFn: fetchHierarchy,
  });

  // Handle selecting a user (adds to stack)
  const handleSelectUser = (user) => {
    if (!user.subordinates.length) return; // Prevent selecting users with no subordinates
    setSelectedUsers((prev) => [...prev, user]); // Add to stack
  };

  // Handle going back (removes from stack)
  const handleBack = () => {
    setSelectedUsers((prev) => prev.slice(0, -1)); // Remove last user from stack
  };

  if (isPending)
    return <p className="text-center mt-6">Loading hierarchy...</p>;
  if (isError || !hierarchy)
    return (
      <p className="text-center text-red-500 mt-6">Failed to load hierarchy.</p>
    );

  return (
    <div className="flex flex-col items-center p-6 pt-10 min-h-screen">
      {/* Root Hierarchy (Top Level) */}
      <HierarchyCard
        user={hierarchy}
        handleSelectUser={handleSelectUser}
        isTopLevel={true}
      />

      {/* Render each level separately */}
      {selectedUsers.map((user, index) => (
        <div
          key={user.empId}
          className="w-full mt-6 p-4 border-t border-gray-300 rounded-lg"
        >
          <div className="flex items-center mb-10">
            {index === selectedUsers.length - 1 && ( // Only show back button on last level
              <div className="w-[10%]">
                <PrimaryButton title={"Back"} handleSubmit={handleBack} />
              </div>
            )}
            <div className="w-full text-center">
              <span className="text-subtitle font-semibold mr-20">
                Subordinates of {user.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-4">
            {user.subordinates.map((subordinate) => (
              <HierarchyCard
                key={subordinate.empId}
                user={subordinate}
                handleSelectUser={handleSelectUser}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const HierarchyCard = ({ user, handleSelectUser, isTopLevel }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white flex flex-col shadow-md border border-gray-300 rounded-lg p-4 pt-0 px-0 text-center cursor-pointer relative w-60 transition ${
        isTopLevel ? "border-2 border-primary" : ""
      }`}
    >
      <div className="w-full flex flex-col justify-center">
        <div className="absolute -top-7 left-[6rem] border-default border-primary rounded-full w-12 h-12 bg-red-50"></div>
      </div>
      <div
        onClick={() => navigate("permissions", { state: { user } })}
        className="bg-primary text-white p-2 pt-4 rounded-t-md"
      >
        <span className="text-subtitle font-semibold">{user.name}</span>
      </div>
      <span className="text-content mt-2">
        {user.designation.length > 20
          ? user.designation.slice(0, 20) + "..."
          : user.designation}
      </span>
      <span className="text-small text-primary">{user.email}</span>

      {/* Show subordinates count if applicable */}
      {user.subordinates && user.subordinates.length > 0 && (
        <p
          onClick={() => handleSelectUser(user)}
          className="mt-2 text-xs text-gray-500 hover:underline"
        >
          {user.subordinates.length} Subordinate
          {user.subordinates.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default AccessTree;
