import { Card, Flex, Grid, Row } from "antd";
import Coin from "../components/Coin";
import { useQuery } from "@tanstack/react-query";
import { TrendingApi } from "../api/TrendingApi";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import Meta from "antd/es/card/Meta";

const Trending = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Trend"],
    queryFn: TrendingApi,
  });
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

  if (Array.isArray(data)) {
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
        <Meta title="There are no Saved Coins" description={data} />
      </Card>
    );
  }

  return (
    <div className="w-[70vw] min-h-[80vh]    py-6 pb-12  gap-12   justify-center align-center   rounded-md flex flex-col  ">
      <div className="w-full grid grid-cols-1 items-center align-middle lg:grid-cols-2 gap-6 justify-center">
        {data?.coins?.map((d, i) => {
          return <Coin key={i} d={d} />;
        })}
      </div>
    </div>
  );
};

export default Trending;
