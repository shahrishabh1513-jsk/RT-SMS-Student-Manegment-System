// profile.js
document.addEventListener('DOMContentLoaded', function() {
    // Student Profile Management
    class StudentProfile {
        constructor() {
            this.profileData = this.loadProfileData();
            this.init();
        }

        init() {
            this.loadProfile();
            this.setupEventListeners();
            this.setupEditModal();
            this.initProfilePhoto();
            this.initAdditionalListeners();
            this.updateSemesterBasedOnDate();
            
            // Show welcome message
            setTimeout(() => {
                this.showToast(`Welcome back, ${this.profileData.personal.firstName}!`, 'info');
            }, 1000);
        }

        loadProfileData() {
            // Load from localStorage or use default data
            const savedData = localStorage.getItem('studentProfile');
            if (savedData) {
                return JSON.parse(savedData);
            }

            // Default profile data
            return {
                personal: {
                    firstName: 'John',
                    lastName: 'Smith',
                    fullName: 'John Michael Smith',
                    studentId: 'STU2023001',
                    dateOfBirth: '2002-05-15',
                    age: 22,
                    gender: 'Male',
                    nationality: 'Indian',
                    bloodGroup: 'O+',
                    aadharNumber: 'XXXX-XXXX-1234',
                    religion: 'Christian'
                },
                contact: {
                    email: 'john.smith@university.edu',
                    phone: '+91 98765 43210',
                    currentAddress: '123 University Road, Mumbai, Maharashtra 400001',
                    permanentAddress: '456 College Street, Pune, Maharashtra 411001',
                    linkedin: 'linkedin.com/in/johnsmith',
                    github: 'github.com/johnsmith'
                },
                academic: {
                    university: 'University of Technology',
                    course: 'Bachelor of Science in Computer Science',
                    semester: 5,
                    rollNumber: 'CS21S001',
                    batch: '2021-2024',
                    section: 'A',
                    gpa: 3.75,
                    totalCredits: 120,
                    completedCredits: 78
                },
                emergency: [
                    {
                        name: 'Michael Smith',
                        relationship: 'Father',
                        phone: '+91 98765 43211',
                        email: 'michael@email.com',
                        isPrimary: true
                    },
                    {
                        name: 'Sarah Smith',
                        relationship: 'Mother',
                        phone: '+91 98765 43212',
                        email: 'sarah@email.com',
                        isPrimary: false
                    }
                ],
                subjects: [
                    {
                        code: 'BCS-301',
                        name: 'Data Structures',
                        credits: 4,
                        faculty: 'Dr. Williams',
                        schedule: ['Mon', 'Wed', 'Fri'],
                        attendance: 98.5
                    },
                    {
                        code: 'BCS-302',
                        name: 'Database Systems',
                        credits: 4,
                        faculty: 'Prof. Chen',
                        schedule: ['Tue', 'Thu'],
                        attendance: 97.6
                    },
                    {
                        code: 'BCS-303',
                        name: 'Operating Systems',
                        credits: 3,
                        faculty: 'Dr. Patel',
                        schedule: ['Mon', 'Wed'],
                        attendance: 95.0
                    }
                ],
                skills: [
                    'JavaScript', 'Python', 'React.js', 'Node.js',
                    'MongoDB', 'Git', 'Docker', 'AWS'
                ],
                achievements: [
                    {
                        title: "Dean's List 2023",
                        description: "Academic excellence award for maintaining GPA above 3.8",
                        date: "December 2023",
                        type: "academic"
                    },
                    {
                        title: "Hackathon Winner",
                        description: "1st place in University Tech Fest Hackathon",
                        date: "October 2023",
                        type: "competition"
                    }
                ],
                documents: [
                    {
                        name: 'Student ID Card',
                        type: 'pdf',
                        size: '2.4 MB',
                        lastUpdated: '2024-11-15'
                    },
                    {
                        name: 'Profile Photo',
                        type: 'image',
                        size: '1.2 MB',
                        lastUpdated: '2024-11-10'
                    },
                    {
                        name: 'Admission Form',
                        type: 'pdf',
                        size: '5.1 MB',
                        lastUpdated: '2021-08-20'
                    }
                ],
                stats: {
                    attendance: 95.2,
                    gpa: 3.75,
                    semester: 5,
                    grade: 'A+'
                }
            };
        }

        loadProfile() {
            // Update profile header
            this.updateProfileHeader();
            
            // Update personal information
            this.updatePersonalInfo();
            
            // Update contact information
            this.updateContactInfo();
            
            // Update academic information
            this.updateAcademicInfo();
            
            // Update emergency contacts
            this.updateEmergencyContacts();
            
            // Update subjects
            this.updateSubjects();
            
            // Update skills and achievements
            this.updateSkillsAchievements();
            
            // Update documents
            this.updateDocuments();
        }

        updateProfileHeader() {
            const { personal, stats } = this.profileData;
            
            // Update profile name
            const profileNameEl = document.querySelector('.profile-name');
            if (profileNameEl) {
                profileNameEl.textContent = personal.fullName;
            }
            
            document.querySelectorAll('#student-name').forEach(el => {
                el.textContent = personal.fullName;
            });
            
            // Update title
            const title = `${this.profileData.academic.course} Student`;
            const profileTitleEl = document.querySelector('.profile-title');
            if (profileTitleEl) {
                profileTitleEl.textContent = title;
            }
            
            // Update student course in sidebar
            const studentCourseEl = document.getElementById('student-course');
            if (studentCourseEl) {
                studentCourseEl.textContent = `${this.profileData.academic.course} - Sem ${this.profileData.academic.semester}`;
            }
            
            // Update stats
            document.querySelectorAll('.stat-value').forEach((el, index) => {
                const values = [stats.attendance + '%', stats.gpa, stats.semester, stats.grade];
                if (index < values.length) {
                    el.textContent = values[index];
                }
            });
        }

        updatePersonalInfo() {
            const { personal } = this.profileData;
            const infoGrid = document.querySelector('.info-grid');
            
            if (infoGrid) {
                const infoItems = [
                    { label: 'Student ID', value: personal.studentId },
                    { label: 'Full Name', value: personal.fullName },
                    { label: 'Date of Birth', value: `${this.formatDate(personal.dateOfBirth)} (${personal.age} years)` },
                    { label: 'Gender', value: personal.gender },
                    { label: 'Nationality', value: personal.nationality },
                    { label: 'Blood Group', value: personal.bloodGroup },
                    { label: 'Aadhar Number', value: personal.aadharNumber },
                    { label: 'Religion', value: personal.religion }
                ];
                
                infoGrid.innerHTML = infoItems.map(item => `
                    <div class="info-item">
                        <span class="info-label">${item.label}</span>
                        <span class="info-value">${item.value}</span>
                    </div>
                `).join('');
            }
        }

        updateContactInfo() {
            const { contact } = this.profileData;
            const contactInfo = document.querySelector('.contact-info');
            
            if (contactInfo) {
                const contactItems = [
                    { icon: 'envelope', label: 'Email Address', value: contact.email },
                    { icon: 'phone', label: 'Phone Number', value: contact.phone },
                    { icon: 'map-marker-alt', label: 'Current Address', value: contact.currentAddress },
                    { icon: 'home', label: 'Permanent Address', value: contact.permanentAddress },
                    { icon: 'globe', label: 'LinkedIn', value: contact.linkedin, isLink: true },
                    { icon: 'github', label: 'GitHub', value: contact.github, isLink: true }
                ];
                
                contactInfo.innerHTML = contactItems.map(item => `
                    <div class="contact-item">
                        <i class="fas fa-${item.icon}"></i>
                        <div>
                            <span class="contact-label">${item.label}</span>
                            ${item.isLink ? 
                                `<a href="https://${item.value}" class="contact-value" target="_blank">${item.value}</a>` :
                                `<span class="contact-value">${item.value}</span>`
                            }
                        </div>
                    </div>
                `).join('');
            }
        }

        updateAcademicInfo() {
            const { academic } = this.profileData;
            const academicInfo = document.querySelector('.academic-info');
            
            if (academicInfo) {
                // Calculate progress percentages
                const gpaPercentage = (academic.gpa / 4.0) * 100;
                const creditsPercentage = (academic.completedCredits / academic.totalCredits) * 100;
                
                academicInfo.innerHTML = `
                    <div class="academic-item">
                        <div class="academic-icon">
                            <i class="fas fa-university"></i>
                        </div>
                        <div class="academic-details">
                            <h4>${academic.university}</h4>
                            <p>${academic.course}</p>
                            <div class="academic-meta">
                                <span class="badge">${academic.batch}</span>
                                <span class="badge">Full Time</span>
                                <span class="badge">On Campus</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="academic-stats">
                        <div class="stat">
                            <span class="stat-label">Current Semester</span>
                            <span class="stat-value">Semester ${academic.semester}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Roll Number</span>
                            <span class="stat-value">${academic.rollNumber}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Batch</span>
                            <span class="stat-value">${academic.batch}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Section</span>
                            <span class="stat-value">${academic.section}</span>
                        </div>
                    </div>
                    
                    <div class="academic-progress">
                        <h5>Academic Progress</h5>
                        <div class="progress-item">
                            <span class="progress-label">Overall GPA</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${gpaPercentage}%"></div>
                            </div>
                            <span class="progress-value">${academic.gpa}/4.0</span>
                        </div>
                        <div class="progress-item">
                            <span class="progress-label">Credit Completion</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${creditsPercentage}%"></div>
                            </div>
                            <span class="progress-value">${academic.completedCredits}/${academic.totalCredits} Credits</span>
                        </div>
                    </div>
                `;
            }
        }

        updateEmergencyContacts() {
            const emergencyContacts = document.querySelector('.emergency-contacts');
            
            if (emergencyContacts) {
                emergencyContacts.innerHTML = this.profileData.emergency.map(contact => `
                    <div class="emergency-item">
                        <div class="emergency-icon">
                            <i class="fas fa-${contact.isPrimary ? 'user-md' : 'user-nurse'}"></i>
                        </div>
                        <div class="emergency-details">
                            <h4>${contact.name} (${contact.relationship})</h4>
                            <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                            <p><i class="fas fa-envelope"></i> ${contact.email}</p>
                            <span class="relationship">
                                ${contact.relationship} • ${contact.isPrimary ? 'Primary Contact' : 'Secondary Contact'}
                            </span>
                        </div>
                    </div>
                `).join('');
            }
        }

        updateSubjects() {
            const subjectsList = document.querySelector('.subjects-list');
            
            if (subjectsList) {
                subjectsList.innerHTML = this.profileData.subjects.map(subject => {
                    const icon = subject.name.includes('Data') ? 'code' :
                                subject.name.includes('Database') ? 'database' :
                                subject.name.includes('Operating') ? 'server' : 'book';
                    
                    return `
                        <div class="subject-item">
                            <div class="subject-icon">
                                <i class="fas fa-${icon}"></i>
                            </div>
                            <div class="subject-details">
                                <h4>${subject.name}</h4>
                                <p>${subject.code} • ${subject.credits} Credits</p>
                                <div class="subject-meta">
                                    <span class="badge">${subject.faculty}</span>
                                    <span class="badge">${subject.schedule.join(', ')}</span>
                                </div>
                            </div>
                            <div class="subject-attendance">
                                <span class="attendance-value">${subject.attendance}%</span>
                                <div class="progress-bar small">
                                    <div class="progress-fill" style="width: ${subject.attendance}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        updateSkillsAchievements() {
            // Update skills
            const skillsTags = document.querySelector('.skills-tags');
            if (skillsTags) {
                skillsTags.innerHTML = this.profileData.skills.map(skill => 
                    `<span class="skill-tag">${skill}</span>`
                ).join('');
            }
            
            // Update achievements
            const achievementsList = document.querySelector('.achievements-list');
            if (achievementsList) {
                achievementsList.innerHTML = this.profileData.achievements.map(achievement => {
                    const icon = achievement.type === 'academic' ? 'award' : 'code';
                    const iconColor = achievement.type === 'academic' ? 
                        'linear-gradient(135deg, #f59e0b, #f97316)' : 
                        'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                    
                    return `
                        <div class="achievement-item">
                            <div class="achievement-icon" style="background: ${iconColor}">
                                <i class="fas fa-${icon}"></i>
                            </div>
                            <div class="achievement-details">
                                <h5>${achievement.title}</h5>
                                <p>${achievement.description}</p>
                                <span class="achievement-date">${achievement.date}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        updateDocuments() {
            const documentsList = document.querySelector('.documents-list');
            
            if (documentsList) {
                documentsList.innerHTML = this.profileData.documents.map(doc => {
                    const icon = doc.type === 'pdf' ? 'file-pdf' : 'file-image';
                    const iconColor = doc.type === 'pdf' ? '#ef4444' : '#3b82f6';
                    
                    return `
                        <div class="document-item">
                            <div class="document-icon" style="background: rgba(${iconColor === '#ef4444' ? '239,68,68' : '59,130,246'}, 0.1); color: ${iconColor}">
                                <i class="fas fa-${icon}"></i>
                            </div>
                            <div class="document-details">
                                <h5>${doc.name}</h5>
                                <p>${doc.type.toUpperCase()} • ${doc.size} • Last updated: ${this.formatDate(doc.lastUpdated)}</p>
                            </div>
                            <div class="document-actions">
                                <button class="btn-icon" title="Download">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="btn-icon" title="Preview">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        setupEventListeners() {
            // Edit profile button
            const editProfileBtn = document.getElementById('edit-profile');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', () => {
                    this.openEditModal();
                });
            }
            
            // Edit personal info
            const editPersonalBtn = document.getElementById('edit-personal');
            if (editPersonalBtn) {
                editPersonalBtn.addEventListener('click', () => {
                    this.openEditModal('personal');
                });
            }
            
            // Edit contact info
            const editContactBtn = document.getElementById('edit-contact');
            if (editContactBtn) {
                editContactBtn.addEventListener('click', () => {
                    this.openEditModal('contact');
                });
            }
            
            // Edit academic info
            const editAcademicBtn = document.getElementById('edit-academic');
            if (editAcademicBtn) {
                editAcademicBtn.addEventListener('click', () => {
                    this.openEditModal('academic');
                });
            }
            
            // Add emergency contact
            const addEmergencyBtn = document.getElementById('add-emergency');
            if (addEmergencyBtn) {
                addEmergencyBtn.addEventListener('click', () => {
                    this.addEmergencyContact();
                });
            }
            
            // Add achievement
            const addAchievementBtn = document.getElementById('add-achievement');
            if (addAchievementBtn) {
                addAchievementBtn.addEventListener('click', () => {
                    this.addAchievement();
                });
            }
            
            // Upload document
            const uploadDocumentBtn = document.getElementById('upload-document');
            if (uploadDocumentBtn) {
                uploadDocumentBtn.addEventListener('click', () => {
                    this.uploadDocument();
                });
            }
            
            // Upload photo
            const uploadPhotoBtn = document.getElementById('upload-photo');
            if (uploadPhotoBtn) {
                uploadPhotoBtn.addEventListener('click', () => {
                    this.uploadPhoto();
                });
            }
            
            // Remove photo
            const removePhotoBtn = document.getElementById('remove-photo');
            if (removePhotoBtn) {
                removePhotoBtn.addEventListener('click', () => {
                    this.removePhoto();
                });
            }
            
            // Download ID card
            const downloadIdBtn = document.getElementById('download-id');
            if (downloadIdBtn) {
                downloadIdBtn.addEventListener('click', () => {
                    this.downloadIDCard();
                });
            }
            
            // Share profile
            const shareProfileBtn = document.getElementById('share-profile');
            if (shareProfileBtn) {
                shareProfileBtn.addEventListener('click', () => {
                    this.shareProfile();
                });
            }
            
            // View all subjects
            const viewSubjectsBtn = document.getElementById('view-all-subjects');
            if (viewSubjectsBtn) {
                viewSubjectsBtn.addEventListener('click', () => {
                    window.location.href = 'subjects.html';
                });
            }
            
            // Profile search
            const profileSearch = document.getElementById('profile-search');
            if (profileSearch) {
                profileSearch.addEventListener('input', (e) => {
                    this.filterProfileContent(e.target.value);
                });
            }
            
            // Edit cover button
            const editCoverBtn = document.querySelector('.edit-cover-btn');
            if (editCoverBtn) {
                editCoverBtn.addEventListener('click', () => {
                    this.changeCoverPhoto();
                });
            }
            
            // Edit avatar button
            const editAvatarBtn = document.querySelector('.edit-avatar-btn');
            if (editAvatarBtn) {
                editAvatarBtn.addEventListener('click', () => {
                    this.changeAvatar();
                });
            }
        }

        setupEditModal() {
            const modal = document.getElementById('edit-profile-modal');
            if (!modal) return;
            
            // Tab switching
            modal.querySelectorAll('.form-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    this.switchEditTab(tabName);
                });
            });
            
            // Cancel button
            const cancelBtn = modal.querySelector('#cancel-edit');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.closeEditModal();
                });
            }
            
            // Save button
            const saveBtn = modal.querySelector('#save-profile');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    this.saveProfileChanges();
                });
            }
            
            // Close modal on overlay click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeEditModal();
                }
            });
            
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeEditModal();
                });
            }
        }

        openEditModal(defaultTab = 'personal') {
            const modal = document.getElementById('edit-profile-modal');
            if (!modal) return;
            
            // Populate form with current data
            this.populateEditForm();
            
            // Switch to default tab
            this.switchEditTab(defaultTab);
            
            // Show modal
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        closeEditModal() {
            const modal = document.getElementById('edit-profile-modal');
            if (!modal) return;
            
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }

        switchEditTab(tabName) {
            const modal = document.getElementById('edit-profile-modal');
            if (!modal) return;
            
            // Update active tab
            modal.querySelectorAll('.form-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });
            
            // Show active tab content
            modal.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.dataset.tab === tabName);
            });
        }

        populateEditForm() {
            const { personal, contact, academic, emergency } = this.profileData;
            const modal = document.getElementById('edit-profile-modal');
            
            if (!modal) return;
            
            // Personal tab
            const personalInputs = modal.querySelectorAll('[data-tab="personal"] input');
            if (personalInputs.length >= 2) {
                personalInputs[0].value = personal.firstName;
                personalInputs[1].value = personal.lastName;
            }
            
            const personalDate = modal.querySelector('[data-tab="personal"] input[type="date"]');
            if (personalDate) personalDate.value = personal.dateOfBirth;
            
            const personalSelect = modal.querySelector('[data-tab="personal"] select');
            if (personalSelect) personalSelect.value = personal.gender.toLowerCase();
            
            // Contact tab
            const contactEmail = modal.querySelector('[data-tab="contact"] input[type="email"]');
            if (contactEmail) contactEmail.value = contact.email;
            
            const contactPhone = modal.querySelector('[data-tab="contact"] input[type="tel"]');
            if (contactPhone) contactPhone.value = contact.phone;
            
            const contactTextarea = modal.querySelector('[data-tab="contact"] textarea');
            if (contactTextarea) contactTextarea.value = contact.currentAddress;
            
            // Academic tab
            const academicInput = modal.querySelector('[data-tab="academic"] input[type="text"]');
            if (academicInput) academicInput.value = academic.course;
            
            const academicSelect = modal.querySelector('[data-tab="academic"] select');
            if (academicSelect) academicSelect.value = academic.semester;
            
            // Emergency tab (first contact)
            if (emergency.length > 0) {
                const primaryContact = emergency.find(ec => ec.isPrimary) || emergency[0];
                const emergencyInputs = modal.querySelectorAll('[data-tab="emergency"] input');
                if (emergencyInputs.length >= 3) {
                    emergencyInputs[0].value = primaryContact.name;
                    emergencyInputs[1].value = primaryContact.relationship;
                    emergencyInputs[2].value = primaryContact.phone;
                }
            }
        }

        saveProfileChanges() {
            const modal = document.getElementById('edit-profile-modal');
            if (!modal) return;
            
            // Get form data
            const formData = {
                personal: {
                    firstName: modal.querySelector('[data-tab="personal"] input[type="text"]:first-child').value,
                    lastName: modal.querySelector('[data-tab="personal"] input[type="text"]:nth-child(2)').value,
                    dateOfBirth: modal.querySelector('[data-tab="personal"] input[type="date"]').value,
                    gender: modal.querySelector('[data-tab="personal"] select').value
                },
                contact: {
                    email: modal.querySelector('[data-tab="contact"] input[type="email"]').value,
                    phone: modal.querySelector('[data-tab="contact"] input[type="tel"]').value,
                    currentAddress: modal.querySelector('[data-tab="contact"] textarea').value
                },
                academic: {
                    course: modal.querySelector('[data-tab="academic"] input[type="text"]').value,
                    semester: parseInt(modal.querySelector('[data-tab="academic"] select').value)
                }
            };
            
            // Update profile data
            this.profileData.personal = {
                ...this.profileData.personal,
                ...formData.personal,
                fullName: `${formData.personal.firstName} ${formData.personal.lastName}`,
                age: this.calculateAge(formData.personal.dateOfBirth)
            };
            
            this.profileData.contact = {
                ...this.profileData.contact,
                ...formData.contact
            };
            
            this.profileData.academic = {
                ...this.profileData.academic,
                ...formData.academic
            };
            
            // Save to localStorage
            this.saveProfileData();
            
            // Update UI
            this.loadProfile();
            
            // Show success message
            this.showToast('Profile updated successfully!', 'success');
            
            // Close modal
            this.closeEditModal();
        }

        addEmergencyContact() {
            const name = prompt('Enter contact name:');
            if (!name) return;
            
            const relationship = prompt('Enter relationship:');
            if (!relationship) return;
            
            const phone = prompt('Enter phone number:');
            if (!phone) return;
            
            const email = prompt('Enter email address:') || '';
            
            const newContact = {
                name,
                relationship,
                phone,
                email,
                isPrimary: this.profileData.emergency.length === 0 // First contact is primary
            };
            
            this.profileData.emergency.push(newContact);
            this.saveProfileData();
            this.updateEmergencyContacts();
            
            this.showToast('Emergency contact added successfully!', 'success');
        }

        addAchievement() {
            const title = prompt('Enter achievement title:');
            if (!title) return;
            
            const description = prompt('Enter achievement description:');
            if (!description) return;
            
            const date = prompt('Enter date (e.g., December 2023):');
            if (!date) return;
            
            const type = prompt('Enter type (academic/competition/other):') || 'other';
            
            const newAchievement = {
                title,
                description,
                date,
                type
            };
            
            this.profileData.achievements.push(newAchievement);
            this.saveProfileData();
            this.updateSkillsAchievements();
            
            this.showToast('Achievement added successfully!', 'success');
        }

        uploadDocument() {
            // Simulate file upload
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // Simulate upload process
                this.showToast('Uploading document...', 'info');
                
                setTimeout(() => {
                    const newDocument = {
                        name: file.name,
                        type: this.getFileType(file.name),
                        size: this.formatFileSize(file.size),
                        lastUpdated: new Date().toISOString().split('T')[0]
                    };
                    
                    this.profileData.documents.unshift(newDocument);
                    this.saveProfileData();
                    this.updateDocuments();
                    
                    this.showToast('Document uploaded successfully!', 'success');
                }, 1500);
            };
            
            input.click();
        }

        uploadPhoto() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                if (!file.type.startsWith('image/')) {
                    this.showToast('Please select an image file!', 'error');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    this.showToast('Image size should be less than 5MB!', 'error');
                    return;
                }
                
                // Show upload progress
                this.showToast('Uploading photo...', 'info');
                
                // Simulate upload process
                setTimeout(() => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        // Save to localStorage
                        localStorage.setItem('studentProfilePhoto', event.target.result);
                        
                        // Update profile image
                        this.updateProfileImage(event.target.result);
                        
                        this.showToast('Profile photo updated successfully!', 'success');
                    };
                    reader.readAsDataURL(file);
                }, 1500);
            };
            
            input.click();
        }

        updateProfileImage(imageData) {
            // Update avatar
            const avatar = document.querySelector('.profile-avatar img');
            if (avatar) {
                avatar.src = imageData;
            }
            
            const sidebarAvatar = document.querySelector('#student-avatar');
            if (sidebarAvatar) {
                sidebarAvatar.src = imageData;
            }
            
            // Update all profile images
            document.querySelectorAll('.profile-image').forEach(img => {
                img.src = imageData;
            });
        }

        removePhoto() {
            if (confirm('Are you sure you want to remove your profile photo?')) {
                localStorage.removeItem('studentProfilePhoto');
                
                // Reset to default avatar
                const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=student001';
                
                this.updateProfileImage(defaultAvatar);
                this.showToast('Profile photo removed!', 'info');
            }
        }

        downloadIDCard() {
            this.showToast('Generating ID card...', 'info');
            
            // Simulate ID card generation
            setTimeout(() => {
                // Create a simple PDF download
                const content = `
                    <html>
                        <head>
                            <title>ID Card - ${this.profileData.personal.fullName}</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; }
                                .id-card { border: 2px solid #4361ee; border-radius: 10px; padding: 20px; max-width: 400px; }
                                .header { text-align: center; margin-bottom: 20px; }
                                .photo { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; }
                                .details { margin-bottom: 20px; }
                                .detail-row { margin-bottom: 10px; }
                                .label { font-weight: bold; color: #666; }
                                .value { color: #333; }
                                .footer { text-align: center; color: #666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="id-card">
                                <div class="header">
                                    <h2>University ID Card</h2>
                                </div>
                                <div class="photo">
                                    <img src="${document.querySelector('.profile-avatar img').src}" style="width:100%;height:100%;border-radius:50%;" />
                                </div>
                                <div class="details">
                                    <div class="detail-row">
                                        <span class="label">Name:</span>
                                        <span class="value">${this.profileData.personal.fullName}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Student ID:</span>
                                        <span class="value">${this.profileData.personal.studentId}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Course:</span>
                                        <span class="value">${this.profileData.academic.course}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Semester:</span>
                                        <span class="value">${this.profileData.academic.semester}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Valid Until:</span>
                                        <span class="value">${this.profileData.academic.batch.split('-')[1]}</span>
                                    </div>
                                </div>
                                <div class="footer">
                                    <p>This is an official ID card of University of Technology</p>
                                </div>
                            </div>
                        </body>
                    </html>
                `;
                
                // Create download link
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ID_Card_${this.profileData.personal.studentId}.html`;
                link.click();
                
                this.showToast('ID card downloaded successfully!', 'success');
            }, 2000);
        }

        shareProfile() {
            if (navigator.share) {
                navigator.share({
                    title: `${this.profileData.personal.fullName} - Student Profile`,
                    text: `Check out ${this.profileData.personal.fullName}'s student profile`,
                    url: window.location.href
                }).catch(error => {
                    this.copyProfileLink();
                });
            } else {
                this.copyProfileLink();
            }
        }

        copyProfileLink() {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    this.showToast('Profile link copied to clipboard!', 'success');
                })
                .catch(() => {
                    this.showToast('Failed to copy link', 'error');
                });
        }

        filterProfileContent(searchTerm) {
            const sections = document.querySelectorAll('.content-card');
            const lowerSearchTerm = searchTerm.toLowerCase();
            
            sections.forEach(section => {
                const content = section.textContent.toLowerCase();
                section.style.display = content.includes(lowerSearchTerm) ? 'block' : 'none';
            });
        }

        changeCoverPhoto() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                if (!file.type.startsWith('image/')) {
                    this.showToast('Please select an image file!', 'error');
                    return;
                }
                
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    this.showToast('Image size should be less than 10MB!', 'error');
                    return;
                }
                
                this.showToast('Uploading cover photo...', 'info');
                
                setTimeout(() => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        localStorage.setItem('studentCoverPhoto', event.target.result);
                        
                        const coverImg = document.querySelector('.cover-image img');
                        if (coverImg) {
                            coverImg.src = event.target.result;
                        }
                        
                        this.showToast('Cover photo updated successfully!', 'success');
                    };
                    reader.readAsDataURL(file);
                }, 1500);
            };
            
            input.click();
        }

        changeAvatar() {
            this.uploadPhoto();
        }

        // Utility methods
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        calculateAge(dateOfBirth) {
            if (!dateOfBirth) return 0;
            
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age;
        }

        getFileType(filename) {
            const extension = filename.split('.').pop().toLowerCase();
            
            if (['pdf'].includes(extension)) return 'pdf';
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
            if (['doc', 'docx'].includes(extension)) return 'document';
            if (['xls', 'xlsx'].includes(extension)) return 'spreadsheet';
            
            return 'file';
        }

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }

        saveProfileData() {
            localStorage.setItem('studentProfile', JSON.stringify(this.profileData));
        }

        showToast(message, type = 'info') {
            // Remove existing toast
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            // Create toast
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            `;
            
            // Add to DOM
            document.body.appendChild(toast);
            
            // Show toast
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, 3000);
            
            // Close button
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            });
        }

        // Export profile data
        exportProfileData() {
            const dataStr = JSON.stringify(this.profileData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `student_profile_${this.profileData.personal.studentId}_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showToast('Profile data exported successfully!', 'success');
        }

        // Import profile data
        importProfileData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        
                        // Validate imported data structure
                        if (this.validateProfileData(importedData)) {
                            if (confirm('Importing will overwrite current profile. Continue?')) {
                                this.profileData = importedData;
                                this.saveProfileData();
                                this.loadProfile();
                                this.showToast('Profile imported successfully!', 'success');
                            }
                        } else {
                            this.showToast('Invalid profile data format!', 'error');
                        }
                    } catch (error) {
                        this.showToast('Error parsing profile data!', 'error');
                    }
                };
                reader.readAsText(file);
            };
            
            input.click();
        }

        validateProfileData(data) {
            // Basic validation - check for required fields
            const requiredFields = ['personal', 'contact', 'academic'];
            return requiredFields.every(field => data[field]);
        }

        // Print profile
        printProfile() {
            window.print();
        }

        // Reset to default
        resetProfile() {
            if (confirm('This will reset all profile data to default. Are you sure?')) {
                localStorage.removeItem('studentProfile');
                localStorage.removeItem('studentProfilePhoto');
                localStorage.removeItem('studentCoverPhoto');
                
                this.profileData = this.loadProfileData();
                this.loadProfile();
                
                this.showToast('Profile reset to default!', 'info');
            }
        }

        // Add skill
        addSkill() {
            const skill = prompt('Enter new skill:');
            if (!skill) return;
            
            this.profileData.skills.push(skill);
            this.saveProfileData();
            this.updateSkillsAchievements();
            
            this.showToast('Skill added successfully!', 'success');
        }

        // Remove skill
        removeSkill(skillToRemove) {
            this.profileData.skills = this.profileData.skills.filter(skill => skill !== skillToRemove);
            this.saveProfileData();
            this.updateSkillsAchievements();
            
            this.showToast('Skill removed!', 'info');
        }

        // Update subject attendance
        updateSubjectAttendance(subjectCode, newAttendance) {
            const subject = this.profileData.subjects.find(sub => sub.code === subjectCode);
            if (subject) {
                subject.attendance = newAttendance;
                
                // Update overall attendance
                this.updateOverallStats();
                
                this.saveProfileData();
                this.updateSubjects();
                
                this.showToast(`Attendance for ${subject.name} updated to ${newAttendance}%`, 'success');
            }
        }

        updateOverallStats() {
            // Calculate average attendance
            const totalAttendance = this.profileData.subjects.reduce((sum, sub) => sum + sub.attendance, 0);
            const avgAttendance = totalAttendance / this.profileData.subjects.length;
            
            this.profileData.stats.attendance = parseFloat(avgAttendance.toFixed(1));
        }

        // Get profile completion percentage
        getProfileCompletion() {
            const sections = [
                this.profileData.personal,
                this.profileData.contact,
                this.profileData.academic,
                this.profileData.emergency.length > 0,
                this.profileData.subjects.length > 0,
                this.profileData.skills.length > 0,
                this.profileData.achievements.length > 0
            ];
            
            const completed = sections.filter(section => {
                if (typeof section === 'boolean') return section;
                if (Array.isArray(section)) return section.length > 0;
                return Object.keys(section).length > 0;
            }).length;
            
            return Math.round((completed / sections.length) * 100);
        }

        // Initialize additional event listeners
        initAdditionalListeners() {
            // Profile completion indicator
            const completion = this.getProfileCompletion();
            const completionElement = document.createElement('div');
            completionElement.className = 'profile-completion';
            completionElement.innerHTML = `
                <div class="completion-bar">
                    <div class="completion-fill" style="width: ${completion}%"></div>
                </div>
                <span class="completion-text">Profile ${completion}% Complete</span>
            `;
            
            const profileActions = document.querySelector('.profile-actions');
            if (profileActions) {
                profileActions.parentNode.insertBefore(completionElement, profileActions.nextSibling);
            }
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'p') {
                    e.preventDefault();
                    this.printProfile();
                }
                
                if (e.ctrlKey && e.key === 'e') {
                    e.preventDefault();
                    this.openEditModal();
                }
                
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.saveProfileData();
                    this.showToast('Profile saved!', 'success');
                }
            });
            
            // Add last updated timestamp
            this.updateLastUpdated();
        }

        // Initialize profile photo
        initProfilePhoto() {
            const savedPhoto = localStorage.getItem('studentProfilePhoto');
            const savedCover = localStorage.getItem('studentCoverPhoto');
            
            if (savedPhoto) {
                this.updateProfileImage(savedPhoto);
            }
            
            if (savedCover) {
                const coverImg = document.querySelector('.cover-image img');
                if (coverImg) {
                    coverImg.src = savedCover;
                }
            }
        }

        updateSemesterBasedOnDate() {
            // Logic to determine current semester based on academic calendar
            const today = new Date();
            const yearStart = 7; // July
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1;
            
            // Simple logic: Semester 1 (Jul-Dec), Semester 2 (Jan-Jun)
            const semester = currentMonth >= yearStart ? 1 : 2;
            const academicYear = currentMonth >= yearStart ? currentYear : currentYear - 1;
            
            // Update if needed - this is just example logic
            // You might want to implement your own logic based on academic calendar
        }

        updateLastUpdated() {
            const lastUpdatedEl = document.querySelector('.system-info span');
            if (lastUpdatedEl) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                const dateString = now.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                lastUpdatedEl.textContent = `Profile last updated: ${dateString}, ${timeString}`;
            }
        }
    }

    // Add CSS for toast notifications
    const toastStyles = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
    }

    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }

    .toast-info {
        border-left: 4px solid #3b82f6;
        background: #eff6ff;
    }

    .toast-success {
        border-left: 4px solid #10b981;
        background: #ecfdf5;
    }

    .toast-error {
        border-left: 4px solid #ef4444;
        background: #fef2f2;
    }

    .toast-warning {
        border-left: 4px solid #f59e0b;
        background: #fffbeb;
    }

    .toast-message {
        flex: 1;
        margin-right: 10px;
        font-size: 14px;
        color: #374151;
    }

    .toast-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #9ca3af;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .toast-close:hover {
        background: #f3f4f6;
        color: #374151;
    }

    .profile-completion {
        margin-top: 20px;
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    .completion-bar {
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        margin-bottom: 8px;
        overflow: hidden;
    }

    .completion-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        border-radius: 3px;
        transition: width 0.3s ease;
    }

    .completion-text {
        font-size: 12px;
        color: #64748b;
        font-weight: 600;
        display: block;
        text-align: center;
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .modal.show {
        opacity: 1;
    }

    .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    }

    .modal.show .modal-content {
        transform: translateY(0);
    }

    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h3 {
        margin: 0;
        color: #1f2937;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
    }

    .modal-close:hover {
        background: #f3f4f6;
        color: #374151;
    }

    .modal-body {
        padding: 20px;
    }

    .modal-footer {
        padding: 20px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    `;

    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = toastStyles;
    document.head.appendChild(styleSheet);

    // Initialize the application
    const studentProfile = new StudentProfile();
});