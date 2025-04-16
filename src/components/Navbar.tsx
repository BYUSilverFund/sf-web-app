"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Background } from "@/components/Background";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavbarProps {
  light?: boolean;
  className?: string;
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "News",
    href: "/news",
    description:
      "What we have been up to, including our latest investments and events.",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about the Silver Fund and how to join",
  },
  {
    title: "History",
    href: "/history",
    description:
      "Founded by Harold Silver in 1989, the Silver Fund has a rich history.",
  },
  {
    title: "Tools",
    href: "/tools",
    description: "Helpful links for students in the class to use",
  },
];

function NavbarNav({ className }: NavbarProps) {
  const pathname = usePathname(); // Get the current route
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {/* display home or positions navbutton or both depending on which page we are on*/}
        {["/", "/positions"].map((href) => (
          <NavigationMenuItem key={href}>
            {pathname !== href && (
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {href === "/" ? "Home" : "Portfolio"}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">
            People
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {/* <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none flex-col justify-center rounded-md bg-[#002E5D] p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="flex flex-row items-center justify-center">
                      <img
                        src={light ? SFlogoW.src : SFlogoB.src}
                        alt="Silver Fund Logo"
                        className="h-5"
                      />
                      <strong className="text-white mx-2">x</strong>
                      <img
                        src={light ? BYUlogoW.src : BYUlogoB.src}
                        alt="BYUlogo"
                        className="h-5"
                      />
                    </div>
                  </a>
                </NavigationMenuLink>
              </li> */}
              <ListItem href="/team" title="Team">
                Meet the current Silver Fund team
              </ListItem>
              <ListItem href="/alumni" title="Alumni">
                Search and network with Silver Fund alumni
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="https://47fund.byu.edu/signin" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Login
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// TITLE AND LOGO SECTION OF THE NAVBAR

import SFlogoB from "@/images/sf-logo-blue.png";
import BYUlogoB from "@/images/byu-logo-text-blue.png";
import SFlogoW from "@/images/sf-logo-white.png";
import BYUlogoW from "@/images/byu-logo-text-white.png";

const imgStyle = "h-4 sm:h-6 mr-2 fill";

const TitleLogo: React.FC<NavbarProps> = ({ className }) => {
  return (
    <Link href="/" passHref className={className}>
      <div className="flex flex-wrap w-full cursor-pointer items-center text-xl sm:text-3xl text-white whitespace-nowrap">
        <img src={SFlogoW.src} alt="Silver Fund Logo" className={imgStyle} />
        <img src={BYUlogoW.src} alt="BYUlogo" className={imgStyle} />
        <p className="pb-1">Silver Fund</p>
      </div>
    </Link>
  );
};

const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const linkStyle = "text-xl w-full border-b border-gray-400 py-4";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    const pageContent = document.getElementById("page-content");
    if (!isOpen) {
      if (pageContent) {
        pageContent.style.display = "none";
      } else {
        document.body.style.overflow = "hidden";
      }
    } else {
      if (pageContent) {
        pageContent.style.display = "block";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  };

  return (
    <div className="md:hidden flex justify-end text-white">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-blue-900 transition-transform duration-500 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <nav className="flex flex-col items-center text-center w-full p-6">
          {[
            { href: "/", label: "Home" },
            { href: "/positions", label: "Portfolio" },
            { href: "/team", label: "Team" },
            { href: "/alumni", label: "Alumni" },
            { href: "/news", label: "News" },
            { href: "/about", label: "About" },
            { href: "/history", label: "History" },
            { href: "/tools", label: "Tools" },
            { href: "https://47fund.byu.edu/signin", label: "Login" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              passHref
              className={linkStyle}
              onClick={() => {
                toggleMenu();
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

interface NavbarProps {
  light?: boolean;
  className?: string;
}

export function Navbar({ light = true }: NavbarProps) {
  return (
    <Background>
      <div
        id="nav-container"
        className="flex items-center flex-row justify-between"
      >
        <TitleLogo
          light={light}
          className=" md:mb-0 flex-3 md:flex-1 sm:h-12 md:h-14 w-auto flex items-center"
        />
        <NavbarNav
          light={light}
          className="flex-1 items-center hidden md:flex z-50"
        />
        <BurgerMenu />
      </div>
    </Background>
  );
}

export default Navbar;
