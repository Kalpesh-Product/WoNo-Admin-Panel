import { useEffect, useState, useRef } from "react";
import biznestLogo from "../../../../../assets/biznest/biznest_logo.jpg";
import { useSidebar } from "../../../../../context/SideBarContext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { TextField } from "@mui/material";

const ExperienceLetter = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const letterRef = useRef(null);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

  const [letterData, setLetterData] = useState({
    name: "[Name]",
    designation: "[Designation]",
    workedFrom: "[Worked From]",
    doj: "[DOJ]",
    lwd: "[LWD]",
    hrName: "[HR Name]",
    hrDesignation: "[HR Designation]",
    date: "DD/MM/YY",
  });

  const handleChange = (e) => {
    setLetterData({ ...letterData, [e.target.name]: e.target.value });
  };

  const exportToPDF = async () => {
    const canvas = await html2canvas(letterRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("Experience_Letter.pdf");
  };

  return (
    <div className="flex items-start gap-4">
      <div>
        <div className="h-full" ref={letterRef}>
          <div className="border bg-[#fa0606] w-[50rem] h-[70rem] mx-auto">
            <div className="bg-white ml-10 h-full">
              <div className="bg-white mx-10 h-full flex flex-col justify-between">
                <div>
                  <div className="pt-20 flex items-center justify-center">
                    <img
                      className="w-[90%] h-[80%] object-contain cursor-pointer"
                      src={biznestLogo}
                      alt="logo"
                    />
                  </div>
                  <div>
                    <p className="text-center underline font-bold uppercase text-[1.9rem]">
                      Mustaro Technoserve Private Limited
                    </p>
                  </div>
                  <div>
                    <p className="text-right py-5">
                      <span className="font-bold">Date:</span> {letterData.date}
                    </p>
                  </div>
                  <div className="py-5">
                    <span className="font-bold">To,</span> <br />
                    {letterData.name} <br />
                    {letterData.designation} <br />
                    {letterData.workedFrom}
                  </div>
                  <div className="py-5 font-bold">
                    <p>Subject: Experience Letter</p>
                  </div>
                  <div>
                    <p className="py-5 font-bold uppercase underline text-center">
                      To Whomsoever it may concern
                    </p>
                  </div>
                  <div>
                    <p>
                      This is to certify that {letterData.name} was employed
                      with Mustaro Technoserve Private Limited “BIZ Nest” for a
                      period of Eleven Months. He was hired on {letterData.doj},
                      and his last working date was {letterData.lwd}. His last
                      position title was {letterData.designation}.
                      <br />
                      <br />
                      We wish him all the best for his future endeavors.
                      <br />
                      <br />
                      <br />
                      Yours Sincerely,
                      <br />
                      <br />
                      <br />
                      <br />
                      {letterData.hrName}
                      <br />
                      {letterData.hrDesignation} – Human Resources Department
                    </p>
                  </div>
                </div>
                <div>
                  <p className="py-20 text-xs font-sans text-center text-gray-500">
                    Mustaro Technoserve Pvt Ltd, Sunteck Kanaka Corporate Park,
                    501 (A) B’ Wing, 5th Floor Patto Plaza, Panaji - 403 001.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/3 p-4 border">
        <span className="text-subtitle font-pmedium">Edit Fields</span>
        <div className="flex flex-col gap-4">
          {Object.keys(letterData).map((field) => (
            <div key={field} className="my-2 ">
              <TextField
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={letterData[field]}
                placeholder={field}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </div>
          ))}
        </div>
        <button
          onClick={exportToPDF}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default ExperienceLetter;
