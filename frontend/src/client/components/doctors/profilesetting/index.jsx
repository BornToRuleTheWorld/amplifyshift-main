/* eslint-disable react/prop-types */
import React, { useState } from "react";
import DoctorSidebar from "../sidebar/index";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { TagsInput } from "react-tag-input-component";
import { Link } from "react-router-dom";
import SettingsHeader from "./settingsHeader.jsx";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";

const ProfileSetting = (props) => {
  const [language, setLanguage] = useState(["English", "German"]);
  const [membershipInfos, setMembershipInfos] = useState([{ title: '', about: '' }]);

  const addMembershipInfo = () => {
    setMembershipInfos([...membershipInfos, { title: '', about: '' }]);
  };

  const deleteMembershipInfo = (index) => {
    const updatedMembershipInfos = membershipInfos.filter((_, i) => i !== index);
    setMembershipInfos(updatedMembershipInfos);
  };



  return (
    <div>
      <Header {...props} />
      {/* Breadcrumb */}
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
                      Doctor
                    </li>
                    <li className="breadcrumb-item active">Doctor Profile</li>
                  </ol>
                  <h2 className="breadcrumb-title">Doctor Profile</h2>
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
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
              <DoctorSidebar />
              {/* /Profile Sidebar */}
            </div>
            <div className="col-lg-8 col-xl-9">
              {/* Profile Settings */}
              <div className="dashboard-header">
                <h3>Profile Settings</h3>
              </div>
              {/* Settings List */}
              <SettingsHeader />
              {/* /Settings List */}
              <div className="setting-title">
                <h5>Profile</h5>
              </div>
              <form>
                <div className="setting-card">
                  <div className="change-avatar img-upload">
                    <div className="profile-img">
                      <i className="fa-solid fa-file-image" />
                    </div>
                    <div className="upload-img">
                      <h5>Profile Image</h5>
                      <div className="imgs-load d-flex align-items-center">
                        <div className="change-photo">
                          Upload New
                          <input type="file" className="upload" />
                        </div>
                        <Link to="#" className="upload-remove">
                          Remove
                        </Link>
                      </div>
                      <p className="form-text">
                        Your Image should Below 4 MB, Accepted format Jpg,Png,Svg
                      </p>
                    </div>
                  </div>
                </div>
                <div className="setting-title">
                  <h5>Information</h5>
                </div>
                <div className="setting-card">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Display Name <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Designation <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Phone Numbers <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Known Languages <span className="text-danger">*</span>
                        </label>

                        <TagsInput
                          // className="input-tags form-control"
                          value={language}
                          onChange={setLanguage}
                          placeHolder='Type'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="setting-title">
                  <h5>Memberships</h5>
                </div>

                <div className="setting-card">
                  <div className="add-info membership-infos">
                    {membershipInfos.map((info, index) => (
                      <div className="row membership-content" key={index}>
                        <div className="col-lg-3 col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Title <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add Title"
                              value={info.title}
                              onChange={(e) => {
                                const updatedInfos = [...membershipInfos];
                                updatedInfos[index].title = e.target.value;
                                setMembershipInfos(updatedInfos);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-9 col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="form-wrap w-100">
                              <label className="col-form-label">About Membership</label>
                              <input
                                type="text"
                                className="form-control"
                                value={info.about}
                                onChange={(e) => {
                                  const updatedInfos = [...membershipInfos];
                                  updatedInfos[index].about = e.target.value;
                                  setMembershipInfos(updatedInfos);
                                }}
                              />
                            </div>
                            <div className="form-wrap ms-2">
                              <label className="col-form-label d-block">&nbsp;</label>
                              <Link
                                to="#"
                                className="trash-icon trash"
                                onClick={() => deleteMembershipInfo(index)}
                              >
                                Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-end">
                    <Link to="#" className="add-membership-info more-item" onClick={addMembershipInfo}>Add New</Link>
                  </div>
                </div>



                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-gray me-1">
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary prime-btn">
                    Save Changes
                  </Link>
                </div>
              </form>
              {/* /Profile Settings */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </div>
  );
};

export default ProfileSetting;
