import { useState } from 'react';
import Papa from 'papaparse';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(geminiApiKey);

const Upload = () => {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== 'text/csv') {
      setFileError('Please upload a valid CSV file.');
      return;
    }

    setFileError('');
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const enrichedRows = await generateEmails(rows);
        setJsonData(enrichedRows);
        setLoading(false);
      },
    });
  };

  const generateEmails = async (rows) => {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Use 'gemini-1.5-pro' for more detailed responses
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const updatedRows = await Promise.all(
      rows.map(async (row) => {
        const prompt = `Generate a personalized, professional email based on the following user data:\n${JSON.stringify(row)}`;
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const email = response.text();
          return { ...row, email };
        } catch (err) {
          console.error('Gemini error:', err);
          return { ...row, email: 'Error generating email.' };
        }
      })
    );

    return updatedRows;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Upload CSV to Generate Emails</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {fileError && <p className="text-red-500">{fileError}</p>}
      {loading && (
        <p className="text-blue-600">
          Processing CSV and generating emails using Gemini...
        </p>
      )}

      {jsonData.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(jsonData[0]).map((key) => (
                  <th
                    key={key}
                    className="border px-3 py-2 text-left whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jsonData.map((row, i) => (
                <tr key={i} className="border-t">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border px-3 py-2 whitespace-pre-wrap">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Upload;
