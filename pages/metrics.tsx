import { setupApiClient } from "../services/api"
import  {withSSRAuth  } from "../utils/withSSRAuth"

export default function Metric(){
    
    return (
        <>
        <h1>Metrics </h1>
        
        </>
    )
}

export const getServerSideProps = withSSRAuth(async(ctx: undefined)=>{
    const apiClient = setupApiClient(ctx)
    const response = await apiClient.get("/me")

    console.log(response)
    return {
        props:{}
    }
 }, {
        permissions: ["users.list"],
        roles: ["administrator"]
})