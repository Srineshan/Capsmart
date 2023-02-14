import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import CrossPink from "./../../images/crossPink.png";
import style from "./index.module.scss";
import SelectArrow from "./../../images/selectArrow.png";
import AddNewEntity from "./../../images/addEntity.png";
import { Link } from "react-router-dom";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import EditBlue from "./../../images/editBlue.png";
import EditHcBlue from './../../images/editHCBlue.png';
import DeleteHcRow from "./../../images/deleteHcRow.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import AddSuffixEntity from "./addSuffixEntity";

const SuffixByCustomer = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [addEditDialog, setAddEditDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [nameList, setNameList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedSuffixList, setSelectedSuffixList] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [masterNameSuffix, setMasterNameSuffix] = useState([]);
  const [entityNameSuffix, setEntityNameSuffix] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedSuffix, setSelectedSuffix] = useState([]);
  const [suffixId, setSuffixId] = useState([]);
  const [suffixData, setSuffixData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    if (selectedIndustry !== undefined) {
      getIndustryData();
      getSuffixData();
    }
  }, [selectedIndustry])

  const handleDelete = (id) => {
    setSuffixId(id);
    setShowDeleteConfirmation(true);
  };

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
    getSuffixType();
  };

  const getIndustryData = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setSelectedIndustry(data?.industryId?.id);
    setSelectedTitle(data?.industryId?.name || '');
  };

  const getSuffixData = async () => {
    const { data: suffixData } = await GET(
      `entity-service/nameSuffixMaster?industryId=${selectedIndustry}`
    );
    setMasterNameSuffix(suffixData);
  };

  const getSuffixType = async () => {
    const { data: suffixData } = await GET(
      `entity-service/nameSuffix?industryId=${selectedIndustry}`
    );
    setEntityNameSuffix(suffixData);
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


  const getAddEntityDialog = (value) => {
    setAddEditDialog(value);
    setIsEdit(value);
  }

  const onSuffixSelect = (data) => {
    if (!selectedSuffixList?.map(data => data?.suffix)?.includes(data?.suffix)) {
      let temp = selectedSuffixList;
      temp.push({
        "suffix": data?.suffix,
        "entityId": {
          "id": TenantID
        },
        "industryId": {
          "id": selectedIndustry
        },
        "customized": true
      })
      setSelectedSuffixList(temp);
    }
  }

  const handleSave = async () => {
    await POST(`entity-service/nameSuffix`, JSON.stringify(selectedSuffixList))
      .then((response) => {
        SuccessToaster("Suffix Added Successfully");
        getSuffixType();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  }

  return (
    <Fragment>
      <Navbar />
      <div className={style.margin20}>
        <div className={style.bigCardGrid}>
          <SideBar />
          <div>
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                NAME SUFFIX
              </div>
              <div
                className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}
              >
                UPDATED ON FEB 16, 2022 16:45 EST
              </div>
              <div className={style.crossStyle}>
                <Link
                  to="/Screens/ReferenceList/customerAdminDashboard"
                  className={style.linkStyle}
                >
                  {" "}
                  <img
                    src={CrossPink}
                    className={`${style.colorFileStyle2} ${style.marginLeft20}`}
                  />
                </Link>
              </div>
            </div>

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.customersAdminColumngrid1}>
                    <div>
                      <div className={style.holidayScheduleHeader1}>
                        <p
                          className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}
                        >
                          {" "}
                          DEFAULT LIST IN USE{" "}
                        </p>
                      </div>
                      <div
                        className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}
                      >
                        {masterNameSuffix?.filter(data => !entityNameSuffix?.map(suffix => suffix?.suffix)?.includes(data?.suffix))?.map((data, index) => (
                          <div key={`${data?.suffix} ${index}`}
                            className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}
                          >
                            <Checkbox onChange={() => onSuffixSelect(data)} />
                            <p className={`${style.TextStyle4}`}>{data?.suffix}</p>
                          </div>))}
                      </div>
                    </div>
                    <div
                      className={style.customersAdminCardStyle2}
                      onClick={() => { setIsSelected(true); handleSave(); }}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        className={`${style.colorFileStyle4}`}
                      />
                    </div>
                    <div>
                      <div className={`${style.holidayScheduleHeader2}`}>
                        <p></p>
                        <p
                          className={`${style.holidayScheduleHeadertextStyle1}`}
                        >
                          MY CUSTOM LIST TO USE
                        </p>
                        <img
                          src={AddNewEntity}
                          className={`${style.colorFileStyle} ${style.marginLeft150} `}
                          onClick={() => { setAddEditDialog(true); }}
                        ></img>
                      </div>
                      {
                        entityNameSuffix?.length !== 0 ? (
                          <div
                            className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}
                          >
                            {entityNameSuffix?.map(data => (
                              <div >
                                <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                  <p></p>
                                  <p className={style.tableDataFontStyle}>{data?.suffix}</p>
                                  <p className={style.tableDataFontStyle}></p>
                                  <img src={EditBlue} className={style.colorFileStyle} onClick={() => { setAddEditDialog(true); setIsEdit(true); setSelectedItem(data) }} />
                                  <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => { handleDelete(data?.id) }} />
                                </div>
                              </div>
                            ))}
                          </div>)
                          : (<div className={style.customersAdminCardStyle3}>
                            <p className={style.holidayScheduleCardtextStyle1}>
                              if you would like to setup your custom list for your
                              site(s) you can select from the default list on the
                              left, edit to change labels as needed, and also add
                              new departments/ service area by clicking on the add
                              icon
                            </p>
                          </div>
                          )
                      }

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

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Suffix?"
        />
      )}

      {
        addEditDialog && <AddSuffixEntity getAddEntityDialog={getAddEntityDialog} getIndustryData={getSuffixType} selectedEntity={selectedItem} IndustryId={selectedIndustry} isEdit={isEdit} getEntityData={getSuffixType} tableEntityData={entityNameSuffix} callingFrom={'Customer Admin'} selectedTitle={selectedTitle} />
      }
    </Fragment >
  );
};

export default SuffixByCustomer;
