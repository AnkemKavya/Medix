// Medix HMS - General Helper Utilities

export const exportToCSV = (data, filename = "export.csv") => {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Get keys
  const keys = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(keys.join(","));

  // Data rows
  data.forEach((row) => {
    const values = keys.map((key) => {
      let val = row[key];
      if (typeof val === "object" && val !== null) {
        val = JSON.stringify(val);
      }
      const escaped = ("" + (val ?? "")).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const triggerPrint = () => {
  window.print();
};
