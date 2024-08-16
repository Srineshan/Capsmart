import React, { useEffect, useState } from 'react';
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

import style from './index.module.scss';
import { format } from 'date-fns';

const Step2 = ({ basicForm, setBasicForm, applicationId }) => {
    const [formSchema, setFormSchema] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [openCategoryIndex, setOpenCategoryIndex] = useState(-1);
    let tempValue = basicForm?.forms?.[0]?.data === null ? { requiredDocuments: basicForm?.documentsRequired } : basicForm?.forms?.[0]?.data;
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
        setFormSchema(form)
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
        handleSubmitApplicationReq()
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

    const handleSubmitApplicationReq = async () => {
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
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 2'} dataType={'Prepare your requirements'} title={'Upload your Documents'} timeNumber={1} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div className={style.applicationCardStyle}>
                    <div className={style.titleText}>{formSchema?.description}</div>
                    <div className={`${style.descriptionText} ${style.marginTop10}`}>Ensure your documents are in the following formats: pdf, jpg, (add icons here) </div>
                    <div className={`${style.dragAndDropBox} ${style.marginTop}`}>
                        <div className={style.dragAndDropText}>Drag And Drop All Your File Here</div>
                        {/* <div className={style.dragAndDropDescriptionText}>Let Charlie our AI Credentialing assistant Organize, classify and extract data for your application</div> */}
                    </div>
                    <div className={`${style.tableHeader} ${style.tableGrid} ${style.marginTop}`}>
                        <div className={style.tableHeaderText}></div>
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document</div>
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>File Name</div>
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Date Uploaded</div>
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                        <div className={style.tableHeaderText}></div>
                    </div>
                    {tempValue?.requiredDocuments?.map((data, index) => (
                        <div>
                            <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                <div>
                                    <label for={`file-upload-dynamic-${data?.document?.name}`}>
                                        <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />
                                    </label>
                                    <input id={`file-upload-dynamic-${data?.document?.name}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => handleFileUpload(e, data?.document?.id)} />
                                </div>
                                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.document?.name}</div>
                                    <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                                </div>
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                {/* <div className={style.documentTextStyle}>{data?.required ? 'Mandatory' : 'Optional'}</div> */}
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}></div>
                                <div className={style.verticalAlignCenter}>
                                    {openCategoryIndex === index ? (
                                        <RemoveIcon sx={{ color: '#6F7479' }} className={style.cursorPointer} onClick={() => setOpenCategoryIndex(-1)} />
                                    ) : (
                                        <AddIcon sx={{ color: '#6F7479' }} className={style.cursorPointer} onClick={() => setOpenCategoryIndex(index)} />
                                    )}
                                </div>
                            </div>
                            {openCategoryIndex === index && <div>{data?.mandatory}</div>}
                            {openCategoryIndex === index && data?.documents?.map(data =>
                                <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                    <div>

                                    </div>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.documentName}</div>
                                        {/* <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} /> */}
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
                            )}
                        </div>
                    ))}
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
        </div>
    )
}

export default Step2;