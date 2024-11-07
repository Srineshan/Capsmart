import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import style from "./index.module.scss";

const ThirdPartyDialog = ({ getIsOpen,continueClick }) => {
 
  return (
  
    
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
     <div>
      <div className={`${style.container} ${style.displayInCol}`}>
        <div></div>
      <div className={style.text}>
        Third Party Payment Gateway
      </div>
      <div className={`${style.continue} ${style.marginLeft}`} onClick = {continueClick} >CONTINUE</div>
      </div>
    </div>
    </Dialog>
    
  );
};

export default ThirdPartyDialog;
