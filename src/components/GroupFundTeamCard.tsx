import type { FC } from "react";

interface GroupFundTeamCardProps {
  groupPhotos: string;
  groupName: string;
  groupDescription?: string;
}

const GroupFundTeamCard: FC<GroupFundTeamCardProps> = ({
  groupPhotos,
  groupName,
  groupDescription,
}) => {
  return (
    <div className="bg-none text-black rounded-lg overflow-hidden w-full h-full">
      <div className="group relative w-full aspect-[3/2]">
        <img
          src={groupPhotos}
          className="absolute inset-0 w-full h-full object-top object-cover grayscale"
          alt={`${groupName} team`}
        />
        <div className="absolute right-0 h-full w-[20%] bg-gradient-to-r from-transparent to-[#002E5D] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>
      <h4 className="text-center text-lg mt-1 font-sans">{groupName}</h4>
      {groupDescription && (
        <p className="text-center font-extralight">{groupDescription}</p>
      )}
    </div>
  );
};

export default GroupFundTeamCard;
