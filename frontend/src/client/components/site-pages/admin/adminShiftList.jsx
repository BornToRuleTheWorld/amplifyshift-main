import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions, specialtyOptions, visitType, jobTypeOptions, paginationDefaultCount, workSettingOptions } from "../config";
import { convertToUS } from "../utils";
import Pagination from '../pagination';
import { FaTimesCircle, FaEye, FaSearch, FaHourglassHalf, FaPlusCircle } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import { doctor_thumb_01, doctor_thumb_02, doctor_thumb_03, doctor_thumb_05, doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, logo } from "../../imagepath.jsx";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import AdminPagination from "./AdminPagination.jsx";
import {convertTo12HourFormat} from '../utils.js';

const AdminShiftList = (props) => {

  const [userData, setUserData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [fetchSlot, setFetchSlot] = useState(false);
  const [slotID, setSlotID] = useState({slot_ids: []});
  const [error, setError] = useState(null);
  const [sucMessage, setSucMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(paginationDefaultCount);
  //const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fetchShifts = async () => {
    const data = {
      CurrentPage:currentPage,
      RecordsPerPage:recordsPerPage
    }
    console.log('ipData', data);
    try {
      const response = await axios.post(`${API_BASE_URL}/contract/GetAllContractHours/`,data, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });
      console.log('response', response);

      if(response?.status === 200){
        if(response.data.CurrentPage)setCurrentPage(response.data.CurrentPage);
        if(response.data.RecordsPerPage)setRecordsPerPage(response.data.RecordsPerPage);
        if(response.data.TotalCount)setTotalPages(response.data.TotalCount);
        if(response.data.data.length > 0){
          setUserData(response.data.data);
          const extractedSlotIds = response.data.data ? response.data.data.map(slot => slot.slot) : [];
          setSlotID({ slot_ids: extractedSlotIds });
          setFetchSlot(true)
          setSucMessage('Shitfs list fetched successfully');
          setError(null);
        }
        else{
          setUserData([]);
          setSucMessage('Empty shift data');     
          setError(null); 
        }        
      }
    } catch (err) {
      console.log('responseError', err);
      setError("An error occurred while fetching facilities list");
      setSucMessage(null);
    }
  };

  useEffect(() => {
    fetchShifts(); 
  }, [currentPage]);

  useEffect(() => {
    if (fetchSlot) {
      axios
        .post(`${API_BASE_URL}/GetSlot/`, slotID, {
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
  }, [fetchSlot]);

  //console.log("totalPages",totalPages);
  //console.log("recordsPerPage",recordsPerPage);
  console.log("UserData",userData)
  
  return (
    <div>
      <SiteHeader {...props} />
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb-bar">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/home">
                        <i className="isax isax-home-15" />
                      </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link to="/site-user/dashboard">Admin</Link>
                    </li>
                    {/* <li className="breadcrumb-item active">Shifts</li> */}
                  </ol>
                  <h2 className="breadcrumb-title">Shifts</h2>
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
      <div style={{ margin: "10px" }}>
        <div className="search-header">
          <div className="search-field">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
            />
            <span className="search-icon">
              <i className="fa-solid fa-magnifying-glass" />
            </span>
          </div>

        </div>

        {sucMessage?(
                  <div className="alert alert-success alert-dismissible fade show" role="alert"                  
                  >
                    {sucMessage} <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
                  </div>
        ):''}

        {error?(
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error} <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
                  </div>
        ):''}

          <div className="table-responsive custom-table">
            <table className="table table-center mb-0 table-striped table-hover">
              <thead>
                    <tr className="bg-primary text-white">
                      <th className="bg-primary text-white">Date</th>
                      <th className="bg-primary text-white">Time</th>
                      <th className="bg-primary text-white">Status</th>
                    </tr>
              </thead>
              <tbody>

                {userData.length === 0 ? (
                  <tr><td colSpan="10" style={{ fontSize: "19px", padding: "15px",}}>Loading...</td></tr>
                ) : (
                userData.map((slotInfo) => {
                const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
                    if (slotDetails) {
                    return (
                        <tr key={slotInfo.id}>
                        <td>{slotInfo.date}</td>
                        <td>
                            {convertTo12HourFormat(slotDetails.start_hr)} - {convertTo12HourFormat(slotDetails.end_hr)}
                        </td>
                        <td>{slotInfo.status}</td>
                        </tr>
                    );
                    }
                    return null;
                })
                )}

              </tbody>
            </table>
          </div>
        </div>

      {recordsPerPage < totalPages ? <AdminPagination totalPages={totalPages} recordsPerPage={recordsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> : ''}
      

      <SiteFooter />

    </div>
  );
};

export default AdminShiftList;
