// import Navbar from "./Navbar";

import DashboardNavbar from "@/components/DashboardNavabar";


const DashboardLayout = ({ children }) => {
  return (
    <>
      <DashboardNavbar />
      <div className="mt-20 ">{children}</div> {/* Content wrapper */}
    </>
  );
};

export default DashboardLayout;
