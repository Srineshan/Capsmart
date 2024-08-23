import React, { useState } from 'react'
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import logo from "./../../images/cambridgeHospital.png";
import CrossPink from "../../images/crossPink.png";
import style from './index.module.scss'
import { InputAdornment, IconButton } from "@material-ui/core";
import TextField from '@mui/material/TextField';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";




const LoginDialog = ({ getIsOpen, days }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return !isContinue ? (
        <Dialog isOpen={true} onClose={() => getIsOpen(false)} className={`${style.welcomeDialog} ${style.loginDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={style.whiteBackground}>
                    <div className={style.spaceBetween}>
                        <div></div>
                        <p className={style.loginHeaderText}><span className={style.bold}>Cap</span>Smart</p>
                        <img
                            src={CrossPink}
                            alt="cross"
                            className={`${style.crossStyle} ${style.cursorPointer} `}
                            onClick={() => { getIsOpen(false) }}
                        />
                    </div>
                    <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                    <div className={style.welcomeText}>Welcome!</div>
                    <div className={`${style.descriptionStyle} ${style.marginTop10}`}>Cambridge Memorial Hospitals Automated Credentialing & Privileging Portal</div>
                    <div className={`${style.descriptionStyle} ${style.marginTop}`}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem.</div>
                    <div className={style.alignCenter}>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => { setIsContinue(true) }}>CONTINUE</div>
                    </div>
                    <div className={`${style.linkStyle} ${style.marginTop}`}>Cliquez pour voir la candidature en français</div>
                </div>
                <div className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}>
                    <div className={`${style.verticalAlignCenter} ${style.alignCenter}`}>
                        <div className={style.textStyle}>{'YOU HAVE'}</div>
                        <div className={style.daysCountStyle}>{days}</div>
                        <div className={`${style.textStyle}`}>{'DAYS TO COMPLETE'}</div>
                    </div>
                </div>
            </div>
        </Dialog>
    ) : (
        <Dialog isOpen={true} onClose={() => getIsOpen(false)} className={`${style.loginDialog} ${style.loginDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={style.whiteBackground}>
                    <div className={style.loginGrid}>
                        <div >
                            <div className={` ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}>
                                <img src={logo} alt="Hospital Logo" className={`${style.logoInLogin}`} />
                                <div className={style.borderLeft}></div>
                                <p className={style.loginHeaderText}><span className={style.bold}>Cap</span>Smart</p>
                            </div>
                            <div className={`${style.alignCenter} ${style.marginTop}`}>
                                <div className={style.descriptionContainer}>
                                    <div className={`${style.loginDescription}`}>Maintain All Your Crendentialing And Privileging Data</div>
                                    <div className={`${style.loginDescription} ${style.marginTop}`}>Manage Care Template Forms Required</div>
                                    <div className={`${style.loginDescription} ${style.marginTop}`}>Securely Manage Your Documents And Ensure Its Credibility</div>
                                    <div className={`${style.loginDescription} ${style.marginTop}`}>Manage Content & Disclosure Forms</div>
                                </div>
                            </div>

                            <div className={`${style.alignCenter} ${style.marginTop}`}>
                                <div>
                                    <div className={`${style.loginDescription} ${style.textAlignCenter}`}>Track Application Process</div>
                                    <div className={`${style.helpText} ${style.marginTop10}`}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.</div>
                                </div>
                            </div>
                        </div>
                        <div className={style.createYourAccountSectionPadding}>
                            <div className={style.heading}>Create Your Account</div>
                            <div className={style.createAccountHelpText}>CHM uses capsmart for to processing new staff member applications and reappointments. you can Register as a user with CapSmart and avail its benefits</div>
                            <div className={style.marginTop}>
                            <div className={style.extentionLableStyle}>Your Email(Username)</div>
                                <TextField size="small" className={style.fullWidth}
                                    //  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }} />
                            </div>
                            <div className={style.marginTop}>
                            <div className={style.extentionLableStyle}>Create Your Password</div>
                                <TextField size="small" className={style.fullWidth}
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
                            <div className={style.marginTop}>
                            <div className={style.extentionLableStyle}>Confirm Your Password</div>
                                <TextField size="small" className={style.fullWidth}
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
                            <div className={style.marginTop}>
                                <button className={style.registerButton}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}>
                    <div className={`${style.verticalAlignCenter} ${style.alignCenter}`}>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default LoginDialog;