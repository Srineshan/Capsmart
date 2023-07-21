import React, { useRef, useCallback, useEffect, useState } from 'react';
import { GET } from './../dataSaver';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { useReactToPrint } from "react-to-print";
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ValidationHeader from './validationHeader.js';

import { validateTabs } from './contractValidation';

import style from './index.module.scss';


// valueList={['ACTIVITY_BASED', 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET', 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET', 'SHIFT_OR_PER_DAY_BASED',]}
// labelList={['Activity Based', 'Fixed Amount for Timesheet Period WITH Offset Applied', 'Fixed Amount for Timesheet Period WITHOUT Offset Applied', 'Shift OR Per diem Based']}



const ActiveContract = ({ contractId, activeContractView, getActiveContractView }) => {
    const [contractData, setContractData] = useState();
    const [workflow, setWorkflow] = useState([]);
    const [contractUsers, setContractUsers] = useState([]);
    const componentRef = useRef(null);
    const continuationPolicy = { 'AUTORENEWAL': 'Auto Renewal', 'NEWCONTRACTONEXPIRATION': 'New Contract On Expiration', 'ONETIMECONTRACTTERMINATEONEXPIRATION': 'One Time Contract - Terminate On Expiration', 'WRITTENCONTRACTEXTENSIONFORFIXEDTERM': 'Extension By Mutual Written Signed Agreement' }
    const compensationPolicy = {'ACTIVITY_BASED':'Activity Based', 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET':'Fixed Amount for Timesheet Period WITH Offset Applied', 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET':'Fixed Amount for Timesheet Period WITHOUT Offset Applied', 'SHIFT_OR_PER_DAY_BASED':'Shift OR Per diem Based'}
    console.log('contract data', contractData);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Contract Validation Check Summary",
        removeAfterPrint: true
    });

    useEffect(() => {
        getContractData();
        getWorkflow();
        getContractUsers();
    }, [])

    const getContractUsers = async () => {
        const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
        setContractUsers(userData?.filter(data => data?.contracts?.filter(contract => contract?.id === contractId)?.map(data => data?.roles?.roleName === 'Activity Logger'))?.map(data => data));
    }

    const getWorkflow = async () => {
        const { data: timesheetWorkFlow } = await GET('timesheet-management-service/workflow');
        setWorkflow(timesheetWorkFlow);
    }

    const getContractData = async () => {
        const { data: contractData } = await GET(`contract-managment-service/contracts/${contractId}`);
        if (contractData) {
            setContractData(contractData);
        }
    }

    const capitalizeFLetter = (string) => {
        console.log(string[0].toUpperCase() +
            string.slice(1));
    }

    console.log('contract users', contractUsers);
    return (
        <Dialog isOpen={getActiveContractView} onClose={() => getActiveContractView(false)} className={`${style.addServiceDialog} ${style.addManagerDialogBackground}`}>
            <div className={`${Classes.DIALOG_BODY} `} ref={componentRef}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>{contractData?.contractName?.contractName}</p>
                    <div className={style.displayInRow}>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={() => {
                            // handlePrint()

                        }
                        }>
                            <PrintOutlinedIcon style={{ color: "#7165E3" }} />
                        </div>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getActiveContractView(false)} />
                    </div>
                </div>
                <div className={style.extensionBorder}></div>

                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACT IDENTIFICATION & TERM LIMIT'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Contract Id</div>
                            <div className={style.statusText}>{contractData?.contractDetail?.contractId?.id}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Contract Manager</div>
                            <div className={style.statusText}>{contractData?.contractDetail?.contractManager?.name?.firstName}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Site/s</div>
                            <div className={style.statusText}>{contractData?.contractDetail?.site?.sites?.map(data => data?.siteName?.siteName)?.join(', ')}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Department/s</div>
                            <div className={style.statusText}>FAIL</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Contract Start Date</div>
                            <div className={style.statusText}>{contractData?.contractDetail?.contractTerm?.startDate}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Contract End Date</div>
                            <div className={style.statusText}>{contractData?.contractDetail?.contractTerm?.endDate}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Contract Effective Date</div>
                            <div className={style.statusText}>{contractData?.contractDetail?.contractTerm?.effectiveDate}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Contract Time Commitment / Frequency</div>
                            <div className={style.statusText}>{contractData?.contractDetail?.timeCommitment?.value} / {contractData?.contractDetail?.timeCommitment?.frequency}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Compensation Policy</div>
                            <div className={style.statusText}>{compensationPolicy[contractData?.contractDetail?.compensationPolicy]}</div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={style.validationTopicText}>Contract Continuation Policy</div>
                            <div className={style.statusText}>{continuationPolicy[contractData?.contractDetail?.continuationPolicy?.contractPolicyType]}</div>
                        </div>
                    </div>
                    <div className={style.validationPadding}>

                    </div>
                </div>



                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACTED SERVICE PROVIDER(S)'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        {
                            contractUsers?.map(data => (
                                <div className={style.marginTop20}>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Contractor Name</div>
                                        <div className={style.statusText}>{data?.name?.firstName} {data?.name?.middleName ?? ''} {data?.name?.lastName ?? ''}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Service provider Type</div>
                                        <div className={style.statusText}>{data?.serviceProviderType?.contractedServiceProviderType}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>NPIN</div>
                                        <div className={style.statusText}>{data?.npin?.missing ? 'Missing' : data?.npin?.notApplicable ? 'Not Applicable' : data?.npin?.npin}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Suffix</div>
                                        <div className={style.statusText}>{data?.name?.suffix?.suffix}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Email</div>
                                        <div className={style.statusText}>{data?.email?.officialEmail}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Cell Phone</div>
                                        <div className={style.statusText}>{data?.communication?.mobileNumberNotApplicable ? 'Not Applicable' : data?.communication?.mobileNumber}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Address Line</div>
                                        <div className={style.statusText}>{data?.address?.addressLine}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>City</div>
                                        <div className={style.statusText}>{data?.address?.city}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>State</div>
                                        <div className={style.statusText}>{data?.address?.state}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Zipcode</div>
                                        <div className={style.statusText}>{data?.address?.zipcode}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Site Level Responsibility</div>
                                        <div className={style.statusText}>{contractData?.contractorBusinessEntity?.businessEntityUser?.name?.firstName} {contractData?.contractorBusinessEntity?.businessEntityUser?.name?.middleName ?? ''} {contractData?.contractorBusinessEntity?.businessEntityUser?.name?.lastName ?? ''}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Department Level Responsibility</div>
                                        <div className={style.statusText}>{contractData?.contractorBusinessEntity?.businessEntityUser?.name?.firstName} {contractData?.contractorBusinessEntity?.businessEntityUser?.name?.middleName ?? ''} {contractData?.contractorBusinessEntity?.businessEntityUser?.name?.lastName ?? ''}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Contractors Roles</div>
                                        <div className={style.statusText}>{data?.roles?.map(data => data?.roleName)?.join(', ')}</div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>

                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACTOR BUSINESS ENTITY'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Business Entity User Name</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.businessEntityUser?.name?.firstName} {contractData?.contractorBusinessEntity?.businessEntityUser?.name?.middleName ?? ''} {contractData?.contractorBusinessEntity?.businessEntityUser?.name?.lastName ?? ''}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Business Point of Contact</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.businessEntityUser?.email?.officialEmail}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Business Entity Name</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.businessEntity?.notApplicable ? 'Not Applicable' : contractData?.contractorBusinessEntity?.businessEntity?.name}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Vendor NPIN</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.contractorNPIN?.notApplicable ? 'Not Applicable' : contractData?.contractorBusinessEntity?.contractorNPIN?.missing ? 'Missing' : contractData?.contractorBusinessEntity?.contractorNPIN?.npin}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Vendor Tax Id</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.contractorEntityTaxId?.notApplicable ? 'Not Applicable' : contractData?.contractorBusinessEntity?.contractorEntityTaxId?.missing ? 'Missing' : contractData?.contractorBusinessEntity?.contractorEntityTaxId?.taxId}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Phone</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.businessEntityUser?.contactNumber?.missing ? 'Missing' : contractData?.contractorBusinessEntity?.businessEntityUser?.contactNumber?.number}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Adress Line</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.mailingAddress?.addressLine}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>City</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.mailingAddress?.city}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>State</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.mailingAddress?.state}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Zipcode</div>
                            <div className={style.statusText}>{contractData?.contractorBusinessEntity?.mailingAddress?.zipcode}</div>
                        </div>
                    </div>
                </div>

                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTARCTED SERVICES'} result={"PASS"} />
                    <div className={style.validationPadding}>
                        {
                            contractData?.contractedServices?.map(service => (
                                <div className={style.marginTop20}>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Service Type Contracted For</div>
                                        <div className={style.statusText}>{service?.activityType?.activityType}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Site/(s)</div>
                                        <div className={style.statusText}>{service?.sites?.map(site => (<p>{site?.siteName?.siteName}</p>))}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Department/(s)</div>
                                        <div className={style.statusText}>{service?.sites?.map(site => site?.departmentList?.departments?.map(dept => (<p>{dept?.deaprtmentName?.name}</p>)))}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Activities To Be performed</div>
                                        <div className={style.statusText}>{service?.activities?.map(activity => (<p>{activity?.activity}</p>))}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Service Facility / Location(Cost Center)</div>
                                        <div className={style.statusText}>{service?.serviceLocations?.map(location => (<p>{location?.location}</p>))}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Regular Service Schedule</div>
                                        <div className={style.statusText}>{service?.contractedSchedules?.map(schedule => (<p>{schedule?.minimum?.value} - {schedule?.maximum?.value} / {schedule?.frequency}</p>))}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Patient Seen target</div>
                                        <div className={style.statusText}>{service?.patientSeenTarget?.map(patientTarget => (<p>{patientTarget?.noTargetApplicable ? 'No Target Applicable' : `With Nurse ${patientTarget?.withNurse?.value} - Without Nurse ${patientTarget?.withoutNurse?.value}`}</p>))}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Scheduled Patient Target</div>
                                        <div className={style.statusText}>{service?.scheduledPatientsTargets?.map(patientTarget => (<p>{patientTarget?.noTargetApplicable ? 'No Target Applicable' : `With Nurse ${patientTarget?.withNurse?.value} - Without Nurse ${patientTarget?.withoutNurse?.value}`}</p>))}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Additional Schedule</div>
                                        <div className={style.statusText}>{service?.additionalSchedule?.scheduleRequired ? `${service?.additionalSchedule?.value} - ${service?.additionalSchedule?.frequency}` : 'Not Required'}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Billable Service</div>
                                        <div className={style.statusText}>{service?.billableService ? 'YES' : 'NO'}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Service Session Duration</div>
                                        <div className={style.statusText}>{service?.duration?.hours}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Serice Session Payment Amount</div>
                                        <div className={style.statusText}>{service?.payableAmount?.value ?? ''}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Total Contracted Service Session</div>
                                        <div className={style.statusText}>{service?.totalSessions?.value} - {service?.totalSessions?.frequency}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Service Days</div>
                                        <div className={style.statusText}>{service?.serviceDays?.length > 0 && Object.keys(service?.serviceDays).find(key => service?.serviceDays[key] === true)}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Allowable Working Day Hours for Service</div>
                                        <div className={style.statusText}>{contractData?.paymentAndCompensation?.compensationBasis}</div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>

                <div className={style.marginTop20}>
                    <ValidationHeader heading={'TIMESHEET SUBMISSION TERMS'} result={"PASS"} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Number of timesheets</div>
                            <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.timesheetSubmissionServicesCount?.count}</div>
                        </div>
                        <div>

                            {
                                contractData?.timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(timesheet => (
                                    <div className={style.marginTop20}>
                                        <div className={style.spaceBetween}>
                                            <div className={style.validationTopicText}>Timesheet Label</div>
                                            <div className={style.statusText}>{timesheet?.timesheetLabel?.label}</div>
                                        </div>
                                        <div className={style.spaceBetween}>
                                            <div className={style.validationTopicText}>Contracted Activities to include in Timesheet</div>
                                            <div className={style.statusText}>{timesheet?.activities?.map(data => <p>{data?.activityType?.activityType} - {data?.performingActivity?.activity}</p>)}</div>
                                        </div>
                                        <div className={style.spaceBetween}>
                                            <div className={style.validationTopicText}>Payment Source</div>
                                            <div className={style.statusText}>{timesheet?.paymentSource?.site?.siteName?.siteName} - {timesheet?.paymentSource?.site?.departments?.[0]?.departmentName?.name ?? ''}</div>
                                        </div>
                                        <div className={style.spaceBetween}>
                                            <div className={style.validationTopicText}>Service Log Period</div>
                                            <div className={style.statusText}>{timesheet?.servicePeriod?.value}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className={style.marginTop20}>
                            <div className={style.spaceBetween}>
                                <div className={style.validationTopicText}>Planned Absence Notification Days Limit</div>
                                <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.plannedAbsenceLimit?.days}</div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={style.validationTopicText}>Maximum Unplanned Absence Days Allowed</div>
                                <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.maximumAbsenceAllowed?.days}</div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={style.validationTopicText}>Invoice Processing Day Range Goal</div>
                                <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.invoiceProcessing?.days}</div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={style.validationTopicText}>Threshold</div>
                                <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.invoiceProcessing?.threshold}</div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={style.validationTopicText}>Goal</div>
                                <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.invoiceProcessing?.goal}</div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={style.validationTopicText}>Day Limit For Submission Of Timesheet Based On Activity Service Date</div>
                                <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.dayLimit?.activityServiceDate?.days}</div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={style.validationTopicText}>Day Limit For Submission Of Timesheet Based On Contract End Date</div>
                                <div className={style.statusText}>{contractData?.timesheetSubmissionTerms?.dayLimit?.contractEndDate?.days}</div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={style.marginTop20}>
                    <ValidationHeader heading={'PAYMENT AND COMPENSATION'} result={"PASS"} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Compensation Basis</div>
                            <div className={style.statusText}>{contractData?.paymentAndCompensation?.compensationBasis}</div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Dollar Hourly Rate</div>
                            <div className={style.statusText}>{contractData?.paymentAndCompensation?.dollarRate?.notApplicable ? 'Not Applicable' : contractData?.paymentAndCompensation?.dollarRate?.hour}</div>
                        </div>
                        {
                            contractData?.paymentAndCompensation?.compensationBasis === "RVUBASED" && (
                                <div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>RVU Quantity</div>
                                        <div className={style.statusText}>{contractData?.paymentAndCompensation?.rvuQuantity}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>FTE Equivalent</div>
                                        <div className={style.statusText}>{contractData?.paymentAndCompensation?.fteEquivalent}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>RVU Reference Used</div>
                                        <div className={style.statusText}>{contractData?.paymentAndCompensation?.rvuReferenceUsed}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>RVU Quantity Variance</div>
                                        <div className={style.statusText}>{contractData?.paymentAndCompensation?.rvuQuantityVariance}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>RVU Quantity Period</div>
                                        <div className={style.statusText}>{contractData?.paymentAndCompensation?.rvuQuantityPeriod}</div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            contractData?.paymentAndCompensation?.timesheetPayments?.map(data => (
                                <div className={style.marginTop20}>

                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Timesheet Name</div>
                                        <div className={style.statusText}>{data?.timesheetLabel?.label}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Payment Based On Fixed Hours Vs Actual</div>
                                        <div className={style.statusText}>{data?.paymentBasedonFixedHoursVsActual ? 'YES' : 'NO'}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Fixed Compensation Value Per Timesheet Submission</div>
                                        <div className={style.statusText}>{data?.maxPaymentPerTimesheetSubmission}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Compensation Offset Criteria For Reduced Number Of Agreed To Services.</div>
                                        <div className={style.statusText}>{data?.reducedNumberOfServices}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Max. Compensation Value for Contract Period</div>
                                        <div className={style.statusText}>{data?.maxPaymentPerContract}</div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Compensation Offset Criteria For Providing Additional Services to the Agreed to services.</div>
                                        <div className={style.statusText}>{data?.providingAdditionalServices}</div>
                                    </div>
                                </div>
                            ))
                        }


                    </div>
                </div>

                <div className={style.marginTop20}>
                    <ValidationHeader heading={'TIMESHEET PROCESSING WORKFLOW'} result={"PASS"} />
                    <div className={style.validationPadding}>
                        {
                            contractData?.workFlowDetails?.map(data => (
                                <div className={style.marginTop20}>
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>Timesheet Label</div>
                                        <div className={style.statusText}>{data?.timesheetLabel?.label}</div>
                                    </div>
                                    {
                                        <div>
                                            {
                                                workflow?.filter(workflowData => workflowData?.id === data?.workFlow?.id)?.map(data =>
                                                    <div>
                                                        <div>
                                                            {
                                                                data?.workFlowMap?.workflow?.['1'] &&
                                                                <div className={style.spaceBetween}>
                                                                    <div className={style.validationTopicText}>Timesheet {data?.workFlowMap?.workflow?.['1']?.workFlowStatus?.status === 'APPROVED' ? 'Approver' : data?.workFlowMap?.workflow?.['1']?.workFlowStatus?.status === 'REVIEWED' ? 'Reviewer' : 'Aggregator'}</div>
                                                                    <div className={style.statusText}>{data?.workFlowMap?.workflow?.['1']?.workFlowUser?.name?.name}</div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                data?.workFlowMap?.workflow?.['2'] &&
                                                                <div className={style.spaceBetween}>
                                                                    <div className={style.validationTopicText}>Timesheet {data?.workFlowMap?.workflow?.['2']?.workFlowStatus?.status === 'APPROVED' ? 'Approver' : data?.workFlowMap?.workflow?.['2']?.workFlowStatus?.status === 'REVIEWED' ? 'Reviewer' : 'Aggregator'}</div>
                                                                    <div className={style.statusText}>{data?.workFlowMap?.workflow?.['2']?.workFlowUser?.name?.name}</div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                data?.workFlowMap?.workflow?.['3'] &&
                                                                <div className={style.spaceBetween}>
                                                                    <div className={style.validationTopicText}>Timesheet {data?.workFlowMap?.workflow?.['3']?.workFlowStatus?.status === 'APPROVED' ? 'Approver' : data?.workFlowMap?.workflow?.['3']?.workFlowStatus?.status === 'REVIEWED' ? 'Reviewer' : 'Aggregator'}</div>
                                                                    <div className={style.statusText}>{data?.workFlowMap?.workflow?.['3']?.workFlowUser?.name?.name}</div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>

                                                )





                                            }
                                        </div>
                                    }
                                </div>
                            ))
                        }

                    </div>
                </div>



                {/* <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.cloneOutlinedButton} ${style.buttonHeight40}`} onClick={() => getContractValidationDialog(false)}>CANCEL</button>
                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.buttonHeight40}`} onClick={() => getContractValidationDialog(false)}>OK</button>
                </div> */}
            </div>
        </Dialog>
    )
}


export default ActiveContract;