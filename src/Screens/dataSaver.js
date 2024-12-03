import React, { useEffect } from "react";
import { Auth, GetEntityDetails, GetRoles, baseUrl } from "./../utils/auth";
import Cookie from "universal-cookie";
import axios from "axios";
import jwt from "jwt-decode";

export const TenantID = GetEntityDetails();

const roles = GetRoles();

export const isSuperAdminAccess = roles?.includes('Super Sys Admin') || roles?.includes('Distributor Admin') ? true : false;
let cookie = new Cookie();

const getHeaders = () => {
    let tenantId = cookie.get("entityId");
    let accessToken = cookie.get('user');
    let authorization = cookie.get("authorization");
    return {
        "Content-Type": "application/json",
        "X-tenantID": tenantId,
        "X-Authorization": `Bearer ${accessToken}`,
        "Authorization": `Bearer ${authorization}`,
    };
}

export const GET = (url) => {
    return axios(`${baseUrl()}/${url}`, {
        method: "GET",
        headers: getHeaders(),
    });
};

export const PUT = (url, data) => {
    return axios(`${baseUrl()}/${url}`, {
        method: "PUT",
        headers: getHeaders(),
        data,
    });
};

export const POST = (url, data) => {
    return axios(`${baseUrl()}/${url}`, {
        method: "POST",
        headers: getHeaders(),
        data,
    });
};

export const DELETE = (url, data) => {
    return axios(`${baseUrl()}/${url}`, {
        method: "DELETE",
        headers: getHeaders(),
        data,
    });
};
