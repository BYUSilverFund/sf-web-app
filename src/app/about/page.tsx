import React from "react";

import companyCloud from "@/images/company_cloud_new.png";
import GradFund from "@/images/headshots/Silver Fund-1-sm.jpg";

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-6 mb-6 bg-inherit pt-[14vh] min-h-screen flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div
          id="student-placements"
          className="flex flex-col justify-around items-center"
        >
          <div className="my-6 mx-4">
            <h4 className="text-2xl font-semibold mb-2">About Us</h4>
            <p className="text-lg leading-relaxed">
              Silver Fund is one of the oldest and largest student-run
              investment funds in the nation. It is managed by BYU students from
              finance, accounting, economics, and math, with guidance from
              faculty in the Marriott School Finance Department. Students
              conduct the research, make the investment decisions, and own the
              results. Many alumni have become leaders in the finance industry.
            </p>
          </div>
          <div className="my-6 rounded-md">
            <img
              src={GradFund.src}
              alt="Companies that Silver Fund alumni have gone on to work for"
              className=""
            />
          </div>
        </div>
        <div
          id="fund-types"
          className="flex flex-col justify-around items-center"
        >
          <div className="my-6">
            <img
              src={companyCloud.src}
              alt="Companies that Silver Fund alumni have gone on to work for"
              className=""
            />
          </div>
          <div id="classes" className="my-6 mx-4">
            <h4 className="text-2xl font-semibold mb-2">Classes</h4>
            <p className="text-lg leading-relaxed">
              There are 3 different funds/classes: an undergraduate fundamental
              fund (composed primarily of students in finance, economics, and
              accounting), a graduate fundamental fund (primarily composed of
              MBA and MAcc students), and a quant fund (primarily composed of
              students from economics, finance, math, and computer science). All
              majors are welcome to apply. All student applications are
              evaluated by the supervising faculty which include Brian Boyer,
              Ian Wright, James Fletcher, and Brandon Bates.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center mx-4">
          <h4 className="text-2xl font-semibold mb-2">How to Apply</h4>
          <p className="text-lg leading-relaxed">
            Participation in the class generally requires a commitment of two
            semesters and six credits (one class each semester). An information
            session is organized for interested applicants approximately one
            month prior to the conclusion of both the Fall and Winter semesters.
            During this info session, a digital application form is made
            available. Announcements about the information session are
            disseminated through multiple channels within the Finance Society,
            Economics, and Math departments.
          </p>
        </div>
        <div className="flex flex-col mx-4">
          <h4 className="text-2xl font-semibold mb-2">
            Recommended Classes/Experience
          </h4>
          <ul className="list-inside space-y-2">
            <li className="text-lg pl-4">
              Undergraduate Fund - Brigham Capital, Finance 410 (Investments)
            </li>
            <li className="text-lg pl-4">
              Graduate Fund - MBA 622 (Investments)
            </li>
            <li className="text-lg pl-4">
              Quantitative Fund - Finance 585R (Pre-PhD Finance Seminar)
            </li>
          </ul>
        </div>
        <div className="mx-4">
          <h4 className="text-2xl font-semibold mb-2 mt-8">
            Interested in Joining?
          </h4>
          <p className="text-lg leading-relaxed">
            Reach out to any of the faculty advisors or student leaders. Silver
            Fund is always looking for new members.
          </p>
        </div>
        <div className="mx-4">
          <h4 className="text-2xl font-semibold mb-2 mt-8">
            Selection Criteria:
          </h4>
          <ul className="list-inside space-y-2">
            <li className="text-lg pl-4">
              GPA in first year finance, accounting, and economics classes
            </li>
            <li className="text-lg pl-4">Prior work experience</li>
            <li className="text-lg pl-4">Secured summer internship</li>
            <li className="text-lg pl-4">
              Interest in pursuing a financial markets career
            </li>
            <li className="text-lg pl-4">A team-oriented personality</li>
          </ul>
        </div>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default About;
