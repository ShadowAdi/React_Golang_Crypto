/* eslint-disable react/prop-types */
import { Card, Flex, Image, Tag, Typography } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';

const HighLowIndicator = ({ currentPrice, High, Low }) => {
    const [green, setGreen] = useState();
  
    useEffect(() => {
      let total = High - Low;
      let GreenZone = ((High - currentPrice) * 100) / total;
      setGreen(Math.ceil(GreenZone));
    }, [currentPrice, High, Low]);
  
    return (
      <>
        <span
          className="bg-red-500 h-1.5 rounded-l-lg w-1/2"
          style={{ width: `${100 - green}%` }}
        >
          &nbsp;
        </span>
        <span
          className="bg-green-600 h-1.5 rounded-r-lg w-1/2"
          style={{ width: `${green}%` }}
        >
          &nbsp;
        </span>
      </>
    );
  };
  

const Tab1 = ({data}) => {
  return (
    <Card
    style={{
      width: "100%",
      background: "#fff",
      color:"#000",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Flex
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.8rem",
      }}
    >
      <Flex gap="middle" align="start">
        <Image width={60} height={60} src={data?.image?.large} />
        <Typography style={{ fontSize: "2rem", fontWeight: "bold",color:"#000" }}>
          {data?.name}
        </Typography>
      </Flex>
      <Tag
        style={{
          background: `${
            data?.sentiment_votes_up_percentage >
            data?.sentiment_votes_down_percentage
              ? "#17FF55"
              : "#FF0808"
          }`,
          fontSize: "1.0rem",
          display: "flex",
          padding: "0.4rem 0.9rem",
          cursor: "pointer",
        }}
      >
        {data?.symbol}
      </Tag>
    </Flex>
    <Flex
      gap="middle"
      align="start"
      justify="space-between"
      style={{ width: "100%", marginTop: "2rem" }}
    >
      <Flex vertical>
        <span className="text-base font-normal ">Price</span>
        <h1 className="text-xl font-semibold ">
          ${data?.market_data?.current_price["usd"]}
        </h1>
      </Flex>
      <Tag
        style={{
          background: `${
            data?.sentiment_votes_up_percentage >
            data?.sentiment_votes_down_percentage
              ? "#17FF55"
              : "#FF0808"
          }`,
          fontSize: "1.0rem",
          display: "flex",
          padding: "0.4rem 0.9rem",
          cursor: "pointer",
        }}
      >
        {Number(data?.market_data?.price_change_percentage_24h).toFixed(2)}%
      </Tag>
    </Flex>
    <Flex
      gap="middle"
      align="start"
      justify="space-between"
      style={{ width: "100%", marginTop: "2rem" }}
    >
      <Flex vertical>
        <span className="text-base font-normal ">Market Cap</span>
        <h1 className="text-xl font-semibold ">
          ${data?.market_data?.market_cap["usd"]}
        </h1>
      </Flex>
      <Flex vertical>
        <span className="text-base font-normal text-right ">
          Market Cap Rank
        </span>
        <h1 className="text-xl font-semibold text-right">
          {data?.market_data?.market_cap_rank}
        </h1>
      </Flex>
    </Flex>
    <Flex vertical style={{ marginTop: "2rem" }}>
      <span className="text-base font-normal ">Total Volume</span>
      <h1 className="text-xl font-semibold ">
        ${data?.market_data?.total_volume["usd"]}
      </h1>
    </Flex>
    <div className="w-full flex mt-4 justify-between">
      <HighLowIndicator
        currentPrice={data?.market_data?.current_price["usd"]}
        High={data?.market_data?.high_24h?.usd}
        Low={data?.market_data?.low_24h?.usd}
      />
    </div>
    <Flex
      gap="middle"
      align="start"
      justify="space-between"
      style={{ width: "100%", marginTop: "2rem" }}
    >
      <Flex vertical>
        <span className="text-base font-normal ">Low 24H</span>
        <h1 className="text-xl font-semibold ">
          ${data?.market_data?.low_24h["usd"]}
        </h1>
      </Flex>
      <Flex vertical>
        <span className="text-base font-normal ">High 24H</span>
        <h1 className="text-xl font-semibold ">
          ${data?.market_data?.high_24h["usd"]}
        </h1>
      </Flex>
    </Flex>
    <Flex
      gap="middle"
      align="start"
      justify="space-between"
      style={{ width: "100%", marginTop: "2rem" }}
    >
      <Flex vertical>
        <span className="text-base font-normal ">Max Supply</span>
        <h1 className="text-xl font-semibold ">
          ${data?.market_data?.max_supply}
        </h1>
      </Flex>
      <Flex vertical>
        <span className="text-base font-normal text-right ">
          Circultaing Supply
        </span>
        <h1 className="text-xl font-semibold text-right">
          ${data?.market_data?.circulating_supply}
        </h1>
      </Flex>
    </Flex>
    <Flex
      gap="middle"
      align="start"
      justify="space-between"
      style={{ width: "100%", marginTop: "2rem" }}
    >
      <Flex gap={"3px"} vertical>
        {data?.links?.official_forum_url?.map((url, i) => {
          if (url !== "") {
            return (
              <a
                target="_blank"
                key={i}
                className="p-1 bg-[#57565692] text-[#000000] no-underline
           hover:text-[#202020] rounded-sm	"
              >
                {url}
              </a>
            );
          }
        })}
        {data?.links?.homepage?.map((url, i) => {
          if (url !== "") {
            return (
              <a
                target="_blank"
                key={i}
                className="p-1 bg-[#57565692] text-[#000000] no-underline
           hover:text-[#202020] rounded-sm	"
              >
                {url}
              </a>
            );
          }
        })}
        {data?.links?.whitepaper !== "" && (
          <a
            target="_blank"
            className="p-1 bg-[#57565692] text-[#000000] no-underline
           hover:text-[#202020] rounded-sm	"
          >
            {data?.links?.whitepaper}
          </a>
        )}
        ;
      </Flex>
      <Flex vertical align="end">
        <span className="text-base font-normal text-right mb-1">
          Sentiment Analysis
        </span>
        <Tag
          style={{
            background: "#17FF55",
            fontSize: "0.6rem",
            padding: "0.4rem 0.6rem",
            cursor: "pointer",
            textAlign: "right",
            width: "fit-content",
          }}
        >
          {data?.sentiment_votes_up_percentage}% <CaretUpOutlined />
        </Tag>
        <Tag
          style={{
            background: "#FF0808",
            fontSize: "0.6rem",
            padding: "0.4rem 0.6rem",
            cursor: "pointer",
            textAlign: "right",
            width: "fit-content",
            marginTop: "0.3rem",
          }}
        >
          {data?.sentiment_votes_up_percentage}% <CaretDownOutlined />
        </Tag>
      </Flex>
    </Flex>
  </Card>
  )
}

export default Tab1
