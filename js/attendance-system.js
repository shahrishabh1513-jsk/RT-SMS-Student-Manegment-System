// Attendance System for Students
class AttendanceSystem {
    constructor() {
        this.currentDate = new Date();
        this.selectedMonth = this.currentDate.getMonth();
        this.selectedYear = this.currentDate.getFullYear();
        this.attendanceData = this.loadAttendanceData();
        this.subjects = this.loadSubjects();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAttendanceOverview();
        this.renderSubjectAttendance();
        this.renderCalendar();
        this.renderDetailedRecords();
        this.renderCharts();
    }

    loadAttendanceData() {
        // Sample data - In real application, this would come from an API
        return {
            overall: {
                present: 48,
                absent: 2,
                leave: 0,
                total: 50,
                percentage: 96.0
            },
            monthly: [
                { month: 'Jan', present: 20, absent: 0, leave: 0 },
                { month: 'Feb', present: 22, absent: 0, leave: 0 },
                { month: 'Mar', present: 21, absent: 1, leave: 0 },
                { month: 'Apr', present: 19, absent: 1, leave: 0 },
                { month: 'May', present: 23, absent: 0, leave: 0 },
                { month: 'Jun', present: 20, absent: 0, leave: 0 },
                { month: 'Jul', present: 22, absent: 0, leave: 0 },
                { month: 'Aug', present: 21, absent: 1, leave: 0 },
                { month: 'Sep', present: 20, absent: 0, leave: 0 },
                { month: 'Oct', present: 23, absent: 0, leave: 0 },
                { month: 'Nov', present: 18, absent: 0, leave: 0 },
                { month: 'Dec', present: 0, absent: 0, leave: 0 }
            ],
            daily: this.generateDailyData(),
            subjects: [
                {
                    code: 'BCS-301',
                    name: 'Data Structures',
                    total: 45,
                    present: 44,
                    absent: 1,
                    leave: 0,
                    percentage: 97.8
                },
                {
                    code: 'BCS-302',
                    name: 'Database Systems',
                    total: 42,
                    present: 41,
                    absent: 1,
                    leave: 0,
                    percentage: 97.6
                },
                {
                    code: 'BCS-303',
                    name: 'Operating Systems',
                    total: 40,
                    present: 38,
                    absent: 2,
                    leave: 0,
                    percentage: 95.0
                },
                {
                    code: 'BCS-304',
                    name: 'Computer Networks',
                    total: 38,
                    present: 37,
                    absent: 1,
                    leave: 0,
                    percentage: 97.4
                },
                {
                    code: 'BCS-305',
                    name: 'Software Engineering',
                    total: 35,
                    present: 34,
                    absent: 1,
                    leave: 0,
                    percentage: 97.1
                }
            ]
        };
    }

    loadSubjects() {
        return [
            'Data Structures',
            'Database Systems',
            'Operating Systems',
            'Computer Networks',
            'Software Engineering',
            'Web Technologies',
            'Mobile Application Development',
            'Artificial Intelligence'
        ];
    }

    generateDailyData() {
        const days = [];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Get number of days in current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = date.getDay();
            
            // Skip weekends for demo
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                days.push({
                    date: day,
                    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
                    status: 'holiday',
                    subjects: []
                });
                continue;
            }
            
            // Random attendance status for demo
            const statuses = ['present', 'absent', 'leave'];
            const weights = [0.85, 0.10, 0.05]; // 85% present, 10% absent, 5% leave
            
            const random = Math.random();
            let status = 'present';
            let cumulative = 0;
            
            for (let i = 0; i < statuses.length; i++) {
                cumulative += weights[i];
                if (random < cumulative) {
                    status = statuses[i];
                    break;
                }
            }
            
            // Generate subject attendance for the day
            const subjectCount = Math.floor(Math.random() * 3) + 2; // 2-4 subjects per day
            const subjects = [];
            
