import { useState, useEffect } from 'react';
import { IconArrowLeft, IconUsers, IconCalendar, IconBadge, IconDownload } from '../components/Icons';

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
        const res = await fetch('http://visitor-pass-management-9jme.onrender.com/api/reports/summary', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSummary(data);
    };

    // fetch visitors report
    const fetchVisitors = async () => {
        const res = await fetch('http://visitor-pass-management-9jme.onrender.com/api/reports/visitors', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setVisitors(data);
    };

    // fetch passes report
    const fetchPasses = async () => {
        const res = await fetch('http://visitor-pass-management-9jme.onrender.com/api/reports/passes', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPasses(data);
    };

    // fetch appointments report
    const fetchAppointments = async () => {
        const res = await fetch('http://visitor-pass-management-9jme.onrender.com/api/reports/appointments', {
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

    const tabs = [
        { id: 'summary', label: 'Summary' },
        { id: 'visitors', label: 'Visitors' },
        { id: 'passes', label: 'Passes' },
        { id: 'appointments', label: 'Appointments' }
    ];

    return (
        <div className="page">
            <a href="/dashboard" className="back-link"><IconArrowLeft size={14} /> Back to Dashboard</a>

            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p className="page-subtitle">Review activity and export data as CSV</p>
                </div>
            </div>

            <div className="tab-row">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                        onClick={() => handleTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'summary' && summary && (
                <div className="stat-grid">
                    <div className="stat-card">
                        <span className="stat-icon blue"><IconUsers size={22} /></span>
                        <div>
                            <div className="stat-value">{summary.totalVisitors}</div>
                            <div className="stat-label">Total Visitors</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon green"><IconBadge size={22} /></span>
                        <div>
                            <div className="stat-value">{summary.totalPasses}</div>
                            <div className="stat-label">Total Passes</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon amber"><IconCalendar size={22} /></span>
                        <div>
                            <div className="stat-value">{summary.totalAppointments}</div>
                            <div className="stat-label">Total Appointments</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'visitors' && (
                <div>
                    <div className="tab-panel-header">
                        <div className="section-title" style={{ marginBottom: 0 }}>
                            Visitors <span className="count">({visitors.length})</span>
                        </div>
                        <button className="btn btn-outline btn-sm" onClick={() => exportCSV(visitors, 'visitors.csv')}>
                            <IconDownload size={14} /> Export CSV
                        </button>
                    </div>
                    <ul className="list">
                        {visitors.map(v => (
                            <li key={v._id} className="row-card">
                                <div className="row-avatar">{v.name?.[0]?.toUpperCase()}</div>
                                <div className="row-body">
                                    <div className="row-title">{v.name}</div>
                                    <div className="row-sub">{v.email} <span className={`badge badge-${v.status}`}>{v.status}</span></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'passes' && (
                <div>
                    <div className="tab-panel-header">
                        <div className="section-title" style={{ marginBottom: 0 }}>
                            Passes <span className="count">({passes.length})</span>
                        </div>
                        <button className="btn btn-outline btn-sm" onClick={() => exportCSV(passes, 'passes.csv')}>
                            <IconDownload size={14} /> Export CSV
                        </button>
                    </div>
                    <ul className="list">
                        {passes.map(p => (
                            <li key={p._id} className="row-card">
                                <div className="row-avatar"><IconBadge size={16} /></div>
                                <div className="row-body">
                                    <div className="row-title" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{p.passNo}</div>
                                    <div className="row-sub"><span className={`badge badge-${p.status}`}>{p.status}</span></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div>
                    <div className="tab-panel-header">
                        <div className="section-title" style={{ marginBottom: 0 }}>
                            Appointments <span className="count">({appointments.length})</span>
                        </div>
                        <button className="btn btn-outline btn-sm" onClick={() => exportCSV(appointments, 'appointments.csv')}>
                            <IconDownload size={14} /> Export CSV
                        </button>
                    </div>
                    <ul className="list">
                        {appointments.map(a => (
                            <li key={a._id} className="row-card">
                                <div className="row-avatar">{a.visitorName?.[0]?.toUpperCase()}</div>
                                <div className="row-body">
                                    <div className="row-title">{a.visitorName}</div>
                                    <div className="row-sub">{a.purpose} <span className={`badge badge-${a.status}`}>{a.status}</span></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
