import React, { useState } from "react";
//import components
import TeamCard from "@/components/TeamCard";

// grad fund images
import MichaelRhoton from "@/images/fund-members/michael-rhoton.png";
import CashClark from "@/images/fund-members/cash-clark.jpg";
// Quantitative images
import AndyCriddle from "@/images/fund-members/andy-criddle.jpg";
// Undergraduate images
import JonathanLambert from "@/images/fund-members/jonathan-lambert.jpg";
// fund advisor images
import BrandonBates from "@/images/fund-advisors/brandon-bates.jpg";
import BrianBoyer from "@/images/fund-advisors/brian-boyer.jpg";
import JamesFletcher from "@/images/fund-advisors/james-fletcher.jpg";
import IanWright from "@/images/fund-advisors/ian-wright.jpg";

const TeamContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Presidents");

  return (
    <div className="flex flex-col flex-wrap justify-center p-5 md:p-10 lg:p-20 text-black">
      <h3 className="p-2 mb-8 sectionTitle">Team Spotlights</h3>
      <div className="flex justify-center mb-10">
        <button
          className={`px-4 py-2 mx-2 text-black ${
            activeTab === "Presidents" ? "underline" : "no-underline"
          }`}
          onClick={() => setActiveTab("Presidents")}
        >
          Fund Presidents
        </button>
        <button
          className={`px-4 py-2 mx-2 text-black ${
            activeTab === "Advisors" ? "underline" : "no-underline"
          }`}
          onClick={() => setActiveTab("Advisors")}
        >
          Advisors
        </button>
      </div>
      <TeamTabContainer activeTab={activeTab} />
    </div>
  );
};

interface TeamTabContainerProps {
  activeTab: string;
}

const TeamTabContainer: React.FC<TeamTabContainerProps> = ({ activeTab }) => {
  return (
    <div className="flex flex-col items-center">
      {activeTab === "Presidents" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[3vw] md:gap-[2vw] mb-16">
          <TeamCard
            headShot={AndyCriddle.src}
            name="Andy Criddle"
            position="Quantitative Fund"
            linkedIn="https://www.linkedin.com/in/andrewcriddle"
          />
          <TeamCard
            name="Grant Rich"
            position="Quantitative Fund"
            linkedIn="https://www.linkedin.com/in/grantjrich/?isSelfProfile=false"
          />
          <TeamCard
            headShot={MichaelRhoton.src}
            name="Michael Rhoton"
            position="Graduate Fund"
            linkedIn="https://www.linkedin.com/in/michaelrhoton/"
          />
          <TeamCard
            headShot={CashClark.src}
            name="Cash Clark"
            position="Graduate Fund"
            linkedIn="https://www.linkedin.com/in/cashclark/"
          />
          <TeamCard
            headShot={JonathanLambert.src}
            name="Jonathan Lambert"
            position="Undergraduate Fund"
            linkedIn="https://www.linkedin.com/in/jonlambert1111/"
          />
          <TeamCard
            name="Christian Evans"
            position="Undergraduate Fund"
            linkedIn="https://www.linkedin.com/in/christian-evans-b98a5427a/"
          />
        </div>
      )}
      {activeTab === "Advisors" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[3vw] md:gap-[2vw] mb-16">
          <TeamCard headShot={BrandonBates.src} name="Brandon Bates" />
          <TeamCard headShot={BrianBoyer.src} name="Brian Boyer" />
          <TeamCard headShot={JamesFletcher.src} name="James Fletcher" />
          <TeamCard headShot={IanWright.src} name="Ian Wright" />
        </div>
      )}
    </div>
  );
};

export default TeamContainer;
