import React from "react";
import styled from "styled-components/macro";
import { Link as LinkScroll } from "react-scroll";

// import { tooltipData } from "../../data/menuData"
// import MenuButton from "../buttons/MenuButton"

function Tooltip({ isOpen }) {
  return (
    <Wrapper isOpen={isOpen}>
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
    </Wrapper>
  );
}

export default Tooltip;

const Wrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 30px;
  background: #f3edfc;

  opacity: 0.8;
  box-shadow: 0px 50px 100px rgba(0, 0, 0, 0.25),
    inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 20px;

  z-index: 1;
  display: grid;
  gap: 10px;
  grid-template-columns: 150px;

  transition: 0.3s ease-in-out;
  /* visibility: ${({ isOpen }) => (isOpen ? "visable" : "hidden")}; */
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  transform: ${({ isOpen }) =>
    isOpen
      ? " skewY(0deg) rotate(0deg) translateY(0px)"
      : " skewY(-5deg) rotate(5deg) translateY(-30px)"};
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

  /* width: 20px; */

  :hover {
    background: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1),
      inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2);
  }
`;

const HeaderLink = styled(LinkScroll)``;
