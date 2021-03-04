import React from "react";
import styled from "styled-components/macro";
import HomeIcon from "@material-ui/icons/Home";
import EmailIcon from "@material-ui/icons/Email";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";

function Contact() {
  return (
    <ContactContainer id="contact">
      <ContactContentContainer>
        <ContactHeader>
          <ContactTitle>GET IN TOUCH</ContactTitle>
          <ContactParagraph></ContactParagraph>
        </ContactHeader>

        <ContactFormContainer>
          <ContactForm>
            <ContactFormTitle>Let's connect!</ContactFormTitle>
            <ContactFormItemContainer>
              <ContactFormLabel>Name</ContactFormLabel>
              <ContactFormInput
                type="text"
                placeholder="First and last, please!"
                maxLength="256"
                required
              ></ContactFormInput>
            </ContactFormItemContainer>

            <ContactFormItemContainer>
              <ContactFormLabel>Email</ContactFormLabel>
              <ContactFormInput
                type="email"
                placeholder="Your email address"
                maxLength="256"
                required
              ></ContactFormInput>
            </ContactFormItemContainer>

            <ContactFormItemContainer>
              <ContactFormLabel>Message</ContactFormLabel>
              <ContactFormInput
                type="text"
                placeholder="How can I help you?"
                maxLength="5000"
                required
              ></ContactFormInput>
            </ContactFormItemContainer>

            <ContactFormSubmit>Contact</ContactFormSubmit>
          </ContactForm>

          <ContactInformation>
            <ContactItem>
              <HomeIcon
                className="material-icons"
                style={{ fontSize: 24, color: "#7f76f9" }}
              />
              <ContactText>Los Angeles, CA, USA, 90007</ContactText>
            </ContactItem>
            <ContactItem>
              <EmailIcon
                className="material-icons"
                style={{ fontSize: 24, color: "#7f76f9" }}
              />
              <ContactText>ziyi.iggy.zhao@gmail.com</ContactText>
            </ContactItem>
            <ContactItem>
              <PhoneAndroidIcon
                className="material-icons"
                style={{ fontSize: 24, color: "#7f76f9" }}
              />
              <ContactText>(959) 929-8269 </ContactText>
            </ContactItem>
          </ContactInformation>
        </ContactFormContainer>
      </ContactContentContainer>
    </ContactContainer>
  );
}

export default Contact;

const ContactContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: grid;
  justify-items: center;
  background-color: #f2f6ff;
`;

const ContactContentContainer = styled.div`
  width: 1000px;
  min-height: 100vh;
  margin-top: 150px;
  padding: 0 40px 80px 40px;
  display: grid;
  /* align-content: center; */
  justify-content: stretch;
  align-content: flex-start;

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 0;
  }

  @media screen and (max-width: 480px) {
    margin-top: 50px;
  }
`;
const ContactHeader = styled.div`
  display: grid;
  row-gap: 44px;
  width: 100%;

  @media screen and (max-width: 480px) {
    row-gap: 20px;
  }
`;
const ContactTitle = styled.div`
  font-family: Spartan, sans-serif;
  font-size: 32px;
  line-height: 36px;
  font-weight: 700;
  text-transform: none;
  @media screen and (max-width: 1024px) {
    justify-self: center;
  }
  @media screen and (max-width: 480px) {
    font-size: 26px;
  }
`;
const ContactParagraph = styled.div``;

const ContactFormContainer = styled.div`
  background-color: #fff;
  box-shadow: 7px 7px 40px 10px rgb(55 51 128 / 10%);
  border-radius: 5px;
  display: grid;
  grid-template-columns: 3fr 2fr;
  :hover {
    box-shadow: 7px 7px 40px 10px rgb(55 51 128 / 20%);
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: auto;
    margin: 20px 40px;
  }
`;

const ContactForm = styled.form`
  width: 100%;
  padding: 60px 200px 60px 60px;
  display: grid;
  row-gap: 30px;
  justify-content: stretch;

  @media screen and (max-width: 1024px) {
    padding: 60px;
  }

  @media screen and (max-width: 480px) {
    padding: 30px;
  }
`;

const ContactFormTitle = styled.div`
  /* font-family: Spartan, sans-serif; */
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
  text-transform: none;

  @media screen and (max-width: 480px) {
    font-size: 20px;
  }
`;

const ContactFormItemContainer = styled.div`
  width: 100%;
`;

const ContactFormLabel = styled.div`
  font-family: Spartan, sans-serif;
  margin-bottom: 10px;
  color: #45464d;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  text-align: left;

  @media screen and (max-width: 480px) {
    font-size: 12px;
  }
`;
const ContactFormInput = styled.input`
  display: block;
  width: 100%;
  height: 38px;
  padding: 8px 12px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;
  /* vertical-align: middle; */
  background-color: #fff;
  border: 1px solid #ccc;

  :focus {
    border-color: #6b66cc;
    background-color: #f8f7ff;
  }

  @media screen and (max-width: 480px) {
    font-size: 12px;
    height: 20px;
    margin-bottom: 0px;
    width: 90%;
  }
`;

const ContactFormSubmit = styled.button`
  background: #aea9f1;
  border-radius: 5px;
  font-weight: bold;
  font-size: 15px;
  color: #ffffff;
  border: none;
  padding: 9px 60px;
  justify-self: start;
  :hover {
    cursor: pointer;
    font-size: 18px;
    background: #7f76f9;
  }

  @media screen and (max-width: 480px) {
    font-size: 12px;
    padding: 9px 30px;
  }
`;

const ContactInformation = styled.div`
  align-self: center;
  justify-self: start;
  display: grid;
  row-gap: 44px;

  @media screen and (max-width: 1024px) {
    padding: 0 0px 40px 60px;
  }

  @media screen and (max-width: 480px) {
    align-items: center;
    padding: 30px;
  }
`;

const ContactItem = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: start;
  column-gap: 20px;

  /* &.material-icons {
    transform: scale(2);
  } */
`;

// const ContactIcon = styled.div``

const ContactText = styled.div`
  font-size: 16px;
  letter-spacing: 1.5px;

  @media screen and (max-width: 480px) {
    font-size: 12px;
    letter-spacing: 1.2px;
    font-weight: 700;
  }
`;
