import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddTerminationReasons from "./addTerminationReasons";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE } from "../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import AddContractedServiceByEntity from "./addContractedServiceByEntity";
import AddContractedServiceByIndustries from "./addContractedServiceByIndustries";

const ContractedServicesByIndustries = ({
  getAddEntityDialog,
  showAddEntityDialog,
  isEdit,
  setIsEdit,
  sendLastDate,
}) => {
  const [showAddHcEntityDialog, setShowAddHcEntityDialog] = useState(false);
  const [allData, setAllData] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [industryData, setIndustryData] = useState({});
  const [selectedEntity, setSelectedEntity] = useState({});
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isSecondary, setIsSecondary] = useState(false);
  const [selectedTermination, setSelectedTermination] = useState({});
  const [terminationData, setTerminationData] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");

  const getAddHcEntityDialog = (value) => {
    setShowAddHcEntityDialog(value);
  };

  const entityAllData = async (industry) => {
    const { data: entities } = await GET(
      `entity-service/entityTypeMaster?industryId=${industry.id}`
    );

    const reconstructedEntities = await Promise.all(
      entities.map(terminationAllData)
    );
    return await { ...industry, entities: reconstructedEntities };
  };

  const terminationAllData = async (siteTypeId) => {
    const { data: terminationType } = await GET(
      `entity-service/terminationReasonMaster?siteTypeId=${siteTypeId.id}`
    );
    return await { ...siteTypeId, terminationType };
  };

  const getAllData = async () => {
    const { data: Entitydata } = await GET(`entity-service/industryMaster`);
    let allEntries = await Promise.all(Entitydata.map(entityAllData));
    setAllData(allEntries);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.terminationReason.lastModified);

    sendLastDate(
      date
        .toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "short",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
          year: "numeric",
          timeZoneName: "short",
          hour12: false,
        })
        .toUpperCase()
    );
  };

  const handleToggle = (index, data) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setSelectedTitle(data?.entities?.[0].type);
    setSelectedEntity(data.entities[0]);
    setClicked(index);
    setIndustryData(data);
  };

  const getTerminationReasonData = async () => {
    const { data: reasonData } = await GET(
      `entity-service/terminationReasonMaster?siteTypeId=${selectedEntity?.id}`
    );
    setTerminationData(reasonData);
  };

  const deleteHandler = (data) => {
    setDeleteEntityId(data?.id);
    setShowDeleteConfirmation(true);
  };

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
  };

  const getDeleteConfirmation = (value) => {
    if (value) {
      deleteEntity(deleteEntityId);
    }
  };

  const deleteEntity = async (id) => {
    await DELETE(`entity-service/terminationReasonMaster/${id}`)
      .then((response) => {
        SuccessToaster("Termination Deleted Successfully");
        getTerminationReasonData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const EntityDefaultSet = (Data) => {
    let updatedData = [...Data];
    setIndustryData(updatedData?.[0]);
    updatedData.some((list, index) => {
      if (list.entities.length > 0) {
        setClicked(index);
        setSelectedTitle(list.entities[0]?.type);
        setSelectedEntity(list.entities[0]);
        return true;
      }
    });
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    EntityDefaultSet(allData);
  }, [allData]);

  useEffect(() => {
    getTerminationReasonData();
  }, [selectedTitle]);

  return (
    <Fragment>
      <div className={style.departmentCardColumnsGrid}>
        <div>
          {allData?.map((data, index) => {
            return data?.entities.length !== 0 ? (
              <>
                <div
                  className={`${style.contractedSerrvicesSideRows} ${style.displayInRow}`}
                  key={index}
                  onClick={() => handleToggle(index, data)}
                >
                  <img
                    src={BlackBorderFolder}
                    alt="HealthCareFolder"
                    className={`${style.colorFileStyle} ${style.marginLeft5}`}
                  />
                  <p
                    className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}
                  >
                    {data.industry}
                  </p>
                  <p
                    className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                  >
                    {clicked === index ? "—" : "+"}
                  </p>
                </div>
                <div
                  className={
                    clicked === index
                      ? `${style.listWrapper} ${style.open}`
                      : `${style.listWrapper} `
                  }
                >
                  {data?.entities?.map((entity) => (
                    <div
                      className={
                        entity?.type === selectedTitle
                          ? `${style.ContractedServiceListInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}  ${style.marginLeft20} `
                          : `${style.ContractedServiceListInnerFolderRows} ${style.displayInRow} ${style.marginLeft20}`
                      }
                      onClick={() => {
                        setSelectedTitle(entity.type);
                        setIsEdit(false);
                        setSelectedEntity(entity);
                      }}
                    >
                      <img
                        src={IndustriesEntityFolder}
                        alt="IndustriesEntityFolder"
                        className={`${style.colorFileStyle} ${style.marginLeft5}`}
                      />
                      <p
                        className={`${style.ContractedServiceTextStyle} ${style.marginLeft10}`}
                      >
                        {entity.type}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            );
          })}
        </div>

        <div className={style.industriesEntityCardStyle}>
          <div className={style.contractedServiceHeader}>
            <p className={style.tableHeaderIndustriesFontStyle}></p>
            <p className={style.tableHeaderIndustriesFontStyle}>
              CONTRACTED SERVICES BY HEALTHCARE
            </p>
            <p className={style.tableHeaderIndustriesFontStyle}></p>
            <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
          </div>

          <div className={style.terminationHeader}>
            <img
              src={IndustriesEntityFolder}
              alt="IndustriesEntityFolder"
              className={`${style.colorFileStyle} ${style.marginLeft5}`}
            />
            <p className={style.tableSubHeaderIndustriesFontStyle}>
              Hospital/Acute Care Facility (ACF)
            </p>
            <img
              src={EditHcFolder}
              className={style.colorFileStyle}
              // onClick={() => getAddContractedServiceDialog(true)}
              alt=""
            />
            <img src={DeleteHcFolder} className={style.colorFileStyle} alt="" />
          </div>
          <div
            className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
          >
            <p className={style.tableDataFontStyle}>Physician / Doctor</p>
            <p className={style.tableDataFontStyle}></p>
            <p className={style.tableDataFontStyle}>03-29-2022</p>
            <img src={EditHcRow} className={style.colorFileStyle} alt="" />
            <img src={DeleteHcRow} className={style.colorFileStyle} alt="" />
          </div>
          <div
            className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
          >
            <p className={style.tableDataFontStyle}>Dental Professional</p>
            <p className={style.tableDataFontStyle}></p>
            <p className={style.tableDataFontStyle}>03-29-2022</p>
            <img src={EditHcRow} className={style.colorFileStyle} alt="" />
            <img src={DeleteHcRow} className={style.colorFileStyle} alt="" />
          </div>
        </div>
      </div>

      {showAddEntityDialog && (
        <AddContractedServiceByIndustries
          getAddEntityDialog={getAddEntityDialog}
        />
      )}

      {showAddHcEntityDialog && (
        <AddContractedServiceByEntity
          getAddHcEntityDialog={getAddHcEntityDialog}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Termination?"
        />
      )}
    </Fragment>
  );
};

export default ContractedServicesByIndustries;
