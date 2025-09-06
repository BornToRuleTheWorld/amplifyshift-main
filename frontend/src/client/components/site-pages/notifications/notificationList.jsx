import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { convertToUS } from '../utils';
import { useHistory } from 'react-router-dom';
import { API_BASE_URL, AUTH_TOKEN } from "../config";

const NotificationList = ({ MessageTo, setError, setSuccess, Type }) => {
    const [getMessage, setGetMessage] = useState([]);
    const [getRequestMessage, setGetRequestMessage] = useState([]);
    const [getContractMessage, setGetContractMessage] = useState([]);
    const history = useHistory();
    const group = atob(localStorage.getItem('group')) || "";

    const getNewRequestMessages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/message/GetUpdateMessage/?ToID=${MessageTo}&Action=All`, {
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
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const getNewContractMessages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/contract_message/GetUpdateContractMessage/?ToID=${MessageTo}&Action=All`, {
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
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    useEffect(() => {
        getNewRequestMessages();
        getNewContractMessages();
    }, []);

    useEffect(() => {
        setGetMessage([...getRequestMessage, ...getContractMessage]);
    }, [getRequestMessage, getContractMessage]);

    const handleRedirect = async (id, to_id, role) => {
        let redirect = ""
        
        if (role === "Request"){
            localStorage.setItem("requestID", btoa(id));
            if (group === "Facility"){
                localStorage.setItem("requestProfID", btoa(to_id));
                redirect = '/facility/job-request-view';
            }else{
                localStorage.setItem("requestFacID", btoa(to_id));
                redirect = '/professional/job-request-view';
            }
        }else{
            localStorage.setItem("ContractID", btoa(id));
            if (group === "Facility"){
                localStorage.setItem("contractProfID", btoa(to_id));
                redirect = '/facility/contract-view';
            }else{
                localStorage.setItem("contractFacID", btoa(to_id));
                redirect = '/professional/contract-view';
            }
        }
        
        
        history.push(redirect);
    };

    return (
        <div className="message">
            {getMessage.length === 0 ? (
                <div className="text-center">No notification received yet</div>
            ) : (
                getMessage.map((message) => (
                    <div key={message.id} className="mb-3 p-3 border border-secondary rounded-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary">
                            <div style={{ width: "90%" }}>
                                <strong>{message.username}</strong> on {convertToUS(message.created, "DateTime")}
                            </div>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                    handleRedirect( message.role === "Request" ? message.job_request : message.contract, message.message_to_id, message.role)
                                }
                            >
                                View
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationList;
