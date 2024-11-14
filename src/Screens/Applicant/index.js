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
import LoadingScreen from '../../Components/LoadingScreen';
const accessToken = Auth();

const Applicant = () => {
    const currentUserData = currentUser();
    const navigate = useNavigate();
    const cookies = new Cookies();
    // let userDetails = cookies.get('user');
    // const user = jwt(userDetails);
    // console.log('currentUserData', currentUserData);
    // const [userId, setUserId] = useState(user?.id);

    const [applicationForm, setApplicationForms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getApplications();
    }, [])

    useEffect(() => {
        if (applicationForm?.length > 0) {
            console.log('Inside UseEffect', applicationForm);
            cookies.remove('entityId', { path: '/' })
            cookies.set('entityId', applicationForm?.[applicationForm?.length - 1]?.tenant?.id, { path: '/' });
            if (applicationForm?.[applicationForm?.length - 1]?.lastSavedSection !== null && applicationForm?.[applicationForm?.length - 1]?.lastSavedSection !== "") {
                navigate(applicationForm?.[applicationForm?.length - 1]?.creationType === 'REAPPOINTMENT' ? `/reappointmentApplicationForm/${applicationForm?.[applicationForm?.length - 1]?.id}/${JSON.parse(applicationForm?.[applicationForm?.length - 1]?.lastSavedSection)}` : `/applicationForm/${applicationForm?.[applicationForm?.length - 1]?.id}`);
            } else {
                navigate(applicationForm?.[applicationForm?.length - 1]?.creationType === 'REAPPOINTMENT' ? `/reappointmentApplicationForm/${applicationForm?.[applicationForm?.length - 1]?.id}` : `/applicationForm/${applicationForm?.[applicationForm?.length - 1]?.id}`);
            }
        }
    }, [applicationForm, applicationForm?.length])

    console.log('Application Data', applicationForm)

    const getApplications = async () => {
        setIsLoading(true);
        try {
            // Perform the API request and wait for the response
            const { data: application } = await GET(
                `application-management-service/application?applicantId=${currentUserData?.id}`
            );
            console.log('applications', application)
            // if (application && application.length > 0 && application[0]?.id) {
            setApplicationForms(application?.applications);
            // navigate(`/applicationForm/${application?.[0]?.id}`);
            // cookies.remove('entityId', { path: '/' })
            // cookies.set('entityId', application?.[0]?.tenant?.id, { path: '/' });
            // setIsLoading(false);

            // }
        } catch (error) {
            console.error("Error fetching application data:", error);
        }
        setIsLoading(false);

    }

    return (
        <div>
            {
                isLoading && (
                    <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        {/* <CircularProgress sx={{ color: "#0e5197" }} /> */}
                        <LoadingScreen />
                    </div>
                )
            }
        </div>
    )
}

export default Applicant