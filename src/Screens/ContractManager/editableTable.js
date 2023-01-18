import React from 'react';
import { EditableText } from '@blueprintjs/core';

import style from './index.module.scss';

const EditableTable = () => {
    return (
        <div>
            <div className={`${style.tableHeader} ${style.editableTableGridStyle} ${style.marginTop10}`}>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >ADDITIONAL ON CALL SERVICE</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >WEEKDAY HOURS</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >WEEKEND / HOLIDAY HOURS</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >REQUIRE PATIENT MRN</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >REQUIRE ATTENDING DOC</p>
            </div>
            <div className={`${style.tableData} ${style.editableTableGridStyle} ${style.alternativeBackgroundColor} ${style.verticalAlignCenter}`} >
                <EditableText placeholder='Enter Service' />
                <EditableText placeholder='Start - End' />
                <EditableText placeholder='Start - End' />
                <EditableText placeholder='Select' />
                <EditableText placeholder='Select' />
            </div>
        </div>
    )
}

export default EditableTable;