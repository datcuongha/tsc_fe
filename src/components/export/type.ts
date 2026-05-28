type Column ={
    id:string,
    label:string
}

export type exportInvProps=({
    data:Record<string,any>[],
    fileName:string,
    columns:Column[],
})