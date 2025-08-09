import axios from "axios";
import { Navigate, useSearchParams } from "react-router-dom";

const OauthSuccess = () => {
    const [searchParams] = useSearchParams();
    const jwt = searchParams.get("jwt");
    const authToken = searchParams.get("jwt");
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    console.log(jwt, authToken);
    
    if (!jwt || !authToken) {
        return <Navigate to="/login" />;
    }
    localStorage.setItem("token", jwt);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("tokenIssuedTime", Date.now());
    return ( <Navigate to="/" /> );
}
 
export default OauthSuccess;