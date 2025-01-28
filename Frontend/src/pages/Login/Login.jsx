import React, { useState } from "react";
import { toast } from "react-toastify";
import ReCapthca from "react-google-recaptcha";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import { loginUserApi } from "../../api/Api";
import loginImg from "../../assets/images/login_cover.jpg";
import userIcon from "../../assets/images/user.png";

const Login = () => {
  const navigate = useNavigate();
  // Making a use sate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [capValue, setCapValue] = useState(null);

  // Making an error state
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // validation
  const validation = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidated = validation();
    if (!isValidated) {
      return;
    }

    const data = {
      username: username,
      password: password,
    };

    try {
      const res = await loginUserApi(data);
      console.log(res.data.message);

      if (res.data.success === false) {
        toast.error(res.data.message);
      } else {
        console.log("ok");

        toast.success(res.data.message);

        localStorage.setItem("token", res.data.token);

        const convertedData = JSON.stringify(res.data.userData);
        localStorage.setItem("userData", convertedData);

        const user = JSON.parse(localStorage.getItem("userData"));
        console.log(user.isAdmin);

        if (user.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Login</h2>

                <Form>
                  <FormGroup>
                    <input
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError("");
                      }}
                      type="text"
                      className="form-control"
                      placeholder="Username"
                    />
                    {usernameError && (
                      <p className="text__danger">{usernameError}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <input
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      type="text"
                      className="form-control"
                      placeholder="Password"
                    />
                    {passwordError && (
                      <p className="text__danger">{passwordError}</p>
                    )}
                  </FormGroup>
                  <ReCapthca
                    sitekey="6LeaDMQqAAAAADPApk-XzX4KUUeZRv8lAchrlY38"
                    onChange={(val) => setCapValue(val)}
                    className="mb-3"
                  />

                  <Button
                    disabled={!capValue}
                    className="btn secondary__btn auth__btn "
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                </Form>

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
