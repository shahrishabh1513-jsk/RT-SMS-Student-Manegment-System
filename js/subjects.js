class SubjectsManager {
    constructor() {
        this.subjects = this.loadSubjects();
        this.init();
    }

    init() {
        this.loadSubjectsList();
        this.loadTimeTable();
        this.loadFaculty();
        this.setupEventListeners();
    }

    loadSubjects() {
        const saved = localStorage.getItem('studentSubjects');
        if (saved) {
            return JSON.parse(saved);
        }

        // Default subjects for semester 5
        return [
            {
                id: 1,
                code: 'BCS-301',
                name: 'Data Structures',
                credits: 4,
                faculty: 'Dr. Williams',
                schedule: ['mon', 'wed', 'fri'],
                room: 'CS-301',
                attendance: 98.5,
                assignments: 3,
                completedAssignments: 3,
                examDate: '2024-12-15',
                color: '#3b82f6'
            },
            {
                id: 2,
                code: 'BCS-302',
                name: 'Database Systems',
                credits: 4,
                faculty: 'Prof. Chen',
                schedule: ['tue', 'thu'],
                room: 'CS-302',
                attendance: 97.6,
                assignments: 4,
                completedAssignments: 3,
                examDate: '2024-12-18',
                color: '#10b981'
            },
            {
                id: 3,
                code: 'BCS-303',
                name: 'Operating Systems',
                credits: 3,
                faculty: 'Dr. Patel',
                schedule: ['mon', 'wed'],
                room: 'CS-303',
                attendance: 95.0,
                assignments: 3,
                completedAssignments: 2,
                examDate: '2024-12-20',
                color: '#8b5cf6'
            },
            {
                id: 4,
                code: 'BCS-304',
                name: 'Computer Networks',
                credits: 4,
                faculty: 'Prof. Sharma',
                schedule: ['tue', 'thu'],
                room: 'CS-304',
                attendance: 96.2,
                assignments: 4,
                completedAssignments: 4,
                examDate: '2024-12-22',
                color: '#f59e0b'
            },
            {
                id: 5,
                code: 'BCS-305',
                name: 'Software Engineering',
                credits: 3,
                faculty: 'Dr. Kumar',
                schedule: ['wed', 'fri'],
                room: 'CS-305',
                attendance: 99.1,
                assignments: 2,
                completedAssignments: 1,
                examDate: '2024-12-25',
                color: '#ef4444'
            },
            {
                id: 6,
                code: 'BCS-306',
                name: 'Web Technologies',
                credits: 3,
                faculty: 'Prof. Gupta',
                schedule: ['mon', 'thu'],
                room: 'CS-306',
                attendance: 94.5,
                assignments: 3,
                completedAssignments: 2,
                examDate: '2024-12-28',
                color: '#06b6d4'
            }
        ];
    }

    loadSubjectsList() {
        const container = document.getElementById('subjects-container');
        if (!container) return;

        container.innerHTML = this.subjects.map(subject => {
            const assignmentProgress = (subject.completedAssignments / subject.assignments) * 100;
            const daysLeft = this.getDaysUntilExam(subject.examDate);
            
            return `
                <div class="subject-card" style="border-left: 4px solid ${subject.color}">
                    <div class="subject-card-header">
                        <div>
                            <h4>${subject.name}</h4>
                            <p class="subject-code">${subject.code} • ${subject.credits} Credits</p>
                        </div>
                        <div class="subject-actions">
                            <button class="btn-icon edit-subject" data-id="${subject.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete-subject" data-id="${subject.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="subject-card-body">
                        <div class="subject-info">
                            <p><i class="fas fa-user-graduate"></i> ${subject.faculty}</p>
                            <p><i class="fas fa-door-open"></i> ${subject.room}</p>
                            <p><i class="fas fa-calendar-alt"></i> ${this.formatSchedule(subject.schedule)}</p>
                        </div>
                        
                        <div class="subject-stats">
                            <div class="progress-section">
                                <div class="progress-header">
                                    <span>Attendance</span>
                                    <span>${subject.attendance}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${subject.attendance}%"></div>
                                </div>
                            </div>
                            
                            <div class="progress-section">
                                <div class="progress-header">
                                    <span>Assignments</span>
                                    <span>${subject.completedAssignments}/${subject.assignments}</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${assignmentProgress}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="exam-info">
                            <span class="badge">
                                <i class="fas fa-clock"></i>
                                Exam in ${daysLeft} days
                            </span>
                            <span class="exam-date">${this.formatDate(subject.examDate)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadTimeTable() {
        const timetable = document.getElementById('timetable-body');
        if (!timetable) return;

        const timeSlots = [
            { time: '9:00 - 10:00', period: 1 },
            { time: '10:00 - 11:00', period: 2 },
            { time: '11:00 - 12:00', period: 3 },
            { time: '12:00 - 1:00', period: 4, break: true },
            { time: '2:00 - 3:00', period: 5 },
            { time: '3:00 - 4:00', period: 6 },
            { time: '4:00 - 5:00', period: 7 }
        ];

        const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        // Create schedule mapping
        const schedule = {};
        this.subjects.forEach(subject => {
            subject.schedule.forEach(day => {
                if (!schedule[day]) schedule[day] = [];
                // Assign random periods for demo
                schedule[day].push({
                    subject: subject.name,
                    code: subject.code,
                    room: subject.room,
                    period: Math.floor(Math.random() * 7) + 1,
                    color: subject.color
                });
            });
        });

        timetable.innerHTML = timeSlots.map(slot => {
            if (slot.break) {
                return `
                    <tr class="break-row">
                        <td>${slot.time}</td>
                        <td colspan="5">Lunch Break</td>
                    </tr>
                `;
            }

            const cells = days.map(day => {
                const scheduled = schedule[day]?.find(s => s.period === slot.period);
                if (scheduled) {
                    return `
                        <td class="scheduled-class" style="background: ${scheduled.color}20; border-left: 3px solid ${scheduled.color}">
                            <strong>${scheduled.subject}</strong>
                            <small>${scheduled.code}</small>
                            <small>${scheduled.room}</small>
                        </td>
                    `;
                }
                return '<td></td>';
            }).join('');

            return `
                <tr>
                    <td>${slot.time}</td>
                    ${cells}
                </tr>
            `;
        }).join('');
    }

    loadFaculty() {
        const container = document.getElementById('faculty-container');
        if (!container) return;

        // Get unique faculty from subjects
        const facultyMap = {};
        this.subjects.forEach(subject => {
            if (!facultyMap[subject.faculty]) {
                facultyMap[subject.faculty] = {
                    name: subject.faculty,
                    subjects: [],
                    email: `${subject.faculty.toLowerCase().replace(/[^a-z]/g, '')}@university.edu`,
                    phone: '+91 ' + Math.floor(Math.random() * 9000000000 + 1000000000)
                };
            }
            facultyMap[subject.faculty].subjects.push(subject.name);
        });

        const facultyList = Object.values(facultyMap);
        container.innerHTML = facultyList.map(faculty => `
            <div class="faculty-card">
                <div class="faculty-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="faculty-info">
                    <h4>${faculty.name}</h4>
                    <p><i class="fas fa-book"></i> ${faculty.subjects.join(', ')}</p>
                    <div class="faculty-contact">
                        <span><i class="fas fa-envelope"></i> ${faculty.email}</span>
                        <span><i class="fas fa-phone"></i> ${faculty.phone}</span>
                    </div>
                </div>
                <div class="faculty-actions">
                    <button class="btn-icon" title="Send Email">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                    <button class="btn-icon" title="Call">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Semester selector
        document.getElementById('semester-select').addEventListener('change', (e) => {
            this.filterBySemester(parseInt(e.target.value));
        });

        // Add subject button
        document.getElementById('add-subject').addEventListener('click', () => {
            this.openAddSubjectModal();
        });

        // Modal close
        document.querySelectorAll('.modal-close, #cancel-subject').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAddSubjectModal();
            });
        });

        // Save subject
        document.getElementById('save-subject').addEventListener('click', () => {
            this.saveSubject();
        });

        // Print schedule
        document.getElementById('print-schedule').addEventListener('click', () => {
            window.print();
        });

        // Edit/Delete subject (delegated)
        document.getElementById('subjects-container').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-subject');
            const deleteBtn = e.target.closest('.delete-subject');
            
            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                this.editSubject(id);
            }
            
            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                this.deleteSubject(id);
            }
        });

        // Click outside modal to close
        document.getElementById('add-subject-modal').addEventListener('click', (e) => {
            if (e.target.id === 'add-subject-modal') {
                this.closeAddSubjectModal();
            }
        });
    }

    openAddSubjectModal(editId = null) {
        const modal = document.getElementById('add-subject-modal');
        const form = document.getElementById('subject-form');
        
        if (editId) {
            // Edit mode
            const subject = this.subjects.find(s => s.id === editId);
            if (subject) {
                document.querySelector('.modal-header h3').textContent = 'Edit Subject';
                document.getElementById('subject-code').value = subject.code;
                document.getElementById('subject-name').value = subject.name;
                document.getElementById('subject-credits').value = subject.credits;
                document.getElementById('subject-faculty').value = subject.faculty;
                document.getElementById('subject-room').value = subject.room;
                
                // Select schedule days
                const scheduleSelect = document.getElementById('subject-schedule');
                Array.from(scheduleSelect.options).forEach(option => {
                    option.selected = subject.schedule.includes(option.value);
                });
                
                // Store the edit ID
                form.dataset.editId = editId;
            }
        } else {
            // Add mode
            document.querySelector('.modal-header h3').textContent = 'Add New Subject';
            form.reset();
            delete form.dataset.editId;
        }
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    closeAddSubjectModal() {
        const modal = document.getElementById('add-subject-modal');
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    saveSubject() {
        const form = document.getElementById('subject-form');
        const editId = form.dataset.editId;
        
        const subjectData = {
            code: document.getElementById('subject-code').value,
            name: document.getElementById('subject-name').value,
            credits: parseInt(document.getElementById('subject-credits').value),
            faculty: document.getElementById('subject-faculty').value,
            room: document.getElementById('subject-room').value,
            schedule: Array.from(document.getElementById('subject-schedule').selectedOptions)
                .map(option => option.value)
        };

        if (editId) {
            // Update existing subject
            const index = this.subjects.findIndex(s => s.id === parseInt(editId));
            if (index !== -1) {
                this.subjects[index] = {
                    ...this.subjects[index],
                    ...subjectData
                };
            }
        } else {
            // Add new subject
            const newId = Math.max(...this.subjects.map(s => s.id)) + 1;
            const newSubject = {
                id: newId,
                ...subjectData,
                attendance: 100, // Start with perfect attendance
                assignments: 0,
                completedAssignments: 0,
                examDate: '2024-12-31', // Default exam date
                color: this.getRandomColor()
            };
            this.subjects.push(newSubject);
        }

        this.saveSubjects();
        this.loadSubjectsList();
        this.loadTimeTable();
        this.loadFaculty();
        this.closeAddSubjectModal();
        this.showToast(editId ? 'Subject updated!' : 'Subject added!', 'success');
    }

    editSubject(id) {
        this.openAddSubjectModal(id);
    }

    deleteSubject(id) {
        if (confirm('Are you sure you want to delete this subject?')) {
            this.subjects = this.subjects.filter(s => s.id !== id);
            this.saveSubjects();
            this.loadSubjectsList();
            this.loadTimeTable();
            this.loadFaculty();
            this.showToast('Subject deleted!', 'info');
        }
    }

    filterBySemester(semester) {
        // For now, just update the UI to show we're filtering
        // In a real app, you would load subjects for that semester
        this.showToast(`Showing subjects for Semester ${semester}`, 'info');
    }

    // Utility methods
    formatSchedule(schedule) {
        const dayMap = {
            'mon': 'Mon',
            'tue': 'Tue',
            'wed': 'Wed',
            'thu': 'Thu',
            'fri': 'Fri',
            'sat': 'Sat'
        };
        return schedule.map(day => dayMap[day] || day).join(', ');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getDaysUntilExam(examDate) {
        const today = new Date();
        const exam = new Date(examDate);
        const diffTime = exam - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    getRandomColor() {
        const colors = [
            '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
            '#ef4444', '#06b6d4', '#84cc16', '#f97316'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    saveSubjects() {
        localStorage.setItem('studentSubjects', JSON.stringify(this.subjects));
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 3000);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SubjectsManager();
});