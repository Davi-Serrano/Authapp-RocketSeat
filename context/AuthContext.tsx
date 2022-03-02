import Router from "next/router";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type User = {
    email: string;
    permissions: string[],
    roles: string[];

}

type SingInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    singIn(credentials: SingInCredentials): Promise<void>;
    user: User;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser]= useState<User>()
    const isAuthenticated = !!user;
    
    async function singIn({email, password}: SingInCredentials){
       try {
            const response = await api.post('sessions', {
                email,
                password
            })
            
            const { token, reshtoken, permissions, roles } = response.data
            setUser({
                email,
                permissions,
                roles
            })

            Router.push("/dashboard")
       } catch (err) {
            console.log(err)
       }
    }
    

    return (
        <AuthContext.Provider value={{ singIn , isAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}