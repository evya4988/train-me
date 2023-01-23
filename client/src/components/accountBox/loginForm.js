import React, { useState, useContext, useEffect } from "react";
import {
  BoldLinkTrainer,
  BoldLinkCustomer,
  BoxContainer,
  FormContainer,
  ErrorStyle,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../../MyContext';

export function LoginForm() {
  const { switchToCustomerSignup, switchToTrainerSignup } = useContext(AccountContext);
  const {
    setLoading,
    loading,
    setCustomerName,
    setTrainerName,
    customerAvatarHandler,
    trainerAvatarHandler,
    setTrainerID
  } = useContext(MyContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mandatoryErrors, setMandatoryErrors] = useState([]);
  const [errors, setErrors] = useState([]);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
    //Todo
    // fix regex statement here and on customer+trainer signUp. 
    // The regex version below is preferred,
    // it works but the email returned an invalid email, even though it went into the private area.
    // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  }

  let isValid = true;
  const handleSubmitLogin = (async (event) => {
    // event.preventDefault();

    let errorsConsole = {};
    setErrors([]);
    setMandatoryErrors([]);

    if (!email) {
      errorsConsole.email = "Email feild is mandatory!";
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [email]: "Email feild is mandatory!"
      }));
    } else if (email && !isValidEmail(email)) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [email]: "This is not a valid email!"
      }));
      errorsConsole.email = "This is not a valid email!";
    };

    if ((password && password.length < 4) || password.length > 10) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [password]: "Password length must be in the range of 4-10 characters!"
      }));
      errorsConsole.password = "Password length must be in the range of 4-10 characters!"
    } else if (!password) {
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [password]: "Password feild is mandatory!"
      }));
      errorsConsole.password = "Password feild is mandatory!";
    };

    if (!isValid) {
      console.log('form isn\'t valid!!');
      errorsConsole.isValid = "form isn't valid!!";
      console.warn(errorsConsole);
      return;
    };
    isValid = true;
    setLoading(true);
    console.log('logged-in!');

    setEmail('');
    setPassword('');
  });

  const userDetailToValidate = {
    email: email,
    password: password,
  };

  let customerMessage = ''
  const handleSubmitCustomerLogin = (e) => {
    e.preventDefault();
    handleSubmitLogin();

    axios({
      method: 'post',
      url: "http://localhost:8000/customer/login",
      headers: { 'content-type': 'application/json' },
      data: userDetailToValidate
    }).then((response) => {
      console.log(response);
      customerMessage = response.data.message;
      console.log(customerMessage);
      customerAvatarHandler(`trainme_customers_avatar/${email}_avatar`);
      setCustomerName(response.data.name);
      setLoading(false);
      customerMessage === 'Welcome Customer' && navigate(`/customer`);
    }).catch((error) => {
      (error.response.status === 422 && isValid) && window.alert("Invalid email or password!");
      console.log(error);
    });
  }

  let trainerMessage = ''
  const handleSubmitTrainerLogin = async (e) => {
    e.preventDefault();
    handleSubmitLogin();

    axios({
      method: 'post',
      url: "http://localhost:8000/trainer/login",
      headers: { 'content-type': 'application/json' },
      data: userDetailToValidate
    }).then((response) => {
      console.log(response);
      trainerMessage = response.data.message;
      console.log(trainerMessage);
      setTrainerID(response.data.trainerUser._id);
      trainerAvatarHandler(`trainme_trainers_avatar/${email}_avatar`);
      setLoading(false);
      setTrainerName(response.data.name);
      trainerMessage === 'Welcome Trainer' && navigate(`/trainer`);
    }).catch((error) => {
      (error.response.status === 422 && isValid) && window.alert("Invalid email or password!");
      console.log(error);
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <BoxContainer>
      <FormContainer>
        {loading && <section className="smooth spinner" >{ }</section>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        />
        {mandatoryErrors[email] ?
          <ErrorStyle>Email field is mandatory!</ErrorStyle> : ''
        }
        {errors[email] ?
          <ErrorStyle>This is not a valid email!</ErrorStyle> : ''
        }
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        />
        {mandatoryErrors[password] ?
          <ErrorStyle>Password field is mandatory!</ErrorStyle> : ''
        }
        {errors[password] ?
          <ErrorStyle>Password length must be in the range of 4 - 10 characters!</ErrorStyle> : ''
        }
      </FormContainer>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">Forget your password?</MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit" onClick={handleSubmitCustomerLogin}>Customer login</SubmitButton>
      <Marginer direction="vertical" margin="0.6em" />
      <SubmitButton type="submit" onClick={handleSubmitTrainerLogin}>Trainer login</SubmitButton>
      <Marginer direction="vertical" margin="0.6em" />
      {/* <SubmitButton type="submit" onClick={handleSubmitAdminLogin}>Admin login</SubmitButton>
      <Marginer direction="vertical" margin="1em" /> */}
      <p style={{
        fontSize: "13px",
        margin: "0",
        color: "#4D1900",
        fontWeight: "1000",
        textDecoration: "none"
      }}>Don't have an account?{" "}
      </p>
      <MutedLink>
        <Marginer direction="vertical" margin="0.5em" />
        <BoldLinkCustomer href="#" onClick={switchToCustomerSignup}>
          Sign-up as a Customer
        </BoldLinkCustomer>
        <Marginer direction="vertical" margin="0.5em" />
        <BoldLinkTrainer href="#" onClick={switchToTrainerSignup}>
          Sign-up as a Trainer
        </BoldLinkTrainer>
        <Marginer direction="vertical" margin="0.5em" />
      </MutedLink>

    </BoxContainer>
  );
}



