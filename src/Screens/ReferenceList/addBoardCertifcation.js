import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  InputGroup,
  Button,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import AddHealthcareGroup from "./../../images/addGroupBlue.png";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { POST, GET, PUT } from "../dataSaver";

const AddBoardCertifcation = ({
  getAddEntityDialog,
  isEdit,
  selectedEntity,
  IndustryData,
  EntityData,
  selectedBoard,
  getBoardCertificationData,
  isSecondary,
}) => {
  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };

  const [industryTypes, setIndustryTypes] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [contarctedServiceProviderType, setContarctedServiceProviderType] =
    useState([]);
  const [currentindustryType, setCurrentIndustryType] = useState(
    IndustryData?.id ? IndustryData.id : ""
  );
  const [currentEntityType, setCurrentEntityType] = useState(
    EntityData?.id ? EntityData.id : ""
  );
  const [currentCSPType, setCurrentCSPType] = useState(
    selectedEntity?.id ? selectedEntity.id : ""
  );
  const [boardId, setBoardId] = useState("");
  const [primaryBoardName, setPrimaryBoardName] = useState("");
  const [primaryBoardUrl, setPrimaryBoardUrl] = useState("");
  const [secondaryBoardName, setSecondaryBoardName] = useState("");
  const [secondaryBoardUrl, setSecondaryBoardUrl] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const getAllIndustries = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    setIndustryTypes(industryData);
  };

  const getEntityData = async (industryId) => {
    const { data: types } = await GET(
      `entity-service/entityTypeMaster?industryId=${industryId}`
    );
    setEntityTypes(types);
  };

  const getContractedServiceProviderData = async (cspId) => {
    const { data: csptypes } = await GET(
      `entity-service/contractedServiceProviderMaster?siteTypeId=${cspId}`
    );
    setContarctedServiceProviderType(csptypes);
  };

  const AddSaveBoardCertification = async () => {
    let SecondaryBoardData = [];
    if (selectedBoard?.secondaryBoards) {
      SecondaryBoardData = [...selectedBoard.secondaryBoards];
    } else {
      SecondaryBoardData = [];
    }

    if (secondaryBoardName !== "" && secondaryBoardUrl !== "") {
      SecondaryBoardData.push({
        name: secondaryBoardName,
        url: secondaryBoardUrl,
      });
    }

    if (!primaryBoardName && primaryBoardName === "") {
      document.getElementById("primaryBoardNameEl").focus();
      return false;
    }

    const data = {
      ...(isEdit && { id: boardId }),
      ...(isEdit && { createdDate: createdDate }),
      primaryBoard: {
        name: primaryBoardName,
        url: primaryBoardUrl,
      },
      secondaryBoards: SecondaryBoardData,
      contractedServiceProviderType: currentCSPType,
      industry: currentindustryType,
    };

    if (
      !isEdit
        ? await POST(
            "entity-service/boardCertificateSpecialtiesMaster",
            JSON.stringify(data)
          )
            .then((response) => {
              SuccessToaster("BoardCertificateSpecialties Added Successfully");
              getAddEntityDialog(false);
              getBoardCertificationData();
            })
            .catch((error) => {
              ErrorToaster(error);
            })
        : await PUT(
            `entity-service/boardCertificateSpecialtiesMaster/${boardId}`,
            JSON.stringify(data)
          )
            .then((response) => {
              SuccessToaster(
                "BoardCertificateSpecialties Updated Successfully"
              );
              getAddEntityDialog(false);
              getBoardCertificationData();
            })
            .catch((error) => {
              ErrorToaster(error);
            })
    )
      getAddEntityDialog(false);
  };

  const AddMoreBoardCertification = async () => {
    let SecondaryBoardData = [];
    if (secondaryBoardName !== "" && secondaryBoardUrl !== "") {
      SecondaryBoardData.push({
        name: secondaryBoardName,
        url: secondaryBoardUrl,
      });
    }

    const data = {
      primaryBoard: {
        name: primaryBoardName,
        url: primaryBoardUrl,
      },
      secondaryBoards: SecondaryBoardData,
      contractedServiceProviderType: currentCSPType,
      industry: currentindustryType,
    };
    getAddEntityDialog(true);
    setEntityTypes([]);
    setContarctedServiceProviderType([]);
    setCurrentIndustryType("");
    setCurrentEntityType("");
    setCurrentCSPType("");
    setPrimaryBoardName("");
    setPrimaryBoardUrl("");
    setSecondaryBoardName("");
    setSecondaryBoardUrl("");
    await POST(
      "entity-service/boardCertificateSpecialtiesMaster",
      JSON.stringify(data)
    )
      .then((response) => {
        SuccessToaster("BoardCertificateSpecialties Added Successfully");
        getAddEntityDialog(true);
      })
      .catch((error) => {
        ErrorToaster(error);
      });
    getAddEntityDialog(true);
  };

  useEffect(() => {
    if (isEdit) {
      setCurrentIndustryType(IndustryData?.id);
      setEntityTypes([{ ...EntityData }]);
      setContarctedServiceProviderType([{ ...selectedEntity }]);
      setCurrentEntityType(EntityData?.id);
      setCurrentCSPType(selectedEntity?.id);
      setBoardId(selectedBoard?.id);
      setCreatedDate(selectedBoard?.createdDate);
      setPrimaryBoardName(selectedBoard?.primaryBoard.name);
      setPrimaryBoardUrl(selectedBoard?.primaryBoard.url);
      if (isSecondary) {
        setSecondaryBoardName(selectedBoard?.secondaryBoards[0]?.name);
        setSecondaryBoardUrl(selectedBoard?.secondaryBoards[0]?.url);
      }
    }
  }, [selectedBoard]);

  useEffect(() => {
    getAllIndustries();
  }, []);

  useEffect(() => {
    if (IndustryData?.id) {
      getEntityData(IndustryData?.id);
    }
  }, [IndustryData]);

  useEffect(() => {
    if (EntityData?.id) {
      getContractedServiceProviderData(EntityData?.id);
    }
  }, [EntityData]);

  return (
    <Dialog
      isOpen={getAddEntityDialog}
      onClose={() => getAddEntityDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            ADD / Edit Board Certification Specialties
          </p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddEntityDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid} `}>
            <div className={style.entityLableStyle}>Industry Type*</div>
            <div className={style.displayInRow}>
              <select
                value={currentindustryType}
                className={style.fullWidth}
                rightElement={arrowDown()}
                onChange={(obj) => {
                  setCurrentIndustryType(obj.target.value);
                  getEntityData(obj.target.value);
                }}
              >
                {industryTypes.map((type) => (
                  <option value={type.id}>{type.industry}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Entity / Site Type*</div>
            <div className={style.displayInRow}>
              <select
                value={currentEntityType}
                className={style.fullWidth}
                rightElement={arrowDown()}
                onChange={(obj) => {
                  setCurrentEntityType(obj.target.value);
                  getContractedServiceProviderData(obj.target.value);
                }}
              >
                {entityTypes.map((type) => (
                  <option value={type.id}>{type.type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              Contracted Service Provide Type*
            </div>
            <div className={style.displayInRow}>
              <select
                value={currentCSPType}
                className={style.fullWidth}
                rightElement={arrowDown()}
                onChange={(obj) => {
                  setCurrentCSPType(obj.target.value);
                }}
              >
                {contarctedServiceProviderType.map((type) => (
                  <option value={type.id}>
                    {type.contractedServiceProviderType}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              Primary Specialty Board*
            </div>
            <div className={style.displayInRow}>
              <InputGroup
                value={primaryBoardName}
                id="primaryBoardNameEl"
                className={style.fullWidth}
                onChange={(e) => setPrimaryBoardName(e.target.value)}
              />
              <RadioGroup
                inline={true}
                className={` ${style.marginLeft20} ${style.marginTop}`}
                selectedValue={"ADD SUB-SPECIALTY"}
              >
                <Radio label="ADD SUB-SPECIALTY" value="ADD SUB-SPECIALTY" />
              </RadioGroup>
            </div>
          </div>
          <div className={style.extentionGrid}>
            <p></p>
            <InputGroup
              value={primaryBoardUrl}
              className={`${style.entityLableStyle}`}
              onChange={(e) => setPrimaryBoardUrl(e.target.value)}
            />
          </div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.extentionGrid}`}>
              <div className={style.entityLableStyle}>
                Sub- Specialty Board*
              </div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={secondaryBoardName}
                  className={style.fullWidth}
                  onChange={(e) => setSecondaryBoardName(e.target.value)}
                />
              </div>
            </div>
            <div className={style.extentionGrid}>
              <p></p>
              <InputGroup
                value={secondaryBoardUrl}
                className={`${style.entityLableStyle}`}
                onChange={(e) => setSecondaryBoardUrl(e.target.value)}
              />
            </div>
          </div>
          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            <div
              className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
            >
              ADD MORE
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              onClick={AddMoreBoardCertification}
              className={style.outlinedButton}
            >
              SAVE & ADDMORE
            </button>
            <button
              onClick={AddSaveBoardCertification}
              className={`${style.buttonStyle} ${style.marginLeft20}`}
            >
              SAVE & CLOSE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddBoardCertifcation;
