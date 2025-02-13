import React, { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Chip,
  Modal,
  Box,
  TextField,
  Checkbox,
  List,
  ListItem,
  IconButton,
  Typography,
} from "@mui/material";
import AgTable from "../../components/AgTable";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { queryClient } from "../../index";

const ManageMeetings = () => {
  const axios = useAxiosPrivate()
  const statusColors = {
    Scheduled: { bg: "#E3F2FD", text: "#1565C0" }, // Light Blue
    Ongoing: { bg: "#FFF3E0", text: "#E65100" }, // Light Orange
    Completed: { bg: "#E8F5E9", text: "#1B5E20" }, // Light Green
    Cancelled: { bg: "#FFEBEE", text: "#B71C1C" }, // Light Red
    Available: { bg: "#E3F2FD", text: "#0D47A1" },
    Occupied: { bg: "#ECEFF1", text: "#37474F" },
    Cleaning: { bg: "#E0F2F1", text: "#00796B" },
    Pending: { bg: "#FFFDE7", text: "#F57F17" },
    "In Progress": { bg: "#FBE9E7", text: "#BF360C" },
  };

const defaultChecklist = [
  { name: "Clean and arrange chairs and tables", checked: false },
  { name: "Check projector functionality", checked: false },
  { name: "Ensure AC is working", checked: false },
  { name: "Clean whiteboard and provide markers", checked: false },
  { name: "Vacuum and clean the floor", checked: false },
  { name: "Check lighting and replace bulbs if necessary", checked: false },
  { name: "Ensure Wi-Fi connectivity", checked: false },
  { name: "Stock water bottles and glasses", checked: false },
  { name: "Inspect electrical sockets and outlets", checked: false },
  { name: "Remove any trash or debris", checked: false },
];
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [checklists, setChecklists] = useState({});
  const [newItem, setNewItem] = useState("");

  // Fetch meetings
  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const response = await axios.get("/api/meetings/get-meetings");
      const filteredMeetings = response.data.filter(
        (meeting) => meeting.meetingStatus === "Completed"
      );
      console.log("Fetched Meetings:", filteredMeetings);
      return filteredMeetings;
    },
  });

  // API mutation for submitting housekeeping tasks
  const housekeepingMutation = useMutation({
    mutationFn: async (data) => {
      await axios.patch("/api/meetings/add-housekeeping-tasks", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] }); // ✅ Refetch meetings after update
      toast.success("Checklist completed");
      handleCloseChecklistModal();
    },
    onError: () => {
      toast.error("Failed to submit checklist");
    },
  });

  // Initialize checklists when meetings are loaded
  useEffect(() => {
    if (meetings.length > 0) {
      const initialChecklists = {};
      meetings.forEach((meeting) => {
        initialChecklists[meeting._id] = {
          defaultItems: [...defaultChecklist],
          customItems: [],
        };
      });
      setChecklists(initialChecklists);
    }
  }, [meetings]);

  const handleOpenChecklistModal = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setChecklistModalOpen(true);
  };

  const handleCloseChecklistModal = () => {
    setChecklistModalOpen(false);
    setSelectedMeetingId(null);
  };

  const handleAddChecklistItem = () => {
    if (!newItem.trim() || !selectedMeetingId) return;
    setChecklists((prev) => {
      const updatedCustomItems = [
        ...prev[selectedMeetingId].customItems,
        { name: newItem.trim(), checked: false },
      ];
      return {
        ...prev,
        [selectedMeetingId]: {
          ...prev[selectedMeetingId],
          customItems: updatedCustomItems,
        },
      };
    });
    setNewItem("");
  };

  const handleToggleChecklistItem = (index, type) => {
    if (!selectedMeetingId) return;
    setChecklists((prev) => {
      const updatedItems = prev[selectedMeetingId][type].map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );
      return {
        ...prev,
        [selectedMeetingId]: {
          ...prev[selectedMeetingId],
          [type]: updatedItems,
        },
      };
    });
  };

  const handleRemoveChecklistItem = (index) => {
    if (!selectedMeetingId) return;
    setChecklists((prev) => {
      const updatedCustomItems = prev[selectedMeetingId].customItems.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        [selectedMeetingId]: {
          ...prev[selectedMeetingId],
          customItems: updatedCustomItems,
        },
      };
    });
  };

  const isSubmitDisabled = () => {
    if (!selectedMeetingId) return true;
    const { defaultItems, customItems } = checklists[selectedMeetingId] || {
      defaultItems: [],
      customItems: [],
    };
    return [...defaultItems, ...customItems].some((item) => !item.checked);
  };

  const handleSubmitChecklist = async () => {
    if (!selectedMeetingId) return;

    const selectedMeeting = meetings.find(
      (meeting) => meeting._id === selectedMeetingId
    );
    if (!selectedMeeting) return;

    const { defaultItems, customItems } = checklists[selectedMeetingId];

    const housekeepingTasks = [...defaultItems, ...customItems].map((item) => ({
      name: item.name,
      status: "Completed",
    }));

    const payload = {
      meetingId: selectedMeetingId,
      roomName: selectedMeeting.roomName,
      housekeepingTasks,
    };

    housekeepingMutation.mutate(payload);
  };

  const handleViewDetails = (meetingData) => {
    console.log("Viewing details for:", meetingData);
    // Add logic here to navigate, open a modal, or display details.
  };

  const columns = useMemo(() => {
    console.log("Updating columns with meetings:", meetings); // ✅ Debugging log
    return [
      { field: "roomName", headerName: "Room Name" },
      { field: "endTime", headerName: "End Time" },
      { field: "extendedEndTime", headerName: "Extended End Time" },
      {
        field: "meetingStatus",
        headerName: "Meeting Status",
        cellRenderer: (params) => (
          <Chip
            label={params.value || ""}
            sx={{
              backgroundColor: statusColors[params.value]?.bg || "#F5F5F5",
              color: statusColors[params.value]?.text || "#000",
              fontWeight: "bold",
            }}
          />
        ),
      },
      {
        field: "housekeepingStatus",
        headerName: "Housekeeping Status",
        cellRenderer: (params) => {
          console.log("Housekeeping Status Params:", params); // ✅ Debugging log
          return (
            <Chip
              label={params.value || ""}
              sx={{
                backgroundColor: statusColors[params.value]?.bg || "#F5F5F5",
                color: statusColors[params.value]?.text || "#000",
                fontWeight: "bold",
              }}
            />
          );
        },
      },
      {
        field: "roomStatus",
        headerName: "Room Status",
        cellRenderer: (params) => (
          <Chip
            label={params.value || ""}
            sx={{
              backgroundColor: statusColors[params.value]?.bg || "#F5F5F5",
              color: statusColors[params.value]?.text || "#000",
              fontWeight: "bold",
            }}
          />
        ),
      },
      {
        field: "action",
        headerName: "Action",
        cellRenderer: (params) => (
          <Box sx={{ display: "flex", gap: 1, minWidth: "250px" }}>
            <Button
              variant="outlined"
              disabled={params.data.housekeepingStatus === "Completed"}
              onClick={() => handleOpenChecklistModal(params.data._id)}
            >
              View Checklist
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewDetails(params.data)}
            >
              View Details
            </Button>
          </Box>
        ),
      },
    ];
  }, [meetings]); // ✅ Columns update whenever `meetings` changes

  return (
    <div className="p-4 flex flex-col gap-4">
      {isLoading ? (
        <Typography variant="h6">Loading meetings...</Typography>
      ) : (
        <AgTable key={meetings} data={meetings || []} columns={columns} />
      )}

      {/* Checklist Modal */}
      <Modal
        open={checklistModalOpen}
        onClose={handleCloseChecklistModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: 400,
            maxHeight: "80vh",
            bgcolor: "white",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <Typography
            variant="h6"
            sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}
          >
            Checklist
          </Typography>

          {/* Scrollable Checklist Section */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
            <Typography variant="subtitle1">Default Tasks</Typography>
            <List>
              {checklists[selectedMeetingId]?.defaultItems.map(
                (item, index) => (
                  <ListItem key={index}>
                    <Checkbox
                      checked={item.checked}
                      onChange={() =>
                        handleToggleChecklistItem(index, "defaultItems")
                      }
                    />
                    {item.name}
                  </ListItem>
                )
              )}
            </List>

            {/* Add New Checklist Item Section */}
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                fullWidth
                label="Add Checklist Task"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
              <Button
                onClick={handleAddChecklistItem}
                variant="contained"
                sx={{ whiteSpace: "nowrap" }} // Prevents text from wrapping
              >
                Add
              </Button>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              Custom Tasks
            </Typography>
            <List>
              {checklists[selectedMeetingId]?.customItems.map((item, index) => (
                <ListItem key={index}>
                  <Checkbox
                    checked={item.checked}
                    onChange={() =>
                      handleToggleChecklistItem(index, "customItems")
                    }
                  />
                  {item.name}
                  <IconButton
                    onClick={() => handleRemoveChecklistItem(index)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Sticky Footer Section */}
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid #e0e0e0",
              position: "sticky",
              bottom: 0,
              bgcolor: "white",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              disabled={isSubmitDisabled()}
              onClick={handleSubmitChecklist}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageMeetings;
