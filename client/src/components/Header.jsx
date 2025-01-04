import { TextField, Avatar, InputAdornment } from "@mui/material";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";

const Header = () => {
  return (
    <>
      <div className="flex w-full justify-between gap-x-8 items-center p-3">
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
