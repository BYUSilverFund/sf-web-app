"use client";
import { useEffect, useState } from "react";
import Spinner from "../../components/LoadingSpinner";

// Material UI imports
// import Papa from "papaparse";

const getUnderCurrentPositionsLambda = async () => {
  const endpoint =
    "https://4dla5qlhqncb5frfksg3ikmjnu0fexxk.lambda-url.us-west-2.on.aws/";
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_LAMBDA_POSITIONS_ENDPOINT not defined");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      fund: "undergrad",
    }),
  });

  const data = await response.json();
  return data;
};

const getMBACurrentPositionsLambda = async () => {
  const endpoint =
    "https://4dla5qlhqncb5frfksg3ikmjnu0fexxk.lambda-url.us-west-2.on.aws/";
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_LAMBDA_POSITIONS_ENDPOINT not defined");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      fund: "grad",
    }),
  });

  const data = await response.json();
  return data;
};

const getBrighamCapitalPositionsLambda = async () => {
  const endpoint =
    "https://4dla5qlhqncb5frfksg3ikmjnu0fexxk.lambda-url.us-west-2.on.aws/";
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_LAMBDA_POSITIONS_ENDPOINT not defined");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      fund: "brigham_capital",
    }),
  });

  const data = await response.json();
  return data;
};

const getQuantPositionsLambda = async () => {
  const endpoint =
    "https://4dla5qlhqncb5frfksg3ikmjnu0fexxk.lambda-url.us-west-2.on.aws/";
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_LAMBDA_POSITIONS_ENDPOINT not defined");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      fund: "quant",
    }),
  });

  const data = await response.json();
  return data;
};

// const getUnderCurrentPositions = async () => {
//   const response = await fetch(
//     process.env.NEXT_PUBLIC_S3_UNDERGRAD_POSITIONS_OBJECT_URL
//   );
//   const reader = response.body.getReader();
//   const result = await reader.read();
//   const decoder = new TextDecoder("utf-8");
//   const csv = decoder.decode(result.value);
//   const results = await Papa.parse(csv, {
//     header: true,
//     skipEmptyLines: true,
//   });
//   const rows = results.data;
//   return rows;
// };

// const getMBACurrentPositions = async () => {
//   const response = await fetch(
//     process.env.NEXT_PUBLIC_S3_GRAD_POSITIONS_OBJECT_URL
//   );
//   const reader = response.body.getReader();
//   const result = await reader.read();
//   const decoder = new TextDecoder("utf-8");
//   const csv = decoder.decode(result.value);
//   const results = await Papa.parse(csv, {
//     header: true,
//     skipEmptyLines: true,
//   });
//   const rows = results.data;
//   return rows;
// };

// const getBrighamCapitalPositions = async () => {
//   const response = await fetch(
//     process.env.NEXT_PUBLIC_S3_BRIGHAM_CAPITAL_POSITIONS_OBJECT_URL
//   );
//   const reader = response.body.getReader();
//   const result = await reader.read();
//   const decoder = new TextDecoder("utf-8");
//   const csv = decoder.decode(result.value);
//   const results = await Papa.parse(csv, {
//     header: true,
//     skipEmptyLines: true,
//   });
//   const rows = results.data;
//   return rows;
// };

// const getQuantPositions = async () => {
//   const response = await fetch(
//     process.env.NEXT_PUBLIC_S3_QUANT_POSITIONS_OBJECT_URL
//   );
//   const reader = response.body.getReader();
//   const result = await reader.read();
//   const decoder = new TextDecoder("utf-8");
//   const csv = decoder.decode(result.value);
//   const results = await Papa.parse(csv, {
//     header: true,
//     skipEmptyLines: true,
//   });
//   const rows = results.data;
//   return rows;
// };

const tickerCheck = (ticker: string) => {
  if (ticker[ticker.length - 1] === "-") {
    ticker = ticker.slice(0, -1);
    return ticker.toUpperCase();
  } else if (ticker.length > 4) {
    return ticker.slice(0, 4).toUpperCase();
  } else {
    return ticker.toUpperCase();
  }
};

const getPosInfo = async (
  positions: { ticker: string; positionvalue: string }[],
) => {
  let total_equity = 0;
  let pos_info: { ticker: string; weight: number }[] = [];
  positions.forEach((position) => {
    total_equity += parseFloat(position.positionvalue);
  });

  const promises = positions.map(async (position) => {
    pos_info.push({
      ticker: tickerCheck(position.ticker),
      weight: (parseFloat(position.positionvalue) / total_equity) * 100,
    });
  });
  await Promise.all(promises);
  pos_info = pos_info.filter((pos) => pos.weight > 0.0);
  pos_info.sort((a, b) => (a.weight < b.weight ? 1 : -1));

  return pos_info;
};

