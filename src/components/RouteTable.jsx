import React from "react";

export default function RouteTable({ rows, excelUrl, mapFiles }) {
  return (
    <div>
      <h3>Plan — {rows.length} sample rows</h3>
      <table>
        <thead>
          <tr>
            {rows[0] && Object.keys(rows[0]).map(k => <th key={k}>{k}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {Object.values(r).map((v, j) => <td key={j}>{String(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      {excelUrl && <a href={excelUrl} target="_blank" rel="noreferrer">Download Excel</a>}
      {mapFiles?.length > 0 && mapFiles.map(m => (
        <div key={m}>
          <a href={m} target="_blank" rel="noreferrer">Open map: {m.split("/").pop()}</a>
        </div>
      ))}
    </div>
  );
}
