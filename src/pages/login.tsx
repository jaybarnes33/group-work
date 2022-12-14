//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import Typography from "../components/Atoms/Typography";
import FormWrapper from "../components/Organisms/Layout/FormWrapper";
import styles from "../styles/form.module.scss";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { setAccessToken } from "@/misc/token";
import UnAuthContent from "@/components/Auth/UnAuthContent";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import config from "../config";

import "react-toastify/dist/ReactToastify.css";
// import { useDispatch } from "@/redux/store";
// import { userAuthenticated } from "@/reduxFeatures/authState/authStateSlice";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [displayPassword, setDisplayPassword] = useState(false);

  // const dispatch = useDispatch();

  const [message, setMessage] = useState({ message: "", variant: "" });

  useEffect(() => {
    // clear message
    const messageTimeout =
      message.message !== "" &&
      setTimeout(() => setMessage({ message: "", variant: "" }), 3500);

    return () => {
      clearTimeout(messageTimeout);
    };
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      setLoading(true);
      const { data } = await axios.post(`${config.serverUrl}/api/auth`, {
        ...formData,
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setAccessToken(data.accessToken);
      toast.success("Authentication successful", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 7000,
      });

      let push2Page = JSON.parse(sessionStorage.getItem("pageB4Login"))
        ? JSON.parse(sessionStorage.getItem("pageB4Login"))
        : "/feed";
      sessionStorage.removeItem("pageB4Login");

      router.push(push2Page);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError;
        if (serverError.response) {
          // setMessage(serverError.response.data.message as unknown as string);
          //  let returnedErrorKey = serverError.response.data.key;
          if (serverError.response?.data === "Something went wrong") {
            toast.error("Authentication Failed", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 7000,
            });
          } else {
            toast.error(serverError.response.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 7000,
            });
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <UnAuthContent>
      <ToastContainer />
      <Head>
        <title>Login</title>
      </Head>
      <FormWrapper
        form={
          <div>
            {message.message && (
              <Alert
                variant={message.variant}
                style={{ textTransform: "capitalize" }}
              >
                {message.message.replace("_", " ")}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label> Email</Form.Label>
                <Form.Control
                  placeholder="Enter email"
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label> Password</Form.Label>
                <div className="row">
                  <div className="col-12">
                    <Form.Control
                      placeholder="Enter password"
                      name="password"
                      type={displayPassword ? "text" : "password"}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  {/* ++++++++++++++++++++++++++++++++ */}
                  <div
                    className="col-1 btn"
                    style={{
                      marginLeft: "-3.5rem",
                      fontSize: "1.5rem",
                      marginTop: "-.3rem",
                    }}
                    onClick={() => setDisplayPassword(!displayPassword)}
                  >
                    <Form.Text>
                      {displayPassword ? (
                        <AiOutlineEye />
                      ) : (
                        <AiOutlineEyeInvisible />
                      )}
                    </Form.Text>
                  </div>
                </div>
              </Form.Group>
              <Form.Text className="d-flex justify-content-end text-primary">
                <Link href="./forgotPassword">Forgot password?</Link>
              </Form.Text>
              <Button
                variant="primary"
                className="d-flex mx-auto mt-3"
                type="submit"
              >
                Log In{" "}
                {loading && (
                  <div
                    className="spinner-grow spinner-grow-sm text-light"
                    role="status"
                  ></div>
                )}
              </Button>
            </Form>
          </div>
        }
      />
    </UnAuthContent>
  );
};

export default Login;
