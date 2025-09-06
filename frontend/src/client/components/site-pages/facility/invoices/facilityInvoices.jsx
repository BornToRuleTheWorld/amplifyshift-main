import React, { useState, useEffect } from "react";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, stateOptions, cntryOptions} from "../../config.js";
import MessagePopup from "../../messagePopup.js";
import FacilitySidebar from "../facilitySidebar.jsx";
import { convertToUS } from "../../utils.js";
import moment from "moment";
import { doctor_thumb_01, doctor_thumb_02, doctor_thumb_03, doctor_thumb_05, doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, logo } from "../../../imagepath.jsx";

const FacilityInvoices = (props) => {

    const [show, setShow] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [contractOptions, setContractOptions] = useState([]);
    const [contractProfOptions, setContractProfOptions] = useState([]);
    const [srchContract, setSrchContract] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [professional, setProfessional] = useState(null);
    
    const handleYes = () => {
    setShow(false);
    setDeletePopup(true)
    }

    const handleNo = () => {
    setShow(false);
    setDeletePopup(false)
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentUserID = atob(localStorage.getItem('RecordID')) || "";
    const UserID = atob(localStorage.getItem('userID')) || "";
    const [formErrors, setFormErrors] = useState({});
    const [selectedInvoice, setSelectedInvoice] = useState(null)

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
    };

    {/* invoices List */}
    const fetchInvoices = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})

        const data = {
            facUserID : UserID,
            conID     : srchContract,
            profID    : professional,
            startDate : startDate ? moment(startDate).format("YYYY-MM-DD") : "",
            endDate   : endDate ? moment(endDate).format("YYYY-MM-DD") : ""
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/invoices/list`, data, {
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log("fetchInvoices",response.data)
            setInvoices(response.data.data);
            setContractOptions(response.data.con_options)
            setContractProfOptions(response.data.prof_options)
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteInvoice = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const removeInvoice = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/invoices/${id}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setInvoices(invoices.filter((license) => license.id !== id));
            setSuccess("Invoice deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting invoice");
        }finally{
            setDeletePopup(false)
        }
    }

    const handleSearchSubmit = async(e) => {
        e.preventDefault();
        await fetchInvoices();
    }

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeInvoice(deleteID);
        }
    }, [deletePopup]);
    
    return (
        <div>
            <SiteHeader />
            <>
                {/* Breadcrumb */}
                <div className="breadcrumb-bar">
                    <div className="container">
                        <div className="row align-items-center inner-banner">
                            <div className="col-md-12 col-12 text-center">
                                <nav aria-label="breadcrumb" className="page-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">
                                                <i className="isax isax-home-15" />
                                            </Link>
                                        </li>
                                        <li className="breadcrumb-item" aria-current="page">
                                            <Link to="/facility/dashboard">Facility</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            <Link to="/facility/myprofile">Profile</Link>
                                        </li>
                                    </ol>
                                    <h2 className="breadcrumb-title">Invoices</h2>
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


            <div className="content doctor-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 col-lg-4 col-xl-3 theiaStickySidebar">
                            <StickyBox offsetTop={20} offsetBottom={20}>
                                <FacilitySidebar />
                            </StickyBox>
                        </div>

                        <div className="col-lg-8 col-xl-9">
                                    <div className="card">
                                        <div className="card-body">
                                            {/* <div className="pb-3 mb-3">
                                                <h5>invoices</h5>
                                            </div> */}
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
                                           
                                                
                                                

                                            {/* Medical Records Tab */}
                                            <div className="">
                                                <form onSubmit={handleSearchSubmit}>
                                                    <div className="row mb-4 mt-1"> 
                                                        <div className="col-4">
                                                            <label className="form-label">Professional</label>
                                                            <Select
                                                            name="professional"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Professional"
                                                            value={professional ? contractProfOptions.find(status => status.value === professional) : null}
                                                            options={contractProfOptions}
                                                            onChange={(selected) => setProfessional(selected ? selected.value : null)}
                                                            isClearable={true}
                                                            />
                                                        </div>
                                                        <div className="col-4">
                                                            <label className="form-label">Start Date</label>
                                                            <div className="form-wrap">
                                                            <div className="form-icon">
                                                            <DatePicker
                                                            className="form-control datetimepicker"
                                                            name="start_date"
                                                            selected={startDate}
                                                            onChange={(date) => setStartDate(date)}
                                                            dateFormat="MM/dd/yyyy"
                                                            showDayMonthYearPicker
                                                            autoComplete='off'
                                                            placeholderText="Start Date"
                                                            />
                                                                <span className="icon">
                                                                <i className="fa-regular fa-calendar-days" />
                                                                </span>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4">
                                                            <label className="form-label">End Date</label>
                                                            <div className="form-wrap">
                                                            <div className="form-icon">
                                                            <DatePicker
                                                            className="form-control datetimepicker"
                                                            name="end_date"
                                                            selected={endDate}
                                                            onChange={(date) => setEndDate(date)}
                                                            dateFormat="MM/dd/yyyy"
                                                            showDayMonthYearPicker
                                                            autoComplete='off'
                                                            placeholderText="End Date"
                                                            />
                                                                <span className="icon">
                                                                <i className="fa-regular fa-calendar-days" />
                                                                </span>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4">
                                                            <label className="form-label">Contract</label>
                                                            <Select
                                                            name="contract"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Contract"
                                                            value={srchContract ? contractOptions.find(status => status.value === srchContract) : null}
                                                            options={contractOptions}
                                                            onChange={(selected) => setSrchContract(selected ? selected.value : null)}
                                                            isClearable={true}
                                                            />
                                                        </div>
                                                        <div className="col-3 p-1 mt-4">
                                                            <button className="btn btn-primary" type="submit">Submit</button>
                                                        </div>
                                                    </div>
                                                </form>
                                                <div className="custom-table">
                                                    <div className="table-responsive">
                                                        <table className="table table-center mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Invoice Date</th>
                                                                    <th>Invoice Number</th>
                                                                    <th>Contract Number</th>
                                                                    <th>Professional</th>
                                                                    <th>Hours</th>
                                                                    <th>Amount ($)</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                { invoices.length === 0 ?
                                                                    <tr><td colSpan={7}>No invoice data found for this facility</td></tr>
                                                                :
                                                                invoices.map((invoices) => (
                                                                    <tr key={invoices.id}>
                                                                        <td>{invoices.invoice_date ? convertToUS(invoices.invoice_date, 'Date') : ""}</td>
                                                                        <td><Link to="#" className="text-blue-600" onClick={() => handleViewInvoice(invoices)} data-bs-toggle="modal" data-bs-target="#invoice_view">{invoices.invoice_no}</Link></td>
                                                                        <td>{invoices.contract.contract_no}</td>
                                                                        <td>{invoices.professional.prof_first_name}</td>
                                                                        <td>{invoices.total_wrk_hrs} {invoices.total_wrk_hrs > 1 ? "hrs" : "hr"}</td>
                                                                        <td>$ {invoices.total_amount}</td>
                                                                        <td>
                                                                            <div className="action-item">
                                                                                <Link to="#" onClick={() => deleteInvoice(invoices.id)}>
                                                                                    <i className="isax isax-trash" />
                                                                                </Link>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* /Medical Records Tab */}

                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
            
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
                            <h5>{selectedInvoice?.invoice_date ? convertToUS(selectedInvoice?.invoice_date, "Date") : ""}</h5>
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
                                    <img src="/assets/img/amplify-shift-color.png" alt="logo" />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <p className="invoice-details">
                                    <strong>Invoice No : </strong> {selectedInvoice?.invoice_no}
                                    <br />
                                    <strong>Issued:</strong> {selectedInvoice?.invoice_date ? convertToUS(selectedInvoice?.invoice_date, "Date") : null}
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
                                      {selectedInvoice?.facility?.fac_first_name} {selectedInvoice?.facility?.fac_last_name} <br />
                                      {selectedInvoice?.facility?.fac_address} {selectedInvoice?.facility?.fac_address_2}, <br />
                                      {selectedInvoice?.facility?.fac_city}, {stateOptions.find(option => option.value === selectedInvoice?.facility?.fac_state)?.label || 'N/A'}, {cntryOptions.find(option => option.value === selectedInvoice?.facility?.fac_cntry)?.label || 'N/A'} <br />
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="invoice-info">
                                    <h6 className="customer-text">Billing To</h6>
                                    <p className="invoice-details invoice-details-two">
                                      {selectedInvoice?.professional?.prof_first_name} {selectedInvoice?.professional?.prof_last_name} <br />
                                      {selectedInvoice?.professional?.prof_address} {selectedInvoice?.professional?.prof_address_2}, <br />
                                      {selectedInvoice?.professional?.prof_city}, {stateOptions.find(option => option.value === selectedInvoice?.professional?.prof_state)?.label || 'N/A'}, {cntryOptions.find(option => option.value === selectedInvoice?.professional?.prof_cntry)?.label || 'N/A'} <br />
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
                                          <td>Shifts</td>
                                          <td>{selectedInvoice?.total_wrk_hrs}</td>
                                          <td>$0</td>
                                          <td>${selectedInvoice?.total_amount}</td>
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
                                            <span>${selectedInvoice?.total_amount}</span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Total Amount:</th>
                                          <td>
                                            <span>${selectedInvoice?.total_amount}</span>
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

            <MessagePopup title={"Invoices"} message={"Are you sure to delete the invoice"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default FacilityInvoices;
