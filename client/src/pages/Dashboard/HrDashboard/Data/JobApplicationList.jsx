import React from 'react'
import AgTable from '../../../../components/AgTable'


const JobApplicationList = () => {

    const leavesColumn = [
        { field: "jobposition", headerName: "Job Position", width:300 },
        { field: "name", headerName: "Name", flex:1, width:200 },
        { field: "email", headerName: "Email", width:200},
        { field: "dateofbirth", headerName: "Date Of Birth",flex:1, width:200 },
        { field: "mobilenumber", headerName: "Mobile Number", width:200},
        { field: "location", headerName: "Location", flex: 1, width:200 },
        { field: "submissiondate", headerName: "Submission Date", flex: 1 },
        { field: "SubmissionTime", headerName: "Submission Time", flex: 1 },
        { field: "ResumeLink", headerName: "Resume Link", flex: 1 },
      ];
    
      const rows = [
        {
          jobposition: "Jr Network Engineer",
          name: "vivek parte",
          email: "vivekparte43@gmail.com",
          dateofbirth: "1989-08-26",
          mobilenumber: "1234523678",
          location: "Maharashtra",
          submissiondate:"03-01-2024",
          SubmissionTime:"17.35.56"


        },
        {
            jobposition: "Jr Network Engineer",
            name: "vivek parte",
            email: "vivekparte43@gmail.com",
            dateofbirth: "1989-08-26",
            mobilenumber: "1234523678",
            location: "Maharashtra",
            submissiondate:"03-01-2024",
            SubmissionTime:"17.35.56"
        },
        {
            jobposition: "Jr Network Engineer",
            name: "vivek parte",
            email: "vivekparte43@gmail.com",
            dateofbirth: "1989-08-26",
            mobilenumber: "1234523678",
            location: "Maharashtra",
            submissiondate:"03-01-2024",
            SubmissionTime:"17.35.56"
        },
        {
            jobposition: "Jr Network Engineer",
            name: "vivek parte",
            email: "vivekparte43@gmail.com",
            dateofbirth: "1989-08-26",
            mobilenumber: "1234523678",
            location: "Maharashtra",
            submissiondate:"03-01-2024",
            SubmissionTime:"17.35.56"
        },
        {
            jobposition: "Jr Network Engineer",
            name: "vivek parte",
            email: "vivekparte43@gmail.com",
            dateofbirth: "1989-08-26",
            mobilenumber: "1234523678",
            location: "Maharashtra",
            submissiondate:"03-01-2024",
            SubmissionTime:"17.35.56"
        },
      ];
    
  return (
    <div>
        <AgTable
          search={true}
          searchColumn={"Leave Type"}
          tableTitle={"Aiwin's Leave List"}
          buttonTitle={"Add Requested Leave"}
          data={rows}
          columns={leavesColumn}
        />
    </div>
  )
}

export default JobApplicationList