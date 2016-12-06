export const apiUrl = 'http://127.0.0.1:8181/';
export const headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
export const authHeaders = (token) => ({...headers, 'x-auth-token': `${token}`});