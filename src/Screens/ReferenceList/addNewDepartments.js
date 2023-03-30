import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  InputGroup,
  RadioGroup,
  Radio,
  Checkbox,
  Tag,
} from "@blueprintjs/core";
import style from "./index.module.scss";
import ArrowDown from "./../../images/arrowDown.png";
import { POST, PUT, GET, TenantID } from "./../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DatalistInput from "react-datalist-input";

const AddNewDepartments = ({
  getAddEntityDialog,
  selectedEntity,
  isEdit,
  getEntityData,
  selectedDepart,
  departmentList,
  selectedTitle,
  isService,
  callingFrom,
  siteTypeId,
}) => {
  const [departId, setDepartId] = useState("");
  const [departName, setDepartName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [addService, setAddService] = useState(true);
  const [serviceArea, setServiceArea] = useState("");
  const [serviceLocation, setServiceLocation] = useState([]);
  // const [selectedServiceAreas, setSelectedServiceAreas] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLocationDeleteId, setSelectedLocationDeleteId] = useState("");

  const [serviceAreaList, setServiceAreaList] = useState([
    { name: "", serviceLocations: [] },
  ]);

  useEffect(() => {
    if (
      selectedLocationDeleteId !== "" &&
      selectedLocationDeleteId !== undefined
    ) {
      getServiceLocationDelete();
    }
  }, [selectedLocationDeleteId]);

  const getServiceLocation = async () => {
    const { data: serviceLocation } = await GET(
      "entity-service/servicelocation"
    );
    console.log(serviceLocation);
    setServiceLocation(serviceLocation);
  };

  const getServiceLocationDelete = async () => {
    const { data: serviceLocationDelete } = await PUT(
      `entity-service/servicelocation/${selectedLocationDeleteId}/unMapDepartment`
    );
    // console.log(serviceLocationDelete);
  };

  useEffect(() => {
    getServiceLocation();
  }, []);

  const handleSelectLocation = (value) => {
    if (value !== "") {
      const tempSelectedLocation = serviceLocation
        .filter((data) => data?.location === value)
        .map((data) => data)[0];

      if (
        !selectedLocations
          .map((data) => data?.id)
          .includes(tempSelectedLocation?.id)
      ) {
        setSelectedLocations([...selectedLocations, tempSelectedLocation]);
      }
    }
  };

  const locationTagsAdd = selectedLocations ? (
    selectedLocations
      .filter((data) =>
        serviceLocation.map((location) => location).includes(data)
      )
      .map((tag, index) => {
        const onRemoveLocation = () => {
          setSelectedLocationDeleteId(tag?.id);
          setSelectedLocations(
            selectedLocations.filter((t) => t?.location !== tag?.location)
          );
        };
        return (
          <Tag
            key={index}
            onRemove={onRemoveLocation}
            large={true}
            className={style.tagStyle}
          >
            {tag?.location}
          </Tag>
        );
      })
  ) : (
    <></>
  );

  const locationTagsEdit = selectedLocations ? (
    selectedLocations
      .filter((data) =>
        serviceLocation.map((location) => location?.id === data?.id)
      )
      .map((tag, index) => {
        const onRemoveLocation = () => {
          setSelectedLocationDeleteId(tag?.id);
          setSelectedLocations(
            selectedLocations.filter((t) => t?.location !== tag?.location)
          );
        };
        return (
          <Tag
            key={index}
            onRemove={onRemoveLocation}
            large={true}
            className={style.tagStyle}
          >
            {tag?.location}
          </Tag>
        );
      })
  ) : (
    <></>
  );

  const onRemoveLocation = (
    serviceIndex,
    locationIndex,
    location,
    locationId
  ) => {
    // console.log("remove", location, locationIndex, serviceIndex, locationId);
    setSelectedLocationDeleteId(locationId);
    setSelectedLocations(
      selectedLocations
        ?.filter((data) => data?.location !== location)
        ?.map((data) => data)
    );
    let tempLocations =
      serviceAreaList
        ?.filter((data, index) => serviceIndex === index)
        ?.map((data) => data?.serviceLocations)[0] || [];
    let filteredLocations = tempLocations
      ?.filter((data, index) => locationIndex !== index)
      ?.map((data) => data);
    let temp = serviceAreaList;
    temp[serviceIndex].serviceLocations = filteredLocations;
    setServiceAreaList(temp);
  };

  const locationTagsAdd2 = (index) => {
    let temp = [];
    serviceAreaList
      ?.filter((data, indexVal) => indexVal === index)
      ?.map((data) => {
        data?.serviceLocations?.map((location, locationIndex) => {
          temp.push(
            <Tag
              key={locationIndex}
              onRemove={() =>
                onRemoveLocation(
                  index,
                  locationIndex,
                  location?.location,
                  location?.id
                )
              }
              large={true}
              className={style.tagStyle}
            >
              {location?.location}
            </Tag>
          );
        });
      });
    return temp;
  };

  const locationTagsEdit2 = (index) => {
    let temp = [];
    serviceAreaList
      ?.filter((data, indexVal) => {
        // console.log(data, indexVal, index);
        return indexVal === index;
      })
      ?.map((data) => {
        data?.serviceLocations?.map((location, locationIndex) => {
          temp.push(
            <Tag
              key={locationIndex}
              onRemove={() =>
                onRemoveLocation(
                  index,
                  locationIndex,
                  location?.location,
                  location?.id
                )
              }
              large={true}
              className={style.tagStyle}
            >
              {location?.location}
            </Tag>
          );
        });
      });
    return temp;
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    // console.log(name, value, index, serviceAreaList, serviceLocation);
    const list = [...serviceAreaList];
    if (name === "location") {
      // console.log(
      //   " inside location",
      //   value,
      //   index,
      //   selectedLocations,
      //   serviceLocation
      // );
      if (value !== "") {
        const tempSelectedLocation = serviceLocation
          .filter((data) => data?.location === value)
          .map((data) => data)[0];
        if (
          !selectedLocations
            .map((data) => data?.id)
            .includes(tempSelectedLocation?.id)
        ) {
          let tempLocations = selectedLocations;
          tempLocations.push(tempSelectedLocation);
          setSelectedLocations(tempLocations);
          let temp =
            serviceAreaList
              ?.filter((data, indexVal) => index === indexVal)
              ?.map((data) => data?.serviceLocations)[0] || [];
          // console.log("temp", temp);
          temp.push(tempSelectedLocation);
          // console.log("after pushing", temp);
          list[index]["serviceLocations"] = temp;
        }
      }
      // console.log(selectedLocations);
    } else {
      list[index][name] = value;
    }
    setServiceAreaList(list);
  };

  const handleAddMoreClick = () => {
    setServiceAreaList([
      ...serviceAreaList,
      { name: "", serviceLocations: [] },
    ]);
  };

  const saveSubmitHandler = async (type) => {
    if (!departName && departName === "") {
      document.getElementById("departmentEl").focus();
      return false;
    }

    const data = {
      ...(isEdit && { id: departId }),
      ...(isEdit && { createdDate: createdDate }),
      departmentName: {
        name: departName,
      },
      departmentGroupBy: {
        name: departName,
      },
      serviceAreas: addService ? serviceAreaList : [],
      serviceLocations: !addService ? selectedLocations : [],
      ...(callingFrom === "Super Admin" && {
        siteTypeId: {
          id: selectedEntity?.id,
        },
      }),
      ...(callingFrom === "Customer Admin" && {
        customized: true,
        siteTypeId: {
          id: siteTypeId,
        },
      }),
    };

    // let ApiData = callingFrom === "Customer Admin" && !isEdit ? data : [data];
    let ApiData = callingFrom === "Customer Admin" ? [data] : data;

    // console.log(ApiData);
    let ApiUrl =
      callingFrom === "Super Admin"
        ? "entity-service/departmentMaster"
        : `entity-service/department`;

    await POST(ApiUrl, JSON.stringify(ApiData))
      .then((response) => {
        SuccessToaster("Department Added Successfully");
        getEntityData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });

    if (type !== "Add More") {
      getAddEntityDialog(false);
    } else {
      setDepartName("");
      if (callingFrom === "Customer Admin") {
        setServiceArea("");
      }
      document.getElementById("departmentEl").focus();
    }
  };

  useEffect(() => {
    if (isEdit) {
      setDepartId(selectedDepart?.id);
      setDepartName(selectedDepart?.departmentName?.name);
      setCreatedDate(selectedDepart?.createdDate);

      if (selectedDepart?.serviceAreas.length > 0) {
        setServiceAreaList(selectedDepart?.serviceAreas);
        setAddService(true);
      } else {
        setAddService(false);
      }

      if (selectedDepart?.serviceLocations.length > 0) {
        setSelectedLocations(selectedDepart?.serviceLocations);
        setAddService(false);
      } else {
        setAddService(true);
      }

      if (isService) {
        setServiceArea(selectedDepart?.serviceAreas[0]?.name);
      }
    }
  }, [selectedDepart]);

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
            {` New Departments / Services Area For ${selectedTitle}`}
          </p>
          <div className={`${style.displayInRow}`}>
            <div className={`${style.displayInRow} ${style.marginRight20}`}>
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
                }
                alt="refresh"
                className={`${style.headerFlag} ${style.marginRight15}`}
              />
              <span
                className={`${style.headerCountryName} ${style.marginLeft10}`}
              >
                USA
              </span>
              <img
                src={ArrowDown}
                className={`${style.colorFileStyle2} ${style.marginLeft10}  ${style.marginTop10}`}
                alt=""
              />
            </div>
            <Icon
              icon="cross"
              size={20}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={() => getAddEntityDialog(false)}
            />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid}`}>
            <div className={style.entityLableStyle}>Department Name*</div>
            <div className={style.twoCol}>
              <InputGroup
                placeholder="Enter Department Name"
                id="departmentEl"
                value={departName}
                className={style.fullWidth}
                onChange={(e) => setDepartName(e.target.value)}
              />
              <Checkbox
                value="ADD SERVICES"
                checked={addService}
                onChange={(e) => setAddService(e.target.checked)}
                // onChange={(e) => handleAddService(e.target.checked)}
                className={` ${style.marginLeft20} ${style.marginTop}`}
                label="ADD SERVICES"
              />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          {addService && callingFrom === "Super Admin" && (
            <div className={`${style.addHealthCareBoxStyle}`}>
              <div className={`${style.editHealthCareGrid2}`}>
                <div className={style.entityLableStyle}>Service Area*</div>
                <div className={style.displayInRow}>
                  <InputGroup
                    value={serviceArea}
                    className={style.fullWidth}
                    onChange={(e) => setServiceArea(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {addService &&
            callingFrom === "Customer Admin" &&
            serviceAreaList.map((list, i) => {
              return (
                <>
                  <div className={`${style.addHealthCareBoxStyle}`}>
                    <div
                      className={`${style.editHealthCareGrid2} `}
                      key={`${i}${serviceAreaList[i]}`}
                    >
                      <div className={`${style.entityLableStyle}`}>
                        Service Line /
                        <div className={style.entityLableStyle}>
                          Speciality* {i + 1}
                        </div>
                      </div>

                      <div
                        className={`${style.displayInRow} ${style.marginTop10}`}
                      >
                        <InputGroup
                          name="name"
                          value={list?.name}
                          className={style.fullWidth}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div
                      className={`${style.editHealthCareGrid2} ${style.marginTop20}`}
                    >
                      <div className={`${style.entityLableStyle}`}>
                        Assign Service
                        <div className={style.entityLableStyle}>
                          Location {i + 1}
                        </div>
                      </div>
                      <div
                        className={`${style.reduce10Left} ${style.marginRight}`}
                      >
                        <select
                          name="location"
                          id="location"
                          value={list?.serviceLocations}
                          onChange={(e) => handleInputChange(e, i)}
                          className={`${style.fullWidth} ${style.marginLeft10} `}
                        >
                          <option value="0">Select Service Location</option>
                          {serviceLocation
                            ?.filter(
                              (data) =>
                                !selectedLocations
                                  ?.map((location) => location?.location)
                                  .includes(data?.location)
                            )
                            ?.map((data, index) => {
                              return (
                                <option
                                  key={`${data}-${index}`}
                                  value={data?.location}
                                >
                                  {data?.location}
                                </option>
                              );
                            })}
                        </select>
                        <div
                          className={`${style.marginTop20} ${style.marginLeft10}`}
                        >
                          {!isEdit ? locationTagsAdd2(i) : locationTagsEdit2(i)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* //Addmore */}
                  {serviceAreaList.length - 1 === i && (
                    <div
                      className={`${style.spaceBetween} ${style.marginTop20}`}
                    >
                      <div></div>
                      {addService && callingFrom === "Customer Admin" && (
                        <>
                          <div
                            className={`${style.buttonStyle3} ${style.addMoreCardStyle}`}
                            onClick={() => handleAddMoreClick()}
                          >
                            ADD MORE
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              );
            })}

          {/* <div className={`${style.addHealthCareBoxStyle}`}>
            <div
              className={`${style.editHealthCareGrid2} ${style.marginTop20}`}
            >
              <div className={`${style.entityLableStyle}`}>
                Service Line /
                <div className={style.entityLableStyle}>Speciality*</div>
              </div>

              <div className={`${style.displayInRow} ${style.marginTop10}`}>
                <InputGroup
                  value={serviceArea}
                  className={style.fullWidth}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
              </div>
            </div>
          </div> */}

          {/* {addService && callingFrom === "Customer Admin" && (
            <div className={`${style.addHealthCareBoxStyle}`}>
              {serviceAreaFields}
            </div>
          )} */}

          {!addService && (
            <div className={`${style.addHealthCareBoxStyle}`}>
              <div
                className={`${style.editHealthCareGrid2} ${style.marginTop20}`}
              >
                <div className={`${style.entityLableStyle}`}>
                  Assign Service
                  <div className={style.entityLableStyle}>Location</div>
                </div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                  <select
                    name="class"
                    id="Class"
                    onChange={(e) => handleSelectLocation(e.target.value)}
                    className={`${style.fullWidth} ${style.marginLeft10} `}
                  >
                    <option value="0">Select Service Location</option>
                    {serviceLocation?.map((data, index) => {
                      return (
                        <option key={`${data}-${index}`} value={data?.location}>
                          {data?.location}
                        </option>
                      );
                    })}
                  </select>
                  <div className={`${style.marginTop20} ${style.marginLeft10}`}>
                    {!isEdit ? locationTagsAdd : locationTagsEdit}
                  </div>
                </div>
              </div>
            </div>
          )}
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
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => saveSubmitHandler("Save & Exit")}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddNewDepartments;
