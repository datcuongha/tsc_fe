import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllSoHoa } from 'src/apis/soHoa';
import { DashboardContent } from 'src/layouts/dashboard';

import { useTable } from 'src/components/use-table';
import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { handleExportData } from 'src/components/export';
import { useModal, ModalManager } from 'src/components/modal';
import { TableNoData } from 'src/components/table-empty/table-no-data';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { getComparator } from 'src/sections/invoice-it/utils';

import { EditSoHoa } from '../editSoHoa';
import { CreateSoHoa } from '../createSoHoa';
import { emptyRows, applyFilter } from '../utils';
import { SoHoaTableHead } from '../soHoa-table-head';
import { SoHoaTableToolbar } from '../soHoa-table-toolbar';
import { SoHoaTableRow, type SoHoaProps } from '../soHoa-table-row';

export function SoHoaView() {
  const table = useTable();
  const { open, data, closeModal, openModal } = useModal();
  const [filterName, setFilterName] = useState('');

  const { data: dataSoHoa = [] } = useQuery<SoHoaProps[]>({
    queryKey: ['dataSoHoa'],
    queryFn: getAllSoHoa,
  });
  console.log(dataSoHoa);

  const dataSoHoaFiltered = dataSoHoa.filter((item) => item.parentId === null);

  const dataFiltered: SoHoaProps[] = applyFilter({
    inputData: dataSoHoa,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <PageHeader
        title="Quản lý tài liệu"
        action={
          <ButtonGroup
            handleOpen={() => openModal('createSoHoa')}
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
              onEditSoHoa={(selectedRow) => openModal('editSoHoa', selectedRow)}
            />
          ))}
        <TableEmptyRows
          height={68}
          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
        >
          {notFound && <TableNoData searchQuery={filterName} />}
        </TableEmptyRows>

      </PrimaryTemp>

      <ModalManager open={!!open} handleClose={closeModal}>
        {open === 'createSoHoa' && (
          <CreateSoHoa data={dataSoHoaFiltered} handleClose={closeModal} />
        )}
        {open === 'editSoHoa' && data && <EditSoHoa rowSelect={data} handleClose={closeModal} />}
      </ModalManager>
    </DashboardContent>
  );
}
