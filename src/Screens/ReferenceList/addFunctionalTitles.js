import React, { useEffect, useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  InputGroup,
  Button,
} from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { POST, GET, PUT } from "./../dataSaver";

const AddFunctionalTitles = ({
  getAddEntityDialog,
  isEdit,
  getFuntionalTitleData,
  selectedEntity,
  selectedFunctional,
  IndustryData,
  EntityData,
  getEntityDataList,
  selectedTitle,
}) => {
  const [functionalId, setFunctionalId] = useState("");
  const [title, setTitle] = useState("");
  const [alias1, setalias1] = useState("");
  const [alias2, setalias2] = useState("");
  const [currentindustryType, setCurrentIndustryType] = useState(
    IndustryData?.id ? IndustryData.id : ""
  );
  const [currentEntityType, setCurrentEntityType] = useState(
    EntityData?.id ? EntityData.id : ""
  );
  const [currentCSPType, setCurrentCSPType] = useState(
    selectedEntity?.id ? selectedEntity.id : ""
  );
  const [industryTypes, setIndustryTypes] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [contarctedServiceProviderType, setContarctedServiceProviderType] =
    useState([]);
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

  const saveSubmitHandler = async (type) => {
    const isPresent = getEntityDataList.find((p) => p.title === title);
    if (isPresent) {
      ErrorToaster("Already This Name Exists");
      document.getElementById("functionalTitleEl").focus();
      getAddEntityDialog(true);
      return false;
    }

    if (!title && title === "") {
      document.getElementById("functionalTitleEl").focus();
      return false;
    }

    const data = {
      ...(isEdit && { id: functionalId }),
      ...(isEdit && { createdDate: createdDate }),
      title: title,
      alias1: alias1,
      alias2: alias2,
      contractedServiceProviderTypeId: {
        id: currentCSPType,
      },
      entityId: {
        id: currentEntityType,
      },
    };

    if (!isEdit) {
      await POST(
        "entity-service/functionalTitlesForCSPTypeMaster",
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Functionl Title Added Successfully");
          getFuntionalTitleData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/functionalTitlesForCSPTypeMaster/${functionalId}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Functionl Title Updated Successfully");
          getFuntionalTitleData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }

    if (type !== "Add More") {
      getAddEntityDialog(false);
    } else {
      setTitle("");
      setalias1("");
      setalias2("");
      document.getElementById("functionalTitleEl").focus();
      getFuntionalTitleData();
    }
  };

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

  //   useEffect(() => {
  //     if (contarctedServiceProviderType.length !== 0) {
  //       setCurrentCSPType(contarctedServiceProviderType?.[0]?.id);
  //     }
  //   }, [currentEntityType, contarctedServiceProviderType]);

  useEffect(() => {
    if (isEdit) {
      setCurrentIndustryType(IndustryData?.id);
      setEntityTypes([{ ...EntityData }]);
      setContarctedServiceProviderType([{ ...selectedEntity }]);
      setCurrentEntityType(EntityData?.id);
      setCurrentCSPType(selectedEntity?.id);
      setFunctionalId(selectedFunctional?.id);
      setTitle(selectedFunctional?.title);
      setalias1(selectedFunctional?.alias1);
      setalias2(selectedFunctional?.alias2);
      setCreatedDate(selectedFunctional?.createdDate);
    }
  }, [selectedFunctional]);

  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };

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
            {`Add/Edit Functional Titles For ${selectedTitle}`}
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
          <div className={`${style.editHealthCareGrid2}`}>
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
          <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
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
            className={`${style.ReferenceListEntityBorder} ${style.marginTop10}`}
          ></div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.editHealthCareGrid2}`}>
              <div className={style.entityLableStyle}>Functional Title*</div>
              <InputGroup
                value={title}
                id="functionalTitleEl"
                className={style.fullWidth}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div
              className={`${style.editFunctionalTitlesGrid} ${style.marginTop20}`}
            >
              <div className={style.entityLableStyle}>ALias Name</div>
              <InputGroup
                value={alias1}
                className={style.fullWidth}
                onChange={(e) => setalias1(e.target.value)}
              />
              <InputGroup
                value={alias2}
                className={`${style.fullWidth}`}
                onChange={(e) => setalias2(e.target.value)}
              />
            </div>
          </div>
          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            {!isEdit && (
              <>
                {title.length > 0 ? (
                  <div
                    className={`${style.buttonStyle3} ${style.addMoreCardStyle}`}
                    onClick={() => saveSubmitHandler("Add More")}
                  >
                    ADD MORE
                  </div>
                ) : (
                  <div
                    className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                    onClick={() => saveSubmitHandler("Add More")}
                  >
                    ADD MORE
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddEntityDialog(false)}
            >
              CANCEL
            </button>
            <button
              onClick={() => saveSubmitHandler("Save & Exit")}
              className={`${style.buttonStyle} ${style.marginLeft20}`}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddFunctionalTitles;
