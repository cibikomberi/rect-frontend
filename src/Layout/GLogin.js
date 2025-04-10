import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "783400865958-0h4uh5voas1khdmh6bruqhe153p5klgg.apps.googleusercontent.com";

export default function GLogin() {
    const handleLoginRedirect = () => {
        window.location.href = "https://rect-zmzt.onrender.com//oauth2/authorization/google?redirect_uri=localhost:3000/dash"; // Redirect to Spring Boot OAuth2 login
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <button onClick={handleLoginRedirect}>Login with Google</button>
        </GoogleOAuthProvider>
    );
}
