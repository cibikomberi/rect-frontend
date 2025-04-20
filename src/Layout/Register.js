import { ArrowRight } from "@carbon/icons-react";
import { Button, FluidForm, TextInput, Tile } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "./../Assets/bg.jpeg";

const Register = () => {
    axios.defaults.headers.common['Authorization'] = ``;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();
        if (password !== passwordTwo) {
            setErrorMessage("Passwords do not match");
            return;
        }
        setErrorMessage("");
        axios.post("/register", {
            name, email, password
        }).then((res) => {
            if (res.status === 200) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data}`;
                localStorage.setItem("token", res.data);
                navigate("/login");
            }
        }).catch((error) => {
            setErrorMessage("Please verify the information provided")
        });
    }
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundImage: `url(${bg})`, backgroundSize: "cover" }}>
            <Tile style={{ width: "500px" }}>
                <h3>Register</h3>
                <p>Already have an account?<Link to={"/login"}>Log in</Link></p>
                <FluidForm>
                    <div style={{ marginTop: "34px", marginBottom: "40px" }}>
                        <TextInput id="text-input-name" type="text" labelText="Name" placeholder="user" value={name} onChange={(e) => setName(e.target.value)} />
                        <TextInput id="text-input-email" type="email" labelText="Email" placeholder="username@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextInput id="text-input-password-1" type="password" labelText="Password" placeholder="%S5Gghu*$" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <TextInput id="text-input-password-2" type="password" labelText="Confirm Password" placeholder="%S5Gghu*$" value={passwordTwo} onChange={(e) => setPasswordTwo(e.target.value)} />
                        <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
                    </div>


                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {/* <Button kind="ghost">
                    Button
                </Button> */}
                        <div></div>
                        <Button type="submit" style={{ width: "50%" }} renderIcon={ArrowRight} onClick={register}>Register</Button>
                    </div>
                </FluidForm>
            </Tile>
        </div>);
}

export default Register;