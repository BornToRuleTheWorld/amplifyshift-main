import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import { doctor_thumb_01, doctor_thumb_02, doctor_thumb_03, doctor_thumb_05, doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, logo } from "../../imagepath.jsx";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../config.js";
import { convertToUS } from "../utils.js";
import { FaEye } from "react-icons/fa";

const RequestListPageOld = (props) => {
    
    const Group = atob(localStorage.getItem('group')) || "";
    const LoginID = atob(localStorage.getItem('RecordID')) || "";
    
    const [requestList, setRequestList] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchJobRequestList = async () => {
      
      if (Group === "Facility"){
        var url = `${API_BASE_URL}/job_request/GetJobRequest/?FacID=${LoginID}`
      }else{
        url = `${API_BASE_URL}/job_request/GetJobRequest/?ProfID=${LoginID}`
      }
      
      try {
        const response = await axios.get(url,{
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
              },
        });
        setRequestList(response.data.data);
      } catch (err) {
          setError(err.response?.data?.Result || "An error occurred");
      }
    };

    const setJobID = async (id,prof_id) =>{
        localStorage.setItem("requestID",btoa(id))
        localStorage.setItem("requestProfID",btoa(prof_id))
        navigate('/facility-message')
    }

    useEffect(() => {
      console.log("fetchJobRequestList")
        fetchJobRequestList();
    },[Group]);

