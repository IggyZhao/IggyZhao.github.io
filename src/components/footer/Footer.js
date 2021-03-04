import React from "react";
import styled from "styled-components/macro";
import { Link as LinkScroll } from "react-scroll";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
import InstagramIcon from "@material-ui/icons/Instagram";

function Footer() {
  return (
    <FooterContainer>
      <FooterBody>
        <FooterNavContainer>
          <FooterNavItem
            to="home"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={0}
          >
            Home
          </FooterNavItem>
          <FooterNavItem
            to="about"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={-80}
          >
            About
          </FooterNavItem>
          <FooterNavItem
            to="research"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={0}
          >
            Research
          </FooterNavItem>
          <FooterNavItem
            to="work"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={0}
          >
            Work
          </FooterNavItem>
          <FooterNavItem
            to="project"
            smooth={true}
            duration={300}
            spy={true}
            exact="true"
            offset={0}
          >
            Project
          </FooterNavItem>
        </FooterNavContainer>
        <FooterTextBody>
          <FooterName>Ziyi (Iggy) Zhao</FooterName>
          <FooterText>© 2021 Ziyi (Iggy) Zhao. All Rights Reserved.</FooterText>
        </FooterTextBody>
        <FooterIconContainer>
          <FooterIconLink href="https://www.linkedin.com/in/iggyzhao/">
            <LinkedInIcon style={{ fontSize: 24, color: "#7f76f9" }} />
          </FooterIconLink>
          <FooterIconLink href="https://github.com/IggyZhao">
            <GitHubIcon style={{ fontSize: 24, color: "#7f76f9" }} />
          </FooterIconLink>
          <FooterIconLink href="https://www.instagram.com/dududuiggy/">
            <InstagramIcon style={{ fontSize: 24, color: "#7f76f9" }} />
          </FooterIconLink>
        </FooterIconContainer>
      </FooterBody>
    </FooterContainer>
  );
}

export default Footer;

const FooterContainer = styled.div`
  width: 100%;
  min-height: 100px;
  display: grid;
  justify-items: center;
  /* justify-items: center; */
  background: #f2f6ff;
`;
const FooterBody = styled.div`
  height: 100%;
  display: grid;
  row-gap: 20px;
  padding: 20px;
  /* grid-template-columns: 1fr 1fr 1fr; */

  /* justify-content: stretch; */
  justify-items: center;
  align-items: center;
`;

const FooterNavContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto);
  column-gap: 20px;
`;

const FooterNavItem = styled(LinkScroll)`
  transition: border-color 0.3s ease;
  font-family: Spartan, sans-serif;
  color: #212126;
  font-size: 16px;
  line-height: 17px;
  font-weight: 600;
  /* border-bottom-color: #544ddb; */
  :hover {
    cursor: pointer;
  }

  @media screen and (max-width: 480px) {
    font-size: 14px;
    line-height: 14px;
  }
`;

const FooterTextBody = styled.div`
  justify-self: center;
  justify-items: center;
  display: grid;
  row-gap: 10px;
`;

const FooterName = styled.div`
  color: #212126;
  font-size: 15px;
  line-height: 17px;
  font-weight: 600;
`;

const FooterText = styled.div`
  ont-family: Spartan, sans-serif;
  font-size: 12px;
  line-height: 16px;
`;

const FooterIconContainer = styled.div`
  /* justify-self: end; */
  display: grid;
  grid-template-columns: repeat(3, auto);
  column-gap: 20px;
`;

const FooterIconLink = styled.a``;
