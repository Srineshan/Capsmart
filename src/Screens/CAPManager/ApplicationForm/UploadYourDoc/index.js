import React, { useEffect, useRef, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RemoveIcon from '@mui/icons-material/Remove';
import MenuIcon from '@mui/icons-material/Menu';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DoneIcon from '@mui/icons-material/Done';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import PdfDoc from './../../../../images/pdfDoc.png';
import ImgDoc from './../../../../images/imgDoc.png';
import DeleteIcon from './../../../../images/deleteHcRow.png';
import CrossPink from './../../../../images/crossPink.png';
import Close from './../../../../images/close.png';
import { Dialog, Classes } from '@blueprintjs/core';
import { Tooltip } from '@mui/material';
import { format } from 'date-fns';
import CryptoJS from 'crypto-js';
import { useNavigate, useParams } from 'react-router-dom';
import { GET, PUT, POST, DELETE } from '../../../dataSaver';
import { ErrorToaster, ErrorToaster2, SuccessToaster } from '../../../../utils/toaster';
import { fileLoadingURL, getValueByPath, dataLoadingGIF } from '../../../../utils/formatting';
import CommonDropZone from '../../../../Components/CommonFields/CommonDropZone';
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import TableTwo from '../../../../Components/TableDesignTwo';
import ESignDialog from '../../../../Components/ESignDialog';
import ESignConfirmationDialog from '../../../../Components/ESignConfirmation';
import ESignature from '../../../../Components/ESignature';
import FileDisplayDialog from '../../../../Components/fileDisplayDialog';
import FileWithFields from '../../../../Components/FileWithFields';
import DeleteConfirmation from '../../../../Components/DeleteConfirmation';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import style from './index.module.scss';

const Step2 = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
  const { step } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const tableRef = useRef(null);

  const [formSchema, setFormSchema] = useState();
  const [formIndex, setFormIndex] = useState();
  const [isEdited, setIsEdited] = useState(false);
  const [files, setFiles] = useState([]);
  const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isShowESignDialog, setIsShowESignDialog] = useState(false);
  const [isShowESignConfirmationDialog, setIsShowESignConfirmationDialog] = useState(false);
  const [replaceFileIndex, setReplaceFileIndex] = useState(-1);
  const [showFileWithFields, setShowFileWithFields] = useState(false);
  const [fields, setFields] = useState([]);
  const [fileMetadata, setFileMetadata] = useState();
  const [fileRecord, setFileRecord] = useState();
  const [applicationDocumentId, setApplicationDocumentId] = useState('');
  const [applicantProfile, setApplicantProfile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isShowUploadValidation, setIsShowUploadValidation] = useState(false);
  const [navigateURL, setNavigateURL] = useState();
  const [navigateBackURL, setNavigateBackURL] = useState();
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [refetchRefDoc, setRefetchRefDoc] = useState(false);

  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined'
    ? JSON.parse(sessionStorage.getItem('canadaData') || '{}')
    : {};
  const dateFormat = canadaData?.dateFormat || 'yyyy-MM-dd';
  const applicantName = `${basicForm?.basicDetails?.applicant?.name?.firstName || ''} ${basicForm?.basicDetails?.applicant?.name?.lastName || ''}`.trim();

  const eSignTitle = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.title`);
  const eSignInitial = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.initial`);
  const eSignImg = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.file`);
  const eSignTypeContent = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.type.text`);
  const eSignTypeContentStyle = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.type.style`);
  const showRedBorderForESign = ((!eSignTypeContent || !eSignTypeContentStyle) && !eSignImg);

  const tempValue =
    basicForm?.forms?.[formIndex]?.data === null
      ? { setUpYourSignature: {}, table: [] }
      : basicForm?.forms?.[formIndex]?.data;

  const publicKey =
    '-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----';
  const [encryptedText, setEncryptedText] = useState('');
  const [currentDate] = useState(format(new Date(), dateFormat));

  useEffect(() => {
    if (eSignTypeContent) {
      const timeStamp = new Date().toISOString();
      const enc = CryptoJS.AES.encrypt(eSignTypeContent + timeStamp, publicKey).toString();
      setEncryptedText(enc);
    }
  }, [eSignTypeContent]);

  useEffect(() => {
    if (!basicForm) return;
    const idx = basicForm?.forms?.findIndex((data) => data?.schemaCategory === atob(step));
    setFormIndex(idx);
  }, [basicForm, step]);

  useEffect(() => {
    if (!basicForm || formIndex === undefined) return;
    getFormSchema();
    const isLastForm =
      basicForm?.forms?.filter((data) => data?.formCategory === 'Form')?.length === formIndex + 1;
    setNavigateURL(
      isLastForm
        ? `/applicationForm/${applicationId}/Form/${btoa('PODCheck')}`
        : `/applicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(
          basicForm?.forms[formIndex + 1]?.schemaCategory,
        )}`,
    );
    if (formIndex > 0) {
      setNavigateBackURL(`/applicationForm/${applicationId}/${basicForm?.forms[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms[formIndex - 1]?.schemaCategory)}`)
    } else {
      setNavigateBackURL(`/applicationForm/${applicationId}/Form/${btoa('BasicInformation')}`)
    }
  }, [basicForm, formIndex, applicationId]);

  useEffect(() => {
    getApplicantProfile();
  }, [applicationId]);

  useEffect(() => {
    if (fileMetadata) {
      setShowFileWithFields(true);
    }
  }, [fileMetadata]);

  useEffect(() => {
    if (tempValue?.table?.length > 0) {
      tableRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tempValue?.table]);

  const getFormSchema = async () => {
    const schemaId =
      basicForm?.forms?.[formIndex]?.schemaId ?? basicForm?.formSchemas?.[formIndex]?.id;
    if (!schemaId) return;
    const { data: form } = await GET(
      `application-management-service/formSchema/${schemaId}`,
    );
    setFormSchema(form?.schema);
  };

  const getApplicantProfile = async () => {
    const { data: profile } = await GET(
      `application-management-service/application/${applicationId}/profile`,
    );
    setApplicantProfile(profile);
  };

  const docLabel = (doc) => doc?.document?.shortName || doc?.document?.name || '';

  const getIsDocRequired = (shortName) => {
    let documentData = basicForm?.documentsRequired?.filter(data => data?.document?.shortName === shortName)?.[0]
    if (!documentData?.departmentSpecific) {
      return documentData?.documentType?.shortName === "Profile Picture" ? "Optional" : documentData?.required ? 'Required' : 'Recommended';
    } else {
      if (documentData?.document?.shortName === "Profile Picture") {
        return "Optional";
      } else {
        let isDepartmentMatching = documentData?.departments?.map(deptData => deptData?.department?.id)?.includes(basicForm?.basicDetailReferences?.department?.id)
        if (isDepartmentMatching) {
          if (documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialitySpecific) {
            let isSpecialtyMatching = documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.map(specialtyData => specialtyData?.specialty?.id)?.includes(basicForm?.basicDetailReferences?.specialty?.id);
            if (isSpecialtyMatching) {
              return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.filter(specialtyData => specialtyData?.specialty?.id === basicForm?.basicDetailReferences?.specialty?.id)?.[0]?.required ? 'Required' : 'Recommended';
            } else {
              return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
            }
          } else {
            return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
          }
        } else {
          return documentData?.required ? 'Required' : 'Recommended';
        }
      }
    }
  }

  const handleFileUpload = async (e, id) => {
    setIsEdited(true);
    const uploaded = await addNewDocument(e.target.files[0]);
    if (!uploaded) return;
    const target = tempValue.requiredDocuments?.find((item) => item?.document?.id === id);
    if (!target) return;
    const documentName = docLabel(target);
    const documentEntry = {
      file: uploaded,
      fileName: e.target.files[0]?.name,
      documentName,
      dateUploaded: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      valid: true,
      verified: true,
    };
    target.documentName = documentName;
    target.mandatory = target?.required;
    target.documents = target.documents ? [...target.documents, documentEntry] : [documentEntry];
  };

  const addNewDocument = async (file) => {
    if (!file) return null;
    const fileName = { fileName: file.name };
    const formData = new FormData();
    formData.append(
      'files',
      new Blob([JSON.stringify(fileName)], {
        type: 'application/json',
      }),
    );
    formData.append('documents', file);
    try {
      const { data } = await POST(
        `application-management-service/application/${applicationId}/files`,
        formData,
      );
      SuccessToaster('File Uploaded Successfully');
      return data;
    } catch (error) {
      ErrorToaster('File Upload Failed');
      console.error(error);
      return null;
    }
  };

  const handleSubmitApplicationReq = async (tableData) => {
    tempValue.table = tableData;
    const payload = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: tempValue,
    };
    await PUT(
      `application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`,
      payload,
    )
      .then((response) => {
        setRefetchRefDoc(true);
        setBasicForm(response?.data);
        SuccessToaster('Application Updated Successfully');
      })
      .catch((error) => {
        console.error(error);
        ErrorToaster('Unexpected Error Updating Application');
      });
  };

  const changeHandler = async (event) => {
    setIsLoading(true);
    setFiles(event);
    const table = tempValue.table ? [...tempValue.table] : [];
    const formData = new FormData();
    const fileNameArray = [];
    event?.forEach((file) => {
      fileNameArray.push({ fileName: file?.name });
      formData.append('documents', file);
    });
    formData.append(
      'files',
      new Blob([JSON.stringify(fileNameArray)], {
        type: 'application/json',
      }),
    );
    try {
      const { data: responseData } = await POST(
        `application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${true}`,
        formData,
      );
      responseData?.forEach((uploadedDoc, index) => {
        const documentLabel = uploadedDoc?.documentType !== null ? uploadedDoc?.documentType?.shortName : '';
        const newRow = {
          rowId: uploadedDoc?.id,
          documentType: documentLabel,
          fileURL: uploadedDoc?.fileURL,
          fileType: uploadedDoc?.fileType,
          fileUploaded: event[index]?.name,
          fileSize: `${(event[index]?.size / (1024 * 1024)).toFixed(2)} Mb`,
          requirement: documentLabel ? getIsDocRequired(documentLabel) : '',
          valid: uploadedDoc?.valid,
          verified: uploadedDoc?.verified,
        };
        table.push(newRow);
      });
      await handleSubmitApplicationReq(table);
      setIsLoading(false);
      return responseData;
    } catch (error) {
      ErrorToaster('File Upload Failed');
      console.error(error);
      setIsLoading(false);
      return null;
    }
  };

  const getDocument = async (rowId) => {
    if (!rowId) return;
    const { data: response } = await GET(
      `document-management-service/document/${rowId}`,
    );
    setFields(response?.fields);
    setFileMetadata(response?.metaData);
    setFileRecord(response?.file);
    setApplicationDocumentId(response?.id);
    setIsLoadingDocs(false);
  };

  const handleChange = async (value, index) => {
    setIsLoading(true);
    const updated = [...(tempValue?.table || [])];
    const entry = { ...updated[index] };
    entry.documentType = value;
    entry.requirement = value ? getIsDocRequired(value) : '';
    try {
      await PUT(
        `application-management-service/application/${applicationId}/form/updateData`,
        entry,
      );
      updated[index] = entry;
      await handleSubmitApplicationReq(updated);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const getDropDownValues = (type) => {
    const values = [];
    basicForm?.documentsRequired?.forEach((doc) => {
      const label = docLabel(doc);
      if (doc?.multiFile) {
        values.push(label);
      } else if (type === label) {
        values.push(label);
      } else {
        const isAlreadyUsed = (tempValue?.table || []).some(
          (row) => row.documentType === label,
        );
        if (!isAlreadyUsed) {
          values.push(label);
        }
      }
    });
    return values;
  };

  const handleReplace = (row) => {
    const index = tempValue?.table?.findIndex(
      (data) => data?.documentType === row?.documentType && data?.rowId === row?.rowId,
    );
    setReplaceFileIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const replacement = await addNewDocument(file);
    if (!replacement || replaceFileIndex === -1) return;
    const updated = [...(tempValue.table || [])];
    updated[replaceFileIndex].fileURL = replacement?.fileURL;
    updated[replaceFileIndex].fileUploaded = file.name;
    await handleSubmitApplicationReq(updated);
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    const updated = (tempValue?.table || []).filter((row) => row.rowId !== deleteData.rowId);
    try {
      await DELETE(
        `application-management-service/application/${applicationId}/deleteFiles?applicationDocumentIds=${deleteData.rowId}`,
      );
      await handleSubmitApplicationReq(updated);
      getPreApplication();
      SuccessToaster('File Deleted Successfully');
    } catch (error) {
      ErrorToaster('Unexpected Error Deleting File');
    }
  };

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

  const actions = [
    { data: 'Replace', requiredValue: 'boolean', onClick: handleReplace },
    {
      data: 'Delete',
      requiredValue: 'boolean',
      onClick: (row) => {
        setDeleteData(row);
        setShowDeleteConfirmation(true);
      },
    },
  ];

  const getIsEdited = (value) => setIsEdited(value);

  const getMissingDocs = () => {
    const requiredDocs = basicForm?.documentsRequired || [];
    const uploaded = tempValue?.table || [];
    const missing = [];
    requiredDocs.forEach((doc) => {
      const label = docLabel(doc);
      if (
        doc?.required &&
        uploaded.filter((row) => row.documentType === label && row.verified && row.valid).length === 0
      ) {
        missing.push(doc);
      }
    });
    return missing;
  };

  const handleContinue = async (action) => {
    if (
      tempValue?.table &&
      tempValue.table.some((row) => !row.documentType || row.documentType === '')
    ) {
      ErrorToaster2('Please select the missing document type for the uploaded documents');
      return;
    }
    setIsLoading(true);
    const payload = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: basicForm?.forms?.[formIndex]?.data,
      unFilledFields: getMissingDocs()?.map((doc) => docLabel(doc)),
      acknowledged: getMissingDocs()?.map((doc) => docLabel(doc))?.length !== 0 ? false : true,
    };
    try {
      const response = await PUT(
        `application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`,
        payload,
      );
      setBasicForm(response?.data);
      if (tempValue?.table) {
        await PUT(
          `application-management-service/application/${applicationId}/addUploadedDocuments`,
          tempValue?.table,
        );
      }
      if (action === 'continue') {
        if (sessionStorage.getItem('fromSummary') === 'true') {
          navigate(-1);
          sessionStorage.setItem('fromSummary', false)
        } else {
          navigate(navigateURL);
        }
      }
    } catch (error) {
      console.error(error);
      ErrorToaster('Unexpected Error Updating Application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(navigateBackURL)
  };

  const getIsSaveInProgressOpen = (value) => {
    if (value) {
      handleContinue('save');
    }
    setIsSaveInProgressOpen(value);
  };

  const getIsOpen = (value) => setIsShowESignDialog(value);
  const getIsShowFileDialog = (value) => setShowFileDisplayDialog(value);
  const getIsOpenFileWithFields = (value) => setShowFileWithFields(value);
  const getIsOpenESignConfirmation = (value) => setIsShowESignConfirmationDialog(value);

  const getShowDeleteConfirmation = (value) => setShowDeleteConfirmation(value);
  const getDeleteConfirmation = (value) => {
    if (value) handleDelete();
  };

  const getResetRefetch = () => setRefetchRefDoc(false);

  const confirmESign = async () => {
    if (!applicantProfile) return;
    const profile = { ...applicantProfile };
    profile.signature = { ...(profile.signature || {}), updated: true };
    try {
      await PUT(`application-management-service/application/${applicationId}/profile`, profile);
      SuccessToaster('Application Updated Successfully');
      getPreApplication();
    } catch (error) {
      console.error(error);
      ErrorToaster('Unexpected Error Updating Application');
    }
  };

  const getApplicantValues = (array) => {
    if (!formSchema) return [];
    const headers = formSchema?.properties?.table?.tableHeaders || {};
    const temp = [];

    Object.keys(headers).forEach((key, index) => {
      // Skip columns that we no longer display (size).
      if (key?.toLowerCase() === 'size' || key?.toLowerCase() === 'filesize') {
        return;
      }

      if (key === 'file') {
        temp.push({
          type: 'icon',
          icon: array?.map((innerData) => {
            const rowId = innerData?.rowId;
            return (
              <Tooltip title="Click to View File" arrow>
                <img
                  src={innerData?.fileType?.startsWith('image/') ? ImgDoc : PdfDoc}
                  alt=""
                  className={style.docTypeImgStyle}
                  onClick={() => {
                    setIsLoadingDocs(true);
                    setShowFileWithFields(true);
                    getDocument(rowId);
                  }}
                />
              </Tooltip>
            );
          }),
          isShowHoverText: false,
        });
      } else if (key === 'documentType') {
        temp.push({
          type: 'field',
          field: array?.map((innerData, innerIndex) => (
            <CommonSelectField
              value={innerData[key]}
              onChange={(e) => handleChange(e.target.value, innerIndex)}
              className={style.fullWidth}
              valueList={getDropDownValues(innerData[key]) || []}
              labelList={getDropDownValues(innerData[key]) || []}
              disabledList={(getDropDownValues(innerData[key]) || []).map(() => false)}
            />
          )),
        });
      } else if (key === 'valid') {
        temp.push({
          type: 'icon',
          icon: array?.map((innerData) =>
            innerData?.documentType === 'Profile Picture' ? (
              <RemoveIcon style={{ fontSize: 20 }} />
            ) : innerData[key] ? (
              <CheckCircleRoundedIcon style={{ fontSize: 20, color: '#25BF6A' }} />
            ) : (
              <WarningAmberRoundedIcon style={{ fontSize: 20, color: '#FF6562' }} />
            ),
          ),
          isShowHoverText: false,
        });
      } else if (key === 'verified') {
        temp.push({
          type: 'icon',
          icon: array?.map((innerData) =>
            innerData?.documentType === 'Profile Picture' ? (
              <RemoveIcon style={{ fontSize: 20 }} />
            ) : innerData[key] ? (
              <CheckCircleRoundedIcon style={{ fontSize: 20, color: '#25BF6A' }} />
            ) : (
              <WarningAmberRoundedIcon style={{ fontSize: 20, color: '#FF6562' }} />
            ),
          ),
          isShowHoverText: false,
        });
      } else {
        temp.push({
          type: 'text',
          value: array?.map((innerData) => {
            const rowId = innerData?.rowId;
            if (!innerData[key]) return '';
            return (
              <Tooltip title="Click to View File" arrow>
                <span
                  onClick={() => {
                    setIsLoadingDocs(true);
                    setShowFileWithFields(true);
                    getDocument(rowId);
                  }}
                >
                  {innerData[key]}
                </span>
              </Tooltip>
            );
          }),
        });
      }

      if (index === Object.keys(headers).length - 1) {
        temp.push({
          type: 'icon',
          icon: array?.map((innerData) => (
            <Tooltip title="Click to Delete" arrow>
              <img
                src={DeleteIcon}
                alt=""
                className={`${style.docTypeImgStyle} ${style.justifyCenter}`}
                onClick={() => {
                  setDeleteData(innerData);
                  setShowDeleteConfirmation(true);
                }}
              />
            </Tooltip>
          )),
          isShowHoverText: false,
        });
        temp.push({
          type: 'icon',
          icon: array?.map((innerData) => (
            <Tooltip title="Click to Edit" arrow>
              <ModeEditOutlinedIcon
                className={style.docTypeEditImgStyle}
                onClick={() => {
                  setIsLoadingDocs(true);
                  setShowFileWithFields(true);
                  getDocument(innerData?.rowId);
                }}
              />
            </Tooltip>
          )),
          isShowHoverText: false,
        });
      }
    });

    return temp;
  };

  const missingDocs = getMissingDocs();
  const tableValues = tempValue?.table || [];

  return (
    <div>
      {isLoading && (
        <div className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}>
          <div className={style.uploadContainer}>
            <div className={style.fileImportingMsg}>
              We are importing your documents and extracting the required data.
            </div>
            <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
            <div className={style.fileImportingMsg}>
              Please wait! Do not close your browser window.
            </div>
          </div>
        </div>
      )}
      {isLoadingDocs && (
        <div className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}>
          <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyleCapLogo} />
        </div>
      )}
      {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
      <div className={`${style.applicationScreenGrid} ${showInfo ? style.blurredBackground : ''}`}>
        <div>
          <ProgressCard
            step=""
            dataType={formSchema?.description}
            title={formSchema?.title}
            timeNumber={1}
            timeText="Min"
            progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
            applicationId={applicationId}
            basicForm={basicForm}
          />
          <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
            {formSchema?.properties?.uploadTheDocument && (
              <ApplicationFieldCard
                object={formSchema?.properties?.uploadTheDocument}
                gridStyle={style.twoCol}
                baseKey="uploadTheDocument"
                basicForm={basicForm}
                setBasicForm={setBasicForm}
                stepPath={`forms[${formIndex}].data`}
              />
            )}

            <div className={`${style.twoCol} ${style.marginTop10}`}>
              <Tooltip title="Click to Upload Documents" arrow>
                <CommonDropZone
                  title="Upload Your Documents"
                  description="Upload your files or drag & drop from your file cabinet"
                  changeHandler={changeHandler}
                  files={files}
                />
              </Tooltip>
              <Tooltip title="Click to Upload Photo" arrow>
                <CommonDropZone
                  title="Upload A Photo"
                  description="Take a picture or upload from your gallery"
                  changeHandler={changeHandler}
                  files={files}
                  accept="image/*"
                />
              </Tooltip>
            </div>

            <div className={`${style.addMoreBorder} ${style.marginTop}`}>
              <div className={style.padding20}>
                <div className={style.spaceBetween}>
                  <div className={style.collapsableCardText}>
                    Required and Recommended documents & forms for this
                    Application
                  </div>
                </div>
                <div
                  className={`${style.tableHeader} ${style.tableGrid} ${style.marginTop}`}
                >
                  <div
                    className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}
                  >
                    Document Type
                  </div>
                  <div
                    className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}
                  >
                    Requirements
                  </div>
                  <div
                    className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}
                  ></div>
                </div>
                {basicForm?.documentsRequired?.map((data, index) => (
                  <div>
                    <div
                      className={`${style.requiredDocumentCard} ${style.tableGrid
                        } ${basicForm?.forms?.[formIndex]?.data !== null &&
                          (tempValue?.table?.filter(
                            (tableData) =>
                              tableData?.documentType ===
                              data?.document?.shortName
                          )?.length === 0 || !(tempValue?.table?.filter((tableData) => tableData?.documentType === data?.document?.shortName)?.[0]?.verified && tempValue?.table?.filter((tableData) => tableData?.documentType === data?.document?.shortName)?.[0]?.valid)) &&
                          data?.required
                          ? style.redBorder
                          : ""
                        } ${index % 2 === 0
                          ? style.requiredDocumentCardAlternativeColor
                          : ""
                        }  ${style.marginTop5}`}
                    >
                      <div
                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                      >
                        <div
                          className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                        >
                          {data?.document?.shortName}
                        </div>
                        <InfoOutlinedIcon
                          sx={{ fontSize: 14, marginLeft: "10px" }}
                          className={style.info}
                        />
                      </div>
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.required ? "Required" : "Recommended"}
                      </div>
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.instruction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div ref={tableRef} className={style.tableContainer}>
              {tableValues.length > 0 && (
                <TableTwo
                  tableHeaderValues={['', 'File Uploaded', 'Document Type', '', 'Verified', 'Valid', '', '']}
                  tableDataValues={getApplicantValues(tableValues)}
                  tableData={tableValues}
                  gridStyle={style.gridStyle}
                  heading="You have not yet uploaded any documents."
                  onClickFunction={() => { }}
                  actions={actions}
                />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {(basicForm?.forms?.[formIndex]?.data !== null && !showRedBorderForESign) ||
              applicantProfile?.signature?.updated ? (
              <>
                {/* <div className={`${style.setupCompleteCard} ${style.setupCompleteGrid} ${style.marginTop}`}>
                  <div></div>
                  <div className={`${style.displayInRow} ${style.justifyCenter}`}>
                    <DoneIcon sx={{ color: '#06617A', fontSize: 25 }} />
                    <div className={`${style.setupCompletedText} ${style.marginLeft10}`}>
                      eSignature Available on File
                    </div>
                  </div>
                  <div className={`${style.editOrUpdateESign} ${style.cursorPointer}`} onClick={() => setIsShowESignDialog(true)}>
                    Edit / Update
                  </div>
                </div> */}
                <div className={`${style.eSignatureOnFileCard} ${style.marginTop10}`}>
                  <div className={style.eSignatureOnFileTitle}>Establish your eSignature</div>
                  <div className={style.eSignGrid}>
                    <ESignature userName={applicantName} encData={encryptedText} showData showDatais />
                    <div className={style.verticalAlignCenter}>
                      <div className={style.displayInRow}>
                        <div className={style.dateTitle}>Initial:</div>
                        <div className={`${style.date} ${style.marginLeft}`}>{eSignInitial}</div>
                      </div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                      <div className={style.dateTitle}>{eSignTitle}</div>
                    </div>
                  </div>
                  <div className={style.eSignatureOnFileButton}>
                    <div className={`${style.continue} ${style.eSignatureOnFileButtonPadding}`} onClick={() => setIsShowESignDialog(true)}>
                      CLICK TO UPDATE
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={style.marginTop} onClick={() => setIsShowESignDialog(true)}>
                <div className={`${style.uploadBorderStyle} ${showRedBorderForESign ? style.redBorder : ''}`}>
                  <p className={style.uploadTextStyle}>Add Your eSignature</p>
                  <p className={style.uploadDescriptionText}>
                    Our paperless automated application submission uses electronic signatures with digital fingerprinting.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className={style.threeColForButton}>
            <div></div>
            <Tooltip title="Click to Save your Progress and Continue later" arrow>
              <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>
                SAVE IN PROGRESS
              </div>
            </Tooltip>
            <Tooltip title="Click to Go Back to the Previous Step" arrow>
              <div className={`${style.continue} ${style.marginTop}`} onClick={handleBackClick}>
                BACK
              </div>
            </Tooltip>
            <Tooltip title="Click to Proceed to the Next Step" arrow>
              <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleContinue('continue')}>
                CONTINUE
              </div>
            </Tooltip>
          </div>
        </div>

        <div>
          {!showInfo && (
            <div>
              <div
                className={`${style.toggleButton} ${isSaveInProgressOpen ||
                  isShowESignDialog ||
                  isShowUploadValidation ||
                  showFileDisplayDialog ||
                  isShowESignConfirmationDialog
                  ? style.hidden
                  : ''
                  }`}
                onClick={() => setShowInfo(true)}
              >
                <MenuIcon className={style.toggleIcon} />
              </div>
              <div
                className={`${style.headerData} ${isSaveInProgressOpen ||
                  isShowESignDialog ||
                  isShowUploadValidation ||
                  showFileDisplayDialog ||
                  isShowESignConfirmationDialog
                  ? style.hidden
                  : ''
                  }`}
              >
                <span style={{ marginLeft: '20px' }}>Confirm Your Required Documents</span>
              </div>
            </div>
          )}
          <div>
            <div className={`${style.infoContainer} ${showInfo ? style.show : ''}`}>
              <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
              <ApplicationUserCard
                user={`${basicForm?.basicDetails?.applicant?.name?.firstName || ''} ${basicForm?.basicDetails?.applicant?.name?.lastName || ''
                  }`}
                applyingFor={basicForm?.basicDetails?.applicant?.applicantType || '{Applicant Type}'}
              />
              <div className={style.marginTop}>
                <ApplicationAssistanceCard
                  user="Neena Greenly"
                  designation="{Designation}"
                  contactNumber="{Contact Number}"
                  email="{Email}"
                />
              </div>
              <div className={style.marginTop}>
                <ApplicationReferenceDocuments refetchRefDoc={refetchRefDoc} getResetRefetch={getResetRefetch} />
              </div>
            </div>
          </div>
          <div
            className={`${style.stickyContainer} ${isSaveInProgressOpen ||
              isShowESignDialog ||
              isShowUploadValidation ||
              showFileDisplayDialog ||
              isShowESignConfirmationDialog
              ? style.hiddenStickyContainer
              : ''
              }`}
          >
            <Tooltip title="Click to Save your Progress and Continue later" arrow>
              <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>
                SAVE IN PROGRESS
              </div>
            </Tooltip>
            <div className={style.twoColForButton}>
              <Tooltip title="Click to Go Back to the Previous Step" arrow>
                <div className={`${style.continue} ${style.marginTop10}`} onClick={handleBackClick}>
                  BACK
                </div>
              </Tooltip>
              <Tooltip title="Click to Proceed to the Next Step" arrow>
                <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue('continue')}>
                  CONTINUE
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {isShowESignDialog && (
        <ESignDialog
          getIsOpen={getIsOpen}
          tempValue={tempValue}
          baseKey="setUpYourSignature"
          applicationId={applicationId}
          basicForm={basicForm}
          setBasicForm={setBasicForm}
          getPreApplication={getPreApplication}
        >
          {formSchema &&
            'setUpYourSignature' in formSchema?.properties && (
              <ApplicationFieldCard
                object={formSchema?.properties?.setUpYourSignature}
                gridStyle={style.twoCol}
                baseKey="setUpYourSignature"
                basicForm={basicForm}
                setBasicForm={setBasicForm}
                stepPath={`forms[${formIndex}].data`}
                setIsEdited={getIsEdited}
              />
            )}
        </ESignDialog>
      )}
      {isShowESignConfirmationDialog && (
        <ESignConfirmationDialog
          getIsOpen={getIsOpenESignConfirmation}
          tempValue={tempValue}
          baseKey="setUpYourSignature"
          applicationId={applicationId}
          basicForm={basicForm}
          setBasicForm={setBasicForm}
          updateFunc={() => setIsShowESignDialog(true)}
          confirmFunc={confirmESign}
        />
      )}
      {showFileDisplayDialog && (
        <FileDisplayDialog getIsOpen={getIsShowFileDialog} file={selectedFile} />
      )}
      {showFileWithFields && (
        <FileWithFields
          getIsOpen={getIsOpenFileWithFields}
          fields={fields}
          metadata={fileMetadata}
          file={fileRecord}
          schemaId={basicForm?.forms?.[formIndex]?.schemaId}
          applicationDocumentId={applicationDocumentId}
          getPreApplication={getPreApplication}
        />
      )}
      <Dialog
        isOpen={isShowUploadValidation}
        onClose={() => setIsShowUploadValidation(false)}
        className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div>
          <div className={Classes.DIALOG_BODY}>
            <div className={style.spaceBetween}>
              <div className={style.heading}>You are missing some required documents</div>
              <div className={style.displayInRow}>
                <img
                  src={CrossPink}
                  alt="cross"
                  className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                  onClick={() => setIsShowUploadValidation(false)}
                />
              </div>
            </div>
            <p className={`${style.description} ${style.marginTop}`}>
              You are missing documents that are required to proceed with this application. To ensure a complete &amp;
              successful submission provide all of the required documents.
            </p>
            <div className={`${style.tableHeader} ${style.tableGridValidation} ${style.marginTop}`}>
              <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
              <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Requirements</div>
            </div>
            {missingDocs?.map((data, index) => (
              <div
                key={docLabel(data) || index}
                className={`${style.requiredDocumentCard} ${style.tableGridValidation} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''
                  } ${style.marginTop5}`}
              >
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                  <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>
                    {docLabel(data)}
                  </div>
                  <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                </div>
                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>
                  {data?.required ? 'Required' : 'Recommended'}
                </div>
              </div>
            ))}
            <div className={`${style.spaceBetween} ${style.marginTop}`}>
              <Tooltip title="Click to Skip This Step and Continue Later" arrow>
                <div
                  className={style.saveInProgressValidation}
                  onClick={() => {
                    setIsShowUploadValidation(false);
                    handleContinue('skipped');
                  }}
                >
                  SKIP FOR NOW
                </div>
              </Tooltip>
              <Tooltip title="Click to Continue Uploading" arrow>
                <div
                  className={`${style.continueValidation} ${style.marginLeft}`}
                  onClick={() => setIsShowUploadValidation(false)}
                >
                  CONTINUE UPLOADING
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </Dialog>
      {isSaveInProgressOpen && (
        <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this uploaded document?"
        />
      )}
    </div>
  );
};

export default Step2;

