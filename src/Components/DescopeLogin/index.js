import React, { useEffect } from "react";
import { Dialog } from "@blueprintjs/core";
import style from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { Descope } from '@descope/react-sdk';
import Cookie from "universal-cookie";

const DescopeLoginDialog = ({ getIsOpen, days }) => {
  const navigate = useNavigate();
  var cookie = new Cookie();
  const params = new URLSearchParams(window.location.search);
  const emailfromUrl = params.get('email');
  const phoneFromUrl = params.get('phone');
  const workspaceFromUrl = params.get('workspace');

  useEffect(() => {
    sessionStorage.setItem('workspace', workspaceFromUrl)
  }, [workspaceFromUrl])

  const handleSession = (sessionToken) => {
    console.log(sessionToken, 'sessionToken')
    if (sessionToken) {
      cookie.set('authorization', sessionToken, {
        path: '/',
        domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname,
        secure: true,
        sameSite: 'none',
      });
      navigate('/')
    }
  }

  return (

    <Dialog
      isOpen={true}
      onClose={() => getIsOpen(false)}
      className={`${style.loginDialog} ${style.loginDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div className={style.whiteBackground}>
        <div className={style.loginGrid}>
          <div>
            <div className={`${style.alignCenter} ${style.verticalAlignCenter} ${style.marginTop}`}>
              <img src={'https://capmanager-dev.s3.us-east-1.amazonaws.com/opening_Keycloak.gif'} alt="" className={style.descriptionContainer} />
            </div>
          </div>
          <div className={`${style.alignCenter} ${style.verticalAlignCenter}`}>
            <Descope
              flowId={window.location.hostname?.split('.')?.length === 3 ? `${window.location.hostname?.split('.')?.[0]}` : `master`}
              theme="light"
              onSuccess={(e) => {
                handleSession(e.detail.sessionJwt)
                console.log(e.detail.sessionJwt)
                console.log(e.detail.user.email)
              }}
              onError={(err) => {
                console.log("Error!", err)
              }}
              form={{ email: emailfromUrl || "", phone: phoneFromUrl || "" }}
            />
          </div>
        </div>
      </div>
      <div
        className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
      >
        <div
          className={`${style.verticalAlignCenter} ${style.alignCenter}`}
        ></div>
      </div>
    </Dialog>
  )
};

export default DescopeLoginDialog;
