import React, { useState, useEffect } from "react";
import Header from "../../header";
import Footer from "../../footer";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SiteFooter from "../home/footer.jsx";
import SiteHeader from "../home/header.jsx";
import DashboardSidebar from "../../patients/dashboard/sidebar/sidebar.jsx";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import { FaPen, FaPlusSquare, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { AUTH_TOKEN, API_BASE_URL, fetchModules, workExperienceOptions, disciplineOptions, specialtyOptions, yearOptions, docOptions, langOptions, weeklyOptions, stateOptions, cntryOptions } from '../config';
import axios from "axios";

const FacilityProfessioanlProfile = (props) => {

  //const email = atob(localStorage.getItem('email'));
  const email = atob(localStorage.getItem('searchProfEmail'));
  const [profData, setProfData] = useState(null);
  const [profId, setProfId] = useState();
  const [licenses, setLicenses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [education, setEducation] = useState([]);
  const [reference, setReference] = useState([]);
  const [contact, setContact] = useState([]);

  //sorting
  const [sortEducationOrder, setSortEducationOrder] = useState('asc');
  const [sortEducationField, setSortEducationField] = useState('name');

  const [sortLicenseOrder, setSortLicenseOrder] = useState('asc');
  const [sortLicenseField, setSortLicenseField] = useState('license_name');

  const [sortContactOrder, setSortContactOrder] = useState('asc');
  const [sortContactField, setSortContactField] = useState('name');

  const [sortRefOrder, setSortRefOrder] = useState('asc');
  const [sortRefField, setSortRefField] = useState('name');
  
  const [sortCertOrder, setSortCertOrder] = useState('asc');
  const [sortCertField, setSortCertField] = useState('certificate_name');

  const fetchLicenses = async () => {
    try {

      const licenceResponse = await axios.get(`${API_BASE_URL}/professional/licenses/?ProfID=${profId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });

      console.log('aspFertchLicence', licenceResponse);

      setLicenses(licenceResponse.data);
    } catch (err) {
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchCertificates = async () => {
    try {
      const certificateResponse = await axios.get(`${API_BASE_URL}/professional/certifications/?ProfID=${profId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });

      console.log('aspFertchCertificate', certificateResponse);

      setCertificates(certificateResponse.data);
    } catch (err) {
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchEducation = async () => {
    try {
      const EducationResponse = await axios.get(`${API_BASE_URL}/professional/education/?ProfID=${profId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });
      setEducation(EducationResponse.data);
    } catch (err) {
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchReference = async () => {
    try {
      const ReferenceResponse = await axios.get(`${API_BASE_URL}/professional/references/?ProfID=${profId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });
      setReference(ReferenceResponse.data);
    } catch (err) {
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchContact = async () => {
    try {
      const ContactResponse = await axios.get(`${API_BASE_URL}/professional/contact/?ProfID=${profId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });
      setContact(ContactResponse.data);
    } catch (err) {
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/professional/getProf/?ProfEmail=${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        }
      })
      .then((response) => {
        setProfData(response.data);
        setProfId(response.data.data.id);
        //localStorage.setItem("RecordID", btoa(response.data.data.id))
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }, [email]);

  useEffect(() => {

    if (profId) {
      fetchLicenses();
      fetchCertificates();
      fetchEducation();
      fetchReference();
      fetchContact();
    }

  }, [profId]);

  //Education sorting
  const handleEducationSort = (field) => {
    let newSortOrder = 'asc';
    if (sortEducationField === field && sortEducationOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortEducationOrder(newSortOrder);
    setSortEducationField(field);

    const sortedData = [...education].sort((a, b) => {
      if (field === 'name' || field === 'course_name' ) {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();
        if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setEducation(sortedData);
  };

  //License sorting
  const handleLicenseSort = (field) => {
    let newSortOrder = 'asc';
    if (sortLicenseField === field && sortLicenseOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortLicenseOrder(newSortOrder);
    setSortLicenseField(field);

    const sortedData = [...licenses].sort((a, b) => {
      if (field === 'license_name' || field === 'city' || field === 'state' ) {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();
        if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setLicenses(sortedData);
  };

  //Contact sorting
  const handleContactSort = (field) => {
    let newSortOrder = 'asc';
    if (sortContactField === field && sortContactOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortContactOrder(newSortOrder);
    setSortContactField(field);

    const sortedData = [...contact].sort((a, b) => {
      if (field === 'name' || field === 'relationship' ) {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();
        if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setContact(sortedData);
  };

  //Reference sorting
  const handleRefSort = (field) => {
    let newSortOrder = 'asc';
    if (sortRefField === field && sortRefOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortRefOrder(newSortOrder);
    setSortRefField(field);

    const sortedData = [...reference].sort((a, b) => {
      if (field === 'name' || field === 'relationship' || field === 'occupation' ) {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();
        if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setReference(sortedData);
  };

  //Certificate sorting
  const handleCertSort = (field) => {
    let newSortOrder = 'asc';
    if (sortCertField === field && sortCertOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortCertOrder(newSortOrder);
    setSortCertField(field);

    const sortedData = [...certificates].sort((a, b) => {
        if (field === 'certificate_name' || field === 'city' || field === 'state' ) {
          const nameA = a[field].toLowerCase();
          const nameB = b[field].toLowerCase();
          if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
          if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
          return 0;
        } else if (field === 'certificate_date') {
          const dateA = new Date(a[field]);
          const dateB = new Date(b[field]);
          return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });

    setCertificates(sortedData);
  };    

  console.log('aspProfData', profData);
  console.log('aspLicenses', licenses);
  console.log('aspCertificate', certificates);
  console.log('aspUserId', profId);

  return (
    <>
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
                    </ol>
                    <h2 className="breadcrumb-title">Professional Profile</h2>
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

        <>
          {/* Page Content */}
          <div className="content">
            <div className="container">
              {/* Doctor Widget */}
              <div className="card doc-profile-card">
                <div className="card-body">
                  <div className="doctor-widget doctor-profile-two">
                    <div className="doc-info-left">
                      <div className="doc-info-cont">
                        <span className="badge doc-avail-badge">
                          <i className="fa-solid fa-circle" />
                          Available{" "}
                        </span>
                        <h4 className="doc-name">
                          {profData?.data?.prof_first_name} {profData?.data?.prof_last_name}{" "}
                        </h4>
                        <p>Speaks : {
                          profData?.data?.Languages.map(lang => {
                            const option = langOptions.find(option => option.value === lang);
                            return option ? option.label : null;
                          }).join(', ') || 'N/A'
                        }

                        </p>
                        <p className="address-detail">
                          <span className="loc-icon">
                            <i className="feather-map-pin" />
                          </span>
                          {stateOptions.find(option => option.value === profData?.data?.prof_state)?.label || 'N/A'},  {cntryOptions.find(option => option.value === profData?.data?.prof_cntry)?.label || 'N/A'},   {profData?.data?.prof_zip_primary}
                        </p>
                      </div>
                    </div>
                    <div className="doc-info-right">
                      <ul className="doctors-activities">
                        <li>
                          <div className="hospital-info">
                            <span className="list-icon">
                              <ImageWithBasePath src="assets/img/icons/watch-icon.svg" alt="Img" />
                            </span>
                            <p> Work Experiences :  {
                              profData?.data?.Work_Setting.map(work => {
                                const option = workExperienceOptions.find(option => option.value === work);
                                return option ? option.label : null;
                              }).join(', ') || 'N/A'
                            }
                            </p>
                          </div>
                          <h5 className="accept-text">
                            <span className="bg-dark-blue">
                              <ImageWithBasePath src="assets/img/icons/bullseye.svg" alt="Img" />
                            </span>
                            In Practice for  {yearOptions.find(option => option.value === profData?.data?.prof_years_in)?.label || 'N/A'}
                          </h5>
                        </li>
                        <li>
                          <div className="hospital-info">
                            <span className="list-icon">
                              <ImageWithBasePath src="assets/img/icons/thumb-icon.svg" alt="Img" />
                            </span>
                            <p>  Disciplines :  {
                              profData?.data?.Discipline?.length > 0
                              ? profData.data.Discipline
                                  .map((disp) => {
                                    const option = disciplineOptions.find(option => option.value === disp);
                                    return option ? (
                                      <span key={disp} style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>
                                        {option.label}
                                      </span>
                                    ) : null;
                                  })
                                  .filter(Boolean)
                                  .reduce((acc, curr, index) => {
                                    if (index === 0) return [curr];
                                    return [...acc, ', ', curr];
                                  }, [])
                              : 'N/A'
                            }
                            </p>
                          </div>
                          <h5 className="accept-text">
                            <span className="bg-blue">
                              <ImageWithBasePath src="assets/img/icons/calendar3.svg" alt="Img" />
                            </span>
                            Weekly {weeklyOptions.find(option => option.value === profData?.data?.prof_weekly_aval)?.label || 'N/A'}
                          </h5>
                        </li>
                        <li>
                          <div className="hospital-info">
                            <span className="list-icon">
                              <ImageWithBasePath src="assets/img/icons/work-icon-06.svg" alt="Img" />
                            </span>
                            <p> Specialities :  {
                              profData?.data?.Speciality.map(work => {
                                const option = specialtyOptions.find(option => option.value === work);
                                return option ? option.label : null;
                              }).join(', ') || 'N/A'
                            }
                            </p>
                          </div>

                        </li>
                        <li>
                          <div className="hospital-info">
                            <span className="list-icon">
                              <ImageWithBasePath src="assets/img/icons/benefit-icon-01.svg" alt="Img" />
                            </span>
                            <p>  Softwares :  {
                              profData?.data?.DocSoft.map(software => {
                                const option = docOptions.find(option => option.value === software);
                                return option ? option.label : null;
                              }).join(', ') || 'N/A'
                            }
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="doc-profile-card-bottom">

                    <ul>
                      <li>
                        <span>
                          <ImageWithBasePath src="assets/img/icons/badge-check.svg" alt="Img" />
                        </span>
                        License {profData?.data?.prof_license}
                      </li>
                      <li>
                        <span>
                          <ImageWithBasePath src="assets/img/icons/badge-check.svg" alt="Img" />
                        </span>
                        EIN {profData?.data?.prof_ein_number}
                      </li>
                      <li>
                        <span>
                          <ImageWithBasePath src="assets/img/icons/badge-check.svg" alt="Img" />
                        </span>
                        NPI {profData?.data?.prof_npi}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Doctor Widget */}
              <div className="doctors-detailed-info">
                <ul className="information-title-list">
                  <li className="active">
                    <a href="#licence">License</a>
                  </li>
                  <li className="">
                    <a href="#cerificate">Certificate</a>
                  </li>
                  <li className="">
                    <a href="#education">Education</a>
                  </li>
                  <li className="">
                    <a href="#reference">Reference</a>
                  </li>
                  <li className="">
                    <a href="#emergency">Emeregency Contact</a>
                  </li>
                </ul>


                <div className="doc-information-main">
                  <div className="doc-information-details bio-detail" id="licence">
                    <div className="detail-title">
                      <h4>License</h4>
                    </div>
                    <div className="">
                      {/* <div className="custom-table"> */}
                        <div className="table-responsive border">
                          <table className="table table-center mb-0 table-striped table-hover">
                          <thead className="bg-primary text-white">
                            <tr className="bg-primary text-white">
                                <th onClick={() => handleLicenseSort('license_name')} style={{ cursor: "pointer" }} className="bg-primary text-white">License Name {sortLicenseOrder === 'asc' ? '↑' : '↓'}</th>
                                <th className="bg-primary text-white">License Number</th>
                                <th onClick={() => handleLicenseSort('city')} style={{ cursor: "pointer" }} className="bg-primary text-white">City {sortLicenseOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleLicenseSort('state')} style={{ cursor: "pointer" }} className="bg-primary text-white">State {sortLicenseOrder === 'asc' ? '↑' : '↓'}</th>
                                <th className="bg-primary text-white">Action</th>
                            </tr>
                          </thead>
                            <tbody>
                              {licenses.length === 0 ?
                                <tr><td colSpan={4}>No license data found for this professional</td></tr>
                                :
                                licenses.map((license) => (
                                  <tr key={license.id}>
                                    <td>{license.license_name}</td>
                                    <td>{license.license_number}</td>
                                    <td>{license.city}</td>
                                    <td>{license.state}</td>
                                  </tr>
                                ))}
                            </tbody>

                          </table>
                        </div>
                      </div>
                    {/* </div> */}

                  </div>

                  <div className="doc-information-details bio-detail" id="cerificate">
                    <div className="detail-title">
                      <h4>Cerificate</h4>
                    </div>
                    <div className="">
                      {/* <div className="custom-table"> */}
                        <div className="table-responsive border">
                          <table className="table table-center mb-0 table-striped table-hover">
                            <thead className="bg-primary text-white">
                            <tr className="bg-primary text-white">
                              <th onClick={() => handleCertSort('certificate_name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Certificate Name {sortCertOrder === 'asc' ? '↑' : '↓'}</th>
                              <th onClick={() => handleCertSort('certificate_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">Certificate Date {sortCertOrder === 'asc' ? '↑' : '↓'}</th>
                              <th onClick={() => handleCertSort('city')} style={{ cursor: "pointer" }} className="bg-primary text-white">City {sortCertOrder === 'asc' ? '↑' : '↓'}</th>
                              <th onClick={() => handleCertSort('state')} style={{ cursor: "pointer" }} className="bg-primary text-white">State {sortCertOrder === 'asc' ? '↑' : '↓'}</th>
                            </tr>
                            </thead>
                            <tbody>
                              {certificates.length === 0 ?
                                <tr><td colSpan={4}>No certificate data found for this professional</td></tr>
                                :
                                certificates.map((certificate) => (
                                  <tr key={certificate.id}>
                                    <td>{certificate.certificate_name}</td>
                                    <td>{new Date(certificate.certificate_date).toLocaleDateString()}</td>
                                    <td>{certificate.city}</td>
                                    <td>{certificate.state}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  {/* </div> */}


                  <div className="doc-information-details bio-detail" id="education">
                    <div className="detail-title">
                      <h4>Education</h4>
                    </div>
                    <div className="">

                      {/* <div className="custom-table"> */}
                        <div className="table-responsive border">
                          <table className="table table-center mb-0 table-striped table-hover">
                            <thead className="bg-primary text-white">
                              <tr className="bg-primary text-white">
                                  <th onClick={() => handleEducationSort('name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Education Name {sortEducationOrder === 'asc' ? '↑' : '↓'}</th>
                                  <th className="bg-primary text-white">Education Type</th>
                                  <th onClick={() => handleEducationSort('course_name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Course {sortEducationOrder === 'asc' ? '↑' : '↓'}</th>
                                  <th className="bg-primary text-white">Year of Completed</th>
                                  <th className="bg-primary text-white">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {education.length === 0 ?
                                <tr><td colSpan={4}>No education data found for this professional</td></tr>
                                :
                                education.map((education) => (
                                  <tr key={education.id}>
                                    <td>{education.name}</td>
                                    <td>{education.type}</td>
                                    <td>{education.course_name}</td>
                                    <td>{education.year_completed}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  {/* </div> */}

                  <div className="doc-information-details bio-detail" id="reference">
                    <div className="detail-title">
                      <h4>Reference</h4>
                    </div>
                    <div className="">

                      {/* <div className="custom-table"> */}
                        <div className="table-responsive border">
                          <table className="table table-center mb-0 table-striped table-hover">
                            <thead className="bg-primary text-white">
                            <tr className="bg-primary text-white">
                              <th onClick={() => handleRefSort('name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Reference Name {sortRefOrder === 'asc' ? '↑' : '↓'}</th>
                              <th onClick={() => handleRefSort('occupation')} style={{ cursor: "pointer" }} className="bg-primary text-white">Reference Occupation {sortRefOrder === 'asc' ? '↑' : '↓'}</th>
                              <th onClick={() => handleRefSort('relationship')} style={{ cursor: "pointer" }} className="bg-primary text-white">Relationship {sortRefOrder === 'asc' ? '↑' : '↓'}</th>
                              <th className="bg-primary text-white">Contact</th>
                            </tr>
                            </thead>
                            <tbody>
                              {reference.length === 0 ?
                                <tr><td colSpan={4}>No refernce data found for this professional</td></tr>
                                :
                                reference.map((reference) => (
                                  <tr key={reference.id}>
                                    <td>{reference.name}</td>
                                    <td>{reference.occupation}</td>
                                    <td>{reference.relationship}</td>
                                    <td>{reference.phone_number}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  {/* </div> */}

                  <div className="doc-information-details bio-detail" id="emergency">
                    <div className="detail-title">
                      <h4>Emergency Contact</h4>
                    </div>
                  
                      {/* <div className="custom-table"> */}
                        <div className="table-responsive border">
                         <table className="table table-center mb-0 table-striped table-hover">
                            <thead>
                              <tr className="bg-primary text-white">
                                <th onClick={() => handleContactSort('name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Contact Name {sortContactOrder === 'asc' ? '↑' : '↓'}</th>
                                <th className="bg-primary text-white">Contact Type</th>
                                <th onClick={() => handleContactSort('relationship')} style={{ cursor: "pointer" }} className="bg-primary text-white">Relationship {sortContactOrder === 'asc' ? '↑' : '↓'}</th>
                                <th className="bg-primary text-white">Contact Number</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contact.length === 0 ?
                                <tr><td colSpan={4}>No contact data found for this professional</td></tr>
                                :
                                contact.map((contact) => (
                                  <tr key={contact.id}>
                                    <td>{contact.name}</td>
                                    <td>{contact.type}</td>
                                    <td>{contact.relationship}</td>
                                    <td>{contact.phone_number}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                  {/* </div> */}

                </div>




              </div>
            </div>
          </div>
          {/* /Page Content */}
        </>

        <SiteFooter />

      </div>
    </>
  )
}

export default FacilityProfessioanlProfile