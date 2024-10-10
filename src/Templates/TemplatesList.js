import { Add } from '@carbon/icons-react';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer, Button, TableToolbar, TableToolbarContent, TableToolbarSearch } from '@carbon/react';
import { Link, useNavigate } from 'react-router-dom';

const TemplatesList = () => {
    const navigate = useNavigate();
    const rows = [
        {
            id: 'a',
            name: 'Led Blink 1',
            board: 'ESP32',
        },
        {
            id: 'b',
            name: 'Led Blink 2',
            board: 'ESP32',
        },
        {
            id: 'c',
            name: 'Led Blink 3',
            board: 'ESP8266',
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
    ];
    return (
        <>
            <DataTable rows={rows} headers={headers} isSortable>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Templates">
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
                                <Button renderIcon={Add} as={Link} to={'new'}>New Template</Button>
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
                                    <TableRow {...getRowProps({ row })} onClick={() => navigate(`edit/${row.id}`)}>
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

export default TemplatesList;