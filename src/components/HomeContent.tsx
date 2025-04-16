"use client";
import { StaticImageData } from "next/image";
import React, { ReactNode } from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
// import components
import PlacementContainer from "./Placements";
import TeamContainer from "./TeamContainer";
import {
  SquareSvgBr,
  SquareSvgTl,
  SquareSvgBl,
  SquareSvgTr,
} from "./SquareSvg";
// import packages
import gsap from "gsap"; // for animations
// images import for the positions
import CCCSLogo from "@logo/CCCS.png";
import RMDLogo from "@logo/RMD.png";
import MODGLogo from "@logo/MODG.png";
import CAKELogo from "@logo/CAKE.png";
import RSGLogo from "@logo/RSG.png";
import NFLXLogo from "@logo/NFLX.png";
import MELILogo from "@logo/MELI.png";
import VIKLogo from "@logo/VIK.png";

export default function HomeContent() {
  return (
    <div id="home-content" className="bg-inherit relative">
      <div className="relative w-full h-full">
        <SquareSvgTl className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none" />
        <SquareSvgBr className="absolute bottom-0 left-0 w-full h-auto z-0 pointer-events-none" />
        <div className="flex flex-col items-center justify-center w-full sm-h[vh] z-10">
          <br></br>
          <div className="flex flex-col items-center justify-center h-full w-full lg:flex-row lg:justify-center lg:items-center my-10 py-10">
            <Slogan />
          </div>
          <Investments />
        </div>
        <br></br>
        <br></br>
        <div className="mt-20 flex flex-col items-center justify-around h-full w-full lg:flex-row lg:items-center relative z-10">
          <ScrollAnimation />
        </div>
      </div>
      <div className="relative w-full h-full">
        <SquareSvgTr className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none" />
        <TeamContainer />
      </div>
    </div>
  );
}

const Slogan = () => {
  // for fade in and up animation
  const itemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (itemsRef.current) {
      const elements = Array.from(itemsRef.current.children) as HTMLElement[]; // Convert children of ref to an array
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, []);
  return (
    <div
      className="flex items-center flex-col justify-center h-full w-4/5 lg:flex-3"
      ref={itemsRef}
    >
      <h3 className="my-14 lg:mx-10 text-blue title text-center">
        BYU's Premier Student-Led Investment Group
      </h3>
      <ChipsContainer />
    </div>
  );
};

interface ChipProps {
  text: string;
  href: string;
}

const Chip: React.FC<ChipProps> = ({ text, href }) => {
  return (
    <a
      className="relative px-4 py-2 pr-1 hover:pr-4 m-2 lg:m-4 border border-[#002E5D] rounded-full text-[#002E5D] transition-all 
        duration-300 overflow-hidden before:absolute before:bottom-0 before:left-0 before:h-full before:w-0 
        before:bg-[#002E5D] before:transition-all before:duration-300 before:rounded-full before:z-[-1] 
        hover:text-white hover:before:w-full after:content-['→'] after:text-white after:w-0 after:overflow-hidden 
        hover:after:w-auto hover:after:ml-2 after:transition-all after:duration-300"
      href={href}
    >
      {text}
    </a>
  );
};

const ChipsContainer = () => {
  return (
    <div className="flex flex-row justify-center flex-wrap my-6">
      <Chip text="Investments" href="/positions" />
      <Chip text="How to join" href="/about" />
      <Chip text="Alumni Placements" href="/alumni" />
    </div>
  );
};

const ScrollAnimation = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll updates
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        window.addEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // GSAP Fade-in animation
  useEffect(() => {
    if (containerRef.current) {
      const elements = Array.from(
        containerRef.current.children
      ) as HTMLElement[];
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-row items-center w-full justify-around h-full lg:p-10 md:px-10 md:pt-20"
    >
      <div
        className="flex flex-col text-center h-full justify-center text-blue-900 w-full"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      >
        <span className="sm:title text-3xl">30</span>{" "}
        <span className="text">Students</span>
      </div>
      <div
        className="flex flex-col text-center h-full text-blue-900  w-full"
        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
      >
        <span className="sm:title text-3xl">$4.5M</span>
        <span className="lg:pl-10 pl-5 text">Portfolio</span>
      </div>
      <div
        className="flex flex-col text-center h-full text-blue-900  w-full"
        style={{ transform: `translateY(${scrollY * -0.2}px)` }}
      >
        <span className="sm:title text-3xl">36</span>{" "}
        <span className="pl-2 text">Years</span>
      </div>
    </div>
  );
};

// vertical container (not used right now)
function LargeInvestments() {
  return (
    <div className="hidden lg:flex flex-col flex-1 items-center">
      <InvestmentCard logo={CCCSLogo} ticker="CCCS" />
      <InvestmentCard logo={MODGLogo} ticker="MODG" />
      <InvestmentCard logo={RMDLogo} ticker="RMD" />
      <InvestmentCard logo={CAKELogo} ticker="CAKE" />
      <InvestmentCard logo={MELILogo} ticker="MELI" />
      <InvestmentCard logo={RSGLogo} ticker="RSG" />
      <InvestmentCard logo={VIKLogo} ticker="VIK" />
      <InvestmentCard logo={NFLXLogo} ticker="NFLX" />
    </div>
  );
}
const Investments = () => {
  return (
    <div className="flex flex-wrap w-[80%] justify-center m-8">
      <InvContainer>
        <InvestmentCard logo={CCCSLogo} ticker="CCCS" />
        <InvestmentCard logo={MODGLogo} ticker="MODG" />
        <InvestmentCard logo={RMDLogo} ticker="RMD" />
        <InvestmentCard logo={CAKELogo} ticker="CAKE" />
        <InvestmentCard logo={RSGLogo} ticker="RSG" />
        <InvestmentCard logo={MELILogo} ticker="MELI" />
        <InvestmentCard logo={VIKLogo} ticker="VIK" />
        <InvestmentCard logo={NFLXLogo} ticker="NFLX" />
      </InvContainer>
    </div>
  );
};

interface InvestmentCardProps {
  logo: StaticImageData;
  ticker: string;
}
const InvestmentCard: React.FC<InvestmentCardProps> = ({ logo, ticker }) => {
  // to handle mouse hover effect
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <a
        target="_blank"
        href={`https://finance.yahoo.com/quote/${ticker}/`}
        className={`flex items-center justify-center w-[60px] lg:w-[80px] p-1 m-3 transition-transform duration-300 ${
          isHovered ? "transform scale-110" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={logo.src}
          alt="logo"
          className={`max-w-full max-h-full object-contain ${
            isHovered ? "filter-none" : "grayscale"
          }`}
        />
      </a>
    </>
  );
};

interface ContainerProps {
  children: ReactNode;
}

const InvContainer: React.FC<ContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // GSAP Fade-in animation
  useEffect(() => {
    if (containerRef.current) {
      const elements = Array.from(
        containerRef.current.children
      ) as HTMLElement[];
      gsap.fromTo(
        elements,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        // FIXME  - the animation is a little jumpy at the end.
      );
    }
  }, []);
  return (
    <div
      className="flex flex-row flex-wrap align-items justify-center"
      ref={containerRef}
    >
      {children}
    </div>
  );
};
