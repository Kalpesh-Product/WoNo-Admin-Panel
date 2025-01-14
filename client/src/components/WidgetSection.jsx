import React from "react";

const WidgetSection = ({
  layout = 1,
  children,
  title,
  titleData,
  titleDataColor,
  padding
}) => {
  // Tailwind grid classes for different layouts
  const gridClasses = {
    1: "grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6",
  };

  return (
    <div className="h-full">
      {title && (
        <div className=" border-b-default border-borderGray p-4">
          <span className="text-subtitle">
            {title}{" "}
            <span >
              {titleData && (
                <span>
                  {" "}
                  : <span style={{ color: titleDataColor }} className="font-pbold text-title">{titleData}</span>
                </span>
              )}
            </span>
          </span>
        </div>
      )}
      <div style={{padding:padding ? '0' : '1rem'}} className={`w-full grid gap-4 ${gridClasses[layout]} h-full`}>
        {React.Children.map(children, (child) => (
          <div>{child}</div>
        ))}
      </div>
    </div>
  );
};

export default WidgetSection;
