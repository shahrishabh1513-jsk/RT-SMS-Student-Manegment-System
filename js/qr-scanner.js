// QR Code Scanner for Attendance System
class QRScanner {
    constructor() {
        this.videoElement = null;
        this.canvasElement = null;
        this.canvasContext = null;
        this.isScanning = false;
        this.scannedStudents = new Set();
        this.currentSession = null;
        this.cameras = [];
        this.currentCameraIndex = 0;
        this.flashEnabled = false;
        this.init();
    }

    init() {
        this.videoElement = document.getElementById('scanner-video');
        this.canvasElement = document.getElementById('scanner-canvas');
        
        if (this.canvasElement) {
            this.canvasContext = this.canvasElement.getContext('2d');
        }
        
        this.setupEventListeners();
        this.loadScannedStudents();
    }

    setupEventListeners() {
        // Start/Stop scanning buttons
        document.getElementById('start-scanning-btn')?.addEventListener('click', () => this.startScanning());
        document.getElementById('stop-scanning-btn')?.addEventListener('click', () => this.stopScanning());
        
        // Camera controls
        document.getElementById('switch-camera')?.addEventListener('click', () => this.switchCamera());
        document.getElementById('toggle-flash')?.addEventListener('click', () => this.toggleFlash());
        
        // Manual entry buttons
        document.getElementById('quick-manual')?.addEventListener('click', () => this.showManualEntry());
        
        // Save attendance
        document.getElementById('save-attendance')?.addEventListener('click', () => this.saveAttendance());
        
        // End session
        document.getElementById('end-session')?.addEventListener('click', () => this.endSession());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isScanning) {
                this.stopScanning();
            }
            if (e.key === ' ' && !this.isScanning) { // Spacebar to start
                this.startScanning();
            }
        });
    }

    async startScanning() {
        if (this.isScanning) return;
        
        try {
            // Check if session is started
            if (!this.validateSession()) {
                this.showError('Please start an attendance session first');
                return;
            }
            
            // Get camera access
            const stream = await this.getCameraStream();
            
            if (!stream) {
                this.showError('Camera access denied or not available');
                return;
            }
            
            // Setup video element
            this.videoElement.srcObject = stream;
            this.videoElement.style.display = 'block';
            
            // Hide placeholder
            const placeholder = document.getElementById('scanner-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Play video
            await this.videoElement.play();
            
            // Update UI
            this.isScanning = true;
            this.updateScanningUI(true);
            
            // Start scanning loop
            this.scanLoop();
            
            // Start session timer if not already started
            this.startSessionTimer();
            
        } catch (error) {
            console.error('Error starting scanner:', error);
            this.showError('Failed to start camera: ' + error.message);
        }
    }

    stopScanning() {
        if (!this.isScanning) return;
        
        this.isScanning = false;
        
        // Stop video stream
        if (this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
        
        // Update UI
        this.updateScanningUI(false);
        
        // Show placeholder
        const placeholder = document.getElementById('scanner-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
        
        this.videoElement.style.display = 'none';
    }

    async getCameraStream() {
        try {
            // Try to get all cameras
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.cameras = devices.filter(device => device.kind === 'videoinput');
            
            if (this.cameras.length === 0) {
                throw new Error('No cameras found');
            }
            
            // Get constraints for current camera
            const constraints = {
                video: {
                    deviceId: this.cameras[this.currentCameraIndex]?.deviceId 
                            ? { exact: this.cameras[this.currentCameraIndex].deviceId }
                            : undefined,
                    facingMode: this.currentCameraIndex === 0 ? 'environment' : 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };
            
            return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
            console.error('Error accessing camera:', error);
            return null;
        }
    }

    async scanLoop() {
        if (!this.isScanning || !this.videoElement.videoWidth) {
            return;
        }
        
        // Update canvas size to match video
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;
        
        // Draw video frame to canvas
        this.canvasContext.drawImage(
            this.videoElement,
            0, 0,
            this.canvasElement.width,
            this.canvasElement.height
        );
        
        // Get image data for QR code scanning
        const imageData = this.canvasContext.getImageData(
            0, 0,
            this.canvasElement.width,
            this.canvasElement.height
        );
        
        // Try to decode QR code
        try {
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert'
            });
            
            if (code) {
                this.handleQRCode(code.data);
            }
        } catch (error) {
            console.error('QR decoding error:', error);
        }
        
        // Continue scanning
        if (this.isScanning) {
            requestAnimationFrame(() => this.scanLoop());
        }
    }

    handleQRCode(data) {
        try {
            // Parse QR code data
            const studentData = this.parseQRData(data);
            
            if (!studentData || !studentData.studentId) {
                this.showError('Invalid QR code format');
                return;
            }
            
            // Check if already scanned
            if (this.scannedStudents.has(studentData.studentId)) {
                this.showMessage(`${studentData.name} already scanned`, 'info');
                return;
            }
            
            // Validate student data
            if (!this.validateStudent(studentData)) {
                this.showError('Student not found in this section');
                return;
            }
            
            // Add to scanned students
            this.scannedStudents.add(studentData.studentId);
            this.addScannedStudent(studentData);
            
            // Update UI
            this.updateScannedCount();
            this.playScanSound();
            this.showScanAnimation();
            
            // Show success message
            this.showMessage(`${studentData.name} marked present`, 'success');
            
            // Save to localStorage
            this.saveScannedStudents();
            
        } catch (error) {
            console.error('Error processing QR code:', error);
            this.showError('Error processing QR code');
        }
    }

    parseQRData(data) {
        try {
            // Try to parse as JSON
            const parsed = JSON.parse(data);
            
            // Validate required fields
            if (parsed.studentId && parsed.name && parsed.course) {
                return {
                    studentId: parsed.studentId,
                    name: parsed.name,
                    course: parsed.course,
                    semester: parsed.semester,
                    timestamp: parsed.timestamp || Date.now(),
                    sessionId: parsed.sessionId
                };
            }
            
            // Try alternative format: studentId|name|course
            const parts = data.split('|');
            if (parts.length >= 3) {
                return {
                    studentId: parts[0],
                    name: parts[1],
                    course: parts[2],
                    semester: parts[3] || '',
                    timestamp: Date.now()
                };
            }
            
            return null;
        } catch (error) {
            // Not JSON, try other formats
            const parts = data.split('|');
            if (parts.length >= 3) {
                return {
                    studentId: parts[0],
                    name: parts[1],
                    course: parts[2],
                    semester: parts[3] || '',
                    timestamp: Date.now()
                };
            }
            
            // Simple format: just student ID
            return {
                studentId: data,
                name: 'Student ' + data,
                course: 'Unknown',
                semester: '',
                timestamp: Date.now()
            };
        }
    }

    validateStudent(studentData) {
        // In a real application, this would validate against the database
        // For demo, we'll accept all students
        return true;
    }

    addScannedStudent(studentData) {
        const presentList = document.getElementById('present-list');
        if (!presentList) return;
        
        const studentEl = document.createElement('div');
        studentEl.className = 'scanned-student';
        studentEl.innerHTML = `
            <div class="student-avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.studentId}" 
                     alt="${studentData.name}">
            </div>
            <div class="student-info">
                <div class="student-name">${studentData.name}</div>
                <div class="student-id">${studentData.studentId}</div>
            </div>
            <div class="scan-time">
                ${new Date(studentData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button class="remove-student" data-id="${studentData.studentId}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        presentList.appendChild(studentEl);
        
        // Add remove event listener
        studentEl.querySelector('.remove-student').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeScannedStudent(studentData.studentId);
        });
        
        // Update counts
        this.updateCounts();
    }

    removeScannedStudent(studentId) {
        this.scannedStudents.delete(studentId);
        
        // Remove from UI
        const studentEl = document.querySelector(`[data-id="${studentId}"]`)?.closest('.scanned-student');
        if (studentEl) {
            studentEl.remove();
        }
        
        // Update counts
        this.updateCounts();
        this.saveScannedStudents();
    }

    updateCounts() {
        const presentCount = this.scannedStudents.size;
        const totalStudents = 45; // This should come from session data
        const remainingCount = totalStudents - presentCount;
        
        // Update counters
        document.getElementById('scanned-count')?.textContent = presentCount;
        document.getElementById('remaining-count')?.textContent = remainingCount;
        document.getElementById('present-count')?.textContent = presentCount;
        
        // Update percentage
        const percentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0;
        document.getElementById('attendance-percentage')?.textContent = `${percentage}%`;
        
        // Update chart if exists
        this.updateAttendanceChart();
    }

    updateAttendanceChart() {
        const canvas = document.getElementById('attendance-summary-chart');
        if (!canvas) return;
        
        const presentCount = this.scannedStudents.size;
        const totalStudents = 45; // This should come from session data
        const absentCount = totalStudents - presentCount;
        
        // Destroy existing chart if it exists
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        canvas.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent'],
                datasets: [{
                    data: [presentCount, absentCount],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    }

    updateScanningUI(isScanning) {
        const startBtn = document.getElementById('start-scanning-btn');
        const stopBtn = document.getElementById('stop-scanning-btn');
        const statusText = document.getElementById('status-text');
        
        if (startBtn) startBtn.style.display = isScanning ? 'none' : 'block';
        if (stopBtn) stopBtn.style.display = isScanning ? 'block' : 'none';
        
        if (statusText) {
            statusText.textContent = isScanning ? 'Scanning...' : 'Ready to scan';
            statusText.className = isScanning ? 'scanning' : '';
        }
    }

    switchCamera() {
        if (this.cameras.length <= 1) {
            this.showMessage('Only one camera available', 'info');
            return;
        }
        
        this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length;
        
        // Restart scanning with new camera
        if (this.isScanning) {
            this.stopScanning();
            setTimeout(() => this.startScanning(), 500);
        }
    }

    toggleFlash() {
        // Note: Flash control requires specific browser support
        // This is a simplified implementation
        this.flashEnabled = !this.flashEnabled;
        
        const flashBtn = document.getElementById('toggle-flash');
        if (flashBtn) {
            flashBtn.innerHTML = this.flashEnabled ? 
                '<i class="fas fa-lightbulb"></i> Flash On' : 
                '<i class="far fa-lightbulb"></i> Flash';
            flashBtn.classList.toggle('active', this.flashEnabled);
        }
        
        // In a real implementation, you would control the camera flash here
        this.showMessage(`Flash ${this.flashEnabled ? 'enabled' : 'disabled'}`, 'info');
    }

    showManualEntry() {
        // Switch to manual entry tab
        const manualTab = document.querySelector('[data-method="manual"]');
        if (manualTab) {
            manualTab.click();
        }
    }

    validateSession() {
        // Check if session is properly configured
        const subject = document.getElementById('select-subject')?.value;
        const section = document.getElementById('select-section')?.value;
        
        if (!subject || !section) {
            return false;
        }
        
        // Create session data if not exists
        if (!this.currentSession) {
            this.currentSession = {
                id: 'SESS-' + Date.now(),
                subject: subject,
                section: section,
                date: document.getElementById('lecture-date')?.value || new Date().toISOString().split('T')[0],
                time: document.getElementById('lecture-time')?.value || '10:00',
                topic: document.getElementById('lecture-topic')?.value || '',
                startedAt: new Date(),
                status: 'active'
            };
            
            // Update session details in UI
            this.updateSessionDetails();
        }
        
        return true;
    }

    updateSessionDetails() {
        if (!this.currentSession) return;
        
        // Update UI elements
        document.getElementById('session-subject')?.textContent = this.currentSession.subject;
        document.getElementById('session-section')?.textContent = this.currentSession.section;
        document.getElementById('session-id')?.textContent = this.currentSession.id;
        document.getElementById('session-datetime')?.textContent = 
            `${this.currentSession.date} ${this.currentSession.time}`;
        document.getElementById('session-topic')?.textContent = this.currentSession.topic;
        document.getElementById('session-started')?.textContent = 
            this.currentSession.startedAt.toLocaleTimeString();
        
        // Update session status
        const statusElement = document.getElementById('session-status');
        if (statusElement) {
            statusElement.innerHTML = '<span class="status-badge active">Active</span>';
        }
    }

    startSessionTimer() {
        const timerElement = document.getElementById('timer-display');
        if (!timerElement) return;
        
        let seconds = 0;
        
        this.timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            // Update session duration
            document.getElementById('session-duration')?.textContent = 
                `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                
        }, 1000);
    }

    async saveAttendance() {
        if (this.scannedStudents.size === 0) {
            this.showError('No students scanned yet');
            return;
        }
        
        try {
            // Show loading
            const saveBtn = document.getElementById('save-attendance');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;
            
            // Prepare attendance data
            const attendanceData = {
                session: this.currentSession,
                scannedStudents: Array.from(this.scannedStudents),
                timestamp: new Date().toISOString(),
                faculty: this.getFacultyInfo(),
                notes: document.getElementById('session-notes')?.value || ''
            };
            
            // In a real application, this would be an API call
            await this.simulateAPICall(attendanceData);
            
            // Show success
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveBtn.className = 'btn btn-sm btn-success';
            
            this.showMessage('Attendance saved successfully', 'success');
            
            // Reset after delay
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.className = 'btn btn-sm btn-success';
                saveBtn.disabled = false;
            }, 2000);
            
            // Clear scanned students
            this.clearScannedStudents();
            
        } catch (error) {
            console.error('Error saving attendance:', error);
            this.showError('Failed to save attendance');
        }
    }

    endSession() {
        if (this.isScanning) {
            this.stopScanning();
        }
        
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Update session status
        if (this.currentSession) {
            this.currentSession.status = 'ended';
            this.currentSession.endedAt = new Date();
        }
        
        // Show confirmation
        if (confirm('End attendance session? Any unsaved data will be lost.')) {
            this.resetSession();
            this.showMessage('Session ended', 'info');
        }
    }

    resetSession() {
        // Clear all data
        this.scannedStudents.clear();
        this.currentSession = null;
        
        // Clear UI
        document.getElementById('present-list').innerHTML = '';
        document.getElementById('scanned-count').textContent = '0';
        document.getElementById('remaining-count').textContent = '45';
        document.getElementById('present-count').textContent = '0';
        document.getElementById('attendance-percentage').textContent = '0%';
        
        // Reset timer
        document.getElementById('timer-display').textContent = '00:00';
        document.getElementById('session-duration').textContent = '00:00';
        
        // Reset session details
        document.getElementById('session-subject').textContent = '--';
        document.getElementById('session-section').textContent = '--';
        document.getElementById('session-id').textContent = '--';
        document.getElementById('session-datetime').textContent = '--';
        document.getElementById('session-topic').textContent = '--';
        document.getElementById('session-started').textContent = '--';
        
        // Update session status
        const statusElement = document.getElementById('session-status');
        if (statusElement) {
            statusElement.innerHTML = '<span class="status-badge inactive">Inactive</span>';
        }
        
        // Clear form
        document.getElementById('lecture-topic').value = '';
        document.getElementById('session-notes').value = '';
    }

    // Utility methods
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.scan-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `scan-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Add to scanner container
        const scannerView = document.getElementById('scanner-view');
        if (scannerView) {
            scannerView.appendChild(messageEl);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.remove();
                }
            }, 3000);
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    playScanSound() {
        // Create beep sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    }

    showScanAnimation() {
        const scannerView = document.getElementById('scanner-view');
        if (!scannerView) return;
        
        // Create animation element
        const animation = document.createElement('div');
        animation.className = 'scan-animation';
        
        scannerView.appendChild(animation);
        
        // Remove after animation completes
        setTimeout(() => {
            if (animation.parentElement) {
                animation.remove();
            }
        }, 1000);
    }

    getFacultyInfo() {
        // Get faculty info from session storage
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            const data = JSON.parse(userData);
            return {
                id: data.id,
                name: data.name,
                department: data.department
            };
        }
        
        return {
            id: 'FAC001',
            name: 'Dr. Sarah Williams',
            department: 'Computer Science'
        };
    }

    async simulateAPICall(data) {
        // Simulate API call delay
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Attendance saved:', data);
                
                // Store in local storage for demo
                const savedSessions = JSON.parse(localStorage.getItem('attendanceSessions') || '[]');
                savedSessions.push(data);
                localStorage.setItem('attendanceSessions', JSON.stringify(savedSessions));
                
                resolve();
            }, 1500);
        });
    }

    loadScannedStudents() {
        // Load previously scanned students from localStorage
        const saved = localStorage.getItem('currentScannedStudents');
        if (saved) {
            const students = JSON.parse(saved);
            this.scannedStudents = new Set(students);
            
            // Update UI
            students.forEach(studentId => {
                // This would need to load student data from an API
                // For demo, we'll create dummy data
                const studentData = {
                    studentId: studentId,
                    name: 'Student ' + studentId,
                    course: 'Computer Science',
                    semester: '5'
                };
                this.addScannedStudent(studentData);
            });
        }
    }

    saveScannedStudents() {
        localStorage.setItem('currentScannedStudents', 
            JSON.stringify(Array.from(this.scannedStudents)));
    }

    clearScannedStudents() {
        this.scannedStudents.clear();
        localStorage.removeItem('currentScannedStudents');
    }
}

// Initialize QR Scanner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const qrScanner = new QRScanner();
    
    // Make it globally available for debugging
    window.qrScanner = qrScanner;
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .scan-message {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 100;
            animation: slideDown 0.3s ease;
        }
        
        .scan-message.success {
            border-left: 4px solid #10b981;
        }
        
        .scan-message.error {
            border-left: 4px solid #ef4444;
        }
        
        .scan-message.info {
            border-left: 4px solid #3b82f6;
        }
        
        .scan-animation {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 3px solid #10b981;
            border-radius: 8px;
            animation: scanPulse 1s ease;
            pointer-events: none;
            z-index: 50;
        }
        
        @keyframes scanPulse {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(1.05);
            }
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translate(-50%, -20px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        
        .scanner-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
        }
        
        .scan-frame {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 250px;
            height: 250px;
            border: 2px solid #4361ee;
            border-radius: 8px;
        }
        
        .scan-line {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 250px;
            height: 2px;
            background: #4361ee;
            animation: scanLine 2s ease-in-out infinite;
        }
        
        @keyframes scanLine {
            0%, 100% {
                top: calc(50% - 125px);
            }
            50% {
                top: calc(50% + 125px);
            }
        }
        
        .scanned-student {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            margin-bottom: 8px;
            border: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }
        
        .scanned-student:hover {
            border-color: #4361ee;
            box-shadow: 0 2px 8px rgba(67, 97, 238, 0.1);
        }
        
        .student-avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .remove-student {
            margin-left: auto;
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .remove-student:hover {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
        }
    `;
    document.head.appendChild(style);
});