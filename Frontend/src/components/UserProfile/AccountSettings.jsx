import React, { useState, useEffect } from "react";
import "./AccountSettings.css";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import { FormGroup } from "react-bootstrap";
import { updateUserApi, userDetailsApi, deleteUserApi } from "../../api/Api";
import DOMPurify from "dompurify"; // Import DOMPurify for XSS protection

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

  // Function to sanitize input
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  // State for form fields
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleFullname = (e) => {
    setFullname(sanitizeInput(e.target.value)); // Sanitize input before setting state
  };
  const handlePhone = (e) => {
    setPhone(sanitizeInput(e.target.value)); // Sanitize input before setting state
  };
  const handleUsername = (e) => {
    setUsername(sanitizeInput(e.target.value)); // Sanitize input before setting state
  };
  const handlePassword = (e) => {
    setPassword(sanitizeInput(e.target.value)); // Sanitize input before setting state
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 20;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?\/\\|`~])[A-Za-z\d!@#$%^&*()_+{}\[\]:;"'<>,.?\/\\|`~]{8,20}$/;

    if (password.length < minLength || password.length > maxLength) {
      toast.error(
        `Password must be between ${minLength} and ${maxLength} characters long.`
      );
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return false;
    }
    return true;
  };

  const validate = () => {
    let isValid = true;
    if (fullname.trim() === "") {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidated = validate();

    if (!isValidated) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    const data = {
      userId: userId._id,
      fullname: fullname,
      phone: currentUser.phone,
      username: username,
      password: password,
    };

    updateUserApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message || "An error occurred");
        } else if (error.request) {
          toast.error("Network error, please try again.");
        } else {
          toast.error("An error occurred: " + error.message);
        }
      });
  };

  return (
    <div className="account__settings">
      <h1>Update Information</h1>
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
              type="password"
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
            className="btn delete__btn w-100 mt-3"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
