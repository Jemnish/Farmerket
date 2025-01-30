import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/Register.css";
import { toast } from "react-toastify";
import { registerUserApi } from "../../api/Api";
import registerImg from "../../assets/images/register_cover.jpeg";
import userIcon from "../../assets/images/user.png";
import ReCapthca from "react-google-recaptcha";
import DOMPurify from "dompurify"; // Import DOMPurify

const Register = () => {
  // State variables
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [usertype, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [capValue, setCapValue] = useState(null);

  // State for errors
  const [fullnameError, setFullnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userTypeError, setUserTypeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmpasswordError, setConfirmPasswordError] = useState("");

  // Function to sanitize user input
  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  // Update state with sanitized input
  const handleFullname = (e) => {
    setFullname(sanitizeInput(e.target.value));
    setFullnameError("");
  };

  const handleEmail = (e) => {
    setEmail(sanitizeInput(e.target.value));
    setEmailError("");
  };

  const handlePhone = (e) => {
    setPhone(sanitizeInput(e.target.value));
    setPhoneError("");
  };

  const handleUserType = (e) => {
    setUserType(sanitizeInput(e.target.value));
    setUserTypeError("");
  };

  const handleUsername = (e) => {
    setUsername(sanitizeInput(e.target.value));
    setUsernameError("");
  };

  const handlePassword = (e) => {
    setPassword(sanitizeInput(e.target.value));
    setPasswordError("");
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(sanitizeInput(e.target.value));
    setConfirmPasswordError("");
  };

  // Validation
  const validate = () => {
    let isValid = true;
    if (fullname.trim() === "") {
      setFullnameError("Full Name is required");
      isValid = false;
    }
    if (email.trim() === "") {
      setEmailError("Email is required");
      isValid = false;
    }
    if (phone.trim() === "") {
      setPhoneError("Phone is required");
      isValid = false;
    }
    if (username.trim() === "") {
      setUsernameError("Username is required");
      isValid = false;
    }
    if (usertype.trim() === "") {
      setUserTypeError("User Type is required");
      isValid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }
    if (phone.length < 10) {
      setPhoneError("Invalid Phone Number");
      isValid = false;
    }
    if (password !== confirmpassword) {
      setConfirmPasswordError("Password does not match");
      isValid = false;
    }
    if (confirmpassword.trim() === "") {
      setConfirmPasswordError("Confirm Password is required");
      isValid = false;
    }
    return isValid;
  };

  // Submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      fullname,
      phone,
      email,
      usertype,
      username,
      password,
    };

    registerUserApi(data).then((res) => {
      if (res.data.success === false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        window.location = "/login";
      }
    });
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="register__container d-flex justify-content-between">
              <div className="register__img">
                <img src={registerImg} alt="" />
              </div>

              <div className="register__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Register</h2>

                <Form>
                  <FormGroup>
                    <input
                      onChange={handleFullname}
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                    />
                    {fullnameError && (
                      <p className="text__danger">{fullnameError}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <input
                      onChange={handlePhone}
                      type="text"
                      className="form-control"
                      placeholder="Phone"
                    />
                    {phoneError && <p className="text__danger">{phoneError}</p>}
                  </FormGroup>
                  <FormGroup>
                    <input
                      onChange={handleEmail}
                      type="text"
                      className="form-control"
                      placeholder="Email"
                    />
                    {emailError && <p className="text__danger">{emailError}</p>}
                  </FormGroup>
                  <FormGroup>
                    <input
                      onChange={handleUsername}
                      type="text"
                      className="form-control"
                      placeholder="Username"
                    />
                    {usernameError && (
                      <p className="text__danger">{usernameError}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <select onChange={handleUserType} className="form-control">
                      <option value="">Select Option</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                    </select>
                    {userTypeError && (
                      <p className="text__danger">{userTypeError}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <input
                      onChange={handlePassword}
                      type="password"
                      className="form-control"
                      placeholder="Password"
                    />
                    {passwordError && (
                      <p className="text__danger">{passwordError}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <input
                      onChange={handleConfirmPassword}
                      type="password"
                      className="form-control"
                      placeholder="Confirm Password"
                    />
                    {confirmpasswordError && (
                      <p className="text__danger">{confirmpasswordError}</p>
                    )}
                  </FormGroup>
                  <ReCapthca
                    sitekey="YOUR_SITE_KEY"
                    onChange={(val) => setCapValue(val)}
                    className="mb-3"
                  />

                  <Button
                    disabled={!capValue}
                    className="btn secondary__btn auth__btn"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Register
                  </Button>
                </Form>

                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
