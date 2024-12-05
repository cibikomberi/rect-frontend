import { Add } from '@carbon/icons-react';
import {
    DataTable,
    Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer, Button, TableToolbar, TableToolbarContent, TableToolbarSearch, Modal, TextInput, Dropdown
} from '@carbon/react';
import axios from 'axios';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

const TemplatesList = () => {
    const navigate = useNavigate();
    const templateData = useLoaderData();
    const [rows, setRows] = useState(templateData);

    const [open, setOpen] = useState(false);
    const [newBoard, setNewBoard] = useState('');
    const [newTemplateName, setNewTemplateName] = useState('');


    const newTemplate = () => {
        axios.post(`template`,{
            name: newTemplateName,
            board: newBoard
        }).then((res) => setOpen(false))
    }

    const applySearchFilter = (keyword) => {
        setRows(templateData.filter((val) => val.name.includes(keyword)))
    }

    const headers = [
        {
            key: 'name',
            header: 'Name',
        },
        {
            key: 'board',
            header: 'Board',
        },
    ];
    
    return (
        <>
            <DataTable rows={rows} headers={headers} isSortable>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Templates">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch   onChange={(e) => applySearchFilter(e.target.value)}/>
                                <Button renderIcon={Add} onClick={() => setOpen(true)}>New Template</Button>
                            </TableToolbarContent>
                        </TableToolbar>
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader {...getHeaderProps({ header })}>
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow {...getRowProps({ row })} onClick={() => navigate(`${row.id}/view`)}>
                                        {row.cells.map((cell) => (
                                            <TableCell key={cell.id}>{cell.value}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>

            <Modal open={open}
                onRequestClose={() => setOpen(false)}
                onRequestSubmit={() => newTemplate()}
                modalHeading="Create a new template"
                primaryButtonText="Create"
                secondaryButtonText="Cancel"
            >
                <Dropdown
                    label="Board"
                    titleText="Board"
                    value={newBoard}
                    onChange={(e) => { setNewBoard(e.selectedItem.name) }}
                    items={[{
                        id: 'one',
                        label: 'ESP32',
                        name: 'ESP32'
                    }, {
                        id: 'two',
                        label: 'ESP8266',
                        name: 'ESP8266'
                    }]} style={{
                        marginBottom: '1rem'
                    }} />

                <TextInput labelText="Template name"
                    value={newTemplateName}
                    onChange={(e) => { setNewTemplateName(e.target.value) }} />

            </Modal>
        </>
    );
}

export const templateListLoader = async () => {
    const templates = await axios.get('/templates/1')
        .then((res) => res.data)
    return templates;
}

export default TemplatesList;