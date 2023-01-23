import React, { useState, useContext, useRef, useEffect } from "react";
import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    FileInput,
    MutedLink,
    PreviewPicture,
    ErrorStyle,
    SubmitButton,
} from "../common";
import { Marginer } from "../../marginer";
import MyContext from '../../../MyContext';
import { AccountContext } from "../accountContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CapitalizeFirstLowercaseRest from '../../../customHooks/CapitalizeFirstLowercaseRest';


export function AdminSignup() {
    const { switchToSignin } = useContext(AccountContext);
    const { adminAvatarHandler, setAdminName, setLoading, loading } = useContext(MyContext);

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const [mandatoryErrors, setMandatoryErrors] = useState([]);
    const [errors, setErrors] = useState([]);
    const [adminExistErr, setAdminExistErr] = useState('');

    let inputFileRef = useRef(null);

    const handleProfilePicChange = (e) => {
        inputFileRef = e.target.value;
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            previewFiles(file);
        }
    }

    const previewFiles = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setProfilePicture(reader.result);
            console.log("image: " + reader.result);
        }
    }

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    let isValid = true;
    const handleSubmitAdminAdding = (async () => {

        let errorsConsole = {};
        setErrors([]);
        setMandatoryErrors([]);
        if ((firstName && firstName.length < 2) || firstName.length > 20) {
            setErrors(prevState => ({
                ...prevState,
                [firstName]: "this is redundant" // I need better way to show the error.
            }));
            errorsConsole.firstName = "First Name must be in a range of 2-20 characters!";
            isValid = false;
            console.log("errors" + errors.firstName);
        } else if (!firstName) {
            setMandatoryErrors(prev => [...prev, 'Name feild is mandatory!']);
            isValid = false;
            errorsConsole.firstName = "Name feild is mandatory!";
        }
        if ((lastName && lastName.length < 2) || lastName.length > 20) {
            isValid = false;
            setErrors(prevState => ({
                ...prevState,
                [lastName]: "Last Name must be in a range of 2-20 characters!"
            }));
            errorsConsole.lastName = "Last Name must be in a range of 2-20 characters!";
        } else if (!lastName) {
            isValid = false;
            setMandatoryErrors(prevState => ({
                ...prevState,
                [lastName]: "Last Name feild is mandatory!"
            }));
            errorsConsole.lastName = "Last Name feild is mandatory!";
        }
        if (!email) {
            errorsConsole.email = "Email feild is mandatory!";
            isValid = false;
            setMandatoryErrors(prevState => ({
                ...prevState,
                [email]: "Email feild is mandatory!"
            }));
        } else if (!isValidEmail(email)) {
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
        if (confirmPassword && confirmPassword !== password) {
            isValid = false;
            errorsConsole.confirmPassword = "Confirm Password must be the same as password!";
            setErrors(prevState => ({
                ...prevState,
                [confirmPassword]: "Confirm Password must be the same as password!"
            }));
        } else if (!confirmPassword) {
            isValid = false;
            setMandatoryErrors(prevState => ({
                ...prevState,
                [confirmPassword]: "Confirm Password feild is mandatory!"
            }));
            errorsConsole.confirmPassword = "Confirm Password feild is mandatory!";
        };
        if (!profilePicture) {
            isValid = false;
            errorsConsole.profilePicture = "Profile picture feild is mandatory!";
            setMandatoryErrors(prevState => ({
                ...prevState,
                [profilePicture]: "Profile picture feild is mandatory!"
            }));
        }

        if (!isValid) {
            console.log('form isn\'t valid!!');
            errorsConsole.isValid = "form isn't valid!!";
            console.warn(errorsConsole);
            return;
        };
        isValid = true;
        setLoading(true);

        const capitalizedFirstName = CapitalizeFirstLowercaseRest(firstName);
        const capitalizedLastName = CapitalizeFirstLowercaseRest(lastName);

        const adminToAddToDB = {
            firstname: capitalizedFirstName,
            lastname: capitalizedLastName,
            email: email,
            password: password,
            profilepic: profilePicture
        };
        console.log("admin To Add To DB: " + adminToAddToDB);

        setAdminName(capitalizedFirstName + " " + capitalizedLastName);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setProfilePicture('');

        axios({
            method: 'post',
            url: "http://localhost:8000/admin/signup",
            headers: { 'content-type': 'application/json' },
            data: adminToAddToDB
        }).then((res) => {
            console.log('Posting a New Admin ', res.data);
            const uploadedImg = res.data.cloImageResult.public_id;
            console.log("uploadedImg: ", uploadedImg);
            adminAvatarHandler(uploadedImg);
            if (isValid) {
                setLoading(false);
                console.log("admin error ", adminExistErr);
                navigate(`/admin`);
            } else return;
        }).catch((error) => {
            setAdminExistErr(error.response.data.error);
            setLoading(false);
        })

    });

    /**
       👇️ Reset the input value of the file after sending, 
       to avoid errors when uploading the file a second time
    */
    const resetFileInput = () => {
        inputFileRef.current.value = null;
    };

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <>
            {profilePicture && <PreviewPicture src={profilePicture} alt="admin-avatar"></PreviewPicture>}
            { }
            <BoxContainer >
                <FormContainer>
                    {loading && <section className="smooth spinner" >{ }</section>}
                    {adminExistErr && <ErrorStyle style={{ fontSize: "14px" }}>{adminExistErr}</ErrorStyle>}
                    <Input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value) }} />
                    {mandatoryErrors[firstName] ?
                        <ErrorStyle>Name feild is mandatory!</ErrorStyle> : ''
                    }
                    {errors[firstName] ?
                        <ErrorStyle> Name must be in a range of 2 - 20 characters!</ErrorStyle> : ''
                    }
                    <Input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value) }} />
                    {mandatoryErrors[lastName] ?
                        <ErrorStyle>Last Name feild is mandatory!</ErrorStyle> : ''
                    }
                    {errors[lastName] ?
                        <ErrorStyle>Last Name must in a range of 2 - 20 characters!</ErrorStyle> : ''
                    }
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value)}} />
                    {mandatoryErrors[email] ?
                        <ErrorStyle>Email feild is mandatory!</ErrorStyle> : ''
                    }
                    {errors[email] ?
                        <ErrorStyle>This is not a valid email!</ErrorStyle> : ''
                    }
                    <Input
                        type="password"
                        placeholder="Password"
                        // autocomplete="current-password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        maxLength={10} />
                    {mandatoryErrors[password] ?
                        <ErrorStyle>Password feild is mandatory! </ErrorStyle> : ''
                    }
                    {errors[password] ?
                        <ErrorStyle>Password length must be in the range of 4 - 10 characters!</ErrorStyle> : ''
                    }
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        // autocomplete="current-password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value) }} />
                    {mandatoryErrors[confirmPassword] ?
                        <ErrorStyle>Confirm Password feild is mandatory!</ErrorStyle> : ''
                    }
                    {errors[confirmPassword] ?
                        <ErrorStyle>Confirm Password must be the same as password!</ErrorStyle> : ''
                    }
                    <Marginer direction="vertical" margin="0.5em" />
                    <span style={{ fontSize: '14px', textDecoration: 'underLine', color: 'gray' }}>Choose your Avatar here</span>
                    <FileInput
                        ref={inputFileRef}
                        type="file"
                        placeholder="Upload your profile avatar here!"
                        onChange={e => handleProfilePicChange(e)}
                        required
                        accept="image/png, image/jpeg, image/jpg, image/jfif"
                    />
                    {mandatoryErrors[profilePicture] ?
                        <ErrorStyle>Profile Picture feild is mandatory!</ErrorStyle> : ''
                    }
                </FormContainer>
                <Marginer direction="vertical" margin="1em" />
                <SubmitButton
                    type="submit"
                    onClick={() => {handleSubmitAdminAdding(); resetFileInput()}}
                >Sign-Up</SubmitButton>
                <Marginer direction="vertical" margin="1em" />
                <MutedLink href="#">
                    Already have an account?
                    <Marginer direction="vertical" margin="0.5em" />
                    <BoldLink href="#" onClick={switchToSignin}>
                        Sign-In
                    </BoldLink>
                    <Marginer direction="vertical" margin="0.5em" />

                </MutedLink>
            </BoxContainer>
        </>
    );
}
