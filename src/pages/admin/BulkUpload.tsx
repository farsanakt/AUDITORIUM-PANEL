import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

import * as XLSX from "xlsx";

import { UploadType } from "../../types/Bulkupload";
import { REQUIRED_COLUMNS } from "../../utils/bulkUploadConfig";
import { bulkUploadApi } from "../../api/userApi";

interface SkippedRow {
  rowNumber: number;
  reason: string;
  data: any;
}

const BulkUpload: React.FC = () => {
  const navigate = useNavigate();

  const [uploadType, setUploadType] = useState<UploadType | "">("");
  const [file, setFile] = useState<File | null>(null);

  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  /* ================= FILE PREVIEW ================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      const detectedHeaders = Object.keys(jsonData[0] || []);
      setHeaders(detectedHeaders);
      setPreviewData(jsonData.slice(0, 10));
    };

    reader.readAsBinaryString(selectedFile);
  };

  /* ================= COLUMN VALIDATION ================= */

  useEffect(() => {
    if (!uploadType || headers.length === 0) {
      setMissingColumns([]);
      return;
    }

    const required = REQUIRED_COLUMNS[uploadType];
    const missing = required.filter(
      (col) => !headers.includes(col)
    );

    setMissingColumns(missing);
  }, [uploadType, headers]);

  /* ================= UPLOAD ================= */

  const handleUpload = async () => {
    if (!uploadType) {
      alert("Please select upload type");
      return;
    }

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (missingColumns.length > 0) {
      alert("Fix missing columns before uploading");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", uploadType);

      const res = await bulkUploadApi(formData);
      setResult(res.data);
    }catch (error: any) {
  console.error("Bulk upload error:", error.response?.data || error);
  alert(
    error.response?.data?.message ||
    error.message ||
    "Bulk upload failed"
  );
}
 finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD SKIPPED ROWS ================= */

  const downloadSkippedRows = () => {
    if (!result?.skippedRows?.length) return;

    const data = result.skippedRows.map((row: SkippedRow) => ({
      rowNumber: row.rowNumber,
      reason: row.reason,
      ...row.data,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Skipped Rows");

    XLSX.writeFile(workbook, "skipped_rows.xlsx");
  };

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#FDF8F1] px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-[#5B4336]" />
          </button>

          <h2 className="text-2xl font-bold text-[#5B4336]">
            Bulk Upload
          </h2>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Upload type
            </label>

            <select
              value={uploadType}
              onChange={(e) =>
                setUploadType(e.target.value as UploadType)
              }
              className="w-full border border-[#b09d94] rounded-lg px-3 py-2 mb-4"
            >
              <option value="">Choose data type</option>
              <option value="AUDITORIUM_USER">Auditorium Users</option>
              <option value="AUDITORIUM_BOOKING">Auditorium Bookings</option>
              <option value="VENDOR">Vendors</option>
            </select>

            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-4 w-full bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white font-semibold py-2.5 rounded-lg"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            {/* RESULT SUMMARY */}
            {result && (
              <div className="mt-6 bg-[#FDF8F1] p-4 rounded-lg text-sm">
                <p>Total Rows: <strong>{result.totalRows}</strong></p>
                <p className="text-green-700">
                  Success: <strong>{result.successCount}</strong>
                </p>
                <p className="text-red-700">
                  Skipped: <strong>{result.skippedCount}</strong>
                </p>

                {result.skippedCount > 0 && (
                  <button
                    onClick={downloadSkippedRows}
                    className="mt-3 flex items-center gap-2 text-[#5B4336] font-semibold"
                  >
                    <Download size={16} />
                    Download skipped rows
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {missingColumns.length > 0 && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                <strong>Missing columns:</strong>{" "}
                {missingColumns.join(", ")}
              </div>
            )}

            {previewData.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2">
                  Preview (first {previewData.length} rows)
                </h3>

                <div className="overflow-x-auto border rounded-lg max-h-72">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#FDF8F1] sticky top-0">
                      <tr>
                        {headers.map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 text-left font-semibold border-b"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b">
                          {headers.map((header) => (
                            <td key={header} className="px-3 py-2">
                              {row[header]?.toString() || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
