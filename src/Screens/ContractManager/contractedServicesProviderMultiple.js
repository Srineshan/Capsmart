import React, {useState} from 'react';
import style from './index.module.scss';

const ContractedServicesProviderMultiple = ({getNewServiceProviderDialog, getViewPage1, getViewPage2, getViewPage3, getCurrentPage}) => {
    return(
        <div className={style.cloneBlockStyle}>
            <div className={style.tableHeight}>
                <div className={style.spaceBetween}>
                    <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20}`}>Contracted Service Providers:<strogn className={`${style.blackText} ${style.bold} ${style.marginLeft20}`}>3</strogn></div>
                    <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} `}
                    onClick={() => getNewServiceProviderDialog(true)} >ADD CONTRACTED PROVIDER</button>
                </div>
                <div className={`${style.tableHeader} ${style.marginTop10}`}>
                    <p className={style.multipleContractorTextWidth}>DATA STATUS</p>
                    <p className={style.multipleContractorTextWidth}>CONTRACT NAME</p>
                    <p className={style.multipleContractorTextWidth}>CONTRACTOR TYPE</p>
                    <p className={style.multipleContractorTextWidth}>SITE LEVEL</p>
                    <p className={style.multipleContractorTextWidth}>DEPT LEVEL</p>
                </div>
                <div className={`${style.tableData} ${style.displayInRow}`}>
                    <div className={`${style.multipleDataTextWidth}`}></div>
                    <p className={style.multipleDataTextWidth}>John, DOE - MD</p>
                    <p className={style.multipleDataTextWidth}>Physician </p>
                    <p className={style.multipleDataTextWidth}>Chief Medical Officer</p>
                    <p className={style.multipleDataTextWidth}>-</p>
                </div>
                <div className={`${style.tableData} ${style.displayInRow}`}>
                    <div className={`${style.multipleDataTextWidth}`}></div>
                    <p className={style.multipleDataTextWidth}>Alex, JACK - Surgeon</p>
                    <p className={style.multipleDataTextWidth}>Nurse </p>
                    <p className={style.multipleDataTextWidth}>HOD</p>
                    <p className={style.multipleDataTextWidth}>-</p>
                </div>
                <div className={`${style.tableData} ${style.displayInRow}`}>
                    <div className={`${style.multipleDataTextWidth}`}></div>
                    <p className={style.multipleDataTextWidth}>Mario, KAL - MD</p>
                    <p className={style.multipleDataTextWidth}>Physician </p>
                    <p className={style.multipleDataTextWidth}>Chief Medical Officer</p>
                    <p className={style.multipleDataTextWidth}>-</p>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {{getViewPage2 ? getViewPage3(true) : getViewPage2(true)};getViewPage1(false);getCurrentPage('Contracted Services Provider(s)')}}>CONTINUE</button>
            </div>
        </div>
    )
}

export default ContractedServicesProviderMultiple;