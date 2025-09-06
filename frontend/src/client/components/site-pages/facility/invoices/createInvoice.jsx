import React, {useState, useEffect} from "react";
import { Link, useHistory,NavLink } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
import {AUTH_TOKEN, API_BASE_URL } from '../../config.js'; 
import axios from "axios";
import { FaPen, FaPlusSquare, FaMinusCircle, FaPlusCircle} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { convertTo12HourFormat } from "../../utils.js";

const CreateInvoice = (props) => {
  
  const history = useHistory()
  const currentUserID = atob(localStorage.getItem('userID')) || ""
  const facID = atob(localStorage.getItem('RecordID')) || ""
  const conID = atob(localStorage.getItem('InvConID')) || ""
  const profID = atob(localStorage.getItem('InvProfID')) || ""
  const endDate = atob(localStorage.getItem('InvEndDate')) || ""
  const startDate = atob(localStorage.getItem('InvStartDate')) || ""
  
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profName, setProfName] = useState(null);
  const [conNo, setConNo] = useState(null);
  const [conSlotData, setConSlotData] = useState([])
  const [slotData, setSlotData] = useState([])

  const [formData, setFormData] = useState({
    contract: conID,
    invoice_no: "",
    invoice_date: new Date(),
    start_date: startDate ? new Date(startDate) : "",
    end_date: endDate ? new Date(endDate) : "",
    total_wrk_hrs: 0,
    total_amount: 0,
    professional: profID,
    facility: facID,
    status: "Active",
    created_by: currentUserID
  });

  const getContract = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contract/GetContract/?ContractID=${id}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        }
      });

      if (response.status === 200){
        console.log("getContract",response.data)
        setConNo(response.data.data[0].contract_no)
        setProfName(response.data.data[0].professional_name)
      }
      
    } catch (err) {
      console.log("Error for contract", err)
    }
  }

  const getSlots = async() => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetSlots/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        }
      });

      if (response.status === 200){
        setSlotData(response.data.data);
      }
      
    } catch (err) {
      console.log("Error for getSlots", err)
    }     
  }

  const getContractHrs = async (id) => {

    const data = {
      ConID: conID,
      ProfID : id,
      StartDate : startDate ? moment(startDate).format("YYYY-MM-DD") : null,
      EndDate : endDate ? moment(endDate).format("YYYY-MM-DD") : null,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/contract/GetInvoiceCreateHrs/`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        }
      });

      if (response.status === 200 && Array.isArray(response.data.data)) {
        console.log("getContractHrs", response.data.data)
        const conData = response.data.data.slice(0, -1)
        console.log("conData",conData)
        setConSlotData(conData)
        const lastItem = response.data.data.pop();
        if (lastItem) {
          setFormData((prev) => ({
            ...prev,
            total_amount: lastItem.total_amount,
            total_wrk_hrs: lastItem.total_hours
          }));
        }
      }
      
    } catch (err) {
      console.log("Error for contract", err)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setFormErrors({})
    setError(null);
    setSuccess(null);
    const formValidate = await validiteFormInputs(formData)
    if (Object.keys(formValidate).length === 0) {
      setIsLoading(true)
      const updatedData = {...formData,start_date:moment(formData.start_date).format('YYYY-MM-DD'),end_date:moment(formData.end_date).format('YYYY-MM-DD'), invoice_date:moment(formData.invoice_date).format('YYYY-MM-DD')}
      try {
        const response = await axios.post(`${API_BASE_URL}/invoices`, updatedData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        });

        if (response.status === 201){
          setSuccess("Invoice created successfully")
          localStorage.removeItem("InvConID")
          localStorage.removeItem('InvEndDate')
          localStorage.removeItem('InvStartDate')
          history.push("/facility/invoices")
        }
      
      } catch (err) {
        console.log("Error for create invoice", err)
      }finally{
        setIsLoading(false)
      }
    }else{
      setFormErrors(formValidate)
      return false;
    }
  };

  const validiteFormInputs = async (data) => {
    setFormErrors({});
    let errorObj = {};

    if (data.start_date == '' || data.end_date === null) {
      errorObj.start_date = "Start date is required";
    }

    if (data.end_date == '' || data.end_date === null) {
      errorObj.end_date = "End date is required";
    }

    if(profName == "" || profName === null){
      errorObj.professional = "Professional is required";
    }

    if (conNo == "" || conNo === null) {
      errorObj.contract_no = "Contract no is required";
    }

    if (data.invoice_date == '') {
      errorObj.invoice_date = "Invoice date is required";
    }

    if (data.invoice_no == '') {
      errorObj.invoice_no = "Invoice no is required";
    }

    if (data.total_amount == '') {
      errorObj.total_amount = "Total amount is required";
    }

    if (data.total_wrk_hrs == '') {
      errorObj.total_wrk_hrs = "Total hours is required";
    }

    console.log('errorValidateLocalObject', errorObj)      
    return errorObj
  }


  useEffect(()=> {

    if (conID){
      getContract(conID)
    }

    if(profID){
      getContractHrs(profID)
    }
    
  }, [conID, profID])


  useEffect(() => {
    
    const randomInvoiceNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    setFormData((prev) => ({
      ...prev,
      invoice_no: randomInvoiceNo
    }));
    
    getSlots();

  }, []);
  
  console.log("formData",formData)
  console.log(startDate)
  console.log(endDate)
  console.log("conID", conID)
  console.log("ConNo", conNo)
  console.log("profName", profName)
  console.log("getSlots", slotData)
  console.log("conSlotData", conSlotData)

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
                      <Link to="/home">
                        <i className="isax isax-home-15" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link to="/facility/dashboard">Facility</Link>
                    </li>
                    <li className="breadcrumb-item active">                      
                      <Link to="/facility/myprofile">Invoices</Link> 
                    </li>
                  </ol>
                  <h2 className="breadcrumb-title">Create Invoice</h2>
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


      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-xl-12">
                <>
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="setting-title">
                          <h6>Invoice</h6>
                        </div>
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
                        <div className="setting-card">
                          <div className="row">
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Invoice No</label>&nbsp;<span className="text-danger">*</span>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={formData?.invoice_no}
                                  onChange={(e) => setFormData({ ...formData, invoice_no: e.target.value })} 
                                />
                                {formErrors.invoice_no && <div className="form-label text-danger m-1">{formErrors.invoice_no}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Invoice Date <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                <DatePicker
                                className="form-control datetimepicker"
                                name="start_date"
                                minDate={new Date()}
                                selected={formData.invoice_date}
                                onChange={(date) => setFormData({...formData, invoice_date: date})}
                                dateFormat="MM/dd/yyyy"
                                showDayMonthYearPicker
                                autoComplete='off'
                                />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                                {formErrors.start_date && <div className="form-label text-danger m-1">{formErrors.start_date}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Contract No</label>&nbsp;<span className="text-danger">*</span>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={conNo}
                                  onChange={(e) => setConNo(e.target.value)} 
                                />
                                {formErrors.contract_no && <div className="form-label text-danger m-1">{formErrors.contract_no}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Professional</label>&nbsp;<span className="text-danger">*</span>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={profName}
                                  onChange={(e) => setProfName(e.target.value)} 
                                />
                                {formErrors.professional && <div className="form-label text-danger m-1">{formErrors.professional}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Start Date <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                <DatePicker
                                className="form-control datetimepicker"
                                name="start_date"
                                minDate={new Date()}
                                selected={formData.start_date}
                                onChange={(date) => setFormData({...formData, start_date: date})}
                                dateFormat="MM/dd/yyyy"
                                showDayMonthYearPicker
                                autoComplete='off'
                                />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                                {formErrors.start_date && <div className="form-label text-danger m-1">{formErrors.start_date}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  End Date <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                <DatePicker
                                className="form-control datetimepicker"
                                minDate={new Date()}
                                name="end_date"
                                selected={formData.end_date}
                                onChange={(date) => setFormData({...formData, end_date: date})}
                                dateFormat="MM/dd/yyyy"
                                showDayMonthYearPicker
                                autoComplete='off'
                              />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                                {formErrors.end_date && <div className="form-label text-danger m-1">{formErrors.end_date}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Total Hours</label>&nbsp;<span className="text-danger">*</span>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={formData.total_wrk_hrs}
                                  onChange={(e) => setFormData({ ...formData, total_wrk_hrs: e.target.value })} 
                                />
                                {formErrors.total_wrk_hrs && <div className="form-label text-danger m-1">{formErrors.total_wrk_hrs}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Total Amount</label>&nbsp;<span className="text-danger">*</span>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={formData.total_amount}
                                  onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })} 
                                />
                                {formErrors.total_amount && <div className="form-label text-danger m-1">{formErrors.total_amount}</div>}
                              </div>
                            </div>
                            <div className="row mt-1">
                            <div className="col text-end">
                              <button
                                type="submit"
                                className="btn btn-md btn-primary-gradient rounded-pill d-inline-flex align-items-center justify-content-center px-4"
                                disabled={isLoading}
                                style={{ minWidth: isLoading ? '160px' : 'auto' }} // ensures consistent width during loading
                              >
                                {isLoading ? (
                                  <>
                                    <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                                      <span className="visually-hidden">Submitting...</span>
                                    </div>
                                    <span className="text-light">Submitting...</span>
                                  </>
                                ) : (
                                  "Submit"
                                )}
                              </button>
                            </div>
                          </div>

                          </div>
                        </div>
                        
                        <div className="table-responsive border rounded">
                          <table className="table table-center mb-0 table-striped table-hover">
                            <thead className="bg-primary text-white">
                                <tr className="bg-primary text-white">
                                    <th className="bg-primary text-white">Date</th>
                                    <th className="bg-primary text-white">Time</th>
                                    <th className="bg-primary text-white">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                              conSlotData.length === 0 ? (
                                <tr>
                                  <td colSpan="15">
                                      <div className="col-lg-12">
                                      <div className="card doctor-list-card">
                                          <div className="d-md-flex align-items-center">
                                          <div className="card-body p-0">
                                              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                              <Link to="#" className="text-teal fw-medium fs-14">
                                                  No billable shifts data available
                                              </Link>
                                              </div>
                                          </div>
                                          </div>
                                      </div>
                                      </div>
                                  </td>
                                </tr>
                            ) : (
                            conSlotData.map((slotInfo) => {
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
                              }))}
                            </tbody>
                          </table>
                        </div>
                        
                      </form>
                    </div>
                  </div>
                </>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter/>
    </div>
  );
};

export default CreateInvoice;
