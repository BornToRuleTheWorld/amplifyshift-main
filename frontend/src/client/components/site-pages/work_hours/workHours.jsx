import React, { useState, useEffect } from "react";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL} from '../config';
import {convertTo12HourFormat,convertToUS} from "../utils";
import { Link } from "react-router-dom";
import { faRandom } from "@fortawesome/free-solid-svg-icons";

function WorkHours({ID, Role, View}) {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [facData, setFacData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [fetchSlot, setFetchSlot] = useState(false);
  const [slotID, setSlotID] = useState({slot_ids: []});
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('date');

  var getUrl = ""
  var searchUrl = ""

  if (Role === "Job"){
    getUrl    = `${API_BASE_URL}/jobs/GetJobWorkHours/?JobID=${ID}&Type=All`
    searchUrl = `${API_BASE_URL}/jobs/searchWorkHours/`
  }else if (Role === "Professional"){
    getUrl = `${API_BASE_URL}/contract/GetUserContractHours/?ProfID=${ID}`
  }else if (Role === "Facility"){
    getUrl = `${API_BASE_URL}/contract/GetUserContractHours/?FacID=${ID}`
  }else if (Role === "ProfessionalSlots"){
      getUrl = `${API_BASE_URL}/professional/GetProfSlot/?ProfUserID=${ID}`
  }else{
    getUrl    = `${API_BASE_URL}/contract/GetContractHours/?ConID=${ID}`
    searchUrl = `${API_BASE_URL}/jobs/searchContractHours/`
  }

  const fetch_slots = () => {
    axios.get(`${API_BASE_URL}/GetSlots/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      }
    })
    .then((response) => {
      setSlotData(response.data.data);
    })
    .catch((err) => {
      console.error('Error fetching slot data:', err);
      setError(err.response.data.Result)
    });
  }

  const fetch_data = () => {
    axios.get( getUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      }
    })
    .then((response) => {
      setFacData(response.data.data);
    })
    .catch((err) => {
      console.error('Error fetching facility data:', err);
      setError(err.response.data.Result)
    });
  }

  useEffect(()=>{
    fetch_data()
    fetch_slots()
  }, [ID, AUTH_TOKEN])

  //Sorting
  const handleSort = (field) => {
    let newSortOrder = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortOrder(newSortOrder);
    setSortField(field);
    const sortedData = [...facData];

    sortedData.sort((a, b) => {
      if (field === 'status') {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();
        if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
      } 
      else if (field === 'time') {
        const slotA = slotData.find(slot => slot.id === a.slot);
        const slotB = slotData.find(slot => slot.id === b.slot);
  
        if (slotA && slotB) {
          const startA = convertTo24HourFormat(slotA.start_hr);
          const startB = convertTo24HourFormat(slotB.start_hr);
  
          return newSortOrder === 'asc' ? startA - startB : startB - startA;
        }
        return 0;
      } 
      else if (field === 'date') {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  
    setFacData(sortedData);
  };
  
  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  console.log("work hours facData", facData)

  return (
    <div className="row">                      
            
            <div className="tab-content appointment-tab-content">
            <div
                className="tab-pane fade show active"
                id="pills-upcoming"
                role="tabpanel"
                aria-labelledby="pills-upcoming-tab"
            >
          {
            (View === "AdminStyle") 
            
            ?
          
            <div className="table-responsive border rounded">
              <table className="table table-center mb-0 table-striped table-hover">
                <thead className="bg-primary text-white">
                    <tr className="bg-primary text-white">
                        <th onClick={() => handleSort('date')} style={{ cursor: "pointer" }} className="bg-primary text-white">Date {sortOrder === 'asc' ? '↑' : '↓'}</th>
                        <th onClick={() => handleSort('time')} style={{ cursor: "pointer" }} className="bg-primary text-white">Time {sortOrder === 'asc' ? '↑' : '↓'}</th>
                        <th onClick={() => handleSort('status')} style={{ cursor: "pointer" }} className="bg-primary text-white">Status {sortOrder === 'asc' ? '↑' : '↓'}</th>
                    </tr>
                </thead>
                <tbody>
                {
                  facData.length === 0 ? (
                      <tr>
                        <td colSpan="10">
                        {(Role === "ProfessionalSlots") ? "No shifts found" : "No work hours found"}
                        </td>
                      </tr>
                ) : (
                facData.map((slotInfo) => {
                  const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
                    if (slotDetails) {
                      return (
                        <tr key={slotInfo?.id ?? Math.random().toString()}>
                          <td>{slotInfo.date}</td>
                          {slotInfo?.type && slotInfo?.type === "Hour_slots" 
                          ?
                            slotInfo?.hours ?
                              <td>{slotInfo.hours} {slotInfo.hours > 1 ? "hrs" : "hr"}</td>
                            :
                              <td>1 hr</td>
                          :
                            <td>
                            {convertTo12HourFormat(slotDetails.start_hr)} - {convertTo12HourFormat(slotDetails.end_hr)}
                          </td>
                          }
                          <td>{slotInfo.status}</td>
                        </tr>
                      );
                    }else{
                      return (
                        <tr key={slotInfo?.id ?? Math.random().toString()}>
                          <td>{slotInfo.date}</td>
                          <td>{slotInfo.hours} {slotInfo.hours > 1 ? "hrs" : "hr"}</td>
                          <td>{slotInfo.status}</td>
                        </tr>
                      );
                    }
                  }))}
                </tbody>
              </table>
            </div>
            
            :
            
                facData.length === 0 ? (
                    <tr><td colSpan="10">No work hours found</td></tr>
                ) : (
                  [...facData].sort((a, b) => new Date(a.date) - new Date(b.date)).map((slotInfo) => {
                    const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
                    if (slotDetails) {
                        return (
                        <div className="appointment-wrap" key={slotInfo.id}>
                            <ul>
                                <li>
                                    <div className="patinet-information">
                                        <div className="patient-info">
                                            <p>Date</p>
                                            <h6>
                                                <i className="fa-solid fa-clock" />&nbsp;<Link to="#">{convertToUS(slotInfo.date,"Date")}</Link>
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="patinet-information px-1">
                                        <div className="patient-info">
                                            <p>Time</p>
                                            {slotInfo?.type && slotInfo?.type === "Hour_slots"
                                            ?
                                              slotInfo?.hours ?
                                                <h6>{slotInfo.hours} {slotInfo.hours > 1 ? "hrs" : "hr"}</h6>
                                              :
                                                <h6>1 hr</h6>
                                            :
                                            <h6>
                                                <Link to="#" style={{fontSize:"20px"}}>{convertTo12HourFormat(slotDetails.start_hr)} - {convertTo12HourFormat(slotDetails.end_hr)}</Link>
                                            </h6>
                                            }
                                        </div>
                                    </div>
                                </li>
                                <li>
                                <div className="patinet-information">
                                    <div className="patient-info">
                                        <p>Status</p>
                                        <h3>
                                          <span className='text-success'>{slotInfo?.status}{" "}</span>
                                        </h3>
                                    </div>
                                </div>
                                {/* <div className="bottom-book-btn">
                                <p>Status</p>
                                <span className='text-success px-4' style={{fontWeight:"bolder",fontSize:"19px"}}>
                                  {slotInfo?.status}{" "}
                                </span> */}
                                  {/* <span className="btn btn-block w-100 btn-outline-success active">
                                    <i className="fa-solid fa-circle" />&nbsp;
                                    {slotInfo.status}{" "}
                                  </span> */}
                                {/* </div> */}
                                </li>
                            </ul>
                        </div>
                )}else{
                  return (
                        <div className="appointment-wrap" key={slotInfo?.id ?? Math.random().toString()}>
                            <ul>
                                <li>
                                    <div className="patinet-information">
                                        <div className="patient-info">
                                            <p>Date</p>
                                            <h6>
                                                <i className="fa-solid fa-clock" />&nbsp;<Link to="#">{convertToUS(slotInfo.date,"Date")}</Link>
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="patinet-information px-1">
                                        <div className="patient-info">
                                            <p>Time</p>
                                            <h6>{slotInfo.hours} {slotInfo.hours > 1 ? "hrs" : "hr"}</h6>  
                                        </div>
                                    </div>
                                </li>
                                <li>
                                <div className="patinet-information">
                                    <div className="patient-info">
                                        <p>Status</p>
                                        <h3>
                                          <span className='text-success'>{slotInfo?.status}{" "}</span>
                                        </h3>
                                    </div>
                                </div>
                                </li>
                            </ul>
                        </div>
                )

                }
              
              
              }))
            }
            </div>
        </div>
    </div>
  );
}

export default WorkHours;
