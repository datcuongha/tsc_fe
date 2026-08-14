import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getDataRole } from 'src/apis/role';
import { DashboardContent } from 'src/layouts/dashboard';

import { useTable } from 'src/components/use-table';
import { Scrollbar } from 'src/components/scrollbar';
import { headLabel } from 'src/components/Item/item';
import {  ButtonGroup } from 'src/components/button';
import { useModal, ModalManager } from 'src/components/modal';
import { TableNoData } from 'src/components/table-empty/table-no-data';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';

import { CreateRole } from '../createRole';
import { RoleTableRow } from '../role-table-row';
import { RoleTableHead } from '../role-table-head';
import { RoleTableToolbar } from '../role-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { RoleProps } from '../role-table-row';

// ----------------------------------------------------------------------

export function RoleView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { open, openModal, closeModal } = useModal ();

  const { data: dataRole = [] } = useQuery({
    queryKey: ['dataRole'],
    queryFn: getDataRole,
  });
 
  const dataFiltered: RoleProps[] = applyFilter({
    inputData: dataRole,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Quản lý vai trò
        </Typography>
        <ButtonGroup handleOpen={() => openModal('createRole')} />
      </Box>
      <Card>
        <RoleTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <RoleTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((name) => name.id)
                  )
                }
                headLabel={headLabel.role}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <RoleTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => {
                        table.onSelectRow(row.id);
                      }}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <ModalManager open={open === 'createRole'} handleClose={closeModal}>
        <CreateRole handleClose={closeModal} />
      </ModalManager>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
