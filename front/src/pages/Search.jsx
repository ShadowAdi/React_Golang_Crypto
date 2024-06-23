import { Card, Flex } from "antd";
import Coin from "../components/Coin";
import { useQuery } from "@tanstack/react-query";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import Meta from "antd/es/card/Meta";
import { useParams } from "react-router-dom";
import {  SearchApi } from "../api/SearchApi";

const Search = () => {
    let {query}=useParams()
    query=query.toLowerCase()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["SearchCoins",query],
    queryFn: ()=>SearchApi(query),
  });

    if (isLoading) {
      return (
        <div className="w-[70vw] min-h-[80vh]  pl-4 pr-16 py-6 pb-12 bg-white items-center justify-center gap-12  rounded-md flex flex-col  ">
          <ClimbingBoxLoader color="#36d7b7" />
          <span>Loading...</span>
        </div>
      );
    }

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
        <Meta title="There is A Server Error" description={error?.message || "There is error in server...Please Come Back later"} />
      </Card>
      );
    }

  if (!Array.isArray(data?.coins)) {
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
        <Meta title="There are no  Coins" description={"Error is server"} />
      </Card>
    );
  }


  return (
    <div className="w-[90vw] min-h-[80vh]  pl-4 pr-16 py-6 pb-12 bg-white gap-12  rounded-md flex flex-col  ">
      <Flex
        style={{
          maxWidth: "100%",
          display:"flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          gap: "42px",
        }}
      >
        {data?.coins?.map((d, i) => {
          return <Coin key={i} d={d} search={true} />;
        })}
      </Flex>
    </div>
  );
};

export default Search;
