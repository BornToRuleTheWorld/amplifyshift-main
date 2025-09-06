import React from "react";
import { Link,NavLink } from "react-router-dom";


const AdminProfessionalNav = (props) => {

    return (
        <nav className="settings-tab mb-1">
            <ul className="nav nav-tabs-bottom" role="tablist">
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to='/site-user/professional/profile'>
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/site-user/professional/license">
                        License
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/site-user/professional/certificate">
                        Certificate
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/site-user/professional/education">
                        Education
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/site-user/professional/reference">
                        Reference
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/site-user/professional/document">
                        Documents
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/site-user/professional/emergency">
                        Emergency contact
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default AdminProfessionalNav;
