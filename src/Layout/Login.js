import { ArrowRight } from "@carbon/icons-react";
import { Button, FluidForm, PasswordInput, TextInput, Tile } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "./../Assets/bg.jpeg";

async function getPlatformInfo() {
        const platform = await navigator.userAgentData.getHighEntropyValues(['platform', 'platformVersion'])
            .then(data => {
                console.log("Platform:", data.platform);
                console.log("Platform Version:", data.platformVersion);
                return data.platform;
            });
        return platform;
}
function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) {
        return "Mozilla Firefox";
    } else if (userAgent.includes("Edg")) {
        return "Microsoft Edge";
    } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        return "Google Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        return "Apple Safari";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        return "Opera";
    } else {
        return "Unknown Browser";
    }
}

const Login = () => {
    const platform = getPlatformInfo().then(data => data);
    console.log(platform);
    console.log("Browser:", getBrowserName());

    axios.defaults.headers.common['Authorization'] = ``;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const login = async(e) => {
        console.log(platform);

        e.preventDefault();
        setErrorMessage("")
        axios.post("/login", {
            email, 
            password,
            client: getBrowserName(),
            os: await getPlatformInfo()
        }).then((res) => {
            if (res.status === 200) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.jwt}`;
                localStorage.setItem("token", res.data.jwt);
                localStorage.setItem("authToken", res.data.authToken);
                localStorage.setItem("tokenIssuedTime", Date.now());
                navigate("/");
            }
        }).catch((error) => {
            setErrorMessage("Username or Password is incorrect")
        });
    }
    return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundImage: `url(${bg})`, backgroundSize: "cover" }}>
        <Tile style={{ width: "500px" }}>
            <h3>Log in</h3>
                <p>Don't have an account? <Link to={"/register"}>Sign up</Link></p>
            <FluidForm>
                <div style={{ marginTop: "34px", marginBottom: "40px" }}>
                    <TextInput id="text-input-Email" type="email" labelText="Email" placeholder="username@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <PasswordInput id="text-input-Password" type="password" labelText="Password" placeholder="%S5Gghu*$" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
                </div>


                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* <Button kind="ghost">
                    Button
                </Button> */}
                    <div></div>
                    <Button type="submit" style={{ width: "50%" }} renderIcon={ArrowRight} onClick={login}>Log in</Button>
                </div>
            </FluidForm>
        </Tile>
    </div>);
}

export default Login;