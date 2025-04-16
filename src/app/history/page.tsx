//import components
import { SquareSvgTl, SquareSvgTr, SquareSvgBl } from "@/components/SquareSvg";

import Harold from "@/images/HaroldSilver.png";

const History: React.FC = () => {
  return (
    <div className="bg-inherit relative p-4">
      <SquareSvgTl className="absolute top-0 right-0 w-full h-auto z-0 pointer-events-none" />
      <SquareSvgBl className="absolute bottom-0 right-0 w-full h-auto z-0 pointer-events-none" />
      <SquareSvgTr className="absolute top-0 right-0 w-full h-auto z-0 pointer-events-none" />
      <h3 className="title m-4">Harold F. Silver</h3>
      <h5 className="text-blue-900 text-center">
        Founder of BYU Silver Fund in 1989
      </h5>
      <br></br>
      <br />
      <div className="max-w-3xl mx-auto z-10">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-base">
              Harold F. Silver, a Salt Lake native, started Silver Fund in 1989
              by donating $274,000 dollars to Brigham Young University for
              university scholarships. The fund has been since used as a tool to
              teach students the principles of investing.
            </p>
            <br />
            <p className="text-base">
              Harold F. Silver was a noted inventor and industrialist. One of
              his many inventions was the continuous mining machine, which
              revolutionized coal mining. Because of that, he was cited by
              Time-Life Books as one of the 250 greatest inventors in history.
              But his impact also extended beyond industry. A dedicated
              philanthropist, Silver gave institutions, including the endowment
              of scholarships at Brigham Young University.
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-bold">Harold F. Silver</h4>
            <br />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <img src={Harold.src} alt="" className="w-full" />
            </div>
            <div className="col-span-2">
              <div className="text-base mt-[-20px]">
                <p>
                  A son of Joseph A. and Elizabeth Farnes Silver, he was born in
                  Salt Lake City on March 15, 1901. He attended Riverside
                  Elementary School and LDS High School. He studied at Columbia
                  University, New York City, then took pre-law courses at the
                  University of Utah, Salt Lake City.
                </p>
                <p>
                  At the age of 21, Mr. Silver became chief engineer of the
                  Ogden Iron Works. He invented a non-flammable dry cleaning
                  process, sugar beet piling equipment, the continuous coal
                  mining machine, the first commercially successful continuous
                  diffuser for sugar beets, the first modern continuous cane
                  sugar diffuser, the continuous centrifugal cone press, and the
                  coal drier.
                </p>
                <p>
                  After designing the sugar beet piling machinery, Mr. Silver
                  moved his family to Denver in 1934. He founded the
                  Silver-Roberts Iron Works with Fred Roberts. In 1940, he
                  bought out his partner and changed the company's name to
                  Silver Engineering Works.
                </p>
              </div>
            </div>
          </div>
          <div className="text-base">
            <p>
              Later he formed Silver Steel Co., a steel and aluminum
              distribution network throughout the Mountain West, with a plant in
              Salt Lake City.
            </p>
            <p>
              After selling Silver Engineering Works and Silver Steel (divisions
              of the Silver Corp.) to Amfac of Hawaii in 1965, he developed a
              computerized stock evaluation program called Markedex.
            </p>
            <p>
              Mr. Silver was a prominent Denver civic leader. He was chairman of
              the Denver Area Community Chest and of the Area Council, Boy
              Scouts of America. He was the honorary vice chairman of the Mile
              High United Fund.
            </p>
            <p>
              He received many awards for community service, including the Jesse
              Knight Industrial Citizenship Award by BYU, the Mile High Sertoma
              Club Serve to Mankind Award in 1961, the Regis College “Civis
              Princeps” (first citizen) medal, the National Conference of
              Christians and Jews Brotherhood Award, the 1974 public service
              award of the Colorado Association of Commerce and Industry and the
              Denver Clinic 1978 distinguished service award.
            </p>
            <p>
              He endowed the Harold F. Silver Chair of Finance and Management in
              BYU’s School of Management. He established the Madelyn Stewart
              Silver and Ruth Smith Silver Fund for student scholarships at BYU.
            </p>
            <p>Deseret News September 1984 (with modification)</p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default History;
