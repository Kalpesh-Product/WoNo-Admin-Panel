import RevenueGraph from "../../../components/graphs/RevenueGraph";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import AgTable from "../../../components/AgTable";

const ParentRevenue = ({ revenueData, tableColumns }) => {
  if (!revenueData || tableColumns.length === 0) return <p>Loading...</p>;

  return (
    <div>
      {/* ✅ Pass received data to RevenueGraph */}
      <RevenueGraph annualMonthlyRawData={revenueData} />

      {/* ✅ Render Financial Breakdown */}
      <div>
        {revenueData.map((domain, index) => (
          <div key={index}>
            {domain.tableData?.rows.map((row, rowIndex) => {
              const totalRevenue = row.actualRevenue || row.projectedRevenue || 0;
              
              // ✅ Extract clients data from the row itself
              const clientsData = row.clients || [];

              return (
                <Accordion key={rowIndex} className="py-4">
                  <AccordionSummary
                    expandIcon={<IoIosArrowDown />}
                    aria-controls={`panel-${index}-${rowIndex}-content`}
                    id={`panel-${index}-${rowIndex}-header`}
                    className="border-b-[1px] border-borderGray"
                  >
                    <div className="flex justify-between items-center w-full px-4">
                      <span className="text-subtitle font-pmedium">
                        {row.month} (₹{totalRevenue.toLocaleString()})
                      </span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <AgTable search={clientsData.length > 5} data={clientsData} columns={tableColumns} tableHeight={300} />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentRevenue;
