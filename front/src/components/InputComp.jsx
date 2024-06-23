import { Button, Col, Input } from "antd";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Search.css"
const InputComp = () => {
  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const textHandler = (e) => {
    setInput(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setInput("");
      navigate(`/search/${input}`);
    }
  };

  return (
    <>
      <Col>
        <Input
        id="inputSearch"
          placeholder="Search"
          onChange={textHandler}
          onKeyPress={handleKeyPress}
          style={{
            position: "relative",
            marginRight: "6px",
            padding: "8px",
          }}
        />
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            setInput("");
            navigate("/Search/" + input);
          }}
          icon={<SearchOutlined />}
        />
      </Col>
    </>
  );
};

export default InputComp;
