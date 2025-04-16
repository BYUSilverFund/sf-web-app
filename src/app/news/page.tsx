// import components
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { SquareSvgTl, SquareSvgBr, SquareSvgTr } from "@/components/SquareSvg";
//import images
import aqr from "@/images/net_trek/net_trek_aqr.jpg";
import candlestick from "@/images/net_trek/net_trek_candlestick.jpg";
import cynosure from "@/images/net_trek/net_trek_cynosure.jpg";
import invesco from "@/images/net_trek/net_trek_invesco.jpg";
import silverpoint from "@/images/net_trek/net_trek_silver_point.jpg";

const Events: React.FC = () => {
  const newsItems = [
    {
      title: "Net Trek",
      date: "May 2024",
      description:
        "Select students from the BYU Silver Fund team visited several asset management firms in New York and Connecticut following the 2024 winter semester. The students represented a variety of academic disciplines including finance, accounting, math, economics, and computer science. All of us on the Silver Fund Team are deeply grateful to all the firms and individuals who generously shared their expertise and made this enriching experience possible.",
      image: aqr,
    },
    {
      title: "Candlestick Capital",
      date: "May 2024",
      description:
        "Students visited Candlestick Capital and had insightful discussions with Craig Bench about the firm's operations and investment strategies.",
      image: candlestick,
    },
    {
      title: "Cynosure Group",
      date: "May 2024",
      description:
        "Brian Smedley from Cynosure Group shared valuable insights into the firm's investment approach and hiring practices.",
      image: cynosure,
    },
    {
      title: "Invesco",
      date: "May 2024",
      description:
        "Megan Byrne, Beau Fuchs, and Eliot Honaker from Invesco engaged with students, sharing their experiences and expertise.",
      image: invesco,
    },
    {
      title: "Silverpoint",
      date: "May 2024",
      description:
        "JT Davis and Derek Staples from Silverpoint provided an overview of the firm's operations and investment philosophy.",
      image: silverpoint,
    },
  ];

  return (
    <div className="bg-gray-50 relative overflow-hidden">
      <SquareSvgTl className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none" />
      <SquareSvgTr className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none" />
      <SquareSvgBr className="absolute bottom-0 left-0 w-full h-auto z-0 pointer-events-none" />
      <h3 className="title mt-10 mb-20">News</h3>
      <div className="p-4 gap-10 w-3/4 mx-auto space-y-20 z-10">
        {newsItems.map((item, index) => (
          <NewsCard
            key={item.title}
            image={item.image.src}
            title={item.title}
            description={item.description}
            left={index % 2 === 0}
          />
        ))}
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default Events;
