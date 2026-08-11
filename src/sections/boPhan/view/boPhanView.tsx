import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getAllBp, importBp } from 'src/apis/boPhan';
import { DashboardContent } from 'src/layouts/dashboard';

import { showAlert } from 'src/components/alert';
import { useTable } from 'src/components/use-table';
import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { handleExportData } from 'src/components/export';
import { useModal, ModalManager } from 'src/components/modal';
import { TableNoData } from 'src/components/table-empty/table-no-data';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { EditBp } from '../editBp/editBp';
import { CreateBoPhan } from '../createBp';
import { BpTableHead } from '../bp-table-head';
import { BpTableToolbar } from '../bp-table-toolbar';
import { BpTableRow, type BpProps } from '../bp-table-row';
import { emptyRows, applyFilter, getComparator } from '../utils';

export function BoPhanView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { open, data, closeModal, openModal } = useModal();

  const { data: dataBp = [] } = useQuery<BpProps[]>({
    queryKey: ['dataBp'],
    queryFn: getAllBp,
  });

  const dataFiltered: BpProps[] = applyFilter({
    inputData: dataBp,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => importBp(file),

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Import thành công',
      });

      queryClient.invalidateQueries({
        queryKey: ['dataBp'],
      });
    },

    onError: (err) => {
      showAlert({
        type: 'error',
        message: String(err),
      });
    },
  });

  const handleImport = () => {
    fileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    mutation.mutate(file);

    e.target.value = '';
  };
  return (
    <DashboardContent>
      <PageHeader
        title="Quản lý bộ phận"
        action={
          <ButtonGroup
            handleImport={handleImport}
            handleOpen={() => openModal('createBp')}
            handleExport={() =>
              handleExportData({
                data: dataFiltered,
                fileName: 'Danh sách bộ phận',
                columns: headLabel.boPhan,
              })
            }
          />
        }
      />
      <PrimaryTemp
        toolbar={
          <BpTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
          />
        }
        head={
          <BpTableHead
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
            headLabel={headLabel.boPhan}
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
            <BpTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelectRow={() => table.onSelectRow(row.id)}
              onEdit={() => openModal('editBp', row)}
            />
          ))}

        <TableEmptyRows
          height={68}
          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
        />
        {notFound && <TableNoData searchQuery={filterName} />}
      </PrimaryTemp>

      <ModalManager open={!!open} handleClose={closeModal}>
        {open === 'createBp' && <CreateBoPhan handleClose={closeModal} />}
        {open === 'editBp' && <EditBp handleClose={closeModal} rowSelect={data} />}
      </ModalManager>
      <input ref={fileRef} type="file" hidden accept=".xlsx,.xls" onChange={handleChangeFile} />
    </DashboardContent>
  );
}
