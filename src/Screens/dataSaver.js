import React, { useEffect } from "react";
import { Auth, GetEntityDetails, GetRoles } from "./../utils/auth";
import Cookie from "universal-cookie";
import axios from "axios";
import jwt from "jwt-decode";

export const TenantID = GetEntityDetails();

const accessToken = Auth();
const roles = GetRoles();
export const isSuperAdminAccess = roles.includes('Super Sys Admin') || roles.includes('Distributor Admin') ? true : false;
const baseUrl = `http://ec2-52-204-199-180.compute-1.amazonaws.com`;
let cookie = new Cookie();
let tenantId = cookie.get("entityId");
const headers = {
    "Content-Type": "application/json",
    "X-tenantID": TenantID,
    "X-Authorization": `Bearer ${accessToken}`,
};

export const GET = (url) => {
    return axios(`${baseUrl}/${url}`, {
        method: "GET",
        headers: headers,
    });
};

export const PUT = (url, data) => {
    return axios(`${baseUrl}/${url}`, {
        method: "PUT",
        headers: headers,
        data,
    });
};

export const POST = (url, data) => {
    return axios(`${baseUrl}/${url}`, {
        method: "POST",
        headers: headers,
        data,
    });
};

export const DELETE = (url) => {
    return axios(`${baseUrl}/${url}`, {
        method: "DELETE",
        headers: headers,
    });
};
