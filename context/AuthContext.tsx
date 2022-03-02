import { createContext, ReactNode } from "react";
import { api } from "../services/api";

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
    const isAuthenticated = false;
    
    async function singIn({email, password}: SingInCredentials){
       try {
            const response = api.post('sessions', {
                email,
                password
            })
            console.log(response)
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