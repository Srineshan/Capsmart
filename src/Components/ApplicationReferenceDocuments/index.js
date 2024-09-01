import React, { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import style from './index.module.scss'
import { GET } from '../../Screens/dataSaver';

const ApplicationReferenceDocuments = () => {
    const [basicForm, setBasicForm] = useState({})
    const applicationId = '66d1cae19354e9022ad82027'

    useEffect(() => {
        getPreApplication()
    }, [])

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }
    return (
        <div className={style.referenceDocumentParentCard}>
            <div className={style.referenceDocumentTitle}>Your Reference Documents</div>
            {basicForm?.forms?.[0]?.data?.table?.map((data, index) => (
                <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`} key={index}>
                    <div className={style.fullWidth}>
                        <div className={style.spaceBetween}>
                            <div className={style.displayInRow}>
                                <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} onClick={() => window.open(data?.fileURL, '_blank')} />
                                <div className={style.documentNameStyle}>{data?.fileUploaded}</div>
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
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} />
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
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} />
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
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} />
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