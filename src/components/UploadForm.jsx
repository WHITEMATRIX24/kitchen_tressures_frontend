import React, { useState } from "react";
import { uploadFile } from "../api/api";

export default function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [soName, setSoName] = useState("");
  const [soErp, setSoErp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file || !soName || !soErp) {
      setError("File, SO Name, and SO ERP are required.");
      return;
    }
    setError(""); setLoading(true);
    try {
      const result = await uploadFile(file, soName, soErp);
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label>Excel input</label>
        <input type="file" accept=".xls,.xlsx" onChange={(e)=>setFile(e.target.files[0])}/>
      </div>
      <div>
        <input placeholder="SO Name" value={soName} onChange={e=>setSoName(e.target.value)} />
        <input placeholder="SO ERP" value={soErp} onChange={e=>setSoErp(e.target.value)} />
      </div>
      <button type="submit" disabled={loading}>{loading ? "Processing..." : "Generate Plan"}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}
