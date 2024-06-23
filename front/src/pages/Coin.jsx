/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import { SingleCoinApi } from "../api/SearchApi";
import { Card } from "antd";
import { useState } from "react";
// import { ChartHistory, data } from "./dummy";
import Tab1 from "../components/Tab1";
import Tab2 from "../components/Tab2";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CoinChart, SingleCoinApi } from "../api/SearchApi";
import Meta from "antd/es/card/Meta";

const Coin = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");
  const [type, setType] = useState("prices");
  const [days, setDays] = useState(7);
  const { id } = useParams();

  const { data: ChartHistory } = useQuery({
    queryKey: ["charts", id, days],
    queryFn: () => CoinChart(id,days),
  });



  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };
  const { data } = useQuery({
    queryKey: ["SingleCoin", id],
    queryFn: () => SingleCoinApi(id),
  });
  let convertedData;

  if (ChartHistory) {
    convertedData = ChartHistory[type]?.map((item) => {
      return {
        data: new Date(item[0]).toLocaleDateString(),
        [type]: item[1],
      };
    });
  }

  const tabList = [
    {
      key: "tab1",
      tab: "Data",
    },
    {
      key: "tab2",
      tab: "Chart",
    },
  ];
  const contentList = {
    tab1: <Tab1 data={data} />,
    tab2: (
      <Tab2
        convertedData={convertedData}
        type={type}
        setType={setType}
        days={days}
        setDays={setDays}
      />
    ),
  };

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
  }
  if (ChartHistory?.status?.error_code) {
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
  }

  return (
    <div
      className="w-[75%] h-[80%]  flex  items-start justify-center  relative 
     text-white"
    >
      <Card
        style={{
          width: "100%",
          padding: "0.1rem",
          height: "100%",
          background: "#fff",
          color: "white",
        }}
        title={data?.name}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </div>
  );
};

export default Coin;
