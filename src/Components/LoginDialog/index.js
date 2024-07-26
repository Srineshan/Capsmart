import React, { useState } from 'react'
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import logo from "./../../images/metropolitan-hospital-logo.png";
import CrossPink from "../../images/crossPink.png";
import style from './index.module.scss'

const LoginDialog = ({ getIsOpen, days }) => {

    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.loginDialog} ${style.loginDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div className={`${Classes.DIALOG_BODY} `}>
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
                <div className={style.daysToCompleteCard}>
                    <div className={style.textStyle}>{'YOU HAVE'}</div>
                    <div className={style.daysCountStyle}>{days}</div>
                    <div className={`${style.textStyle}`}>{'DAYS TO COMPLETE'}</div>
                </div>
            </div>
        </Dialog>
    )
}

export default LoginDialog;