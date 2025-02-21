import { useNavigate } from "react-router-dom";

const DataCard = ({ data, title, description, route }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        onClick={() => navigate(route)}
        className="bg-white shadow-md p-4 rounded-md text-center cursor-pointer"
      >
        <div className="flex w-full justify-between items-center">
          <div
            className={`text-5xl font-pmedium text-black border-gray-300 border-r-default w-1/2 bg-white py-2`}
          >
            {data}
          </div>
          <hr />
          <div className="text-end flex flex-col gap-2">
            <div className="font-pmedium text-xl">{title}</div>
            <hr />
            <div className="w-full">
              <span className="text-content text-gray-400 w-full ">
                {description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
