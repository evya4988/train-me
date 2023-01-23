import React, { useState } from "react";
import styled from "styled-components";
import { AdminLogin } from "./AdminLogin";
import { motion } from "framer-motion";
// import { AnimatePresence, motion } from "framer-motion";
import { AccountContext } from "../accountContext";
import { AdminSignup } from "./AdminSignup";
import { BoldHello } from '../common';
import { BoldAdmin } from '../common';
import './AdminAccount.css';


const BoxContainer = styled.div`
  width: 350px;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: whitesmoke;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
  margin-right: 3em;
  margin-top: 4em;
  margin-bottom: 2em;
  opacity: 0.8;
  
  @media (max-width: 800px) {
    display: inline-flex;
    /* padding-top: 6em; */
  }

  @media (max-width: 500px) {
    width: 200px;
    display: inline-flex;
  }
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 4em;

  @media (max-width: 500px) {
    display: flex;
    justify-content: flex-start;
    padding-top: 1em;
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

  @media (max-width: 500px) {
    color: black;
  }
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
    height: "1480px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "125%",
    height: "540px",
    borderRadius: "50%",
    transform: "rotate(60deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 2.5,
  stiffness: 20,
};

export function AdminAccountPage(props) {
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

  const switchToAdminSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup as an admin");
    }, 450);
  };

  const contextValue = { switchToSignin, switchToAdminSignup };

  return (
    <AccountContext.Provider value={contextValue}>
      <div className="adminBox">
        <BoxContainer>
          <TopContainer>
            <BackDrop
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={backdropVariants}
              transition={expandingTransition}
            />
            {active === "signin" && (
              <HeaderContainer>
                <HeaderText>Welcome Back</HeaderText>
                <HeaderText style={{ color: "red" }}> Admin</HeaderText>
                <SmallText>Please sign-in to continue!</SmallText>
              </HeaderContainer>
            )}
            {active === "signup as an admin" && (
              <HeaderContainer>
                <HeaderText>Create</HeaderText>
                <HeaderText>Account</HeaderText>
                <SmallText><BoldHello>Hello</BoldHello><BoldAdmin> Admin </BoldAdmin>Please sign-up to continue!</SmallText>
              </HeaderContainer>
            )}
          </TopContainer>
          <InnerContainer>
            {active === "signin" && <AdminLogin />}
            {active === "signup as an admin" && <AdminSignup />}
          </InnerContainer>
        </BoxContainer>
      </div>
    </AccountContext.Provider>
  );
}
