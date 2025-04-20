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

    return (<>
        <h4>Profile</h4>
        <img src={profile.image} alt="profile" className="img-view" />
        <strong><h1>{profile.name}</h1></strong>
        <h4><Email />{profile.email}</h4>
        <h4><Phone />{profile.phone}</h4>
        <Button kind="ghost" onClick={() => setIsModalOpen(true)}>Change password</Button>
        <Button as={Link} kind="ghost" to={"sessions"}>Logged in devices</Button>
        <Button as={Link} to={"configure"}>Update Profile</Button>

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
    </>);
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