import React, { useState, useEffect } from "react";
import "./AccountSettings.css";
import { Button } from "reactstrap";
import { toast } from "react-toastify";

import { FormGroup } from "react-bootstrap";
import { updateUserApi, userDetailsApi, deleteUserApi } from "../../api/Api";

const AccountSettings = () => {
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
    console.log(data);
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

  console.log(currentUser);

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

    console.log(fullname, phone, username, password);
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

    console.log(data);

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
    <div className="account__settings">
      <h1>Update Information</h1>

      {userDetailsApi}

      <div className="update__profile-form">
        <div className="row__group">
          <FormGroup className="d-flex flex-row">
            <label htmlFor="">Full Name :</label>
            <input
              onChange={handleFullname}
              type="text"
              className="form-control"
              placeholder={currentUser.fullname}
            />
          </FormGroup>
          <FormGroup className="d-flex flex-row">
            <label htmlFor="">Phone :</label>
            <input
              onChange={handlePhone}
              type="text"
              className="form-control"
              placeholder={currentUser.phone}
              value={currentUser.phone} 
              disabled 
            />
          </FormGroup>

          <FormGroup className="d-flex flex-row">
            <label htmlFor="">Username :</label>

            <input
              onChange={handleUsername}
              type="text"
              className="form-control"
              placeholder={currentUser.username}
            />
          </FormGroup>
          <FormGroup className="d-flex flex-row">
            <label htmlFor="">Password :</label>

            <input
              onChange={handlePassword}
              type="text"
              className="form-control"
              placeholder="********"
            />
          </FormGroup>
        </div>

        <div className="account__settings_btn">
          <Button
            onClick={handleSubmit}
            className="btn primary__btn w-100 mt-3"
          >
            Update
          </Button>

          <Button
            onClick={handleDelete}
            className="btn delete__btn w-100 mt-3 "
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
