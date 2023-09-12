
export const valueCheck = (value) => {
    var result = false;
    console.log('method', method);
    if (createdContractId !== '') {
        console.log('inside put');
        if (value === null || value === undefined || value === [] || value === 0 || value === '0' || value === '') {
            console.log('inside if');
            result = true
        }
    }
    return result;
}