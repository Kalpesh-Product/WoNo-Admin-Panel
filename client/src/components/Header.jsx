import { TextField, Avatar, InputAdornment } from "@mui/material";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import Abrar from "../assets/abrar.jpeg";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { auth } = useAuth();
  return (
    <>
      <div className="flex w-full justify-between gap-x-10 items-center p-2">
        <div className="w-full flex items-center pl-20">
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
          <Avatar>
            <img src={Abrar} alt="" />
          </Avatar>
          <div className="w-full">
            <h1 className="text-xl font-semibold">{auth.user.name}</h1>
            <span className="text-content">{auth.user.role.roleTitle}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
