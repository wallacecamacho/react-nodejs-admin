import 'isomorphic-fetch';

export default async function sendRequest(path, opts = {}) {
  const headers = Object.assign({}, opts.headers || {}, {
    'Content-type': 'application/json; charset=UTF-8'
    //Authorization: localStorage.getItem(process.env.TOKEN_KEY),
  });

  const options = {
    headers,
    method: 'POST',
    credentials: 'same-origin',
    ...opts
  };

  let data = null;

  try {
    const response = await fetch(`${path}`, options);

    if (response.ok) {
      data = await response.json();
    }
  } catch (err) {
    throw new Error(err.message);
  }
  return data;
}