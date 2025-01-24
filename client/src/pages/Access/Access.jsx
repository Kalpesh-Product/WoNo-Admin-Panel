import React, { useState } from "react";
import HierarchyTree from '../../components/HierarchyTree'

const Access = () => {
  const users = [
    {
      id: 1,
      name: "Abrar Shaikh",
      role: "Master-Admin",
      designation: "Founder and CEO",
      department: "TopManagement",
      children: [
        {
          id: 2,
          name: "Kashif Shaikh",
          role: "Super Admin",
          designation: "Chief Operating Officer",
          department: "Operations",
          children: [
            {
              id: 3,
              name: "Aaron Pires",
              role: "Admin",
              designation: "Manager",
              department: "IT",
              children: [],
            },
            {
              id: 4,
              name: "Amol Kalade",
              role: "Admin",
              designation: "Manager",
              department: "IT",
              children: [],
            },
            {
              id: 5,
              name: "Kalpesh Naik",
              role: "Admin",
              designation: "Tech Manager",
              department: "Engineering",
              children: [
                {
                  id: 6,
                  name: "Aiwinraj KS",
                  role: "Employee",
                  designation: "Developer",
                  department: "Engineering",
                  children: [],
                },
                {
                  id: 7,
                  name: "Allan Silveira",
                  role: "Employee",
                  designation: "Developer",
                  department: "Engineering",
                  children: [],
                },
                {
                  id: 8,
                  name: "Sankalp Kalangutkar",
                  role: "Employee",
                  designation: "Tester",
                  department: "QA",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return(
    <>
    <div>
      <div>
        <HierarchyTree />
      </div>
    </div>
    </>
  ) ;
};

export default Access;
