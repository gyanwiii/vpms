import { useState, useEffect, useRef } from 'react';

export default function QRScanner() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState('');
    const [passData, setPassData] = useState(null);
    const [error, setError] = useState('');
    const [manualPassNo, setManualPassNo] = useState('');
    const token = localStorage.getItem('token');

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

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setScanning(false);
    };

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
        const jsQR = require('jsqr');
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            setResult(code.data);
            stopCamera();
            lookupPass(code.data);
        }
    };

    const lookupPass = async (passNo) => {
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/passes', {
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

    const handleCheckin = async () => {
        await fetch(`http://localhost:5000/api/passes/${passData._id}/checkin`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        setPassData({ ...passData, checkedIn: true });
    };

    const handleCheckout = async () => {
        await fetch(`http://localhost:5000/api/passes/${passData._id}/checkout`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        setPassData({ ...passData, checkedOut: true });
    };

    return (
        <div style={{ padding: '20px' }}>
            <a href="/dashboard">← Back to Dashboard</a>
            <h2>QR Scanner</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* camera section */}
            <h3>Scan QR Code</h3>
            <video ref={videoRef} style={{ width: '300px', display: scanning ? 'block' : 'none' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {!scanning && !passData && (
                <button onClick={startCamera}>Start Camera</button>
            )}
            {scanning && (
                <button onClick={stopCamera}>Stop Camera</button>
            )}

            {/* manual entry fallback */}
            <h3>Or Enter Pass Number Manually</h3>
            <input
                placeholder="Enter pass number e.g. PASS1234567890"
                value={manualPassNo}
                onChange={e => setManualPassNo(e.target.value)}
                style={{ width: '300px', marginRight: '10px' }}
            />
            <button onClick={() => lookupPass(manualPassNo)}>Lookup Pass</button>

            {result && <p>Scanned: {result}</p>}

            {/* pass details after scan */}
            {passData && (
                <div>
                    <h3>Pass Details</h3>
                    <p>Pass No: {passData.passNo}</p>
                    <p>Status: {passData.status}</p>
                    <p>Checked In: {passData.checkedIn ? 'Yes' : 'No'}</p>
                    <p>Checked Out: {passData.checkedOut ? 'Yes' : 'No'}</p>

                    {!passData.checkedIn && passData.status === 'active' && (
                        <button onClick={handleCheckin}>Check In</button>
                    )}
                    {passData.checkedIn && !passData.checkedOut && (
                        <button onClick={handleCheckout}>Check Out</button>
                    )}

                    <button onClick={() => { setPassData(null); setResult(''); setManualPassNo(''); }}>
                        Scan Another
                    </button>
                </div>
            )}
        </div>
    );
}