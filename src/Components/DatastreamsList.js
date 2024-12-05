import { Add, TrashCan } from "@carbon/icons-react";
import { Button, DataTable, Dropdown, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch, TextInput } from "@carbon/react";
import { useState } from "react";



const DatastreamsList = ({ dataStreams, setDatastreams }) => {
    console.log(dataStreams);
    
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [datastreamId, setDatastreamId] = useState('');
    const [datastreamName, setDatastreamName] = useState('');
    const [datastreamType, setDatastreamType] = useState('');
    const [datastreamUnit, setDatastreamUnit] = useState('');
    
    const filteredDataStreams = dataStreams.filter((val) => val.name.includes(searchKeyword));
    // const filteredDataStreams = dataStreams;

    const addNewDatastream = () => {
        setDatastreams((existing) => ([...existing, {
            identifier: datastreamId,
            name: datastreamName,
            type: datastreamType,
            unit: datastreamUnit,
        }]))
        setIsModalOpen(false)
        setDatastreamId('')
        setDatastreamName('')
        setDatastreamType('')
        setDatastreamUnit('')
    }
    const datastreamHeaders = [
        {
            key: 'identifier',
            header: 'Id',
        },
        {
            key: 'name',
            header: 'Name',
        },
        {
            key: 'type',
            header: 'Data type',
        },
        {
            key: 'unit',
            header: 'Unit',
        }
    ];

    return (
        <>

            <DataTable rows={dataStreams} headers={datastreamHeaders} isSortable>
                {() => (
                    <TableContainer title="Templates">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch onChange={(e) => setSearchKeyword(e.target.value)} value={searchKeyword}/>
                                <Button renderIcon={Add} onClick={() => setIsModalOpen(true)}>New Template</Button>
                            </TableToolbarContent>
                        </TableToolbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                        <TableHeader>Id</TableHeader>
                                        <TableHeader>Name</TableHeader>
                                        <TableHeader>Type</TableHeader>
                                        <TableHeader>Unit</TableHeader>
                                        <TableHeader>Actions</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDataStreams.map((row) => (
                                    <TableRow key={row.identifier}>
                                            <TableCell>{row.identifier}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.unit}</TableCell>
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
                onRequestSubmit={() => addNewDatastream()}
                modalHeading="Create new datastream"
                primaryButtonText="Create"
                secondaryButtonText="Cancel"
            >
                <TextInput
                    id="datastream-id-input"
                    labelText="Datastream id"
                    value={datastreamId}
                    onChange={(e) => setDatastreamId(e.target.value)}
                />
                <TextInput
                    id="datastream-name-input"
                    labelText="Template name"
                    value={datastreamName}
                    onChange={(e) => setDatastreamName(e.target.value)}
                />
                <Dropdown
                    id="datastream-type-input"
                    label="Data type"
                    titleText="Data type"
                    value={datastreamType}
                    onChange={(e) => setDatastreamType(e.selectedItem.name)}
                    items={[{
                        id: 'one',
                        label: 'Integer',
                        name: 'Integer'
                    }, {
                        id: 'two',
                        label: 'Float',
                        name: 'Float'
                    }, {
                        id: 'three',
                        label: 'String',
                        name: 'String'
                    }]} style={{
                        marginBottom: '1rem'
                    }} />
                <TextInput labelText="Unit"
                    id="datastream-unit-input"
                    value={datastreamUnit}
                    onChange={(e) => setDatastreamUnit(e.target.value)}
                />
            </Modal>
        </>
    );
}

export default DatastreamsList;