const Home: React.FC = () => {
  interface PositionInfo {
    ticker: string;
    weight: number;
  }

  const [underPosInfo, setUnderPosInfo] = useState<PositionInfo[]>([]);
  const [mbaPosInfo, setMbaPosInfo] = useState<PositionInfo[]>([]);
  const [brighamCapitalPosInfo, setBrighamCapitalPosInfo] = useState<
    PositionInfo[]
  >([]);
  const [quantPosInfo, setQuantPosInfo] = useState<PositionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUnderCurrentPositionsLambda()
        .then((res) => getPosInfo(res))
        .then((res) => setUnderPosInfo(res)),

      getMBACurrentPositionsLambda()
        .then((res) => getPosInfo(res))
        .then((res) => setMbaPosInfo(res)),

      getBrighamCapitalPositionsLambda()
        .then((res) => getPosInfo(res))
        .then((res) => setBrighamCapitalPosInfo(res)),

      getQuantPositionsLambda()
        .then((res) => getPosInfo(res))
        .then((res) => setQuantPosInfo(res)),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="title mt-10 mb-4">Top Holdings</div>
        <p className="text-center mt-4 mb-8">
          Below is a list of the top 10 current positions held by the Silver
          Fund teams.
          <br />
          These include the positions held by the Undergraduate, Graduate,
          Brigham Capital, and Quant teams.
        </p>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="title mt-10 mb-20">Top Holdings</div>
      <p className="text-center mt-4">
        Below is a list of the top 10 current positions held by the Silver Fund
        teams.
        <br />
        These include the positions held by the Undergraduate, Graduate, Brigham
        Capital, and Quant teams.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Undergraduate & Brigham Capital */}
        <div className="max-w-md mx-auto">
          {/* Undergraduate Positions */}
          <div className="text-center text-2xl font-semibold mb-4">
            Undergraduate Positions
          </div>
          <div className="grid grid-cols-3 gap-4">
            {underPosInfo.map((row) => (
              <a
                key={row.ticker}
                href={`https://finance.yahoo.com/quote/${row.ticker}`}
                className="text-blue-900 no-underline"
                target="_blank"
                rel="noreferrer"
              >
                <div className="border-2 border-blue-900 p-2 rounded-xl hover:scale-95 transition-transform flex flex-col items-center">
                  <img
                    src={`/logos/${row.ticker}.png`}
                    alt={row.ticker}
                    className="object-contain max-h-16"
                  />
                  <div className="text-center mt-2">
                    <div className="font-bold">{row.ticker}</div>
                    <div>Weight: {row.weight.toFixed(2)}%</div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Brigham Capital Positions */}
          <div className="text-center text-2xl font-semibold mt-8 mb-4">
            Brigham Capital Positions
          </div>
          <div className="grid grid-cols-3 gap-4">
            {brighamCapitalPosInfo.map((row) => (
              <a
                key={row.ticker}
                href={`https://finance.yahoo.com/quote/${row.ticker}`}
                className="text-blue-900 no-underline"
                target="_blank"
                rel="noreferrer"
              >
                <div className="border-2 border-blue-900 p-2 rounded-xl hover:scale-95 transition-transform flex flex-col items-center">
                  <img
                    src={`/logos/${row.ticker}.png`}
                    alt={row.ticker}
                    className="object-contain max-h-16"
                  />
                  <div className="text-center mt-2">
                    <div className="font-bold">{row.ticker}</div>
                    <div>Weight: {row.weight.toFixed(2)}%</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* MBA & Quant Positions */}
        <div className="max-w-md mx-auto">
          {/* MBA Positions */}
          <div className="text-center text-2xl font-semibold mb-4">
            Graduate Positions
          </div>
          <div className="grid grid-cols-3 gap-4">
            {mbaPosInfo.map((row) => (
              <a
                key={row.ticker}
                href={
                  row.ticker !== "ETF29" && row.ticker !== "cash"
                    ? `https://finance.yahoo.com/quote/${row.ticker}`
                    : row.ticker === "ETF29"
                      ? "https://finance.yahoo.com/quote/%5ERUA?p=^RUA&.tsrc=fin-srch"
                      : undefined
                }
                className="text-blue-900 no-underline"
                target="_blank"
                rel="noreferrer"
              >
                <div className="border-2 border-blue-900 p-2 rounded-xl hover:scale-95 transition-transform flex flex-col items-center">
                  <img
                    src={`/logos/${row.ticker}.png`}
                    alt={row.ticker}
                    className="object-contain max-h-16"
                  />
                  <div className="text-center mt-2">
                    <div className="font-bold">{row.ticker}</div>
                    <div>Weight: {row.weight.toFixed(2)}%</div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Quant Positions */}
          <div className="text-center text-2xl font-semibold mt-8 mb-4">
            Quant Positions
          </div>
          <div className="grid grid-cols-3 gap-4">
            {quantPosInfo.map((row) => (
              <a
                key={row.ticker}
                href={`https://finance.yahoo.com/quote/${row.ticker}`}
                className="text-blue-900 no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="border-2 border-blue-900 p-2 rounded-xl hover:scale-95 transition-transform flex flex-col items-center">
                  <img
                    src={`/logos/${row.ticker}.png`}
                    alt={row.ticker}
                    className="object-contain max-h-16"
                  />
                  <div className="text-center mt-2">
                    <div className="font-bold">{row.ticker}</div>
                    <div>Weight: {row.weight.toFixed(2)}%</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default Home;
