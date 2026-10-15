interface TeamCardProps {
  headShot?: string;
  name: string;
  position?: string;
  linkedIn?: string;
}
const TeamCard: React.FC<TeamCardProps> = ({
  headShot,
  name,
  position,
  linkedIn,
}) => {
  const memberName = name.includes(":")
    ? name.split(":").at(-1)?.trim() || name
    : name;
  const initials = memberName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="bg-none text-black rounded-lg overflow-hidden w-full h-full">
      <div className="group relative w-[40vw] sm:w-[25vw] md:w-[17.5vw] lg:w-[15vw] aspect-[2/3]">
        {headShot ? (
          <img
            src={headShot}
            className="absolute inset-0 w-full h-full object-top object-cover grayscale"
            alt={memberName}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden border border-[#C9D0D7] bg-[#F1F3F5] text-[#002E5D]"
            role="img"
            aria-label={`${memberName} headshot placeholder`}
          >
            <div className="absolute inset-3 border border-[#C9D0D7]" />
            <span className="relative text-5xl font-light md:text-6xl">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute right-0 h-full w-[20%] bg-gradient-to-r from-transparent to-[#002E5D] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        {linkedIn && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-xl bg-[#002E5D] text-white opacity-0 group-hover:opacity-90 scale-100 hover:scale-95 transition-all duration-100">
            <a
              href={linkedIn}
              target="_blank"
              rel="noreferrer"
              className="block px-2 py-1 rounded-md"
            >
              LinkedIn
            </a>
          </div>
        )}
      </div>
      <h4 className="text-center text-lg mt-1 font-sans">{name}</h4>
      <p className="text-center font-extralight">{position}</p>
    </div>
  );
};

export default TeamCard;
