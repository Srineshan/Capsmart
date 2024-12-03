import React, { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import style from './index.module.scss'
import { GET } from '../../Screens/dataSaver';
import { useParams } from 'react-router-dom';

const ApplicationReferenceDocuments = () => {
    const [basicForm, setBasicForm] = useState({})
    const applicationId = sessionStorage.getItem('applicationId')
    const [formIndex, setFormIndex] = useState();
    useEffect(() => {
        getPreApplication()
    }, [])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc'))
    }, [basicForm])

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }

    console.log(basicForm?.forms?.[formIndex]?.data?.table, formIndex)
    return (
        <div className={style.referenceDocumentParentCard}>
            <div className={style.referenceDocumentTitle}>Your Reappointment Documents</div>
            {basicForm?.forms?.[formIndex]?.data?.table?.map((data, index) => (
                <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`} key={index}>
                    <div className={style.fullWidth}>
                        <div className={style.spaceBetween}>
                            <div className={style.displayInRow}>
                                <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#2C2C2C' }} onClick={() => window.open(data?.fileURL, '_blank')} />
                                <div className={style.documentNameStyle}>{data?.documentType}</div>
                            </div>
                            <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                                <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {/* <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#2C2C2C' }} />
                            <div className={style.documentNameStyle}>Document Name</div>
                        </div>
                        <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                            <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#2C2C2C' }} />
                            <div className={style.documentNameStyle}>Document Name</div>
                        </div>
                        <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                            <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#2C2C2C' }} />
                            <div className={style.documentNameStyle}>Document Name</div>
                        </div>
                        <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                            <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default ApplicationReferenceDocuments;