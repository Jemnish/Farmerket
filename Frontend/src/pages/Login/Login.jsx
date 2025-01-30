import React, { useState } from "react";
import { toast } from "react-toastify";
import ReCaptcha from "react-google-recaptcha";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify"; // Import DOMPurify for XSS protection
import "../../styles/Login.css";
import { generateOtpApi, loginUserApi, verifyEmailOtpApi } from "../../api/Api";
import loginImg from "../../assets/images/login_cover.jpg";
import userIcon from "../../assets/images/user.png";

const Login = () => {
  const navigate = useNavigate();

  // State for login credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for OTP verification
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [capValue, setCapValue] = useState(null);

  // Error states
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");

  // Function to sanitize user input before setting state
  const sanitizeInput = (input) => {
    const sanitized = DOMPurify.sanitize(input);
    console.log("Sanitized input:", sanitized); // Log sanitized input to check
    return sanitized;
  };

  // Validation function
  const validateFields = () => {
    let isValid = true;
    if (username.trim() === "") {
      setUsernameError("Username is required");
      isValid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    }
    return isValid;
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    // Sanitize inputs before sending them to the server
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    const data = { username: sanitizedUsername, password: sanitizedPassword };

    try {
      const res = await loginUserApi(data);
      if (!res.data.success) {
        toast.error(res.data.message);
      } else {
        toast.success("Credentials Verified! Sending OTP...");
        await sendOtpRequest(); // Send OTP after credentials are verified
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  // Send OTP request
  const sendOtpRequest = async () => {
    try {
      const res = await generateOtpApi({ username: sanitizeInput(username) });
      if (res.data.success) {
        setShowOtpField(true);
        setOtpSent(true);
        toast.success("OTP sent to your email.");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
    }
  };

  // Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }

    try {
      const res = await verifyEmailOtpApi({
        username: sanitizeInput(username),
        otp: sanitizeInput(otp),
      });
      if (res.data.success) {
        toast.success("Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.userData));

        const user = res.data.userData;
        navigate(user.isAdmin ? "/admin/dashboard" : "/");
      } else {
        setOtpError("Invalid OTP. Please try again.");
        toast.error("Invalid OTP.");
      }
    } catch (error) {
      toast.error("OTP verification failed.");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="Login" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="User" />
                </div>
                <h2>Login</h2>

                <Form>
                  {/* Username Field */}
                  <FormGroup>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => {
                        setUsername(sanitizeInput(e.target.value));
                        setUsernameError("");
                      }}
                    />
                    {usernameError && (
                      <p className="text-danger">{usernameError}</p>
                    )}
                  </FormGroup>

                  {/* Password Field */}
                  <FormGroup>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(sanitizeInput(e.target.value));
                        setPasswordError("");
                      }}
                    />
                    {passwordError && (
                      <p className="text-danger">{passwordError}</p>
                    )}
                  </FormGroup>

                  <ReCaptcha
                    sitekey="6LeaDMQqAAAAADPApk-XzX4KUUeZRv8lAchrlY38"
                    onChange={(val) => setCapValue(val)}
                    className="mb-3"
                  />

                  {/* Login Button */}
                  <Button
                    disabled={!capValue}
                    className="btn secondary__btn auth__btn"
                    type="submit"
                    onClick={handleLoginSubmit}
                  >
                    Login
                  </Button>
                </Form>

                {/* OTP Verification Field (Appears Only After Login Success) */}
                {showOtpField && (
                  <Form onSubmit={handleOtpSubmit}>
                    <FormGroup>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => {
                          setOtp(sanitizeInput(e.target.value));
                          setOtpError("");
                        }}
                      />
                      {otpError && <p className="text-danger">{otpError}</p>}
                    </FormGroup>

                    <Button
                      className="btn secondary__btn auth__btn"
                      type="submit"
                    >
                      Verify OTP
                    </Button>
                  </Form>
                )}

                <p>
                  Don't have an account? <Link to="/register">Create</Link>
                </p>
                <p>
                  <Link to="/forgotpassword">Forgot Password?</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
