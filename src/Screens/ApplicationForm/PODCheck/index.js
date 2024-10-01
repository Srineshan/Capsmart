import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import DataStatusIcon from '../../../images/dqStatus.png';
import DocumentIcon from '../../../images/document.png';
import { GET, PUT } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import Pencil from "../../../images/pencil.png";
import EditIcon from '@mui/icons-material/Edit';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import ApplicationHeader from '../../../Components/ApplicationHeader';
import style from './index.module.scss';
import AIAssistantDialog from '../../../Components/AIAssistantDialog';

const PODCheck = ({ basicForm, setBasicForm, applicationId }) => {
    const [form, setForm] = useState();
    const [form2, setForm2] = useState();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(true);
    const id = sessionStorage.getItem('applicationId');
    useEffect(() => {
        sessionStorage.setItem('fromSummary', false);
        getPreApplication();
    }, [])

    // useEffect(() => {
    //     getBasicForm()
    // }, [])

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${id}`
        );
        setForm(basicForm)
    }

    const handleContinue = () => {
        navigate('/applicationForm/section1/acknowledgementStep1');
    }

    console.log('form', form)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`New ${form?.basicDetails?.applicant?.applicantType !== undefined ? form?.basicDetails?.applicant?.applicantType : '{Applicant Type}'} Application For ${form?.basicDetails?.applicant?.name?.firstName !== undefined ? form?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${form?.basicDetails?.applicant?.name?.lastName !== undefined ? form?.basicDetails?.applicant?.name?.lastName : '{Last Name}'}`} />

            <div className={style.screenPadding}>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div className={`${style.applicationCardStyle}  ${style.marginTop}`}>
                        <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                                <span className={`${style.tableHeaderHeadingTextStyle}`}>Overall Status Of Data & Documents Required For This Application</span>
                                <div className={`${style.greyDotStyle}`}></div>
                            </div>
                        </div>
                        <div className={`${style.tableHeaderStyle} ${style.marginTop10} ${style.tableHeaderGridStyle} `}></div>
                        <div className={`${style.tableHeaderStyle} ${style.marginTop10} ${style.tableHeaderGridStyle} `}>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableHeaderTextStyle} ${style.marginLeft20}`}>POD Verification Check</div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableHeaderTextStyle}`}
                                >
                                    <img src={DataStatusIcon} alt="" style={{
                                        width: "18px",
                                        height: "20px"
                                    }} />

                                </div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableHeaderTextStyle}`}
                                >
                                    <img src={DocumentIcon} alt=""
                                        style={{
                                            width: "18px",
                                            height: "20px"
                                        }} />

                                </div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableHeaderTextStyle}`}>Items To Address</div>
                            </div>
                        </div>
                        <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableValueGridStyle} `}>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.marginLeft5} ${style.tableDataFontDisabledStyle1}}`}></div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableDataFontStyle1}`}> Applicant Profile Information</div>
                                <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/applicationForm/section1/step1`); }} />
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.greenDotStyle} `}></div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.greenDotStyle} `}></div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                {/* <div className={`${style.greenDotStyle} `}></div> */}
                            </div>
                        </div>
                        <div>

                            {
                                form?.formSchemas?.filter(data => data?.formCategory === 'Form')?.map((data, index) => (
                                    <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableValueGridStyle} `}>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                        {index !== 0 && (
                                           <div className={`${style.marginLeft5} ${style.tableDataFontDisabledStyle1}`}>{data?.title || ''}</div>
                                        )}
                                        </div>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                            <div className={`${style.tableDataFontStyle1}`}>{data?.description}</div>
                                            <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/applicationForm/section1/${data?.title?.toLowerCase()?.replace(' ', '')}`) }} />
                                        </div>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                            {/* <div className={`${style.greyDotStyle} `}></div> */}
                                            <div className={`${data?.acknowledged === true? style.greenDotStyle : style.yellowDotStyle}`}></div>
                                            {/* <div className={data?.acknowledged ? style.greenDotStyle : style.yellowDotStyle}></div> */}
                                            
                                        </div>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                            {/* <div className={`${style.greyDotStyle} `}></div> */}
                                            <div className={`${data?.acknowledged === true ? style.greenDotStyle : style.yellowDotStyle}`}></div>
                                        </div>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                            {/* <div className={`${style.greenDotStyle} `}></div> */}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>


                    </div>
                    <div className={style.marginTop}>
                        <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                        <div className={style.marginTop10}>
                            <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                        </div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                        <div className={style.twoColForButton}>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                        </div>
                        {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                    </div>
                    {/* {isOpen && (
                <AIAssistantDialog getIsOpen={getIsOpen} />
            )} */}
                </div>
            </div>
        </div >
    )
}

export default PODCheck;