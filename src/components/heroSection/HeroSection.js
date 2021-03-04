import React from "react";
import styled from "styled-components/macro";
import { Link as LinkScroll } from "react-scroll";

function HeroSection() {
  return (
    <HeroSectionContainer id="home">
      <HeroSectionBody>
        <HeroImage src="/icons/profile.png" alt="profile" />
        <HeroTextContainer>
          <HeroTextHeader>Hi, I’m Iggy</HeroTextHeader>
          <HeroTextBody>
            <HeroQuote>
              There are at least two kinds of games; One could be called finite;
              the other infinite.
              <HeroQuoteCite>&nbsp;&nbsp;&nbsp; - James P. Carse</HeroQuoteCite>
            </HeroQuote>
            Finite games may offer wealth and status, power and glory, but
            infinite games offer something far more subtle and far grander.{" "}
            <br /> <br /> I am committed to being an infinite game player and a
            lifelong learner.
          </HeroTextBody>
          <HeroButtonContainer>
            <HeroLinkAbout
              to="about"
              smooth={true}
              duration={300}
              spy={true}
              exact="true"
              offset={-80}
            >
              About
            </HeroLinkAbout>

            <HeroLinkContact
              to="contact"
              smooth={true}
              duration={300}
              spy={true}
              exact="true"
              offset={0}
            >
              Contact
            </HeroLinkContact>
          </HeroButtonContainer>
        </HeroTextContainer>
      </HeroSectionBody>
    </HeroSectionContainer>
  );
}

export default HeroSection;

const HeroSectionContainer = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
`;

const HeroSectionBody = styled.div`
  width: 1200px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: space-between;
  /* gap: 45px; */

  @media screen and (max-width: 1230px) {
    width: 100%;
    gap: 30px;
  }

  @media screen and (max-width: 988px) {
    grid-template-columns: auto;
    justify-items: center;
    padding-top: 100px;
    padding-bottom: 40px;
  }
  /* @media screen and (max-width: 768px) {
    padding: 0 20px;
    grid-template-columns: auto auto;
    width: 100%;
  } */

  /* @media (max-width: 450px) {
    grid-template-columns: auto;
  } */
`;

const HeroQuote = styled.blockquote`
  position: relative;
  text-align: center;
  padding: 1rem 1.2rem;
  width: 80%; /* create space for the quotes */
  color: #484748;
  margin: 1rem auto 2rem 0rem;

  background: linear-gradient(to right, #a9a8eb 4px, transparent 4px) 0 100%,
    linear-gradient(to left, #a9a8eb 4px, transparent 4px) 100% 0,
    linear-gradient(to bottom, #a9a8eb 4px, transparent 4px) 100% 0,
    linear-gradient(to top, #a9a8eb 4px, transparent 4px) 0 100%;
  background-repeat: no-repeat;
  background-size: 20px 20px;

  /* -- create the quotation marks -- */
  :before {
    font-family: FontAwesome;
    position: absolute;
    color: #a9a8eb;
    font-size: 30px;
    content: "\f10d";
    top: -12px;
    margin-right: -20px;
    right: 100%;
  }
  :after {
    font-family: FontAwesome;
    position: absolute;
    color: #a9a8eb;
    font-size: 30px;
    content: "\f10e";
    margin-left: -20px;
    left: 100%;
    top: auto;
    bottom: -20px;
  }

  @media screen and (max-width: 988px) {
    margin: 1rem 2rem 2rem 2rem;
    :before {
      font-size: 24px;
    }
    :after {
      font-size: 24px;
    }
  }
`;

const HeroQuoteCite = styled.cite`
  font-style: italic;
  font-weight: bold;
`;

const HeroImage = styled.img`
  width: 100%;
  @media screen and (max-width: 1230px) {
    width: 400px;
  }

  @media screen and (max-width: 480px) {
    width: 350px;
  }
`;

const HeroTextContainer = styled.div`
  margin-left: 36px;
  margin-right: 36px;
  display: grid;
  gap: 20px;

  @media screen and (max-width: 988px) {
    /* text-align: center; */
    gap: 20px;
    /* grid-template-rows: auto; */
  }
`;

const HeroTextHeader = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 36px;

  color: rgba(0, 0, 0, 0.8);

  @media screen and (max-width: 1230px) {
    font-size: 26px;
  }

  @media screen and (max-width: 988px) {
    justify-self: center;
  }
`;

const HeroTextBody = styled.div`
  /* margin-top: 15px; */
  max-width: 520px;
  /* height: 246px; */
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 140%;

  color: rgba(0, 0, 0, 0.8);

  @media screen and (max-width: 1230px) {
    font-size: 16px;
  }

  @media screen and (max-width: 988px) {
    text-align: center;
    margin: 0 15px;
  }
`;

const HeroButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 140px 140px;
  gap: 20px;
  margin-top: 20px;

  @media screen and (max-width: 988px) {
    justify-content: center;
  }
`;

const HeroLinkAbout = styled(LinkScroll)`
  background: #aea9f1;
  border-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 40px;

  :hover {
    cursor: pointer;
    background: #7f76f9;
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  }
`;

const HeroLinkContact = styled(LinkScroll)`
  background: #ffffff;
  border: 3px solid #aea9f1;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 9px 40px;

  font-size: 15px;
  font-weight: bold;
  color: #aea9f1;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
    color: #7f76f9;
  }
`;
