import React, { useEffect } from 'react';
import { useDescope } from '@descope/react-sdk';
import Cookies from 'universal-cookie';
import { GET } from '../dataSaver';

const MedicalDirectiveAttestRFC = () => {
    const descopeSdk = useDescope();
    var cookie = new Cookies();
    useEffect(() => {
        fetchSessionDetails();
    }, []);

    useEffect(() => {
        getDashboardContent()
    }, [cookie.get('authorization'), cookie.get('user')])

    const getDashboardContent = async () => {
        const { data: content } = await GET(`task-management-service/task/dashboard`);
    }

    const fetchSessionDetails = async () => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get("t");
        console.log(token, 'sessionDetails');
        if (!token) {
            console.error("No session_id found in URL");
        }
        const resp = await descopeSdk.magicLink.verify(token)
        if (!resp.ok) {
            console.log("Failed to verify magic link token")
            console.log("Status Code: " + resp.code)
            console.log("Error Code: " + resp.error.errorCode)
            console.log("Error Description: " + resp.error.errorDescription)
            console.log("Error Message: " + resp.error.errorMessage)
        }
        else {
            cookie.set('authorization', resp?.data?.sessionJwt, {
                path: '/',
                domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname,
                secure: true,
                sameSite: 'none',
            });
            console.log("Successfully verified magic link token", resp)
        }
    };
    return (
        <div>Medical Directives</div>
    )
}

export default MedicalDirectiveAttestRFC;