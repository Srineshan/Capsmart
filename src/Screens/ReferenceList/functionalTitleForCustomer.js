import React, { Fragment, useState, useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from "../../Components/Sidebar";
import style from './index.module.scss';
import { Checkbox} from "@blueprintjs/core";
import CrossPink from './../../images/crossPink.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import SelectArrow from './../../images/selectArrow.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddNewEntity from './../../images/addEntity.png';
import AddFunctionalTitlesForCustomer from "./addFunctionalTitleForCustomer";
import { Link } from 'react-router-dom';
import {GET, DELETE, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';

const FunctionalTitleForCustomer = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showFunctionalTitlesDialog , setShowFunctionalTitleDialog] = useState(false);
    const [professionList,setProfessionList] = useState([]);
    const [allData, setAllData] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [cspId,setCspId] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [professionData, setProfessionData] = useState([]);
    const [selectedProfessionList, setSelecetedProfessionList] = useState([]);
    const [selectedProfession, setSelectedProfession] = useState([]);
    const [open, setOpen] = useState(false);

    const getAddFunctionalTitlesDialog = (value) => {
        setShowFunctionalTitleDialog(value);
        getProfessionType();
    }

    const handleDelete = (id) => {
        setCspId(id);
        setShowDeleteConfirmation(true);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getDeleteConfirmation = (value) => {
        if(value){
            handleFileDeletion(cspId);
        }
    }

    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
        {console.log("kong",selectedIndustry)}
    }

    const getAllData = async (industryId) => {
        // const { data: data } = await GET(`entity-service/industryMaster`)
        // console.log(data)
        // setAllData([]);
        // data.forEach(async (industry) => {
        // //   const { data: entities } = await GET(`entity-service/entityTypeMaster?industryId=${industry.id}`)
        // //   console.log(entities)
        // const {data : sites } = await GET(`entity-service/sites`)
        // sites.forEach(async (siteTypeId) => {
        //     const { data: CSPType } = await GET(`entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId.id}`)
        //     console.log("Ok", CSPType)
        //     setAllData((prev) => [...prev, { industry, sites, CSPType }]);
        // })
        // console.log("all", allData)
        // });
    
            const { data: data } = await GET (`entity-service/entityTypeMaster?industryId=${selectedIndustry[0].id}`);
            const interArray = [];
            setAllData([]);
            data.forEach(async (d) => {
                let titlesWithCspData = [];
                const val = await GET (`entity-service/contractedServiceProviderMaster?siteTypeId=${d.id}`);
                val.data.forEach(async (csp)=>{
                    const { data: funcData } = await GET(`entity-service/functionalTitlesForCSPTypeMaster?contractedServiceProviderTypeId=${csp.id}`);
                    console.log("chootabheem",funcData);
                    titlesWithCspData.push({...csp,titles:funcData});
                });
                let inter = { ...d, csps: titlesWithCspData }
                interArray.push(inter);
                setAllData((p) => [...p, inter]);
            });
      }
    
      const getFuntionalTitleData = async (contractPID) => {
        // {console.log("varuma",data)};
      };

      const getProfessionType = async() => {
        const {data : professionData} = await GET (`entity-service/functionalTitlesForCSPType?industryId=${selectedIndustry[0].id}`);
        setSelecetedProfessionList(professionData);
        {console.log("gilli",professionData)}
    };

      const handleFileDeletion = async (id) => {
        await DELETE(`entity-service/functionalTitlesForCSPType/${id}`)
          .then((response) => {
            SuccessToaster("Document Deleted Successfully");
          })
          .catch((error) => {
            ErrorToaster("Unexpected Error occured deleting document");
          })
          getProfessionType();
      };
    
      useEffect(() => {
        getAllData();
        // getFuntionalTitleData();
        // handleFileDeletion();
      }, [selectedIndustry]);

      const handleSave = async () => {
        let datatemp = [];
        if(professionList.length == 0){
            return;
        }
        professionList?.map(professionData => 
            datatemp?.push({
                "title": professionData?.title,
                "alias1": professionData?.alias1,
                "alias2": professionData?.alias2,
                "contractedServiceProviderTypeId": {
                  "id": professionData?.currentCSPType
                },
                "industryId": {
                  "id": selectedIndustry[0].id
                },
                "entityId": {
                  "id": TenantID
                }
            })
        )
        setProfessionList([]);
        setProfessionList([]);
        setProfessionList([]);
        await setProfessionList([]);
        // // return;
        let data = Array.from(new Set(datatemp));
        await POST(`entity-service/functionalTitlesForCSPType`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('Document Added Successfully');
            getProfessionType();
        })
        .catch(error => {
            ErrorToaster(error);
        })
    }

    useEffect(()=>{
        getIndustryData();
        console.log("vanakkam")
    },[]);

    useEffect(()=>{
        getFuntionalTitleData();
    },[selectedIndustry]);

    useEffect(()=>{
        getProfessionType();
    },[selectedIndustry]);

    useEffect( ()=>{
        let AllProfessionDatas = [];

    },[professionData]);

    // return(<>

    //         {console.log("why",allData)}

    // hi
    // </>);

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS FOR HOSPITAL / ACUTE CARE FACILITY (ACF)
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                            <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft5}`} /></Link>
                                {/* <img src={CrossPink} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} /> */}
                            </div>
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}>STANDARD LIST IN USE- DEFAULT</p>
                                            </div>
                                            <div className={style.customersAdminCardStyle1}>
                                                {allData.map((data) => {
                                                    return (
                                                        <>
                                                            <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{data.type}</p>
                                                                <img src={( open ) ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setOpen(!open)}/>
                                                            </div>
                                                            {open && (
                                                                data.csps.map((d) => (
                                                                    <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                                            <Checkbox onChange={(e) => e.target.checked ? setProfessionList([...professionList, d]) : setProfessionList(professionList.filter((e) => e != d.id))} />
                                                                            <p className={`${style.TextStyle4} ${style.marginLeft5}`}>{d.contractedServiceProviderType}</p>
                                                                        </div>
                                                                        
                                                                ))
                                                            )}
                                                        </>
                                                    );
                                                })}
                                                {/* <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>DENTAL Profession</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setDentalList([...dentalList, "Dentist"]) : setDentalList(dentalList.filter((e) => e != "Dentist"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Dentist</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setDentalList([...dentalList, "Orthodontist"]) : setDentalList(dentalList.filter((e) => e != "Orthodontist"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Orthodontist</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setDentalList([...dentalList, "Other"]) : setDentalList(dentalList.filter((e) => e != "Other"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Other (Specify Other)</p>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className={style.customersAdminCardStyle2} onClick={() => {handleSave()}}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => getAddFunctionalTitlesDialog(true)} ></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3}  >
                                            { true ? 
                                                   <>
                                                    {
                                                        selectedProfessionList?.map((data)=>{
                                                        return(
                                                            <div className={style.tableHeaderIndustriesFontStyle}>
                                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            {/* <p className={style.tableDataFontStyle}>{data.contractedServiceProviderType}</p> */}
                                                            <p className={style.tableDataFontStyle}>{data.type}</p>
                                                            <p></p>
                                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedProfession(data);setShowFunctionalTitleDialog(true)}} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(data?.id)}} />
                                                        </div>
                                                        </div>
                                                        )
                                                    })} 
                                                    </> :
                                                    (<p className={style.holidayScheduleCardtextStyle1}>
                                                        if you would like to setup your custom list for your
                                                        site(s) you can select from the default list on the left,
                                                        edit to change labels as needed, and also add new
                                                        departments/ service area by clicking on the add icon
                                                    </p>)
                                                    
                                                }
                                                {/* <p className={style.holidayScheduleCardtextStyle1}>
                                                    if you would like to setup your custom list for your
                                                    site(s) you can select from the default list on the left,
                                                    edit to change labels as needed, and also add new
                                                    departments/ service area by clicking on the add icon
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showFunctionalTitlesDialog && <AddFunctionalTitlesForCustomer getAddFunctionalTitlesDialog={getAddFunctionalTitlesDialog} isEdit={isEdit} selectedProfession={selectedProfession}/>}
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this Profession List?" />}
        </Fragment>
    )
}

export default FunctionalTitleForCustomer;