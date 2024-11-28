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
import { ArrowUpDown, ChevronDown, Loader2, MoreHorizontal } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

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
} from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from 'lucide-react'
import MainLayout from "@/components/MainLayout"
import { deleteAllJobs, deleteJob, getUserJobs, Job } from "@/utils/apiHandlers"
import EditJobDialog from "@/components/EditJobDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { setUserJobsState } from "@/lib/features/job/jobSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

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
        accessorKey: "jobTitle",
        header: "Title",
        cell: ({ row }) => <div className="capitalize">{row.getValue("jobTitle")}</div>,
    },
    {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
    },
    {
        accessorKey: "jobType",
        header: "Job Type",
        cell: ({ row }) => <div className="capitalize">{row.getValue("jobType")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Posted Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div title={format(date, 'PPP')}>{formatDistanceToNow(date, { addSuffix: true })}</div>
        },
    },
    {
        accessorKey: "applicationDeadline",
        header: "Application Deadline",
        cell: ({ row }) => {
            const date = new Date(row.getValue("applicationDeadline"))
            return <div>{format(date, 'PPP')}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
            const job = row.original;
            const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
            const [showWarning, setShowWarning] = React.useState<boolean>(false);
            const dispatch = useAppDispatch();

            const deleteJobFn = async () => {
                setShowWarning(true);
            }

            const cancelDelete = () => {
                setShowWarning(false);
            }

            const confirmDelete = async () => {
                setDeleteLoading(true);
                await deleteJob(job._id);

                const response = await getUserJobs();
                if (response) {
                    dispatch(setUserJobsState(response));
                }
                setDeleteLoading(false);
            }

            return (
                <div className="flex items-center justify-start space-x-2 w-fit">
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4 text-green-500" />
                    </Button>
                    <EditJobDialog jobDetails={job} />
                    <Button variant="ghost" size="icon" onClick={deleteJobFn}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{job?.jobTitle}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure. You want to delete this job?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                                {
                                    deleteLoading ?
                                        <AlertDialogAction disabled>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Deleting...
                                        </AlertDialogAction>
                                        :
                                        <AlertDialogAction onClick={confirmDelete}>Confirm delete</AlertDialogAction>
                                }
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
    const [isLoading, setIsLoading] = React.useState(true);
    const [deleteAllJobsLoading, setDeleteAllJobsLoading] = React.useState(false);
    const [showWarning, setShowWarning] = React.useState(false);
    const { userJobsState } = useAppSelector(state => state.jobs);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const fetchUserJobs = async () => {
            setIsLoading(true)
            const res = await getUserJobs();
            if (res) {
                dispatch(setUserJobsState(res));
            }
            setIsLoading(false)
        }
        fetchUserJobs()
    }, []);

    const deleteAllSelectedJobs = async () => {
        setShowWarning(true);
    }

    const cancelDelete = () => {
        setShowWarning(false);
    }

    const confirmDelete = async () => {
        setDeleteAllJobsLoading(true);
        const jobIds = userJobsState.map(job => job._id);

        const res = await deleteAllJobs(jobIds);
        if (res) {
            const response = await getUserJobs();
            if (response) {
                dispatch(setUserJobsState(response));
            }
        }

        setDeleteAllJobsLoading(false);
    }

    const table = useReactTable({
        data: userJobsState,
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

    const selectedJobs = table.getFilteredSelectedRowModel().rows;

    return (
        <MainLayout>
            <h1 className='w-full text-2xl font-semibold text-center bg-gray-100 py-6'>My Jobs List</h1>
            <div className="container my-5 mx-auto">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter job titles..."
                        value={(table.getColumn("jobTitle")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("jobTitle")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {selectedJobs.length > 0 && (
                        <Button variant="destructive" className="ml-2 text-sm px-3" onClick={deleteAllSelectedJobs}>
                            Delete Selected ({selectedJobs.length})
                        </Button>
                    )}
                    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete All Jobs</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure. You want to delete all selected job?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                                {
                                    deleteAllJobsLoading ?
                                        <AlertDialogAction disabled>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Deleting...
                                        </AlertDialogAction>
                                        :
                                        <AlertDialogAction onClick={confirmDelete}>Confirm delete</AlertDialogAction>
                                }
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
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