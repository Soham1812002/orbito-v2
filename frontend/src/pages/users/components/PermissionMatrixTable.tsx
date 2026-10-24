import React, { useMemo } from "react";
import { Eye, Plus, Edit2, Trash2, Download, ShieldAlert, CheckSquare, Square, ShieldCheck, Layers } from "lucide-react";
import { ModulePermission } from "@/types/users.types";

interface PermissionMatrixTableProps {
  permissions: ModulePermission[];
  onChange: (updated: ModulePermission[]) => void;
  disabled?: boolean;
}

export const PermissionMatrixTable: React.FC<PermissionMatrixTableProps> = ({
  permissions,
  onChange,
  disabled = false
}) => {
  const handleToggle = (id: string, field: "view" | "add" | "edit" | "delete" | "export" | "control") => {
    if (disabled) return;
    const updated = permissions.map((p) => {
      if (p.id === id) {
        const nextVal = !p[field];
        const next = { ...p, [field]: nextVal };
        // Recalculate access level
        if (next.view && next.add && next.edit && next.delete && next.export && next.control) {
          next.accessLevel = "full" as const;
        } else if (next.view && !next.add && !next.edit && !next.delete && !next.control) {
          next.accessLevel = "view" as const;
        } else if (!next.view && !next.add && !next.edit && !next.delete && !next.export && !next.control) {
          next.accessLevel = "none" as const;
        } else {
          next.accessLevel = "custom" as const;
        }
        return next;
      }
      return p;
    });
    onChange(updated);
  };

  const handleAccessLevelChange = (id: string, level: "full" | "view" | "custom" | "none") => {
    if (disabled) return;
    const updated = permissions.map((p) => {
      if (p.id === id) {
        if (level === "full") {
          return { ...p, accessLevel: "full" as const, view: true, add: true, edit: true, delete: true, export: true, control: true };
        }
        if (level === "view") {
          return { ...p, accessLevel: "view" as const, view: true, add: false, edit: false, delete: false, export: true, control: false };
        }
        if (level === "none") {
          return { ...p, accessLevel: "none" as const, view: false, add: false, edit: false, delete: false, export: false, control: false };
        }
        return { ...p, accessLevel: "custom" as const };
      }
      return p;
    });
    onChange(updated);
  };

  const handleCategoryAccessLevel = (category: string, level: "full" | "view" | "none") => {
    if (disabled) return;
    const updated = permissions.map((p) => {
      if (p.category === category) {
        if (level === "full") {
          return { ...p, accessLevel: "full" as const, view: true, add: true, edit: true, delete: true, export: true, control: true };
        }
        if (level === "view") {
          return { ...p, accessLevel: "view" as const, view: true, add: false, edit: false, delete: false, export: true, control: false };
        }
        if (level === "none") {
          return { ...p, accessLevel: "none" as const, view: false, add: false, edit: false, delete: false, export: false, control: false };
        }
      }
      return p;
    });
    onChange(updated);
  };

  const handleToggleAllColumn = (field: "view" | "add" | "edit" | "delete" | "export" | "control") => {
    if (disabled) return;
    const allChecked = permissions.every((p) => p[field]);
    const nextVal = !allChecked;
    const updated = permissions.map((p) => {
      const next = { ...p, [field]: nextVal };
      if (next.view && next.add && next.edit && next.delete && next.export && next.control) {
        next.accessLevel = "full" as const;
      } else if (next.view && !next.add && !next.edit && !next.delete && !next.control) {
        next.accessLevel = "view" as const;
      } else if (!next.view && !next.add && !next.edit && !next.delete && !next.export && !next.control) {
        next.accessLevel = "none" as const;
      } else {
        next.accessLevel = "custom" as const;
      }
      return next;
    });
    onChange(updated);
  };

  const categoryGroups = useMemo(() => {
    const map = new Map<string, ModulePermission[]>();
    permissions.forEach((p) => {
      const list = map.get(p.category) || [];
      list.push(p);
      map.set(p.category, list);
    });
    return Array.from(map.entries());
  }, [permissions]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172B] shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4 text-2xs font-bold uppercase tracking-wider min-w-[220px]">
                Module / Feature
              </th>
              <th className="py-3 px-4 text-2xs font-bold uppercase tracking-wider min-w-[130px]">
                Preset Access
              </th>
              <th className="py-3 px-3 text-center min-w-[70px]">
                <button
                  type="button"
                  onClick={() => handleToggleAllColumn("view")}
                  className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-wider hover:text-blue-600 focus-ring rounded"
                  title="Toggle all View"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                  View
                </button>
              </th>
              <th className="py-3 px-3 text-center min-w-[70px]">
                <button
                  type="button"
                  onClick={() => handleToggleAllColumn("add")}
                  className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-wider hover:text-blue-600 focus-ring rounded"
                  title="Toggle all Add"
                >
                  <Plus className="h-3.5 w-3.5 text-slate-400" />
                  Add
                </button>
              </th>
              <th className="py-3 px-3 text-center min-w-[70px]">
                <button
                  type="button"
                  onClick={() => handleToggleAllColumn("edit")}
                  className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-wider hover:text-blue-600 focus-ring rounded"
                  title="Toggle all Edit"
                >
                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                  Edit
                </button>
              </th>
              <th className="py-3 px-3 text-center min-w-[70px]">
                <button
                  type="button"
                  onClick={() => handleToggleAllColumn("delete")}
                  className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-wider hover:text-rose-600 focus-ring rounded"
                  title="Toggle all Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                  Delete
                </button>
              </th>
              <th className="py-3 px-3 text-center min-w-[70px]">
                <button
                  type="button"
                  onClick={() => handleToggleAllColumn("export")}
                  className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-wider hover:text-emerald-600 focus-ring rounded"
                  title="Toggle all Export"
                >
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  Export
                </button>
              </th>
              <th className="py-3 px-3 text-center min-w-[70px]">
                <button
                  type="button"
                  onClick={() => handleToggleAllColumn("control")}
                  className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-wider hover:text-amber-600 focus-ring rounded"
                  title="Toggle all Control"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                  Control
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {categoryGroups.map(([category, items]) => (
              <React.Fragment key={category}>
                {/* Category Header Row */}
                <tr className="bg-slate-100/75 dark:bg-slate-800/50 border-y border-slate-200/80 dark:border-slate-800">
                  <td colSpan={2} className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="font-bold text-slate-900 dark:text-white tracking-wide text-xs uppercase">
                        {category}
                      </span>
                      <span className="text-2xs text-slate-400 font-normal">
                        ({items.length} {items.length === 1 ? "module" : "modules"})
                      </span>
                    </div>
                  </td>
                  <td colSpan={6} className="py-2 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCategoryAccessLevel(category, "full")}
                        disabled={disabled}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors focus-ring"
                      >
                        All
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <button
                        type="button"
                        onClick={() => handleCategoryAccessLevel(category, "view")}
                        disabled={disabled}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50 transition-colors focus-ring"
                      >
                        View Only
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <button
                        type="button"
                        onClick={() => handleCategoryAccessLevel(category, "none")}
                        disabled={disabled}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus-ring"
                      >
                        None
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Category Module Rows */}
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 pl-7">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.module}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.accessLevel}
                        onChange={(e) =>
                          handleAccessLevelChange(item.id, e.target.value as any)
                        }
                        disabled={disabled}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus-ring cursor-pointer"
                      >
                        <option value="full">Full Access</option>
                        <option value="view">View Only</option>
                        <option value="custom">Custom</option>
                        <option value="none">No Access</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.view}
                        onChange={() => handleToggle(item.id, "view")}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.add}
                        onChange={() => handleToggle(item.id, "add")}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.edit}
                        onChange={() => handleToggle(item.id, "edit")}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.delete}
                        onChange={() => handleToggle(item.id, "delete")}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.export}
                        onChange={() => handleToggle(item.id, "export")}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.control}
                        onChange={() => handleToggle(item.id, "control")}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
