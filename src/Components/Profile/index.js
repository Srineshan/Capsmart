import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../Navbar';
import SideBar from '../Sidebar';
import DoctorAnime from './../../images/doctorAnime.png';
import TextField from '@mui/material/TextField';
import { InputAdornment, IconButton } from "@material-ui/core";
import Dropzone from "react-dropzone";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Papa from 'papaparse';
import { GET, POST, PUT } from '../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import { currentUser } from '../../utils/auth';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import style from './index.module.scss';

const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
}

const Profile = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", secondaryEmail: "", username: "", password: "", newPassword: "", confirmPassword: "" });
    const [user, setUser] = useState({});
    const [userToSend, setUserToSend] = useState({});
    const [passwordStatus, setPasswordStatus] = useState('');
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    const [profilePicToDisplay, setProfilePicToDisplay] = useState('');
    const currentUserDetails = currentUser();
    const [isNewProfilePic, setIsNewProfilePic] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [valuesUpdated, setValuesUpdated] = useState(false);

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        setProfile({
            ...profile, firstName: user?.name?.firstName,
            lastName: user?.name?.lastName,
            email: user?.email?.officialEmail
        })
        setUserToSend(user);
        setIsNewProfilePic(user?.profilePic?.file?.fileURL !== null ? false : true);
    }, [user]);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


    const changeHandler = (e) => {
        setProfilePicToDisplay(URL.createObjectURL(e.target.files[0]) || '');
        setFileName(e.target.files?.[0]?.name);
        setFile(e.target.files[0])
        console.log(URL.createObjectURL(e.target.files[0]) || '', e.target.files[0], file)
    };

    const getUser = async () => {
        const { data: userData } = await GET(`user-management-service/user/${currentUserDetails?.id}`);
        setUser(userData);
        setUserToSend(userData);
    };

    const putUserWithProfilePic = async () => {
        const { data: userData } = await GET(`user-management-service/user/${currentUserDetails?.id}`);
        console.log(JSON.stringify({
            ...userData,
            name: { ...userToSend.name, firstName: profile?.firstName, lastName: profile?.lastName }
        }))
        await PUT('user-management-service/user', JSON.stringify({
            ...userData,
            name: { ...userToSend.name, firstName: profile?.firstName, lastName: profile?.lastName }
        }))
            .then(response => {
                SuccessToaster('User Modified Successfully');
                setValuesUpdated(true);
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error In Editing User');
            })
    }

    const updateProfileData = async () => {
        setUserToSend({
            ...userToSend,
            name: { ...userToSend.name, firstName: profile?.firstName, lastName: profile?.lastName },

        })
        if (file !== '') {
            let data = {
                ...(!isNewProfilePic &&
                    { id: user?.profilePic?.id }),
                userId: { id: user?.id },
                file: {
                    fileName: fileName,
                    ...(!isNewProfilePic &&
                        { filePath: user?.profilePic?.file?.filePath }),
                    ...(!isNewProfilePic &&
                        { fileURL: user?.profilePic?.file?.fileURL }),
                },
                ...(!isNewProfilePic &&
                    { createdDate: user?.profilePic?.createdDate }),
                ...(!isNewProfilePic &&
                    { lastModifiedDate: user?.profilePic?.lastModifiedDate }),
            }
            const formData = new FormData();
            formData.append('ProfilePicture', new Blob([JSON.stringify(data)], {
                type: "application/json"
            }));
            formData.append('pictureFile', file);
            if (!isNewProfilePic) {
                await PUT('user-management-service/user/profilePic', formData)
                    .then(response => {
                        SuccessToaster('Profile Pic Updated Successfully');
                        putUserWithProfilePic();
                    })
                    .catch(error => {
                        ErrorToaster('Unexpected Error in Profile Pic Update');
                    })
            } else {
                await POST('user-management-service/user/profilePic', formData)
                    .then(response => {
                        SuccessToaster('Profile Pic Updated Successfully');
                        putUserWithProfilePic();
                    })
                    .catch(error => {
                        ErrorToaster('Unexpected Error in Profile Pic Update');
                    })
            }
        } else {
            console.log(userToSend)
            await PUT('user-management-service/user', JSON.stringify({
                ...userToSend,
                name: { ...userToSend.name, firstName: profile?.firstName, lastName: profile?.lastName }
            }))
                .then(response => {
                    SuccessToaster('User Modified Successfully');
                    getUser();
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error In Editing User');
                })
        }
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    };

    const changePassword = async () => {
        if (profile?.password === "") {
            ErrorToaster('Enter Current Password');
            return;
        }
        if (profile?.newPassword === "") {
            ErrorToaster('Enter New Password');
            return;
        }
        if (profile?.confirmPassword === "") {
            ErrorToaster('Enter Confirm Password');
            return;
        }
        if (validatePassword(profile?.newPassword) && validatePassword(profile?.confirmPassword)) {
            if (profile?.newPassword === profile?.confirmPassword) {
                let data = {
                    oldPassword: {
                        password: profile?.password
                    },
                    newPassword: {
                        password: profile?.newPassword
                    }
                }
                await PUT(`user-management-service/user/${user?.id}/changePassword`, JSON.stringify(data))
                    .then(response => {
                        SuccessToaster('Password Changed Successfully');
                    })
                    .catch(error => {
                        ErrorToaster('Error in changing password');
                    })
            } else {
                ErrorToaster('New Password and Confirm Password should be same');
            }
        } else {
            ErrorToaster('The password must contain at least 8 characters, one upper case letter, one lower case letter, one digit, and one special character.');
        }


    }

    console.log(currentUserDetails, user, profile)

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded} refetchUserValues={valuesUpdated} updateProfileData={user}>
                            <div></div>
                        </SideBar>
                    </div>
                    <div className={style.profileSectionCard}>
                        <div className={style.headingStyle}>Profile Picture</div>
                        <div className={`${style.profilePictureGrid} ${style.marginTop20}`}>
                            <img src={profilePicToDisplay ? profilePicToDisplay : user?.profilePic?.file?.fileURL} alt="" className={style.profileImgStyle} />
                            <div className={style.marginLeft20}>
                                <label for="profile-upload">
                                    <input id="profile-upload" type="file" accept="image/*" onChange={(e) => changeHandler(e)} />
                                    {/* <Dropzone style={dropzoneStyle} accept='image/*' onDrop={acceptedFiles => changeHandler(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} accept="image/*" /> */}
                                    <div className={`${style.uploadBox} ${style.alignCenter}`}>
                                        {/* <img src={CloudUpload} alt="cloud" className={style.uploadImgStyle} /> */}
                                        <div>
                                            <div className={style.justifyCenter}>
                                                <div className={`${style.uploadIconContainer} ${style.alignCenter}`}>
                                                    <AddPhotoAlternateOutlinedIcon style={{ color: '#DBDBDB' }} />
                                                </div>
                                            </div>
                                            <div className={`${style.uploadTextStyle} ${style.cursorPointer}`}>
                                                <span className={style.blueText}>Click to upload</span> or drag and drop
                                            </div>
                                            <div className={style.uploadHelpText}>Formats: png, jpg, gif. (Max size: 800px * 400px)</div>
                                        </div>
                                    </div>
                                    {/* </div>
                                        </section>
                                    )}
                                </Dropzone> */}
                                </label>
                            </div>
                        </div>
                        <div className={`${style.headingStyle} ${style.marginTop50}`}>Personal Information</div>
                        {/* <div className={`${style.infoBox} ${style.marginTop}`}>
                            <div className={style.infoTextStyle}>
                                Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam Voluptua.
                            </div>
                        </div> */}
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>First Name</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value.slice(0, 25) })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                            <div className={style.marginLeft20}>
                                <div className={style.extentionLableStyle}>Last Name</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value.slice(0, 25) })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                        </div>
                        {/* <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>Username</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                        autoComplete: 'new-password'
                                    }} />
                            </div>
                            <div>
                                <div className={style.extentionLableStyle}>Email</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.email}
                                    //  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                        </div> */}
                        {/* <div className={style.helpText}>In addition to Google log-in, you can also log in using email and password.</div> */}
                        {/* <div className={`${style.spaceBetween} ${style.marginTop50}`}>
                            <div className={`${style.headingStyle}`}>Password</div>
                            <BorderColorOutlinedIcon style={{ color: '#0e5197


', fontSize: 14 }} className={style.cursorPointer} />
                        </div> */}
                        {/* <div className={`${style.infoBox} ${style.marginTop}`}>
                            <div className={style.infoTextStyle}>
                                Lorem Ipsum Dolor Sit Amet, (@ $ , ) Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam Voluptua. At Vero Eos Et Accusam.                            </div>
                        </div> */}
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>Current Password</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                    type={showPassword ? 'text' : "password"}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                        autoComplete: 'new-password'
                                    }}
                                    InputProps={{ // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>New Password</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.newPassword} onChange={(e) => { setProfile({ ...profile, newPassword: e.target.value }) }}
                                    type={showNewPassword ? 'text' : "password"}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }}
                                    InputProps={{ // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowNewPassword}
                                                >
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }} />
                            </div>
                            <div className={style.marginLeft20}>
                                <div className={style.extentionLableStyle}>Confirm Password</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.confirmPassword} onChange={(e) => { setProfile({ ...profile, confirmPassword: e.target.value }) }}
                                    type={showConfirmPassword ? 'text' : "password"}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }}
                                    InputProps={{ // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                >
                                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }} />
                            </div>
                            <div className={`${style.displayInColRev}`}>
                                <button onClick={() => { changePassword() }} className={`${style.outlinedButton} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer} ${style.alignCenter}`} >Reset Password</button>
                            </div>
                        </div>
                        <button onClick={() => { updateProfileData() }} className={`${style.normalButton} ${style.floatRight} ${style.cursorPointer} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`} >Save</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Profile;