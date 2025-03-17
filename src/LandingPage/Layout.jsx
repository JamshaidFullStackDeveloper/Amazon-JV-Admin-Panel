// import Navbar from "./Navbar";

import Navbar from "./Navbar";

const LandingPageLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="mt-20 ">{children}</div> {/* Content wrapper */}
        </>
    );
};

export default LandingPageLayout;
