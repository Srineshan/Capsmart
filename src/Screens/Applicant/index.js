import React, { useEffect, useState, useRef } from 'react';
import { GET, PUT } from '../dataSaver';
import { KeyboardReturnRounded } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Auth, GetEntityDetails, GetRoles, baseUrl, currentUser } from "./../../utils/auth";
import axios from "axios";
import { CookiesProvider, Cookies } from 'react-cookie';
import style from './index.module.scss';
import jwt from 'jwt-decode';
import CircularProgress from "@mui/material/CircularProgress";
const accessToken = Auth();

const Applicant = () => {
    const currentUserData = currentUser();
    const navigate = useNavigate();
    const cookies = new Cookies();
    // let userDetails = cookies.get('user');
    // const user = jwt(userDetails);
    console.log('currentUserData', currentUserData);
    // const [userId, setUserId] = useState(user?.id);

    const [applicationForms, setApplicationForms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getApplications();
    }, [])

    const getApplications = async () => {
        setIsLoading(true);
        console.log('user id', currentUserData?.id);
        const { data: application } = await GET(
            `application-management-service/application?applicantId=${currentUserData?.id}`
        );

        // await axios(`${baseUrl}/application-management-service/application?applicantId=${user?.id}`, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "X-Authorization": `Bearer ${accessToken}`,
        //     },
        // }).then(response => {
        navigate(`/applicationForm/${application?.[0]?.id}`)
        setIsLoading(false);
        cookies.remove('entityId', { path: '/' })
        cookies.set('entityId', application?.[0]?.tenant?.id, { path: '/' });

        // }).catch(err => { console.log('error', err) })

        // const { data: applications } = await GET(
        //     `application-management-service/application?applicantId=${userId}`
        // );

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