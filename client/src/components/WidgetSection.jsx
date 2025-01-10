import React from "react";

const WidgetSection = ({ layout = 1, children }) => {
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
    <div className={`w-full grid gap-4 pb-4 ${gridClasses[layout]}`}>
      {React.Children.map(children, (child) => (
        <div>
          {child}
        </div>
      ))}
    </div>
  );
};

export default WidgetSection;
