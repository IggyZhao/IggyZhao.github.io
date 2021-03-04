import React, { useState, useEffect, useRef } from "react";
// import { animateScroll as scroll } from "react-scroll"
import styled from "styled-components";

// import { Link as LinkRouter } from "react-router-dom"
import { Link as LinkScroll } from "react-scroll";
import { Link } from "gatsby";
import Tooltip from "../tooltip/Tooltip";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const tooltipRef = useRef();

  const setToggle = (event) => {
    setIsOpen(!isOpen);
    event.preventDefault();
    //console.log(event);
  };

  function handleClickOutside(event) {
    // console.log(ref.current);
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      !tooltipRef.current.contains(event.target)
    ) {
      console.log("Clicked!");
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <HeaderContentContainer ref={ref}>
        <LogoContainer>
          <Link to="/">
            <HeaderLogo src="/icons/Logo.svg" alt="logo" />
          </Link>
          <HeaderTitle>Ziyi (Iggy) Zhao</HeaderTitle>
        </LogoContainer>

        <MobileIcon onClick={setToggle}>
          <ItemLogo src="/icons/3.svg" alt="about" />
        </MobileIcon>

        <HeaderMenu>
          <HeaderLink
            to="about"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={-80}
          >
            <HeaderItem>
              <ItemLogo src="/icons/3.svg" alt="about" />
              About
            </HeaderItem>
          </HeaderLink>

          <HeaderLink
            to="research"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={0}
          >
            <HeaderItem>
              <ItemLogo src="/icons/4.svg" alt="Research" />
              Research
            </HeaderItem>
          </HeaderLink>

          <HeaderLink
            to="work"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={0}
          >
            <HeaderItem>
              <ItemLogo src="/icons/1.svg" alt="Works" />
              Work
            </HeaderItem>
          </HeaderLink>

          <HeaderLink
            to="project"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={0}
          >
            <HeaderItem>
              <ItemLogo src="/icons/1.svg" alt="Projects" />
              Projects
            </HeaderItem>
          </HeaderLink>

          <a href="/pdf/cv.pdf">
            <HeaderItem>
              <ItemLogo src="/icons/2.svg" alt="CV" />
              CV
            </HeaderItem>
          </a>

          {/* <HeaderItem>
            <ItemLogo src="/icons/help.svg" alt="Contact" />
            <HeaderLink>Contact</HeaderLink>
          </HeaderItem> */}
        </HeaderMenu>

        <MenuTooltipWrapper ref={tooltipRef}>
          <Tooltip isOpen={isOpen} />
        </MenuTooltipWrapper>
      </HeaderContentContainer>
    </HeaderContainer>
  );
}
export default Header;

const HeaderContainer = styled.div`
  /* display: flex; */
  position: fixed; // fix and sticky DIFFERENCE
  z-index: 999;
  width: 100%;
  height: 80px;
  top: 0px;
  left: 0px;

  background: #f3edfc;
  display: grid;
  align-items: center;
  justify-items: center;
`;

const HeaderContentContainer = styled.div`
  display: grid;
  grid-template-columns: 259px auto;
  width: 1200px;
  justify-content: space-between;
  /* padding: 0 40px; */
  align-items: center;

  @media screen and (max-width: 1230px) {
    grid-template-columns: auto auto;
    width: 100%;
    padding: 0 40px;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 20px;
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    padding: 0 10px;
  }
`;

const MobileIcon = styled.div`
  display: none;
  align-items: center;
  /* align-items: center; */
  @media screen and (max-width: 768px) {
    /* top: 0; */
    align-items: center;
    height: 80px;
    display: grid;
    /* transform: translate(-100%, 60%); */
    cursor: pointer;

    /* color: #fff; */
  }
`;

const LogoContainer = styled.div`
  display: grid;
  grid-template-columns: 44px auto;
  gap: 10px;
  align-items: center;
  margin: 0 10px;
`;

const HeaderLogo = styled.img`
  width: 44px;
  height: 44px;
`;

const HeaderTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);

  @media screen and (max-width: 1024px) {
    font-size: 22px;
  }

  @media screen and (max-width: 768px) {
    font-size: 20px;
  }

  @media screen and (max-width: 480px) {
    font-size: 16px;
  }
`;

const HeaderMenu = styled.ul`
  display: grid;
  grid-template-columns: repeat(6, auto);
  gap: 15px;

  @media screen and (max-width: 1024px) {
    font-style: normal;
    font-size: 12px;
    gap: 10px;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const ItemLogo = styled.img`
  width: 24px;
  height: 24px;
`;

const HeaderItem = styled.li`
  display: grid;
  grid-template-columns: 24px auto;
  gap: 5px;
  align-items: center;
  justify-items: center;
  padding: 10px;
  border-radius: 10px;
  transition: 0.5s ease-out;

  :hover {
    background: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1),
      inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2);
  }
`;

const HeaderLink = styled(LinkScroll)``;

const MenuTooltipWrapper = styled.div``;
