/* eslint-disable react/prop-types */
import { Button, Flex } from 'antd'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
  } from "recharts";
const Tab2 = ({convertedData,type,setType,setDays}) => {
  return (
    <>
        <Flex
          style={{ height: "100%", width: "100%", background: "#f1f1f1" }}
          vertical
        >
          <LineChart width={600} height={400} data={convertedData}>
            <Line
              type="monotone"
              dataKey={type}
              stroke="#0000e6"
              strokeWidth={"1px"}
            />
            <CartesianGrid stroke="#323232" strokeDasharray="5 5" />
            <XAxis dataKey="date" hide />
            <YAxis dataKey={type} hide domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
          </LineChart>
          <Flex gap={12}>
            <Button onClick={()=>setType("prices")}>Price</Button>
            <Button  onClick={()=>setType("market_caps")}>Market Cap</Button>
            <Button  onClick={()=>setType("total_volumes")}>Volume</Button>

            <Button onClick={()=>setDays(7)}>7 Days</Button>
            <Button  onClick={()=>setDays(14)}>14 Days</Button>
            <Button  onClick={()=>setDays(30)}>30 Days</Button>

          </Flex>
        </Flex>
      </>
  )
}

export default Tab2
