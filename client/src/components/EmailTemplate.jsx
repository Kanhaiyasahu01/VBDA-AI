import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSave, FiFileText } from 'react-icons/fi';

const types = ['initial', 'followup', 'reminder'];

export default function EmailTemplates() {
  const [selectedTab, setSelectedTab] = useState('initial');
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/get-template`)
      .then(res => {
        const tempMap = {};
        res.data.forEach(t => tempMap[t.type] = t);
        setTemplates(tempMap);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (type, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (type) => {
    setSaveStatus('saving');
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/update-template/${type}`, {
        subject: templates[type].subject,
        body: templates[type].body
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex justify-center">
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  const template = templates[selectedTab];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center">
          <FiFileText className="mr-2" /> Email Templates
        </h1>
      </div>

      <div className="p-6">
        <div className="flex border-b border-gray-200 mb-6">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedTab(type)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                selectedTab === type 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type} Template
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Line
            </label>
            <input
              id="subject"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={template?.subject || ''}
              onChange={e => handleChange(selectedTab, 'subject', e.target.value)}
              placeholder="Enter subject line"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Email Body
            </label>
            <textarea
              id="body"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
              value={template?.body || ''}
              onChange={e => handleChange(selectedTab, 'body', e.target.value)}
              placeholder="Enter email body content"
              rows={10}
            />
            <p className="mt-2 text-sm text-gray-500">
              You can use variables like {'{firstName}'}, {'{organization}'}, etc. They will be replaced with actual values.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              {saveStatus === 'success' && (
                <span className="text-green-600 text-sm">Template saved successfully!</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600 text-sm">Failed to save template.</span>
              )}
              {saveStatus === 'saving' && (
                <span className="text-gray-600 text-sm flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
                  Saving...
                </span>
              )}
            </div>
            
            <button
              onClick={() => handleUpdate(selectedTab)}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm disabled:bg-indigo-300"
            >
              <FiSave className="mr-2" /> Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}