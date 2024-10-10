import { Add } from '@carbon/icons-react';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer, Button, TableToolbar, TableToolbarContent, TableToolbarSearch, TableToolbarMenu, TableToolbarAction } from '@carbon/react';
import { Link, useNavigate } from 'react-router-dom';

const DevicesList = () => {
    const navigate = useNavigate();
    const rows = [
        {
            id: 'a',
            name: 'Weather monitoring',
            board: 'ESP32',
            status: 'Online',
        },
        {
            id: 'b',
            name: 'Irrigation System',
            board: 'ESP32',
            status: 'Offline',
        },
        {
            id: 'c',
            name: 'Bus Tracker',
            board: 'ESP8266',
            status: 'Offline',
        },
    ];
    const headers = [
        {
            key: 'name',
            header: 'Name',
        },
        {
            key: 'board',
            header: 'Board',
        },
        {
            key: 'status',
            header: 'Status',
        },
    ];

    return (
        <>
            <DataTable rows={rows} headers={headers} isSortable>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Devices" description="With filtering">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch />
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
                                <Button renderIcon={Add} as={Link} to={'new'}>New Device</Button>
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
                                    <TableRow {...getRowProps({ row })} onClick={() => navigate(`view/${row.id}`)}>
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
        </>
    );
}

export default DevicesList;