import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';

export const Auth = () => {
  let cookie = new Cookie();
  let accessToken = cookie.get('user');
  if(accessToken){
    return accessToken;
  }else{
    return false;
  }
  }

export const GetEntityDetails = () => {
  let cookie = new Cookie();
  let entityId = cookie.get('entityId');
  if(entityId){
    return entityId;
  }else{
    return false;
  }
}

export const GetRoles = () => {
  let cookie = new Cookie();
  let token = cookie.get('user');
  let roles = [];
  if(token){
     roles = jwt(token)?.roles?.split(',');
  }
  return roles;
}
