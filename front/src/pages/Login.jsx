import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Spin } from "antd";
import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../context/context";

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length <= 4) {
    errors.password = "Must be more than 4 characters";
  }

  return errors;
};

const Login = () => {
  const { setUser } = useContext(MyContext);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newUser) => {
      return axios
        .post(
          "http://localhost:8090/api/Login",
          { email: newUser?.email, password: newUser?.password },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res?.data && res?.data?.user) {
            const { ID, Name, Email, Profile } = res.data.user;
            localStorage.setItem("token", res?.data?.token);
            localStorage.setItem(
              "user",
              JSON.stringify({ ID, Name, Email, Profile })
            );

            setUser({
              name: Name,
              email: Email,
              profile: Profile,
              id: ID,
            });
            navigate("/"); // Redirect to dashboard after successful login
          }
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err.response?.data?.message || "Login failed");
        });
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "60%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mutation.isLoading && <Spin tip="Loading..." />}
        {mutation.isError && (
          <Alert message={mutation.error.message} type="error" />
        )}
        {mutation.isSuccess && (
          <Alert message="Login successful!" type="success" />
        )}
        <h1 className="text-4xl font-bold mb-11 text-center">Login</h1>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            position: "relative",
          }}
          onFinish={formik.handleSubmit}
        >
          <Form.Item
            label="Email"
            name="email"
            validateStatus={formik.errors.email ? "error" : ""}
            help={formik.errors.email}
          >
            <Input
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            validateStatus={formik.errors.password ? "error" : ""}
            help={formik.errors.password}
          >
            <Input.Password
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={mutation.isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        <span className="text-center text-base">
          {"Don't"} Have an Account{" "}
          <Link style={{ textDecoration: "underline" }} to={"/Register"}>
            Register
          </Link>
        </span>
      </Card>
    </>
  );
};

export default Login;
