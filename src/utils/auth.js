import Cookie from 'universal-cookie';

export const Auth = () => {
  let cookie = new Cookie();
  let accessToken = cookie.get('user');
  if(accessToken){
    return true;
  }else{
    return false;
  }
  }
