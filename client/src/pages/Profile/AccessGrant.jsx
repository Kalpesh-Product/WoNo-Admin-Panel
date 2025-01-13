import React, { useState } from "react";
import WidgetSection from "../../components/WidgetSection";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import PrimaryButton from "../../components/PrimaryButton";

const AccessGrant = ({ pageTitle }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  // Define the array of navigation card objects
  const navigationCards = [
    { name: "Frontend", icon: "📊" },
    { name: "HR", icon: "⚙️" },
    { name: "Finance", icon: "👤" },
  ];

  // Define table data for the "HR" card
  const tableData = [
    ["Attendance", "Leave Management", "Payroll", "Payslips"],
    ["Leaves", "Holidays", "SOPs", "Policies"],
    ["Task Management", "Performance", "Appraisals", "Templates"],
  ];

  const [checkedState, setCheckedState] = useState(
    tableData.map((row) => row.map(() => false))
  );

  const handleCardClick = (cardName) => {
    setSelectedCard(cardName);
  };

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setCheckedState(tableData.map((row) => row.map(() => newState)));
  };

  const handleCheckboxChange = (rowIndex, cellIndex) => {
    const updatedState = checkedState.map((row, rIndex) =>
      row.map((checked, cIndex) =>
        rIndex === rowIndex && cIndex === cellIndex ? !checked : checked
      )
    );
    setCheckedState(updatedState);

    const allSelected = updatedState.flat().every((checked) => checked);
    setSelectAll(allSelected);
  };

  return (
    <div>
      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-title font-pmedium">{pageTitle}</span>
      </div>

      {/* Grid Layout for Navigation Cards */}
      <div>
        <WidgetSection layout={navigationCards.length}>
          {navigationCards.map((card, index) => (
            <div
              key={index}
              className="border text-center rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
              onClick={() => handleCardClick(card.name)}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="text-lg font-medium">{card.name}</div>
            </div>
          ))}
        </WidgetSection>
      </div>

      <div>
        {/* MUI Table */}
        {selectedCard === "HR" && (
          <div className="mt-6">
            <h2 className="text-subtitle font-pregular mb-4">Human Resource</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      Select All
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Checkbox
                            checked={checkedState[rowIndex][cellIndex]}
                            onChange={() =>
                              handleCheckboxChange(rowIndex, cellIndex)
                            }
                          />
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="flex my-4 justify-center items-center">
              <PrimaryButton title={"Request"} onClick={handleRequest}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessGrant;
