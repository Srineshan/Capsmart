export const valueCheck = (value) => {
    var result = false;
    // eslint-disable-next-line no-mixed-operators
    if ((value === null || value === undefined || Array.isArray(value) && value.length === 0 || value === 0 || value === '0' || value === '')) {
        result = true
    }
    return result;
}


