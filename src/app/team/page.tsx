"use client";
import React from "react";
import { useState } from "react";
// components
import TeamCard from "@/components/TeamCard";
import { SquareSvgTl, SquareSvgBr } from "@/components/SquareSvg";
// grad fund images
import MichaelRhoton from "@/images/fund-members/michael-rhoton.png";
import CashClark from "@/images/fund-members/cash-clark.jpg";
// quant fund images
import AndyCriddle from "@/images/fund-members/andy-criddle.jpg";
// undergrad fund images
import HudsonVogel from "@/images/fund-members/hudson-vogel.jpg";
import ChristianBaggaley from "@/images/fund-members/christian-baggaley.jpg";
// fund advisor images
import BrandonBates from "@/images/fund-advisors/brandon-bates.jpg";
import BrianBoyer from "@/images/fund-advisors/brian-boyer.jpg";
import JamesFletcher from "@/images/fund-advisors/james-fletcher.jpg";
import IanWright from "@/images/fund-advisors/ian-wright.jpg";

interface TeamTabContainerProps {
  children: React.ReactNode;
}
const TeamTabContainer: React.FC<TeamTabContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[3vw] md:gap-[2vw] mb-16">
        {children}
      </div>
    </div>
  );
};

interface TeamBioProps {
  name: string;
  img: string;
  bio: string;
  team: string;
}

const TeamBio: React.FC<TeamBioProps> = ({ name, img, bio, team }) => {
  return (
    <div className="flex flex-col md:flex-col justify-start items-center mb-10 p-6">
      <div className="flex-3 text-center mb-4 md:mb-0 md:mr-6 ">
        <img
          alt={name}
          className="w-32 h-32 mx-auto object-cover object-top grayscale"
          src={img}
        />
        <h6 className="text-lg text-gray-700 mt-4 font-semibold">{name}</h6>
        <h4 className="text-md text-gray-500">{team}</h4>
      </div>
      <br></br>
      <div className="w-full md:w-7/10 text-left">
        <p className="text-gray-600 md:ml-8 w-full break-words pr-4">{bio}</p>
      </div>
    </div>
  );
};

const BioTab: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TeamBio
          name="Brandon Bates"
          img={BrandonBates.src}
          bio="Brandon Bates is a seasoned portfolio manager for global macro, equity, and volatility hedge fund strategies. In his present role as Head of Systematic Macro at Magnetar Capital, he focuses on quantitative investment strategies across all asset classes that leverage fundamental economic insights and exploit persistent market frictions and behavioral biases. His efforts join data science methods with economic theory. Previously, he was a member of the hedge fund portfolio management teams at Squarepoint Capital and BlackRock (legacy Barclays Global Investors team). He is an advisor for Cambridge University's MFin Practicum on foreign-exchange and volatility investing and a frequent guest lecturer at the Yale School of Management teaching active foreign exchange investing. Brandon received AM and PhD degrees in financial economics from Harvard University."
          team="Advisor"
        />
        <TeamBio
          name="Brian Boyer"
          img={BrianBoyer.src}
          bio="Brian Boyer is an associate professor of finance at Brigham Young University. His research covers a broad range of topics including style investing and index effects, financial contagion, preferences for lottery-like assets in stocks and options, the performance of private equity in secondary markets, and the relative performance and estimation of factor models. His papers have appeared in leading academic journals including the Journal of Finance and the Review of Financial Studies. He helped establish and continues to organize the annual BYU Red Rock Conference, a respected academic gathering that brings together leading researchers in financial economics each year. The conference has been recognized among the top finance conferences in terms of academic quality. Brian holds a PhD in financial economics from the University of Michigan."
          team="Advisor"
        />
        <TeamBio
          name="James Fletcher"
          img={JamesFletcher.src}
          bio="James Fletcher is an experienced Emerging Markets portfolio manager with a strong history of top quartile fund performance. He is the founder and Chief Investment Officer of Ethos Investment Management. Previously, James was based in Hong Kong as the Director & Senior Portfolio Manager of the EM SMID Cap fund at APG Asset Management, one of the largest EM SMID cap funds in the world. James was previously the Lead Portfolio Manager at Kayne Anderson Rudnick's EM Small Cap fund and worked as a Senior Analyst at Westwood Global Investments. James is Founder and President of the Board of Directors for Young Investors Society which serves over 3000 high schools around the world. James is a frequent poster on LinkedIn with thousands of followers. He holds a BA degree in finance from Brigham Young University and is a CFA charter holder."
          team="Advisor"
        />
        <TeamBio
          name="Ian Wright"
          img={IanWright.src}
          bio="Ian Wright is an assistant professor in the finance department at Brigham Young University where he is the undergraduate finance program director. He is also a visiting professor at the University of Chicago, where he teaches macro finance in the masters of financial math program. Prior to coming to BYU, he was a quantitative macro investor in a £20bn fund at BlackRock in London, where he invested across asset classes and regions. Preceding that he was an Executive Director in the asset allocation research group in the macro department at Goldman Sachs in London. Ian graduated with his Ph.D. from the Department of Economics at Stanford University, where he served as a research assistant to the Working Group on Economic Policy at the Hoover Institution and was a co-editor of the book Government Policies and the Delayed Economic Recovery."
          team="Advisor"
        />
      </div>
    </div>
  );
};

