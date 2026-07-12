import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function UsersTable() {
  const [users, setUsers] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));

      const data = [];

      snap.forEach((doc) => {
        const user = doc.data();

        if (user.role === "user") {
          data.push({
            id: doc.id,
            ...user,
          });
        }
      });
      console.log(data)
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Active / Inactive
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (statusFilter === "active") {
      filtered = filtered.filter((u) => u.isActive);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((u) => !u.isActive);
    }

    // Global Search
    if (globalFilter.trim() !== "") {
      const search = globalFilter.toLowerCase();

      filtered = filtered.filter((user) => {
        return (
          user.fname?.toLowerCase().includes(search) ||
          user.lname?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.phone_number?.toLowerCase().includes(search)
        );
      });
    }

    return filtered;
  }, [users, statusFilter, globalFilter]);

  const columns = useMemo(
    () => [
      {
        header: "First Name",
        accessorKey: "fname",
      },
      {
        header: "Last Name",
        accessorKey: "lname",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Phone",
        accessorKey: "phone_number",
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              Active
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
              Inactive
            </span>
          ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Registered Users
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-emerald-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-5 py-4 text-left text-white cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {{
                      asc: <ArrowUp size={16} />,
                      desc: <ArrowDown size={16} />,
                    }[header.column.getIsSorted()] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          <strong>{table.getPageCount()}</strong>
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
