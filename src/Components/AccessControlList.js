import { Share, TrashCan } from "@carbon/icons-react";
import { Button, DataTable, Dropdown, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch, TextInput } from "@carbon/react";
import { useState } from "react";


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

const AccessControlList = ({ accessControls, setAccessControls }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [accessControlName, setAccessControlName] = useState('');
    const [accessControlEmail, setAccessControlEmail] = useState('');
    const [accessControlLevel, setAccessControlLevel] = useState('');

    // const filteredAccessControls = accessControls.filter((val) => val.name.includes(searchKeyword));
    const filteredAccessControls = accessControls;

    const addNewAccesscontrol = () => {
        setAccessControls((existing) => ([...existing, {
            name: accessControlName,
            email: accessControlEmail,
            access: accessControlLevel,
        }]))
        setIsModalOpen(false)
        setAccessControlName('')
        setAccessControlEmail('')
        setAccessControlLevel('')
    }

    return (<>
        <DataTable rows={filteredAccessControls} headers={accessControlHeaders} isSortable>
                {({  getTableProps }) => (
                    <TableContainer title="Access control">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch onChange={(e) => setSearchKeyword(e.target.value)} value={searchKeyword}/>
                                <Button renderIcon={Share} onClick={() => setIsModalOpen(true)}>Share</Button>
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
                            {filteredAccessControls.map((row) => (
                                    <TableRow key={row.identifier}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.access}</TableCell>
                                            <TableCell>
                                                <Button kind="ghost" renderIcon={TrashCan} hasIconOnly />
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
            modalHeading="Create new datastream"
            primaryButtonText="Create"
            secondaryButtonText="Cancel"
        >
            <TextInput
                id="datastream-id-input"
                labelText="Email"
                value={accessControlEmail}
                onChange={(e) => setAccessControlEmail(e.target.value)}
            />

            <Dropdown
                id="datastream-type-input"
                label="Data type"
                titleText="Data type"
                value={accessControlLevel}
                onChange={(e) => setAccessControlLevel(e.selectedItem.name)}
                items={[{
                    id: 'one',
                    label: 'Editor',
                    name: 'Editor'
                }, {
                    id: 'two',
                    label: 'Viewer including all devices',
                    name: 'Viewer including all devices'
                }, {
                    id: 'three',
                    label: 'Viewer',
                    name: 'Viewer'
                },{
                    id: 'four',
                    label: 'None',
                    name: 'None'
                }]} style={{
                    marginBottom: '1rem'
                }} />
        </Modal>
    </>);
}

export default AccessControlList;