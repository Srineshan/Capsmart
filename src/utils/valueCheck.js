export const valueCheck = (value) => {
    var result = false;
    if (value === null || value === undefined || value === [] || value === 0 || value === '0' || value === '') {
        result = true
    }
    return result;
}


