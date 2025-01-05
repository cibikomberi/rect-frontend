import { Add } from '@carbon/icons-react';
import { Button, DataTable, Dropdown, Modal, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch, TextInput } from '@carbon/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { isLessThan30Seconds } from '../Methods/Time';
import { customSortRow } from '../Methods/Sort';

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
const devices = [{
    id: 'one',
    label: 'ESP32',
    name: 'ESP32'
}, {
    id: 'two',
    label: 'ESP8266',
    name: 'ESP8266'
}];


const DevicesList = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [newBoard, setNewBoard] = useState('');
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDevicetemplate, setNewDeviceTemplate] = useState({});
    const [newDeviceTemplateId, setNewDeviceTemplateId] = useState({});
    const [availableNewDevicetemplate, setAvailableNewDevicetemplate] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortColumn, setSortColumn] = useState(null); // Track sort column
    const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction

    const navigate = useNavigate();
    const { deviceList, time } = useLoaderData();

    const [rows, setRows] = useState(deviceList);

    const filteredRows = rows
        .filter((val) => val.name.toLowerCase().includes(searchKeyword.toLowerCase()))
        .map((val) => ({
            ...val,
            status: isLessThan30Seconds(new Date(time), new Date(val.lastActiveTime)) ? 'Online' : 'Offline'
        }));

    const sortedRows = sortColumn
        ? [...filteredRows].sort((a, b) =>
            customSortRow(a[sortColumn], b[sortColumn], {
                sortDirection,
                sortStates: { ASC: 'ASC', DESC: 'DESC' },
                locale: navigator.language,
            })
        )
        : filteredRows;

    const paginatedRows = sortedRows.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        axios.get('/templates')
            .then((res) => res.data)
            .then((data) => {
                let templatesList = data.filter((val) => val.board === newBoard)
                    .map((val) => ({ label: val.name, name: val.name, id: val.id }))

                setAvailableNewDevicetemplate(templatesList)
            })
    }, [newBoard])

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleSort = (headerKey) => {
        if (sortColumn === headerKey) {
            setSortDirection((prev) =>
                prev === 'ASC' ? 'DESC' : prev === 'DESC' ? 'NONE' : 'ASC'
            );
        } else {
            setSortColumn(headerKey);
            setSortDirection('ASC');
        }
    };

    const handlePaginationChange = ({ page, pageSize }) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    const newDevice = () => {
        setErrorMessage("")
        axios.post(`/device`, {
            name: newDeviceName,
            templateId: newDeviceTemplateId,
            board: newBoard
        }).then((res) => {
            setRows((prevRows) => [
                {
                    ...res.data,
                    status: 'Offline'
                }, ...prevRows
            ]);
            setIsDialogOpen(false)
        }).catch(() => setErrorMessage('Error creating device'));
    }
    
    return (
        <>
            <DataTable rows={paginatedRows} headers={headers} isSortable>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Devices">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch onChange={handleSearch} />
                                <Button renderIcon={Add} onClick={() => setIsDialogOpen(true)} >New Device</Button>
                            </TableToolbarContent>
                        </TableToolbar>
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader
                                            {...getHeaderProps({ header })}
                                            isSortHeader={sortColumn === header.key}
                                            sortDirection={sortDirection}
                                            onClick={() => handleSort(header.key)}
                                            isSortable>
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
                        <Pagination
                            page={currentPage}
                            pageSize={pageSize}
                            pageSizes={[5, 10, 15]}
                            totalItems={filteredRows.length}
                            onChange={handlePaginationChange}
                        />                    
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
                        setNewBoard(e.selectedItem.name)
                    }}
                    items={devices} style={{
                        marginBottom: '1rem'
                    }} />

                <Dropdown
                    label="Select Template"
                    titleText="Template"
                    value={newDevicetemplate}
                    selectedItem={newDevicetemplate}
                    onChange={(e) => {
                        setNewDeviceTemplate(e.selectedItem.name);
                        setNewDeviceTemplateId(e.selectedItem.id);
                    }}
                    items={availableNewDevicetemplate} />

                <TextInput labelText="Device name"
                    value={newDeviceName}
                    onChange={(e) => { setNewDeviceName(e.target.value) }} />
                <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>

            </Modal>
        </>
    );
}

export const deviceListLoader = async () => {
    const deviceList = await axios.get('/devices')
        .then((res) => {
            return res.data
        })
    const time = await axios.get(`/time`)
        .then((res) => res.data)
    return { deviceList, time };
}

export default DevicesList;