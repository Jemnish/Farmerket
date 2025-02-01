import React, { useState, useEffect } from "react";
import SiderBar from "../../components/admin/AdminSiderBar/AdminSideBar";
import { Col, Row } from "reactstrap";
import "../../styles/admin/AdminMyAccount.css";
import AdminCommonSection from "../../shared/AdminCommonSection";
import { updateUserApi, userDetailsApi, deleteUserApi } from "../../api/Api";
import { toast } from "react-toastify";

function MyAccount() {
  const [currentUser, setCurrentUser] = useState({});
  const userId = JSON.parse(localStorage.getItem("userData"));
  const data = {
    userId: userId._id,
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      deleteUserApi(data).then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          localStorage.clear();
          window.location = "/login";
        }
      });
    }
  };

  useEffect(() => {
    userDetailsApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          setCurrentUser(res.data.userData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  //make a usestate for 5 fields
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleFullname = (e) => {
    setFullname(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  //validation
  var validate = () => {
    var isValid = true;
    if (fullname.trim() === "") {
      isValid = false;
    }
    if (phone.trim() === "") {
      isValid = false;
    }
    if (username.trim() === "") {
      isValid = false;
    }
    if (password.trim() === "") {
      isValid = false;
    }

    return isValid;
  };

  //submit button function
  const handleSubmit = (e) => {
    e.preventDefault();
    //validate
    var isValidated = validate();

    if (!isValidated) {
      toast.error("Please fill all the fields");
      return;
    }
    // Sending request to the api

    // Making JSON object
    const data = {
      userId: userId._id,
      fullname: fullname,
      phone: phone,
      username: username,
      password: password,
    };


    updateUserApi(data).then((res) => {
      // Received data : sucess mesaage
      if (res.data.success === false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
      }
    });
  };

  return (
    <div className="dashboard-content">
      <Row>
        <AdminCommonSection />
        <Col lg="4" className="admin__col">
          <SiderBar />
        </Col>
        <Col lg="8">
          <div className="account-details-container">
            <h3>My Account</h3>

            <div className="account-card">
              <h5>Account Details</h5>
              <div className="account-info">
                <div className="account__labels mb-3">
                  <label className="form-label">
                    <strong>Full Name:</strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={currentUser.fullname}
                    onChange={handleFullname}
                  />
                </div>
                <div className="account__labels mb-3">
                  <label className="form-label">
                    <strong>Phone:</strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={currentUser.phone}
                    onChange={handlePhone}
                  />
                </div>
                <div className="account__labels mb-3">
                  <label className="form-label">
                    <strong>Username:</strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={currentUser.username}
                    onChange={handleUsername}
                  />
                </div>
                <div className="account__labels mb-3">
                  <label className="form-label">
                    <strong>New Password:</strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="********"
                    onChange={handlePassword}
                  />
                </div>
                <div className="admin__account_btns">
                  <button className="btn btn__success" onClick={handleSubmit}>
                    Save Details
                  </button>
                  <button className="btn btn__failure" onClick={handleDelete}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MyAccount;
