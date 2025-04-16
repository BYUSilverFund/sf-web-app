import React from "react";
import LinkIn from "@/images/linkedin-blue-no-outline.png";

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}
const FooterSection: React.FC<FooterSectionProps> = ({
  title,
  children,
  className,
}) => {
  const styles = `flex flex-col m-3 space-y-1 ${className}`;
  return (
    <div className={styles}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

const Footer = () => {
  return (
    <div className="bg-gray-300 p-6">
      <div className="flex justify-around flex-wrap m-3">
        <FooterSection title="CONTACT">
          <a
            href="https://marriott.byu.edu/directory/details?id=17907"
            className="text-blue-500 text-sm"
          >
            Brandon Bates
          </a>
          <a href="https://boyer.byu.edu/" className="text-blue-500 text-sm">
            Brian Boyer
          </a>
          <a
            href="https://marriott.byu.edu/directory/details?id=90202"
            className="text-blue-500 text-sm"
          >
            James Fletcher
          </a>
          <a
            href="https://marriott.byu.edu/directory/details?id=24423"
            className="text-blue-500 text-sm"
          >
            Ian Wright
          </a>
          <a href="mailto:silverfund@byu.edu" className="text-blue-500 text-sm">
            silverfund@byu.edu
          </a>
        </FooterSection>
        <FooterSection title="QUICK LINKS">
          <a
            href="https://byu.sharepoint.com/sites/silverfund-wiki"
            className="text-blue-500 text-sm"
          >
            Silver Fund Class Wiki
          </a>
          <a
            href="https://marriott.byu.edu/mba/career/accelerated-learning/silver-fund/"
            className="text-blue-500 text-sm"
          >
            Marriott School Class Info
          </a>
          <a href="https://marriott.byu.edu/" className="text-blue-500 text-sm">
            Marriott School Home
          </a>
          <a href="https://www.byu.edu/" className="text-blue-500 text-sm">
            BYU Home
          </a>
        </FooterSection>
        <FooterSection title="CONNECT" className="items-center">
          <a
            href="https://www.linkedin.com/company/byu-silver-fund/"
            className=""
          >
            <img
              src={LinkIn.src}
              alt="linkedIn logo"
              className="w-[20px]"
            ></img>
          </a>
          <a href="https://twitter.com/byusilverfund" className="text-2xl">
            𝕏
          </a>
        </FooterSection>
      </div>
      <p className="text-center pt-6 text-sm">
        © 2025 Silver Fund | All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
