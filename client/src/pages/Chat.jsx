import React, { useEffect, useState, useRef } from "react";
import { IoMdSend, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaPaperclip } from "react-icons/fa6";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import initialChats from "../utils/initialChat";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
        <Box sx={{ p: "2px", backgroundColor: "white" }}>
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

const contacts = [
  { id: 1, name: "Mac", status: "online", previewMessage: "See you soon!" },
  {
    id: 2,
    name: "Farzeen",
    status: "offline",
    previewMessage: "Let's catch up later.",
  },
  {
    id: 3,
    name: "Aaron",
    status: "online",
    previewMessage: "I'll send the files.",
  },
  {
    id: 4,
    name: "Kalpesh",
    status: "offline",
    previewMessage: "Got it, thanks!",
  },
  {
    id: 5,
    name: "BIZ Nest-admins",
    group: true,
    previewMessage: "Meeting scheduled for tomorrow.",
  },
  {
    id: 6,
    name: "Companies",
    group: true,
    subGroups: ["Zomato", "SquadStack", "Infuse"],
    previewMessage: "Project updates ready.",
  },
  {
    id: 7,
    name: "BIZNest All Hands",
    group: true,
    previewMessage: "The workload is divided between y'all",
  },
  {
    id: 8,
    name: "BIZNest Tech Dept 💻",
    group: true,
    previewMessage: "The task of fixing the backend is pending",
  },
  {
    id: 9,
    name: "BIZNest Finance Dept",
    group: true,
    previewMessage: "The payment has been processed",
  },
  {
    id: 10,
    name: "Customer Service",
    status: "online",
    previewMessage: "What can I help you with?",
  },
];

