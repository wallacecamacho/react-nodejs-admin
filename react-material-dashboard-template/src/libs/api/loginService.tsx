import sendRequest from './sendRequest';
import constants from '../config/constants'
import { IRegister } from '../model/register';

export default async function login() {
  const loginUrl = new URL(constants.API_URI.concat(constants.URN_LOGIN));

  return sendRequest(loginUrl.href, { method: 'POST' });
}

export async function register(register:IRegister) {
  const registerUrl = new URL(constants.API_URI.concat(constants.URN_REGISTER));

  return sendRequest(registerUrl.href, { method: 'POST', body: register });
}
