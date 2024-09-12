import React, { useEffect, useState, useRef } from 'react';
import { GET, PUT } from '../dataSaver';
import { KeyboardReturnRounded } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Auth, GetEntityDetails, GetRoles, baseUrl } from "./../../utils/auth";
import axios from "axios";
import { CookiesProvider, Cookies } from 'react-cookie';
import style from './index.module.scss';
import jwt from 'jwt-decode';
import CircularProgress from "@mui/material/CircularProgress";
const accessToken = Auth();

const Applicant = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    let userDetails = cookies.get('user');
    const user = jwt(userDetails);
    const [userId, setUserId] = useState(user?.id);

    const [applicationForms, setApplicationForms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getApplications();
    }, [])

    const getApplications = async () => {
        setIsLoading(true);

        const applications = await axios(`${baseUrl}/application-management-service/application?applicantId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": `Bearer ${accessToken}`,
            },
        });
        // const { data: applications } = await GET(
        //     `application-management-service/application?applicantId=${userId}`
        // );
        if (applications) {
            navigate(`applicationForm/${applications?.[0]?.id}`)
            setIsLoading(false);
            cookies.remove('entityId', { path: '/' })
            cookies.set('entityId', applications?.[0]?.tenant?.id, { path: '/' });
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