import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddIcon from "@mui/icons-material/Add";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { POST, PUT, TenantID } from "./../dataSaver";
import { index } from "d3";

const AddCostCenterAndLocations = ({
  getAddCostCenterDialog,
  selectedCostCenterLocation,
  isEdit,
  getCostCenterData,
}) => {
  const [costCenterId, setCostCenterId] = useState(
    selectedCostCenterLocation?.id ? selectedCostCenterLocation?.id : ""
  );
  const [costCenterName, setCostCenterName] = useState("");
  const [costCenterCode, setCostCenterCode] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [serviceLocationFields, setServiceLocationFields] = useState([""]);
  const [serviceLocations, setServiceLocations] = useState([
    { entityId: { id: TenantID }, status: "ACTIVE", location: "", code: "" },
  ]);

  //   console.log(selectedCostCenterLocation?.serviceLocations.length);
  useEffect(() => {
    if (isEdit) {
      setCostCenterId(selectedCostCenterLocation?.id);
      setCostCenterCode(selectedCostCenterLocation?.code);
      setCostCenterName(selectedCostCenterLocation?.name);
      setCreatedDate(selectedCostCenterLocation?.createdDate);
      setServiceLocations(
        selectedCostCenterLocation?.serviceLocations?.length !== 0
          ? selectedCostCenterLocation?.serviceLocations
          : [
              {
                entityId: { id: TenantID },
                status: "ACTIVE",
                location: "",
                code: "",
              },
            ]
      );
    }
  }, [selectedCostCenterLocation]);

  //   useEffect(() => {
  //     getSubReasons();
  //   }, [serviceLocations]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...serviceLocations];
    list[index][name] = value;
    setServiceLocations(list);
  };

  const handleLocationValue = (i, value, locationOrCode) => {
    let temp = serviceLocations;
    if (locationOrCode === "location") {
      temp[i].location = value;
    } else {
      temp[i].code = value;
    }
    setServiceLocations(temp);
    console.log(temp, value, serviceLocations);
  };

  //   const getSubReasons = () => {
  //     let temp = [];
  //     for (let i = 0; i < serviceLocations?.length; i++) {
  //       console.log(i);
  //       temp[i] = (
  //         <div
  //           className={`${style.costCenterLocationGrid} ${
  //             i !== 0 ? style.marginTop20 : ""
  //           }`}
  //           key={`${i}${serviceLocations[i]}`}
  //         >
  //           <InputGroup
  //             defaultValue={serviceLocations?.[i]?.location}
  //             placeholder="Service Location"
  //             className={`${style.fullWidth}`}
  //             onChange={(e) => handleLocationValue(i, e.target.value, "location")}
  //           />
  //           <InputGroup
  //             defaultValue={serviceLocations?.[i]?.code}
  //             placeholder="Location Code"
  //             className={`${style.fullWidth}`}
  //             onChange={(e) => handleLocationValue(i, e.target.value, "code")}
  //           />
  //           {i + 1 === serviceLocations?.length && (
  //             <div
  //               className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}
  //             >
  //               <AddIcon
  //                 sx={{ fontSize: 25, color: "white" }}
  //                 // onClick={() => handleAddMore()}
  //               />
  //             </div>
  //           )}
  //         </div>
  //       );
  //     }
  //     setServiceLocationFields(temp);
  //   };

  const SaveSubmitHandler = async (type) => {
    if (costCenterCode === "" || costCenterName === "") {
      ErrorToaster("Enter All Mandatory Data");
      return;
    }

    if (
      !serviceLocations?.[0]?.location &&
      serviceLocations?.[0]?.location === ""
    ) {
      ErrorToaster("Enter Location Name");
      document.getElementById("locationName").focus();
      return;
    }

    if (!serviceLocations?.[0]?.code && serviceLocations?.[0]?.code === "") {
      ErrorToaster("Enter Location Code");
      document.getElementById("locationCode").focus();
      return;
    }

    const data = {
      ...(isEdit && { id: costCenterId }),
      ...(isEdit && { createdDate: createdDate }),
      ...(isEdit && { lastModifiedDate: new Date() }),
      code: costCenterCode,
      name: costCenterName,
      entityId: {
        id: TenantID,
      },
      serviceLocations: serviceLocations,
    };

    console.log(data);

    // if (!isEdit) {
    //   await POST("entity-service/costCenter", JSON.stringify([data]))
    //     .then((response) => {
    //       SuccessToaster("Cost Center Location Added Successfully");
    //       getCostCenterData();
    //       getAddCostCenterDialog(false);
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // } else {
    //   await PUT(
    //     `entity-service/costCenter/${costCenterId}`,
    //     JSON.stringify(data)
    //   )
    //     .then((response) => {
    //       SuccessToaster("Cost Center Location Updated Successfully");
    //       getCostCenterData();
    //       getAddCostCenterDialog(false);
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // }
  };

  const handleAddMoreClick = () => {
    setServiceLocations([
      ...serviceLocations,
      { entityId: { id: TenantID }, status: "ACTIVE", location: "", code: "" },
    ]);
  };

  return (
    <Dialog
      isOpen={getAddCostCenterDialog}
      onClose={() => getAddCostCenterDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p
            className={style.extensionStyle}
          >{`New/Edit Cost Center With Its Service Location`}</p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddCostCenterDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid}`}>
            <div className={style.entityLableStyle}>Cost Center Code*</div>
            <div className={style.displayInRow}>
              <InputGroup
                value={costCenterCode}
                className={style.halfWidth}
                onChange={(obj) => setCostCenterCode(obj.target.value)}
              />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Cost Center Name*</div>
            <div className={style.displayInRow}>
              <InputGroup
                value={costCenterName}
                className={style.fullWidth}
                onChange={(obj) => setCostCenterName(obj.target.value)}
              />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>

          <div className={`${style.addHealthCareBoxStyle} ${style.padding20}`}>
            {/* {serviceLocationFields} */}
            {serviceLocations?.map((data, i) => {
              return (
                <div
                  className={`${style.costCenterLocationGrid} ${style.marginTop20}`}
                  key={`${i}${serviceLocations[i]}`}
                >
                  <InputGroup
                    name="location"
                    value={data?.location}
                    // defaultValue={serviceLocations?.[i]?.location}
                    placeholder="Service Location"
                    className={`${style.fullWidth}`}
                    // onChange={(e) =>
                    //   handleLocationValue(i, e.target.value, "location")
                    // }
                    onChange={(e) => handleInputChange(e, i)}
                    id="locationName"
                  />
                  <InputGroup
                    name="code"
                    value={data?.code}
                    // defaultValue={serviceLocations?.[i]?.code}
                    placeholder="Location Code"
                    className={`${style.fullWidth}`}
                    onChange={(e) => handleInputChange(e, i)}
                    // onChange={(e) =>
                    //   handleLocationValue(i, e.target.value, "code")
                    // }
                    id="locationCode"
                  />
                  {i + 1 === serviceLocations?.length && (
                    <div
                      className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}
                    >
                      <AddIcon
                        sx={{ fontSize: 25, color: "white" }}
                        onClick={() => handleAddMoreClick()}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddCostCenterDialog(false)}
            >
              CANCEL
            </button>
            <button
              onClick={() => SaveSubmitHandler("Save & Exit")}
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

export default AddCostCenterAndLocations;
