import React, { useEffect, useState } from 'react';
import axios from 'axios';

const types = ['initial', 'followup', 'reminder'];

export default function EmailTemplates() {
  const [selectedTab, setSelectedTab] = useState('initial');
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/get-template`)
      .then(res => {
        const tempMap = {};
        res.data.forEach(t => tempMap[t.type] = t);
        setTemplates(tempMap);
        setLoading(false);
      })
      .catch(err => console.error(err));
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
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/update-template/${type}`, {
        subject: templates[type].subject,
        body: templates[type].body
      });
      alert("Template updated!");
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  const template = templates[selectedTab];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex mb-4 space-x-4">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setSelectedTab(type)}
            className={`px-4 py-2 rounded ${selectedTab === type ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white shadow p-6 rounded">
        <label>Subject</label>
        <input
          className="w-full border p-2 mb-4"
          value={template?.subject || ''}
          onChange={e => handleChange(selectedTab, 'subject', e.target.value)}
        />

        <label>Body</label>
        <textarea
          className="w-full border p-2 h-40"
          value={template?.body || ''}
          onChange={e => handleChange(selectedTab, 'body', e.target.value)}
        />

        <button
          onClick={() => handleUpdate(selectedTab)}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Template
        </button>
      </div>
    </div>
  );
}
