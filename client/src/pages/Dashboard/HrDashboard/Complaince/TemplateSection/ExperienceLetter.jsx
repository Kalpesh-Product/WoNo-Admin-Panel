import biznestLogo from "../../../../../assets/biznest/biznest_logo.jpg";

const ExperienceLetter = () => {
  return (
    <div>
      {/* <div>Make here</div> */}
      <div>
        <div className="  h-full">
          <div className="border  bg-[#fa0606] w-[50rem] h-[70rem] mx-auto">
            <div className="  bg-white ml-10 h-full">
              <div className="  bg-white mx-10 h-full flex flex-col justify-between">
                <div>
                  <div className="pt-20 flex items-center justify-center">
                    <img
                      className="w-[90%] h-[80%] object-contain cursor-pointer"
                      src={biznestLogo}
                      alt="logo"
                    />
                    {/* <p className="text-center text-[10rem]">
                      BI<span className="text-red-600">Z</span> Nest
                    </p> */}
                  </div>
                  <div>
                    <p className="text-center underline font-bold uppercase text-[1.9rem]">
                      Mustaro Technoserve Private Limited
                    </p>
                  </div>
                  <div>
                    <p className="text-right py-5">
                      <span className="font-bold">Date:</span> DD/MM/YY
                    </p>
                  </div>
                  <div className="py-5">
                    <span className="font-bold">To,</span> <br />
                    Name <br />
                    Designation <br />
                    Worked From
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
                      This is to certify that [Name] was employed with Mustaro
                      Technoserve Private Limited “BIZ Nest” for a period of
                      Eleven Months. He was hired on [DOJ], and his last working
                      date was [LWD]. His last position title was [Designation].
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
                      (Name)
                      <br />
                      (Designation) – Human Resources Department
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
    </div>
  );
};

export default ExperienceLetter;
