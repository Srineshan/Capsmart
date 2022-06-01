import React, { Fragment, useState } from 'react';
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

const Contracts = () => {
    const [selectedContract, setSelectedContract] = useState('active contract');
    const [addContract, setAddContract] = useState(false);
    const [extensionDialog, setExtensionDialog] = useState(false);
    const [terminationDialog, setTerminationDialog] = useState(false);
    const [deleteDraftDialog, setDeleteDraftDialog] = useState(false);
    const [contractActivationDialog, setContractActivationDialog] = useState(false);
    const [cloneDialog, setCloneDialog] = useState(false);
    const [newContractFromClone, setNewContractFromClone] = useState(false);

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

    return(
        addContract ? (
            <AddContract getAddContract={getAddContract} getNewContract={getNewContract} />
        ) : newContractFromClone ? (
            <NewContractFromClone getNewContract={getNewContract} />
        ) : (
            <Fragment> 
                <Navbar />
                {selectedContract === 'expired or terminated' ? (
                    <ExpiredOrTerminated getSelectedContract={getSelectedContract} 
                    getAddContract={getAddContract} />
                ) : selectedContract === 'draft' ? (
                    <Draft 
                    getSelectedContract={getSelectedContract} 
                    getDeleteDraftDialog={getDeleteDraftDialog} 
                    getContractActivationDialog={getContractActivationDialog}
                    getAddContract={getAddContract} />
                ) : selectedContract === 'upcoming renewals' ? (
                    <UpcomingRenewals getSelectedContract={getSelectedContract}
                    getAddContract={getAddContract} />
                ) : (
                    <ActiveContracts 
                    getSelectedContract={getSelectedContract} 
                    getAddContract={getAddContract} 
                    getExtensionDialog={getExtensionDialog} 
                    getTerminationDialog={getTerminationDialog} 
                    getCloneDialog={getCloneDialog}
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