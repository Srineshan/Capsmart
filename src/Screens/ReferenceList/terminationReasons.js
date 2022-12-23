import React, { Fragment, useState, useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddTerminationReasons from "./addTerminationReasons";
import AddNewEntity from "./../../images/addEntity.png";
import AddRefresh from "./../../images/refreshEntity.png";
// import OpenFolder from "./../../images/openFolder.png";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
//import BlueFolder from "./../../images/blueFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE, PUT } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";

const BoardCertification = () => {
  const [showAddTerminationReasonsDialog, setAddTerminationReasonsDialog] =
    useState(false);
  const [allData, setAllData] = useState([]);
  const [terminationData, setTerminationData] = useState([]);
  const [editTermination, setEditTermination] = useState("")

  //const [currentEntityId, setCurrentEntityId] = useState("");

  const getAddTerminationReasonsDialog = (value) => {
    setAddTerminationReasonsDialog(value);
  };

  const getAllData = async () => {
    const { data: data } = await GET(`entity-service/industryMaster`);
    setAllData([]);
    data.forEach(async (industry) => {
      const { data: entities } = await GET(
        `entity-service/entityTypeMaster?industryId=${industry.id}`
      );
      setAllData((prev) => [...prev, { industry, entities }]);
    });
    console.log(allData.length);
  };

  const getTerminationReasonData = async (siteTypeId) => {
    const { data: data1 } = await GET(
      `entity-service/terminationReasonMaster?siteTypeId=${siteTypeId}`
    );
    setTerminationData(data1);
    console.log("this is the data I need", data1);
  };

  const handleTerminationReasonDeletion = async (id) => {
    await DELETE(`entity-service/terminationReasonMaster/${id}`)
      .then((response) => {
        SuccessToaster("Document Deleted Successfully");
        window.location.reload()
      })
      .then((error) => {
        ErrorToaster(error);
      });
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <Fragment>
      <div className={style.departmentCardColumnsGrid}>
        <div>
          {console.log(allData)}
          {allData.map((industryType) => (
            <>
              <div
                className={`${style.boardCertificationSideRows} ${style.displayInRow}`}
              >
                <img
                  src={BlackBorderFolder}
                  alt="HealthCareFolder"
                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                />
                <p
                  className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}
                >
                  {industryType.industry.industry}
                </p>
                <p
                  className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                >
                  +
                </p>
              </div>
              {industryType.entities.map((entityType) => (
                <>
                  <div
                    className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}
                    onClick={() => {
                      getTerminationReasonData(entityType.id);
                    }}
                  >
                    <img
                      src={IndustriesEntityFolder}
                      alt="IndustriesEntityFolder"
                      className={`${style.colorFileStyle} ${style.marginLeft5}`}

                    />
                    <p
                      className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}
                    >
                      {entityType.type}
                    </p>
                  </div>
                </>
              ))}
            </>
          ))}
        </div>
        <div>
          <div className={style.tableHeaderIndustriesEntity}>
            <p className={style.tableHeaderIndustriesFontStyle}>
              TERMINATION REASONS
            </p>
          </div>
          <div className={style.terminationHeader}>
            <img
              src={IndustriesEntityFolder}
              alt="IndustriesEntityFolder"
              className={`${style.colorFileStyle} ${style.marginLeft5}`}
            />
            <p className={style.tableHeaderIndustriesFontStyle}>
              For Cause By Contractor
            </p>
          </div>
          {terminationData.map((reasonList) => (
            <>
              <div
                className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
              >
                <p></p>
                <p className={style.tableDataFontStyle}>
                  {reasonList.secondary_reasons}
                </p>
                <p></p>
                <p></p>
                <img
                  src={EditHcRow}
                  alt="EditHcRow"
                  className={style.colorFileStyle}
                  onClick={() => setEditTermination()}
                />
                <img
                  src={DeleteHcRow}
                  alt="DeleteHcRow"
                  className={style.colorFileStyle}
                  onClick={handleTerminationReasonDeletion.bind(this, reasonList.id)}
                />
              </div>
            </>
          ))}

          <div
            className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              xxxxxxxxxxxxxxx
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcRow"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              xxxxxxxxxxxxxxxxxxxxxxx
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcRow"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
          <div className={style.terminationHeader}>
            <img
              src={IndustriesEntityFolder}
              alt="IndustriesEntityFolder"
              className={`${style.colorFileStyle} ${style.marginLeft5}`}
            />
            <p className={style.tableHeaderIndustriesFontStyle}>
              For Cause By Entity
            </p>
          </div>
          <div
            className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
          >
            <img
              src={SemiTransparentFolder}
              alt="SemiTransparentFolder"
              className={`${style.colorFileStyle} ${style.marginLeft10}`}
            />
            <p className={style.tableDataFontStyle}>
              Detrimental Professional Competence / Conduct Reports
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcFolder}
              alt="EditHcFolder"
              onClick={() => getAddTerminationReasonsDialog(true)}
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcFolder}
              alt="DeleteHcFolder"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              Complaint or Report Concerning Contractor's Competance
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcRow"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              Complaint or Report Concerning Contractor's Conduct
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcRow"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              Sexual Misconduct or Sexual Abuse Allegation(s)
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcRow"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              Discrimination and/or Harassment Allegation(s)
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcFolder"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
          >
            <img
              src={SemiTransparentFolder}
              alt="SemiTransparentFolder"
              className={`${style.colorFileStyle} ${style.marginLeft10}`}
            />
            <p className={style.tableDataFontStyle}>
              Violation of Contract Rules and / or Policies
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcFolder}
              alt="EditHcFolder"
              onClick={() => getAddTerminationReasonsDialog(true)}
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcFolder}
              alt="DeleteHcFolder"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              Contractor's License to Practice is Suspended
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcRow"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
          <div
            className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
          >
            <p></p>
            <p className={style.tableDataFontStyle}>
              Contractor's License to Practice is Revoked
            </p>
            <p></p>
            <p></p>
            <img
              src={EditHcRow}
              alt="EditHcRow"
              className={style.colorFileStyle}
            />
            <img
              src={DeleteHcRow}
              alt="DeleteHcRow"
              className={style.colorFileStyle}
            />
          </div>
        </div>
      </div>
      {showAddTerminationReasonsDialog && (
        <AddTerminationReasons
          getAddTerminationReasonsDialog={getAddTerminationReasonsDialog}
          TerminationReasonData={getAddTerminationReasonsDialog}
        />
      )}
    </Fragment>
  );
};

export default BoardCertification;
