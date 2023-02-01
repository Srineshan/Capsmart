import React, { useEffect, useState } from 'react';
import { EditableText } from '@blueprintjs/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { TimePicker } from "@blueprintjs/datetime";
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';

const ScheduleAndTargetSameTable = () => {


    return (
        <div>
            <div className={`${style.tableHeader} ${style.marginTop10}`}>
                <div className={style.scheduleTableGrid1}>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >APPLICABLE PERIOD</p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >SCHEDULE</p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >PATIENT SEEN</p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >PATIENTS SCHEDULED</p>
                </div>
                <div className={style.scheduleTableGrid2}>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >FROM - TO</p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >MIN</p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >MAX</p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >W / NURSE </p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >WO / NURSE</p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >W / NURSE </p>
                    <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >WO / NURSE</p>
                </div>
            </div>
            <div className={`${style.tableData} ${style.scheduleTableGrid2} ${style.alternativeBackgroundColor}`}>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>Jan 1 - MAR 31, 2022</p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>3</p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>-</p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>PER MONTH</p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>15</p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>8</p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}></p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>15</p>
                <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>8</p>
            </div>
        </div>
    )
}

export default ScheduleAndTargetSameTable;