console.log("requestList",requestList)
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
                      Job Requests
                    </li>
                    <li className="breadcrumb-item active">Job Request</li>
                  </ol>
                  <h2 className="breadcrumb-title">Job Request</h2>
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

      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            {/* Invoices */}
            <div className="col-lg-12 col-xl-12">
              <div className="dashboard-header">
                <h3>Job Requests</h3>
              </div>
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
              <div className="custom-table">
                <div className="table-responsive">
                  <table className="table table-center mb-0">
                    <thead>
                      <tr>
                        <th>Start Date</th>
                        <th>End Date</th>    
                        <th>Discipline</th>
                        <th>Speciality</th>
                        <th>Job Type</th>
                        <th>Visit Type</th>
                        <th>Status</th>
                        <th>Created On</th>
                        <th>Created By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        requestList.length === 0 ? (
                            <tr><td colSpan="10">No jobRequest found</td></tr>
                        ) : (
                            requestList.map((jobs) => (
                            <tr key={jobs.id}>
                                <td>{convertToUS(jobs.start_date,"Date")}</td>
                                <td>{convertToUS(jobs.end_date,"Date")}</td>
                                <td>{disciplineOptions.map(disp => {
                                  if (disp.value === jobs.discipline) {
                                    return <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{disp.label}</span>;
                                  }
                                return null;
                                })}</td>
                                <td>{jobs.speciality}</td>
                                <td>{jobs.job_type}</td>
                                <td>{jobs.visit_type}</td>
                                <td>{jobs.status}</td>
                                <td>{convertToUS(jobs.created_on,"DateTime")}</td>
                                <td>{jobs.created_by}</td>
                                <td>
                                <FaEye style={{color:"blue", padding:"8px", fontSize:"20px"}} onClick={() => setJobID(jobs.id,jobs.professional_id)}/>
                                </td>
                            </tr>
                            ))
                        )
                      }
                    </tbody>
                    {/* <tbody>
                      <tr>
                        <td><Link to="#" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#invoice_view">#Inv-2021</Link></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link
                              to="/patient/doctor-profile"
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={doctor_thumb_02}
                                alt="User Image"
                              />
                            </Link>
                            <Link to="/patient/doctor-profile">Edalin Hendry</Link>
                          </h2>
                        </td>
                        <td>24 Mar 2025</td>
                        <td>21 Mar 2025</td>
                        <td>$300</td>
                        <td>
                          <div className="action-item">
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#invoice_view"
                            >
                              <i className="isax isax-link-2" />
                            </Link>
                            <Link to="#">
                              <i className="isax isax-printer5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><Link to="#" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#invoice_view">#Inv-2021</Link></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link
                              to="/patient/doctor-profile"
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={doctor_thumb_05}
                                alt="User Image"
                              />
                            </Link>
                            <Link to="/patient/doctor-profile">John Homes</Link>
                          </h2>
                        </td>
                        <td>17 Mar 2025</td>
                        <td>14 Mar 2025</td>
                        <td>$450</td>
                        <td>
                          <div className="action-item">
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#invoice_view"
                            >
                              <i className="isax isax-link-2" />
                            </Link>
                            <Link to="#">
                              <i className="isax isax-printer5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><Link to="#" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#invoice_view">#Inv-2021</Link></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link
                              to="/patient/doctor-profile"
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={doctor_thumb_03}
                                alt="User Image"
                              />
                            </Link>
                            <Link to="/patient/doctor-profile">Shanta Neill</Link>
                          </h2>
                        </td>
                        <td>11 Mar 2025</td>
                        <td>07 Mar 2025</td>
                        <td>$250</td>
                        <td>
                          <div className="action-item">
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#invoice_view"
                            >
                              <i className="isax isax-link-2" />
                            </Link>
                            <Link to="#">
                              <i className="isax isax-printer5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><Link to="#" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#invoice_view">#Inv-2023</Link></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link
                              to="/patient/doctor-profile"
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={doctor_thumb_08}
                                alt="User Image"
                              />
                            </Link>
                            <Link to="/patient/doctor-profile">Anthony Tran</Link>
                          </h2>
                        </td>
                        <td>26 Feb 2025</td>
                        <td>23 Feb 2025</td>
                        <td>$320</td>
                        <td>
                          <div className="action-item">
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#invoice_view"
                            >
                              <i className="isax isax-link-2" />
                            </Link>
                            <Link to="#">
                              <i className="isax isax-printer5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><Link to="#" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#invoice_view">#Inv-2021</Link></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link
                              to="/patient/doctor-profile"
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={doctor_thumb_01}
                                alt="User Image"
                              />
                            </Link>
                            <Link to="/patient/doctor-profile">Susan Lingo</Link>
                          </h2>
                        </td>
                        <td>18 Feb 2025</td>
                        <td>15 Feb 2025</td>
                        <td>$480</td>
                        <td>
                          <div className="action-item">
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#invoice_view"
                            >
                              <i className="isax isax-link-2" />
                            </Link>
                            <Link to="#">
                              <i className="isax isax-printer5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><Link to="#" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#invoice_view">#Inv-2023</Link></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link
                              to="/patient/doctor-profile"
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={doctor_thumb_09}
                                alt="User Image"
                              />
                            </Link>
                            <Link to="/patient/doctor-profile">Joseph Boyd</Link>
                          </h2>
                        </td>
                        <td>10 Feb 2025</td>
                        <td>07 Feb 2025</td>
                        <td>$260</td>
                        <td>
                          <div className="action-item">
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#invoice_view"
                            >
                              <i className="isax isax-link-2" />
                            </Link>
                            <Link to="#">
                              <i className="isax isax-printer5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><Link to="#" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#invoice_view">#Inv-2021</Link></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link
                              to="/patient/doctor-profile"
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={doctor_thumb_07}
                                alt="User Image"
                              />
                            </Link>
                            <Link to="/patient/doctor-profile">Juliet Gabriel</Link>
                          </h2>
                        </td>
                        <td>28 Jan 2025</td>
                        <td>25 Jan 2025</td>
                        <td>$350</td>
                        <td>
                          <div className="action-item">
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#invoice_view"
                            >
                              <i className="isax isax-link-2" />
                            </Link>
                            <Link to="#">
                              <i className="isax isax-printer5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </tbody> */}
                  </table>
                </div>
              </div>
              {/* Pagination */}
              <div className="pagination dashboard-pagination">
                <ul>
                  <li>
                    <Link to="#" className="page-link">
                      <i className="fa-solid fa-chevron-left" />
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="page-link">
                      1
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="page-link active">
                      2
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="page-link">
                      3
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="page-link">
                      4
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="page-link">
                      ...
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="page-link">
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </li>
                </ul>
              </div>
              {/* /Pagination */}
            </div>
            {/* /Invoices */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/*View Invoice */}
      <div className="modal fade custom-modals" id="invoice_view">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">View Invoice</h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="prescribe-download">
                <h5>21 Mar 2025</h5>
                <ul>
                  <li>
                    <Link to="#" className="print-link">
                      <i className="isax isax-printer5" />
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="btn btn-primary prime-btn">
                      Download
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="view-prescribe invoice-content">
                <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="invoice-logo">
                        <img src={logo} alt="logo" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className="invoice-details">
                        <strong>Invoice No : </strong> #INV005
                        <br />
                        <strong>Issued:</strong> 21 Mar 2025
                      </p>
                    </div>
                  </div>
                </div>
                {/* Invoice Item */}
                <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing From</h6>
                        <p className="invoice-details invoice-details-two">
                          Edalin Hendry <br />
                          806 Twin Willow Lane, <br />
                          Newyork, USA <br />
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing To</h6>
                        <p className="invoice-details invoice-details-two">
                          Richard Wilson <br />
                          299 Star Trek Drive
                          <br />
                          Florida, 32405, USA
                          <br />
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="invoice-info invoice-info2">
                        <h6 className="customer-text">Payment Method</h6>
                        <p className="invoice-details">
                          Debit Card <br />
                          XXXXXXXXXXXX-2541
                          <br />
                          HDFC Bank
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Item */}
                <div className="invoice-item invoice-table-wrap">
                  <div className="row">
                    <div className="col-md-12">
                      <h6>Invoice Details</h6>
                      <div className="table-responsive">
                        <table className="invoice-table table table-bordered">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Quatity</th>
                              <th>VAT</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>General Consultation</td>
                              <td>1</td>
                              <td>$0</td>
                              <td>$150</td>
                            </tr>
                            <tr>
                              <td>Video Call</td>
                              <td>1</td>
                              <td>$0</td>
                              <td>$100</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-md-6 col-xl-4 ms-auto">
                      <div className="table-responsive">
                        <table className="invoice-table-two table">
                          <tbody>
                            <tr>
                              <th>Subtotal:</th>
                              <td>
                                <span>$350</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Discount:</th>
                              <td>
                                <span>-10%</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Total Amount:</th>
                              <td>
                                <span>$315</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Information */}
                <div className="other-info mb-0">
                  <h4>Other information</h4>
                  <p className="text-muted mb-0">
                    An account of the present illness, which includes the
                    circumstances surrounding the onset of recent health changes and
                    the chronology of subsequent events that have led the patient to
                    seek medicine
                  </p>
                </div>
                {/* /Invoice Information */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /View Invoice */}
      <SiteFooter />

    </div>
  );
};

export default RequestListPageOld;
