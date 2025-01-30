import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import "../../styles/ForgotPassword.css";
import { forgotPasswordApi, verifyOtpApi } from "../../api/Api";
import forgotPasswordImg from "../../assets/images/forgot_password.jpg";
import userIcon from "../../assets/images/user.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const handleSendOtp = (e) => {
    e.preventDefault();
    const sanitizedPhone = sanitizeInput(phone);

    forgotPasswordApi({ phone: sanitizedPhone })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setIsSent(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          toast.error(error.response.data.message);
        }
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    const data = {
      phone: sanitizeInput(phone),
      otp: sanitizeInput(otp),
      newPassword: sanitizeInput(newPassword),
    };

    verifyOtpApi(data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          toast.error(error.response.data.message);
        }
      });
  };

  const validatePhone = () => {
    let isValid = true;
    if (phone.trim() === "") {
      setPhoneError("Phone is required");
      isValid = false;
    }
    return isValid;
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col lg="8" className="m-auto">
          <div className="forgot__password__container d-flex justify-content-between">
            <div className="forgot__password__img">
              <img src={forgotPasswordImg} alt="Forgot Password" />
            </div>
            <div className="forgot__password__form">
              <div className="user">
                <img src={userIcon} alt="User Icon" />
              </div>
              <h2>Forgot Password</h2>
              <Form>
                <FormGroup>
                  <input
                    disabled={isSent}
                    onChange={(e) => setPhone(sanitizeInput(e.target.value))}
                    type="text"
                    className="form-control"
                    placeholder="Enter your phone"
                  />
                  {phoneError && <p className="text-danger">{phoneError}</p>}
                </FormGroup>
                <Button
                  disabled={isSent}
                  className="btn secondary__btn auth__btn"
                  type="submit"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
                {isSent && (
                  <>
                    <hr />
                    <p>OTP has been sent to {phone} ✅</p>
                    <FormGroup>
                      <input
                        onChange={(e) => setOtp(sanitizeInput(e.target.value))}
                        type="number"
                        className="form-control"
                        placeholder="Enter valid OTP"
                      />
                    </FormGroup>
                    <FormGroup>
                      <input
                        onChange={(e) => setNewPassword(sanitizeInput(e.target.value))}
                        type="password"
                        className="form-control mt-2"
                        placeholder="Set New Password"
                      />
                    </FormGroup>
                    <Button
                      onClick={handleVerifyOtp}
                      className="btn btn-secondary-fp w-100 mt-2"
                    >
                      Verify OTP & Set Password
                    </Button>
                  </>
                )}
              </Form>
              <p>
                Remember your password? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