const Chat = () => {
  const fileRef = useRef(null);
  const messageEndRef = useRef(null);
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialChats(activeContact.name));
  const [message, setMessage] = useState("");
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactFilter, setContactFilter] = useState("All");

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (activeContact.name === "Customer Service") {
      setMessages([
        {
          id: 1,
          sender: "Customer Service",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          content: "What can I help you with?",
          fromMe: false,
        },
      ]);
    } else {
      setMessages(initialChats(activeContact.name));
    }
  }, [activeContact]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // Ensures minimal movement
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      sender: "Me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: message,
      fromMe: true,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: activeContact.name,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          content: "demo message",
          fromMe: false,
        },
      ]);
    }, 1000);

    setMessage("");
  };

  const handleFileSelect = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      alert.success("File saved successfully");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const isMatch = contact.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (contactFilter === "WoNo") {
      // Show only the Customer Service chat
      return contact.name === "Customer Service";
    } else if (contactFilter === "BIZNest") {
      // Show group chats and one-to-one chats excluding Customer Service
      return (
        (contact.name.includes("BIZ") || !contact.group) &&
        contact.name !== "Customer Service"
      );
    } else if (contactFilter === "Companies") {
      // Show only the Companies chat
      return contact.name === "Companies";
    }

    // Default: Show all chats
    return isMatch;
  });

  return (
    <div className="flex py-2 bg-white h-[80vh] overflow-y-auto">
      <div className="h-full flex flex-col w-full">
        <div className="h-[80vh]  flex flex-1">
          <aside className="w-1/4 bg-white p-4 shadow-lg border-r border-gray-300 h-[80vh] relative">
            <div className="">
              <h2 className="text-title font-pregular mb-4">Chat</h2>
              <select
                className="mt-2 mb-4 w-full p-2 rounded-lg border border-gray-300 bg-gray-50"
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
              >
                <option value="All" className="self-center">
                  Select Priority
                </option>
                <option value="BIZNest">BIZNest</option>
                <option value="WoNo">WoNo</option>
                <option value="Companies">Companies</option>
              </select>

              <input
                type="search"
                placeholder="Search people & group"
                className="w-full p-2 mb-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* tabs for all read and unread msg */}
              <Box sx={{ bgcolor: "black", borderRadius: "50px" }}>
                <AppBar position="static" sx={{boxShadow:"none"}}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    sx={{
                      backgroundColor: "white",
                      "& .MuiTabs-indicator": {
                        display: "none", // Hide the underline
                      },
                      
                    }}
                  >
                    <Tab
                      label="All"
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
                      label="Read"
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
                      label="Unread"
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
                  </Tabs>
                </AppBar>
                {/* -----tabs content start--- */}
                {/* <TabPanel value={value} index={0} dir={theme.direction}>
                  Item One
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  Item Two
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                  Item Three
                </TabPanel> */}
                {/* -----tabs content end----- */}
              </Box>
              {/* tabs for all end !! */}
            </div>
            <div className=" h-[50vh] overflow-y-auto">
              <ul className="space-y-2  py-4">
                {" "}
                {/* Set scrollable height here */}
                {filteredContacts.map((contact) => (
                  <li key={contact.id} className="space-y-1">
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        activeContact.id === contact.id ||
                        (contact.subGroups &&
                          contact.subGroups.includes(activeContact.name))
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (contact.subGroups) {
                          setExpandedGroup(
                            expandedGroup === contact.id ? null : contact.id
                          );
                        } else {
                          setActiveContact(contact);
                        }
                      }}
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold mr-3 ${getNodeColor(
                          contact.name
                        )}`}
                      >
                        {getInitials(contact.name)}
                      </div>
                      <div className="flex-1 truncate">
                        <span className="font-semibold">{contact.name}</span>
                        <p className="text-sm text-gray-500 truncate">
                          {contact.previewMessage}
                        </p>
                      </div>
                      {contact.subGroups && (
                        <span>
                          {expandedGroup === contact.id ? (
                            <IoMdArrowDropup />
                          ) : (
                            <IoMdArrowDropdown />
                          )}
                        </span>
                      )}
                    </div>
                    {contact.subGroups && expandedGroup === contact.id && (
                      <ul className="pl-4 space-y-1">
                        {contact.subGroups.map((subGroup, idx) => (
                          <li
                            key={idx}
                            className={`p-2 rounded-lg cursor-pointer ${
                              activeContact.name === subGroup
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() =>
                              setActiveContact({
                                id: `${contact.id}-${idx}`,
                                name: subGroup,
                              })
                            }
                          >
                            {subGroup}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="w-full flex flex-col justify-between bg-white relative overflow-y-auto">
            <header className="p-4 border-b flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold mr-3 ${getNodeColor(
                  activeContact.name
                )}`}
              >
                {getInitials(activeContact.name)}
              </div>
              <div>
                <h3 className="font-semibold">{activeContact.name}</h3>
                <p>{activeContact.status}</p>
              </div>
            </header>

            <div className="w-full p-4 overflow-y-auto space-y-4 h-[60vh]">
              {messages.map((msg, index) => {
                const isLastMessage = index === messages.length - 1;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.fromMe ? "justify-end" : "justify-start"
                    }`}
                    ref={isLastMessage ? messageEndRef : null}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.fromMe ? "bg-blue-200" : "bg-purple-100"
                      } shadow`}
                    >
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{msg.sender}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {msg.time}
                        </span>
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="p-4 border-t flex items-center space-x-2">
              <MdOutlineEmojiEmotions size={20} className="cursor-pointer" />
              <FaPaperclip
                className="cursor-pointer bg-gray-200"
                onClick={handleFileSelect}
              />
              <input
                type="file"
                className="hidden"
                ref={fileRef}
                onChange={handleFileChange}
              />
              <textarea
                className="flex-1 px-4 py-2 border rounded-xl resize-none bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="1"
                placeholder="Enter a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="p-[0.7rem] bg-blue-500 text-white rounded-full"
                onClick={handleSendMessage}
              >
                <IoMdSend />
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getNodeColor = (name) => {
  const colors = [
    "bg-orange-600",
    "bg-purple-600",
    "bg-yellow-600",
    "bg-green-600",
    "bg-blue-600",
    "bg-red-600",
    "bg-teal-600",
    "bg-pink-600",
  ];
  const hash = Array.from(name).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return colors[hash % colors.length];
};

export default Chat;
