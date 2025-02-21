import { useParams } from "react-router-dom";
import ExperienceLetter from "../Complaince/TemplateSection/ExperienceLetter";

const ViewTemplate = () => {
  const { id } = useParams();

  // Map template IDs to their components
  const templateComponents = {
    1: <ExperienceLetter />,
  };

  return (
    <div>
      {templateComponents[id] || <p>Template not found</p>}
    </div>
  );
};

export default ViewTemplate;
