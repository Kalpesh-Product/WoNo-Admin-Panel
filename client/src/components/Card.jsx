import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FaArrowRight } from "react-icons/fa";

const Card = ({
  title,
  icon,
  data,
  bgcolor,
  fontColor,
  height,
  fontFamily,
  titleColor,
  route,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="shadow-lg p-4 rounded-xl text-center flex flex-col justify-between items-center cursor-pointer 
        transform transition-all duration-300 hover:shadow-xl min-w-[180px] relative group"
      style={{
        backgroundColor: bgcolor || "#fff",
        color: fontColor || "#000",
        height: height || "auto",
        fontFamily: fontFamily || "'Poppins', sans-serif",
      }}
    >
      <div className="flex items-center justify-center text-4xl mb-4 transition-transform duration-300 hover:scale-110">
        {icon || data}
      </div>
      <div className="flex justify-between items-center gap-4">
        <span
          className="text-content font-semibold"
          style={{ color: titleColor || "inherit" }}
        >
          {title}
        </span>

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

export default Card;
