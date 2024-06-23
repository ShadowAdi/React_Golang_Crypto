import { Menu, Row, Col, Layout, Image, Button, Modal, Flex, Drawer } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputComp from "./InputComp";
import { MyContext } from "../context/context";
import Cookies from "js-cookie";
import "./Search.css";
import { MenuFoldOutlined } from "@ant-design/icons";
const { Header: AntHeader } = Layout;

const Header = () => {
  const [current, setCurrent] = useState("Home");
  const { user, setUser } = useContext(MyContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const items = [
    {
      key: "Home",
      label: user && <Link to={"/"}>Home</Link>,
      responsive: ["sm"],
    },
    {
      key: "Trending",
      label: user && <Link to={"/Trending"}>Trending</Link>,
      responsive: ["sm"],
    },
    {
      key: "Saved",
      label: user && <Link to={"/Saved"}>Saved</Link>,
      responsive: ["sm"],
    },
  ];

  // useEffect(() => {
  //   const token = Cookies.get();
  //   console.log(token)
  //   if (token) {
  //     axios
  //       .get("http://localhost:8090/api/Validate", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true, // Ensure credentials are included
  //       })
  //       .then((response) => {
  //         console.log(response)
  //         const userData = response.data; // Assuming response.data contains user details
  //         setUser({
  //           name: userData.Name,
  //           email: userData.Email,
  //           profile: userData.Profile,
  //           ID: userData.ID,
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user data", error);
  //       });
  //   }
  // }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const navigate = useNavigate();

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = () => {
    setUser(null);
    Cookies.remove("token");
    let isToken = localStorage.getItem("token");
    if (isToken) {
      localStorage.removeItem("token");
    }
    let isUser = localStorage.getItem("user");
    if (isUser) {
      localStorage.removeItem("user");
    }

    let isFavouriteCoins = localStorage.getItem("favoriteCoins");
    if (isFavouriteCoins) {
      localStorage.removeItem("favoriteCoins");
    }
    navigate("/");
  };

  return (
    <AntHeader
      style={{
        backgroundColor: "#F2ECFF",
        padding: "0.6rem 0rem",
        width: "100%",
        color: "#fff",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          width: "100%",
          padding: "0 24px",
          background: "#F2ECFF",
          color: "#fff",
          // borderBottom: "1px solid #dadada",
        }}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          style={{
            flex: 1,
            background: "#F2ECFF",
            color: "#fff",
          }}
          className="sm:block hidden"
          items={items}
        />
        <Row className="sm:flex hidden" align="middle" gutter={[16, 0]}>
          {user && <InputComp />}
          {user ? (
            <>
              <Flex align="center">
                <Image
                  id="AvatarImage"
                  style={{ borderRadius: "50%" }}
                  src={user?.profile || user?.Profile}
                />
                <Col onClick={showModal}>
                  <h1 className="font-semibold text-sm cursor-pointer md:text-base text-black">
                    {user?.name || user?.Name}
                  </h1>
                </Col>
              </Flex>

              <Modal
                title="Logout"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>You Sure u Want to Logout...</p>
                <Button onClick={handleLogout}>Logout</Button>
              </Modal>
            </>
          ) : (
            <>
              <Link to={"/"}>
                <Button> Login</Button>
              </Link>
            </>
          )}
        </Row>
        <span className="sm:hidden  justify-between h-fit text-black flex w-full">
          <MenuFoldOutlined onClick={showDrawer} size={26} />
          {user ? (
            <>
              <Flex align="center" gap={6}>
                <Image
                  id="AvatarImage"
                  style={{ borderRadius: "50%" }}
                  src={user?.profile || user?.Profile}
                />
                <Col onClick={showModal}>
                  <h1 className="font-semibold text-sm cursor-pointer md:text-base text-black">
                    {user?.name || user?.Name}
                  </h1>
                </Col>
              </Flex>

              <Modal
                title="Logout"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>You Sure u Want to Logout...</p>
                <Button onClick={handleLogout}>Logout</Button>
              </Modal>
            </>
          ) : (
            <>
              <Link to={"/"}>
                <Button> Login</Button>
              </Link>
            </>
          )}
        </span>
        <Drawer title="Basic Drawer"  onClose={onClose} open={open}>
        <Flex vertical> 

       <Link to={"/"}>Home</Link>
       <Link to={"/Trending"}>Trending</Link>
       <Link to={"/Saved"}>Saved</Link>
        </Flex>

      </Drawer>
      </Row>
    </AntHeader>
  );
};

export default Header;
