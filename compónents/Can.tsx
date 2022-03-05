import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanPros {
    children: ReactNode;
    permissions?: string[];
    roles?: string[];
}

export function Can({children, permissions, roles }: CanPros){
        const userCanSeeComponponent =useCan({permissions, roles});

        if(!userCanSeeComponponent){
            return null;
        }
    
    return(
        <>
        {children}
        </>
    )
}