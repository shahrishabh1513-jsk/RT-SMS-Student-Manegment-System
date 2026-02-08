// Login Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const roleCards = document.querySelectorAll('.role-card');
    const loginForm = document.getElementById('login-form');
    const selectedRoleInput = document.getElementById('selected-role');
    const roleWelcome = document.getElementById('role-welcome');
    const selectedRoleDisplay = document.getElementById('selected-role-display');
    const roleBadge = document.getElementById('role-badge');
    const changeRoleBtn = document.getElementById('change-role-btn');
    const loginAlert = document.getElementById('login-alert');
    const infoAlert = document.getElementById('info-alert');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const rememberMe = document.getElementById('remember-me');

    // Demo credentials for each role
    const demoCredentials = {
        student: {
            username: 'student001',
            password: 'student123'
        },
        faculty: {
            username: 'faculty001',
            password: 'faculty123'
        },
        admin: {
            username: 'admin',
            password: 'admin123'
        }
    };

    // Current selected role
    let selectedRole = null;

    // Initialize the page
    function init() {
        loadSavedCredentials();
        setupEventListeners();
        updateStats();
    }

    // Load saved credentials if "Remember me" was checked
    function loadSavedCredentials() {
        const savedUsername = localStorage.getItem('savedUsername');
        const savedRole = localStorage.getItem('savedRole');
        
        if (savedUsername && savedRole) {
            usernameInput.value = savedUsername;
            rememberMe.checked = true;
            
            // Auto-select the saved role
            const roleCard = document.querySelector(`.role-card[data-role="${savedRole}"]`);
            if (roleCard) {
                selectRole(savedRole);
            }
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Role selection
        roleCards.forEach(card => {
            card.addEventListener('click', () => {
                const role = card.dataset.role;
                selectRole(role);
            });
        });

        // Change role button
        changeRoleBtn.addEventListener('click', () => {
            resetRoleSelection();
        });

        // Password toggle
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }

        // Form submission
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Auto-fill demo credentials on click
        document.querySelectorAll('.demo-role').forEach(demo => {
            demo.addEventListener('click', function() {
                const role = this.querySelector('h5 i').className.includes('user-graduate') ? 'student' :
                           this.querySelector('h5 i').className.includes('chalkboard-teacher') ? 'faculty' : 'admin';
                
                if (!selectedRole) {
                    selectRole(role);
                }
                
                // Fill credentials
                usernameInput.value = demoCredentials[role].username;
                passwordInput.value = demoCredentials[role].password;
                
                // Show success message
                showInfo(`Demo credentials for ${role} have been filled. Click Login to continue.`, 'success');
            });
        });

        // Input focus effects
        document.querySelectorAll('.input-with-icon input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });

        // Auto-login for demo purposes (on double click login button)
        if (loginBtn) {
            loginBtn.addEventListener('dblclick', function(e) {
                e.preventDefault();
                handleDemoLogin();
            });
        }
    }

    // Select a role
    function selectRole(role) {
        // Reset all cards
        roleCards.forEach(card => {
            card.classList.remove('selected');
        });

        // Select the clicked card
        const selectedCard = document.querySelector(`.role-card[data-role="${role}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            selectedRole = role;
            
            // Update UI
            selectedRoleInput.value = role;
            roleWelcome.textContent = `Welcome ${role.charAt(0).toUpperCase() + role.slice(1)}! Please sign in to continue`;
            roleBadge.textContent = role;
            roleBadge.className = `role-badge ${role}-badge`;
            
            // Show form and role display
            loginForm.style.display = 'block';
            selectedRoleDisplay.style.display = 'flex';
            infoAlert.style.display = 'none';
            
            // Update form button color based on role
            updateLoginButtonStyle(role);
            
            // Auto-fill demo credentials
            if (demoCredentials[role]) {
                usernameInput.value = demoCredentials[role].username;
                passwordInput.value = demoCredentials[role].password;
            }
            
            // Add animation
            animateRoleSelection(selectedCard);
            
            // Show success message
            showInfo(`Role selected: ${role}. You can now login.`, 'success');
        }
    }

    // Reset role selection
    function resetRoleSelection() {
        selectedRole = null;
        loginForm.style.display = 'none';
        selectedRoleDisplay.style.display = 'none';
        roleWelcome.textContent = 'Please select your role to continue';
        infoAlert.style.display = 'flex';
        
        // Reset all cards
        roleCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        // Clear form
        loginForm.reset();
        
        // Reset button style
        loginBtn.style.background = '';
        
        showInfo('Please select a role to continue', 'info');
    }

    // Update login button style based on role
    function updateLoginButtonStyle(role) {
        const colors = {
            student: 'linear-gradient(135deg, #4361ee, #3a56d4)',
            faculty: 'linear-gradient(135deg, #7209b7, #5a08a5)',
            admin: 'linear-gradient(135deg, #f72585, #e02177)'
        };
        
        loginBtn.style.background = colors[role] || colors.student;
    }

    // Animate role selection
    function animateRoleSelection(card) {
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.boxShadow = '';
        }, 300);
    }

    // Handle login submission
    async function handleLogin(e) {
        e.preventDefault();
        
        if (!selectedRole) {
            showError('Please select a role first');
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // Show loading state
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        loginBtn.disabled = true;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Validate credentials
        const isValid = validateCredentials(username, password, selectedRole);
        
        if (isValid) {
            // Save credentials if "Remember me" is checked
            if (rememberMe.checked) {
                localStorage.setItem('savedUsername', username);
                localStorage.setItem('savedRole', selectedRole);
            } else {
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('savedRole');
            }
            
            // Save session data
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('role', selectedRole);
            sessionStorage.setItem('username', username);
            
            // Get user data based on role
            const userData = getUserData(username, selectedRole);
            sessionStorage.setItem('userData', JSON.stringify(userData));
            
            // Show success
            loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            loginBtn.style.background = 'var(--success)';
            
            // Show success message
            showInfo(`Welcome ${userData.name || username}! Redirecting to dashboard...`, 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                redirectToDashboard(selectedRole);
            }, 1000);
        } else {
            // Show error
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            showError('Invalid credentials. Please check your username and password.');
            
            // Add shake animation
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
        }
    }

    // Handle demo login (quick access)
    function handleDemoLogin() {
        if (!selectedRole) {
            selectRole('student');
        }
        
        const demo = demoCredentials[selectedRole];
        if (demo) {
            usernameInput.value = demo.username;
            passwordInput.value = demo.password;
            
            // Trigger form submission
            loginForm.dispatchEvent(new Event('submit'));
        }
    }

    // Validate credentials
    function validateCredentials(username, password, role) {
        // Demo validation logic
        const demo = demoCredentials[role];
        if (demo && username === demo.username && password === demo.password) {
            return true;
        }
        
        // Additional validation logic can be added here
        // For now, accept any non-empty credentials for demo
        return username.length > 0 && password.length > 0;
    }

    // Get user data based on role and username
    function getUserData(username, role) {
        const users = {
            student: {
                student001: {
                    id: 'STU001',
                    name: 'John Smith',
                    email: 'john.smith@university.edu',
                    course: 'BSc Computer Science',
                    semester: '5',
                    batch: '2023-2026',
                    rollNumber: 'CS23S001',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student001'
                },
                student002: {
                    id: 'STU002',
                    name: 'Emma Johnson',
                    email: 'emma.j@university.edu',
                    course: 'BSc Information Technology',
                    semester: '3',
                    batch: '2024-2027',
                    rollNumber: 'IT24S001',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student002'
                }
            },
            faculty: {
                faculty001: {
                    id: 'FAC001',
                    name: 'Dr. Sarah Williams',
                    email: 'sarah.w@university.edu',
                    department: 'Computer Science',
                    designation: 'Associate Professor',
                    subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=faculty001'
                },
                faculty002: {
                    id: 'FAC002',
                    name: 'Prof. Michael Chen',
                    email: 'michael.c@university.edu',
                    department: 'Information Technology',
                    designation: 'Professor',
                    subjects: ['Web Development', 'Mobile Apps', 'Cloud Computing'],
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=faculty002'
                }
            },
            admin: {
                admin: {
                    id: 'ADM001',
                    name: 'System Administrator',
                    email: 'admin@university.edu',
                    department: 'Administration',
                    designation: 'System Administrator',
                    permissions: ['all'],
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin001'
                }
            }
        };
        
        return users[role]?.[username] || {
            id: username.toUpperCase(),
            name: username.charAt(0).toUpperCase() + username.slice(1),
            email: `${username}@university.edu`,
            role: role
        };
    }

    // Redirect to appropriate dashboard
    function redirectToDashboard(role) {
        const dashboards = {
            student: 'student/dashboard.html',
            faculty: 'faculty/dashboard.html',
            admin: 'admin/dashboard.html'
        };
        
        window.location.href = dashboards[role] || 'student/dashboard.html';
    }

    // Update live stats
    function updateStats() {
        // Simulate live updates
        setInterval(() => {
            const studentCount = document.getElementById('student-count');
            const facultyCount = document.getElementById('faculty-count');
            const coursesCount = document.getElementById('courses-count');
            
            if (studentCount) {
                const current = parseInt(studentCount.textContent) || 2500;
                studentCount.textContent = `${current + Math.floor(Math.random() * 10)}`;
            }
        }, 5000);
    }

    // Show error message
    function showError(message) {
        if (loginAlert) {
            loginAlert.querySelector('#alert-message').textContent = message;
            loginAlert.style.display = 'flex';
            
            setTimeout(() => {
                loginAlert.style.display = 'none';
            }, 5000);
        }
    }

    // Show info message
    function showInfo(message, type = 'info') {
        if (infoAlert) {
            infoAlert.querySelector('#info-message').textContent = message;
            infoAlert.className = `alert alert-${type}`;
            infoAlert.style.display = 'flex';
            
            setTimeout(() => {
                infoAlert.style.display = 'none';
            }, 5000);
        }
    }

    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        .student-badge {
            background: linear-gradient(135deg, #4361ee, #3a56d4);
        }
        
        .faculty-badge {
            background: linear-gradient(135deg, #7209b7, #5a08a5);
        }
        
        .admin-badge {
            background: linear-gradient(135deg, #f72585, #e02177);
        }
        
        .input-with-icon.focused i {
            color: var(--primary);
        }
        
        .input-with-icon.focused input {
            border-color: var(--primary);
        }
    `;
    document.head.appendChild(style);

    // Initialize the page
    init();
});