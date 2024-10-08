import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer, Button, TableToolbar, TableToolbarContent, TableToolbarSearch, TableToolbarMenu, TableToolbarAction } from '@carbon/react';

const TemplatesList = () => {
    const rows = [
        {
            id: 'a',
            name: 'Load balancer 1',
            status: 'Disabled',
        },
        {
            id: 'b',
            name: 'Load balancer 2',
            status: 'Starting',
        },
        {
            id: 'c',
            name: 'Load balancer 3',
            status: 'Active',
        },
    ];
    const headers = [
        {
            key: 'name',
            header: 'Name',
        },
        {
            key: 'status',
            header: 'Status',
        },
    ];
    return (
        <>
            <DataTable rows={rows} headers={headers}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="DataTable" description="With filtering">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch />
                                <TableToolbarMenu>
                                    <TableToolbarAction>
                                        Action 1
                                    </TableToolbarAction>
                                    <TableToolbarAction>
                                        Action 2
                                    </TableToolbarAction>
                                    <TableToolbarAction>
                                        Action 3
                                    </TableToolbarAction>
                                </TableToolbarMenu>
                                <Button>Primary Button</Button>
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
                                    <TableRow {...getRowProps({ row })}>
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