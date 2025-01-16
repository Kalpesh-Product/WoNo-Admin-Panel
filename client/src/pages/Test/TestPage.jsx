import React from 'react';
import Tree from './TreeNode'

const TestPage = () => {
  const mockData = [
    {
      id: 1,
      name: "Company",
      children: [
        { id: 2, name: "About", children: [] },
        {
          id: 3,
          name: "Department",
          children: [
            {
              id: 4,
              name: "HR",
              children: [
                { id: 5, name: "SOPs", children: [] }
              ]
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="app p-4">
      <h1 className="text-2xl font-bold mb-4">Company Handbook</h1>
      <Tree data={mockData} />
    </div>
  );
};

export default TestPage;
