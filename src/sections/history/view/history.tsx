import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllHistory } from 'src/apis/history';
import { DashboardContent } from 'src/layouts/dashboard';

import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { handleExportData } from 'src/components/export';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { useTable } from 'src/sections/invoice-it/view';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { HistoryTableHead } from '../history-table-head';
import { HistoryTableToolbar } from '../history-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { HistoryTableRow, type HistoryProps } from '../history-table-row';

export function History() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');

  const { data: dataHistory = [] } = useQuery({
    queryKey: ['dataHistory'],
    queryFn: getAllHistory,
  });

  const dataFiltered: HistoryProps[] = applyFilter({
    inputData: dataHistory,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <PageHeader
        title="Lịch sử thao tác"
        action={
          <ButtonGroup
            handleExport={() =>
              handleExportData({
                data: dataFiltered,
                fileName: 'Lịch sử',
                columns: headLabel.history,
              })
            }
          />
        }
      />
      <PrimaryTemp
        toolbar={
          <HistoryTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
          />
        }
        head={
          <HistoryTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={dataFiltered.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((u) => u.id)
              )
            }
            headLabel={headLabel.history}
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
            <HistoryTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelectRow={() => table.onSelectRow(row.id)}
            />
          ))}
        <TableEmptyRows
          height={68}
          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
        />
        {notFound && <TableNoData searchQuery={filterName} />}
      </PrimaryTemp>
    </DashboardContent>
  );
}
