import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddBoardCertifcation from './addBoardCertifcation';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import OpenFolder from './../../images/openFolder.png';
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import BlueFolder from './../../images/blueFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SemiTransparentFolder from './../../images/semiTransparentFolder.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';
import { GET } from '../dataSaver'
import { index } from 'd3';

const BoardCertification = ({ getAddEntityDialog, showAddEntityDialog, isEdit, setIsEdit }) => {
    const [showBoardCertificationDialog, setShowBoardCertificationDialog] = useState(false);
    const [allData, setAllData] = useState([]);
    const [clicked, setClicked] = useState(0);
    const [isClicked, setIsClicked] = useState(0);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedEntity, setSelectedEntity] = useState({});
    const [industryData, setIndustryData] = useState({})
    const [entityData, setEntityData] = useState({})

    const getAddBoardCertificationDialog = (value) => {
        setShowBoardCertificationDialog(value);
    }

    const entityAllData = async (industry) => {
        const { data: entities } = await GET(
            `entity-service/entityTypeMaster?industryId=${industry.id}`
        );
        const reconstructedEntities = await Promise.all(
            entities.map(siteTypeAllData)
        );
        return await { ...industry, entities: reconstructedEntities };
    };

    const siteTypeAllData = async (siteTypeId) => {
        const { data: CSPType } = await GET(
            `entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId.id}`
        );
        return await { ...siteTypeId, CSP: CSPType };
    };

    const getAllData = async () => {
        const { data: data } = await GET(`entity-service/industryMaster`);
        let allEntries = await Promise.all(data.map(entityAllData));
        setAllData(allEntries);
    };

    const handleToggle = (index, data) => {
        if (clicked === index) {
            return setClicked("0");
        }
        setClicked(index);
        setIndustryData(data)
    };

    const handleToggleCsp = (index, data) => {
        if (isClicked === index) {
            return setIsClicked("0");
        }
        setIsClicked(index);
        setSelectedTitle(data?.CSP?.[0].contractedServiceProviderType);
        setSelectedEntity(data.CSP[0])
        setEntityData(data)
    };

    useEffect(() => {
        getAllData();
    }, []);

    const EntityDefaultSet = (Data) => {
        let updatedData = [...Data];
        setIndustryData(updatedData?.[0])
        updatedData?.[0]?.entities.some((list, index) => {
            setEntityData(list?.type)
            if (list.CSP.length > 0) {
                setIsClicked(index);
                setSelectedTitle(list.CSP[0]?.contractedServiceProviderType);
                setSelectedEntity(list.CSP[0])
                return true;
            }
        });
    };

    useEffect(() => {
        EntityDefaultSet(allData);
    }, [allData]);

    return (
        <Fragment>
            <div className={style.departmentCardColumnsGrid}>
                <div>
                    {allData?.map((data, index) => {
                        return data?.entities.length !== 0 ? (
                            <>
                                <div
                                    className={`${style.healthCareListHeader} ${style.HealthCareListBackground3} ${style.spaceBetween} ${style.marginTop10}`}
                                    key={index}
                                    onClick={() => handleToggle(index, data)}
                                >
                                    <img
                                        src={BlackBorderFolder}
                                        className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                        alt=""
                                    />
                                    <p className={style.healthCareHeaderTextStyle4}>
                                        {data.industry}
                                    </p>
                                    {clicked === index ?
                                        <p className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}>-</p>
                                        :
                                        <img src={OpenFolder} alt="OpenFolder" className={`${style.colorFileStyle} ${style.reduce10Left}`} />
                                    }
                                </div>
                                <div
                                    className={
                                        clicked === index
                                            ? `${style.listWrapper} ${style.open}`
                                            : `${style.listWrapper}`
                                    }
                                >
                                    {data?.entities?.map((entity, indx) => {
                                        return entity.CSP.length !== 0 ? (
                                            <>
                                                <div
                                                    className={`${style.healthCareListHeader} ${style.HealthCareListBackground4} ${style.spaceBetween} ${style.marginTop10}`}
                                                    onClick={() => handleToggleCsp(indx, entity)}
                                                >
                                                    <img
                                                        src={BlackBorderFolder}
                                                        className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                                        alt=""
                                                    />
                                                    <p className={style.healthCareHeaderTextStyle5}>
                                                        {" "}
                                                        {entity.type}
                                                    </p>
                                                    {isClicked === indx ?
                                                        <p className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}>-</p>
                                                        :
                                                        <img src={OpenFolder} alt="OpenFolder" className={`${style.colorFileStyle} ${style.reduce10Left}`} />
                                                    }
                                                </div>
                                                <div
                                                    className={
                                                        isClicked === indx
                                                            ? `${style.listWrapper} ${style.open}`
                                                            : `${style.listWrapper}`
                                                    }
                                                >
                                                    {entity?.CSP?.map((siteType) => {
                                                        return (
                                                            <div
                                                                className={
                                                                    siteType?.contractedServiceProviderType ===
                                                                        selectedTitle
                                                                        ? `${style.healthCareListCardStyle}  ${style.marginTop10} ${style.HealthCareListBackground5} ${style.spaceBetween}`
                                                                        : `${style.healthCareListCardStyle2}  ${style.marginTop10}  ${style.spaceBetween}`
                                                                }
                                                                onClick={() => {
                                                                    setSelectedTitle(
                                                                        siteType.contractedServiceProviderType
                                                                    );
                                                                    setIsEdit(false);
                                                                    setSelectedEntity(siteType);
                                                                }}
                                                            >
                                                                <img src={siteType?.contractedServiceProviderType ===
                                                                    selectedTitle ? BlueFolder : IndustriesEntityFolder} className={`${style.colorFileStyle7} ${style.marginLeft5}`} alt="" />
                                                                <p className={`${style.healthCareHeaderTextStyle6} ${style.marginTop10}`}>
                                                                    {siteType.contractedServiceProviderType}
                                                                </p>
                                                                {/* <p className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}>
                                            5
                                          </p> */}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <></>
                        );
                    })}

                    {/* <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                        <img src={BlackBorderFolder} alt="HealthCareFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                        <p className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}>HEALTHCARE</p>
                        <p className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}>-</p>
                    </div>
                    <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                        <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} alt="" />
                        <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Physician / Doctor</p>
                    </div>
                    <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                        <img src={BlueFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} alt="" />
                        <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Dental Professional</p>
                    </div>
                    <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                        <img src={BlackBorderFolder} alt="FinanceFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                        <p className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}>FINANCE</p>
                        <img src={OpenFolder} alt="OpenFolder" className={`${style.colorFileStyle} ${style.reduce10Left}`} />
                    </div>
                    <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                        <img src={BlackBorderFolder} alt="GovernmentFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                        <p className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}>GOVERNMENT</p>
                        <img src={OpenFolder} alt="OpenFolder" className={`${style.colorFileStyle} ${style.reduce10Left}`} />
                    </div> */}
                </div>

                <div className={style.DepartmentEntityCardStyle}>
                    <div className={style.tableHeaderIndustriesEntity}>
                        <p className={style.tableHeaderIndustriesFontStyle}>BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES</p>
                        <p className={style.tableHeaderIndustriesFontStyle}>CREATED DATE</p>
                        <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
                    </div>
                    <div className={style.healthCareIndustriesHeader}>
                        <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                        <p className={style.tableHeaderIndustriesFontStyle}>Physician / Doctor</p>
                    </div>
                    <div className={`${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>American Board of Allergy and Immunology</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} alt="" />
                        <img src={DeleteHcRow} className={style.colorFileStyle} alt="" />
                    </div>
                    <div className={`${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>American Board of Colon and Rectal Surgery</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} alt="" />
                        <img src={DeleteHcRow} className={style.colorFileStyle} alt="" />
                    </div>
                    <div className={`${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                        <img src={SemiTransparentFolder} alt="SemiTransparentFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                        <p className={style.tableDataFontStyle}>American Board of Anesthesiology</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcFolder} onClick={() => getAddBoardCertificationDialog(true)} className={style.colorFileStyle} alt="" />
                        <img src={DeleteHcFolder} className={style.colorFileStyle} alt="" />
                    </div>
                    <div className={`${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>Adult cardiac Anesthesiology</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} alt="" />
                        <img src={DeleteHcRow} className={style.colorFileStyle} alt="" />
                    </div>
                    <div className={`${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>Critical Care Medicine</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} alt="" />
                        <img src={DeleteHcRow} className={style.colorFileStyle} alt="" />
                    </div>
                    <div className={`${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>American Board of Orthopaedic Surgery</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} alt="" />
                        <img src={DeleteHcRow} className={style.colorFileStyle} alt="" />
                    </div>
                </div>
            </div>
            {showAddEntityDialog && <AddBoardCertifcation getAddEntityDialog={getAddEntityDialog} selectedEntity={selectedEntity} isEdit={isEdit} />}
        </Fragment>

    )
}

export default BoardCertification;
