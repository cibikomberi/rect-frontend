import { Save } from "@carbon/icons-react";
import { Button, FileUploader, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

const ProfileUpdate = () => {
    const { profile } = useLoaderData();
    const [newName, setNewName] = useState(profile.name);
    const [newPhone, setNewPhone] = useState(profile.phone);
    const [image, setImage] = useState(null);

    const updateProfile = () => {
        const data = new FormData();
        data.append('profile', new Blob([JSON.stringify({
            name: newName, 
            phone: newPhone
        })], { type: "application/json" }));
        data.append('image', image);
        axios.put('/profile', data).then(res => console.log(res))
    }
    return (
        <>
            <h4>Profile Update</h4>
            <FileUploader
                name="New profile image"
                labelTitle=""
                labelDescription=""
                buttonLabel="Upload profile image"
                buttonKind="primary"
                size="md"
                filenameStatus="edit"
                accept={['.jpg', '.png']}
                multiple={false}
                disabled={false}
                onChange={(e) => setImage(e.target.files[0])}
            />
            <TextInput labelText="Name"
                value={newName}
                onChange={(e) => { setNewName(e.target.value) }} />
            <TextInput labelText="Phone"
                type="tel"
                value={newPhone}
                onChange={(e) => { setNewPhone(e.target.value) }} />
            <Button renderIcon={Save} onClick={updateProfile}>Save</Button>

        </>
    );
}

export default ProfileUpdate;