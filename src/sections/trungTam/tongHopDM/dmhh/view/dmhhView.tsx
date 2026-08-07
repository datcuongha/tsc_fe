import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Backdrop, CircularProgress } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllDmhh, importDmhh } from 'src/apis/danhMuc';

import { showAlert } from 'src/components/alert';
import { useTable } from 'src/components/use-table';
import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { applyFilter, getComparator } from '../utils';
import { DanhMucTableRow } from '../danhMuc-table-row';
import { DanhMucTableHead } from '../danhMuc-table-head';
import { DanhMucTableToolbar } from '../danhMuc-table-toolbar';

export function Dmhh() {
  const queryClient = useQueryClient();
  const filetRef = useRef<HTMLInputElement>(null);
  // const { user } = useAuth();
  const [filterName, setFilterName] = useState('');

  const table = useTable();

  const { data: dataDmhh = [] } = useQuery({
    queryKey: ['dataDmhh'],
    queryFn: getAllDmhh,
  });

  const dataFiltered = applyFilter({
    inputData: dataDmhh,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const handleImport = () => {
    filetRef.current?.click();
  };

  const handleAddFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    mutation.mutate(file);
    e.target.value = '';
  };

  const mutation = useMutation({
    mutationFn: (file: File) => importDmhh(file),

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Import thành công',
      });
      queryClient.invalidateQueries({
        queryKey: ['dataDmhh'],
      });
    },
    onError: (err) => {
      showAlert({
        type: 'error',
        message: String(err),
      });
    },
  });

  return (
    <DashboardContent>
      <PageHeader title="Danh mục hàng hoá" action={<ButtonGroup handleImport={handleImport} />} />

      <PrimaryTemp
        toolbar={
          <DanhMucTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
          />
        }
        head={
          <DanhMucTableHead
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
            headLabel={headLabel.danhMucHangHoa}
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
            <DanhMucTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelectRow={() => table.onSelectRow(row.id)}
            />
          ))}
      </PrimaryTemp>

      <Backdrop
        open={mutation.isPending}
        onClick={(e) => e.preventDefault()}
        sx={(theme) => ({
          color: '#fff',
          zIndex: theme.zIndex.modal + 999,
          flexDirection: 'column',
          gap: 2,
        })}
      >
        <CircularProgress color="inherit" />
        <div>Đang xử lý, vui lòng chờ...</div>
      </Backdrop>
      <input type="file" ref={filetRef} hidden accept=".xlsx,.xls" onChange={handleAddFileImport} />
    </DashboardContent>
  );
}
