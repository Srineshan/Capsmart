import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import { GET, PUT, POST, TenantID } from '../dataSaver';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from './newActiveApplication';
import { format, subYears } from "date-fns";

const StaffApplication = () => {
    const [selectedContract, setSelectedContract] = useState('Applicants');
    const [addContract, setAddContract] = useState(false);
    const [extensionDialog, setExtensionDialog] = useState(false);
    const [terminationDialog, setTerminationDialog] = useState(false);
    const [deleteDraftDialog, setDeleteDraftDialog] = useState(false);
    const [contractActivationDialog, setContractActivationDialog] = useState(false);
    const [cloneDialog, setCloneDialog] = useState(false);
    const [newContractFromClone, setNewContractFromClone] = useState(false);
    const [contractType, setContractType] = useState({ id: '', value: '' });
    const [selectedContractType, setSelectedContractType] = useState('');
    const [contracts, setContracts] = useState([]);
    const [contractId, setContractId] = useState('');
    const [method, setMethod] = useState('');
    const [users, setUsers] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isEditable, setIsEditable] = useState(false);
    const [activeContractView, setActiveContractView] = useState(false);
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedContractTypeFilter, setSelectedContractTypeFilter] = useState([]);
    const [selectedContractPolicyTypeFilter, setSelectedContractPolicyTypeFilter] = useState([]);
    const [selectedCompensationPolicyFilter, setSelectedCompensationPolicyFilter] = useState([]);
    const [selectedContractManagersFilter, setSelectedContractManagersFilter] = useState([]);
    const [contractIdFilter, setContractIdFilter] = useState('');
    const [minNumberOfContractors, setMinNumberOfContractors] = useState(0);
    const [maxNumberOfContractors, setMaxNumberOfContractors] = useState(99999);
    const [startDate, setStartDate] = useState(subYears(new Date(), 5));
    const [endDate, setEndDate] = useState(new Date());
    const [contractExpiresInDays, setContractExpiresInDays] = useState(0)
    const [sortField, setSortField] = useState('DEFAULT');
    const [sortValue, setSortValue] = useState('ASCENDING');
    const [tabFilter, setTabFilter] = useState('');

    const availableSmallTextValues = {
        'AUTO RENEWED': 'autorenewed',
        'EXPIRING IN 30 DAYS': 'expiringinthirtydays',
        'ACTIVATION READY': 'activationready',
        'ACTIVATION PAST DUE': 'activationpastdue',
        'EXTENSION REQUIRED': 'extentionrequired',
        'NEW CONTRACT REQUIRED': 'newcontractrequired',
        'EXPIRED': 'expired',
        'TERMINATED': 'terminated'
    }

    useEffect(() => {
        getContracts();
        getUserData();
        setIsEditable(sessionStorage.getItem('isEditable') === 'true' ? true : false);
    }, [])

    useEffect(() => {
        getContracts();
    }, [selectedContract, searchKey, page, newContractFromClone, totalCount, selectedContractTypeFilter, selectedCompensationPolicyFilter, selectedContractPolicyTypeFilter, selectedContractManagersFilter, contractIdFilter,
        minNumberOfContractors, maxNumberOfContractors, startDate, endDate, contractExpiresInDays, sortField, sortValue, tabFilter])

    useEffect(() => {
        sessionStorage.setItem('isEditable', selectedContract !== 'draft' ? false : true)
        sessionStorage.removeItem('bottomFilter')
    }, [selectedContract])

    useEffect(() => {
        setIsEditable(sessionStorage.getItem('isEditable') === 'true' ? true : false);
    }, [sessionStorage?.getItem('isEditable')])

    const getSelectedContract = (value) => {
        setSearchKey("");
        setSelectedContract(value);
        setPage(1);
    }

    const getTabFilter = (value) => {
        console.log(value, 'filter')
        setTabFilter(value)
    }

    console.log('filter', tabFilter)

    const getContractIdFromActive = (value) => {
        setContractId(value);
    }

    const getAddContract = (value, isNext = false) => {
        setAddContract(value);
        console.log('next', isNext, typeof isNext);
        if (!isNext) {
            console.log('inside', isNext);
            sessionStorage.setItem('isEditable', value);
        }
    }

    const getExtensionDialog = (value) => {
        setExtensionDialog(value);
    }

    const getTerminationDialog = (value) => {
        setTerminationDialog(value);
    }

    const getCloneDialog = (value) => {
        setCloneDialog(value);
    }

    const getNewContract = (value) => {
        setNewContractFromClone(value);
    }

    const getActiveContractView = (value) => {
        setActiveContractView(value);
    }

    const getActiveApplicationView = (value) => {
        setActiveApplicationView(value);
    }

    const getDeleteDraftDialog = (value) => {
        setDeleteDraftDialog(value);
    }

    const getContractActivationDialog = (value) => {
        setContractActivationDialog(value);
    }

    const getContractType = (id, value) => {
        setContractType({ id: id, value: value });
    }

    const getSelectedContractType = (value) => {
        setSelectedContractType(value);
    }

    const getSearchKey = (value) => {
        setSearchKey(value);
    }

    const getContracts = async () => {
        setIsLoading(true);
        let apiUrl = `contract-managment-service/contracts?limit=${10}&offset=${page - 1}&searchText=${searchKey}&tab=${tabFilter?.smallTextSelected !== '' ? availableSmallTextValues[tabFilter?.smallTextSelected] : selectedContract}&contractType=${selectedContractTypeFilter}&compensationPolicy=${selectedCompensationPolicyFilter}&contractPolicyType=${selectedContractPolicyTypeFilter}&contractManagerId=${selectedContractManagersFilter}&contractId=${contractIdFilter !== undefined ? contractIdFilter : ''}&minimumNoOfContractors=${minNumberOfContractors !== undefined ? minNumberOfContractors : 0}&maximumNoOfContractors=${maxNumberOfContractors !== undefined ? maxNumberOfContractors : 99}&contractExpireInDays=${contractExpiresInDays !== undefined ? contractExpiresInDays : 0}&sortBy=${sortValue}&sortByField=${sortField}`
        if (tabFilter?.bottomTextFilter !== 'undefined') {
            apiUrl += `&noOfDays=${tabFilter?.bottomTextFilter !== 'undefined' ? tabFilter?.bottomTextFilter : ''}`
        }
        if (startDate !== null) {
            apiUrl += `&startDate=${format(new Date(startDate || new Date()), 'yyyy-MM-dd')}&endDate=${format(new Date(endDate || new Date()), 'yyyy-MM-dd')}`
        }
        const { data: contracts } = await GET(apiUrl);
        setContracts(contracts?.contractList);
        setTotalCount(contracts?.numberOfElements);
        setIsLoading(false);
    };

    const getUserData = async () => {
        const { data: userData } = await GET(`user-management-service/user`);
        if (userData) {
            setUsers(userData);
        }
    }

    const getMethod = (value) => {
        setMethod(value);
    }

    const getSelectedPage = (value) => {
        setPage(value);
    }

    const getFilterValues = (value) => {
        console.log('value', value)
        setSelectedContractTypeFilter(value?.selectedContractType)
        setSelectedContractPolicyTypeFilter(value?.selectedContractPolicyType)
        setSelectedCompensationPolicyFilter(value?.selectedCompensationPolicy)
        setSelectedContractManagersFilter(value?.selectedContractManagers)
        setContractIdFilter(value?.contractId)
        setMaxNumberOfContractors(value?.maxNumberOfContractors)
        setMinNumberOfContractors(value?.minNumberOfContractors)
        setStartDate(value?.startDate)
        setEndDate(value?.endDate)
        setContractExpiresInDays(value?.contractExpireInDays)
    }

    const getHandleSort = (value, sortBy) => {
        if (sortBy === 'ASCENDING') {
            setSortField(value)
            setSortValue('DESCENDING')
        } else if (sortBy === 'DESCENDING') {
            setSortField('DEFAULT')
            setSortValue('ASCENDING')
        } else if (sortBy === 'NONE') {
            setSortField(value)
            setSortValue('ASCENDING')
        }
    }


    // if (isLoading) {
    //     return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />;
    // }

    return (
        activeApplicationView ? (
            <NewActiveApplication getActiveApplicationView={getActiveApplicationView} />
        ) : (
            <Fragment>
                <Navbar />
                <StaffApplicationList
                    isLoading={isLoading}
                    getDeleteDraftDialog={getDeleteDraftDialog}
                    getContractActivationDialog={getContractActivationDialog}
                    getSelectedContract={getSelectedContract}
                    getAddContract={getAddContract}
                    getExtensionDialog={getExtensionDialog}
                    getTerminationDialog={getTerminationDialog}
                    getCloneDialog={getCloneDialog}
                    contracts={contracts}
                    getNewContract={getNewContract}
                    getContractType={getContractType}
                    getSelectedContractType={getSelectedContractType}
                    getContractIdFromActive={getContractIdFromActive}
                    getContracts={getContracts}
                    selectedContract={selectedContract}
                    users={users}
                    getSearchKey={getSearchKey}
                    getSelectedPage={getSelectedPage}
                    totalCount={totalCount}
                    page={page}
                    getActiveContractView={getActiveContractView}
                    getActiveApplicationView={getActiveApplicationView}
                    searchKey={searchKey}
                    getFilterValues={getFilterValues}
                    getHandleSort={getHandleSort}
                    sortValue={{ sortBy: sortValue, sortByField: sortField }}
                    getTabFilter={getTabFilter}
                />
            </Fragment>
        )
    )
}

export default StaffApplication;
