export const SpecifiedCountCalculator = (contractedSchedules, timeCommitment, additionalFreq, additionalValue) => {
    let temp = contractedSchedules;
    let schedulesTotal = 0;
    temp?.map(data => {
        if (data?.frequency === timeCommitment?.frequency) {
            schedulesTotal = schedulesTotal + ((data?.minimum?.value || 0) * (timeCommitment?.value || 0));
        } else {
            if (data?.frequency === 'WEEK') {
                schedulesTotal = schedulesTotal + ((data?.minimum?.value || 0) * 52);
            } else if (data?.frequency === 'CONTRACT_YEAR') {
                schedulesTotal = schedulesTotal + (data?.minimum?.value || 0);
            }
            else {
                schedulesTotal = schedulesTotal + ((data?.minimum?.value || 0) * 12);
            }
        }
    })
    if (additionalFreq !== undefined) {
        if (additionalFreq === 'WEEK') {
            schedulesTotal = schedulesTotal + ((additionalValue || 0) * 52);
        } else if (additionalFreq === 'EVERY_OTHER_WEEK') {
            schedulesTotal = schedulesTotal + ((additionalValue || 0) * 26);
        } else if (additionalFreq === 'MONTH') {
            schedulesTotal = schedulesTotal + ((additionalValue || 0) * 12);
        } else if (additionalFreq === 'EVERY_OTHER_MONTH') {
            schedulesTotal = schedulesTotal + ((additionalValue || 0) * 6);
        } else {

        }
    }
    return schedulesTotal;
}