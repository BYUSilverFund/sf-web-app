import React from "react";
import { StaticImageData } from "next/image";
import companyCloud from "@/images/company_cloud_new.png";

const PlacementContainer = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center p-5 md:p-10 lg:p-20">
      <h3 className="p-2 mb-20 sectionTitle">Silver Fund Student Placements</h3>
      <PlacementCard logo={companyCloud} />
    </div>
  );
};

interface PlacementCardProps {
  logo: StaticImageData;
}
const PlacementCard: React.FC<PlacementCardProps> = ({ logo }) => {
  return (
    <div>
      <img src={logo.src} alt="logo" />
    </div>
  );
};

export default PlacementContainer;
