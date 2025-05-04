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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/analytics`)
      .then((res) => {
        const invitations = res.data.data;
        setData(invitations);
        generateSummary(invitations);
      })
      .catch((err) => console.error(err));
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Email Analytics</h2>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {summary.map((item, idx) => (
          <div key={idx} className="text-center">
            <h3 className="font-medium mb-2">{item.name}</h3>
            <ResponsiveContainer width="100%" height={200}>
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
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm mt-1 font-medium">
              {((item.value / (item.value + item.remaining)) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <h3 className="text-xl font-semibold mb-4">Detailed Stats</h3>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Opened</th>
            <th className="p-2">Clicked</th>
            <th className="p-2">RSVP</th>
            <th className="p-2">Unsubscribed</th>
            <th className="p-2">Consent</th>
          </tr>
        </thead>
        <tbody>
          {data.map((inv, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{inv.firstName}</td>
              <td className="p-2">{inv.email}</td>
              <td className="p-2 text-center">{inv.analytics?.opened ? "✅" : "❌"}</td>
              <td className="p-2 text-center">{inv.analytics?.clicked ? "✅" : "❌"}</td>
              <td className="p-2 text-center">{inv.rsvp ? "✅" : "❌"}</td>
              <td className="p-2 text-center">{inv.unsubscribed ? "✅" : "❌"}</td>
              <td className="p-2 text-center">{inv.consent ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsPage;
