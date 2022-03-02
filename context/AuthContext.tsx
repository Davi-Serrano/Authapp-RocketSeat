import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type User = {
    email: string;]
    permissions: string[],
    roles: string[];

}

type SingInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    singIn(credentials: SingInCredentials): Promise<void>;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser]= useState<User>()
    const isAuthenticated = false;
    
    async function singIn({email, password}: SingInCredentials){
       try {
            const response = api.post('sessions', {
                email,
                password
            })
            
            const { permissions , roles } = response

            setUser({
                email,
                permissions,
                roles
            })
       } catch (err) {
            console.log(err)
       }
    }
    

    return (
        <AuthContext.Provider value={{ singIn , isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}