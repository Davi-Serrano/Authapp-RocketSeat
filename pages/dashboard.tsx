import { useContext, useEffect } from "react"
import { Can } from "../compónents/Can"
import { AuthContext } from "../context/AuthContext"
import { useCan } from "../hooks/useCan"
import { setupApiClient } from "../services/api"
import { api } from "../services/apiClient"
import  {withSSRAuth  } from "../utils/withSSRAuth"

export default function Dashboard(){
    const { user, singOut } = useContext(AuthContext)

    const useCanSeeMetrics = useCan({
        permissions: ['metrics.list']
    })

    useEffect( ()=>{
            api.get("/me")
                .then(response => console.log(response))
                .catch( error=>console.log(error))
                console.log(useCanSeeMetrics)
    },[])

    return (
        <>
        <h1>Dashboard: {user?.email}  </h1>
         <Can permissions={['metrics.list']}>
             <h2>Métricas</h2> 
        </Can>
        <button onClick={singOut}>Sing Out</button>
        </>
    )
}

export const getServerSideProps = withSSRAuth(async(ctx: undefined)=>{
    const apiClient = setupApiClient(ctx)
    const response = await apiClient.get("/me")

    console.log(response.data)

    return {
        props:{}
    }
})