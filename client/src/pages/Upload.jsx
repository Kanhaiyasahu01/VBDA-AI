import { useState } from "react";
import parseCSV from "../utils/parseCSV";
import { generateEmails } from "../utils/generateEmails";
import { saveToDB, saveRowToDB } from "../utils/saveToDb";
import { handleSendEmails } from "../utils/sendEmail";
import { fetchTemplateByType } from "../utils/getEmailTemplate";

const Upload = () => {
  const [jsonData, setJsonData] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [editingContent, setEditingContent] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  const [sendOption, setSendOption] = useState("now"); // 'now' or 'schedule'
  const [scheduleDate, setScheduleDate] = useState("");

  const FIELDS_TO_SHOW = [
    "firstName",
    "email",
    "organization",
    "role",
    "achievement",
    "aiGeneratedContent",
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/csv") {
      setError("Please upload a valid CSV file.");
      return;
    }

    setError("");
    setLoading(true);
    setFileName(file.name);

    try {
      const parsedRows = await parseCSV(file);

      const emailTemplate = await fetchTemplateByType('initial');
      console.log("email template",emailTemplate);

      
      const enrichedRows = await generateEmails(parsedRows,emailTemplate?.template);

      const rowsWithTiming = enrichedRows.map((row) => ({
        ...row,
        scheduledDate:
          sendOption === "schedule" ? new Date(scheduleDate) : null,
        initialSentAt: sendOption === "now" ? new Date() : null,
      }));

      const dbRes = await saveToDB(rowsWithTiming);

      console.log("db res", dbRes);

      const insertedData = dbRes?.data?.data?.inserted;
      console.log("inserted data ", insertedData);
      if (dbRes.success && Array.isArray(insertedData)) {
        setJsonData(insertedData);
        setUploadMessage(
          `✅ Processed and saved ${insertedData.length} records.`
        );

        if (sendOption === "now") {
          await handleSendEmails(
            insertedData,
            setUploadMessage,
            setError,
            setLoading
          );
        }
      } else {
        setJsonData(rowsWithTiming); // fallback
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process file.");
    } finally {
      setLoading(false);
    }
  };

  const handleReupload = () => {
    setJsonData([]);
    setUploadMessage("");
    setFileName("");
    setSendOption("now");
    setScheduleDate("");
  };

  const handleContentChange = (index, value) => {
    setEditingContent((prev) => ({ ...prev, [index]: value }));
  };

  const handleToggleExpand = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSave = async (index) => {
    // Pass the entire row, not just the aiGeneratedContent
    const updatedRow = {
      ...jsonData[index],
      aiGeneratedContent:
        editingContent[index] || jsonData[index].aiGeneratedContent,
    };

    try {
      const res = await saveRowToDB(updatedRow);

      console.log("res upload", res);
      console.log(res.success);
      if (res.success) {
        const updated = [...jsonData];
        updated[index] = updatedRow;
        setJsonData(updated);
        setEditingContent((prev) => {
          const copy = { ...prev };
          delete copy[index];
          return copy;
        });
        setUploadMessage("✅ Row updated successfully.");
      } else {
        setError("❌ Failed to update row in DB.");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Server error while updating.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Upload CSV & Generate Emails</h1>

      {/* Send Option */}
      {jsonData.length === 0 && (
        <>
          <div className="mb-4">
            <label className="font-semibold block mb-2">
              📤 Choose Send Option:
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="now"
                  checked={sendOption === "now"}
                  onChange={(e) => setSendOption(e.target.value)}
                />
                Send Now
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="schedule"
                  checked={sendOption === "schedule"}
                  onChange={(e) => setSendOption(e.target.value)}
                />
                Schedule Later
              </label>
            </div>
            {sendOption === "schedule" && (
              <div className="mt-2">
                <input
                  type="datetime-local"
                  className="border p-2 rounded"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* File Upload */}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mb-4"
          />
          {fileName && <p className="text-gray-700">📄 Selected: {fileName}</p>}
        </>
      )}

      {loading && <p className="text-blue-500">⏳ Processing...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {uploadMessage && <p className="text-green-600">{uploadMessage}</p>}

      {jsonData.length > 0 && (
        <>
          <button
            onClick={handleReupload}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4"
          >
            🔁 Re-upload CSV
          </button>

          {/* <button
            onClick={() => handleSendEmails(jsonData, setUploadMessage, setError, setLoading)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 ml-4"
          >
            ✉️ Send Emails
          </button> */}

          {/* Table Rendering */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {FIELDS_TO_SHOW.map((field) => (
                    <th
                      key={field}
                      className={`border px-3 py-2 text-left capitalize ${
                        field === "aiGeneratedContent" ? "w-[400px]" : ""
                      }`}
                    >
                      {field}
                    </th>
                  ))}
                  <th className="border px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jsonData.map((row, i) => (
                  <tr key={i} className="border-t align-top">
                    {FIELDS_TO_SHOW.map((field) => (
                      <td
                        key={field}
                        className="border px-3 py-2 whitespace-pre-wrap"
                      >
                        {field === "aiGeneratedContent" ? (
                          <div className="flex flex-col gap-1">
                            <textarea
                              value={editingContent[i] ?? row[field]}
                              onChange={(e) =>
                                handleContentChange(i, e.target.value)
                              }
                              className="w-full border rounded p-1 text-sm resize-y"
                              rows={expandedRows[i] ? 6 : 3}
                              style={{
                                whiteSpace: "pre-wrap",
                                overflowWrap: "break-word",
                              }}
                            />
                            <button
                              onClick={() => handleToggleExpand(i)}
                              className="text-blue-500 text-xs w-fit"
                            >
                              {expandedRows[i] ? "View Less" : "View More"}
                            </button>
                          </div>
                        ) : (
                          row[field] ?? "-"
                        )}
                      </td>
                    ))}
                    <td className="border px-3 py-2">
                      <button
                        onClick={() => handleSave(i)} // Pass entire row here
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Upload;
