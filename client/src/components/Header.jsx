import { TextField, Avatar, InputAdornment } from "@mui/material";
import {
  IoIosArrowForward,
  IoIosSearch,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { useSidebar } from "../context/SideBarContext";
import biznestLogo from "../assets/biznest/biznest_logo.jpg";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  return (
    <>
      <div className="flex w-full justify-between gap-x-10 items-center p-2">
        <div>
          <div>
            <div className={`w-40 flex items-center gap-10 h-full pl-4`}>
              <img
                className="w-[70%] h-full object-contain"
                src={biznestLogo}
                alt="logo"
              />
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-500 text-xl"
              >
                {isSidebarOpen ? <GiHamburgerMenu /> : <IoIosArrowForward />}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center pl-6">
          <TextField
            fullWidth
            size="small"
            type="search"
            placeholder="Type here to search..."
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <IoIosSearch size={20} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        <div className="flex w-full justify-end gap-4">
          <button className="bg-[#1E3D73] p-2 text-white rounded-md">
            <IoMdNotificationsOutline />
          </button>
          <button className="bg-[#1E3D73] p-2 text-white rounded-md">
            <MdOutlineMailOutline />
          </button>
        </div>
        <div className="flex items-center gap-4 w-[40%]">
          <Avatar>N</Avatar>
          <div className="w-full">
            <h1 className="text-xl font-semibold">Alex</h1>
            <h2 className="text-md">Super Admin</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
