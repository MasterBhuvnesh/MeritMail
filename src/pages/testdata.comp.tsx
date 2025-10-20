import { useEffect, useMemo, useState } from "react";
import {
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  RotateCw,
  Trash2,
} from "lucide-react";

type Pdf = { name: string };
type Row = {
  id: string;
  name: string;
  email: string;
  pdfs: Pdf[];
};

const sampleDataRaw = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    pdfs: ["file1.pdf", "file2.pdf"],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    pdfs: ["doc1.pdf"],
  },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", pdfs: [] },
];

const initialData: Row[] = sampleDataRaw.map((row) => ({
  ...row,
  pdfs: row.pdfs.map((pdf) => ({ name: pdf })),
}));

export default function TestDataPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pdfsInput, setPdfsInput] = useState("");
  const [saved, setSaved] = useState(false);

  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState<boolean | null>(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const [importOpen, setImportOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importRaw, setImportRaw] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPdfsInput, setEditPdfsInput] = useState("");

  useEffect(() => {
    setRows(initialData);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, sortAsc, rows.length]);

  function handleAdd() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;

    const existingIds = rows
      .map((r) => (typeof r.id === "string" ? parseInt(r.id, 10) : r.id))
      .filter((id) => !isNaN(id));
    const nextId = existingIds.length ? Math.max(...existingIds) + 1 : 1;

    const pdfs: Pdf[] = pdfsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => ({ name: p }));

    const newRow: Row = {
      id: String(nextId),
      name: trimmedName,
      email: trimmedEmail,
      pdfs,
    };
    setRows((s) => [newRow, ...s]);
    setName("");
    setEmail("");
    setPdfsInput("");
    setSaved(false);
  }

  function handleRemove(id: string | number) {
    setRows((s) => s.filter((r) => r.id !== id));
    setSaved(false);
  }

  function handleEdit(row: Row) {
    setEditingRow(row);
    setEditName(row.name);
    setEditEmail(row.email);
    setEditPdfsInput(row.pdfs.map((p) => p.name).join(", "));
    setEditOpen(true);
  }

  function handleSaveEdit() {
    if (!editingRow) return;
    const trimmedName = editName.trim();
    const trimmedEmail = editEmail.trim();
    if (!trimmedName || !trimmedEmail) return;

    const pdfs: Pdf[] = editPdfsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => ({ name: p }));

    setRows((s) =>
      s.map((r) =>
        r.id === editingRow.id
          ? { ...r, name: trimmedName, email: trimmedEmail, pdfs }
          : r,
      ),
    );
    setEditOpen(false);
    setEditingRow(null);
    setEditName("");
    setEditEmail("");
    setEditPdfsInput("");
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    const exportData = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      pdfs: row.pdfs.map((p) => p.name),
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleClearAll() {
    setRows([]);
    setSaved(false);
  }

  const sampleImportExample = [
    {
      id: "1",
      name: "Imported User",
      email: "import@example.com",
      pdfs: ["file1.pdf", "file2.pdf"],
    },
    {
      id: "2",
      name: "Another User",
      email: "another@example.com",
      pdfs: [],
    },
  ];

  function validateAndNormalizeImported(
    value: any,
  ): { ok: true; rows: Row[] } | { ok: false; error: string } {
    if (!Array.isArray(value))
      return { ok: false, error: "File must contain a top-level JSON array." };
    const rowsResult: Row[] = [];
    for (let i = 0; i < value.length; i++) {
      const item: any = value[i];
      if (!item || typeof item !== "object")
        return { ok: false, error: `Item at index ${i} is not an object.` };
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const email = typeof item.email === "string" ? item.email.trim() : "";
      if (!name)
        return {
          ok: false,
          error: `Item at index ${i} is missing a valid "name" string.`,
        };
      if (!email)
        return {
          ok: false,
          error: `Item at index ${i} is missing a valid "email" string.`,
        };

      const rawPdfs = Array.isArray(item.pdfs) ? item.pdfs : [];
      const pdfs: Pdf[] = rawPdfs
        .map((p: any) => {
          if (typeof p === "string") return { name: p };
          if (p && typeof p === "object" && typeof p.name === "string")
            return { name: p.name };
          return null;
        })
        .filter(Boolean) as Pdf[];

      const id =
        item.id !== undefined && item.id !== null ? String(item.id) : "";

      rowsResult.push({ id, name, email, pdfs });
    }

    const usedIds = new Set<string>();
    let nextNumericId = 1;

    for (const r of rowsResult) {
      if (!r.id || usedIds.has(r.id)) {
        while (usedIds.has(String(nextNumericId))) {
          nextNumericId++;
        }
        r.id = String(nextNumericId);
        usedIds.add(r.id);
        nextNumericId++;
      } else {
        usedIds.add(r.id);
      }
    }

    return { ok: true, rows: rowsResult };
  }

  function handleFileChosen(file: File | null) {
    setImportError(null);
    setImportFileName(null);
    setImportRaw(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setImportError("Only .json files are allowed.");
      return;
    }
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImportRaw(typeof reader.result === "string" ? reader.result : null);
    };
    reader.onerror = () => setImportError("Failed to read file.");
    reader.readAsText(file);
  }

  function handlePerformImport() {
    setImportError(null);
    if (!importRaw) {
      setImportError("No file selected.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(importRaw);
    } catch (err) {
      setImportError(
        "Invalid JSON: " + (err instanceof Error ? err.message : String(err)),
      );
      return;
    }
    const res = validateAndNormalizeImported(parsed);
    if (!res.ok) {
      setImportError(res.error);
      return;
    }
    setRows(res.rows);
    setImportOpen(false);
    setImportError(null);
    setImportFileName(null);
    setImportRaw(null);
    setSaved(false);
  }

  const displayedRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    });
    if (sortAsc === null) return filtered;
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name) * dir);
  }, [rows, query, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(displayedRows.length / rowsPerPage));
  const paginated = displayedRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const SortIcon = ({ state }: { state: boolean | null }) => {
    if (state === null)
      return <ChevronsUpDown className="h-4 w-4 text-gray-500" />;
    if (state) return <ChevronUp className="h-4 w-4 text-gray-700" />;
    return <ChevronDown className="h-4 w-4 text-gray-700" />;
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">TEST DATA</h2>

        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => setSortAsc((s) => (s === null ? true : !s))}
            className={`inline-flex items-center gap-2 rounded-md border ${sortAsc === null ? "text-gray-500" : "text-gray-800"} px-3 py-2 text-sm hover:bg-gray-50`}
          >
            <SortIcon state={sortAsc} />
            <span>{sortAsc === null ? "Sort" : sortAsc ? "Asc" : "Desc"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSortAsc(null);
            }}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <RotateCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm sm:w-48"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm sm:w-56"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="PDFs (comma separated)"
            value={pdfsInput}
            onChange={(e) => setPdfsInput(e.target.value)}
          />
          <button
            className="rounded-md border border-blue-600 bg-white px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
            onClick={handleAdd}
            type="button"
          >
            Add
          </button>
          <button
            className="rounded-md border border-green-600 bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-50"
            onClick={handleSave}
            type="button"
          >
            Save
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={handleExport}
            type="button"
          >
            Export
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setImportError(null);
              setImportFileName(null);
              setImportRaw(null);
              setImportOpen(true);
            }}
            type="button"
          >
            Import
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-gray-600">NAME</th>
                <th className="px-4 py-3 text-left text-gray-600">EMAIL</th>
                <th className="px-4 py-3 text-left text-gray-600">PDFs</th>
                <th className="px-4 py-3 text-left text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 align-top text-gray-700">{r.id}</td>
                  <td className="px-4 py-3 align-top font-medium text-gray-800">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-gray-500">
                    {r.email}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {r.pdfs.length ? (
                      <ul className="flex flex-col gap-1">
                        {r.pdfs.map((p, i) => (
                          <li key={i}>
                            <div className="inline-block rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">
                              {p.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md border border-indigo-500 bg-indigo-50 px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-100"
                        onClick={() => handleEdit(r)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-red-500 bg-red-50 px-2 py-1 text-sm text-red-600 hover:bg-red-100"
                        onClick={() => handleRemove(r.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No rows to display. Add or import data to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginated.length} of {displayedRows.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              type="button"
            >
              Prev
            </button>

            <div className="inline-flex items-center gap-1">
              {Array.from({ length: pageCount }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-md border px-2 py-1 text-sm ${
                      p === page
                        ? "border-gray-700 bg-gray-100"
                        : "border-gray-200 bg-white"
                    } hover:bg-gray-50`}
                    type="button"
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              type="button"
            >
              Next
            </button>

            <button
              className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              onClick={handleClearAll}
              type="button"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setImportOpen(false)}
          />
          <div className="relative z-50 w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Import JSON</h3>
              <button
                type="button"
                className="text-sm text-gray-500"
                onClick={() => setImportOpen(false)}
              >
                Close
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Upload a .json file containing an array of objects. Each object
              must include:
            </p>
            <ul className="mt-2 ml-5 list-disc text-sm text-gray-600">
              <li>
                <strong>id</strong> (string or number, optional)
              </li>
              <li>
                <strong>name</strong> (string)
              </li>
              <li>
                <strong>email</strong> (string)
              </li>
              <li>
                <strong>pdfs</strong> (optional array of strings)
              </li>
            </ul>

            <div className="mt-4">
              <div className="text-xs text-gray-500">Sample format</div>
              <pre className="mt-2 max-h-40 overflow-auto rounded-md border border-gray-100 bg-gray-50 p-3 text-xs">
                {JSON.stringify(sampleImportExample, null, 2)}
              </pre>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) =>
                    handleFileChosen(e.target.files?.[0] ?? null)
                  }
                  className="block text-sm"
                />
              </label>
              <div className="text-sm text-gray-600">
                {importFileName ? (
                  <span>Selected: {importFileName}</span>
                ) : (
                  <span>No file selected</span>
                )}
              </div>
            </div>

            {importError && (
              <div className="mt-3 text-sm text-red-600">{importError}</div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  setImportOpen(false);
                  setImportError(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handlePerformImport}
                disabled={!importRaw}
              >
                Import JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEditOpen(false)}
          />
          <div className="relative z-50 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Edit Row</h3>
              <button
                type="button"
                className="text-sm text-gray-500"
                onClick={() => setEditOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PDFs (comma separated)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={editPdfsInput}
                  onChange={(e) => setEditPdfsInput(e.target.value)}
                  placeholder="file1.pdf, file2.pdf"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
