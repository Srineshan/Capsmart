import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { PUT } from '../Screens/dataSaver';
import { ErrorToaster } from './toaster';

export const Auth = () => {
  let cookie = new Cookie();
  let accessToken = cookie.get('user');
  if (accessToken) {
    return accessToken;
  } else {
    return false;
  }
}

export const baseUrl = () => {
  let response = ''
  let hostname = window.location.hostname;
  console.log(window.location.origin, 'origin')
  // if (hostname?.split('.')?.length === 3 && hostname?.split('.')?.includes('doxonify')) {
  //   response = 'https://acme-hospital.doxonify.ca';
  // } else if (hostname?.split('.')?.length === 3 && hostname?.split('.')?.includes('hapicaredev')) {
  //   response = 'https://acm-hospital.hapicaredev.com';
  // } else if (hostname === 'localhost') {
  //   response = 'http://ec2-15-157-205-106.ca-central-1.compute.amazonaws.com';
  // } else {
  //   response = 'https://doxonify.ca';
  // }

  // if (hostname === 'localhost') {
  //   response = 'http://ec2-107-23-66-238.compute-1.amazonaws.com';
  // } else {
  //   response = window.location.origin;
  // }

  // response = `http://${hostname}:8000`;

  response = `https://rest.hapicare.me`

  return response;
}

export const GetEntityDetails = () => {
  let cookie = new Cookie();
  let entityId = cookie.get('entityId');
  if (entityId) {
    return entityId;
  } else {
    return false;
  }
}

export const currentUser = () => {
  if (!window.location.href?.includes('user/ssoId')) {
    let cookie = new Cookie();
    let accessToken = cookie.get('user');
    let decoded;
    let user = {};
    if (accessToken) {
      try {
        decoded = jwt(accessToken);
        user.id = decoded?.id;
        user.firstName = decoded?.userName?.split(' ')[0];
        user.lastName = decoded?.userName?.split(' ')[1];
        user.fullName = decoded?.userName;
        user.email = decoded?.sub;
        user.roles = decoded?.roles?.split(',');
      } catch (e) {
        console.warn('JWT decode failed in currentUser()', e);
        // optional: clear user or trigger logout here
      }
    }
    return user;
  }
}


export const GetRoles = () => {
  let cookie = new Cookie();
  let token = cookie.get('user');
  let roles = [];
  if (token) {
    try {
      roles = jwt(token)?.roles?.split(',') || [];
    } catch (e) {
      console.warn('JWT decode failed in GetRoles()', e);
      roles = [];
    }
  }
  return roles;
}

export const Logout = async () => {
  const cookies = new Cookie();
  await PUT(`logout`, null)
    .then((response) => {
      const logouturi = response.headers["location"] || "";
      cookies.remove("user", { path: "/" });
      cookies.remove("entityId", { path: "/" });
      if (logouturi) {
        window.location.href = logouturi;
      }
    })
    .catch((error) => {
      ErrorToaster("Unexpected Error");
    });
};