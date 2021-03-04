import React from "react";
import styled from "styled-components/macro";

const years = ["2016", "2017", "2018", "2019", "2020", "2021"];

function Timeline() {
  return (
    <TimelineContainer id="about">
      <TimelineContentContainer>
        <TimelineHeaderContainer>
          <EmptyItem />
          {years.map((year) => (
            <YearIcon key={year}>{year}</YearIcon>
          ))}
        </TimelineHeaderContainer>

        <TimelineItem>
          <TimelineLogo row="1" rowLen="3" col="1" colLen="1">
            <TimelineIcon src="/icons/education.svg" alt="education" />
            <TimelineTitle>Education</TimelineTitle>
          </TimelineLogo>

          <GanttItem row="1" rowLen="2" col="2" colLen="7">
            University of Nottingham
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="9" colLen="4">
            University of Connecticut
          </GanttItem>
          <GanttItem row="2" rowLen="2" col="10" colLen="3">
            MIT Credentials
          </GanttItem>
        </TimelineItem>

        <TimelineItem>
          <TimelineLogo row="1" rowLen="3" col="1" colLen="1">
            <TimelineIcon src="/icons/research.svg" alt="research" />
            <TimelineTitle>Research</TimelineTitle>
          </TimelineLogo>

          <GanttItem row="1" rowLen="2" col="2" colLen="2">
            University of Nottingham
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="6" colLen="2">
            Peking University
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="8" colLen="2">
            iResearch
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="10" colLen="3">
            University of Connecticut
          </GanttItem>
          <GanttItem row="2" rowLen="2" col="10" colLen="2">
            Travelers
          </GanttItem>
        </TimelineItem>

        <TimelineItem>
          <TimelineLogo row="1" rowLen="3" col="1" colLen="1">
            <TimelineIcon src="/icons/work.svg" alt="work" />
            <TimelineTitle>Work</TimelineTitle>
          </TimelineLogo>

          <GanttItem row="1" rowLen="2" col="2" colLen="2">
            New Original <br />
            Edu & Tech
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="4" colLen="2">
            Bank of China
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="6" colLen="2">
            Jianghai Securities
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="10" colLen="1">
            Forkaia
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="11" colLen="1">
            Global AI
          </GanttItem>
          <GanttItem row="2" rowLen="2" col="10" colLen="3">
            Uconn TA
          </GanttItem>
        </TimelineItem>

        <TimelineItem>
          <TimelineLogo row="1" rowLen="3" col="1" colLen="1">
            <TimelineIcon src="/icons/activity.svg" alt="activity" />
            <TimelineTitle>Activities</TimelineTitle>
          </TimelineLogo>

          <GanttItem row="1" rowLen="2" col="2" colLen="1">
            Nepal Teaching
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="3" colLen="1">
            Indonesia Environment Protection
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="5" colLen="1">
            Obama's Speech
          </GanttItem>
          <GanttItem row="2" rowLen="2" col="5" colLen="1">
            3rd SME Summit
          </GanttItem>
          <GanttItem row="1" rowLen="2" col="9" colLen="2">
            Net Impact <br />
            (non-profit org)
          </GanttItem>
        </TimelineItem>
      </TimelineContentContainer>
    </TimelineContainer>
  );
}

export default Timeline;

const TimelineContainer = styled.div`
  width: 100%;
  background-color: #f2f6ff;
  position: relative;
  display: grid;
`;

const TimelineContentContainer = styled.div`
  justify-self: center;
  max-width: 1200px;
  min-height: 100vh;

  @media screen and (max-width: 480px) {
    padding-bottom: 30px;
    min-height: 0;
    height: 100%;
  }
`;

const TimelineHeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr repeat(6, 2fr);
  width: 100%;
  justify-content: space-around;
  justify-items: center;
  padding: 10px;
  border-bottom: 10px solid rgba(239, 229, 253, 0.7);

  @media screen and (max-width: 480px) {
    padding: 5px;
    border-bottom: 5px solid rgba(239, 229, 253, 0.7);
  }
`;

const EmptyItem = styled.div``;

const YearIcon = styled.div`
  /* grid-area: year; */
  display: grid;
  width: 65px;
  height: 65px;
  background: #9f8aff;
  /* background: linear-gradient(180deg, #9f8aff 0%, rgba(243, 86, 254, 0) 100%); */
  /* border: 1px solid #000; */
  border-radius: 999px;
  font-weight: bold;
  font-size: 20px;
  color: #fff;
  text-align: center;
  align-items: center;
  margin: 20px 0;
  /* background-color: red; */

  @media screen and (max-width: 480px) {
    margin: 10px 0;
    width: 32px;
    height: 32px;
    font-size: 10px;
  }
`;
const TimelineItem = styled.div`
  display: grid;
  background-color: #f2f6ff;
  grid-template-columns: 3fr repeat(12, 2fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  /* margin-bottom: 5px; */
  border: 10px solid rgba(239, 229, 253, 0.7);
  border-top: 0px solid rgba(239, 229, 253, 0.7);
  /* border-bottom: 10px solid rgba(239, 229, 253, 0.7); */

  @media screen and (max-width: 480px) {
    border: 5px solid rgba(239, 229, 253, 0.7);
    border-top: 0px solid rgba(239, 229, 253, 0.7);
  }
  /* align-items: center; */
`;

const TimelineLogo = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  padding: 10px;
  border-right: 10px solid rgba(239, 229, 253, 0.7);
  /* border-radius: 20px; */
  /* border-right: 5px solid #8079ff; */
  /* border: 5px solid #f2f6ff; */

  grid-column: ${({ col }) => col} / span ${({ colLen }) => colLen};
  grid-row: ${({ row }) => row} / span ${({ rowLen }) => rowLen};

  @media screen and (max-width: 480px) {
    border-right: 5px solid rgba(239, 229, 253, 0.7);
  }
`;

const TimelineIcon = styled.img`
  /* max-height: 140px; */
  width: 160px;
  height: 130px;

  @media screen and (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const TimelineTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;

  @media screen and (max-width: 480px) {
    font-size: 14px;
    width: 70px;
  }
`;
// const TimelineGrid = styled.div`
//   background-color: ${({ isEven }) => (isEven ? "#CCD0FC" : "#B5CDFB")};
// `
const GanttItem = styled.div`
  margin: 5px;
  display: grid;
  background: #b8b4ff;
  box-shadow: 4px 4px 5px #9f8aff;
  border-radius: 5px;
  height: 44px;

  align-items: center;
  text-align: center;

  color: #000000;
  font-weight: 500;
  font-size: 16px;

  grid-column: ${({ col }) => col} / span ${({ colLen }) => colLen};
  grid-row: ${({ row }) => row} / span ${({ rowLen }) => rowLen};
  align-self: center;
  /* justify-self: center; */

  @media screen and (max-width: 480px) {
    height: 24px;
    font-size: 10px;
    font-weight: 500;
  }
`;
