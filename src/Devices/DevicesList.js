import { Add } from '@carbon/icons-react';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer, Button, TableToolbar, TableToolbarContent, TableToolbarSearch, Modal, Dropdown, TextInput } from '@carbon/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { isLessThan30Seconds } from '../Methods/Time';

const headers = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "board",
    header: "Board",
  },
  {
    key: "status",
    header: "Status",
  },
];

const DevicesList = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newBoard, setNewBoard] = useState('');
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDevicetemplate, setNewDeviceTemplate] = useState({});
    const [newDeviceTemplateId, setNewDeviceTemplateId] = useState({});
    const [availableNewDevicetemplate, setAvailableNewDevicetemplate] = useState({});

    const navigate = useNavigate();
    const {deviceList, time} = useLoaderData();

    console.log(deviceList);
    
    const [rows, setRows] = useState(deviceList.map((val) => 
        ({...val, 
            status:isLessThan30Seconds(new Date(time), new Date(val.lastActiveTime)) 
                ? 'Online' : 'Offline'}))
);
    


    useEffect(() => {        
        axios.get('/templates')
            .then((res) => res.data)
            .then((data) => {
                let templatesList = data.filter((val) => val.board === newBoard)
                    .map((val) =>  ({label: val.name, name:val.name, id:val.id }))

                console.log(templatesList)
                setAvailableNewDevicetemplate(templatesList)
            })

    }, [newBoard])

    const applySearchFilter = (keyword) => {        
        setRows(
          deviceList.filter((val) =>
            val.name.toLowerCase().includes(keyword.toLowerCase())
          )
        );
    }

    const newDevice = () => {
        console.log(newDevicetemplate);
        
        axios.post(`/device`, {
            name: newDeviceName,
            templateId: newDeviceTemplateId,
            board: newBoard
        }).then((res) => setIsDialogOpen(false))
    }
    return (
        <>
            <DataTable rows={rows} headers={headers} isSortable>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Devices" description="With filtering">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch  onChange={(e) => applySearchFilter(e.target.value)}/>
                                {/* <TableToolbarMenu>
                                    <TableToolbarAction>
                                        Action 1
                                    </TableToolbarAction>
                                    <TableToolbarAction>
                                        Action 2
                                    </TableToolbarAction>
                                    <TableToolbarAction>
                                        Action 3
                                    </TableToolbarAction>
                                </TableToolbarMenu> */}
                                <Button renderIcon={Add} onClick={() => setIsDialogOpen(true)} >New Device</Button>
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
                                {/* <PaginationNav itemsShown={10} totalItems={25} /> */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>

            <Modal open={isDialogOpen}
                onRequestClose={() => setIsDialogOpen(false)}
                onRequestSubmit={() => newDevice()}
                modalHeading="Create a new template"
                primaryButtonText="Create"
                secondaryButtonText="Cancel"
            >
                <Dropdown
                    label="Board"
                    titleText="Board"
                    value={newBoard}
                    onChange={(e) => { 
                        setNewDeviceTemplate('Select Template');
                        setNewBoard(e.selectedItem.name) }}
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

                <Dropdown
                    label="Select Template"
                    titleText="Template"
                    value={newDevicetemplate}
                    selectedItem={newDevicetemplate}
                    onChange={(e) => { setNewDeviceTemplate(e.selectedItem.name);
                        setNewDeviceTemplateId(e.selectedItem.id);
                     }}
                    items={availableNewDevicetemplate} />

                <TextInput labelText="Device name"
                    value={newDeviceName}
                    onChange={(e) => { setNewDeviceName(e.target.value) }} />

            </Modal>
        </>
    );
}

export const deviceListLoader = async () => {
    const deviceList = await axios.get('/devices')
        .then((res) => {
            console.log(res);
         return res.data})
    const time = await axios.get(`/time`)
        .then((res) => res.data)
    return {deviceList, time};
}

export default DevicesList;