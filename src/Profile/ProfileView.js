import { Email, Phone } from "@carbon/icons-react";
import { Button, Modal, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const ProfileView = () => {
    const { profile } = useLoaderData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [existingPassword, setExistingPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");

    console.log(profile);
    const updatePassword = () => {
        if (password !== passwordTwo) {
            console.log("Passwords do not match");
            return;
        }
        axios.post('/profile/resetPassword', {
            existingPassword, password
        }).then(res => console.log(res))
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "2rem",
                    justifyContent: "flex-start",
                    flexWrap: "wrap"
                }}
                className="profile-container"
            >
                <img
                    src={profile.image}
                    alt="profile"
                    className="img-view"
                    style={{
                        width: "80vw",         // Width is set as a percentage of the viewport width (adjust as needed)
                        height: "80vw",        // Height matches the width, ensuring it remains a square
                        maxWidth: "500px",     // Maximum width to prevent it from getting too large
                        maxHeight: "500px",    // Maximum height to prevent it from getting too large
                        borderRadius: "50%",   // Ensures the image stays circular
                        objectFit: "cover",    // Ensures the image covers the circle properly
                        display: "block",      // Centers the image horizontally
                        margin: "0 auto"       // Centers the image horizontally
                    }}
                />


                <div style={{ minWidth: "220px" }}>
                    <strong><h1 style={{ margin: "0 0 0.5rem 0" }}>{profile.name}</h1></strong>
                    <h4 style={{ margin: "0.5rem 0" }}><Email /> <a href={`mailto:${profile.email}`}>{profile.email}</a></h4>
                    {profile.phone !== 0 && <h4 style={{ margin: "0.5rem 0" }}><Phone /> <a href={`tel:${profile.phone}`}>{profile.phone}</a></h4>}
                    <Button kind="ghost" onClick={() => setIsModalOpen(true)}>Change password</Button>
                    <Button as={Link} kind="ghost" to={"sessions"}>Logged in devices</Button>
                    <Button as={Link} to={"configure"}>Update Profile</Button>
                </div>
            </div>
            <Modal open={isModalOpen}
                id='-control-modal'
                onRequestClose={() => setIsModalOpen(false)}
                onRequestSubmit={() => updatePassword()}
                modalHeading="Update Password"
                primaryButtonText="Update Password"
                secondaryButtonText="Cancel"
                hasScrollingContent={false}
            >
                <TextInput id="text-existing-Password" type="password" labelText="Password" placeholder="%S5Gghu*$" value={existingPassword} onChange={(e) => setExistingPassword(e.target.value)} />
                <TextInput id="text-input-Password" type="password" labelText="Password" placeholder="*Ho*$45s" value={password} onChange={(e) => setPassword(e.target.value)} />
                <TextInput id="text-confirm-Password" type="password" labelText="Password" placeholder="*Ho*$45s" value={passwordTwo} onChange={(e) => setPasswordTwo(e.target.value)} />
            </Modal>
            <style>
                {`
                .profile-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 2rem auto;
                }
                @media (max-width: 600px) {
                    .profile-container {
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 1rem;
                    }
                    .img-view {
                        margin: 0 auto !important;
                    }
                }
                `}
            </style>
        </>
    );
}

export const myDetailsLoader = async () => {
    const profile = await axios.get('/whoami').then(res => res.data)
        .then(async (profile) => {
            if (profile.imageUrl) {
                return { ...profile, image: profile.imageUrl };
            }
            if (profile.imageId === null) {
                return { ...profile, image: null };
            }
            const image = await axios.get(`/profile/image/${profile.imageId}`, { responseType: "blob" }).then(res => res.data)
            return { ...profile, image: URL.createObjectURL(image) };
        });
    console.log(profile);

    return { profile }
}

export default ProfileView;