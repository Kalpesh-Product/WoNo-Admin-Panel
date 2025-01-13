import React from 'react'
import WidgetSection from "../../components/WidgetSection";
import Card from "../../components/Card";

const TicketSettings = () => {
  return (
    <div>
        <WidgetSection layout={4}>
        <Card
                title={"New Tickets"}
                bgcolor={"white"}
                data={"25"}
                titleColor={"#1E3D73"}
                fontColor={"#1E3D73"}
                height={"10rem"}
              />
              <Card
                title={"Rejected Tickets"}
                data={"10"}
                bgcolor={"White"}
                titleColor={"red"}
                fontColor={"red"}
                height={"10rem"}
              />
              <Card
                title={"Pending Tickets"}
                data={"10"}
                bgcolor={"white"}
                titleColor={"yellow"}
                fontColor={"yellow"}
                height={"10rem"}
              />
               <Card
                title={"Approved Tickets"}
                bgcolor={"white"}
                data={"05"}
                titleColor={"green"}
                fontColor={"green"}
                height={"10rem"}
              />
        </WidgetSection>


    </div>
  )
}

export default TicketSettings