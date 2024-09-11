import React, { useEffect, useState, useRef } from 'react';
import { GET, PUT } from '../dataSaver';
import { KeyboardReturnRounded } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import Cookie from 'universal-cookie';
import style from './index.module.scss';
import jwt from 'jwt-decode';
import CircularProgress from "@mui/material/CircularProgress";

const Applicant = () => {
    const navigate = useNavigate()
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const [userId, setUserId] = useState(user?.id);

    const [applicationForms, setApplicationForms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getApplications();
    }, [])

    const getApplications = async () => {
        setIsLoading(true);
        const { data: applications } = await GET(
            `application-management-service/application?applicantId=${userId}`
        );
        if (applications) {
            navigate(`applicationForm/${applications?.[0]?.id}`)
            setIsLoading(false);
        }
        // setApplicationForms(applications)
        setIsLoading(false);
    }

    return (
        <div>
            {
                isLoading && (
                    <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <CircularProgress sx={{ color: "#7165E3" }} />
                    </div>
                )
            }
        </div>

    )


}

export default Applicant