import React, { useState, useEffect } from 'react';
import { GET } from './../dataSaver';
import Tile from '../../Components/Tile';
import Table from '../../Components/TableDesign';
import LevelTwoHeader from '../../Components/LevelTwoHeader';

import style from './index.module.scss';

const DataUpload = ({getSelectedOption}) => {
    const [activitiesFileMeta, setActivitiesFileMeta] = useState([]);
    const [selectedContract, setSelectedContract] = useState('FILE PROCESSED');
    const [activitiesFileMetaSummary, setActivitiesFileMetaSummary] = useState({});
    const [viewActiveFiles, setViewActiveFiles] = useState(true);

    useEffect(() => {
        getActivitiesFileMeta();
        getActivitiesFileMetaSummary();
    }, [])

    const getActivitiesFileMeta = async () => {
        const { data: activitiesFileMeta } = await GET('data-manager-service/activitiesFileMeta');
        setActivitiesFileMeta(activitiesFileMeta)
        console.log(activitiesFileMeta)
    };

    const getActivitiesFileMetaSummary = async () => {
        const { data: summary } = await GET('data-manager-service/activitiesFileMeta/summary');
        setActivitiesFileMetaSummary(summary)
        console.log(summary)
    };
    console.log(activitiesFileMetaSummary)
    const getSelectedContract = (value) => {
        setSelectedContract(value)
    }

    const getDownloadDialog = () => {

    }

    const getReprocessDialog = () => {
        
    }

    const onCloseLevel2 = () => {
        getSelectedOption('');
    }

    const tableHeaderValues = ["", "FILE ID", "FILE NAME", "SOURCE", "PROCESSING STATUS", "FAILURE REASON", "RECORD PROCESSED", "RECORD FAILED", "PROCESSIG DATE & TIME", "ACTION"];

    let dot = [];
    let fileId = [];
    let fileName = [];
    let source = [];
    let processingStatus = [];
    let failureReason = [];
    let recordProcessed = [];
    let recordFailed = [];
    let processingDateAndTime = [];
    let action = [];

    const getActiveFilesValues = () => {
         dot = [];
         fileId = [];
         fileName = [];
         source = [];
         processingStatus = [];
         failureReason = [];
         recordProcessed = [];
         recordFailed = [];
         processingDateAndTime = [];
         action = [];

         activitiesFileMeta?.map(data=> 
        {
            dot.push('green');
            fileId.push(data?.fileId);
            fileName.push(data?.fileName);
            source.push('-');
            processingStatus.push(data?.processingStatus);
            failureReason.push(data?.failureReason);
            recordProcessed.push(data?.recordProcessed);
            recordFailed.push(data?.recordFailed);
            processingDateAndTime.push(data?.processingDate)
            action.push(true)
        })

        return [
            {"type": "dot", "value": dot},
            {"type": "text", "value": fileId},
            {"type": "text", "value": fileName},
            {"type": "text", "value": source},
            {"type": "text", "value": processingStatus},
            {"type": "text", "value": failureReason},
            {"type": "text", "value": recordProcessed},
            {"type": "text", "value": recordFailed},
            {"type": "text", "value": processingDateAndTime},
            {"type": "action", "value": action},
        ];
    }

    const actionsData = [{'data': 'DOWNLOAD', 'onClick': getDownloadDialog, 'requiredValue': 'boolean'},
        {'data': 'REPROCESS', 'onClick': getReprocessDialog, 'requiredValue': 'boolean'}]

    return (
        <div>
            <LevelTwoHeader heading={'DATA UPLOAD MANAGER'} updatedTime={'UPDATED ON FEB 16, 2022 16:45 EST'} onCloseLevel2={onCloseLevel2} />
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="FILE PROCESSED" bigNumber={activitiesFileMetaSummary?.fileProcessed?.total} smallNum1={activitiesFileMetaSummary?.fileProcessed?.success} smallNum2={activitiesFileMetaSummary?.fileProcessed?.failure} smallText1="SUCCESSFUL" smallText2="FAIL" currentTile="FILE PROCESSED" topText='' />
                <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="RECORD PROCESSED" bigNumber={activitiesFileMetaSummary?.recordProcessed?.total} smallNum1={activitiesFileMetaSummary?.recordProcessed?.inProgress} smallNum2={activitiesFileMetaSummary?.recordProcessed?.complete} smallText1="IN PROGRESS" smallText2="COMPLETE" currentTile="RECORD PROCESSED" topText='' />
                <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="ACTIVE DATA SOURCES" bigNumber={2} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="ACTIVE DATA SOURCES" topText='' />
                <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="EXPIRED / TERMINATED" bigNumber={0} smallNum1="0" smallNum2="0" smallText1="EXPIRED" smallText2="TERMINATED" currentTile="expired or terminated" topText='LAST 30 DAYS' />
            </div>
            <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                <div className={style.buttonGroupUsers}>
                    <button className={viewActiveFiles && style.activeButton} onClick={() => setViewActiveFiles(true)}>ACTIVE FILES PROCESSED ON PRODUCTION ( 108 )</button>
                    <button className={!viewActiveFiles && style.activeButton} onClick={() => setViewActiveFiles(false)}>FILES FAILED TO PROCESS FOR UPLOAD ( 2 )</button>
                </div>
                <Table
                    tableHeaderValues={tableHeaderValues} 
                    tableDataValues={getActiveFilesValues()}
                    tableData={activitiesFileMeta}
                    getNewContract={() => {}}
                    getContractType={() => {}}
                    getSelectedContractType={() => {}}
                    getContractIdFromActive={() => {}}
                    gridStyle={style.activeContractGrid}
                    actions={actionsData}
                />
            </div>
        </div>
    )
}

export default DataUpload;