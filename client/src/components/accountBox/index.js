import React, { useState } from "react";
import styled from "styled-components";
import { LoginForm } from "./loginForm";
import { motion } from "framer-motion";
import { AccountContext } from "./accountContext";
import { CustomerSignupForm } from "./CustomerSignupForm";
import { TrainerSignupForm } from "./TrainerSignupForm";
import { BoldCustomer, BoldHello } from './common';
import { BoldTrainer } from './common';

// const AccountPageContainer = styled.div`
//     min-height: 120vh;
//     padding: 0;
//     display: flex;
//     flex-direction: column;
//     align-items: flex-end;
//     justify-content: center;
//     margin-top: 3em;
//     background-image: url("https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80");
//     background-size: cover;
//     background-attachment: fixed;
//     background-position: center;
//     background-repeat: no-repeat;
//     /* background-image: url("https://media.istockphoto.com/photos/personal-trainer-guiding-woman-doing-barbell-squats-at-gym-picture-id616121640?k=20&m=616121640&s=612x612&w=0&h=uu26D6gUs5w3JEXGbX9tCc3YcxCMlMOA13ane0or2Nc="); */
// `

const BoxContainer = styled.div`
  width: 280px;
  min-height: 550px;
  /* display: flex;
  flex-direction: column; */
  border-radius: 19px;
  background-color: whitesmoke;
  margin-right: 2.5em;
  box-shadow: 0 0 5px rgba(15, 15, 15, 0.8);
  position: relative;
  overflow: scroll;
  
  /* margin-right: 3em; */
  margin-top: 3em;
  /* margin-bottom: 2em; */
  opacity: 0.8;

  @media (max-width: 800px) {    
    /* display: inline-flex; */
    margin-top: 6em;
  }

  @media (max-width: 500px) {
    /* margin-top: 8em; */
    margin-right: 1em;
      /* max-height: 350px; */
  }
`;

const TopContainer = styled.div`
  width: 100%;
  height: 235px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 2.8em;
  padding-bottom: 5em;

  @media (max-width: 500px) {
    display: flex;
      justify-content: flex-start;
    width: 100%;
    height: 200px;
  }
`;

const BackDrop = styled(motion.div)`
  width: 160%;
  height: 550px;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  transform: rotate(60deg);
  top: -290px;
  left: -70px;
  background: rgb(241, 196, 15);
  background: linear-gradient(
    58deg,
    rgba(241, 196, 15, 1) 20%,
    rgba(243, 172, 18, 1) 100%
  );
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;
`;

const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 11px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 0.6em;
  align-items: center;
`;

const backdropVariants = {
  expanded: {
    width: "233%",
    height: "1300px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "160%",
    height: "520px",
    borderRadius: "50%",
    transform: "rotate(60deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 2.5,
  stiffness: 20,
};

export function AccountBox() {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("signin");

  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500);
  };

  const switchToSignin = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signin");
    }, 400);
  };

  const switchToCustomerSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup as a customer");
    }, 450);
  };

  const switchToTrainerSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup as a trainer");
    }, 450);
  };


  const contextValue = { switchToCustomerSignup, switchToSignin, switchToTrainerSignup };

  return (
    <AccountContext.Provider value={contextValue}>
      {/* <AccountPageContainer> */}
      <BoxContainer >
        <TopContainer>
          <BackDrop
            initial={false}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={backdropVariants}
            transition={expandingTransition}
          />
          {active === "signin" && (
            <HeaderContainer>
              <HeaderText>Welcome</HeaderText>
              <HeaderText>Back</HeaderText>
              <SmallText>Please sign-in to continue!</SmallText>
            </HeaderContainer>
          )}
          {active === "signup as a customer" && (
            <HeaderContainer>
              <HeaderText>Create</HeaderText>
              <HeaderText>Account</HeaderText>
              <SmallText><BoldHello>Hello</BoldHello><BoldCustomer> Customer </BoldCustomer> Please sign-up to continue!</SmallText>
            </HeaderContainer>
          )}
          {active === "signup as a trainer" && (
            <HeaderContainer>
              <HeaderText>Create</HeaderText>
              <HeaderText>Account</HeaderText>
              <SmallText><BoldHello>Hello</BoldHello><BoldTrainer> Trainer </BoldTrainer>Please sign-up to continue!</SmallText>
            </HeaderContainer>
          )}
        </TopContainer>
        <InnerContainer>
          {active === "signin" && <LoginForm />}
          {active === "signup as a customer" && <CustomerSignupForm />}
          {active === "signup as a trainer" && <TrainerSignupForm />}
        </InnerContainer>
      </BoxContainer>
      {/* </AccountPageContainer> */}
    </AccountContext.Provider>
  );
}
