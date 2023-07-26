import { CLINIC, SURGERY, ONCALL, SUPPLEMENTAL, ADDON, ADMINISTRATIVE, PROCEDUREREADING } from '../../Constants';


export const checkSiteAndDepartment = (contracts, site, contractId) => {
    console.log('inside check function', site)
    let conflictData = [];
    let siteId = [];
    let deptId = [];
    let selectedContract = contracts?.filter(contract => contract?.id === contractId)?.map(data => data)[0];
    site?.map(site => {
        siteId.push(site.id);
        site?.departmentList?.departments?.map(dept => {
            deptId.push(dept?.id);
        })
    })
    selectedContract?.contractedServices?.map(services => {
        if (services?.sites?.filter(site => !siteId.includes(site?.id))?.map(site => site)?.length) {
            conflictData.push({ type: 'Contracted Service with Missing Site', data: services.activities?.map(activities => activities.activity)?.length !== 0 ? `${services.activityType?.activityType} (${services.activities?.map(activities => activities.activity)?.join(',')})` : services.activityType?.activityType, missingData: services?.sites?.filter(site => !siteId.includes(site?.id))?.map(site => site?.siteName?.siteName)[0] })
        }
        console.log('service level', services);
        services?.sites?.map(site => {
            console.log('inside site level', site);
            site?.departmentList?.departments?.map(dept => {
                console.log('department', dept);
                if (!deptId.includes(dept.id)) {
                    console.log('inside the condition', dept.id)
                    conflictData.push({ type: 'Contracted Service with Missing Department', data: services.activities?.map(activities => activities.activity)?.length !== 0 ? `${services.activityType?.activityType} (${services.activities?.map(activities => activities.activity)?.join(',')})` : services.activityType?.activityType, missingData: dept?.departmentName?.name })
                }
            })
        })
    })
    selectedContract?.timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data => {
        if (!siteId.includes(data.paymentSource?.site?.id)) {
            conflictData.push({ type: 'Timesheet Submission Terms With Missing Site', data: data.timesheetLabel.label, missingData: data.paymentSource?.site?.siteName?.siteName })
        }
        data.paymentSource?.site?.departmentList?.departments?.map(dept => {
            if (!deptId.includes(dept.id)) {
                conflictData.push({ type: 'Timesheet Submission Terms With Missing Department', data: data.timesheetLabel.label, missingData: dept?.departmentName?.name })
            }
        })
    })
    return conflictData;
}

function areEqual(array1, array2) {
    if (array1?.length === array2?.length) {
        return array1.every((element, index) => {
            if (element === array2[index]) {
                return true;
            }

            return false;
        });
    }

    return false;
}

export const checkActivityChange = (existingServices, selectedService) => {
    let conflictedData = [];
    let otherPlaces = [];
    try {
        otherPlaces = existingServices?.filter(data => data?.activityResponse?.dataMap?.selectedActivityId === selectedService?.refId)?.map(data => data);
        console.log('other places', otherPlaces);
        existingServices?.filter(data => data?.hoursBorrowed?.activityType?.activityType === selectedService?.activityType?.activityType)?.map(data => {
            console.log('check data', data?.hoursBorrowed?.performingActivity?.activity);
            console.log('conflict data', selectedService?.activities?.map(activity => activity?.activity), data?.hoursBorrowed?.performingActivity?.activity?.toString()?.split(', '));
            if (areEqual(selectedService?.activities?.map(activity => activity?.activity), data?.hoursBorrowed?.performingActivity?.activity?.toString()?.split(', '))) {
                console.log('inside if pass');
                conflictedData?.push({ type: data?.activityTypeTemplate?.activityTypeTemplate, data: 'Activities To Be Performed', missingData: data?.hoursBorrowed?.performingActivity?.activity, id: data?.refId })
            }
            if (otherPlaces?.length !== 0) {
                otherPlaces?.map(data => {
                    if (!conflictedData?.map(data => data?.id).includes(data.refId))
                        conflictedData?.push({ type: data?.activityTypeTemplate?.activityTypeTemplate, data: 'Activities To Be Performed', missingData: data?.performingActivity?.activity, id: data.refId })
                })

            }
        });

    } catch (e) {
        console.log('error', e)
    }

    return conflictedData;
}