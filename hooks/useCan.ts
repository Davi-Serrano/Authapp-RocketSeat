import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

type UseCanParams = {
    permissions?: string[];
    roles?: string[];
}

export function useCan({permissions , roles}: UseCanParams){
    const { user, isAuthenticated} = useContext(AuthContext)

    if(!isAuthenticated){
        return false
    }

    if(permissions?.length > 0){
        const hasAllPermission = permissions.every(permission => {
            return user.permissions.includes(permission)
        });

        if(!hasAllPermission){
            return false;
        }
    }


    if(roles?.length > 0){
        const hasAllRoles =  roles.some(role => {
            return user.roles.includes(role)
        })    
        if(!hasAllRoles){
            return false;
        }

    }
    return true


}