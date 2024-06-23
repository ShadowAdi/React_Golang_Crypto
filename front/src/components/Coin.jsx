/* eslint-disable react/prop-types */

import { Link } from "react-router-dom"

const Coin = ({d,search}) => {

  if (search) {
      return (
        <>
            <Link to={"/Coin/"+d?.id} className="w-[20%] gap-y-1 decoration-transparent	 flex flex-col relative cursor-pointer  bg-[#242323] rounded-md text-white p-4 ">
              <h6 className="font-medium text-base">{d?.name}</h6>
              <h6 className="font-medium text-base">
                Market Rank: <span className="font-medium text-base">{d?.market_cap_rank}</span>
              </h6>
              <h6 className="font-medium text-base">
                Symbol: <span className="font-medium text-base">{d?.symbol}</span>
              </h6>
              <img src={d?.large} className="h-12 w-12 object-cover  rounded-full" alt="" />
            </Link>
        
        </>
          )
  }

  return (
<>
    <Link to={"/Coin/"+d?.item?.id} className="w-[100%] gap-y-1 decoration-transparent sm:min-w-[300px]  	 flex flex-col relative cursor-pointer  bg-[#242323] rounded-md text-white p-4 ">
      <h6 className="font-medium text-base">{d?.item.name}</h6>
      <h6 className="font-medium text-base">
        Market Cap : <span className="font-medium text-base">{d?.item?.data?.market_cap}</span>
      </h6>
      <h6 className="font-medium text-base">
        Market Rank: <span className="font-medium text-base">{d?.item?.market_cap_rank}</span>
      </h6>
      <h6 className="font-medium text-base">
        Price <span className="font-medium text-base">${d?.item?.data?.price?.toFixed(4)}</span>
      </h6>
      <h6 className="font-medium text-base">
        Symbol: <span className="font-medium text-base">{d?.item?.symbol}</span>
      </h6>
      <img
        src={d?.item?.large}
        className="absolute -right-6 sm:top-14 top-24 sm:h-32 sm:w-32 h-16 w-16 rounded-full"
        alt=""
      />
    </Link>

</>
  )
}

export default Coin
