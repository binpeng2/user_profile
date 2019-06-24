import axios from 'axios';

// var backendRequestUrl = "http://localhost:4001/api/luckynumber/";
const backendRequestUrl = "https://backend.crazydogs.live:4001/api/luckynumber/";
const waykiNodeRequestUrl = "https://baas.wiccdev.org/v2/api/";
// const waykiNodeRequestUrl = "https://baas-test.wiccdev.org/v2/api/";


export const PostRequest = (router,payload,isWayki=false,headers=null,) =>{
  // console.log(payload);
  let requestUrl =  isWayki ? waykiNodeRequestUrl : backendRequestUrl;
  return axios.post(requestUrl+router, payload, headers)
  .then(res => res)
  .catch(err => err)
}

export const GetRequest = (router, isWayki=false) =>{
  let requestUrl =  isWayki ? waykiNodeRequestUrl : backendRequestUrl;
  return axios.get(requestUrl+router)
}



export default {PostRequest,GetRequest}
