import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL,AUTH_TOKEN } from "../config.js";
import ContractMessageList from "./contractMessageList.jsx";

const ContractMessage = ({message_from, message_to, currentContractID, FacID, ProfID, UserRole}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [reloadMsg, setReloadMsg] = useState(false)

    const [messageData, setMessageData] = useState({
        contract:currentContractID,
        message_from:message_from,
        message_to:message_to,
        message:"",
        status:"New",
        created_by:message_from,
        role:UserRole
    })

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try{
            await axios({
                url: `${API_BASE_URL}/contract_message/CreateContractMessage/`,
                method: "POST",
                data: messageData,
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                }
            });
            setSuccess("Message sent successfully")
            setMessageData((prev)=>({
                ...prev,
                message:""
            }))
            setReloadMsg(true)
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.Result || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    console.log("message data", messageData)
    return(
        <div className="container">
            <div className="row justify-content-center p-3">
                <h3 className="mb-4 mt-2">Message Box (Max character 1500)</h3>
                <div className="col-12 col-md-10">    
                    {/* Error and Success Message */}
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
                    
                    {/* Message Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12 col-md-10">
                                <input
                                    type="text"
                                    name="message"
                                    className="form-control p-3"
                                    value={messageData.message}
                                    onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                                    required
                                    placeholder="Type your message"
                                />
                            </div>
                            <div className="col-12 col-md-2 d-flex justify-content-center align-items-center">
                                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Message List Section */}
                    <div className="mt-4">
                        <div className="comment-box p-3 border border-1 rounded-3" style={{borderColor: '#dddddd'}}>
                            <ContractMessageList 
                                UserRole={UserRole} 
                                FacID={FacID} 
                                ProfID={ProfID} 
                                setError={setError} 
                                setSuccess={setSuccess} 
                                currentContractID={currentContractID} 
                                MessageFrom={message_from} 
                                Type={"Single"} 
                                MessageTo={message_to}
                                Reload = {reloadMsg}
                                setReload = {setReloadMsg}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ContractMessage;