import { Share, TrashCan } from "@carbon/icons-react";
import { Button, ComboBox, DataTable, Dropdown, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch } from "@carbon/react";
import axios from "axios";
import { useEffect, useState } from "react";
import bg from "./../Assets/bg.jpeg";


const accessControlHeaders = [
    {
        key: 'name',
        header: 'Name',
    },
    {
        key: 'email',
        header: 'Email',
    }
    ,
    {
        key: 'access',
        header: 'Access Level',
    }
];

const AccessControlList = ({ accessControls, setAccessControls, deviceId }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchPeople, setSearchPeople] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [a, setA] = useState([]);
    const [people, setPeople] = useState([]);
    const [user, setUser] = useState([]);
    const [accessControlLevel, setAccessControlLevel] = useState('');


    // const filteredAccessControls = accessControls.filter((val) => val.name.includes(searchKeyword));
    const filteredAccessControls = accessControls;

    console.log(user);
    console.log(accessControlLevel);
    const addNewAccesscontrol = () => {
        axios.post(`/device/userAccess/${deviceId}`, {
            user: user.id,
            access: accessControlLevel.name
        })
        setIsModalOpen(false)
        setAccessControlLevel('')
    }

    const removeAccessControl = (userId) => {
        axios.delete(`/device/userAccess/${deviceId}/${userId}`).then(res => {
            setA(existing => existing.filter((item) => item.id !== userId));
        })
    }

    useEffect(() => {
        Object.keys(accessControls).forEach((key) => {
            axios.get(`/whoisthis/${key}`).then(function (res) {
                setA(existing => {
                    

                    return [...existing.filter((item) => item.identifier !== key), {
                    identifier: key,
                    name: res.data.name,
                    email: res.data.email,
                    access: accessControls[key]}]});
                // accessControls[key].name = res.data.name;
            });
        })
    }, [])
    console.log(accessControls);
    

    useEffect(() => {
        if (searchPeople.length > 2) {
            const ourRequest = axios.CancelToken.source() // <-- 1st step

            axios.get(`/friends?param=${searchPeople}`, {
                cancelToken: ourRequest.token,
            }).then(function (res) {
                setPeople(res.data);
            });
            return () => {
                ourRequest.cancel()
            }
        }
    }, [searchPeople])
    return (<>
        <DataTable rows={a} headers={accessControlHeaders} isSortable>
            {({ getTableProps }) => (
                <TableContainer title="Access control">
                    <TableToolbar>
                        <TableToolbarContent>
                            <TableToolbarSearch onChange={(e) => setSearchKeyword(e.target.value)} value={searchKeyword} />
                            <Button label="Remove Access" renderIcon={Share} onClick={() => setIsModalOpen(true)}>Share</Button>
                        </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()}>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Email</TableHeader>
                                <TableHeader>Access Level</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {a.map((row) => (
                                <TableRow key={row.identifier}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.access}</TableCell>
                                    <TableCell>
                                        <Button kind="ghost" renderIcon={TrashCan} hasIconOnly onClick={() => removeAccessControl(row.identifier)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </DataTable>



        <Modal open={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onRequestSubmit={() => addNewAccesscontrol()}
            modalHeading="Share"
            primaryButtonText="Share"
            secondaryButtonText="Cancel"
            hasScrollingContent={false}
        >
            <ComboBox
                autoAlign
                id="carbon-combobox"
                items={people}
                value={user?.name}
                onChange={(e) => setUser(e.selectedItem)}
                itemToElement={(item) =>
                    <div><img src={bg} style={{ height: "90%", width: "25px", borderRadius: "50%" }} alt="profile pic" />{item.name}</div>}
                itemToString={(item) => (item ? item.name : '')}
                titleText="Email"
                onInputChange={(e) => {
                    setSearchPeople(e);
                    setUser(e.selectedItem);
                }}
             />

            <Dropdown
                autoAlign
                id="datastream-type-input"
                label="Access"
                titleText="Access"
                value={accessControlLevel}
                onChange={(e) => setAccessControlLevel(e.selectedItem)}
                items={[{
                    id: 'one',
                    label: 'Editor',
                    name: 'Editor'
                }, {
                    id: 'three',
                    label: 'Viewer',
                    name: 'Viewer'
                }, {
                    id: 'four',
                    label: 'None',
                    name: 'None'
                }]}
                style={{
                    marginBottom: '1rem'
                }} />
        </Modal>
    </>
    )
}

export default AccessControlList;