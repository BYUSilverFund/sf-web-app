import React, { useState } from "react";
//import components
import TeamCard from "@/components/TeamCard";

// grad fund images
import ZachBancroft from "@/images/zachary_bancroft.jpg";
import ErikChristiansen from "@/images/erik_christiansen.jpg";
import ElizabethHall from "@/images/elizabeth-hall.jpg";
import JosephLunt from "@/images/joseph-lunt.jpg";
// Quantitative images
import BrandonWaits from "@/images/brandon_waits.jpg";
import DipeshGhimire from "@/images/dipesh-ghimire.jpg";
import AndrewHall from "@/images/andrew-hall.jpg";
// Undergraduate images
import BrendanPricer from "@/images/brendan_pricer.jpg";
import HudsonVogel from "@/images/hudson-vogel.jpg";
import KyleMarsh from "@/images/kyle-marsh.jpg";

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
            headShot={BrendanPricer.src}
            name="Brendan Pricer"
            position="Undergraduate"
            linkedIn="https://www.linkedin.com/in/brendan-pricer/"
          />
          <TeamCard
            headShot={HudsonVogel.src}
            name="Hudson Vogel"
            position="Undergraduate"
            linkedIn="https://www.linkedin.com/in/hudson-vogel/"
          />
          <TeamCard
            headShot={AndrewHall.src}
            name="Andrew Hall"
            position="Quantitative"
            linkedIn="https://www.linkedin.com/in/andrewhall1124/"
          />
          <TeamCard
            headShot={ElizabethHall.src}
            name="Elizabeth Hall"
            position="Graduate Fund"
            linkedIn="https://www.linkedin.com/in/elizabeth-nelson-hall/"
          />
          <TeamCard
            headShot={ZachBancroft.src}
            name="Zachary Bancroft"
            position="Graduate"
            linkedIn="https://www.linkedin.com/in/zachary-bancroft-2b0a661b8/"
          />
          <TeamCard
            headShot={JosephLunt.src}
            name="Joseph Lunt"
            position="Graduate Fund"
            linkedIn="https://www.linkedin.com/in/joseph-lunt-54740bb2/"
          />
          <TeamCard
            headShot={DipeshGhimire.src}
            name="Dipesh Ghimire"
            position="Quantitative"
            linkedIn="https://www.linkedin.com/in/dipesh-ghimire-7348b321b/"
          />
          <TeamCard
            headShot={ErikChristiansen.src}
            name="Erik Christiansen"
            position="Graduate"
            linkedIn="https://www.linkedin.com/in/erik-christiansen-83b772157/"
          />
          <TeamCard
            headShot={BrandonWaits.src}
            name="Brandon Waits"
            position="Quantitative"
            linkedIn="https://www.linkedin.com/in/brandonwaits/"
          />
        </div>
      )}
      {activeTab === "Advisors" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[3vw] md:gap-[2vw] mb-16">
          <TeamCard
            headShot="https://marriott.byu.edu/msmadmin/securefile/empphoto?pid=17907"
            name="Brandon Bates"
          />
          <TeamCard
            headShot="https://marriott.byu.edu/msmadmin/securefile/empphoto?pid=5290"
            name="Brian Boyer"
          />
          <TeamCard
            headShot="https://marriott.byu.edu/msmadmin/securefile/empphoto?pid=90202"
            name="James Fletcher"
          />
          <TeamCard
            headShot="https://marriott.byu.edu/msmadmin/securefile/empphoto?pid=24423"
            name="Ian Wright"
          />
        </div>
      )}
    </div>
  );
};

export default TeamContainer;
