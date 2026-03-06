import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import { getLMSRedirectUrl } from '../../../../utils/formatting';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../../Components/validationDialog';
import JourneyStep6 from './../../../../images/journeyStep6.png';
import RedAlert from './../../../../images/redAlert.png';
import style from './index.module.scss';
import WelcomeCard from '../../../../Components/WelcomeCard';
import ReappointmentProgressCard from '../../../../Components/ReappointmentProgressCard';
import { format } from 'date-fns';
import ReappointmentJourneyDialog from '../../../../Components/reappointmentJourneyDialog';
import { Tooltip } from '@mui/material';
import TableTwo from '../../../../Components/TableDesignTwo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import Cookies from 'universal-cookie';
import PaymentReceipt from '../../../../Components/PaymentReceipt';

const LMSModules = ({ basicForm, setBasicForm, getPreApplication }) => {
    const cookie = new Cookies();
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const { applicationId, section, step } = useParams();
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [yesOrNo, setYesOrNo] = useState('');
    const [updatedDate, setUpdatedDate] = useState('');
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            // Removed yesOrNo and updatedDate state initialization - using course list table instead
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form' || 'Disclosure')?.length === (formIndex + 1)) ? `/reappointmentApplicationForm/${applicationId}/Form/${btoa('PODCheck')}` : `/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
            setNavigateBackURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    // Refetch course/table data when user returns to this window after completing course in LMS (e.g. Go to Course opens new tab)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && getPreApplication) {
                getPreApplication();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [getPreApplication]);

    const getIsValidationDialogOpen = (value) => {
        setShowValidationDialog(value);
    }

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, 'Metadata')
            temp.push(data);
        }
        setMetadata(temp);
    }

    const getAllLabels = (data) => {
        let tempLabels = labels;
        if (!tempLabels?.includes(data)) {
            console.log(tempLabels, data, 'Metadata')
            tempLabels.push(data);
        }
        setLabels(tempLabels);
    }

    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
    }

    const getIsSaveInProgressOpen = (value) => {
        handleSubmitApplicationReq("save");
        setIsSaveInProgressOpen(value);
    }

    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            handleSubmitApplicationReq("skipped")
        }
    }

    const getMissingFields = () => {
        let missingKeys = [];
        // Validation removed - using table view instead of Yes/No
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleSubmitApplicationReq("continue")
        }
        setWarningFields(missingKeys)
        console.log('Metadata', missingKeys)
    }

    const handleSubmitApplicationReq = async (data) => {
        // All courses must be completed for acknowledged === true
        const rawCoursesForAck = Array.isArray(basicForm?.lmsDetails)
            ? basicForm.lmsDetails.flatMap((item) => item?.courses || [])
            : (basicForm?.lmsDetails?.courses ?? []);
        const coursesForAck = (rawCoursesForAck || []).map((c) => ({
            ...c,
            is_course_completed: c._course_completed ?? c.is_course_completed,
        }));
        const areAllCoursesCompleted = (coursesForAck || []).every(
            (c) =>
                c?._course_completed === true ||
                c?.is_course_completed === true ||
                c?.course_status === 'completed'
        );
        const incompleteCourseNames = (coursesForAck || [])
            .filter(
                (c) =>
                    !(c?._course_completed === true ||
                        c?.is_course_completed === true ||
                        c?.course_status === 'completed')
            )
            .map((c) => c?.course_name || c?.name || c?.course_id || 'Course');

        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: basicForm?.forms?.[formIndex]?.data,
            unFilledFields: incompleteCourseNames,
            acknowledged: true
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
                if (data !== "save") {
                    if (sessionStorage.getItem('fromSummary') === "true") {
                        navigate(-1);
                    }
                    else {
                        navigate(navigateURL)

                    }
                }
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
        // } else {
        //     if (sessionStorage.getItem('fromSummary') === "true") {
        //         navigate(-1);
        //     }
        //     else {
        //         navigate(navigateURL)

        //     }
        // }
    }

    const handleBackClick = async () => {
        navigate(navigateBackURL)
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    // lmsDetails is a single object { total_courses, courses }; support both _course_completed and is_course_completed from API
    const rawCourses = Array.isArray(basicForm?.lmsDetails) ? basicForm.lmsDetails.flatMap((item) => item?.courses || []) : (basicForm?.lmsDetails?.courses ?? []);
    const courses = (rawCourses || []).map((c) => ({ ...c, is_course_completed: c._course_completed ?? c.is_course_completed }));

    const handleCourseClick = async (course) => {
        try {
            const lmsUrl = await getLMSRedirectUrl(cookie.get("user"));
            window.open(lmsUrl, '_blank');
        } catch (err) {
            ErrorToaster('Unable to open LMS');
        }
    }

    const handleViewCertificate = (course) => {
        if (course?.certificate_details?.view_url) {
            window.open(course.certificate_details.view_url, '_blank');
        }
    }

    const handleCourseNameClick = (course) => {
        if (course?.is_course_completed && course?.certificate_details?.view_url) {
            handleViewCertificate(course);
        } else {
            handleCourseClick(course);
        }
    }

    const handleDownloadCertificate = (course) => {
        if (course?.certificate_details?.download_url) {
            window.open(course.certificate_details.download_url, '_blank');
        }
    }

    const actions = [
        {
            data: 'Go to Course',
            onClick: handleCourseClick,
            hoverText: 'Open course in LMS',
            conditionToShow: '!data?.is_course_completed'
        },
        // View Certificate moved to icon column before Action
        // {
        //     data: 'View Certificate',
        //     conditionToShow: 'data?.is_course_completed && data?.certificate_details?.view_url',
        //     onClick: handleViewCertificate,
        //     hoverText: 'View certificate'
        // }
    ]

    const getCourseTable = () => {
        let temp = [];
        // Status icon column
        temp.push({
            "type": "icon",
            "icon": courses?.map((course) => (
                course?.is_course_completed ? (
                    <CheckCircleIcon sx={{ fontSize: 24, color: '#14B15A' }} />
                ) : (
                    <img src={RedAlert} alt="Not Completed" style={{ width: '24px', height: '24px' }} />
                )
            )),
            'isShowHoverText': false
        });
        // Course Name column (clickable: View Certificate for completed with certificate, else View Course)
        temp.push({
            "type": "text",
            "value": courses?.map((course) => course?.course_name),
            'onClickFunction': handleCourseNameClick
        });
        // Completed On date column
        temp.push({
            "type": "text",
            "value": courses?.map((course) => course?.is_course_completed && course?.course_completion_date ? format(new Date(course.course_completion_date), 'MMM dd, yyyy') : '')
        });
        // View Certificate icon column (before Action): show icon when completed and has certificate URL
        temp.push({
            type: 'field',
            field: courses?.map((course) =>
                course?.is_course_completed && course?.certificate_details?.view_url ? (
                    <div key={course?.course_id ?? course?.course_name} className={style.verticalAlignCenter} style={{ width: '100%', minHeight: '100%' }}>
                        <Tooltip title="View certificate" arrow>
                            <CardMembershipIcon
                                sx={{ fontSize: 22, color: 'var(--primary-color)', cursor: 'pointer' }}
                                onClick={() => handleViewCertificate(course)}
                            />
                        </Tooltip>
                    </div>
                ) : (
                    <div key={course?.course_id ?? course?.course_name} className={style.verticalAlignCenter} style={{ width: '100%' }}>
                        <span />
                    </div>
                )
            )
        });
        // Action column (Go to Course for incomplete only)
        temp.push({
            type: "action",
            value: actions
        });
        return temp;
    }
    return (
        <div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <ReappointmentProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchemaWholeObject?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />
                    <div className={style.marginTop10}>
                        <WelcomeCard title={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.label }} />}
                            description={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.description }} />} />
                    </div>
                    <div className={`${style.applicationCardStyle} ${style.marginTop10}`}>
                        {/* <div className={style.cardTitle}>
                            Have you completed all of the CMH assigned LMS Modules for your reappointment?
                        </div> */}
                        <div>
                            <TableTwo
                                tableHeaderValues={[
                                    "",
                                    "Course Name",
                                    "Completed On",
                                    "",
                                    "Action"
                                ]}
                                tableDataValues={getCourseTable()}
                                tableData={courses}
                                gridStyle={style.courseGridStyle}
                                actions={actions}
                                tableSortValues={[]}
                                heading={"There are no courses available"}
                                onClickFunction={handleCourseNameClick}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                    {(basicForm?.payment?.invoice?.fileURL !== undefined) && (
                        <div className={style.marginTop}>
                            <PaymentReceipt basicForm={basicForm} />
                        </div>
                    )}
                    <div className={style.marginTop}>
                        <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    </div>
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hiddenStickyContainer : ""}`}>
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow> <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div></Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div></Tooltip>

                        <div className={style.twoColForButton}>
                            <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                                <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleBackClick()}>BACK</div></Tooltip>
                            {/* <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowJourneyDialog(true)}>CONTINUE</div> */}
                            <Tooltip title={"Click to Proceed to the Next Step"} arrow>
                                <div className={`${style.continue} ${style.marginTop10}`} onClick={() => getMissingFields()}>CONTINUE</div></Tooltip>
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
            {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
            )}
            {showJourneyDialog && (
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Almost There! Don't Give Up Now`} img={JourneyStep6} formIndex={formIndex} basicForm={basicForm} continueClick={getMissingFields} />
            )}
        </div>
    )
}

export default LMSModules;