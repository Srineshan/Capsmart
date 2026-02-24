import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../../Components/validationDialog';
import RedAlert from '../../../../images/redAlert.png';
import style from './index.module.scss';
import WelcomeCard from '../../../../Components/WelcomeCard';
import { format } from 'date-fns';
import { Tooltip } from '@mui/material';
import TableTwo from '../../../../Components/TableDesignTwo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import Cookies from 'universal-cookie';

const LMSModules = ({ basicForm, setBasicForm, getPreApplication, applicationId }) => {
    const cookie = new Cookies();
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const navigate = useNavigate();
    const [isEdited, setIsEdited] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const { applicationId: applicationIdParam, section, step } = useParams();
    const appId = applicationId || applicationIdParam;
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();

    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema();
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL(
                (basicForm?.forms?.filter((data) => data?.formCategory === 'Form' || data?.formCategory === 'Disclosure')?.length === formIndex + 1)
                    ? `/applicationForm/${appId}/Form/${btoa('PODCheck')}`
                    : `/applicationForm/${appId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex + 1]?.schemaCategory)}`
            );
            if (formIndex > 0) {
                setNavigateBackURL(`/applicationForm/${appId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
            } else {
                setNavigateBackURL(`/applicationForm/${appId}/${basicForm?.forms?.[0]?.formCategory}/${btoa(basicForm?.forms?.[0]?.schemaCategory)}`);
            }
        }
    }, [basicForm, formIndex, appId]);

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex((data) => data?.schemaCategory === atob(step)));
    }, [basicForm, step]);

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
    };

    const getIsSaveInProgressOpen = (value) => {
        handleSubmitApplicationReq('save');
        setIsSaveInProgressOpen(value);
    };

    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(`application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`);
            setFormSchema(form?.schema);
            setFormSchemaWholeObject(form);
        }
    };

    const getSkipClicked = (value) => {
        if (value) {
            handleSubmitApplicationReq('skipped');
        }
    };

    const getMissingFields = () => {
        const missingKeys = [];
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true);
        } else {
            handleSubmitApplicationReq('continue');
        }
        setWarningFields(missingKeys);
    };

    const handleSubmitApplicationReq = async (data) => {
        const temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: basicForm?.forms?.[formIndex]?.data,
            unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
            acknowledged: true,
            dataStatus: 'COMPLETED'
        };
        await PUT(`application-management-service/application/${appId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then((response) => {
                setBasicForm(response?.data);
                SuccessToaster('Application Updated Successfully');
                getPreApplication();
                if (data !== 'save') {
                    if (sessionStorage.getItem('fromSummary') === 'true') {
                        navigate(-1);
                    } else {
                        navigate(navigateURL);
                    }
                }
            })
            .catch((error) => {
                ErrorToaster('Unexpected Error Updating Application');
            });
    };

    const handleBackClick = () => {
        navigate(navigateBackURL);
    };

    const rawCourses = Array.isArray(basicForm?.lmsDetails) ? (basicForm?.lmsDetails || []).flatMap((item) => item?.courses || []) : (basicForm?.lmsDetails?.courses ?? []);
    const courses = (rawCourses || []).map((c) => ({ ...c, is_course_completed: c._course_completed ?? c.is_course_completed }));

    const handleCourseClick = (course) => {
        const lmsUrl = `https://lms.indocaribe.com/descope-login/?ssotoken=${cookie.get('authorization')}`;
        window.open(lmsUrl, '_blank');
    };

    const handleViewCertificate = (course) => {
        if (course?.certificate_details?.view_url) {
            window.open(course.certificate_details.view_url, '_blank');
        }
    };

    const handleCourseNameClick = (course) => {
        if (course?.is_course_completed && course?.certificate_details?.view_url) {
            handleViewCertificate(course);
        } else {
            handleCourseClick(course);
        }
    };

    const actions = [
        {
            data: 'Go to Course',
            onClick: handleCourseClick,
            hoverText: 'Open course in LMS',
            conditionToShow: '!data?.is_course_completed'
        }
    ];

    const getCourseTable = () => {
        const temp = [];
        temp.push({
            type: 'icon',
            icon: courses?.map((course) =>
                course?.is_course_completed ? (
                    <CheckCircleIcon sx={{ fontSize: 24, color: '#14B15A' }} />
                ) : (
                    <img src={RedAlert} alt="Not Completed" style={{ width: '24px', height: '24px' }} />
                )
            ),
            isShowHoverText: false
        });
        temp.push({
            type: 'text',
            value: courses?.map((course) => course?.course_name),
            onClickFunction: handleCourseNameClick
        });
        temp.push({
            type: 'text',
            value: courses?.map((course) => (course?.is_course_completed && course?.course_completion_date ? format(new Date(course.course_completion_date), 'MMM dd, yyyy') : ''))
        });
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
        temp.push({
            type: 'action',
            value: actions
        });
        return temp;
    };

    return (
        <div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <ProgressCard
                        dataType={formSchema?.description || 'LMS Modules'}
                        title={formSchemaWholeObject?.title || 'LMS Modules'}
                        timeNumber={22}
                        timeText="Min"
                        progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
                        basicForm={basicForm}
                    />
                    <div className={style.marginTop10}>
                        <WelcomeCard
                            title={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.label }} />}
                            description={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.description }} />}
                        />
                    </div>
                    <div className={`${style.applicationCardStyle} ${style.marginTop10}`}>
                        <div>
                            <TableTwo
                                tableHeaderValues={['', 'Course Name', 'Completed On', '', 'Action']}
                                tableDataValues={getCourseTable()}
                                tableData={courses}
                                gridStyle={style.courseGridStyle}
                                actions={actions}
                                tableSortValues={[]}
                                heading="There are no courses available"
                                onClickFunction={handleCourseNameClick}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <ApplicationUserCard user="First Mi Last" applyingFor="{Doctor} Applying As {Associate}" />
                    <div className={style.marginTop}>
                        <ApplicationAssistanceCard user="Neena Greenly" designation="{Designation}" contactNumber="{Contact Number}" email="{Email}" />
                    </div>
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog ? style.hiddenStickyContainer : ''}`}>
                        <Tooltip title="Click to Skip This Step and Continue Later" arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>
                                SKIP FOR NOW
                            </div>
                        </Tooltip>
                        <Tooltip title="Click to Save your Progress and Continue later" arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>
                                SAVE IN PROGRESS
                            </div>
                        </Tooltip>
                        <div className={style.twoColForButton}>
                            <Tooltip title="Click to Go Back to the Previous Step" arrow>
                                <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleBackClick()}>
                                    BACK
                                </div>
                            </Tooltip>
                            <Tooltip title="Click to Proceed to the Next Step" arrow>
                                <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()}>
                                    CONTINUE
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
            {isSaveInProgressOpen && <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />}
            {showValidationDialog && <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />}
        </div>
    );
};

export default LMSModules;
