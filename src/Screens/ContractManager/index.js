import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './../../Components/Navbar';
import ActiveContracts from './activeContracts';
import AddContract from './addContract';
import ContractExtension from './contractExtensionDialog';
import ContractTermination from './contractTerminationDialog';
import Draft from './draft';
import CloneAlert from './cloneAlert';
import ExpiredOrTerminated from './expiredOrTerminated';
import UpcomingRenewals from './upcomingRenewals';
import './../../index.scss';
import NewContractFromClone from './newContractFromClone';
import DeleteDraftContract from './deleteDraftContract';
import ContractActivationRequest from './contractActivationRequest';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const Contracts = () => {
    const [selectedContract, setSelectedContract] = useState('active contract');
    const [addContract, setAddContract] = useState(false);
    const [extensionDialog, setExtensionDialog] = useState(false);
    const [terminationDialog, setTerminationDialog] = useState(false);
    const [deleteDraftDialog, setDeleteDraftDialog] = useState(false);
    const [contractActivationDialog, setContractActivationDialog] = useState(false);
    const [cloneDialog, setCloneDialog] = useState(false);
    const [newContractFromClone, setNewContractFromClone] = useState(false);
    const [contractType, setContractType] = useState('');
    const [selectedContractType,setSelectedContractType] = useState('');
    const [contracts, setContracts] = useState([]);
    const [draftContracts, setDraftContracts] = useState([]);
    const [activeContracts, setActiveContracts] = useState([]);
    const [upcomingContracts, setUpcomingContracts] = useState([]);
    const [expiredContracts, setExpiredContracts] = useState([]);

    const getSelectedContract = (value) => {
        setSelectedContract(value);
    }

    const getAddContract = (value) => {
        setAddContract(value);
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

    const getContracts = async() => {
        const {data: contracts} = await GET(`contract-managment-service/contracts`);
        setContracts(contracts);
    };

    useEffect(()=>{
        setDraftContracts(contracts?.filter(data => data?.contractStatus === "DRAFT")?.map(data => data));
        setActiveContracts(contracts?.filter(data => data?.contractStatus === "ACTIVE")?.map(data => data));
        setUpcomingContracts(contracts?.filter(data => data?.contractStatus === "UPCOMING")?.map(data => data));
        setExpiredContracts(contracts?.filter(data => data?.contractStatus === "EXPIRED")?.map(data => data));
    },[contracts])

    useEffect(()=>{
        getContracts();
    },[])

    return(
        addContract ? (
            <AddContract getAddContract={getAddContract} getNewContract={getNewContract} getContractType={getContractType} getSelectedContractType={getSelectedContractType}/>
        ) : newContractFromClone ? (
            <NewContractFromClone getNewContract={getNewContract} contractType={contractType} selectedContractType={selectedContractType}/>
        ) : (
            <Fragment>
                <Navbar />
                {selectedContract === 'expired or terminated' ? (
                    <ExpiredOrTerminated getSelectedContract={getSelectedContract}
                    getAddContract={getAddContract}
                    expiredContracts={expiredContracts} />
                ) : selectedContract === 'draft' ? (
                    <Draft
                    getSelectedContract={getSelectedContract}
                    getDeleteDraftDialog={getDeleteDraftDialog}
                    getContractActivationDialog={getContractActivationDialog}
                    getAddContract={getAddContract}
                    draftContracts={draftContracts} />
                ) : selectedContract === 'upcoming renewals' ? (
                    <UpcomingRenewals getSelectedContract={getSelectedContract}
                    getAddContract={getAddContract}
                    upcomingContracts={upcomingContracts} />
                ) : (
                    <ActiveContracts
                    getSelectedContract={getSelectedContract}
                    getAddContract={getAddContract}
                    getExtensionDialog={getExtensionDialog}
                    getTerminationDialog={getTerminationDialog}
                    getCloneDialog={getCloneDialog}
                    activeContracts={activeContracts}
                     />
                )}
                {extensionDialog && (
                    <ContractExtension getExtensionDialog={getExtensionDialog} />
                )}
                {terminationDialog && (
                    <ContractTermination getTerminationDialog={getTerminationDialog} />
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
