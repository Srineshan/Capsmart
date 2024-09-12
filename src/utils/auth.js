import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';

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
  if (hostname?.split('.')?.length === 3) {
    response = 'https://acme-hospital.doxonify.ca';
  } else if (hostname === 'localhost') {
    response = 'http://ec2-52-204-199-180.compute-1.amazonaws.com';
  } else {
    response = 'https://doxonify.ca';
  }
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
    let decoded = jwt(accessToken);
    let user = {};
    if (accessToken) {
      user.id = decoded?.id;
      user.firstName = decoded?.userName?.split(' ')[0];
      user.lastName = decoded?.userName?.split(' ')[1];
      user.fullName = decoded?.userName;
      user.email = decoded?.sub;
      user.roles = decoded?.roles?.split(',');
    }
    return user;
  }
}


export const GetRoles = () => {
  let cookie = new Cookie();
  let token = cookie.get('user');
  let roles = [];
  if (token) {
    roles = jwt(token)?.roles?.split(',');
  }
  return roles;
}
