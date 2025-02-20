import React from "react";
import DocxPreview from "../../../../components/HrTemplate/DocxPreview";
import PrimaryButton from "../../../../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import letterTemplate from '../../../../assets/docTemplates/Experience Letter Format.docx'

const Templates = () => {
  const navigate = useNavigate();

  const handleTemplateClick = (template) => {
    navigate("/app/dashboard/HR-dashboard/company/templates/preview-template", { state: { fileUrl: template.fileUrl, title: template.title } });
  };
  const templateData = [
    {
      fileUrl:
        letterTemplate, // Change this to the actual file URL
      title: "Leave Agreement",
      date: "Jan 10, 2025",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-primary text-title font-pmedium">Templates</span>
        <PrimaryButton title={"Add Template"} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateData.map((template, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden border"
            onClick={() => handleTemplateClick(template)}
          >
            <DocxPreview fileUrl={template.fileUrl} />
            <div className="p-4">
              <h2 className="widgetTitle font-semibold font-pregular">
                {template.title}
              </h2>
              <p className="text-content text-gray-500 font-pregular">
                {template.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
