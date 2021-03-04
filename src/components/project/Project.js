import React from "react";
import styled from "styled-components/macro";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";

function Project() {
  return (
    <ProjectContainer id="project">
      <ProjectContentContainer>
        <ProjectHeader>
          <ProjectTitle>Project</ProjectTitle>
          <ProjectParagraph></ProjectParagraph>
        </ProjectHeader>

        <ProjectBody>
          {/* 之后用export的方式自动化导入 左右 布局 */}
          <ProjectItem>
            <ProjectBorder />
            <DescriptionOutlinedIcon style={{ fontSize: 36 }} />
            <ProjectItemTitle>
              E-commerce customer purchasing intention analysis and experiment
              design
            </ProjectItemTitle>
            <ProjectItemParagraph>
              Analyze customer purchase and raise conversion rate based on
              website data through machine learning, two-stage
              quasi-experiments, association rule
            </ProjectItemParagraph>
          </ProjectItem>

          <ProjectItem>
            <ProjectBorder />
            <DescriptionOutlinedIcon style={{ fontSize: 36 }} />
            <ProjectItemTitle>
              Recommendation Engine for investment platform Appreciate
            </ProjectItemTitle>
            <ProjectItemParagraph>
              Build stock recommendation system based on demographics, risk
              appetite, portfolio; create a dynamic efficient frontier algorithm
              to increase Sharpe ratio of portfolios
            </ProjectItemParagraph>
          </ProjectItem>
          <ProjectItem>
            <ProjectBorder />
            <DescriptionOutlinedIcon style={{ fontSize: 36 }} />
            <ProjectItemTitle>
              E-commerce platform movie consumption and recommendation engine
              design
            </ProjectItemTitle>
            <ProjectItemParagraph>
              Identify Amazon Prime movies popularity factors and suggested
              movie recommendation by Alternating Least Square (ALS) algorithms
              using Apache Spark
            </ProjectItemParagraph>
          </ProjectItem>

          <ProjectItem>
            <ProjectBorder />
            <DescriptionOutlinedIcon style={{ fontSize: 36 }} />
            <ProjectItemTitle>
              The reaction of social media on COVID-19
            </ProjectItemTitle>
            <ProjectItemParagraph>
              Conduct text mining and sentiment analysis based on the 60-day
              discussion of COVID-19 on Twitter using Natural Language
              Processing (NLP) techniques
            </ProjectItemParagraph>
          </ProjectItem>

          <ProjectItem>
            <ProjectBorder />
            <DescriptionOutlinedIcon style={{ fontSize: 36 }} />
            <ProjectItemTitle>
              Online reviews analysis of Amazon and topic modeling
            </ProjectItemTitle>
            <ProjectItemParagraph>
              Cluster online reviews on Amazon products and discovered latent
              semantic structures, identify latent topics thorugh Latent
              Dirichlet Analysis (LDA)
            </ProjectItemParagraph>
          </ProjectItem>

          <ProjectItem>
            <ProjectBorder />
            <DescriptionOutlinedIcon style={{ fontSize: 36 }} />
            <ProjectItemTitle>
              Big data analytics of Seattle crime
            </ProjectItemTitle>
            <ProjectItemParagraph>
              Perform spatial and time series analysis for a 12-year dataset of
              reported incidents from Seattle Police using Spark, projecte
              clustering results on Seattle map
            </ProjectItemParagraph>
          </ProjectItem>
        </ProjectBody>
      </ProjectContentContainer>
    </ProjectContainer>
  );
}

export default Project;

const ProjectContainer = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  background-color: white;
`;

const ProjectContentContainer = styled.div`
  width: 1000px;
  min-height: 100vh;
  margin-top: 150px;
  padding-bottom: 80px;
  @media screen and (max-width: 1024px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    margin-top: 50px;
  }
`;

const ProjectHeader = styled.div`
  display: grid;
  row-gap: 30px;
`;

const ProjectTitle = styled.div`
  font-family: Spartan, sans-serif;
  font-size: 32px;
  line-height: 32px;
  font-weight: 700;
  text-transform: none;

  @media screen and (max-width: 1024px) {
    justify-self: center;
  }

  @media screen and (max-width: 480px) {
    font-size: 26px;
  }
`;

const ProjectParagraph = styled.div`
  width: 60%;
  /* margin-bottom: 16px; */
  font-family: "Nunito Sans", sans-serif;
  font-size: 16px;
  line-height: 22px;
  text-align: left;

  @media screen and (max-width: 1024px) {
    text-align: center;
    justify-self: center;
  }
`;

const ProjectBody = styled.div`
  margin-top: 10px;
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr;
  column-gap: 60px;
  row-gap: 40px;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 66.6%;
    justify-content: center;
    row-gap: 60px;
  }

  @media screen and (max-width: 480px) {
    grid-template-columns: 80%;
  }
`;

const ProjectItem = styled.div`
  position: relative;
  padding: 40px 20px 20px 30px;
  display: grid;
  align-content: flex-start;
  row-gap: 20px;

  background-color: #f2f6ff;

  :hover {
    cursor: pointer;
  }
`;

const ProjectBorder = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 20px;
  left: 20px;
  border: 1px solid #000000;

  @media screen and (max-width: 480px) {
    top: 6px;
    left: 6px;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectItemTitle = styled.div`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;

  @media screen and (max-width: 480px) {
    font-size: 20px;
    line-height: 24px;
  }
`;

const ProjectItemParagraph = styled.div`
  font-size: 16px;
  line-height: 22px;
  text-align: left;

  @media screen and (max-width: 480px) {
    font-size: 14px;
    line-height: 20px;
  }
`;
