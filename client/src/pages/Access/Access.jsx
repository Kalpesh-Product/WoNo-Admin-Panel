import React, { useState } from "react";
import HierarchyTree from '../../components/HierarchyTree'
import AccessTree from "../../components/AccessTree";

const Access = () => {
  return(
    <>
    <div>
      <div>
        {/* <HierarchyTree /> */}
        <AccessTree />
      </div>
    </div>
    </>
  ) ;
};

export default Access;
