import React, { useEffect, useState } from "react";
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
import ArrowDown from "./../../../images/arrowDown.png";
import style from "./../index.module.scss";
import { POST, PUT, TenantID } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import WritingFile from "./../../../images/writing-file.svg";

const ApplicantTypeDialog = ({
  getAddContractedServiceDialog,
  isEdit,
  selectedContractedServiceProvider,
  entityType,
  siteTypeId,
  getContractedServiceProvider,
  siteEntityCount,
  multiSiteEntity,
}) => {
  const [contractedServiceProviderType, setContractedServiceProviderType] =
    useState("");
  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };

  console.log(siteEntityCount, multiSiteEntity);

  useEffect(() => {
    if (isEdit) {
      setContractedServiceProviderType(
        selectedContractedServiceProvider?.contractedServiceProviderType
      );
    } else {
      setContractedServiceProviderType("");
    }
  }, [selectedContractedServiceProvider]);

  const saveSubmitHandler = async (type) => {
    const data = {
      ...(isEdit && { id: selectedContractedServiceProvider?.id }),
      ...(isEdit && {
        createdDate: selectedContractedServiceProvider?.createdDate,
      }),
      ...(isEdit && { lastModifiedDate: new Date() }),
      contractedServiceProviderType: contractedServiceProviderType,
      siteTypeId: {
        id: siteTypeId,
      },
      entityId: {
        id: TenantID,
      },
      customized: true,
    };

    if (!isEdit) {
      await POST(
        "entity-service/contractedServiceProvider",
        JSON.stringify([data])
      )
        .then((response) => {
          SuccessToaster("Contracted Service Provider Added Successfully");
          getContractedServiceProvider();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/contractedServiceProvider/${selectedContractedServiceProvider?.id}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Contracted Service Provider Updated Successfully");
          getContractedServiceProvider();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
    if (type !== "Add More") {
      getAddContractedServiceDialog(false);
      getContractedServiceProvider();
    } else {
      setContractedServiceProviderType("");
    }
  };

  return (
    <Dialog
      isOpen={getAddContractedServiceDialog}
      onClose={() => {
        getAddContractedServiceDialog(false);
        setContractedServiceProviderType("");
      }}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p
            className={style.extensionStyle}
          >{`Add New Applicant Type For ${entityType}`}</p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img
              src={WritingFile}
              className={style.dialogCrossStyle}
              alt="Writing File"
            />
            <div>
              <Icon
                icon="cross"
                size={30}
                intent={Intent.DANGER}
                className={style.dialogCrossStyle}
                // onClick={() => {
                //   getAddEntityDialog(false);
                //   getTerminationReasonData();
                // }}
              />
            </div>
          </div>{" "}
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLableStyle}>CATEGORY*</div>
            <InputGroup
              value={`${entityType} ${
                multiSiteEntity === true
                  ? "    ( " + siteEntityCount + " sites )"
                  : ""
              }`}
              className={style.fullWidth}
              rightElement={arrowDown()}
            />
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
            <InputGroup
              //   value={`${entityType} ${
              //     multiSiteEntity === true
              //       ? "    ( " + siteEntityCount + " sites )"
              //       : ""
              //   }`}
              value="Enter Applicant Type"
              className={style.fullWidth}
              rightElement={arrowDown()}
            />
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              SITE APPLICANT REQUIRED FOR
            </div>
            <InputGroup
              //   value={`${entityType} ${
              //     multiSiteEntity === true
              //       ? "    ( " + siteEntityCount + " sites )"
              //       : ""
              //   }`}
              value="Select Sites"
              className={style.fullWidth}
              rightElement={arrowDown()}
            />
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DESCRIPTION</div>
            <InputGroup
              //   value={`${entityType} ${
              //     multiSiteEntity === true
              //       ? "    ( " + siteEntityCount + " sites )"
              //       : ""
              //   }`}
              value="Enter Description"
              className={style.fullWidth}
              rightElement={arrowDown()}
            />
          </div>

          {/* <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div> */}
          {/* <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.absenseCareGrid2}`}>
              <div className={style.entityLableStyle}>
                Contracted Service Provider Type*
              </div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={contractedServiceProviderType}
                  onChange={(e) =>
                    setContractedServiceProviderType(e.target.value)
                  }
                  className={style.fullWidth}
                />
              </div>
            </div>
          </div> */}
          {/* {!isEdit && (
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <div></div>
              <div
                className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                onClick={() => saveSubmitHandler("Add More")}
              >
                ADD MORE
              </div>
            </div>
          )} */}
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              onClick={() => getAddContractedServiceDialog(false)}
              className={style.outlinedButton}
            >
              SAVE & EXIT
            </button>
            <button
              onClick={() => saveSubmitHandler("Save & Exit")}
              className={`${style.buttonStyle} ${style.marginLeft20}`}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ApplicantTypeDialog;
