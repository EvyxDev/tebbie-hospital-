import React from "react";
import { Outlet } from "react-router";
import SecondNaviagtion from "./SecondNaviagtion";

const SecondLayout = () => {
  return (
    <div className="flex flex-col ">
      <SecondNaviagtion />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default SecondLayout;
