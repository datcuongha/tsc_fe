import type { InvoiceProps } from "../invoice-table-row";

export type ViewXmlProps = {
    handleClose: () => void
    rowSelect: InvoiceProps | null

}

export type ViewXmlForm={
    id:string;
    file:File;
}
