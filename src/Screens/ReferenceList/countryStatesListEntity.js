import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SideBar from "../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddNewEntity from "./../../images/addEntity.png";
import AddRefresh from "./../../images/refreshEntity.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditBlue from "./../../images/editBlue.png";
import EditHcRow from "./../../images/editHcRow.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import AddContractDocumentTypeForUpload from "./addContractDocumentTypeForUpload";
import Titlebar from "../../Components/titlemenu";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import ArrowDown from "./../../images/arrowDown.png";
import { GET, DELETE } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import AddStatesEntity from "./addStatesEntity";

const CountryStatesListEntity = ({ getAddStateList, getCountryList, selectedCountry }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteState, setShowDeleteState] = useState(false);
  const [deleteCountryId, setDeleteCountryId] = useState("");
  const [deleteStateId, setDeleteStateId] = useState("");
  const [showStateDialog, setShowStateDialog] = useState(false);
  const [stateDataList, setStateDataList] = useState([]);
  const [isStateEdit, setIsStateEdit] = useState(false);
  const [selectedState, setSelectedState] = useState({});

  console.log("selectedCountry", selectedCountry)

  useEffect(() => {
    getStateList();
  }, []);

  const getAddStateDialog = (value) => {
    setShowStateDialog(value);
  };

  const deleteCountryHandler = (data) => {
    setDeleteCountryId(data?.id);
    setShowDeleteConfirmation(true);
  };

  const deleteStateHandler = (data) => {
    setDeleteStateId(data?.id);
    setShowDeleteState(true);
  };

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
  };

  const getShowDeleteState = (value) => {
    setShowDeleteState(value);
  };

  const getDeleteConfirmation = (value) => {
    if (value) {
      deleteCountry(deleteCountryId)
    }
  };

  const getDeleteStateConfirmation = (value) => {
    if (value) {
      deleteState(deleteStateId)
    }
  };

  const deleteCountry = async (id) => {
    await DELETE(`entity-service/countryMaster/${id}`)
      .then((response) => {
        SuccessToaster("Country Deleted Successfully");
        getAddStateList(false);
        getCountryList();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const deleteState = async (id) => {
    await DELETE(`entity-service/stateMaster/${id}`)
      .then((response) => {
        SuccessToaster("State Deleted Successfully");
        getStateList();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const getStateList = async () => {
    const { data: stateData } = await GET(`entity-service/stateMaster?countryId=${selectedCountry?.id}`);
    // console.log("stateData", stateData)
    setStateDataList(stateData)
  };

  return (
    <Fragment>
      <div className={style.margin20}>
        <div className={style.countryDisplayTable}>
          {/* //Table */}
          <div className={style.countryCardStyle}>
            <div className={style.tableHeaderCountryList}>
              <p
                className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft20}`}
              >
                COUNTRY / STATES / PPROVINCE / TERRITORY
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}>
                ABBREVIATION
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}>
                DATE FORMAT
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}>
                CURRENCY TYPE
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}></p>
            </div>


            {
              <div className={style.stateListHeader}>
                <img
                  src={IndustriesEntityFolder}
                  alt=""
                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                />
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  {selectedCountry?.country}
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  {selectedCountry?.abbreviation}
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  {selectedCountry?.dateFormat}
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  {selectedCountry?.currencyType}
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}></p>
                <img
                  src={EditHcFolder}
                  className={style.colorFileStyle}
                  alt=""
                  onClick={() => {
                    setIsStateEdit(false);
                    getAddStateDialog(true)
                  }}
                />
                <img
                  src={DeleteHcFolder}
                  className={style.colorFileStyle}
                  alt=""
                  onClick={() => { deleteCountryHandler(selectedCountry) }}
                />
              </div>
            }

            {stateDataList?.map((data, innerIndex) => {
              return (
                <>
                  <div className={
                    innerIndex % 2 !== 0
                      ? `${style.countryTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                      : `${style.countryTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                  }>
                    <p className={style.tableDataFontStyle}>{data?.state}</p>
                    <p className={style.tableDataFontStyle}>{data?.abbreviation}</p>
                    <p className={style.tableDataFontStyle}></p>
                    <p className={style.tableDataFontStyle}></p>
                    <p className={style.tableDataFontStyle}></p>
                    <img
                      src={EditHcRow}
                      className={style.colorFileStyle}
                      alt=""
                      onClick={() => {
                        setIsStateEdit(true);
                        setSelectedState(data);
                        getAddStateDialog(true);
                      }}
                    />
                    <img
                      src={DeleteHcRow}
                      className={style.colorFileStyle}
                      alt=""
                      onClick={() => { deleteStateHandler(data) }}
                    />
                  </div>
                </>
              )
            })}

            <div className={style.marginBottom20}></div>
          </div>
        </div>
      </div>

      {showStateDialog && <AddStatesEntity getAddStateDialog={getAddStateDialog} countryId={selectedCountry?.id} getStateList={getStateList} isStateEdit={isStateEdit} selectedState={selectedState} />}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Country?"
        />
      )}

      {showDeleteState && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteState}
          getDeleteConfirmation={getDeleteStateConfirmation}
          confirmationText="Do you want to delete this State?"
        />
      )}
    </Fragment >
  );
};

export default CountryStatesListEntity;
