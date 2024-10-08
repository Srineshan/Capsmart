import React, { useEffect, useRef, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { GET, PUT, POST } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import PdfDoc from './../../../images/pdfDoc.png';
import WordDoc from './../../../images/wordDoc.png';
import ImgDoc from './../../../images/imgDoc.png';
import DeleteIcon from './../../../images/deleteHcRow.png';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import style from './index.module.scss';
import DoneIcon from '@mui/icons-material/Done';
import { format } from 'date-fns';
import CommonDropZone from '../../../Components/CommonFields/CommonDropZone';
import ESignDialog from '../../../Components/ESignDialog';
import TableTwo from '../../../Components/TableDesignTwo';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import { getValueByPath } from '../../../utils/formatting';
import FileDisplayDialog from '../../../Components/fileDisplayDialog';

const Step2 = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const fileInputRef = useRef(null);
    const [isEdited, setIsEdited] = useState(false);
    const [openCategoryIndex, setOpenCategoryIndex] = useState(-1);
    const [isShowESignDialog, setIsShowESignDialog] = useState(false);
    const [files, setFiles] = useState([]);
    const [isCollapsableCard, setIsCollapsableCard] = useState(true);
    const [replaceFileIndex, setReplaceFileIndex] = useState(-1);
    const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
    const [selectedFile, setselectedFile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let eSignTitle = getValueByPath(basicForm, 'forms[0].data.setUpYourSignature.title');
    let eSignInitial = getValueByPath(basicForm, 'forms[0].data.setUpYourSignature.initial')
    let showRedBorderForESign = ((eSignTitle === '' || eSignTitle === undefined) || (eSignInitial === '' || eSignInitial === undefined))
    let tempValue = basicForm?.forms?.[0]?.data === null ? { setUpYourSignature: {}, table: [] } : basicForm?.forms?.[0]?.data;
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[0]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const getIsOpen = (value) => {
        setIsShowESignDialog(value);
    }

    const getIsShowFileDialog = (value) => {
        setShowFileDisplayDialog(value);
    }

    const handleFileUpload = async (e, id) => {
        setIsEdited(true);
        let file = await addNewDocument(e.target.files[0]);
        if (tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'] === undefined) {
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documentName'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['mandatory'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.required
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'] = [{ file: file, fileName: e.target.files[0]?.name, documentName: tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name, dateUploaded: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"), valid: true, verified: true }]
        } else {
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documentName'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['mandatory'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.required
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'].push({ file: file, fileName: e.target.files[0]?.name, documentName: tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name, dateUploaded: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"), valid: true, verified: true })
        }
        console.log(tempValue, e.target.files[0])
    }

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": file?.name
        };
        const formData = new FormData();

        if (file !== null) {
            formData.append('files', new Blob([JSON.stringify(fileName)], {
                type: "application/json"
            }));
            formData.append('documents', file);
            try {
                const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
                SuccessToaster('File Uploaded Successfully');
                console.log(response?.data);
                return response?.data;
            } catch (error) {
                ErrorToaster('File Upload Failed');
                console.error(error);
                return null;
            }
        }
    }

    const handleSubmitApplicationReq = async (tableData) => {
        tempValue.table = tableData;
        console.log(tableData)
        let temp = {
            schemaId: basicForm?.forms?.[0]?.schemaId,
            data: tempValue
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[0]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }
    console.log(formSchema, basicForm, tempValue)

    const changeHandler = async (event) => {
        setIsLoading(true);
        console.log(event)
        setFiles(event);
        console.log(event, 'Test');
        let table = tempValue.table !== undefined ? tempValue.table : []

        const formData = new FormData();
        let fileNameArray = [];
        event?.forEach(file => {
            fileNameArray.push({ "fileName": file?.name });
            formData.append('documents', file); // Append each file individually
        });

        formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
            type: "application/json"
        }));
        console.log(fileNameArray)
        try {
            const response = await POST(`application-management-service/application/${applicationId}/files/bulk`, formData);
            SuccessToaster('File Uploaded Successfully');
            console.log(response?.data);
            event.map((data, index) => {
                table.push({ documentType: response?.data[index]?.classification !== null ? response?.data[index]?.classification : '', fileSize: `${(data?.size / (1024 * 1024)).toFixed(2)} Mb`, fileURL: response?.data[index]?.fileURL, fileType: response?.data[index]?.fileType, fileUploaded: data?.name, requirement: response?.data[index]?.classification !== null ? basicForm?.documentsRequired?.filter(data => data?.document?.name === response?.data[index]?.classification)?.[0]?.required ? 'Required' : 'Recommended' : '', valid: response?.data[index]?.valid, verified: response?.data[index]?.verified })
            })
            handleSubmitApplicationReq(table)
            setIsLoading(false);
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error(error);
            setIsLoading(false);
            return null;
        }
    };

    const handleChange = async (value, index) => {
        console.log(tempValue?.table, value, index, '142')
        let temp = tempValue?.table;
        let tempDocumentData = {
            file: {
                fileURL: temp[index]?.fileURL,
                fileName: temp[index]?.fileUploaded
            },
            verified: temp[index]?.verified !== "" ? temp[index]?.verified : false,
            valid: temp[index]?.valid !== "" ? temp[index]?.valid : false,
            documentType: value,
            required: temp[index]?.requirement === 'Mandatory' ? 'Required' : 'ToBeDecided',
        };

        // let documentData = {
        //     uploadedDocument: tempDocumentData
        // }
        // await PUT(`application-management-service/application/${applicationId}/addUploadedDocuments`, documentData)
        //     .then(response => {
        //         console.log(response)
        //         temp[index].verified = response?.data?.verified;
        //         temp[index].valid = response?.data?.valid;
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });
        temp[index].documentType = value;
        if (value !== null || value !== "") {
            temp[index].requirement = basicForm?.documentsRequired?.filter(data => data?.document?.name === value)?.[0]?.required ? 'Required' : 'Recommended';
        }
        console.log(temp)
        handleSubmitApplicationReq(temp)
    }

    const getDropDownValues = (type) => {
        let value = [];
        basicForm?.documentsRequired?.map(data => {
            if (data?.multiFile) {
                console.log(data?.document?.name)
                value.push(data?.document?.name)
            } else if (type === data?.document?.name) {
                value.push(data?.document?.name)
            } else {
                if (tempValue?.table?.filter(singleFileData => singleFileData?.documentType === data?.document?.name)?.length === 0) {
                    value.push(data?.document?.name)
                    console.log(data?.document?.name, tempValue?.table, data)
                }
            }
        })
        console.log(tempValue?.table?.filter(singleFileData => singleFileData?.documentType === 'Current Curriculam Vitae'))
        return value;
    }


    const getApplicantValues = (array) => {
        let temp = [];
        console.log(array, 'array')
        Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.map((data, index) => {
            if (data === "file") {
                temp.push({
                    "type": "icon", "icon": array?.map(innerData => innerData?.fileType === 'application/pdf' ?
                        <img src={PdfDoc} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} />
                        : innerData?.fileType?.startsWith("image/") ?
                            <img src={ImgDoc} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} /> : <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.fileURL, '_blank'); }} />), 'isShowHoverText': false
                });
            } else {
                if (data === "documentType") {
                    temp.push({
                        "type": "field", "field": array?.map((innerData, innerIndex) => <CommonSelectField
                            value={innerData[data]}
                            onChange={(e) => handleChange(e.target.value, innerIndex)}
                            className={style.fullWidth}
                            // firstOptionLabel={fieldData.label}
                            // firstOptionValue={fieldData.label}
                            valueList={getDropDownValues(innerData[data]) || []}
                            labelList={getDropDownValues(innerData[data]) || []}
                            disabledList={getDropDownValues(innerData[data])?.map(data => false)}
                        />)
                    });
                } else if (data === "valid") {
                    temp.push({ "type": "icon", "icon": array?.map(innerData => innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562` }} />), 'isShowHoverText': false });
                } else if (data === "verified") {
                    temp.push({ "type": "icon", "icon": array?.map(innerData => innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562` }} />), 'isShowHoverText': false });
                } else {
                    temp.push({ "type": "text", "value": array?.map(innerData => innerData[data]) });
                }
            }
            if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
                // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
                temp.push({
                    "type": "icon", "icon": array?.map(innerData =>
                        <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { handleDelete(innerData) }} />
                    ), 'isShowHoverText': false
                });
            }
        })
        console.log(temp, array, basicForm?.documentsRequired?.map(data => data?.document?.name))
        return temp;
    }

    const handleReplace = (data) => {
        let index = tempValue?.table?.findIndex(fileData => fileData?.documentType === data?.documentType);
        setReplaceFileIndex(index);
        console.log(data)
        fileInputRef.current.click();
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        let temp = tempValue.table;
        if (file) {
            console.log('Selected file:', file);
            let fileObj = await addNewDocument(file);
            if (replaceFileIndex !== -1) {
                temp[replaceFileIndex].fileURL = fileObj?.fileURL
                temp[replaceFileIndex].fileUploaded = file?.name
            }
        }
        handleSubmitApplicationReq(temp)
    };

    const handleDelete = (data) => {
        let temp = tempValue?.table;
        temp = temp.filter(obj => !isEqual(obj, data))
        console.log(temp)
        handleSubmitApplicationReq(temp)
    }

    const isEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const actions = [
        { 'data': 'Replace', 'requiredValue': 'boolean', "onClick": handleReplace },
        { 'data': 'Delete', 'requiredValue': 'boolean', "onClick": handleDelete },
    ]

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    console.log(showRedBorderForESign, eSignInitial, eSignTitle)

    const handleContinue = async () => {
        if (tempValue?.table !== undefined) {
            await PUT(`application-management-service/application/${applicationId}/addUploadedDocuments`, tempValue?.table)
                .then(response => {
                    console.log(response)
                    getPreApplication();
                    // temp[index].verified = response?.data?.verified;
                    // temp[index].valid = response?.data?.valid;
                })
                .catch((error) => {
                    console.log(error)
                });
        }
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        } else { navigate('/applicationForm/section1/step3') }
    }

    return (
        <div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <ProgressCard step={''} dataType={formSchema?.description} title={formSchema?.title} timeNumber={1} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                    <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                        {/* <div className={style.titleText}>{formSchema?.description}</div>
                    <div className={`${style.descriptionText} ${style.marginTop10}`}>Ensure your documents are in the following formats: pdf, jpg, (add icons here) </div> */}
                        {/* <div className={`${style.dragAndDropBox} ${style.marginTop}`}>
                        <div className={style.dragAndDropText}>Drag And Drop All Your File Here</div>
                        <div className={style.dragAndDropDescriptionText}>Let Charlie our AI Credentialing assistant Organize, classify and extract data for your application</div>
                    </div> */}
                        {formSchema !== undefined && 'uploadTheDocument' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.uploadTheDocument} gridStyle={style.twoCol} baseKey={'uploadTheDocument'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[0].data`} />
                        )}
                        <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                            <div className={style.padding20}>
                                <div className={style.spaceBetween}>
                                    <div className={style.collapsableCardText}>Required and Recommended documents & forms for this Application</div>
                                    {isCollapsableCard ? (
                                        <div onClick={() => setIsCollapsableCard(false)}>
                                            <KeyboardArrowUpIcon sx={{ color: '#c4bef3' }} />
                                        </div>
                                    ) : (
                                        <div onClick={() => setIsCollapsableCard(true)}>
                                            <KeyboardArrowDownIcon sx={{ color: '#c4bef3' }} />
                                        </div>
                                    )}
                                </div>
                                {isCollapsableCard && (
                                    <>
                                        <CommonDivider />
                                        <div className={`${style.tableHeader} ${style.tableGrid} ${style.marginTop}`}>
                                            <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                                            <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Requirements</div>
                                            <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                                        </div>
                                        {basicForm?.documentsRequired?.map((data, index) => (
                                            <div>
                                                <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${(basicForm?.forms?.[0]?.data !== null && tempValue?.table?.filter(tableData => tableData?.documentType === data?.document?.name)?.length === 0 && data?.required) ? style.redBorder : ''} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.document?.name}</div>
                                                        <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                                                    </div>
                                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.required ? 'Required' : 'Recommended'}</div>
                                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.instruction}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={`${style.twoCol} ${style.marginTop}`}>
                            <CommonDropZone title={'Upload Your Documents'} description={'Upload your files or drag & drop from your file cabinet (Computer / Online Drive)'} changeHandler={changeHandler} files={files} />
                            <CommonDropZone title={'Upload A Photo'} description={'Click a picture of the document with your camera and Upload or Upload from your photo gallery.'} changeHandler={changeHandler} files={files} accept="image/*" />
                        </div>
                        {tempValue?.table?.length !== 0 && (
                            <TableTwo
                                tableHeaderValues={['', 'File Uploaded', 'Size', 'Document Type', 'Requirement', 'Verified', 'Valid', '']}
                                tableDataValues={getApplicantValues(tempValue?.table)}
                                tableData={tempValue?.table || []}
                                gridStyle={style.gridStyle}
                                actions={actions}
                                // scrollStyle={style.contractScrollStyle}
                                tableSortValues={[]}
                                heading={'There are no Record for you to manage'}
                                onClickFunction={() => { }}
                            />
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Hide the actual file input
                        />
                        {(basicForm?.forms?.[0]?.data !== null && !showRedBorderForESign) ? (
                            <div className={`${style.setupCompleteCard} ${style.setupCompleteGrid} ${style.cursorPointer} ${style.marginTop}`} onClick={() => setIsShowESignDialog(true)}>
                                <div></div>
                                <div className={`${style.displayInRow} ${style.justifyCenter}`}>
                                    <DoneIcon sx={{ color: '#7165E3', fontSize: 25 }} />
                                    <div className={`${style.setupCompletedText} ${style.marginLeft10}`}>eSignature Set Up Complete</div>
                                </div>
                                <div className={style.editOrUpdateESign}>Edit / Update</div>
                            </div>
                        ) : (
                            <div className={style.marginTop} onClick={() => setIsShowESignDialog(true)}>
                                <div className={`${style.uploadBorderStyle} ${(basicForm?.forms?.[0]?.data !== null && showRedBorderForESign) ? style.redBorder : ''}`}>
                                    <p className={style.uploadTextStyle}>
                                        {'Set Up Your Electronic Signature'}
                                    </p>

                                    <p className={style.uploadDescriptionText}>
                                        {'Our paperless automated application submission uses electronic signatures with digital fingerprinting.'}
                                    </p>
                                    <p className={style.uploadDescriptionText}>
                                        {'Click here to setup your electronic signature for use.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                    </div>
                    {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                </div>
            </div>
            {
                isShowESignDialog && (
                    <ESignDialog getIsOpen={getIsOpen} tempValue={tempValue} baseKey={'setUpYourSignature'} applicationId={applicationId} basicForm={basicForm} setBasicForm={setBasicForm}>
                        {formSchema !== undefined && 'setUpYourSignature' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.setUpYourSignature} gridStyle={style.twoCol} baseKey={'setUpYourSignature'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[0].data`} setIsEdited={getIsEdited} />
                        )}
                    </ESignDialog>
                )
            }
            {showFileDisplayDialog && (
                <FileDisplayDialog getIsOpen={getIsShowFileDialog} file={selectedFile} />
            )}
        </div >
    )
}

export default Step2;