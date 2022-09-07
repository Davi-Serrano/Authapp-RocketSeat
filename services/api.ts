import axios, { AxiosError } from "axios"
import { parseCookies, setCookie } from "nookies";
import { singOut } from "../context/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenErros";

let isRefresh = false;
let failedRequestQueue = [];

export function setupApiClient(ctx: undefined){
    let cookies = parseCookies(ctx);

     const api = axios.create({
        baseURL: "https://lndback.herokuapp.com",
        headers: {
            Authorization: `Bearer ${cookies["nextauth.token"]}`
        }
    
    }) ;
    
    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) =>{
        if(error.response.status === 401){
            if(error.response?.data?.code === "token.expired"){
                cookies = parseCookies(ctx);
    
                const { 'nextauth.refreshToken': refreshToken} = cookies;
                const originalConfig = error.config
    
                if(!isRefresh){
                    isRefresh = true
    
                    api.post("/refresh", {
                        refreshToken,
                    }).then(response =>{
                        const { token } = response.data;
        
                        setCookie(ctx, 'nextauth.token', token,{
                            maxAge: 60 * 60 *24 * 30, // 30 days
                            path: '/'
                        })
        
                        setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
                            maxAge: 60 * 60 *24 * 30, // 30 days
                            path: '/'
                        })
        
                        api.defaults.headers['Authorization'] = `Bearer ${token}` 
    
                        failedRequestQueue.forEach(request => request.onSuccess(token))
                        failedRequestQueue = [];
                    }).catch( error =>{
                        failedRequestQueue.forEach(request => request.onFailure(error))
                        failedRequestQueue = [];
    
                        if(typeof window){
                            singOut()
                        }
    
                    }).finally( ()=>{
                        isRefresh = false
                    })
                }
    
                return new Promise((resolve, reject) =>{
                    failedRequestQueue.push({
                        onSuccess: (token: string)=>{
                            originalConfig.headers['Authorization'] = `Bearer ${token}`
    
                            resolve(api(originalConfig))
                        },
                        onFailure: (error: AxiosError)=>{
                            reject(error)
                        }
                    })
                });
            } else {
                if(process.browser){
                    singOut()
                } else{
                    return Promise.reject(new AuthTokenError())
                }
            }
        }
    
        return Promise.reject(error);
    })

    return api;

}