import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Image, Input, Spin } from "antd";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  }

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

const Register = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      if (image) {
        const formData = new FormData();

        formData.append("file", image);
        formData.append("upload_preset", "crypto_upload");
        await axios
          .post(
            "https://api.cloudinary.com/v1_1/shadowaditya/image/upload",
            formData
          )
          .then((res) => {
            setImageUrl(res?.data?.secure_url);
            newUser.profile = res?.data?.secure_url;
          })
          .catch((err) => console.log(err));
      }
      return axios
        .post("http://localhost:8090/api/Register", newUser)
        .then(() => navigate("/"))
        .catch((err) => console.log(err));
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
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
        }}
      >
        {mutation.isLoading && <Spin tip="Loading..." />}
        {mutation.isError && <Alert message="Error" type="error" />}
        {mutation.isSuccess && (
          <Alert message="Registration successful!" type="success" />
        )}
        <h1 className="text-4xl font-bold mb-11 text-center">Register</h1>
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
            label="Name"
            name="name"
            validateStatus={formik.errors.name ? "error" : ""}
            help={formik.errors.name}
          >
            <Input
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
          </Form.Item>

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

          <input
            className="mb-4 w-full rounded-sm py-3 px-4 cursor-pointer border-none "
            name="profile"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={mutation.isPending}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        {imageUrl && (
          <Image
            width={80}
            height={80}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              margin: "0 auto",
            }}
            src={imageUrl}
          />
        )}
        <span>
          Already have An Account{" "}
          <Link className="text-blue-500" to={"/"}>
            Login
          </Link>
        </span>
      </Card>
    </>
  );
};

export default Register;
