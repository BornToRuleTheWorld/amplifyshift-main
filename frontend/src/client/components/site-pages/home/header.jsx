import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setDataTheme } from "../../../../core/data/redux/themeSettingSlice";
import NavLinks from "./nav";
import { useLocation, useHistory } from "react-router-dom";
import LogoutButton from "../Logout";
import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN } from "../config";

const SiteHeader = () => {
  const Location = useLocation()
  const pathnames = Location.pathname;
  const history = useHistory();

  const [headerClass, setHeaderClass] = useState(
    "header header-trans"
  );
  const [login, setLogin] = useState(false);
  const [titleLink, setTitleLink] = useState("/")

  let logged_in = ""
  if (localStorage.getItem('logged_in')){
    logged_in = atob(localStorage.getItem('logged_in')) || "";
  }

  const userType = atob(localStorage.getItem('group')) || "";
  // useEffect(() =>{
  //   (pathnames.includes("/facility/register") || pathnames.includes("/professional/register") || pathnames.includes("/site-home")) ? setLogin(true) : setLogin(false)
  // }, [pathnames])
    const currentUser = atob(localStorage.getItem('userID')) || "";
    const [getMessage, setGetMessage] = useState([]);
    const [getRequestMessage, setGetRequestMessage] = useState([]);
    const [getContractMessage, setGetContractMessage] = useState([]);
      
  
    const getNewRequestMessages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/message/GetUpdateMessage/?ToID=${currentUser}&Action=All`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            const messagesWithRole = response.data.data.map(message => ({
                ...message,
                role: 'Request'
            }));
            setGetRequestMessage(messagesWithRole);
        } catch (err) {
            console.log("err",err)
        }
    };

    const getNewContractMessages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/contract_message/GetUpdateContractMessage/?ToID=${currentUser}&Action=All`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            const messagesWithRole = response.data.data.map(message => ({
                ...message,
                role: 'Contract'
            }));
            setGetContractMessage(messagesWithRole);
        } catch (err) {
            console.log("err",err)
        }
    };

    useEffect(() => {
      if(currentUser){
        getNewRequestMessages();
        getNewContractMessages();
      }
    }, [currentUser, pathnames]);

    useEffect(() => {
        setGetMessage([...getRequestMessage, ...getContractMessage]);
    }, [getRequestMessage, getContractMessage]);
  
  console.log("Get Messages", getMessage)
  useEffect(() =>{
    (!logged_in) ? setLogin(true) : setLogin(false)
  }, [pathnames])

  const handleLogout = () => {
    if (!login){
        localStorage.clear();
    }
  };

  useEffect(()=>{
    if(!login){
      if (userType === "Administrator"){
        setTitleLink("/site-user/dashboard")
      }else if(userType === "Professional"){
        setTitleLink("/professional/dashboard")
      }else if(userType === "Facility"){
        setTitleLink("/facility/dashboard")
      }else{
        setTitleLink("/")
      }
    }
  },[login])
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        setHeaderClass("header header-trans pharmacy-header");
      } else {
        setHeaderClass("header header-trans");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
    const dispatch = useDispatch();
    const dataTheme = useSelector((state) => state.themeSetting.dataTheme);
    const handleDataThemeChange = (theme) => {
      dispatch(setDataTheme(theme));
    };
    const onHandleMobileMenu = () => {
      var root = document.getElementsByTagName("html")[0];
      root.classList.add("menu-opened");
    };
    const onhandleCloseMenu = () => {
      var root = document.getElementsByTagName("html")[0];
      root.classList.remove("menu-opened");
    };
  return (
    <>
      {/* Header */}
      <header className={headerClass}>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header col-auto">
              <Link id="mobile_btn" to="#" onClick={() => onHandleMobileMenu()}>
                <span className="bar-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </Link>
              <Link to={titleLink} className="navbar-brand logo">
                <div className="text-primary text-end" style={{fontSize:"11px", fontWeight:"bolder"}}>BETA</div>
                <img src="/assets/img/amplify-shift-color.png" className="img-fluid" alt="Logo" style={{width:"1200px"}} />
              </Link>
              {/* <Link to={titleLink} className="navbar-brand logo">
                <h2><span style={{color:"#0E82FD"}}>AmplifyShift</span></h2>
              </Link> */}
            </div>
            <div className="main-menu-wrapper mx-auto px-auto text-center col-auto">
              {/* <div className="menu-header">
                <Link to="/home-1" className="menu-logo">
                  <ImageWithBasePath src="assets/img/logo.png" className="img-fluid" alt="Logo" />
                </Link>
                <Link id="menu_close" className="menu-close" to="#"  onClick={() => onhandleCloseMenu()}>
                  <i className="fas fa-times" />
                </Link>
              </div> */}
              <ul className="main-nav">
                <NavLinks />
              </ul>
            </div>
            <ul className="nav header-navbar-rht m-0">
              <li className="header-theme me-1">
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
              {userType === "Professional" || userType === "Facility"
              ?
              <li className="nav-item dropdown noti-nav me-3 pe-0">
                    <Link
                      to={userType === "Professional" ? "/professional/notifications" : "/facility/notifications"}
                      className="dropdown-toggle active-dot active-dot-danger nav-link p-0 position-relative"
                      // data-bs-toggle="dropdown"
                    >
                      <span className="bell-wrapper">
                        <i className="isax isax-notification-bing" />
                      </span>
                      {getMessage.length > 0 ? <span className="notification-dot"></span> : null}
                    </Link>
              </li>
              :
              null
              }
              <li className="contact-item">
                <i className="isax isax-call" />&nbsp;
                <span>Contact :</span>+1 315 369 5943
              </li>

                <li className="nav-item">
                   <Link
                      className="nav-link btn btn-primary header-login d-inline-flex align-items-center"
                      onClick={handleLogout}
                      to='/site-login'
                      >
                      <i className="isax isax-user-octagon" />&nbsp;
                      { login ? "Login / Sign up" : "Logout" }{" "}
                  </Link>
                </li>
            </ul>

          </nav>
        </div>
      </header>
      {/* /Header */}
    </>
  );
};

export default SiteHeader;
