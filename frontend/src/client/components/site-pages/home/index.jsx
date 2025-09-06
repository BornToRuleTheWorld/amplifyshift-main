import React, { useEffect, useState } from "react";
import SiteFooter from "../home/footer";
import SiteHeader from "../home/header";
import { Link, useHistory } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Dropdown } from "primereact/dropdown";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions} from "../config";
import Select from "react-select";

const SiteHome = () => {
  const selectValue = [
    { name: "PT" },
    { name: "PTA" },  
    { name: "OT" },
    { name: "COTA" },
    { name: "SLP" },
  ];

  const removeIndexSearch = () => {
    localStorage.removeItem('startDate')
    localStorage.removeItem('endDate')
    localStorage.removeItem('discipline')
    localStorage.removeItem('indexSearch')
  }

  useEffect(()=>{
    removeIndexSearch()
  },[])

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(null);

  const history = useHistory()

  const CustomNextArrow = ({ className, onClick }) => (
    <div className="owl-nav slide-nav-4 text-end nav-control">
        <button type="button" role="presentation" className="owl-next" onClick={onClick}>
            <i className="fas fa-chevron-right custom-arrow" />
        </button>
    </div>

);

const CustomPrevArrow = ({ className, onClick }) => (
    <div className="owl-nav slide-nav-4 text-end nav-control">
        <button type="button" role="presentation" className="owl-prev" onClick={onClick}>
            <i className="fas fa-chevron-left custom-arrow" />
        </button>
    </div>
);
  const clinicSlider = {
    slidesToShow: 6,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        infinite: false,
        nextArrow: false,
        prevArrow: false,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 6,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    vertical: false,
                    slidesToShow: 1,
                },
            },
        ],
  };
  const ourDoctorSlider = {
   slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    vertical: false,
                    slidesToShow: 1,
                },
            },
        ],
  };
  const clinicFeatureSlider = {
    slidesToShow: 5,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    vertical: false,
                    slidesToShow: 1,
                },
            },
        ],
  };
  const blogSlider = {
    slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    vertical: false,
                    slidesToShow: 1,
                },
            },
        ],
  };

  AOS.init();
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  const handleScroll = () => {
    AOS.refresh();
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = async () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError("Please choose both start date and end date");
    } else if (!startDate && !endDate && !selectedValue) {
      setError("Please fill at least one field");
    } else {
      if (startDate) {
        localStorage.setItem("startDate", btoa(new Date(startDate).toISOString()));
      }
      if (endDate) {
        localStorage.setItem("endDate", btoa(new Date(endDate).toISOString()));
      }
      if (selectedValue) {
        localStorage.setItem("discipline", btoa(parseInt(selectedValue)));
      }
      localStorage.setItem("indexSearch", btoa(true));
      history.push("/professional-search");
    }
  };
  

  return (
    <div className="main-wrapper home-three">
      <SiteHeader />
      {/* Home Banner */}
      <section className="doctor-search-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 aos" data-aos="fade-up">
              <div className="doctor-search">
                <div className="banner-header">
                  <h2>
                    <span>Search Professional,</span> Hire a Professional
                  </h2>
                  {/* <p>
                    Access to expert physicians and surgeons, advanced
                    technologies and top-quality surgery facilities right here.
                  </p> */}
                </div>
                <div className="doctor-form">
                  {error && <p className="text-danger m-3 text-center">{error}</p>}
                  <form action="#" className="doctor-search" onSubmit={handleSubmit}>
                   
                      {/* <div className="row">
                        <div className="col-auto">
                          <div className="form-icon">
                            <DatePicker
                              className="form-control datetimepicker"
                              name="startDate"
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
                        <div className="col-auto">
                          <div className="form-icon">
                            <DatePicker
                              className="form-control datetimepicker"
                              name="endDate"
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
                        <div className="col-auto">
                          <Select
                            className="select"
                            name = "discipline"
                            options={disciplineOptions}
                            value={disciplineOptions.find(option => option.value == selectValue)}
                            onChange={(selected) => setSelectedValue(selected.value)}
                            placeholder="Rehabilitation"
                            isClearable={true}
                            isSearchable={true}
                          />
                        </div>
                      </div> */}
                      <div className="input-box-twelve row">
                      <div className="search-input input-block" style={{width:"180px"}}>
                        {/* <input
                          type="text"
                          className="form-control"
                          placeholder="Location"
                        />
                        <Link
                          className="current-loc-icon current_location"
                          to="#"
                        >
                          <i className="isax isax-location" />
                        </Link> */}
                        <div className="form-icon">
                        <DatePicker
                        className="form-control datetimepicker"
                        name="startDate"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MM/dd/yyyy"
                        showDayMonthYearPicker
                        autoComplete='off'
                        placeholderText="Start Date"
                        minDate={new Date()}
                        />
                          <span className="icon">
                            <i className="fa-regular fa-calendar-days" />
                          </span>
                        </div>
                      </div>
                      <div className="search-input input-block" style={{width:"180px"}}>
                        <div className="form-icon">
                        <DatePicker
                        className="form-control datetimepicker"
                        name="endDate"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MM/dd/yyyy"
                        showDayMonthYearPicker
                        autoComplete='off'
                        placeholderText="End Date"
                        minDate={new Date()}
                        />
                          <span className="icon">
                            <i className="fa-regular fa-calendar-days" />
                          </span>
                        </div>
                      </div>
                      <div className="search-input input-block">
                      <Select
                        className="select"
                        name="discipline"
                        options={disciplineOptions}
                        value={selectedValue ? disciplineOptions.find(option => option.value === selectedValue) : null}
                        onChange={(selected) => setSelectedValue(selected?.value ? selected.value : null)}
                        placeholder="Rehabilitation"
                        isClearable={true}
                        isSearchable={true}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: 'none',
                            boxShadow: 'none',
                            width:"170px",
                          }),
                          
                          controlIsFocused: (provided) => ({
                            ...provided,
                            border: 'none',
                            boxShadow: 'none',
                          }),
                        }}
                      />
                      </div>
                      {/* <div className="search-input input-block">
                        <Dropdown
                          value={disciplineOptions}
                          onChange={(e) => setSelectedValue(e.value)}
                          options={selectValue}
                          optionLabel="name"
                          placeholder="Rehabilitation"
                          className="custom-prime-select"
                        />

                        <Link
                          className="current-loc-icon current_location"
                          to="#"
                        >
                          <i className="isax isax-user-tag" />
                        </Link>
                      </div> */}
                      <div className="input-block" style={{width:"130px"}}>
                        <div className="search-btn-info">
                          <Link to="#" className="btn btn-primary" onClick={handleSubmit}>
                            <i className="fa-solid fa-magnifying-glass" />
                            Search
                          </Link>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-4 aos" data-aos="fade-up">
              <ImageWithBasePath
                src="assets/img/banner/doctor-banner.png"
                className="img-fluid dr-img"
                alt="doctor-image"
              />
            </div>
          </div>
        </div>
      </section>
      {/* /Home Banner */}
      {/* Clinic Section */}
      <section className="clinics-section">
        <div className="shapes">
          <ImageWithBasePath
            src="assets/img/shapes/shape-1.png"
            alt="shape-image"
            className="img-fluid shape-1"
          />
          <ImageWithBasePath
            src="assets/img/shapes/shape-2.png"
            alt="shape-image"
            className="img-fluid shape-2"
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="section-heading">
                <h2>Clinic &amp; Facilities</h2>
                <p>
                  Access to expert physicians and surgeons, advanced
                  technologies and top-quality surgery facilities right here.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-1 text-end nav-control" />
            </div>
          </div>
          <div className="clinics slick-margins-15 owl-theme slick-arrow-right aos" data-aos="fade-up">
            <Slider {...clinicSlider}>
              <div className="item">
                <div className="clinic-item">
                  <div className="clinics-card">
                    <div className="clinics-img">
                      <ImageWithBasePath
                        src="assets/img/clinic/clinic-1.jpg"
                        alt="clinic-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="clinics-info">
                      <span className="clinic-img">
                        <ImageWithBasePath
                          src="assets/img/category/category-01.svg"
                          alt="kidney-image"
                          className="img-fluid"
                        />
                      </span>
                      <Link to="#">
                        <span>Hospital</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="clinic-item">
                  <div className="clinics-card">
                    <div className="clinics-img">
                      <ImageWithBasePath
                        src="assets/img/clinic/clinic-2.jpg"
                        alt="clinic-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="clinics-info">
                      <span className="clinic-img">
                        <ImageWithBasePath
                          src="assets/img/category/category-02.svg"
                          alt="bone-image"
                          className="img-fluid"
                        />
                      </span>
                      <Link to="#">
                        <span>Skilled Nursing Facility</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="clinic-item">
                  <div className="clinics-card">
                    <div className="clinics-img">
                      <ImageWithBasePath
                        src="assets/img/clinic/clinic-4.jpg"
                        alt="client-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="clinics-info">
                      <span className="clinic-img">
                        <ImageWithBasePath
                          src="assets/img/category/category-03.svg"
                          alt="heart-image"
                          className="img-fluid"
                        />
                      </span>
                      <Link to="#">
                        <span>Home Health Services</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="clinic-item">
                  <div className="clinics-card">
                    <div className="clinics-img">
                      <ImageWithBasePath
                        src="assets/img/clinic/clinic-3.jpg"
                        alt="client-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="clinics-info">
                      <span className="clinic-img">
                        <ImageWithBasePath
                          src="assets/img/category/category-04.svg"
                          alt="teeth-image"
                          className="img-fluid"
                        />
                      </span>
                      <Link to="#">
                        <span>Indpendent Living Facility</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="clinic-item">
                  <div className="clinics-card">
                    <div className="clinics-img">
                      <ImageWithBasePath
                        src="assets/img/clinic/clinic-5.jpg"
                        alt="client-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="clinics-info">
                      <span className="clinic-img">
                        <ImageWithBasePath
                          src="assets/img/category/category-05.svg"
                          alt="brain-image"
                          className="img-fluid"
                        />
                      </span>
                      <Link to="#">
                        <span>Outpatient</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>              
            </Slider>
          </div>
        </div>
      </section>
      {/* /Clinic Section */}
      {/* Specialities Section */}
      <section className="specialities-section">
        <div className="shapes">
          <ImageWithBasePath
            src="assets/img/shapes/shape-3.png"
            alt="shape-image"
            className="img-fluid shape-3"
          />
        </div>
        {/* <div className="container">
          <div className="row">
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="section-heading bg-area">
                <h2>Browse by Specialities</h2>
                <p>Find experienced doctors across all specialties</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/1.png"
                    alt="kidney-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Urology</h4>
                  </Link>
                  <p>21 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/2.png"
                    alt="bone-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Orthopedic</h4>
                  </Link>
                  <p>30 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/4.png"
                    alt="heart-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Cardiologist</h4>
                  </Link>
                  <p>15 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/5.png"
                    alt="brain-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Dentist</h4>
                  </Link>
                  <p>35 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/3.png"
                    alt="brain-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Neurology</h4>
                  </Link>
                  <p>25 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/6.png"
                    alt="bone-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Pediatrist</h4>
                  </Link>
                  <p>10 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/7.png"
                    alt="heart-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Veterinary</h4>
                  </Link>
                  <p>20 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 aos" data-aos="fade-up">
              <div className="specialist-card d-flex">
                <div className="specialist-img">
                  <ImageWithBasePath
                    src="assets/img/category/8.png"
                    alt="kidney-image"
                    className="img-fluid"
                  />
                </div>
                <div className="specialist-info">
                  <Link to="#">
                    <h4>Psychiatrist</h4>
                  </Link>
                  <p>12 Doctors</p>
                </div>
                <div className="specialist-nav ms-auto">
                  <Link to="#">
                    <i className="isax isax-arrow-right-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>
      {/* /Specialities Section */}
      {/* Best Doctor Section */}
      {/* <section className="our-doctors-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="section-heading">
                <h2>Book Our Best Doctor</h2>
                <p>Meet our experts &amp; book online</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-2 text-end nav-control" />
            </div>
          </div>
          <div className="our-doctors slick-margins-15 owl-theme slick-arrow-right aos" data-aos="fade-up">
            <Slider {...ourDoctorSlider}>
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link to="#">
                      <ImageWithBasePath
                        src="assets/img/doctors/doctor-01.jpg"
                        alt="Ruby Perrin"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="img-overlay">
                      <span>$20 - $50</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span className="d-inline-block average-ratings">
                        3.5
                      </span>
                    </div>
                    <Link to="/patient/doctor-profile">
                      <h4>Dr. Ruby Perrin</h4>
                    </Link>
                    <p>BDS, MDS - Oral &amp; Maxillofacial Surgery</p>
                    <div className="location d-flex">
                      <p>
                        <i className="fas fa-map-marker-alt" /> Georgia, USA
                      </p>
                      <p className="ms-auto">
                        <i className="fas fa-user-md" /> 450 Consultations
                      </p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link
                          to="/patient/doctor-profile"
                          className="btn btn-dark w-100"
                          tabIndex={0}
                        >
                          View Profile
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link
                          to="/patient/booking1"
                          className="btn btn-primary w-100"
                          tabIndex={0}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link to="#">
                      <ImageWithBasePath
                        src="assets/img/doctors/doctor-04.jpg"
                        alt="Deborah Angel"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="img-overlay">
                      <span>$30 -$60</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="d-inline-block average-ratings">
                        3.0
                      </span>
                    </div>
                    <Link to="/patient/doctor-profile">
                      <h4>Dr. Lisa Graham</h4>
                    </Link>
                    <p>MBBS, MD - Cardialogist</p>
                    <div className="location d-flex">
                      <p>
                        <i className="fas fa-map-marker-alt" /> San Diego, USA
                      </p>
                      <p className="ms-auto">
                        <i className="fas fa-user-md" /> 120 Consultations
                      </p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link
                          to="/patient/doctor-profile"
                          className="btn btn-dark w-100"
                          tabIndex={0}
                        >
                          View Profile
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link
                          to="/patient/booking1"
                          className="btn btn-primary w-100"
                          tabIndex={0}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link to="#">
                      <ImageWithBasePath
                        src="assets/img/doctors/doctor-03.jpg"
                        alt="Sofia Brient"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="img-overlay">
                      <span>$15 -$30</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="d-inline-block average-ratings">
                        3.0
                      </span>
                    </div>
                    <Link to="/patient/doctor-profile">
                      <h4>Dr. Carrie Soderberg</h4>
                    </Link>
                    <p>MBBS, DNB - Neurology</p>
                    <div className="location d-flex">
                      <p>
                        <i className="fas fa-map-marker-alt" /> Dallas, USA
                      </p>
                      <p className="ms-auto">
                        <i className="fas fa-user-md" /> 300 Consultations
                      </p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link
                          to="/patient/doctor-profile"
                          className="btn btn-dark w-100"
                          tabIndex={0}
                        >
                          View Profile
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link
                          to="/patient/booking1"
                          className="btn btn-primary w-100"
                          tabIndex={0}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link to="#">
                      <ImageWithBasePath
                        src="assets/img/doctors/doctor-02.jpg"
                        alt="Darren Elder"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="img-overlay">
                      <span>$20 - $50</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span className="d-inline-block average-ratings">
                        4.0
                      </span>
                    </div>
                    <Link to="/patient/doctor-profile">
                      <h4>Dr. Matthew Ruiz</h4>
                    </Link>
                    <p>BDS, MDS - Oral &amp; Maxillofacial Surgery</p>
                    <div className="location d-flex">
                      <p>
                        <i className="fas fa-map-marker-alt" /> Georgia, USA
                      </p>
                      <p className="ms-auto">
                        <i className="fas fa-user-md" /> 450 Consultations
                      </p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link
                          to="/patient/doctor-profile"
                          className="btn btn-dark w-100"
                          tabIndex={0}
                        >
                          View Profile
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link
                          to="/patient/booking1"
                          className="btn btn-primary w-100"
                          tabIndex={0}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </section> */}
      {/* /Best Doctor Section */}
      {/* Clinic Features Section */}
      <section className="clinic-features-section">
        <div className="container">
          <div className="row">
            <div className="col-md-8 aos" data-aos="fade-up">
              <div className="section-heading">
                <h2>Available Professionals on Amplify Shift</h2>
                <p>Meet our Professionals &amp; Book Online</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-3 text-end nav-control" />
            </div>
          </div>
          <div className="clinic-feature slick-margins-15 owl-theme slick-arrow-right aos" data-aos="fade-up">
            <Slider {...clinicFeatureSlider}>
              <div className="item">
                <div className="clinic-features">
                  <ImageWithBasePath
                    src="#"
                    alt="clinic-image"
                    className="img-fluid"
                  />
                </div>
                <div className="clinic-feature-overlay">
                  <Link to="#" className="img-overlay">
                    Operation
                  </Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <ImageWithBasePath
                    src="#"
                    alt="clinic-image"
                    className="img-fluid"
                  />
                </div>
                <div className="clinic-feature-overlay">
                  <Link to="#" className="img-overlay">
                    Medical
                  </Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <ImageWithBasePath
                    src="#"
                    alt="clinic-image"
                    className="img-fluid"
                  />
                </div>
                <div className="clinic-feature-overlay">
                  <Link to="#" className="img-overlay">
                    Patient Ward
                  </Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <ImageWithBasePath
                    src="#"
                    alt="clinic-image"
                    className="img-fluid"
                  />
                </div>
                <div className="clinic-feature-overlay">
                  <Link to="#" className="img-overlay">
                    Test Room
                  </Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <ImageWithBasePath
                    src="#"
                    alt="clinic-image"
                    className="img-fluid"
                  />
                </div>
                <div className="clinic-feature-overlay">
                  <Link to="#" className="img-overlay">
                    ICU
                  </Link>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </section>
      {/* /Clinic Features Section */}
      <SiteFooter />
    </div>
  );
};

export default SiteHome;
