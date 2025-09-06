
import React, { useState } from "react";
import MessageList from "../messages/message-list";
import SiteHeader from "../home/header";
import SiteFooter from "../home/footer";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import {Link} from 'react-router-dom';
import NotificationList from "./notificationList";

const Notifications = () => {

    const currentUser = atob(localStorage.getItem('userID')) || "";
    const group = atob(localStorage.getItem('group')) || "";
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    console.log("currentUser",currentUser)
    return(
        <div>
        <SiteHeader/>
        <>
        {/* Breadcrumb */}
        <div className="breadcrumb-bar">
            <div className="container">
            <div className="row align-items-center inner-banner">
                <div className="col-md-12 col-12 text-center">
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                    <ol className="breadcrumb"> 
                    <li className="breadcrumb-item">
                        <a href="/">
                        <i className="isax isax-home-15" />
                        </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                        <Link to={`/${group.toLowerCase()}/dashboard`}>{group}</Link> 
                    </li>
                    </ol>
                    <h2 className="breadcrumb-title">Notifications</h2>
                </nav>
                </div>
            </div>
            </div>
            <div className="breadcrumb-bg">
            <ImageWithBasePath
                src="assets/img/bg/breadcrumb-bg-01.png"
                alt="img"
                className="breadcrumb-bg-01"
            />
            <ImageWithBasePath
                src="assets/img/bg/breadcrumb-bg-02.png"
                alt="img"
                className="breadcrumb-bg-02"
            />
            <ImageWithBasePath
                src="assets/img/bg/breadcrumb-icon.png"
                alt="img"
                className="breadcrumb-bg-03"
            />
            <ImageWithBasePath
                src="assets/img/bg/breadcrumb-icon.png"
                alt="img"
                className="breadcrumb-bg-04"
            />
            </div>
        </div>
        {/* /Breadcrumb */}
        </>
        <div className="content pt-2">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-xl-12">
                    {/* <div className="dashboard-header">
                        <h3>Notifications</h3>
                        <ul className="header-list-btns"></ul>
                    </div> */}
                    {error ? (
                        <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                            {error}
                        </div>
                        ) : ''}
                    {success ? (
                        <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                            {success}
                        </div>
                        ) : ''}
                    <div className="tab-content appointment-tab-content">
                        <div
                        className="tab-pane fade show active"
                        id="pills-upcoming"
                        role="tabpanel"
                        aria-labelledby="pills-upcoming-tab"
                        >
                        <NotificationList
                            setError={setError}
                            setSuccess={setSuccess}
                            MessageTo={currentUser}
                            Type={"All"}
                        />
                    </div>
                </div>
                </div>
                </div>
                </div>
            </div>
        </div>
    )
    
}

export default Notifications;