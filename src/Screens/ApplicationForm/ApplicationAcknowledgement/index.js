import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import Pencil from "../../../images/pencil.png";
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import { GET, PUT } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import WelcomeCard from '../../../Components/WelcomeCard';
import style from './index.module.scss';
import AIAssistantDialog from '../../../Components/AIAssistantDialog';
import ApplicationHeader from '../../../Components/ApplicationHeader';

const Acknowledgement = ({ basicForm, setBasicForm, applicationId }) => {
    const [form, setForm] = useState();
    const [form2, setForm2] = useState();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
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
            `application-management-service/application/66dede8fdf5e683573132ec1`
        );
        setForm(basicForm)
    }

    console.log('form', form)

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

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`New ${form?.basicDetails?.applicant?.applicantType !== undefined ? form?.basicDetails?.applicant?.applicantType : '{Applicant Type}'} Application For ${form?.basicDetails?.applicant?.name?.firstName !== undefined ? form?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${form?.basicDetails?.applicant?.name?.lastName !== undefined ? form?.basicDetails?.applicant?.name?.lastName : '{Last Name}'}`} />

            <div className={style.screenPadding}>

                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        <div className={style.marginTop}>
                            <WelcomeCard title={'Your Application Is Complete, Submit It And Await Your Response!'} description={'There are a number of acknowledgement forms to be signed off. There is a application processing fee to be paid off magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.'} >
                            </WelcomeCard>
                        </div>

                        <div className={`${style.applicationCardStyle}  ${style.marginTop10}`}>

                            <div className={`${style.displayInRow}${style.marginTop20}`}>
                                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                                    <span className={`${style.tableHeaderHeadingTextStyle}`}>Acknowledgements, Consents & Disclosures</span>
                                    <div className={`${style.greenDotStyle}`}></div>
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
                                form?.formSchemas?.map((data, index) => (
                                    <div className={`${index % 2 !== 0 ? style.tableDataStyle : style.tableDataStyle1} ${style.marginTop5} ${style.tableValueGridStyle} `}>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                            <div className={`${style.marginLeft40} ${style.tableDataFontStyle1}}`}>{index + 1}</div>
                                        </div>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                            <div className={`${style.tableDataFontStyle1}`}>{data?.description}</div>
                                            <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter}`} />
                                        </div>
                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                            <div className={`${style.greenDotStyle} `}></div>
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
                        <div className={`${style.continue} ${style.marginTop10}`}>PROCEED TO PAYMENT</div>
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

export default Acknowledgement;