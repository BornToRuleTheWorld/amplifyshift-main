import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../config";
import { convertToUS} from "../utils";
import { Link, useHistory } from "react-router-dom";

const ContractMessageList = ({ UserRole, FacID, ProfID, currentContractID, setError, setSuccess, MessageFrom, MessageTo, Type, Reload, setReload}) => {
    const [getMessage, setGetMessage] = useState([]);
    const [readMessageId, setReadMessageId] = useState([]);
    const history = useHistory();
    const group = atob(localStorage.getItem('group')) || "";
    const currentUser = atob(localStorage.getItem('userID')) || "";

    const fetchMessage = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/contract_message/GetContractMessages/?ContractID=${currentContractID}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            console.log(response.data);
            setGetMessage(response.data.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const getOpenMessages = async() =>{
        try {
            const response = await axios.get(`${API_BASE_URL}/contract_message/GetUpdateContractMessage/?ContractID=${currentContractID}&FromID=${MessageFrom}&Role=${UserRole}&Action=List`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            console.log(response.data);
            setReadMessageId(response.data.data);
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.Result || "An error occurred");
        }finally{
            setReload(false)
        }
    }

    const getNewMessages = async () =>{
        try {
            const response = await axios.get(`${API_BASE_URL}/contract_message/GetUpdateContractMessage/?ToID=${MessageTo}&Action=All`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            console.log("getCloseMessages",response.data);
            setGetMessage(response.data.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    }

    const updateMessage = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/contract_message/GetUpdateContractMessage/?MessageID=${id}&Action=Update`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            console.log(response.data);
            if (Type === "Single"){
                getOpenMessages();
            }
            console.log(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };


    useEffect(() => {
        if(Type === "Single"){
            fetchMessage();
            getOpenMessages();
        }else{
            getNewMessages();
        }
    }, []);

    useEffect(() => {
        if(Reload){
            fetchMessage();
            getOpenMessages();
        }
    },[Reload])


    const showMessages = (id) => {
        updateMessage(id)
    }

    const setContractID = async (id,prof_id) =>{
        localStorage.setItem("ContractID",btoa(id))
        localStorage.setItem("contractProfID",btoa(prof_id))
        history.push( group === "Facility" ? '/facility/contract-view' : "/professional/contract-view")
    }

    console.log("getMessage",getMessage)
    return (
        <div className="message">
            {
                getMessage.length === 0 ? (
                    Type === "All" ?
                    <div className="text-center">No notification received yet</div>
                    :
                    <div className="text-center">No message received yet</div>
                ) : (
                    getMessage.map((message, index) => {
                       console.log("getMessage length",getMessage.length)
                       console.log("index",index)
                       console.log("Username",getMessage[index].username)
                       let bgClass = 'bg-light';

                       if (Type !== "All"){
                            if (message.message_from == currentUser) {
                                bgClass = 'bg-success';
                            } else {
                                bgClass = 'bg-danger'; 
                            }
                       }
                       
            
                        return (
                            <div key={message.id} className={`mb-3 p-3 border border-secondary rounded-3 ${bgClass}`}>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary">
                                    <div style={{ width: "90%" }}>
                                        <strong>{message.username}</strong> on {convertToUS(message.created, "DateTime")}
                                    </div>
                                    { 
                                    Type !== "All" && message.message_from == currentUser ?

                                        <span className="text-white">{message.status === "Open" ? "Opened" : "Sent"}</span>
                                    
                                    :
                                    readMessageId.includes(message.id) ? null : (
                                        
                                        Type === "All" ?
                                            <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setContractID(message.contract, group === "Facility"? message.message_to : message.message_from)}
                                        >
                                            View
                                        </button>

                                        :
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => showMessages(message.id)}
                                        >
                                            Read
                                        </button>
                                        

                                        
                                    )}
                                </div>
                                {Type !== "All" && message.message_from == currentUser ?
                                    <div className="text-center p-3">{message.message}</div>
                                :
                                readMessageId.includes(message.id) && (
                                    <div className="text-center p-3">
                                        {message.message}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )
            }
        </div>
    );
    
}

export default ContractMessageList;
