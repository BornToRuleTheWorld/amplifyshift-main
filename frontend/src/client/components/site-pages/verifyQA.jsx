import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../config";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const QuestionForm = () => {
    const { encodedData } = useParams();
    const decodedData = atob(encodedData);
    const splitData = decodedData.split('--')
    const profID = splitData[0]
    const profRefID = splitData[1]

    const [questions, setQuestions] = useState([
        { question_text: "What was the applicant's title?", question:1, professional:profID, reference:profRefID, answer: '' },
        { question_text: "Date of Employment?",question:2, professional:profID, reference:profRefID,answer: '' },
        { question_text: "How well did the applicant relate to other on the job?", question:3, professional:profID, reference:profRefID, answer: '' },
        { question_text: "How would you evaluate the applicant's work quality and quantity (Productivity) ?",question:7, professional:profID, reference:profRefID, answer: '' },
        { question_text: "What was the applicant's reason for leaving ?", question:4, professional:profID, reference:profRefID, answer: '' },
        { question_text: "Would you recommend this applicant ?", question:5, professional:profID, reference:profRefID, answer: '' },
        { question_text: "Would you rehire this applicant ?", question:6, professional:profID, reference:profRefID, answer: '' },
    ]);

    const [updateRefStatus, setUpdateRefStatus] = useState(false)
    const [updateProfStatus, setUpdateProfStatus] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const handleInputChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].answer = event.target.value;
        setQuestions(newQuestions);
    };
    
    const handleDateChange = (index, date) => {
        const newQuestions = [...questions];
        newQuestions[index].answer = date;
        setQuestions(newQuestions);
    };

    const handleCancel = () => {
        setQuestions(prevQuestions => 
          prevQuestions.map(question => ({
            ...question, 
            answer: '' 
          }))
        );
      };

    
    const verifyQA = async(prof_id, ref_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/VerifyQA/?profID=${prof_id}&refID=${ref_id}`,{
                headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
                }
            });

            if (response.status === 200){
                setShowMessage(true);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const updateStatusRef = async (id) => {
        try {
            const refData = {
                status:"Answered",
                completed_on: new Date().toISOString()
            }
            await axios.put(`${API_BASE_URL}/professional/UpdateRefMail/${id}/`, refData, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
                }
            });
            setUpdateProfStatus(true);
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const updateStatusProf = async (id) => {
        try {
            const profData = {
                prof_verify_status:"Closed",
                prof_status:"Active"
            }
            await axios.put(`${API_BASE_URL}/professional/UpdateProfStatus/${id}/`, profData, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
                }
            });
        } catch (err) {
            console.error('Error:', err);
        }
    }


    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsLoading(true)
        const dateOfEmployment = questions.find(q => q.question === 2).answer;
        if (dateOfEmployment && !isValidDate(dateOfEmployment)) {
            setError("Please enter a valid date for 'Date of Employment'.");
            return;
        }

        const qaData = questions.map(({ question_text, ...rest }) => rest)

        try {
            const response = await axios.post(`${API_BASE_URL}/professional/CreateProfVerifyQA/`, qaData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
              }
            });

            if (response.status === 201){
                setUpdateRefStatus(true);
                handleCancel();
                setSuccess("Form submitted successfully");
            }   
          } catch (err) {
            console.error('Error:', err);
            setError(err.response.data.Result || 'An error occurred while submitting the form.');
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(updateRefStatus){
            updateStatusRef(profRefID)
        }
    },[updateRefStatus])


    useEffect(() => {
        if (updateProfStatus){
            updateStatusProf(profID)
        }
    },[updateProfStatus])


    useEffect(() => {
        verifyQA(profID, profRefID)
    },[profID, profRefID])


    return (
        <div className='App'>
            {!showMessage ? (
            <form onSubmit={handleFormSubmit} className="row p-4 w-50 h-50 mx-auto border mt-3 mb-3">
                <h2 className='text-center pt-2 pb-5 text-decoration-underline'>User Verification Form</h2>
                {error && <p className='text-danger text-center'>{error}</p>}
                {success && <p className='text-success text-center'>{success}</p>}
                {questions.map((item, index) => (
                    <div key={index} className="row pb-2">
                         <div className="col-12 form-label pb-2">
                            {index + 1}. {item.question_text}&nbsp;<span className='text-danger'>*</span>
                        </div>

                        {item.question_text === "Date of Employment?" ? (
                            <DatePicker
                                name="employment_date"
                                className='form-control datepicker'
                                selected={item.answer}
                                onChange={(date) => handleDateChange(index, date)}
                                placeholderText="MM/DD/YYYY"
                                dateFormat="MM/dd/yyyy"
                                required
                            />
                            
                        ) : (
                            <input
                                type="text"
                                value={item.answer}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Your answer here"
                                className='form-control pb-3'
                                required
                            />
                        )}
                       
                    </div>
                ))}
                <button type='submit' disabled={isLoading ? true : updateRefStatus ? true : false} className='btn btn-success p-2'>{isLoading ? "Submitting...." : "Submit"}</button>
            </form>
            ):(
                <fieldset style={{display:'block'}}>
              <div className="card booking-card w-75 mx-auto bg-body mt-5">
                <div className="card-body booking-body pb-1">
                    <div className="login-content-info h-75">
                        <div className="container ">
                            {/* Login Phone */}
                            <div className="row justify-content-center ">
                            <div className="col-lg-6 col-md-8">
                                <div className="account-content">
                                <div className="account-info">
                                    <div className="login-verify-img">
                                    <i className="isax isax-tick-circle" />
                                    </div>
                                    <div className="login-title">
                                    <h3>Success</h3>
                                    <h5>Answers already recorded.Thank you so much</h5>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </fieldset>
                // <div className="alert alert-success alert-dismissible fade show h-50 w-50 mx-auto mt-5 border" role="alert">
                //     <h2 className='text-center p-2'>Answers already recorded</h2>
                //     <h2 className='text-center p-3'>Thank you so much</h2>
                // </div>
            )}
            
        </div>
    );
}

export default QuestionForm;
