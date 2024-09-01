import React, { useEffect, useRef, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { GET, PUT, POST } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import style from './index.module.scss';
import { format } from 'date-fns';
import CommonDropZone from '../../../Components/CommonFields/CommonDropZone';
import ESignDialog from '../../../Components/ESignDialog';
import TableTwo from '../../../Components/TableDesignTwo';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';

const Step2 = ({ basicForm, setBasicForm, applicationId }) => {
    const [formSchema, setFormSchema] = useState();
    const fileInputRef = useRef(null);
    const [isEdited, setIsEdited] = useState(false);
    const [openCategoryIndex, setOpenCategoryIndex] = useState(-1);
    const [isShowESignDialog, setIsShowESignDialog] = useState(false);
    const [files, setFiles] = useState([]);
    const [replaceFileIndex, setReplaceFileIndex] = useState(-1)
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
                table.push({ documentType: '', fileSize: `${(data?.size / (1024 * 1024)).toFixed(2)} Mb`, fileURL: response?.data[index]?.fileURL, fileUploaded: data?.name, requirement: 'To Be Decided', valid: '', verified: '' })
            })
            handleSubmitApplicationReq(table)
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error(error);
            return null;
        }
    };

    const handleChange = (value, index) => {
        console.log(tempValue?.table, value, index)
        let temp = tempValue?.table;
        temp[index].documentType = value;
        if (value !== null || value !== "") {
            temp[index].requirement = !basicForm?.documentsRequired?.filter(data => data?.document?.name === value)?.[0]?.required ? 'Mandatory' : 'Optional';
        }
        console.log(temp)
        handleSubmitApplicationReq(temp)
    }

    const getApplicantValues = (array) => {
        let temp = [];
        // temp.push({ "type": "icon", "icon": array?.map(innerData => <TextSnippetOutlinedIcon style={{ fontSize: 20, }} onClick={() => { window.open(innerData?.file?.fileURL, '_blank'); }} />), 'isShowHoverText': false });
        // temp.push({ "type": "text", "value": array?.map(innerData => innerData?.name) });
        // temp.push({ "type": "text", "value": array?.map(innerData => `${(innerData?.size / (1024 * 1024)).toFixed(2)} Mb`) });
        // temp.push({
        //     "type": "field", "field": array?.map(innerData => <CommonSelectField
        //         // value={''}
        //         onChange={(e) => handleChange(e.target.value)}
        //         className={style.fullWidth}
        //         // firstOptionLabel={fieldData.label}
        //         // firstOptionValue={fieldData.label}
        //         valueList={basicForm?.documentsRequired?.map(data => data?.document?.name) || []}
        //         labelList={basicForm?.documentsRequired?.map(data => data?.document?.name) || []}
        //         disabledList={basicForm?.documentsRequired?.map(data => false)}
        //     />)
        // });
        // temp.push({ "type": "text", "value": array?.map(innerData => 'Required') });
        // temp.push({ "type": "icon", "icon": array?.map(innerData => <TextSnippetOutlinedIcon style={{ fontSize: 20, }} />), 'isShowHoverText': false });
        // temp.push({ "type": "icon", "icon": array?.map(innerData => <TextSnippetOutlinedIcon style={{ fontSize: 20, }} />), 'isShowHoverText': false });
        // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
        Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.map((data, index) => {
            if (data === "file") {
                temp.push({ "type": "icon", "icon": array?.map(innerData => <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.fileURL, '_blank'); }} />), 'isShowHoverText': false });
            } else {
                if (data === "documentType") {
                    temp.push({
                        "type": "field", "field": array?.map((innerData, innerIndex) => <CommonSelectField
                            value={innerData[data]}
                            onChange={(e) => handleChange(e.target.value, innerIndex)}
                            className={style.fullWidth}
                            // firstOptionLabel={fieldData.label}
                            // firstOptionValue={fieldData.label}
                            valueList={basicForm?.documentsRequired?.map(data => data?.document?.name) || []}
                            labelList={basicForm?.documentsRequired?.map(data => data?.document?.name) || []}
                            disabledList={basicForm?.documentsRequired?.map(data => false)}
                        />)
                    });
                } else {
                    temp.push({ "type": "text", "value": array?.map(innerData => innerData[data]) });
                }
            }
            if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
                temp.push({ "type": "action", "value": array?.map(innerData => actions) })
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

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={''} dataType={'Process Required Documents'} title={'Upload your Documents'} timeNumber={1} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div className={style.applicationCardStyle}>
                    {/* <div className={style.titleText}>{formSchema?.description}</div>
                    <div className={`${style.descriptionText} ${style.marginTop10}`}>Ensure your documents are in the following formats: pdf, jpg, (add icons here) </div> */}
                    {/* <div className={`${style.dragAndDropBox} ${style.marginTop}`}>
                        <div className={style.dragAndDropText}>Drag And Drop All Your File Here</div>
                        <div className={style.dragAndDropDescriptionText}>Let Charlie our AI Credentialing assistant Organize, classify and extract data for your application</div>
                    </div> */}
                    {formSchema !== undefined && 'uploadTheDocument' in formSchema?.properties && (
                        <ApplicationFieldCard object={formSchema?.properties?.uploadTheDocument} gridStyle={style.twoCol} baseKey={'uploadTheDocument'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[0].data`} />
                    )}
                    <div className={`${style.tableHeader} ${style.tableGrid}`}>
                        {/* <div className={style.tableHeaderText}></div> */}
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Requirements</div>
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                    </div>
                    {basicForm?.documentsRequired?.map((data, index) => (
                        <div>
                            <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                {/* <div>
                                    <label for={`file-upload-dynamic-${data?.document?.name}`}>
                                        <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />
                                    </label>
                                    <input id={`file-upload-dynamic-${data?.document?.name}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => handleFileUpload(e, data?.document?.id)} />
                                </div> */}
                                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.document?.name}</div>
                                    <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                                </div>
                                {/* <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div> */}
                                <div className={style.documentTextStyle}>{data?.required ? 'Mandatory' : 'Optional'}</div>
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.instruction}</div>
                                {/* <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div> */}
                                {/* <div className={style.verticalAlignCenter}>
                                    {openCategoryIndex === index ? (
                                        <RemoveIcon sx={{ color: '#6F7479' }} className={style.cursorPointer} onClick={() => setOpenCategoryIndex(-1)} />
                                    ) : (
                                        <AddIcon sx={{ color: '#6F7479' }} className={style.cursorPointer} onClick={() => setOpenCategoryIndex(index)} />
                                    )}
                                </div> */}
                            </div>
                            {/* {openCategoryIndex === index && <div>{data?.mandatory}</div>}
                            {openCategoryIndex === index && data?.documents?.map(data =>
                                <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.documentName}</div>
                                    </div>
                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.fileName}</div>
                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{format(new Date(data?.dateUploaded), 'MM-dd-yyyy HH:mm')}</div>
                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.mandatory ? 'Mandatory' : 'Optional'}</div>
                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                    <div className={style.verticalAlignCenter}>
                                        <MoreHorizIcon sx={{ color: '#6F7479' }} className={style.cursorPointer} />
                                    </div>
                                </div>
                            )} */}
                        </div>
                    ))}
                    <div className={`${style.twoCol} ${style.marginTop}`}>
                        <CommonDropZone title={'Upload Your Documents'} description={'Upload your files or drag & drop from your cabinet'} changeHandler={changeHandler} files={files} />
                        <CommonDropZone title={'Upload A Photo'} description={'Click a picture with your Camera or upload from Gallery.'} changeHandler={changeHandler} files={files} accept="image/*" />
                    </div>
                    <div className={style.marginTop} onClick={() => setIsShowESignDialog(true)}>
                        <div className={style.uploadBorderStyle}>
                            <p className={style.uploadTextStyle}>
                                {'Set Up Your eSignature'}
                            </p>

                            <p className={style.uploadDescriptionText}>
                                {'Our paperless automated application submission uses electronic signatures with digital fingerprinting. Set up your electronic signature.'}
                            </p>
                        </div>
                    </div>
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
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // Hide the actual file input
                    />
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step3')}>CONTINUE</div>
                    {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                </div>
            </div>
            {isShowESignDialog && (
                <ESignDialog getIsOpen={getIsOpen} tempValue={tempValue} baseKey={'setUpYourSignature'} applicationId={applicationId} basicForm={basicForm} setBasicForm={setBasicForm}>
                    {formSchema !== undefined && 'setUpYourSignature' in formSchema?.properties && (
                        <ApplicationFieldCard object={formSchema?.properties?.setUpYourSignature} gridStyle={style.twoCol} baseKey={'setUpYourSignature'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[0].data`} setIsEdited={getIsEdited} />
                    )}
                </ESignDialog>
            )}
        </div>
    )
}

export default Step2;