import React from 'react'
import PrimaryButton from '../../../../components/PrimaryButton'
import AgTable from '../../../../components/AgTable'

const HrReports = ({title,buttonTitle,rowSelection}) => {


  const StatusCellRenderer = (params) => {
    const status = params.value;
    const statusClass = status === 'completed' ? 'status-completed' : 'status-pending';
    return (
      <span className={`status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };



    const holdiayEvents = [
      {
        headerCheckboxSelection: true, 
        checkboxSelection: true,       
        headerName: '',                
        width: 50                      
      },
        { field: "payrollid", headerName: "Payroll Id",flex:1 },
        { field: "employeename", headerName: "Employee Name",flex:1 },
        { field: "role", headerName: "Role",flex:1 },
        { field: "dateandtime", headerName: "Date & Time",flex:1 },
        { field: "totalsalary", headerName: "Total Salary",flex:1 },
        { field: "reimbursment", headerName: "Reimbursment",flex:1 },
        { field: "status", headerName: "Status",cellRenderer: StatusCellRenderer,flex:1 },
      ];

      const rows = [
        
        {
         payrollid:"PYRL120124",
         employeename:"Kalpesh Naik",
         role:"Lead UI/UX Developer",
         dateandtime:"21 Jun, 2024 - 05.05pm ",
         totalsalary:"Rs 2,500.00",
         reimbursment:"Rs 500.00",
         status:"completed"
        },
        {
            payrollid:"PYRL120130",       
            employeename:"AiwinRaj",
            role:"Jr UI/UX Developer",
            dateandtime:"21 Jun, 2024 - 05.03pm ",
            totalsalary:"Rs 2,300.00",
            reimbursment:"Rs 100.00",
            status:"completed"
        },
        {
            payrollid:"PYRL120131",
            employeename:"Anushri Bhagat",
            role:"Jr UI/UX Developer",
            dateandtime:"21 Jun, 2024 - 05.05pm ",
            totalsalary:"Rs 2,000.00",
            reimbursment:"Rs 100.00",
            status:"Pending"
        },
        {
            payrollid:"PYRL120132",
            employeename:"Allen Silvera",
            role:"Jr UI/UX Developer",
            dateandtime:"21 Jun, 2024 - 05.00pm ",
            totalsalary:"Rs 2,000.00",
            reimbursment:"Rs 100.00",
            status:"Pending"
        },
        {
            payrollid:"PYRL120133",
            employeename:"Sankalp Kalangutkar",
            role:"Jr backed Develper",
            dateandtime:"21 Jun 2024 - 05.03pm ",
            totalsalary:"Rs 2,500.00",
            reimbursment:"Rs 200.00",
            status:"completed"
        },
        {
            payrollid:"PYRL120134",
            employeename:"Muskan Dodmani",
            role:"Jr backend Developer",
            dateandtime:"21 Jun 2024 - 05.10pm ",
            totalsalary:"Rs 2,500.00",
            reimbursment:"Rs 200.00",
            status:"Pending"
        },
       
      ];
  return (
    <div>
    <div className="flex justify-between items-center pb-4">
      <span className="text-title font-pmedium text-primary">{title}</span>
      
    </div>

    <div>
      
      <AgTable search={true} searchColumn={"Reports"} columns={holdiayEvents} data={rows} tableTitle={'Reports'}  buttonTitle={"Exports"} rowSelection='multiple' />
    </div>
  </div>
  )
}

export default HrReports