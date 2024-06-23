import { Avatar, Card, Space, Table } from "antd";
import { useContext, useState } from "react";
import { MyContext } from "../context/context";
import { useQuery } from "@tanstack/react-query";
import { SavedApi } from "../api/SearchApi";
import { Link } from "react-router-dom";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

const columns = (likedItems, toggleLike) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => {
      return <Link to={"/Coin/" + record?.id}>{text}</Link>;
    },
  },
  {
    title: "Price",
    dataIndex: "current_price",
    key: "current_price",
    render: (value, record) => (
      <Link to={"/Coin/" + record?.id}>{parseInt(value)}</Link>
    ),
  },
  {
    title: "Volume",
    dataIndex: "total_volume",
    key: "total_volume",
  },
  {
    title: "1Hr",
    dataIndex: "price_change_24h",
    key: "price_change_24h",
    render: (value) => value.toFixed(4),
  },
  {
    title: "ATH",
    dataIndex: "ath",
    key: "ath",
    render: (value) => value.toFixed(4),
  },
  {
    title: "ATL",
    dataIndex: "atl",
    key: "atl",
    render: (value) => value.toFixed(4),
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (value, record) => (
      <Link to={"/Coin/" + record.id}>
        <Avatar src={value} />
      </Link>
    ),
  },
  {
    title: "Like",
    key: "like",
    render: (_, record) => (
      <Space size="middle">
        <span onClick={() => toggleLike(record.id)}>
          {likedItems.includes(record.id) ? (
            <HeartFilled style={{ color: "red", cursor: "pointer" }} />
          ) : (
            <HeartOutlined style={{ cursor: "pointer" }} />
          )}
        </span>
      </Space>
    ),
  },
];

const Saved = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPageSize, setPerPageSize] = useState(10);
  const { lovedCoins, setLovedCoins } = useContext(MyContext);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Search", lovedCoins],
    queryFn: () => SavedApi(lovedCoins),
  });
  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const onShowSizeChange = (current, size) => {
    setPerPageSize(size);
    setPageNumber(current);
  };

  const toggleLike = (id) => {
    let updatedFavorites;
    if (lovedCoins.includes(id)) {
      updatedFavorites = lovedCoins.filter((fav) => fav !== id);
    } else {
      // Add coin to favorites
      updatedFavorites = [...lovedCoins, id];
    }
    setLovedCoins(updatedFavorites);
    localStorage.setItem("favoriteCoins", JSON.stringify(updatedFavorites));
  };
  {
    if (isLoading) {
      return (
        <div className="w-[70vw] min-h-[80vh]  pl-4 pr-16 py-6 pb-12 bg-white items-center justify-center gap-12  rounded-md flex flex-col  ">
          <ClimbingBoxLoader color="#36d7b7" />
          <span>Loading...</span>
        </div>
      );
    }
  }

  {
    if (isError) {
      return (
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt="example"
              src="https://t4.ftcdn.net/jpg/02/97/01/65/360_F_297016511_NWrJG1s3mpyjqD3hwdKidfYsvhEnrPm4.jpg"
            />
          }
        >
          <Meta
            title="There is A Server Error"
            description={
              error?.message ||
              "There is error in server...Please Come Back later"
            }
          />
        </Card>
      );
    }
  }

  if (data?.status?.error_code) {
    return (
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            alt="example"
            src="https://t4.ftcdn.net/jpg/02/97/01/65/360_F_297016511_NWrJG1s3mpyjqD3hwdKidfYsvhEnrPm4.jpg"
          />
        }
      >
        <Meta title="Server Error" description={data?.status?.error_message} />
      </Card>
    );
  } else if (!Array.isArray(data)) {
    return (
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            alt="example"
            src="https://t4.ftcdn.net/jpg/02/97/01/65/360_F_297016511_NWrJG1s3mpyjqD3hwdKidfYsvhEnrPm4.jpg"
          />
        }
      >
        <Meta title="There are no Saved Coins" description={data?.message} />
      </Card>
    );
  } else {
    return (
      <Table
        style={{ maxWidth: "80%" }}
        pagination={{
          position: ["bottomCenter"],
          total: data?.coins ? data?.coins.length : 0, // Total number of items (required)
          pageSize: perPageSize, // Number of items per page
          current: pageNumber, // Current page number
          showSizeChanger: true, // Show options to change page size
          showQuickJumper: true, // Show quick jump input
          pageSizeOptions: ["10", "20", "30", "40", "50"], // Options for page size
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`, // Custom total display
          onChange: onChange, // Handle page change
          onShowSizeChange: onShowSizeChange, // Handle page size change
        }}
        scroll={{ y: 400 }}
        columns={columns(lovedCoins, toggleLike)}
        dataSource={data}
      />
    );
  }
};

export default Saved;
