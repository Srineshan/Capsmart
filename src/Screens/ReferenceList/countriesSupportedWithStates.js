import React, { Fragment, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import SideBar from "../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import EditHcRow from './../../images/editHcRow.png';
import EditHcFolder from './../../images/editHcFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddContractDocumentTypeForUpload from "./addContractDocumentTypeForUpload";
import Titlebar from '../../Components/titlemenu';


const CountriesSupportedWithStates = () => {
    const [showContractDocumentDialod, setShowContractDocumentDialod] = useState(false)

    const getAddContractDocumentDialog = (value) => {
        setShowContractDocumentDialod(value)
    }
    return (
        <Fragment>
            <div className={style.countryGridStyle}>
                <div className={style.countryGridCol}>
                    <p className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}>AUSTRALIA</p>
                    <p className={style.countryDollerTextStyle}>AU $</p>
                    <p className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}>STATES 7</p>
                    <img className={style.countryImgStyle} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/125px-Flag_of_Australia_%28converted%29.svg.png" alt="" />
                </div>
                <div className={style.countryGridCol}>
                    <p className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}>CANADA</p>
                    <p className={style.countryDollerTextStyle}>CAN $</p>
                    <p className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}>STATES 7</p>
                    <img className={style.countryImgStyle} src="https://cdn.pixabay.com/photo/2013/07/13/14/14/canada-162259__340.png" alt="" />
                </div>
                <div className={style.countryGridCol}>
                    <h5 className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}>NEW ZEALAND </h5>
                    <p className={style.countryDollerTextStyle}> $</p>
                    <p className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}>STATES 7</p>
                    <img className={style.countryImgStyle} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/255px-Flag_of_New_Zealand.svg.png" alt="" />
                </div>
                <div className={style.countryGridCol}>
                    <p className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}>UNITED KINGDOM <br /> (UK) </p>
                    <p className={style.countryDollerTextStyle}>£</p>
                    <p className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}>STATES 7</p>
                    <img className={style.countryImgStyle} src="https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/255px-Flag_of_the_United_Kingdom.svg.png" alt="" />
                </div>
                <div className={style.countryGridCol}>
                    <p className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}>UNITED STATES <br /> (USA) </p>
                    <p className={style.countryDollerTextStyle}>£</p>
                    <p className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}>STATES 6</p>
                    <img className={style.countryImgStyle} src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/255px-Flag_of_the_United_States.svg.png" alt="" />
                </div>
            </div>
            {showContractDocumentDialod && <AddContractDocumentTypeForUpload getAddContractDocumentDialog={getAddContractDocumentDialog} />}
        </Fragment>
    )
}

export default CountriesSupportedWithStates;