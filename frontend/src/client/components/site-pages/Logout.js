import { Link,useHistory } from 'react-router-dom';
import React from 'react';

const LogoutButton = ({login}) => {
    const history = useHistory();

    const handleLogout = () => {
        if (!login){
            localStorage.clear();
        }
        history.push('/site-login');
    };
    
    return (
        <Link
            className="nav-link btn btn-primary header-login d-inline-flex align-items-center"
            onClick={handleLogout}
            >
            <i className="isax isax-user-octagon" />&nbsp;
            { login ? "Login / Sign up" : "Logout" }{" "}
        </Link>
    );
};

export default LogoutButton;
