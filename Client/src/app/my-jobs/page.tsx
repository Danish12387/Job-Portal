"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import MainLayout from "@/components/MainLayout"

const data: Job[] = [
    {
        id: "1",
        title: "Laravel Developer",
        jobType: "Full Time",
        postedDate: "05/06/2022",
        applicationDeadline: "Full Time",
    },
    {
        id: "2",
        title: "Laravel Developer",
        jobType: "Full Time",
        postedDate: "01/06/2022",
        applicationDeadline: "Full Time",
    },
    {
        id: "3",
        title: "Laravel Developer",
        jobType: "Full Time",
        postedDate: "12/02/2022",
        applicationDeadline: "Full Time",
    },
    {
        id: "4",
        title: "Laravel Developer",
        jobType: "Full Time",
        postedDate: "12/06/2025",
        applicationDeadline: "Full Time",
    },
    {
        id: "5",
        title: "Laravel Developer",
        jobType: "Full Time",
        postedDate: "12/06/2021",
        applicationDeadline: "Full Time",
    },
    {
        id: "6",
        title: "Laravel Developer",
        jobType: "Full Time",
        postedDate: "11/02/2026",
        applicationDeadline: "Full Time",
    },
    {
        id: "7",
        title: "Laravel Developer",
        jobType: "Full Time",
        postedDate: "12/06/2022",
        applicationDeadline: "Full Time",
    },
]

export type Job = {
    id: string
    title: string
    jobType: string
    postedDate: string
    applicationDeadline: string
}

const columns: ColumnDef<Job>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "jobType",
        header: "Job Type",
        cell: ({ row }) => <div className="capitalize">{row.getValue("jobType")}</div>,
    },
    {
        accessorKey: "postedDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Posted Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("postedDate")}</div>,
    },
    {
        accessorKey: "applicationDeadline",
        header: "Application Deadline",
        cell: ({ row }) => <div>{row.getValue("applicationDeadline")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
            const job = row.original;

            return (
                <div className="flex items-center justify-start space-x-2 w-fit">
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            )
        },
    },
]

export default function JobListingsDataTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <MainLayout>
            <h1 className='w-ful text-2xl font-semibold text-center bg-gray-100 py-6'>My Jobs list</h1>
            <div className="container my-5 mx-auto">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter titles..."
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("title")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={`${flexRender(cell.column.columnDef.cell, cell.getContext())?.props?.column?.id === 'postedDate' ? "pl-10" : ""}`}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}