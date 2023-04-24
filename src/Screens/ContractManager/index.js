import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './../../Components/Navbar';
import AddContract from './addContract';
import ContractExtension from './contractExtensionDialog';
import ContractTermination from './contractTerminationDialog';
import CloneAlert from './cloneAlert';
import './../../index.scss';
import NewContractFromClone from './newContractFromClone';
import DeleteDraftContract from './deleteDraftContract';
import ContractActivationRequest from './contractActivationRequest';
import { GET, PUT, POST, TenantID } from './../dataSaver';
import ContractList from './contractList';

const Contracts = () => {
    const [selectedContract, setSelectedContract] = useState('activecontracts');
    const [addContract, setAddContract] = useState(false);
    const [extensionDialog, setExtensionDialog] = useState(false);
    const [terminationDialog, setTerminationDialog] = useState(false);
    const [deleteDraftDialog, setDeleteDraftDialog] = useState(false);
    const [contractActivationDialog, setContractActivationDialog] = useState(false);
    const [cloneDialog, setCloneDialog] = useState(false);
    const [newContractFromClone, setNewContractFromClone] = useState(false);
    const [contractType, setContractType] = useState('');
    const [selectedContractType, setSelectedContractType] = useState('');
    const [contracts, setContracts] = useState([]);
    const [contractId, setContractId] = useState('');
    const [method, setMethod] = useState('');
    const [users, setUsers] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        if (window.location.pathname === '/app') {
            window.location.pathname = '/app/contracts';
        }
        getContracts();
        getUserData();
    }, [])

    useEffect(() => {
        getContracts();
    }, [selectedContract, searchKey, page])

    useEffect(() => {
        sessionStorage.setItem('isEditable', selectedContract === 'draft' ? true : false)
    }, [selectedContract])

    useEffect(() => {
        setIsEditable(sessionStorage.getItem('isEditable') === 'true' ? true : false);
    }, [sessionStorage?.getItem('isEditable')])

    const getSelectedContract = (value) => {
        setSelectedContract(value);
        setPage(1);
    }

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

    const getDeleteDraftDialog = (value) => {
        setDeleteDraftDialog(value);
    }

    const getContractActivationDialog = (value) => {
        setContractActivationDialog(value);
    }

    const getContractType = (value) => {
        setContractType(value);
    }

    const getSelectedContractType = (value) => {
        setSelectedContractType(value);
    }

    const getSearchKey = (value) => {
        setSearchKey(value);
    }

    const getContracts = async () => {
        const { data: contracts } = await GET(`contract-managment-service/contracts?limit=${10}&offset=${page - 1}&searchText=${searchKey}&tab=${selectedContract}`);
        setContracts(contracts?.contractList);
        setTotalCount(contracts?.numberOfElements);
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

    return (
        addContract ? (
            <AddContract getAddContract={getAddContract} getNewContract={getNewContract} getContractType={getContractType} getSelectedContractType={getSelectedContractType} getMethod={getMethod} />
        ) : newContractFromClone ? (
            <NewContractFromClone getNewContract={getNewContract} contractType={contractType} selectedContractType={selectedContractType} contractIdFromActive={contractId} getContractIdFromActive={getContractIdFromActive} method={method} contracts={contracts} isEditable={isEditable} selectedContract={selectedContract} />
        ) : (
            <Fragment>
                <Navbar />
                <ContractList
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
                />

                {extensionDialog && (
                    <ContractExtension getExtensionDialog={getExtensionDialog} contractId={contractId} contracts={contracts} />
                )}
                {terminationDialog && (
                    <ContractTermination getTerminationDialog={getTerminationDialog} contractId={contractId} contracts={contracts} getContracts={getContracts} />
                )}
                {cloneDialog && (
                    <CloneAlert getCloneDialog={getCloneDialog} getNewContract={getNewContract} />
                )}
                {deleteDraftDialog && (
                    <DeleteDraftContract getDeleteDraftDialog={getDeleteDraftDialog} />
                )}
                {contractActivationDialog && (
                    <ContractActivationRequest getContractActivationDialog={getContractActivationDialog} />
                )}
            </Fragment>
        )
    )
}

export default Contracts;
