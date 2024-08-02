import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AddIcon from '@mui/icons-material/Add';
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';

import style from './index.module.scss';

const Step2 = ({ basicForm, setBasicForm }) => {
    const [formSchema, setFormSchema] = useState();
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
    console.log(formSchema, basicForm)
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
                        <div className={style.tableHeaderText}>Document</div>
                        <div className={style.tableHeaderText}>File Name</div>
                        <div className={style.tableHeaderText}>Date Uploaded</div>
                        <div className={style.tableHeaderText}></div>
                        <div className={style.tableHeaderText}>Document Type</div>
                        <div className={style.tableHeaderText}></div>
                    </div>
                    {basicForm?.documentsRequired?.map((data, index) => (
                        <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                            <div>
                                <label for={`file-upload-dynamic-${data?.document?.name}`}>
                                    <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />
                                </label>
                                <input id={`file-upload-dynamic-${data?.document?.name}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { }} />
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                <div className={style.documentTextStyle}>{data?.document?.name}</div>
                                <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                            </div>
                            <div className={style.documentTextStyle}></div>
                            <div className={style.documentTextStyle}></div>
                            <div className={style.documentTextStyle}></div>
                            {/* <div className={style.documentTextStyle}>{data?.required ? 'Mandatory' : 'Optional'}</div> */}
                            <div className={style.documentTextStyle}></div>
                            <div className={style.documentTextStyle}></div>
                            <AddIcon sx={{ color: '#6F7479' }} className={style.cursorPointer} />
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