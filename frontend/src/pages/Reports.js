import { useState, useEffect } from 'react';

// reports page component
export default function Reports() {
    const [summary, setSummary] = useState(null);
    const [visitors, setVisitors] = useState([]);
    const [passes, setPasses] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('summary');
    const token = localStorage.getItem('token');

    // fetch summary data
    useEffect(() => {
        fetchSummary();
    }, []);

    // fetch summary report
    const fetchSummary = async () => {
        const res = await fetch('http://localhost:5000/api/reports/summary', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSummary(data);
    };

    // fetch visitors report
    const fetchVisitors = async () => {
        const res = await fetch('http://localhost:5000/api/reports/visitors', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setVisitors(data);
    };

    // fetch passes report
    const fetchPasses = async () => {
        const res = await fetch('http://localhost:5000/api/reports/passes', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPasses(data);
    };

    // fetch appointments report
    const fetchAppointments = async () => {
        const res = await fetch('http://localhost:5000/api/reports/appointments', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAppointments(data);
    };

    // handle tab change
    const handleTab = (tab) => {
        setActiveTab(tab);
        if (tab === 'visitors') fetchVisitors();
        if (tab === 'passes') fetchPasses();
        if (tab === 'appointments') fetchAppointments();
    };

    // export data as CSV
    const exportCSV = (data, filename) => {
        if (data.length === 0) return;

        // get column headers from first object
        const headers = Object.keys(data[0]).join(',');

        // get values for each row
        const rows = data.map(row =>
            Object.values(row).map(val => `"${val}"`).join(',')
        ).join('\n');

        const csv = headers + '\n' + rows;

        // create download link and click it
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    return (
        <div style={{ padding: '20px' }}>
            <a href="/dashboard">← Back to Dashboard</a>
            <h2>Reports</h2>

            {/* tabs */}
            <div>
                <button onClick={() => handleTab('summary')}>Summary</button>
                <button onClick={() => handleTab('visitors')}>Visitors</button>
                <button onClick={() => handleTab('passes')}>Passes</button>
                <button onClick={() => handleTab('appointments')}>Appointments</button>
            </div>

            {/* summary tab */}
            {activeTab === 'summary' && summary && (
                <div>
                    <h3>Summary</h3>
                    <p>Total Visitors: {summary.totalVisitors}</p>
                    <p>Total Passes: {summary.totalPasses}</p>
                    <p>Total Appointments: {summary.totalAppointments}</p>
                </div>
            )}

            {/* visitors tab */}
            {activeTab === 'visitors' && (
                <div>
                    <h3>Visitors ({visitors.length})</h3>
                    <button onClick={() => exportCSV(visitors, 'visitors.csv')}>Export CSV</button>
                    <ul>
                        {visitors.map(v => (
                            <li key={v._id}>{v.name} - {v.email} - {v.status}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* passes tab */}
            {activeTab === 'passes' && (
                <div>
                    <h3>Passes ({passes.length})</h3>
                    <button onClick={() => exportCSV(passes, 'passes.csv')}>Export CSV</button>
                    <ul>
                        {passes.map(p => (
                            <li key={p._id}>{p.passNo} - {p.status}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* appointments tab */}
            {activeTab === 'appointments' && (
                <div>
                    <h3>Appointments ({appointments.length})</h3>
                    <button onClick={() => exportCSV(appointments, 'appointments.csv')}>Export CSV</button>
                    <ul>
                        {appointments.map(a => (
                            <li key={a._id}>{a.visitorName} - {a.purpose} - {a.status}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}