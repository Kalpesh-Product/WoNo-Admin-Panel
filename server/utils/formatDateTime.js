const {format, intervalToDuration} = require("date-fns");

const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd-MM-yyyy");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp), "hh:mm a");  
  };

const formatDuration= (startTime, endTime) => {
  if (!startTime || !endTime) return "N/A";

  const duration = intervalToDuration({
    start: new Date(startTime),
    end: new Date(endTime),
  });

  const { hours, minutes } = duration;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;  
  } else if (hours > 0) {
    return `${hours}h`;  
  } else if (minutes > 0) {
    return `${minutes}m`;  
  } else {
    return "0m";  
  }
};

  module.exports = {formatDate,formatTime,formatDuration}