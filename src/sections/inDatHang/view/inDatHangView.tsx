import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllDatHang } from 'src/apis/datHang';
import { DashboardContent } from 'src/layouts/dashboard';

import { ModalManager } from 'src/components/modal';
import { headLabel } from 'src/components/Item/item';
import { handleExportData } from 'src/components/export';
import { useModal, ButtonGroup } from 'src/components/button';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { InDeXuat } from '../inDeXuat';
import { TableNoData } from '../table-no-data';
import { InDonDatHang } from '../inDonDatHang';
import { EditDatHangTM } from '../editDatHangTM';
import { EditDonDatHang } from '../editDonDatHang';
import { TableEmptyRows } from '../table-empty-rows';
import { PrintDhTableHead } from '../printDh-table-head';
import { PrintDhtableToolbar } from '../printDh-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { PrintDhTableRow, type PrintDhProps } from '../printDh-table-row';

export function InDatHangView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { data, open, openModal, closeModal } = useModal();

  const { data: dataDH = [] } = useQuery<PrintDhProps[]>({
    queryKey: ['dataDH'],
    queryFn: getAllDatHang,
  });

  const dataFiltered: PrintDhProps[] = applyFilter({
    inputData: dataDH,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <PageHeader
        title="Đơn đặt hàng"
        action={
          <ButtonGroup
            handleExport={() =>
              handleExportData({
                fileName: 'Danh sách phiếu đặt hàng',
                columns: headLabel.deXuat,
                data: dataFiltered,
              })
            }
          />
        }
      />
      <PrimaryTemp
        toolbar={
          <PrintDhtableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
          />
        }
        head={
          <PrintDhTableHead
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
            headLabel={headLabel.deXuat}
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
            <PrintDhTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelectRow={() => table.onSelectRow(row.id)}
              printDX={() => openModal('inDeXuat', row)}
              printDDH={() => openModal('inDonDatHang', row)}
              editDDH={() => openModal('editDonDatHang', row)}
              editDatHangTM={() => openModal('editDatHangTM', row)}
            />
          ))}

        <TableEmptyRows
          height={68}
          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
        />
        {notFound && <TableNoData searchQuery={filterName} />}
      </PrimaryTemp>
      {open === 'inDeXuat' && data && (
        <ModalManager open handleClose={closeModal} maxWidth="xl">
          <InDeXuat data={data} handleClose={closeModal} />
        </ModalManager>
      )}

      {open === 'inDonDatHang' && data && (
        <ModalManager open handleClose={closeModal} maxWidth="md">
          <InDonDatHang data={data} handleClose={closeModal} />
        </ModalManager>
      )}

      {open === 'editDonDatHang' && data && (
        <ModalManager open handleClose={closeModal} maxWidth="xl">
          <EditDonDatHang data={data} handleClose={closeModal} />
        </ModalManager>
      )}
      {open === 'editDatHangTM' && data && (
        <ModalManager open handleClose={closeModal} maxWidth="xl">
          <EditDatHangTM data={data} handleClose={closeModal} />
        </ModalManager>
      )}
    </DashboardContent>
  );
}

// ------------------------------------------- //
export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
