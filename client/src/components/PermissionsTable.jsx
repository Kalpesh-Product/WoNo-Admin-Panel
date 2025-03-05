import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";

const PermissionsTable = ({ modules, onPermissionChange }) => {
  const [permissions, setPermissions] = useState(modules);

  // Handle checkbox change
  const handleCheckboxChange = (moduleIndex, submoduleIndex, action) => {
    const updatedPermissions = [...permissions];

    const submodule = updatedPermissions[moduleIndex].submodules[submoduleIndex];

    if (submodule.grantedActions.includes(action)) {
      // Remove action if already granted
      submodule.grantedActions = submodule.grantedActions.filter((act) => act !== action);
    } else {
      // Add action if not granted
      submodule.grantedActions.push(action);
    }

    setPermissions(updatedPermissions);
    onPermissionChange(updatedPermissions); // Send updated permissions to parent
  };

  return (
    <TableContainer component={Paper} className="mt-4">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Submodule</strong></TableCell>
            <TableCell><strong>Read</strong></TableCell>
            <TableCell><strong>Write</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map((module, moduleIndex) =>
            module.submodules.map((submodule, submoduleIndex) => (
              <TableRow key={submodule.submoduleName}>
                <TableCell>{submodule.submoduleName}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={submodule.grantedActions.includes("View")}
                    onChange={() => handleCheckboxChange(moduleIndex, submoduleIndex, "View")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={submodule.grantedActions.includes("Edit")}
                    onChange={() => handleCheckboxChange(moduleIndex, submoduleIndex, "Edit")}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionsTable;
