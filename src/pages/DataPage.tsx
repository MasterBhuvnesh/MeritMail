import sampleDataRaw from "../data/data.json";

type Row = {
  id: number;
  name: string;
  email: string;
  pdfs: { name: string; url: string }[];
};

const sampleData: Row[] = sampleDataRaw as Row[];

export default function DataPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">DATA</h2>
      <div className="rounded-lg border bg-white">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">NAME</th>
              <th className="px-4 py-2 text-left">EMAIL</th>
              <th className="px-4 py-2 text-left">PDFs</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">
                  {r.pdfs.length ? (
                    <ul className="flex flex-col gap-1">
                      {r.pdfs.map((p, i) => (
                        <li key={i}>
                          <a
                            className="text-blue-600 hover:underline"
                            href={p.url}
                          >
                            {p.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
