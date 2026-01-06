import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import Pencil from "../../../../images/pencil.png";
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import { GET, PUT, POST } from '../../../dataSaver';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import WelcomeCard from '../../../../Components/WelcomeCard';
import style from './index.module.scss';
import AIAssistantDialog from '../../../../Components/AIAssistantDialog';
import ApplicationHeader from '../../../../Components/ApplicationHeader';
import ApplicationSubmitDialog from '../../../../Components/ApplicationSubmitDialog';
import PaymentDialog from '../../../../Components/paymentDialog';
import { Tooltip } from '@mui/material';

const AcknowledgementCheck = ({ basicForm, setBasicForm, applicationId }) => {
    const [form, setForm] = useState();
    const [form2, setForm2] = useState();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [paymentListData, setPaymentListData] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const id = sessionStorage.getItem('applicationId');
    const isDisabled =
        paymentListData?.fee !== 0 &&
        paymentListData?.fee !== undefined &&
        !basicForm?.payment?.paymentCompleted;

    useEffect(() => {
        // getPreApplication();
        sessionStorage.setItem('fromSummary', false)
    }, [])

    useEffect(() => {
        if (basicForm)
            fetchPaymentListData();
    }, [basicForm])

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    // const getPreApplication = async () => {
    //     const { data: basicForm } = await GET(
    //         `application-management-service/application/${applicationId}`
    //     );
    //     setForm(basicForm)
    // }

    const fetchPaymentListData = async () => {
        try {
            const regionalCallResponsibility = 'NA';
            const response = await GET(`entity-service/paymentAndFeeDetails/getFeeDetail?privilegeCategoryId=${basicForm?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id}&applicantTypeId=${basicForm?.basicDetailReferences?.applicantType?.id}&applicantCreationType=${basicForm?.creationType}&regionalCallResponsibility=${regionalCallResponsibility}&departmentId=${basicForm?.basicDetailReferences?.department?.id}&specialtyId=${basicForm?.basicDetailReferences?.specialty?.id}`);
            setPaymentListData(response.data);
        } catch (error) {
            console.error("Error fetching payment list data:", error);
        }
    };

    const getIsShowPaymentDialog = (value) => {
        setShowPaymentDialog(value)
    }

    const handleContinue = () => {
        setShowPaymentDialog(false)
    }

    const handleSubmitApplication = async () => {
        await POST(`application-management-service/application/${applicationId}/submit`)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Submitted Successfully");
                setIsOpen(true);
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Submitting Application");
            });
        let timeData = {
            "value": Math.floor(parseFloat(localStorage.getItem(`totalTime_${applicationId}`)) / 60000),
            "unit": "MINUTES"
        }
        await PUT(`application-management-service/application/${applicationId}/completionDuration`, timeData)
    }

    console.log('form', basicForm)

    // const getBasicForm = async () => {
    //     const { data: basicForm } = await GET(
    //         `application-management-service/application/basicForm`
    //     );
    //     if (basicForm) {
    //         const { data: form1 } = await GET(
    //             `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
    //         );
    //         let temp = form1?.schema;
    //         if (temp.properties.applicant.properties !== null) {
    //             delete temp.properties.applicant.properties['applicantType']
    //             delete temp.properties.applicant.properties['startDate']
    //         }
    //         setForm1(form1?.schema)
    //     }
    // }

    // const handleSubmitApplicationReq = async () => {
    //     let data = basicForm;
    //     console.log(data)
    //     await PUT(`application-management-service/application/${applicationId}`, data)
    //         .then(response => {
    //             console.log(response)
    //             setBasicForm(response?.data)
    //             SuccessToaster("Staff Member Application Updated Successfully");
    //             navigate('/applicationForm/section1/step2')
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             ErrorToaster("Unexpected Error Updating Staff Member Application");
    //         });
    // }

    console.log(basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.every(item => item.dataStatus === "COMPLETED"), basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.some(item => item.dataStatus === "SKIPPED_MANDATORY_FIELD"), basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.some(item => item.dataStatus === "SKIPPED_NON_MANDATORY_FIELD"), basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.every(item => item.dataStatus === "COMPLETED") ? 'style.greenDotStyle' : basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.some(item => item.dataStatus === "SKIPPED_MANDATORY_FIELD") ? 'style.redDotStyle' : basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.some(item => item.dataStatus === "SKIPPED_NON_MANDATORY_FIELD") ? 'style.yellowDotStyle' : 'style.greyDotStyle')

    return (
        <div >

            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    {/* <div className={style.marginTop}>
                        <WelcomeCard title={'Your Application Is Complete, Submit It And Await Your Response!'} description={'There are a number of acknowledgement forms to be signed off. There is a application processing fee to be paid off magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.'} >
                        </WelcomeCard>
                    </div> */}

                    <div className={`${style.applicationCardStyle}  ${style.marginTop10}`}>

                        <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                                <span className={`${style.tableHeaderHeadingTextStyle}`}>Acknowledgements & Consents</span>
                                <div className={basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.every(item => item.dataStatus === "COMPLETED") ? style.greenDotStyle : basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.some(item => item.dataStatus === "SKIPPED_MANDATORY_FIELD") ? style.redDotStyle : basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.some(item => item.dataStatus === "SKIPPED_NON_MANDATORY_FIELD") ? style.yellowDotStyle : style.greyDotStyle}></div>
                            </div>
                        </div>
                        <div className={`${style.tableHeaderStyle} ${style.marginTop10} ${style.tableHeaderGridStyle} `}>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}></div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableHeaderTextStyle}`}>Required Forms for your Applications</div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div></div>
                            </div>
                        </div>
                        {
                            basicForm?.forms?.filter(data => data?.formCategory !== 'Form' && data?.formCategory !== 'Disclosure')?.map((data, index) => (
                                <div className={`${index % 2 !== 0 ? style.tableDataStyle : style.tableDataStyle1} ${style.marginTop5} ${style.tableValueGridStyle} `}>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                        <div className={`${style.marginLeft40} ${style.tableDataFontStyle1}}`}>{index + 1}</div>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                        <div className={`${style.tableDataFontStyle1}`}>{data?.title}</div>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                        <div className={data?.dataStatus === "COMPLETED" ? style.greenDotStyle : data?.dataStatus === "SKIPPED_MANDATORY_FIELD" ? style.redDotStyle : data?.dataStatus === "SKIPPED_NON_MANDATORY_FIELD" ? style.yellowDotStyle : style.greyDotStyle}></div>
                                        <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/applicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`) }} />
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
                    <div className={style.stickyContainer}>
                        {/* <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div> */}
                        <Tooltip title={isDisabled ? 'Payment is required to submit the application' : ''} arrow isDisabled={!isDisabled}>
                            <div className={`${isDisabled ? style.disabled : ''} ${style.continue} ${style.marginTop10}`} onClick={isDisabled ? () => { } : () => handleSubmitApplication()}>SUBMIT APPLICATION</div>
                        </Tooltip>
                        {(paymentListData?.fee !== 0 && paymentListData?.fee !== undefined && !basicForm?.payment?.paymentCompleted) && (
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowPaymentDialog(true)}>PROCEED TO PAYMENT</div>
                        )}
                    </div>
                    {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                </div>
                {isOpen && (
                    <ApplicationSubmitDialog getIsOpen={getIsOpen} title={`Mission Accomplished! You're A Champion`} description={`Please note that the entire application process for full board approval may take up to 3 months to complete.`} />
                )}
                {showPaymentDialog && (
                    <PaymentDialog
                        getIsOpen={getIsShowPaymentDialog}
                        continueClickFunc={handleContinue}
                        paymentListData={paymentListData}
                        applicantName={`${basicForm?.applicant?.name?.firstName}_${basicForm?.applicant?.name?.lastName}`}
                    />
                )}
            </div>
        </div>
    )
}

export default AcknowledgementCheck;