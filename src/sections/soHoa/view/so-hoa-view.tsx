import { useState, useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { headLabel } from 'src/components/Item/item';
import { handleExportData } from 'src/components/export';
import { useModal, ButtonGroup } from 'src/components/button';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { getComparator } from 'src/sections/invoice-it/utils';

import { applyFilter } from '../utils';
import { SoHoaTableHead } from '../soHoa-table-head';
import { SoHoaTableToolbar } from '../soHoa-table-toolbar';
import { SoHoaTableRow, type SoHoaProps } from '../soHoa-table-row';

// ----------------------------------------------------------------------

export function SoHoaView() {
  const table = useTable();
  const { open, data, closeModal, openModal } = useModal();
  const [filterName, setFilterName] = useState('');
  const dataSoHoa = [
    {
      id: 1,
      loaiVb: 'Tờ trình',
      ngayVb: '01-01-2026',
      soVb: '1Tr',
      noiDung: 'Xin chủ trương mua laptop',
      boPhan: 'Công nghệ thong tin',
      file: '',
      hopDongs: [
        {
          id: 1,
          loaiVb: 'Hợp đồng',
          ngayVb: '01-01-2026',
          soVb: 'HD001',
          noiDung: 'HD mua laptop Dell',
          file:''
        },
        {
          id: 2,
          loaiVb: 'Hợp đồng',
          ngayVb: '01-01-2026',
          soVb: 'HD002',
          noiDung: 'HD mua laptop HD',
          file:''
        },
      ],
    },
    {
      id: 2,
      loaiVb: 'Tờ trình',
      ngayVb: '01-01-2026',
      noiDung: 'Gia hạn phần mềm',
      boPhan: 'Công nghệ thong tin',
      soVb: '12Tr',
      file: '',
    },
  ];
  const dataFiltered: SoHoaProps[] = applyFilter({
    inputData: dataSoHoa,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  return (
    <DashboardContent>
      <PageHeader
        title="Quản lý tài liệu"
        action={
          <ButtonGroup
            handleExport={() =>
              handleExportData({
                data: dataFiltered,
                fileName: 'Tài liệu số hoá',
                columns: headLabel.soHoa,
              })
            }
          />
        }
      />
      <PrimaryTemp
        toolbar={
          <SoHoaTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
          />
        }
        head={
          <SoHoaTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={dataFiltered.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((u) => String(u.id))
              )
            }
            headLabel={headLabel.soHoa}
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
            <SoHoaTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(String(row.id))}
              onSelectRow={() => table.onSelectRow(String(row.id))}
            />
          ))}
      </PrimaryTemp>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

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