const GradFundTab: React.FC = () => {
  return (
    <>
      <TeamCard
        headShot={MichaelRhoton.src}
        name="Michael Rhoton"
        linkedIn="https://www.linkedin.com/in/michaelrhoton/"
      />
      <TeamCard
        headShot={CashClark.src}
        name="Cash Clark"
        linkedIn="https://www.linkedin.com/in/cashclark/"
      />
    </>
  );
};

const QuantFundTab: React.FC = () => {
  return (
    <>
      <TeamCard
        headShot={AndyCriddle.src}
        name="Andy Criddle"
        linkedIn="https://www.linkedin.com/in/andrewcriddle"
      />

      {/*       <TeamCard
        headShot={GrantRich.src}}
        name="Grant Rich"
        linkedIn="https://www.linkedin.com/in/grantjrich/"
      /> */}
    </>
  );
};

const UndergradFundTab: React.FC = () => {
  return (
    <>
      <TeamCard
        headShot={HudsonVogel.src}
        name="Hudson Vogel"
        linkedIn="https://www.linkedin.com/in/hudson-vogel/"
      />
      <TeamCard
        headShot={ChristianBaggaley.src}
        name="Christian Baggaley"
        linkedIn="https://www.linkedin.com/in/christiantbaggaley/"
      />
    </>
  );
};

const TeamContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Grad Fund");

  return (
    <div className="relative overflow-hidden">
      <SquareSvgTl className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none" />
      <SquareSvgBr className="absolute bottom-0 right-0 w-full h-auto z-0 pointer-events-none" />
      <div className="flex flex-col flex-wrap justify-center p-5 md:p-10 lg:p-20 text-black">
        <h3 className="p-2 mb-8 w-full sectionTitle">Meet the Team</h3>
        <div className="flex flex-wrap justify-center mb-10 w-full">
          <button
            className={`px-4 py-2 mx-2 text-black ${
              activeTab === "Grad Fund" ? "underline" : "no-underline"
            }`}
            onClick={() => setActiveTab("Grad Fund")}
          >
            Grad Fund
          </button>
          <button
            className={`px-4 py-2 mx-2 text-black ${
              activeTab === "Quant Fund" ? "underline" : "no-underline"
            }`}
            onClick={() => setActiveTab("Quant Fund")}
          >
            Quant Fund
          </button>
          <button
            className={`px-4 py-2 mx-2 text-black ${
              activeTab === "Undergrad Fund" ? "underline" : "no-underline"
            }`}
            onClick={() => setActiveTab("Undergrad Fund")}
          >
            Undergrad Fund
          </button>
          <button
            className={`px-4 py-2 mx-2 text-black ${
              activeTab === "Spotlights" ? "underline" : "no-underline"
            }`}
            onClick={() => setActiveTab("Spotlights")}
          >
            Spotlights
          </button>
        </div>
        {activeTab === "Spotlights" && <BioTab />}
        <TeamTabContainer>
          {activeTab === "Grad Fund" && <GradFundTab />}
          {activeTab === "Quant Fund" && <QuantFundTab />}
          {activeTab === "Undergrad Fund" && <UndergradFundTab />}
        </TeamTabContainer>
      </div>
    </div>
  );
};

export default TeamContainer;
