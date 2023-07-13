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