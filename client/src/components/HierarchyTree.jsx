import { Avatar } from "@mui/material";
import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { useSidebar } from "../context/SideBarContext";

// Users array with the specified roles and reporting structure
const users = [
  {
    id: 1,
    name: "Abrar Shaikh",
    role: "Master Admin",
    reports: null,
    avatarColor: "#f44336",
  },
  {
    id: 2,
    name: "Kashif Shaikh",
    role: "Super Admin",
    reports: 1,
    avatarColor: "#2196f3",
  },
  {
    id: 3,
    name: "Farzeen Qudri",
    role: "Super Admin",
    reports: 1,
    avatarColor: "#2196f3",
  },
  {
    id: 4,
    name: "Kalpesh Naik",
    role: "Admin",
    reports: 2,
    avatarColor: "#4caf50",
  },
  {
    id: 5,
    name: "Aiwinraj",
    role: "Employee",
    reports: 4,
    avatarColor: "#4caf50",
  },
  {
    id: 6,
    name: "Sankalp",
    role: "Employee",
    reports: 4,
    avatarColor: "#4caf50",
  },
  {
    id: 7,
    name: "Allan",
    role: "Employee",
    reports: 4,
    avatarColor: "#4caf50",
  },
  {
    id: 8,
    name: "Emily Davis",
    role: "Employee",
    reports: 3,
    avatarColor: "#ff9800",
  },
  {
    id: 9,
    name: "Chris Johnson",
    role: "Employee",
    reports: 3,
    avatarColor: "#9c27b0",
  },
  {
    id: 10,
    name: "Chris ",
    role: "Employee",
    reports: 3,
    avatarColor: "#9c27b0",
  },
  {
    id:11,
    name: "Chris Johnson",
    role: "Employee",
    reports: 3,
    avatarColor: "#9c27b0",
  },
];

const StyledNode = ({ children }) => {
  return (
    <div className="p-2 px-4 rounded-md bg-white inline-block border-2 border-gray-300 text-start w-[250px]">
      {children}
    </div>
  );
};

const renderTreeNodes = (users, parentId) => {
  return users
    .filter((user) => user.reports === parentId)
    .map((user) => (
      <TreeNode
        key={user.id}
        label={
          <StyledNode>
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full">
                <Avatar style={{ backgroundColor: user.avatarColor }}>
                  {user.name.charAt(0)}
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span className="text-subtitle font-pmedium">{user.name}</span>
                <span className="text-content text-gray-400">({user.role})</span>
              </div>
            </div>
          </StyledNode>
        }
      >
        {renderTreeNodes(users, user.id)}
      </TreeNode>
    ));
};

const HierarchyTree = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  return (
    <div className="w-full">
      <div className={`${isSidebarOpen ? 'w-[78vw]' : 'w-[90vw]'} h-[90vh] overflow-y-auto overflow-x-auto`}>
        <Tree
          lineWidth={"2px"}
          lineColor={"black"}
          lineBorderRadius={"0"}
          label={
            <StyledNode>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full">
                  <Avatar style={{ backgroundColor: users[0].avatarColor }}>
                    {users[0].name.charAt(0)}
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <span className="text-subtitle font-pmedium">{users[0].name}</span>
                  <span className="text-content text-gray-400">({users[0].role})</span>
                </div>
              </div>
            </StyledNode>
          }
        >
          {renderTreeNodes(users, users[0].id)}
        </Tree>
      </div>
    </div>
  );
};

export default HierarchyTree;
