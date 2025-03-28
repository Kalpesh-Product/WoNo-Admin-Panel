import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "motion/react";

const DataCard = ({ title, description, data, route }) => {
  const navigate = useNavigate();

  return (
    <div className="hover:bg-gray-200 transition-colors duration-200 p-6 rounded-xl text-left w-full max-w-sm shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-title font-semibold text-black">{title}</div>
        <div>
          <div className="text-2xl font-bold text-black">{data}</div>
        </div>
      </div>
      <hr className="border-gray-300 mb-4" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-800 capitalize">{description}</div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          className="bg-primary text-white p-2 rounded-full cursor-pointer"
          onClick={() => navigate(route)}
        >
          <FaArrowRight size={12} />
        </motion.div>
      </div>
    </div>
  );
};

export default DataCard;
