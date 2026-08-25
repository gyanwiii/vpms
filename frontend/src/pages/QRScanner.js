import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { IconArrowLeft, IconCamera, IconScan, IconX } from '../components/Icons';

// QR code scanner page component
export default function QRScanner() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState('');
    const [passData, setPassData] = useState(null);
    const [error, setError] = useState('');
    const [manualPassNo, setManualPassNo] = useState('');
    const token = localStorage.getItem('token');

    // start camera and scanning
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setScanning(true);
        } catch (err) {
            setError('Camera access denied');
        }
    };

    // stop camera and scanning
    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setScanning(false);
    };

    // scan video frames for QR code
    useEffect(() => {
        let interval;
        if (scanning) {
            interval = setInterval(() => {
                scanFrame();
            }, 500);
        }
        return () => clearInterval(interval);
    }, [scanning]);

    const scanFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            setResult(code.data);
            stopCamera();
            lookupPass(code.data);
        }
    };

    // lookup pass by pass number
    const lookupPass = async (passNo) => {
        setError('');
        try {
            const res = await fetch('http://visitor-pass-management-9jme.onrender.com/api/passes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            const found = data.find(p => p.passNo === passNo);
            if (found) {
                setPassData(found);
            } else {
                setError('Pass not found');
            }
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    // handle check-in action
    const handleCheckin = async () => {
        await fetch(`http://visitor-pass-management-9jme.onrender.com/api/passes/${passData._id}/checkin`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        setPassData({ ...passData, checkedIn: true });
    };

    // handle check-out action
    const handleCheckout = async () => {
        await fetch(`http://visitor-pass-management-9jme.onrender.com/api/passes/${passData._id}/checkout`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        setPassData({ ...passData, checkedOut: true });
    };

    return (
        <div className="page">
            <a href="/dashboard" className="back-link"><IconArrowLeft size={14} /> Back to Dashboard</a>

            <div className="page-header">
                <div>
                    <h1>QR Scanner</h1>
                    <p className="page-subtitle">Scan a visitor pass or enter its number manually</p>
                </div>
            </div>

            {error && <div className="alert alert-error"><IconX size={15} /> {error}</div>}

            <div className="panel">
                <div className="section-title"><IconCamera size={16} /> Scan QR Code</div>

                <div className="scanner-frame" style={{ display: scanning ? 'block' : 'none' }}>
                    <video ref={videoRef} />
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {!scanning && !passData && (
                    <button className="btn btn-primary" onClick={startCamera}>
                        <IconCamera size={15} /> Start Camera
                    </button>
                )}
                {scanning && (
                    <button className="btn btn-outline" onClick={stopCamera}>Stop Camera</button>
                )}
            </div>

            <div className="panel">
                <div className="section-title"><IconScan size={16} /> Or Enter Pass Number Manually</div>
                <div className="scan-input-row">
                    <input
                        placeholder="Enter pass number e.g. PASS1234567890"
                        value={manualPassNo}
                        onChange={e => setManualPassNo(e.target.value)}
                    />
                    <button className="btn btn-outline" onClick={() => lookupPass(manualPassNo)}>Lookup Pass</button>
                </div>
                {result && <p className="page-subtitle" style={{ marginTop: '10px' }}>Scanned: <strong>{result}</strong></p>}
            </div>

            {/* pass details after scan */}
            {passData && (
                <div className="panel">
                    <div className="section-title">Pass Details</div>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="label">Pass No</div>
                            <div className="value">{passData.passNo}</div>
                        </div>
                        <div className="detail-item">
                            <div className="label">Status</div>
                            <div className="value"><span className={`badge badge-${passData.status}`}>{passData.status}</span></div>
                        </div>
                        <div className="detail-item">
                            <div className="label">Checked In</div>
                            <div className="value">{passData.checkedIn ? 'Yes' : 'No'}</div>
                        </div>
                        <div className="detail-item">
                            <div className="label">Checked Out</div>
                            <div className="value">{passData.checkedOut ? 'Yes' : 'No'}</div>
                        </div>
                    </div>
                    <div className="pass-actions">
                        {!passData.checkedIn && passData.status === 'active' && (
                            <button className="btn btn-success btn-sm" onClick={handleCheckin}>Check In</button>
                        )}
                        {passData.checkedIn && !passData.checkedOut && (
                            <button className="btn btn-outline btn-sm" onClick={handleCheckout}>Check Out</button>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => { setPassData(null); setResult(''); setManualPassNo(''); }}>
                            Scan Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
