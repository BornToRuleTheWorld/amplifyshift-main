/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { useHistory } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import logo from '../../../assets/images/logo.png';
import logosvg from "../../../assets/img/logo.svg";
import IMG01 from "../../../assets/images/doctors/doctor-thumb-02.jpg";
// import Dropdown from "react-bootstrap/Dropdown";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import FeatherIcon from "feather-icons-react";

import { Browser_categorie,
  Home_12,
  Home_13,
  doctorprofileimg,
  home_01,
  home_02,
  home_03,
  home_04,
  home_05,
  home_06,
  home_07,
  home_08,
  home_09,
  home_10,
  home_11,
  logo_03,
  logo_15,
  logo_svg,
  logo_white 
} from "../../imagepath";

//import Chart from "./patients/dashboard/chart";
import Chart from "../../patients/dashboard/chart";
//import Notification from "./patients/dashboard/notification";
import Notification from "../../patients/dashboard/notification";
// import { IMG07 } from "../components/patients/doctorprofile/img";
import NavLinks from "../home/nav";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import { setDataTheme } from "../../../../core/data/redux/themeSettingSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { base_path } from "../../../../environment";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // const history = useHistory();
  //Aos
  // const location = useLocation();
  const [searchField, setSearchField] = useState(false);
  const toggleSearch = () => {
    setSearchField(!searchField);
  };
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  const config = base_path;
  const dispatch = useDispatch();
  const dataTheme = useSelector((state) => state.themeSetting.dataTheme);
  const handleDataThemeChange = (theme) => {
    dispatch(setDataTheme(theme));
  };
  //mobile menu
  const [change, setChange] = useState(false);
  const [isSideMenu, setSideMenu] = useState("");
  const [isSideMenuone, setSideMenuone] = useState("");
  const [isSideMenutwo, setSideMenutwo] = useState("");
  const [isSideSearch, setSideSearch] = useState("");
  const [isSidebooking, setSideBooking] = useState("");
  const [button, setButton] = useState(true);
  const [navbar, setNavbar] = useState(false);
  const [isSideMenuthree, setSideMenuthree] = useState("");
  const [isSideMenufour, setSideMenufour] = useState("");
  const [sideMenufive, setSideMenufive] = useState("");
  const [menu, setMenu] = useState(false);

  // const [menu1, setMenu1] = useState(false);
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
  const toggleSidebarbooking = (value) => {
    setSideBooking(value);
  };

  // const mobilemenus = () => {
  //   setMenu(!true);
  // };

  // Rest of your code that uses pathnames

  let pathnames = window.location.pathname;

  // const [active, setActive] = useState(false);
  const url = pathnames.split("/").slice(0, -1).join("/");

  const onHandleMobileMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };

  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };

  //nav transparent

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);
  window.addEventListener("resize", showButton);

  const changeBackground = () => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  window.addEventListener("scroll", changeBackground);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      {!pathnames.includes("home1") && (
        <header
          className={`header ${
            pathnames.includes("/index-11")
              ? "header-fixed header-fourteen header-sixteen"
              : "" || pathnames.includes("/index-10")
              ? "header-fixed header-fourteen header-fifteen"
              : "" || pathnames.includes("/index-9")
              ? "header-fixed header-fourteen"
              : "" || pathnames.includes("/index-8")
              ? "header-fixed header-fourteen header-twelve header-thirteen"
              : "" || pathnames.includes("/index-7")
              ? "header-fixed header-fourteen header-twelve"
              : "" || pathnames.includes("/index-6")
              ? "header-trans header-eleven"
              : "" || pathnames.includes("/index-4")
              ? "header-trans custom"
              : "" || pathnames.includes("/index-5")
              ? "header header-fixed header-ten"
              : "" || pathnames.includes("home")
              ? "header-trans header-two"
              : "" || pathnames.includes("/index-13")
              ? "header header-custom header-fixed header-ten home-care-header"
              : "" || pathnames.includes("/Pharmacy-index")
              ? "header header-one"
              : "header header-custom header-fixed inner-header relative"
          } 
           ${isScrolled ? 'pharmacy-header' : ''} `}
          style={
            pathnames.includes("/index-6") && navbar
              ? { background: "rgb(30, 93, 146)" }
              : { background: "" } && pathnames.includes("/index-10") && navbar
              ? { background: "rgb(255, 255, 255)" }
              : { background: "" } && pathnames.includes("/index-11") && navbar
              ? { background: "rgb(255, 255, 255)" }
              : { background: "" } && pathnames.includes("/index-4") && navbar
              ? { background: "rgb(43, 108, 203)" }
              : { background: "" } && pathnames.includes("/index-9") && navbar
              ? { background: "rgb(43, 108, 203)" }
              : { background: "" } && pathnames.includes("/index-2") && navbar
              ? { background: "rgb(255, 255, 255)" }
              : { background: "" }
          }
        >
          <div className="container">
            <nav
              className={`navbar navbar-expand-lg header-nav ${
                pathnames.includes("home1") ? "nav-transparent" : ""
              }`}
            >
              <div className="navbar-header">
                <Link
                  to="#0"
                  id="mobile_btn"
                  onClick={() => onHandleMobileMenu()}
                >
                  <span className="bar-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </Link>
                 <Link to="/" className="navbar-brand logo">
                 <div className="text-primary text-end" style={{fontSize:"11px", fontWeight:"bolder"}}>BETA</div>
                  <img src="/assets/img/amplify-shift-color.png" className="img-fluid" alt="Logo" style={{width:"1200px"}} />
                </Link>
                {/* <Link to="/site-home" className="navbar-brand logo">
                 <h2><span style={{color:"#0E82FD"}}>AmplifyShift</span></h2>
                </Link> */}
                {/* <Link to="/home-2" className="navbar-brand logo">
                  {pathnames.includes("/index-5") ? (
                    <img src={logo_white} className="img-fluid" alt="Logo" />
                  ) : pathnames.includes(
                      "/react/template/Pharmacy/Pharmacy-index"
                    ) ? (
                    <div className="browse-categorie">
                      <div className="dropdown categorie-dropdown">
                        <Link
                          to="#"
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <img src={Browser_categorie} alt /> Browse Categories
                        </Link>
                        <div className="dropdown-menu">
                          <Link className="dropdown-item" to="#">
                            Ayush
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Covid Essentials
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Devices
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Glucometers
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={
                        pathnames === "/react/template/index-6" ||
                        pathnames === "/react/template/index-4"
                          ? logosvg
                          : pathnames === "/react/template/index-11"
                          ? logo_15
                          : pathnames === "/react/template/index-10"
                          ? logo_15
                          : pathnames === "/react/template/index-9"
                          ? logo_03
                          : pathnames === "/react/template/index-7"
                          ? logo_svg
                          : pathnames == "/react/template/index-13"
                          ? logo_white
                          : logosvg
                      }
                      className="img-fluid"
                      alt="Logo"
                    />
                  )}
                </Link> */}

              </div>
              <div className="main-menu-wrapper mx-5 px-2 text-center">
                <div className="menu-header">
                  <Link to="/home-2" className="menu-logo">
                    <img src={logo} className="img-fluid" alt="Logo" />
                  </Link>
                  <Link
                    to="#0"
                    id="menu_close"
                    className="menu-close"
                    onClick={() => onhandleCloseMenu()}
                  >
                    <i className="fas fa-times"></i>
                  </Link>
                </div>
                  
                <ul
                  className={`main-nav ${
                    pathnames.includes("home4") ? "white-font" : ""
                  }`}
                >
                  <NavLinks/>
                  
                      
                </ul>
              </div>

              <ul className="nav header-navbar-rht m-2">
                    {/* <li className="searchbar">
                      <Link to="#" onClick={toggleSearch}>
                      <i className="feather icon-search" />
                      </Link>
                      <div className={
                      searchField
                        ? "togglesearch d-block"
                        : "togglesearch d-none"
                      } >
                        <form action={`${config}/patient/search-doctor1`}>
                          <div className="input-group">
                            <input type="text" className="form-control" />
                            <button type="submit" className="btn">
                              Search
                            </button>
                          </div>
                        </form>
                      </div>
                    </li> */}
                    <li className="header-theme noti-nav">
                    <Link
                      to="#"
                      id="dark-mode-toggle"
                      className={`theme-toggle ${dataTheme === 'light' && 'activate'}`}
                      onClick={() => handleDataThemeChange("dark-mode")}
                    >
                      <i className="isax isax-sun-1" />
                    </Link>
                    <Link
                      to="#"
                      id="light-mode-toggle"
                      className={`theme-toggle ${dataTheme === 'dark-mode' && 'activate'}`}
                      onClick={() => handleDataThemeChange("light")}
                    >
                      <i className="isax isax-moon" />
                    </Link>
                  </li>
                <li>
                  <Link
                    to="/site-login"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-lock-1 me-1" />
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/facility/register"
                    className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-user-tick me-1" />
                    Facility
                  </Link>
                </li>
                <li>
                  <Link
                    to="/professional/register"
                    className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-user-tick me-1" />
                    Professional
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
