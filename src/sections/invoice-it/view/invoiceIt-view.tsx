import Swal from "sweetalert2";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Box, Card, Table, TableRow, TableBody, TableCell, Typography, TableContainer, TablePagination } from "@mui/material";

import { delInv, getInvoiceXlm } from "src/apis/it";
import { DashboardContent } from "src/layouts/dashboard";

import { showAlert } from "src/components/alert";
import { ModalManager } from "src/components/modal";
import { ButtonGroup } from "src/components/button";
import { Scrollbar } from "src/components/scrollbar";
import { handleExportData } from "src/components/export";
import { headLabel, itemHinhThucHoaDon } from "src/components/Item/item";

import { TableNoData } from "src/sections/user/table-no-data";
import { TableEmptyRows } from "src/sections/user/table-empty-rows";

import { ViewXml } from "../viewXml";
import { EditXml } from "../editXml";
import { ImportXml } from "../importXml";
import { CreateXml } from "../createXml";
import { InvoiceTableRow } from "../invoice-table-row";
import { InvoiceTableHead } from "../invoice-table-head";
import { InvoiceTableToolbar } from "../invoice-table-toolbar";
import { emptyRows, getComparator, applyFilterIvn, } from "../utils";

import type { InvoiceProps} from "../invoice-table-row";


export function InvoiceItView() {
  const queryClient = useQueryClient()
  const table = useTable()
  const [filterName, setFilterName] = useState("")
  const [openImport, setOpenImport] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [rowSelect, setRowSelect] = useState<InvoiceProps | null>(null);
  const [openView, setOpenView] = useState(false)
  
  // Modal Create
  const handleOpenCreate = () => {
    setOpenCreate(true)
  }
  const handleCloseCreate = () => {
    setOpenCreate(false)
  }

  // Modal Import
  const handleOpenImport = () => {
    setOpenImport(true)
  }
  const handleCloseImport = () => {
    setOpenImport(false)
  }

  // Modal Edit
  const handleOpenEdit = (row: InvoiceProps) => {
    if (table.selected.length === 0) {
      showAlert({ type: 'error', message: 'Vui lòng chọn 1 dòng muốn sửa' })
      return
    }
    if (table.selected.length > 1) {
      showAlert({ type: 'error', message: 'Chỉ chọn 1 dòng' })
      return
    }
    setRowSelect(rowSelect)
    setOpenEdit(true)
  }
  const handleCloseEdit = () => { 
    setOpenEdit(false)
    setRowSelect(null)
    table.onSelectAllRows(false, []);
  }

  // Modal View
  const handeleOpenView = (row: InvoiceProps) => {
    if (table.selected.length === 0) {
      showAlert({ type: 'error', message: 'Vui lòng chọn 1 dòng để xem' })
      return
    }
    if (table.selected.length > 1) {
      showAlert({ type: 'error', message: 'Chỉ chọn 1 dòng' })
      return
    }
    setRowSelect(rowSelect)
    setOpenView(true)
  }
  const handleCloseView = () => {
    setOpenView(false)
    setRowSelect(null)
    table.onSelectAllRows(false, [])

  }

  const handleRemove = () => {
    Swal.fire({
      title: 'Bạn có chắc sẽ xóa dòng hóa đơn này',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xác nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        table.selected.forEach((selectedId) => {
          handleDelete(selectedId)
        })
        table.onSelectAllRows(false, []);
      }
    })
  }

  const { mutate: handleDelete } = useMutation<void, Error, number>({
    mutationFn: (id: number) => delInv(id),   // API xóa trên server
    onError: () => {
      showAlert({ type: 'error', message: 'Hóa đơn này không tồn tại hoặc đã được xóa' })
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Xóa thành công' })
      queryClient.invalidateQueries({
        queryKey: ['dataXml'],
      })
    },
  })


  const { data: dataXml = [] } = useQuery<InvoiceProps[]>({
    queryKey: ["dataXml"],
    queryFn: getInvoiceXlm
  })

  const dataFiltered = applyFilterIvn({
    inputData: dataXml.filter(item => item.status === true),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  })

  const notFound = !dataFiltered.length && !!filterName;


  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Invoices
        </Typography>
        <ButtonGroup
          handleOpen={handleOpenCreate}
          handleImport={handleOpenImport}
          handleExport={() => handleExportData({
            data: dataFiltered,
            fileName: 'Invoice IT',
            columns: headLabel,
          })}
        />
      </Box >
      <Card>
        <InvoiceTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          delInv={handleRemove}

        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <InvoiceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numberSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((item) => item.id)
                  )
                }
                headLabel={headLabel}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => { table.onSelectRow(row.id); setRowSelect(row) }}
                      onEditRow={() => handleOpenEdit(row)}
                      onViewRow={() => handeleOpenView(row)}
                    />
                  ))}

                <TableRow>
                  <TableCell colSpan={6} align="right" sx={{ fontWeight: 'bold' }}>
                    Tổng cộng:
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {dataFiltered.reduce((sum, r) => sum + (r.tienThue || 0), 0).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {dataFiltered.reduce((sum, r) => sum + (r.tongTien || 0), 0).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell />
                </TableRow>


                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataXml.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>

            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataXml.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[30, 50, 100]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Modal Import */}
      <ModalManager
        open={openImport}
        handleClose={handleCloseImport}
      >
        <ImportXml handleClose={handleCloseImport} />
      </ModalManager>

      {/* Modal Create*/}
      <ModalManager
        open={openCreate}
        handleClose={handleCloseCreate}
        maxWidth="xl"
      >
        <CreateXml handleClose={handleCloseCreate} dataLH={itemHinhThucHoaDon} />
      </ModalManager>

      <ModalManager
        open={openEdit}
        handleClose={handleCloseEdit}
        maxWidth="xl"
      >
        {rowSelect && (
          <EditXml handleClose={handleCloseEdit} dataLH={itemHinhThucHoaDon} rowSelect={rowSelect} />
        )}
      </ModalManager>

      <ModalManager
        open={openView}
        handleClose={handleCloseView}
        maxWidth="lg"
      >
        {rowSelect && (<ViewXml handleClose={handleCloseView} rowSelect={rowSelect} />)}
      </ModalManager>
    </DashboardContent >
  );

}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('ngayHd');
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: number[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: number) => {
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
      setRowsPerPage(parseInt(event.target.value, 30));
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
