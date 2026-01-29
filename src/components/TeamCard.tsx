interface TeamCardProps {
  headShot: string;
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
  return (
    <div className="bg-none text-black rounded-lg overflow-hidden w-full h-full">
      <div className="group relative w-[40vw] sm:w-[25vw] md:w-[17.5vw] lg:w-[15vw] aspect-[2/3]">
        <img
          src={headShot}
          className="absolute inset-0 w-full h-full object-top object-cover grayscale"
          alt="Team Member"
        />
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
