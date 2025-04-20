import { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";

const Error = () => {
    const err = useRouteError();
    const navigate = useNavigate();

    useEffect(() => {
        if (err.status === 401) {
            navigate('/')
        }
    })


    return (
        <div style={{ height: "100vh", alignContent: "center", textAlign: "center" }}>
            <h2>Sorry, there is a problem at our end<br></br>
                and we are working on it</h2>
            {/* {err.map(e => <p>e</p>)} */}
            {err.message + ' ' + err.code}
            <div style={{ margin: "15px" }}>
                <Link style={{ margin: "25px" }} to={"/login"}>Back to Login</Link>
                <Link style={{ margin: "25px" }} to={`/home`}>Back to home</Link>
            </div>
        </div>
    );
}

export default Error;