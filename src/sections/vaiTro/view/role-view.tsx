import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDataRole } from 'src/apis/role';
import { DashboardContent } from 'src/layouts/dashboard';

import { useTable } from 'src/components/use-table';
import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { useModal, ModalManager } from 'src/components/modal';
import { TableNoData } from 'src/components/table-empty/table-no-data';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { EditRole } from '../editRole';
import { CreateRole } from '../createRole';
import { RoleTableHead } from '../role-table-head';
import { RoleTableToolbar } from '../role-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { RoleTableRow, type RoleProps } from '../role-table-row';

// ----------------------------------------------------------------------

export function RoleView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { open, openModal, closeModal, data } = useModal();

  const { data: dataRole = [] } = useQuery({
    queryKey: ['dataRole'],
    queryFn: getDataRole,
  });

  const tableData = Array.isArray(dataRole)
    ? dataRole
    : (dataRole?.data ?? dataRole?.content ?? []);

  const dataFiltered: RoleProps[] = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <PageHeader
        title="Quản lý vai trò"
        action={<ButtonGroup handleOpen={() => openModal('create')} />}
      />

      <PrimaryTemp
        toolbar={
          <RoleTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
          />
        }
        head={
          <RoleTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={dataFiltered.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((i) => i.id)
              )
            }
            headLabel={headLabel.role}
          />
        }
        pagination={{
          page: table.page,
          count: dataFiltered.length,
          rowsPerPage: table.rowsPerPage,
          onPageChange: table.onChangePage,
          onRowsPerPageChange: table.onChangeRowsPerPage,
        }}
      >
        {dataFiltered
          .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
          .map((row) => (
            <RoleTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelectRow={() => table.onSelectRow(row.id)}
              edit={() => openModal('edit', row)}
            />
          ))}

        <TableEmptyRows
          height={68}
          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
        />

        {notFound && <TableNoData searchQuery={filterName} />}
      </PrimaryTemp>

      <ModalManager open={!!open} handleClose={closeModal} maxWidth='lg'>
        {open === 'create' && <CreateRole handleClose={closeModal} />}
        {open === 'edit' && data && <EditRole rowSelect={data} handleClose={closeModal} />}
      </ModalManager>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
