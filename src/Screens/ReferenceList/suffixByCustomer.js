import React, { Fragment, useState } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import CrossPink from './../../images/crossPink.png';
import style from './index.module.scss';
import SelectArrow from './../../images/selectArrow.png';
import AddNewEntity from './../../images/addEntity.png';
import { Link } from "react-router-dom";

const SuffixByCustomer = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [nameList, setNameList] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [allNameSuffix, setAllNameSuffix] = useState([]);
  const [selectedNameSuffix, setSelectedNameSuffix] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState({});
  const [selectedSuffix, setSelectedSuffix] = useState([]);
  const [suffixId, setSuffixId] = useState([]);
  const [suffixData, setSuffixData] = useState([]);

  const handleDelete = (id) => {
    setSuffixId(id);
    setShowDeleteConfirmation(true);
  };

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
    getSuffixType();
  };

  const getIndustryData = async () => {
    const { data: data } = await GET(`entity-service/industryMaster`);
    setSelectedIndustry(
      data
        ?.filter((data) => data?.industry === "HEALTHCARE")
        ?.map((data) => data)
    );
  };

  const getSuffixData = async () => {
    const { data: suffixData } = await GET(
      `entity-service/nameSuffixMaster?industryId=${selectedIndustry[0].id}`
    );
    setAllNameSuffix(suffixData);
  };

  const getSuffixType = async () => {
    const { data: suffixData } = await GET(
      `entity-service/nameSuffix?industryId=${selectedIndustry[0].id}`
    );
    setSelectedNameSuffix(suffixData);
  };

  const getDeleteConfirmation = (value) => {
    if (value) {
      deleteSuffix(suffixId);
    }
  };

  const deleteSuffix = async (id) => {
    await DELETE(`entity-service/nameSuffix/${id}`)
      .then((response) => {
        SuccessToaster("Name Suffix Deleted Successfully");
      })
      .catch((error) => {
        ErrorToaster(error);
      });
    getSuffixType();
  };

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    getSuffixType();
  }, [selectedIndustry]);

  useEffect(() => {
    getSuffixData();
  }, [selectedIndustry]);

  useEffect(() => {
    let allSuffix = [];
  }, [suffixData]);

  const handleSave = async () => {
    let datatemp = [];
    if (nameList.length == 0) {
      return;
    }
    nameList?.map((suffixData) =>
      datatemp?.push({
        suffix: suffixData?.suffix,
        industryId: {
          id: selectedIndustry[0].id,
        },
        entityId: {
          id: TenantID,
        },
      })
    );
    setNameList([]);
    setNameList([]);
    setNameList([]);
    await setNameList([]);
    // // return;
    let data = Array.from(new Set(datatemp));
    console.log(datatemp);
    console.log(data);
    // await POST(`entity-service/nameSuffix`, JSON.stringify(data))
    //   .then((response) => {
    //     SuccessToaster("Name Suffix Added Successfully");
    //     getSuffixType();
    //   })
    //   .catch((error) => {
    //     ErrorToaster(error);
    //   });
  };

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                NAME SUFFIX
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} /></Link>
                            </div>
                        </div>

                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> DEFAULT LIST IN USE </p>
                                            </div>
                                            <div className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>MD</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.TextStyle4}`}>DO</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.TextStyle4}`}>MS</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>BD</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>RN</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.TextStyle4}`}>PA</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>RPA</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>PHD</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>CISCO</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>CEO</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2}  ${style.marginBottom50} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>CFO</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style.customersAdminCardStyle2} onClick={() => setIsSelected(true)}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `}></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3}>

                                                <p className={style.holidayScheduleCardtextStyle1}>
                                                    if you would like to setup your custom list for your
                                                    site(s) you can select from the default list on the left,
                                                    edit to change labels as needed, and also add new
                                                    departments/ service area by clicking on the add icon
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
                    <p className={style.poweredBy}>© TimeSmartAI</p>
                </div>
            </div>
        </Fragment>
    )
}

export default SuffixByCustomer;