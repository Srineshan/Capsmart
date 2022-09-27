import React, { Fragment, useState } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddNewDepartments from './addNewDepartments';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SemiTransparentFolder from './../../images/semiTransparentFolder.png';
import TransparentFolder from './../../images/transparentFolder.png';
import ArrowDown from './../../images/arrowDown.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';
import Warning from './../../images/warning.png';


const DepartmentsByEntityTypes = () => {
    const [showAddDeptEntityDialog, setShowAddDeptEntityDialog] = useState(false);
    const menuItem = [{ title: 'Hospital/Acute Care Facility (ACF)', count: 7 }, { title: 'Skilled Nursing Facility (SNF)', count: 0 }, { title: 'Long Term Core Facility (LTC)', count: 0 }, { title: 'Asisted Living Facility (ALF)', count: 0 }, { title: 'Elderly Care Services', count: 0 }, { title: 'Dental Clinic', count: 0 }, { title: 'Blood & Organ bank', count: 0 }]
    const departments = [{ title: 'Anesthesiology', created_date: '03-29-2022', last_updated: '03-29-2022', folder: false, folderValue: [] }, { title: 'Blood Bank', created_date: '03-29-2022', last_updated: '03-29-2022', folder: false, folderValue: [] }, { title: 'Dermatology', created_date: '03-29-2022', last_updated: '03-29-2022', folder: false, folderValue: [] }, { title: 'Gastroenterology', created_date: '03-29-2022', last_updated: '03-29-2022', folder: false, folderValue: [] }, { title: 'Laboratory & Testings', created_date: '03-29-2022', last_updated: '03-29-2022', folder: true, folderValue: [{ title: 'Bacteriology', created: '03-29-2022', updated: '03-29-2022' }, { title: 'Hematology', created: '03-29-2022', updated: '03-29-2022' }] }]
    const [selectedTitle, setSelectedTitle] = useState(menuItem?.[0]?.title);

    const getAddDeptEntityDialog = (value) => {
        setShowAddDeptEntityDialog(value);
    }

    return (
        <Fragment>
            <ReferenceListNavbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                DEPARTMENTS / SERVICE AREAS BY ENTITY TYPES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <img src={AddRefresh} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                                <img src={AddNewEntity} onClick={() => getAddDeptEntityDialog(true)} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                                <Icon icon="cross" size={25} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} />
                                {/* intent={Intent.DANGER} */}
                            </div>
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.departmentCardColumnsGrid}>
                                        <div>
                                            <div className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}>
                                                <img src={TransparentFolder} className={`${style.colorFileStyle2} ${style.marginLeft15}`} />
                                                <p className={style.healthCareHeaderTextStyle}>HEALTHCARE</p>
                                                <img src={ArrowDown} className={`${style.colorFileStyle2} ${style.marginRight}`} />
                                            </div>
                                            {
                                                menuItem?.map(data => (
                                                    <div className={data?.title === selectedTitle ? `${style.healthCareListCardStyle}  ${style.HealthCareListBackground2} ${style.marginTop}` : `${style.healthCareListCardStyle} ${style.marginTop}`} onClick={() => setSelectedTitle(data.title)}>
                                                        <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop}`}>
                                                            <p className={style.healthCareLeftCardFontStyle}>{data.title}</p>
                                                            <p className={style.healthCareLeftCardFontStyle}>{data.count}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        {
                                            departments?.length === 0 ?

                                                <div className={style.emptyCradStyle}>
                                                    <div className={style.displayInCol}>
                                                        <div className={style.justifyCenter}>
                                                            <img src={Warning} alt="warning" className={style.warningImage} />
                                                        </div>
                                                        <div className={style.warningFontContainer}>
                                                            <p className={style.warningFont}>Departments / Services Area reference list by entity needs to be created and setup in order to be made available as a default list for customer accounts that are created.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className={style.DepartmentEntityCardStyle}>
                                                    <div className={style.tableHeaderIndustriesEntity}>
                                                        <p className={style.tableHeaderIndustriesFontStyle}>DEPARTMENTS / SERVICE AREAS</p>
                                                        <p className={style.tableHeaderIndustriesFontStyle}>CREATED DATE</p>
                                                        <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
                                                    </div>
                                                    <div className={style.healthCareIndustriesHeader}>
                                                        <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                        <p className={style.tableHeaderIndustriesFontStyle}>Hospital/Acute Care Facility (ACF)</p>
                                                    </div>
                                                    {
                                                        departments?.map((data, index) => (
                                                            <>
                                                                {
                                                                    !data?.folder ? (
                                                                        <div className={index % 2 === 0 ? `${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}` : `${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                                            <p></p>
                                                                            <p className={style.tableDataFontStyle}>{data?.title}</p>
                                                                            <p className={style.tableDataFontStyle}>{data?.created_date}</p>
                                                                            <p className={style.tableDataFontStyle}>{data?.last_updated}</p>
                                                                            <img src={EditHcRow} className={style.colorFileStyle} />
                                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <div className={`${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                                                <img src={SemiTransparentFolder} alt="SemiTransparentFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                                                <p className={style.tableDataFontStyle}>{data?.title}</p>
                                                                                <p className={style.tableDataFontStyle}>{data?.created_date}</p>
                                                                                <p className={style.tableDataFontStyle}>{data?.last_updated}</p>
                                                                                <img src={EditHcFolder} className={style.colorFileStyle} />
                                                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    data?.folderValue?.map((folderData, innerIndex) => (
                                                                                        <div className={innerIndex % 2 !== 0 ? `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}` : `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                                                            <p></p>
                                                                                            <p className={style.tableDataFontStyle}>{folderData?.title}</p>
                                                                                            <p className={style.tableDataFontStyle}>{folderData?.created}</p>
                                                                                            <p className={style.tableDataFontStyle}>{folderData?.updated}</p>
                                                                                            <img src={EditHcRow} className={style.colorFileStyle} />
                                                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                        )
                                                    }
                                                </div>
                                        }
                                    </div>
                                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => getAddDeptEntityDialog(true)}>CLICK TO SETUP</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
            </div>
            {showAddDeptEntityDialog && <AddNewDepartments getAddDeptEntityDialog={getAddDeptEntityDialog} />}
        </Fragment>
    )
}

export default DepartmentsByEntityTypes;
