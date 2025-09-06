import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import { useLocation } from "react-router-dom";
import c from "config";

const NavLinks = () => {
  const [menu, setMenu] = useState(false);
  const [isSideMenu, setSideMenu] = useState("");
  const [isSideDoctor, setSideDoctor] = useState("");
  const [isSideMenuone, setSideMenuone] = useState("");
  const [isSideMenutwo, setSideMenutwo] = useState("");
  const [isSideMenuthree, setSideMenuthree] = useState("");
  const [isSideMenufour, setSideMenufour] = useState("");
  const [sideMenufive, setSideMenufive] = useState("");
  const [isSideSearch, setSideSearch] = useState("");
  const [isSidebooking, setSideBooking] = useState("");

  const [showHeader, setShowHeader]                 = useState("block");
  const [facilityHeader, setFacilityHeader]         = useState("block");
  const [professionalHeader, setProfessionalHeader] = useState("block");

  const userType = atob(localStorage.getItem('group'));
  console.log('userType', userType);

  // Rest of your code that uses pathnames
  const Location = useLocation()
  const pathnames = Location.pathname;
  const url = pathnames.split("/").slice(0, -1).join("/");

  console.log("url",url)
  console.log("pathnames",pathnames)
  
  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };
  const toggleSidebarbooking = (value) => {
    setSideBooking(value);
  };
  const toggleSidebarDoctor = (value) => {
    setSideDoctor(value);
  };
  const toggleSidebarthree = (value) => {
    setSideMenuthree(value);
  };
  const toggleSidebar = (value) => {
    setSideMenu(value);
  };
  const toggleSidebarfour = (value) => {
    setSideMenufour(value);
  };
  const toggleSidebarfive = (value) => {
    setSideMenufive(value);
  };
  const toggleSidebarone = (value) => {
    setSideMenuone(value);
  };
  const toggleSidebartwo = (value) => {
    setSideMenutwo(value);
  };
  const toggleSidebarsearch = (value) => {
    setSideSearch(value);
  };

  const showProfessionalHeader = () => {
    url.includes('/professional') ? pathnames.includes('/professional/register') ? setProfessionalHeader("none"):null:null
  }

  const showFacilityHeader = () => {
    url.includes('/facility') ? pathnames.includes('/facility/register') ? setFacilityHeader("none"): setFacilityHeader("block") : setFacilityHeader("none")
  }

  const showUserHeader = () => {
    url ? (pathnames.includes('/professional/register') || pathnames.includes('/facility/register') )  ? setShowHeader("none") : setShowHeader("block") : setShowHeader("none")
  }

  useEffect(()=>{
    showProfessionalHeader();
    showFacilityHeader();
    showUserHeader();
  },[url])

  return (
    <>
    <li>
      <NavLink
        to={userType === "Administrator" ? "/site-user/dashboard" : userType === "Facility" ? "/facility/home" : userType === "Professional" ? "/professional/myshifts" : "/"}
        onClick={() => setMenu(!menu)}
        className={`${menu === true ? "submenu " : ""}`}
      >
        Home
      </NavLink>
    </li>
  {userType === "Administrator" ? (
    <>
      <li>
        <NavLink
          to="/site-user/professional"
          onClick={() => setMenu(!menu)}
          className={`${menu === true ? "submenu " : ""}`}
        >
          Professionals
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/site-user/facility"
          onClick={() => setMenu(!menu)}
          className={`${menu === true ? "submenu " : ""}`}
        >
          Facilities
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/site-user/jobs"
          onClick={() => setMenu(!menu)}
          className={`${menu === true ? "submenu " : ""}`}
        >
          Jobs
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/site-user/contracts"
          onClick={() => setMenu(!menu)}
          className={`${menu === true ? "submenu " : ""}`}
        >
          Contracts
        </NavLink>
      </li>   

      <li>
        <NavLink
          to="/site-user/shifts"
          onClick={() => setMenu(!menu)}
          className={`${menu === true ? "submenu " : ""}`}
        >
          Shifts
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/site-user/document"
          onClick={() => setMenu(!menu)}
          className={`${menu === true ? "submenu " : ""}`}
        >
          Document
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/site-user/pricing-plan"
          onClick={() => setMenu(!menu)}
          className={`${menu === true ? "submenu " : ""}`}
        >
          Pricing Plan
        </NavLink>
      </li>
    </>
  ) : (userType === "Facility" || userType === "Professional") ? (
    <>
    {userType === "Professional" && (
        <li>
          <NavLink to="/professional/job-search" className="subdrop">
            Job Search
          </NavLink>
        </li>
      )}

      <li>
          <NavLink to={userType === "Professional" ? "/professional/dashboard" : "/facility/dashboard"}
          className="subdrop">
            Dashboard
          </NavLink>
        </li>
      {userType === "Facility" && (
        <li>
          <NavLink to="/facility/jobs" className="subdrop">
            Jobs
          </NavLink>
        </li>
      )}

      <li>
        <NavLink
          to={userType === "Professional" ? "/professional/job-requests" : "/facility/job-requests"}
          className="subdrop"
        >
          Job Request
        </NavLink>
      </li>

      <li>
        <NavLink
          to={userType === "Professional" ? "/professional/contracts" : "/facility/contracts"}
          className="subdrop"
        >
          Contracts
        </NavLink>
      </li>

      <li>
        <NavLink
          to={userType === "Professional" ? "/professional/myprofile" : "/facility/myprofile"}
          className="subdrop"
        >
          My Profile
        </NavLink>
      </li>
      
      <li>
        <NavLink
          to={userType === "Professional" ? "/professional/shifts" : "/facility/shifts"}
          className="subdrop"
        >
          Shifts
        </NavLink>
      </li>

      {userType === "Facility" && (
        <li>
          <NavLink to="/facility/search" className="subdrop">
            Search
          </NavLink>
        </li>
      )}

      {/* <li>
        <NavLink
          to={userType === "Professional" ? "/professional/notifications" : "/facility/notifications"}
          className="subdrop"
        >
          Notifications
        </NavLink>
      </li> */}

      <li>
        <NavLink
          to={userType === "Professional" ? "/professional/pricing-plan" : "/facility/pricing-plan"}
          className="subdrop"
        >
          Pricing Plan
        </NavLink>
      </li>
    </>
  ) : (
    <>
      <li>
        <NavLink to="/about-us" className="subdrop">
          About Us
        </NavLink>
      </li>

      <li>
        <NavLink to="/contact-us" className="subdrop">
          Contact
        </NavLink>
      </li>

      <li>
        <NavLink to="/private-policy" className="subdrop">
          Terms & Conditions
        </NavLink>
      </li>

      <li>
        <NavLink to="/job-search" className="subdrop">
          Job Search
        </NavLink>
      </li>
    </>
  )}
</>
);
};

export default NavLinks;
