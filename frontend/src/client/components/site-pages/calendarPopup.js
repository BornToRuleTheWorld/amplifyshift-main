import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { disciplineOptions } from './config';
import { convertToUS } from './utils';
import {Link, useHistory} from 'react-router-dom';

function CalendarPopup({title, close, show, cancel, type, recordID, contractHours, jobHours, requestedHours, viewCount, userType}) {
    
    let data = null;
    const history = useHistory();

    if (userType === "Facility"){
      if (type === "Contract"){
        data = contractHours
      }else if (type  === "Job Request"){
        data = requestedHours
      }else{
        data = jobHours
      }
    }else{
      (type === "Contract") ? data = contractHours : data = requestedHours;
    }
    
    console.log("Pop data", data)
    console.log("jobHours", jobHours)
    console.log("recordID",recordID)
    let viewData = {}
    if (userType === "Facility"){
      if (data){
        if (type === "Contract"){
          viewData = data.find(values => values.contract == recordID);
        }else{
          viewData = data.find(values => values.id == recordID);
        }
      }
    }else{
      viewData = data.find(values => values.id == recordID);
    }
    

    const handleView = () => {

      let viewID = ""
      let userID = ""
      if (userType === "Facility"){
        if(type === "Contract"){
          userID = viewData.professional.id
          viewID = recordID
        }else if (type === "Job Request"){
          viewID = viewData.job_request_data[0].id
          userID = viewData.job_request_data[0].professional_data.id
        }else{
          viewID = viewData.job_data.id
        }        
      }else {
        viewID = viewData.data.id
        userID = viewData.facility_data.id
      }


      if (type === "Contract"){
        
        if (userType === "Facility"){
          localStorage.setItem("ContractID", btoa(viewID))
          localStorage.setItem("contractProfID", btoa(userID))
          history.push("/facility/contract-view")
        }else{
          localStorage.setItem("ContractID", btoa(viewID))
          localStorage.setItem("contractFacID", btoa(userID))
          history.push("/professional/contract-view")
        }

      }else if (type === "Job Request"){

        if (userType === "Facility"){
          localStorage.setItem("requestID",btoa(viewID))
          localStorage.setItem("requestProfID",btoa(userID))
          history.push('/facility/job-request-view')
        }else{
          localStorage.setItem('requestID',btoa(viewID))
          localStorage.setItem('requestFacID',btoa(userID));
          history.push('/professional/job-request-view')
        }

      }else{
        localStorage.setItem("currentJobID",btoa(viewID))
        history.push("/facility/viewjob")
      }

    }
  
    console.log("viewData", viewData)

  return (
    <>
      <Modal show={show} onHide={close} dialogClassName="w-50" centered>
        <Modal.Header closeButton>
          <Modal.Title>{type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='row' key={viewData?.job_data?.id}>
              <Link to="#" onClick={handleView}>
                <h6 className='col-lg-12 text-center mb-3 text-decoration-underline'>{viewData?.job_data?.job_title}</h6>
              </Link>
                
                <div className='col-lg-12 mb-2 mx-auto border-bottom'>
                    <div className='row mb-1'>
                        <div className='col-lg-6 text-start font-weight-bold' style={{fontSize:"13px"}}>{viewData?.job_data?.start_date ? convertToUS(viewData?.job_data?.start_date, "Date") : null } - {viewData?.job_data?.end_date ? convertToUS(viewData?.job_data?.end_date, "Date") : null }</div>
                        { userType === "Facility" ?
                          (type === "Contract") ?
                            <div className='col-lg-6 text-end font-weight-bold' style={{fontSize:"13px"}}>{viewData?.contract_status}</div>
                          :
                          (type === "Job Request") ?
                            <div className='col-lg-6 text-end font-weight-bold' style={{fontSize:"13px"}}>{viewData?.job_request_data[0]?.status}</div>
                          :
                            <div className='col-lg-6 text-end font-weight-bold' style={{fontSize:"13px"}}>{viewData?.job_data.status}</div>
                        :
                          <div className='col-lg-6 text-end font-weight-bold' style={{fontSize:"13px"}}>{viewData?.data?.status}</div>
                        }
                    </div>
                </div>
                
                <div className='col-lg-12 mb-1 mt-1'>
                    <div className='row'>
                      { userType === "Facility" ?
                        (type === "Contract") ?
                          <div className='col-auto'>
                            <label className='form-label'>Professional:</label>&nbsp;
                            <span style={{fontSize:"13px"}}>{viewData?.professional?.prof_first_name || viewData?.professional_data?.prof_first_name} {viewData?.professional?.prof_last_name || viewData?.professional_data?.prof_last_name}</span>
                          </div>
                        :
                          <div className='col-auto'>
                            <label className='form-label'>Facility:</label>&nbsp;
                            <span style={{fontSize:"13px"}}>{viewData?.facility_data?.fac_first_name} {viewData?.facility_data?.fac_last_name}</span>
                          </div>
                        :
                        <div className='col-auto'>
                          <label className='form-label'>Facility :</label>&nbsp;
                          <span style={{fontSize:"13px"}}>{viewData?.facility_data?.fac_first_name} {viewData?.facility_data?.fac_last_name}</span>
                        </div>
                      }
                        <div className='col-auto'>
                            <label className='form-label'>Discipline :</label>&nbsp;
                            <span style={{fontSize:"13px"}}>{viewData?.job_data?.discipline ? disciplineOptions.find(option => option.value === viewData?.job_data?.discipline).label : null}</span>
                        </div>
                        <div className='col-auto'>
                            <label className='form-label'>Zipcode :</label>&nbsp;
                            <span style={{fontSize:"13px"}}>{viewData?.job_data?.zipcode}</span>
                        </div>
                        <div className='col-auto'>
                            <label className='form-label'>Pay :</label>&nbsp;
                            <span style={{fontSize:"13px"}}>$ {viewData?.job_data?.pay}</span>
                        </div>
                        <div className='col-auto'>
                            <label className='form-label'>Total Hours :</label>&nbsp;
                            <span style={{fontSize:"13px"}}>{viewCount}</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={cancel}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CalendarPopup;