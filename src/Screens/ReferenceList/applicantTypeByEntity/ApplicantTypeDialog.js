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
import style from "./../index.module.scss";
import { GET, POST, PUT, TenantID } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import WritingFile from "./../../../images/writing-file.svg";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";

const ApplicantTypeDialog = ({
  open,
  handleClose,
  isEdit,
  selectedApplicant,
}) => {
  const [applicantTypes, setApplicantTypesState] = useState([]);
  const [saveData, setSaveData] = useState({});
  const [sites, setSitesState] = useState([]);
  const [enterApplicant, setEnterApplicant] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchApplicantCategory();
    fetchSpecificSites();
  }, []);

  const fetchApplicantCategory = async () => {
    try {
      const response = await GET("entity-service/applicantTypeCategory");
      const applicantTypes = response.data.map((item) => ({
        id: item.id,
        type: item.category,
      }));

      if (applicantTypes && applicantTypes.length > 0) {
        setApplicantTypesState(applicantTypes);
      }
    } catch (error) {
      console.error("Error fetching applicant types:", error);
    }
  };
  const fetchSpecificSites = async () => {
    try {
      const response = await GET("entity-service/sites");
      console.log("responseddd", response.data);
      const specificSites = response.data.map((site) => ({
        id: site.id,
        name: site.siteName.siteName,
      }));
      console.log("specificSites", specificSites);
      setSitesState(specificSites);
    } catch (error) {
      console.error("Error fetching specific sites:", error);
    }
  };

  useEffect(() => {
    if (selectedApplicant) {
      setSaveData({ ...selectedApplicant });
      setEnterApplicant(selectedApplicant.applicantType);
      setDescription(selectedApplicant.description);
    }
  }, [selectedApplicant]);

  const SaveSubmitHandler = async (isSaveAndExit) => {
    var applicantType = {
      ...saveData,
      applicantType: enterApplicant,
      description: description,
    };
    const dataToSend = [applicantType];

    if (!isEdit) {
      await POST("entity-service/applicantType", JSON.stringify(dataToSend))
        .then((response) => {
          SuccessToaster("Applicant Type Added Successfully");
          resetDialogFields();
          if (isSaveAndExit) {
            handleClose(true);
          }
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      var id = selectedApplicant.id;
      await PUT(
        `entity-service/applicantType/${id}`,
        JSON.stringify(applicantType)
      )
        .then((response) => {
          SuccessToaster("Applicant Type Updated Successfully");
          resetDialogFields();
          if (isSaveAndExit) {
            handleClose(true);
          }
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
  };

  const resetDialogFields = () => {
    setSaveData({});
    setDescription("");
    setEnterApplicant("");
  };

  return (
    <Dialog
      isOpen={open}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>{`Add New Applicant Type For`}</p>
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
                onClick={() => {
                  resetDialogFields();
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLableStyle}>CATEGORY*</div>
            <FormControl fullWidth size="small">
              <Select
                labelId="department-service-select"
                id="department-service-select"
                value={saveData.category?.id || ""} // Use id for the value
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedItem = applicantTypes.find(
                    (item) => item.id === selectedId
                  );

                  if (selectedItem) {
                    setSaveData({
                      ...saveData,
                      category: {
                        id: selectedItem.id,
                        category: selectedItem.type,
                      },
                    });
                  }
                }}
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {applicantTypes.map((data, index) => (
                  <MenuItem value={data?.id} key={index}>
                    {data?.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
            <CommonInputField
              value={enterApplicant}
              className={style.fullWidth}
              onChange={(e) => setEnterApplicant(e.target.value)}
              placeholder={"Enter Applicant Type"}
              required={true}
            />
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              SITE APPLICANT REQUIRED FOR
            </div>
            <FormControl fullWidth size="small">
              <Select
                labelId="department-service-select"
                id="department-service-select"
                value={saveData.siteTypeId?.id || ""} // Ensure this is the ID, not an object
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedSite = sites.find(
                    (site) => site.id === selectedId
                  );

                  if (selectedSite) {
                    setSaveData({
                      ...saveData,
                      siteTypeId: {
                        id: selectedId, // Save the ID here
                      },
                      siteType: selectedSite.name, // Save the name (string) here
                    });
                  }
                }}
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {sites.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DESCRIPTION</div>
            <CommonInputField
              value={description}
              className={style.fullWidth}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={"Enter Description"}
              required={false}
            />
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => SaveSubmitHandler(true)}
            >
              SAVE & EXIT
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => SaveSubmitHandler(false)}
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
