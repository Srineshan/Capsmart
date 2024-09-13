import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Icon, Intent, Dialog, Classes } from "@blueprintjs/core";
import FileImg from "./../../images/fileImg.png";
import WritingFile from "./../../images/writingFile.png";
import CompletedIcon from "./../../images/completedIcon.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import RedWarning from "./../../images/redWarning.png";
import Tooltip from "@mui/material/Tooltip";
import { DELETE, TenantID, GET } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import "react-datalist-input/dist/styles.css";
import Alert from "../../Components/AlertPopUp";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DataStatusIcon from './../../images/dqStatus.png';
import DocumentIcon from '../../images/document.png';
import EditBlue from "../../images/editBlue.png";
import OutGoing from "../../images/Outgoing.png";

import Popover from '@mui/material/Popover';
import style from "./index.module.scss";
import ApplicationDecline from "./applicationDeclineDialog";
import ApplicationHeader from '../../Components/ApplicationHeader';

const NewActiveApplication = ({
  contracts,
  getNewContract,
  contractType,
  selectedContract,
  selectedContractType,
  contractIdFromActive,
  getContractIdFromActive,
  method,
  isEditable,
  getActiveApplicationView
}) => {
  console.log('contract Type', contractType)
  const [applicationId, setApplicationId] = useState(sessionStorage.getItem('applicationId'));
  const [form, setForm] = useState();
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  const [selectContractInfo, setSelectContractInfo] = useState(contractType?.value);
  const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] =
    useState(false);
  const [newServiceProviderDialog, setNewServiceProviderDialog] =
    useState(false);
  const [addOn, setAddOn] = useState(false);
  const [viewPage1, setViewPage1] = useState(true);
  const [viewPage2, setViewPage2] = useState(false);
  const [viewPage3, setViewPage3] = useState(false);
  const [viewPage4, setViewPage4] = useState(false);
  const [viewPage5, setViewPage5] = useState(false);
  const [viewPage6, setViewPage6] = useState(false);
  const [viewPage7, setViewPage7] = useState(false);
  const [viewPage8, setViewPage8] = useState(false);
  const [viewPage9, setViewPage9] = useState(false);
  const [viewPage10, setViewPage10] = useState(false);
  const [currentPage, setCurrentPage] = useState("Contract ID & Term Limit");
  const [isMultipleContract, setIsMultipleContract] = useState(false);
  const [contractId, setContractId] = useState(contractIdFromActive);
  const [fileFields, setFileFields] = useState([]);
  const [contractName, setContractName] = useState("");
  const [fileDeletionIndex, setFileDeletionIndex] = useState();
  const [fileItems, setFileItems] = useState([]);
  const [isMultiSiteEntity, setIsMultiSiteEntity] = useState(false);
  const [helpTextData, setHelpTextData] = useState();
  const [selectedField, setSelectedField] = useState({
    fieldName: "",
    empty: false,
  });
  const [selectedFileURL, setSelectedFileURL] = useState("");
  const [priorContractId, setPriorContractId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showPrevContractDataAlert, setShowPrevContractDataAlert] = useState(false);
  const [isTabsValid, setIsTabsValid] = useState([]);
  const [contractSelected, setContractSelected] = useState(
    contracts
      ?.filter((contract) => contract?.id === contractId)
      ?.map((data) => data)[0]
  );

  useEffect(() => {
    getPreApplication();
  }, [])

  const [providerDetails, setProviderDetails] = useState();
  const [prevContractData, setPrevContractData] = useState();
  const [showApplicationDeclineDialog, setShowApplicationDeclineDialog] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setForm(basicForm)
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [anchorTextEl, setAnchorTextEl] = React.useState(null);

  const handlePopoverTextOpen = (event) => {
    setAnchorTextEl(event.currentTarget);
  };

  const handlePopoverTextClose = () => {
    setAnchorTextEl(null);
  };

  const openTextWithHover = Boolean(anchorTextEl);

  const getApplicationDeclineDialog = (value) => {
    setShowApplicationDeclineDialog(value);
  }

  console.log(contractSelected, prevContractData, 'selected contract')

  // useEffect(() => {
  //   getTabDataStatus();
  // }, []);

  useEffect(() => {
    getFileData();
    getEntityData();
    helpText();
  }, []);

  useEffect(() => {
    helpText();
  }, [currentPage]);

  useEffect(() => {
    getFileData();
    console.log("entered");
  }, [fileFields]);

  useEffect(() => {
    setContractSelected(contracts
      ?.filter((contract) => contract?.id === contractId)
      ?.map((data) => data)[0])
  }, [contractId])

  useEffect(() => {
    if (contractSelected?.contractDetail?.priorContractRefId?.id !== undefined) {
      getPrevContractData()
    }
  }, [contractSelected])

  const getPrevContractData = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${contractSelected?.contractDetail?.priorContractRefId?.id}/contractDetail`
    );
    if (contractData) {
      setPrevContractData(contractData)
    }
  }

  const getTabDataStatus = () => {
    // let temp = validateTabs(contractSelected?.id);
    // temp.then((value) => {
    //   setIsTabsValid(value);
    //   let temp = value?.value2;
    //   temp.then((response) => {
    //     setProviderDetails(response);
    //   });
    // });
  };

  const getPriorContractId = (value) => {
    console.log('prior contract id', value)
    setPriorContractId(value);
  }

  const checkFieldAndPopAlert = (value, fieldName) => {
    if (value === null || value === 0 || value === '' || value === undefined || value === '0') {
      console.log('inside');
      setSelectedField({ fieldName: fieldName, empty: false })
    } else {
      setSelectedField({ fieldName: fieldName, empty: true })
    }
  }

  const helpText = async () => {
    const { data: data } = await GET(`contract-managment-service/helpText?tabName=${encodeURIComponent(currentPage)}`);
    setHelpTextData(data?.dataElement);
  }

  const getEntityData = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setIsMultiSiteEntity(data?.multiSiteEntity);
  }

  const getShowPrevContractDataAlert = (value) => {
    console.log(value, 'test')
    setShowPrevContractDataAlert(value === false ? true : false)
  }

  const getFileData = () => {
    let temp = [];
    console.log('entered', fileFields)
    for (let i = 0; i < fileFields?.length || 0; i++) {
      temp[i] = (
        <div className={`${style.documentCard} ${style.marginTop10}`} key={i}>
          <div className={`${style.documentGrid}`}>
            <a href={fileFields?.[i]?.fileURL} target="_blank">
              <Tooltip title={'Preview'} arrow>
                <ArticleOutlinedIcon sx={{ color: '#b0a9ef', fontSize: 35 }} onClick={() => { setSelectedFileURL(fileFields?.[i]?.fileURL) }} />
              </Tooltip>
            </a>
            <div className={style.marginTop}>
              <a href={fileFields?.[i]?.fileURL} target="_blank">
                <Tooltip title={'Preview'} arrow>
                  <p className={`${style.documentText} ${style.leftAlign} ${style.removeUnderline}`} onClick={() => { setSelectedFileURL(fileFields?.[i]?.fileURL) }}><strong>{fileFields?.[i]?.documentType}</strong></p>
                </Tooltip>
              </a>

              <div className={style.spaceBetween}>
                <p className={`${style.documentText} ${style.leftAlign}`}><strong>{fileFields?.[i]?.fileName}</strong></p>
                <div onClick={() => { getDeleteExecutedContractDialog(true); setFileDeletionIndex(i); }} className={`${style.floatRight} ${style.cursorPointer}`}>
                  <DeleteOutlineIcon sx={{ color: '#F94848' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    setFileItems(temp);
  };

  const getContractId = (value) => {
    setContractId(value);
  };

  const getNewServiceProviderDialog = (value) => {
    setNewServiceProviderDialog(value);
  };

  const getDeleteExecutedContractDialog = (value) => {
    setDeleteExecutedContractDialog(value);
  };

  const getAddOn = (value) => {
    setAddOn(value);
  };

  const getShowAlert = (value, type = "cross") => {
    setShowAlert(value);
    if (!value && type === "ok") {
      getNewContract(false);
      getContractIdFromActive("");
    }
  };

  const getViewPage1 = (value) => {
    setViewPage1(value);
  };

  const getViewPage2 = (value) => {
    setViewPage2(value);
  };

  const getViewPage3 = (value) => {
    setViewPage3(value);
  };

  const getViewPage4 = (value) => {
    setViewPage4(value);
  };

  const getViewPage5 = (value) => {
    setViewPage5(value);
  };

  const getViewPage6 = (value) => {
    setViewPage6(value);
  };

  const getViewPage7 = (value) => {
    setViewPage7(value);
  };

  const getViewPage8 = (value) => {
    setViewPage8(value);
  };

  const getViewPage9 = (value) => {
    setViewPage9(value);
  };

  const getViewPage10 = (value) => {
    setViewPage10(value);
  };

  const getCurrentPage = (value) => {
    setCurrentPage(value);
  };

  const getFileFields = (value) => {
    console.log(value);
    setFileFields(value);
    if (value?.[value?.length - 1]?.id === "" && value?.length !== 0) {
      getFileData();
    }
  };

  const getContractName = (value) => {
    setContractName(value);
  };

  useEffect(() => {
    setIsMultipleContract(selectContractInfo === "MULTIPLE" ? true : false);
  }, [selectContractInfo]);

  const handleFileDeletion = async () => {
    let fileIdToDelete = fileFields
      ?.filter((data, index) => index === fileDeletionIndex)
      ?.map((data) => data?.id)[0];
    setFileFields(
      fileFields
        ?.filter((data, index) => index !== fileDeletionIndex)
        ?.map((data) => data)
    );
    if (fileIdToDelete) {
      await DELETE(
        `contract-managment-service/contracts/contractFile/${fileIdToDelete}`
      ).then((response) => {
        SuccessToaster("Document Deleted Successfully");
      });
    }
    getDeleteExecutedContractDialog(false);
    setFileDeletionIndex();
  };

  const onClose = () => {
    getActiveApplicationView(false);
  };


  return (
    <>
      <div className={style.screenBackground}></div>
      {/* <div className={`${style.welcomePadding} ${style.headerHeading} ${style.addContractBody}`}> */}
      {/* <div className={style.spaceBetween}>
          <p className={style.welcomeStyle}>New {"{Doctor}"} {"{Full Time}"} Application For {"{First Last Name}"}
            <strong className={style.darkText}></strong>
          </p>
          <div className={style.displayInRow}>
            <img
              src={WritingFile}
              alt="Writing File"
              className={`${style.smallIcons} ${style.reduceTop10}`}
            />
            <Icon
              icon="cross"
              size={25}
              intent={Intent.DANGER}
              className={style.newContractCrossStyle}
              onClick={() => onClose()}
            />
          </div>
        </div> */}
      <ApplicationHeader title={`New ${form?.basicDetails?.applicant?.applicantType !== undefined ? form?.basicDetails?.applicant?.applicantType : '{Applicant Type}'} Application For ${form?.basicDetails?.applicant?.name?.firstName !== undefined ? form?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${form?.basicDetails?.applicant?.name?.lastName !== undefined ? form?.basicDetails?.applicant?.name?.lastName : '{Last Name}'}`} />

      <div className={style.welcomeBorder}></div>
      {/* </div > */}
      <div className={`${style.marginLeftRight50}`}>
        <div className={`${style.displayInRow} ${style.spaceBetween} ${style.topHeadingTextStyle} ${style.marginTop20}`}>
        CAP MANAGER > APPLICATIONS >> {form?.basicDetails?.applicant?.name?.firstName || ''} {form?.basicDetails?.applicant?.name?.lastName || ''}</div>
        <div className={style.grid2}>
          <div className={style.grid5and1}>
            <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}`}>
                <div className={`${style.displayInRow}`} >
                  <div className={`${style.photoBorderStyle} ${style.marginLeftRight10}`}>
                    <div className={`${style.photoCardStyle}`}>
                      <span>Photo</span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.textAlignLeft}`}>
                    <div className={`${style.marginTop10}`}>
                      <span className={`${style.cardTextBoldStyle} ${style.marginTop10}`}>First Mi Last</span>
                      <span className={`${style.cardTextNormalStyle} ${style.marginTop10} ${style.marginLeft10}`}>Application ID</span>
                    </div>
                    <div className={`${style.cardTextNormalStyle} ${style.marginTop10} `}>{"{Full Time}"}{" {Doctor}"} Applying As {"{Associate}"}</div>
                    <div className={`${style.spaceBetween}`}>
                      <span className={`${style.cardTextBoldStyle} ${style.marginTop30}`}>+1 (123) 456 - 7890</span>
                      <span className={`${style.cardTextBoldStyle} ${style.marginTop30} ${style.marginLeft20}`}>name@email.com</span>
                    </div>
                  </div>
                </div>
                <div className={`${style.displayInRow} ${style.marginRight20}`}>
                  <div className={`${style.displayInCol} `}>
                    <div className={`${style.marginTop15} `}>
                      <span className={`${style.rightAlignTextStyle}`}>Proposed Start Date:</span>
                      <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>DD/MM/YYYY</span>
                    </div>
                    <div className={`${style.marginTop15}`}>
                      <span className={`${style.rightAlignTextStyle}`}>Application Created On:</span>
                      <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>DD/MM/YYYY</span>
                    </div>
                    <div className={`${style.marginTop15}`}>
                      <span className={`${style.rightAlignTextStyle}`}>Application Submitted:</span>
                      <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>DD/MM/YYYY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}  ${style.marginTop20} ${style.alignCenter} ${style.statusCardHeight}`}>
              <div className={`${style.greyBigDotStyle} `}></div>
              <div className={`${style.cardTextBoldStyle}`}>Overall Verification & Acceptance Status</div>
            </div>
          </div>

          <div>
            <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
              <div className={`${style.buttonCardStyle} `}>
                <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>SAVE IN PROGRESS</div>
              </div>
              <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                <div className={`${style.buttonTextStyle} ${style.alignCenter}`} onClick={() => { setShowApplicationDeclineDialog(true) }}>DECLINE</div>
              </div>
            </div>
            <div className={`${style.marginTop20}`}>
              <div className={`${style.bigButtonStyle} `}>
                <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>ACCEPT APPLICATION FOR REVIEW</div>
              </div>
            </div>
          </div>

          <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop10}`}>
            <div className={`${style.displayInRow}${style.marginTop20}`}>
              <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                <span className={`${style.tableHeaderHeadingTextStyle}`}>Overall Status of Application</span>
                <div className={`${style.greyDotStyle}`}></div>
              </div>
            </div>

            {/* //Table */}
            <div>
              <div className={`${style.tableHeaderStyle} ${style.marginTop10} ${style.tableHeaderGridStyle} `}>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}></div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}>POD Verification Check</div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}>
                    <img src={DataStatusIcon} alt="" style={{
                      width: "18px",
                      height: "20px"
                    }} />
                    <Popover
                      id={'mouse-over-popover'}
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      onClose={handlePopoverClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0
                        }
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Data Quality Status</div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}
                    aria-owns={openTextWithHover ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverTextOpen}
                    onMouseLeave={handlePopoverTextClose}>
                    <img src={DocumentIcon} alt=""
                      style={{
                        width: "18px",
                        height: "20px"
                      }} />
                    <Popover
                      id={'mouse-over-popover'}
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={openTextWithHover}
                      anchorEl={anchorTextEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      onClose={handlePopoverTextClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0
                        }
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Document Status</div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}>Documents</div>
                </div>
              </div>

              <div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Address Information</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>1</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Proof of Qualifications</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>2</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Malpractice Insurance Information</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>3</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Education</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>4</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Training & Work Experience</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>5</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Details Of Request For Privileges</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>2</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.tableHeaderTextStyle}`}>Requested Form Completeness Check</div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle1}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Applicant Ackowledgement</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle1}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Authorization And Consent To The Release Of Information From Treating Physician</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle1}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Authorization For The Release Of Information</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle1}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>Code Of Conduct</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.marginBottom20}></div>
            </div>
          </div>

          <div>
            <div className={style.cardLeftStyle}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <span className={`${style.tableHeaderHeadingTextStyle}`}>Notes</span>
                    <div className={`${style.marginTop5} ${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <img
                        src={EditBlue}
                        alt="EditBlue"
                        className={style.colorFileStyle}
                      />
                    </div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                  <span className={`${style.tableHeaderHeadingTextStyle}`}>RFCs & Doc Clarification</span>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10} `}>
                  <span className={`${style.tableHeaderTextStyle1}`}>Proof of Qualifications</span>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${style.displayInRow}${style.marginTop10}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10} ${style.marginBottom20}`}>
                  <span className={`${style.tableHeaderTextStyle}`}>Education</span>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${style.tableDataStyle1} ${style.tableHeaderGridStyle2}`}>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                  <div className={`${style.tableDataFontStyle1}`}>Ontario Dolor Sit Amet, Consetetur Sadipscing.</div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                  <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                    <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
              <div className={`${style.tableDataStyle} ${style.marginTop10}`}>
                <div className={`${style.tableHeaderGridStyle2}  ${style.marginTop10}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle2}`}>Toronto Medical Society Amet, Consetetur Sadipscing</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10} `}>
                    <span className={`${style.tableHeaderTextStyle1}`}>Clarification requested</span>
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                        <img
                          src={OutGoing}
                          alt="OutGoing"
                          className={style.colorFileStyle}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`${style.cardInnerText} ${style.marginLeftRight20} ${style.marginTop5} `}>
                    <p className={`${style.tableHeaderTextStyle1} ${style.padding5}`}>Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut.</p>
                  </div>
                  <div className={`${style.marginTop10} `}>
                    <div className={`${style.tableHeaderTextStyle1} ${style.marginLeft20}`}>Sent on dd/mm/yyyy, 0:00</div>
                  </div>
                  <div>
                    <div className={`${style.twoColumnGrid} ${style.marginTop20} ${style.marginLeftRight10} ${style.marginBottom20}`}>
                      <div className={`${style.buttonCardStyle1} ${style.marginLeft20} `}>
                        <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>REJECT</div>
                      </div>
                      <div className={`${style.buttonCardGreyStyle} `}>
                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>ACCEPT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.marginBottom20}></div>

            </div>
          </div>


        </div>
        <div className={style.marginTop50}></div>
        {
          showApplicationDeclineDialog && (
            <ApplicationDecline getApplicationDeclineDialog={getApplicationDeclineDialog} />
          )
        }
      </div >
    </>

  );
};

export default NewActiveApplication;
