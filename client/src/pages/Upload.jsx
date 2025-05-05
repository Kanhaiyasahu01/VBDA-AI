import { useState } from "react";
import { FiFile, FiUploadCloud, FiSave, FiClock, FiRefreshCw, FiChevronUp, FiChevronDown } from "react-icons/fi";
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Upload CSV & Generate Emails</h1>
      </div>

      <div className="p-6">
        {/* Send Option */}
        {jsonData.length === 0 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiClock className="mr-2" /> Send Options
              </h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="now"
                    checked={sendOption === "now"}
                    onChange={(e) => setSendOption(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send Now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="schedule"
                    checked={sendOption === "schedule"}
                    onChange={(e) => setSendOption(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Schedule Later</span>
                </label>
              </div>
              {sendOption === "schedule" && (
                <div className="mt-4">
                  <input
                    type="datetime-local"
                    className="border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiFile className="mr-2" /> Upload CSV File
              </h2>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                <FiUploadCloud className="text-gray-400 mb-2" size={36} />
                <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
                >
                  Select File
                </label>
                {fileName && (
                  <p className="mt-4 text-sm text-gray-700 flex items-center">
                    <FiFile className="mr-1" /> {fileName}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-md">
            <div className="animate-spin mr-2">
              <FiRefreshCw />
            </div>
            <p>Processing your data...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">
            {error}
          </div>
        )}
        
        {uploadMessage && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
            {uploadMessage}
          </div>
        )}

        {jsonData.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleReupload}
              className="mb-6 inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm transition-colors"
            >
              <FiRefreshCw className="mr-2" /> Upload Another CSV
            </button>

            {/* Table Rendering */}
            <div className="overflow-x-auto mt-4 bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {FIELDS_TO_SHOW.map((field) => (
                      <th
                        key={field}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {field === "aiGeneratedContent" ? "Email Content" : field}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jsonData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {FIELDS_TO_SHOW.map((field) => (
                        <td
                          key={field}
                          className="px-4 py-4 text-sm text-gray-700 whitespace-pre-wrap align-top"
                        >
                          {field === "aiGeneratedContent" ? (
                            <div className="flex flex-col gap-1">
                              <textarea
                                value={editingContent[i] ?? row[field]}
                                onChange={(e) =>
                                  handleContentChange(i, e.target.value)
                                }
                                className="w-full border rounded-md p-2 text-sm resize-y focus:ring-indigo-500 focus:border-indigo-500"
                                rows={expandedRows[i] ? 8 : 3}
                                style={{
                                  whiteSpace: "pre-wrap",
                                  overflowWrap: "break-word",
                                }}
                              />
                              
                            </div>
                          ) : (
                            <div className="max-w-xs truncate">
                              {row[field] ?? "-"}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <button
                          onClick={() => handleSave(i)}
                          className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition-colors"
                        >
                          <FiSave className="mr-1" /> Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;