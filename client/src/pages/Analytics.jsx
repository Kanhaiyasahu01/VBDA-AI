import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#e5e7eb"]; // Blue and light gray

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/analytics`)
      .then((res) => {
        const invitations = res.data.data;
        setData(invitations);
        generateSummary(invitations);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const generateSummary = (invitations) => {
    const total = invitations.length || 1; // Prevent division by 0
    const opened = invitations.filter(inv => inv.analytics?.opened).length;
    const clicked = invitations.filter(inv => inv.analytics?.clicked).length;
    const rsvp = invitations.filter(inv => inv.rsvp).length;
    const unsubscribed = invitations.filter(inv => inv.unsubscribed).length;

    setSummary([
      { name: "Opened", value: opened, remaining: total - opened },
      { name: "Clicked", value: clicked, remaining: total - clicked },
      { name: "RSVP", value: rsvp, remaining: total - rsvp },
      { name: "Unsubscribed", value: unsubscribed, remaining: total - unsubscribed },
    ]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Email Analytics</h2>
          <p className="text-gray-500 mt-1">Track and analyze your email campaign performance</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Pie Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {summary.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">{item.name}</h3>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: item.name, value: item.value },
                            { name: "Remaining", value: item.remaining },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill={COLORS[0]} />
                          <Cell fill={COLORS[1]} />
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name === "Remaining" ? "Not " + item.name : name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {((item.value / (item.value + item.remaining)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.value} out of {item.value + item.remaining}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Stats</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Opened</th>
                      <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Clicked</th>
                      <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP</th>
                      <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unsubscribed</th>
                      <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Consent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.length > 0 ? (
                      data.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{inv.firstName}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">{inv.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${inv.analytics?.opened ? 'bg-green-100' : 'bg-red-100'}`}>
                              {inv.analytics?.opened ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✕</span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${inv.analytics?.clicked ? 'bg-green-100' : 'bg-red-100'}`}>
                              {inv.analytics?.clicked ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✕</span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${inv.rsvp ? 'bg-green-100' : 'bg-red-100'}`}>
                              {inv.rsvp ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✕</span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${inv.unsubscribed ? 'bg-red-100' : 'bg-green-100'}`}>
                              {inv.unsubscribed ? (
                                <span className="text-red-600">✓</span>
                              ) : (
                                <span className="text-green-600">✕</span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${inv.consent ? 'bg-green-100' : 'bg-red-100'}`}>
                              {inv.consent ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✕</span>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-4 text-center text-gray-500">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;