import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import dayjs from "dayjs";
import { Edit2, Trash2, Copy } from "lucide-react";
import { User } from "./Entity.types";

interface ColumnOptions {
  onEdit: (user: User) => void;
  onCopy: (user: User) => void;
  onDelete: (user: User) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const getUserColumns = ({
  onEdit,
  onCopy,
  onDelete,
  canEdit = true,
  canDelete = true
}: ColumnOptions): ColDef<User>[] => {
  return [
    {
      field: "fullName",
      headerName: "User",
      minWidth: 200,
      flex: 1.5,
      cellRenderer: (params: ICellRendererParams<User>) => {
        const user = params.data;
        if (!user) return null;
        return (
          <div className="flex items-center gap-2.5 h-full">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold text-xs">
              {user.firstName?.[0] || user.email[0]}
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {user.fullName || `${user.firstName} ${user.lastName}`}
              </span>
              <span className="text-[11px] text-slate-400">{user.email}</span>
            </div>
          </div>
        );
      }
    },
    {
      field: "roles",
      headerName: "Roles",
      minWidth: 140,
      flex: 1,
      cellRenderer: (params: ICellRendererParams<User>) => {
        const roles = params.value as string[] | undefined;
        if (!roles || roles.length === 0) {
          return <span className="text-slate-400 text-xs">None</span>;
        }
        return (
          <div className="flex items-center gap-1 h-full flex-wrap">
            {roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {role}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      cellRenderer: (params: ICellRendererParams<User>) => {
        const isActive = params.value as boolean;
        return (
          <div className="flex items-center h-full">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      }
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 140,
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.value) return null;
        return (
          <div className="flex items-center h-full text-xs text-slate-500 dark:text-slate-400">
            {dayjs(params.value).format("MMM D, YYYY")}
          </div>
        );
      }
    },
    {
      headerName: "Actions",
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<User>) => {
        const user = params.data;
        if (!user) return null;

        return (
          <div className="flex items-center gap-1 h-full">
            {canEdit && (
              <button
                onClick={() => onEdit(user)}
                title="Edit User"
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onCopy(user)}
              title="Copy User Payload"
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(user)}
                title="Delete User"
                className="p-1 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      }
    }
  ];
};
