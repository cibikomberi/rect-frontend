import { ArrowRight } from "@carbon/icons-react";
import { Button, FluidForm, PasswordInput, TextInput, Tile } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GithubLogo from "../Icons/Github";
import GoogleLogo from "../Icons/Google";
import bg from "./../Assets/bg.jpeg";

const Login = () => {
    axios.defaults.headers.common['Authorization'] = ``;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    
    const login = async (e) => {
        e.preventDefault();
        setErrorMessage("")
        axios.post("/login", {
            email,
            password,
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

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
                        <Button type="submit" style={{ width: "100%", flexGrow: "1", maxWidth: "unset" }} as="div" renderIcon={ArrowRight} onClick={login}>Log in</Button>

                        <div style={{ display: "flex", gap: "5px", width: "100%", flexWrap: "wrap", justifyContent: "space-between" }}>
                            <Button kind="tertiary" style={{ minWidth: "48%", flexGrow: "1", flexBasis: "225px", maxWidth: "100%" }} renderIcon={GoogleLogo} onClick={() => {
                                const redirectUrl = encodeURIComponent(`${window.location.origin}/oauth/success`);
                                window.location.href = `${process.env.REACT_APP_BACKEND_URL}/oauth2/authorization/google?redirectUrl=${redirectUrl}`;
                            }}>Google Log in</Button>
                            
                            <Button kind="tertiary" style={{ minWidth: "48%", flexGrow: "1", flexBasis: "225px", maxWidth: "100%" }} renderIcon={GithubLogo} onClick={() => {
                                const redirectUrl = encodeURIComponent(`${window.location.origin}/oauth/success`);
                                window.location.href = `${process.env.REACT_APP_BACKEND_URL}/oauth2/authorization/github?redirectUrl=${redirectUrl}`;
                            }}>Github Log in</Button>
                        </div>
                    </div>
                </FluidForm>
            </Tile>
        </div>);
}

export default Login;