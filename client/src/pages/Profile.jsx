import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Profile = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box
            sx={{ height: "100vh", backgroundColor: "white", padding: "10px" }}
          >
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <Box sx={{ borderRadius: "50px", padding: "10px", boxShadow:"none" }}>
        <AppBar position="static" sx={{boxShadow:"none"}}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
            padding:"0px",height:"20px",

              backgroundColor: "white",
              "& .MuiTabs-indicator": {
                display: "none", // Hide the underline
              },
              boxShadow:"none"
            }}
          >
            <Tab
              label="My Profiler"
              {...a11yProps(0)}
              sx={{
                textTransform: "none",
                color: "#1E3D73",
                "&.Mui-selected": {
                  backgroundColor: "#1E3D73",
                  color: "#ffffff",
                },
              }}
            />
            <Tab
              label="Change Password"
              {...a11yProps(1)}
              sx={{
                textTransform: "none",
                color: "#1E3D73",
                "&.Mui-selected": {
                  backgroundColor: "#1E3D73",
                  color: "#ffffff",
                },
              }}
            />
            <Tab
              label="Access Grant"
              {...a11yProps(2)}
              sx={{
                textTransform: "none",
                color: "#1E3D73",
                "&.Mui-selected": {
                  backgroundColor: "#1E3D73",
                  color: "#ffffff",
                },
              }}
            />
            <Tab
              label="My Assets"
              {...a11yProps(3)}
              sx={{
                textTransform: "none",
                color: "#1E3D73",
                "&.Mui-selected": {
                  backgroundColor: "#1E3D73",
                  color: "#ffffff",
                },
              }}
            />
            <Tab
              label="Meeting Room Credits"
              {...a11yProps(4)}
              sx={{
                textTransform: "none",
                color: "#1E3D73",
                "&.Mui-selected": {
                  backgroundColor: "#1E3D73",
                  color: "#ffffff",
                },
              }}
            />
            <Tab
              label="Tickets History"
              {...a11yProps(5)}
              sx={{
                textTransform: "none",
                color: "#1E3D73",
                "&.Mui-selected": {
                  backgroundColor: "#1E3D73",
                  color: "#ffffff",
                },
              }}
            />
          </Tabs>
        </AppBar>
        {/* -----tabs content start--- */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          Item Four
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          Item Five
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          Item Six
        </TabPanel>
        {/* -----tabs content end----- */}
      </Box>
    </div>
  );
};

export default Profile;