            for (let i = 0; i < subjectCount; i++) {
                const subjectIndex = Math.floor(Math.random() * this.subjects.length);
                subjects.push({
                    name: this.subjects[subjectIndex],
                    time: `${9 + i}:00 - ${10 + i}:00`,
                    status: Math.random() > 0.1 ? 'present' : 'absent'
                });
            }
            
            days.push({
                date: day,
                day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
                status: status,
                subjects: subjects
            });
        }
        
        return days;
    }

    setupEventListeners() {
        // Period navigation
        document.getElementById('prev-period')?.addEventListener('click', () => this.navigatePeriod(-1));
        document.getElementById('next-period')?.addEventListener('click', () => this.navigatePeriod(1));
        
        // Month navigation for calendar
        document.getElementById('prev-month')?.addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('next-month')?.addEventListener('click', () => this.navigateMonth(1));
        
        // Filter changes
        document.getElementById('subject-filter')?.addEventListener('change', () => this.renderDetailedRecords());
        document.getElementById('status-filter')?.addEventListener('change', () => this.renderDetailedRecords());
        
        // Trend period change
        document.getElementById('trend-period')?.addEventListener('change', () => this.renderTrendChart());
        
        // Pagination
        document.getElementById('prev-page')?.addEventListener('click', () => this.changePage(-1));
        document.getElementById('next-page')?.addEventListener('click', () => this.changePage(1));
        
        // Export buttons
        document.getElementById('export-subject-data')?.addEventListener('click', () => this.exportSubjectData());
        
        // Search
        document.getElementById('attendance-search')?.addEventListener('input', (e) => {
            this.filterSubjectAttendance(e.target.value);
        });
    }

    renderAttendanceOverview() {
        const overall = this.attendanceData.overall;
        
        // Update overview stats
        document.getElementById('total-students-count')?.textContent = overall.total;
        document.getElementById('present-count')?.textContent = overall.present;
        document.getElementById('absent-count')?.textContent = overall.absent;
        document.getElementById('leave-count')?.textContent = overall.leave;
        
        // Update percentage displays
        document.querySelectorAll('.stat-value').forEach(el => {
            if (el.textContent.includes('%')) {
                el.textContent = `${overall.percentage}%`;
            }
        });
        
        // Update progress bars
        document.querySelectorAll('.progress-fill').forEach(el => {
            el.style.width = `${overall.percentage}%`;
        });
    }

    renderSubjectAttendance() {
        const tbody = document.getElementById('subject-attendance-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.attendanceData.subjects.forEach((subject, index) => {
            const row = document.createElement('tr');
            
            // Determine status class
            let statusClass = 'success';
            let statusText = 'Good';
            if (subject.percentage < 75) {
                statusClass = 'danger';
                statusText = 'Low';
            } else if (subject.percentage < 85) {
                statusClass = 'warning';
                statusText = 'Average';
            }
            
            row.innerHTML = `
                <td>
                    <strong>${subject.code}</strong><br>
                    <small>${subject.name}</small>
                </td>
                <td>${subject.total}</td>
                <td>
                    <span class="text-success">
                        <i class="fas fa-check-circle"></i> ${subject.present}
                    </span>
                </td>
                <td>
                    <span class="text-danger">
                        <i class="fas fa-times-circle"></i> ${subject.absent}
                    </span>
                </td>
                <td>
                    <div class="percentage-display">
                        <span class="percentage-value">${subject.percentage}%</span>
                        <div class="progress-bar small">
                            <div class="progress-fill" style="width: ${subject.percentage}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline view-details" data-subject="${subject.code}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners to view buttons
        tbody.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const subjectCode = e.target.closest('button').dataset.subject;
                this.showSubjectDetails(subjectCode);
            });
        });
    }

    renderCalendar() {
        const calendarEl = document.getElementById('attendance-calendar');
        if (!calendarEl) return;
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Update month display
        document.getElementById('current-month').textContent = 
            `${monthNames[this.selectedMonth]} ${this.selectedYear}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
        const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
        
        // Create calendar grid
        let calendarHTML = '<div class="calendar-header">';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });
        
        calendarHTML += '</div><div class="calendar-grid">';
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Add days of the month
        const today = new Date();
        const isCurrentMonth = today.getMonth() === this.selectedMonth && 
                               today.getFullYear() === this.selectedYear;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === today.getDate();
            const dayData = this.attendanceData.daily.find(d => d.date === day);
            const status = dayData ? dayData.status : 'none';
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (status !== 'none') classes += ` ${status}`;
            
            calendarHTML += `
                <div class="${classes}" data-day="${day}">
                    <div class="day-number">${day}</div>
                    ${status !== 'none' ? `<div class="day-status ${status}"></div>` : ''}
                    ${isToday ? '<div class="day-today">Today</div>' : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        calendarEl.innerHTML = calendarHTML;
        
        // Add click event to days
        calendarEl.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const day = parseInt(dayEl.dataset.day);
                this.showDayDetails(day);
            });
        });
    }

    renderDetailedRecords() {
        const tbody = document.getElementById('records-body');
        if (!tbody) return;
        
        const subjectFilter = document.getElementById('subject-filter')?.value || '';
        const statusFilter = document.getElementById('status-filter')?.value || '';
        
        // Filter records
        let records = this.attendanceData.daily.flatMap(day => {
            return day.subjects.map(subject => ({
                date: new Date(this.selectedYear, this.selectedMonth, day.date),
                day: day.day,
                subject: subject.name,
                time: subject.time,
                faculty: 'Dr. ' + ['Williams', 'Chen', 'Patel', 'Kumar', 'Smith'][Math.floor(Math.random() * 5)],
                status: subject.status,
                remarks: this.getRandomRemarks(subject.status)
            }));
        });
        
        // Apply filters
        if (subjectFilter) {
            records = records.filter(record => 
                record.subject.toLowerCase().includes(subjectFilter.toLowerCase())
            );
        }
        
        if (statusFilter) {
            records = records.filter(record => record.status === statusFilter);
        }
        
        // Pagination
        const itemsPerPage = 10;
        const totalPages = Math.ceil(records.length / itemsPerPage);
        let currentPage = parseInt(document.getElementById('current-page')?.textContent || '1');
        
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageRecords = records.slice(startIndex, endIndex);
        
        // Render records
        tbody.innerHTML = '';
        pageRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            const dateStr = record.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${record.day}</td>
                <td>${record.subject}</td>
                <td>${record.time}</td>
                <td>${record.faculty}</td>
                <td>
                    <span class="status-badge ${record.status}">
                        ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                </td>
                <td>${record.remarks}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Update pagination info
        document.getElementById('current-page').textContent = currentPage;
        document.getElementById('total-pages').textContent = totalPages;
        
        // Enable/disable pagination buttons
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;
    }

    renderCharts() {
        this.renderTrendChart();
        this.renderDistributionChart();
    }

    renderTrendChart() {
        const canvas = document.getElementById('attendanceTrendChart');
        if (!canvas) return;
        
        const period = document.getElementById('trend-period')?.value || 'month';
        let data = [];
        let labels = [];
        
        if (period === 'month') {
            // Last 30 days
            const today = new Date();
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                
                // Simulate attendance data
                const attendance = Math.random() > 0.2 ? 100 : (Math.random() > 0.5 ? 85 : 70);
                data.push(attendance);
            }
        } else if (period === 'semester') {
            // Last 6 months
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const today = new Date();
            
            for (let i = 5; i >= 0; i--) {
                const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                labels.push(monthNames[date.getMonth()]);
                
                // Use monthly data or generate if not available
                const monthData = this.attendanceData.monthly.find(m => 
                    m.month.toLowerCase() === monthNames[date.getMonth()].toLowerCase()
                );
                
                if (monthData) {
                    const total = monthData.present + monthData.absent + monthData.leave;
                    const percentage = total > 0 ? (monthData.present / total) * 100 : 0;
                    data.push(percentage);
                } else {
                    data.push(85 + Math.random() * 15); // Random between 85-100%
                }
            }
        }
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        
        canvas.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attendance Percentage',
                    data: data,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4361ee',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Attendance: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderDistributionChart() {
        const canvas = document.getElementById('attendanceDistributionChart');
        if (!canvas) return;
        
        const overall = this.attendanceData.overall;
        const total = overall.present + overall.absent + overall.leave;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        
        canvas.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Leave'],
                datasets: [{
                    data: [overall.present, overall.absent, overall.leave],
                    backgroundColor: [
                        '#10b981', // Success green
                        '#ef4444', // Danger red
                        '#f59e0b'  // Warning orange
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    showSubjectDetails(subjectCode) {
        const subject = this.attendanceData.subjects.find(s => s.code === subjectCode);
        if (!subject) return;
        
        // Create modal content
        const modalContent = `
            <div class="subject-details">
                <h3>${subject.code} - ${subject.name}</h3>
                <div class="detail-stats">
                    <div class="stat">
                        <span class="stat-label">Total Classes:</span>
                        <span class="stat-value">${subject.total}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Present:</span>
                        <span class="stat-value text-success">${subject.present}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Absent:</span>
                        <span class="stat-value text-danger">${subject.absent}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Attendance:</span>
                        <span class="stat-value">${subject.percentage}%</span>
                    </div>
                </div>
                
                <div class="attendance-breakdown">
                    <h4>Recent Classes</h4>
                    <table class="details-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Faculty</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generateSubjectHistory(subject).map(record => `
                                <tr>
                                    <td>${record.date}</td>
                                    <td>
                                        <span class="status-badge ${record.status}">
                                            ${record.status}
                                        </span>
                                    </td>
                                    <td>${record.faculty}</td>
                                    <td>${record.remarks}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        this.showModal('Subject Details', modalContent);
    }

    showDayDetails(day) {
        const dayData = this.attendanceData.daily.find(d => d.date === day);
        if (!dayData) return;
        
        const date = new Date(this.selectedYear, this.selectedMonth, day);
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let classesContent = '';
        if (dayData.subjects.length > 0) {
            classesContent = `
                <h4>Classes on this day:</h4>
                <div class="day-classes">
                    ${dayData.subjects.map(subject => `
                        <div class="class-item ${subject.status}">
                            <div class="class-time">${subject.time}</div>
                            <div class="class-subject">${subject.name}</div>
                            <div class="class-status">
                                <span class="status-badge ${subject.status}">
                                    ${subject.status}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        const modalContent = `
            <div class="day-details">
                <h3>${dateStr}</h3>
                <div class="day-summary">
                    <div class="summary-item">
                        <span class="label">Overall Status:</span>
                        <span class="value status-badge ${dayData.status}">
                            ${dayData.status.toUpperCase()}
                        </span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Day:</span>
                        <span class="value">${dayData.day}</span>
                    </div>
                </div>
                ${classesContent}
                <div class="day-notes">
                    <h4>Notes:</h4>
                    <p>${this.getDayNotes(dayData)}</p>
                </div>
            </div>
        `;
        
        this.showModal('Day Details', modalContent);
    }

    navigatePeriod(direction) {
        // Update current period display
        const periodElement = document.getElementById('current-period');
        if (!periodElement) return;
        
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        let currentMonth = months.indexOf(periodElement.textContent.split(' ')[0]);
        let currentYear = parseInt(periodElement.textContent.split(' ')[1]);
        
        if (isNaN(currentYear)) {
            currentMonth = this.currentDate.getMonth();
            currentYear = this.currentDate.getFullYear();
        }
        
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        
        periodElement.textContent = `${months[currentMonth]} ${currentYear}`;
        
        // Update data for selected period
        this.selectedMonth = currentMonth;
        this.selectedYear = currentYear;
        this.renderCalendar();
        this.renderDetailedRecords();
    }

    navigateMonth(direction) {
        this.selectedMonth += direction;
        if (this.selectedMonth < 0) {
            this.selectedMonth = 11;
            this.selectedYear--;
        } else if (this.selectedMonth > 11) {
            this.selectedMonth = 0;
            this.selectedYear++;
        }
        this.renderCalendar();
    }

    changePage(direction) {
        let currentPage = parseInt(document.getElementById('current-page')?.textContent || '1');
        currentPage += direction;
        
        if (currentPage < 1) currentPage = 1;
        
        document.getElementById('current-page').textContent = currentPage;
        this.renderDetailedRecords();
    }

    filterSubjectAttendance(searchTerm) {
        const rows = document.querySelectorAll('#subject-attendance-body tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    exportSubjectData() {
        const data = this.attendanceData.subjects.map(subject => ({
            'Subject Code': subject.code,
            'Subject Name': subject.name,
            'Total Classes': subject.total,
            'Present': subject.present,
            'Absent': subject.absent,
            'Leave': subject.leave,
            'Percentage': subject.percentage + '%',
            'Status': subject.percentage >= 85 ? 'Good' : 
                     subject.percentage >= 75 ? 'Average' : 'Low'
        }));
        
        this.exportToCSV(data, 'attendance_report.csv');
    }

    exportToCSV(data, filename) {
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showModal(title, content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary close-modal">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        
        // Add ESC key listener
        const escHandler = (e) => {
            if (e.key === 'Escape') modal.remove();
        };
        document.addEventListener('keydown', escHandler);
        
        // Remove listener when modal is removed
        const observer = new MutationObserver(() => {
            if (!document.body.contains(modal)) {
                document.removeEventListener('keydown', escHandler);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true });
    }

    // Helper methods
    generateSubjectHistory(subject) {
        const history = [];
        const faculties = ['Dr. Williams', 'Dr. Chen', 'Prof. Patel', 'Dr. Kumar', 'Prof. Smith'];
        const statuses = ['present', 'absent'];
        
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 2)); // Every other day
            
            history.push({
                date: date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                }),
                status: i === 0 ? 'present' : statuses[Math.floor(Math.random() * statuses.length)],
                faculty: faculties[Math.floor(Math.random() * faculties.length)],
                remarks: this.getRandomRemarks('present')
            });
        }
        
        return history;
    }

    getRandomRemarks(status) {
        const presentRemarks = [
            'Participated actively',
            'On time',
            'Good participation',
            'Active in discussion',
            'Submitted assignment'
        ];
        
        const absentRemarks = [
            'No information',
            'Medical leave',
            'Personal reasons',
            'Informed in advance',
            'Unexpected absence'
        ];
        
        const leaveRemarks = [
            'Approved leave',
            'Medical certificate provided',
            'Prior permission granted',
            'Official work',
            'Family emergency'
        ];
        
        const remarks = status === 'present' ? presentRemarks :
                       status === 'absent' ? absentRemarks : leaveRemarks;
        
        return remarks[Math.floor(Math.random() * remarks.length)];
    }

    getDayNotes(dayData) {
        if (dayData.status === 'present') {
            return 'Regular attendance maintained. All classes attended as per schedule.';
        } else if (dayData.status === 'absent') {
            return 'Absent due to medical reasons. Medical certificate submitted.';
        } else if (dayData.status === 'leave') {
            return 'Approved leave for personal work. Prior permission obtained.';
        } else if (dayData.status === 'holiday') {
            return 'Weekly holiday. No classes scheduled.';
        }
        return 'No special notes for this day.';
    }
}

// Initialize the attendance system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const attendanceSystem = new AttendanceSystem();
    
    // Make it globally available for debugging
    window.attendanceSystem = attendanceSystem;
});