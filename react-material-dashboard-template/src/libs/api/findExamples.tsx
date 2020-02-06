import sendRequest from './sendRequest';
import constants from '../config/constants'

export default async function findExamples() {
  const findExampetUrl = new URL(constants.FIND_EXAMPLES_URI);

  return sendRequest(findExampetUrl.href, { method: 'GET' });
}
