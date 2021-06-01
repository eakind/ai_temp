import axios from 'axios';
import './http';
import { api } from './api';
import { apiAddr } from './config';
let CancelToken = axios.CancelToken;
let source = CancelToken.source();

export const post = (path, param, cancel) => axios.post(api[path], param, { cancelToken: source.token });

export const get = (path, param) => axios.get(api[path], { params: param });

export const download = (path, param, name) => {
  let query = '?';
  for (let key in param) {
    query = query + `${key}=${param[key]}&`;
  }
  let token = localStorage.getItem('dcAIUserToken');
  query = query + `Authorization=${token}&`;
  query = query + `dc_current_time=${Date.now()}`;
  let url = apiAddr + api[path] + query;
  window.open(url, '__blank');
  return {};
};

// export const download = (path, param, name) => axios({
//   params: param,
//   method: 'get',
//   data: param,
//   url: api[path],
//   responseType: 'arraybuffer'
// }).then(res => {
//   if (res.code) {
//     return res;
//   } else {
//     const fileName = `${name}.csv`;
//     const blob = new Blob([res]);
//     const url = window.URL.createObjectURL(blob);
//     let dom = document.createElement('a');
//     dom.style.display = 'none';
//     dom.href = url;
//     dom.setAttribute('download', fileName);
//     document.body.appendChild(dom);
//     dom.click();
//     return {};
//   }
// });
export const downloadData = (path, param, name) => axios({
  params: param,
  method: 'get',
  data: param,
  url: api[path],
  responseType: 'arraybuffer'
}).then(res => {
  if (res.code) {
    return res;
  } else {
    const fileName = `${name}.csv`;
    const blob = new Blob([res]);
    const url = window.URL.createObjectURL(blob);
    let dom = document.createElement('a');
    dom.style.display = 'none';
    dom.href = url;
    dom.setAttribute('download', fileName);
    document.body.appendChild(dom);
    dom.click();
    return {};
  }
});

export const cancel = () => {
  source.cancel('');
  CancelToken = axios.CancelToken;
  source = CancelToken.source();
};
