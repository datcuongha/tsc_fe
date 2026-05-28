import { InvoiceProps } from "../invoice-table-row";

export type ViewXmlProps = {
    handleClose: () => void
    rowSelect: InvoiceProps | null

}

export type ViewXmlForm={
    id:number;
    file:File;
}
