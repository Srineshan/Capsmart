import React, { Fragment, useState } from 'react';
import Navbar from '../Navbar';
import SideBar from '../Sidebar';
import DoctorAnime from './../../images/doctorAnime.png';
import TextField from '@mui/material/TextField';
import Dropzone from "react-dropzone";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Papa from 'papaparse';
import { GET } from '../../Screens/dataSaver';

import style from './index.module.scss';
import { currentUser } from '../../utils/auth';
import { useEffect } from 'react';

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
    const currentUserDetails = currentUser();
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
    }, [user])

    const changeHandler = (event) => {
        Papa.parse(event?.[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log(results.data)
            },
        });
    };

    const getUser = async () => {
        const { data: user } = await GET(`user-management-service/user/${currentUserDetails?.id}`);
        setUser(user);
    };

    // const saveProfileData 

    console.log(currentUserDetails, user, profile)

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div></div>
                        </SideBar>
                    </div>
                    <div className={style.profileSectionCard}>
                        <div className={style.headingStyle}>Profile Picture</div>
                        <div className={`${style.profilePictureGrid} ${style.marginTop20}`}>
                            <img src={DoctorAnime} alt="" className={style.profileImgStyle} />
                            <div className={style.marginLeft20}>
                                <Dropzone style={dropzoneStyle} accept=".csv" onDrop={acceptedFiles => changeHandler(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} accept=".csv" />
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
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                        <div className={`${style.headingStyle} ${style.marginTop50}`}>Personal Information</div>
                        <div className={`${style.infoBox} ${style.marginTop}`}>
                            <div className={style.infoTextStyle}>
                                Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam Voluptua.
                            </div>
                        </div>
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>First Name</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                            <div className={style.marginLeft20}>
                                <div className={style.extentionLableStyle}>Last Name</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                        </div>
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>Username</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                        </div>
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>Email</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                            <div className={style.marginLeft20}>
                                <div className={style.extentionLableStyle}>Secondary Email</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.secondaryEmail} onChange={(e) => setProfile({ ...profile, secondaryEmail: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                        </div>
                        <div className={style.helpText}>In addition to Google log-in, you can also log in using email and password.</div>
                        <div className={`${style.spaceBetween} ${style.marginTop50}`}>
                            <div className={`${style.headingStyle}`}>Password</div>
                            <BorderColorOutlinedIcon style={{ color: '#7165E3', fontSize: 14 }} className={style.cursorPointer} />
                        </div>
                        <div className={`${style.infoBox} ${style.marginTop}`}>
                            <div className={style.infoTextStyle}>
                                Lorem Ipsum Dolor Sit Amet, (@ $ , ) Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam Voluptua. At Vero Eos Et Accusam.                            </div>
                        </div>
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>Current Password</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                    type="password"
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                        </div>
                        <div className={`${style.personalInformationGrid} ${style.marginTop}`}>
                            <div>
                                <div className={style.extentionLableStyle}>New Password</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.newPassword} onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                                    type="password"
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                            <div className={style.marginLeft20}>
                                <div className={style.extentionLableStyle}>Confirm Password</div>
                                <TextField size="small" className={style.fullWidth} value={profile?.confirmPassword} onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                                    type="password"
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                            <div className={`${style.displayInColRev}`}>
                                <button onClick={() => { }} className={`${style.outlinedButton} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer} ${style.alignCenter}`} >Reset Password</button>
                            </div>
                        </div>
                        <button onClick={() => { }} className={`${style.normalButton} ${style.floatRight} ${style.cursorPointer} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`} >Save</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Profile;