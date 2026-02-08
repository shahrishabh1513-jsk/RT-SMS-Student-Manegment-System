// Common JavaScript Functions for EduTrack Pro

class CommonSystem {
    constructor() {
        this.currentUser = null;
        this.notifications = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.setupCommonEventListeners();
        this.initTheme();
        this.loadNotifications();
        this.setupAutoLogout();
    }

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const role = sessionStorage.getItem('role');
        
        if (!isLoggedIn || !role) {
            this.redirectToLogin();
            return;
        }
        
        // Check if current page matches user role
        const currentPath = window.location.pathname;
        const rolePath = `/${role}/`;
        
        if (!currentPath.includes(rolePath) && !currentPath.includes('index.html')) {
            this.redirectToDashboard(role);
        }
    }

    loadUserData() {
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserUI();
        }
    }

    updateUserUI() {
        if (!this.currentUser) return;
        
        // Update user name
        document.querySelectorAll('#student-name, #faculty-name, #admin-name').forEach(el => {
            if (el.id.includes(this.currentUser.role)) {
                el.textContent = this.currentUser.name;
            }
        });
        
        // Update avatar
        document.querySelectorAll('#student-avatar, #faculty-avatar, #admin-avatar').forEach(el => {
            if (el.id.includes(this.currentUser.role)) {
                el.src = this.currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.currentUser.id}`;
            }
        });
        
        // Update other user info
        this.updateAdditionalUserInfo();
    }

    updateAdditionalUserInfo() {
        // Update course/department based on role
        switch(this.currentUser.role) {
            case 'student':
                document.getElementById('student-course')?.textContent = 
                    `${this.currentUser.course || 'Unknown Course'} - Sem ${this.currentUser.semester || '?'}`;
                break;
            case 'faculty':
                document.getElementById('faculty-department')?.textContent = 
                    this.currentUser.department || 'Unknown Department';
                break;
            case 'admin':
                document.getElementById('admin-department')?.textContent = 
                    this.currentUser.department || 'System Administration';
                break;
        }
    }

    setupCommonEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => this.toggleSidebar());
        
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
        
        // Logout buttons
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
        document.getElementById('logout-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        // Notification button
        document.getElementById('notification-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotifications();
        });
        
        // User menu
        document.getElementById('user-menu-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserMenu();
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });
        
        // Search functionality
        document.getElementById('global-search')?.addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar && mainContent) {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-collapsed');
            
            // Save state to localStorage
            const isCollapsed = sidebar.classList.contains('active');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Update theme toggle icon
        this.updateThemeIcon(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcon(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add animation to theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        }
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    loadNotifications() {
        // Load notifications from localStorage or API
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            this.notifications = JSON.parse(savedNotifications);
        } else {
            // Default notifications based on role
            this.notifications = this.getDefaultNotifications();
        }
        
        this.renderNotifications();
        this.updateNotificationBadge();
    }

    getDefaultNotifications() {
        const role = this.currentUser?.role || 'student';
        
        const notifications = {
            student: [
                {
                    id: 1,
                    title: 'Welcome to EduTrack Pro',
                    message: 'Your attendance dashboard is now ready',
                    type: 'info',
                    time: '2 hours ago',
                    read: false
                },
                {
                    id: 2,
                    title: 'Attendance Updated',
                    message: 'Your attendance for Data Structures has been marked',
                    type: 'success',
                    time: '1 day ago',
                    read: false
                },
                {
                    id: 3,
                    title: 'Upcoming Exam',
                    message: 'Database Systems exam scheduled for next week',
                    type: 'warning',
                    time: '2 days ago',
                    read: true
                }
            ],
            faculty: [
                {
                    id: 1,
                    title: 'New Leave Request',
                    message: 'John Smith has applied for leave',
                    type: 'info',
                    time: '1 hour ago',
                    read: false
                },
                {
                    id: 2,
                    title: 'Attendance Session',
                    message: 'Data Structures class attendance pending',
                    type: 'warning',
                    time: '3 hours ago',
                    read: false
                },
                {
                    id: 3,
                    title: 'System Update',
                    message: 'New features added to faculty dashboard',
                    type: 'success',
                    time: '1 day ago',
                    read: true
                }
            ],
            admin: [
                {
                    id: 1,
                    title: 'System Alert',
                    message: 'Database backup completed successfully',
                    type: 'success',
                    time: '30 minutes ago',
                    read: false
                },
                {
                    id: 2,
                    title: 'New User Registered',
                    message: 'A new faculty member has registered',
                    type: 'info',
                    time: '2 hours ago',
                    read: false
                },
                {
                    id: 3,
                    title: 'Pending Approvals',
                    message: '15 pending approvals require attention',
                    type: 'warning',
                    time: '1 day ago',
                    read: true
                }
            ]
        };
        
        return notifications[role] || notifications.student;
    }

    renderNotifications() {
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;
        
        const unreadNotifications = this.notifications.filter(n => !n.read);
        const readNotifications = this.notifications.filter(n => n.read);
        
        let html = '';
        
        // Unread notifications
        if (unreadNotifications.length > 0) {
            html += '<div class="notification-section"><h5>New</h5></div>';
            unreadNotifications.forEach(notification => {
                html += this.getNotificationHTML(notification);
            });
        }
        
        // Read notifications
        if (readNotifications.length > 0) {
            html += '<div class="notification-section"><h5>Earlier</h5></div>';
            readNotifications.forEach(notification => {
                html += this.getNotificationHTML(notification);
            });
        }
        
        // No notifications
        if (this.notifications.length === 0) {
            html = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
        }
        
        notificationList.innerHTML = html;
        
        // Add click events to notification items
        notificationList.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const notificationId = parseInt(item.dataset.id);
                this.markNotificationAsRead(notificationId);
                
                // Handle notification click action
                this.handleNotificationClick(notificationId);
            });
        });
    }

    getNotificationHTML(notification) {
        const iconClass = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        }[notification.type] || 'fa-info-circle';
        
        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon">
                    <i class="fas ${iconClass} ${notification.type}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </div>
        `;
    }

    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
            this.renderNotifications();
        }
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateNotificationBadge();
        this.renderNotifications();
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notification-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
            
            // Close other dropdowns
            this.closeOtherDropdowns('notification-dropdown');
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
            
            // Close other dropdowns
            this.closeOtherDropdowns('user-dropdown');
        }
    }

    closeOtherDropdowns(exceptId) {
        const dropdowns = document.querySelectorAll('.notification-dropdown, .user-dropdown');
        dropdowns.forEach(dropdown => {
            if (dropdown.id !== exceptId) {
                dropdown.classList.remove('show');
            }
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.notification-dropdown, .user-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    handleGlobalSearch(query) {
        // Implement global search functionality
        console.log('Searching for:', query);
        
        // Show search results modal or update UI
        if (query.length >= 2) {
            this.showSearchResults(query);
        }
    }

    showSearchResults(query) {
        // This would typically make an API call
        // For demo, we'll show a simple modal
        const searchModal = document.createElement('div');
        searchModal.className = 'search-results-modal';
        searchModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Search Results for "${query}"</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="search-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Searching...</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(searchModal);
        
        // Close modal on overlay click
        searchModal.querySelector('.modal-overlay').addEventListener('click', () => {
            searchModal.remove();
        });
        
        searchModal.querySelector('.modal-close').addEventListener('click', () => {
            searchModal.remove();
        });
        
        // Simulate search results after delay
        setTimeout(() => {
            const modalBody = searchModal.querySelector('.modal-body');
            modalBody.innerHTML = this.getSearchResultsHTML(query);
        }, 1000);
    }

    getSearchResultsHTML(query) {
        // Mock search results
        const results = [
            { type: 'student', name: 'John Smith', id: 'STU001', match: 'John' },
            { type: 'subject', name: 'Data Structures', code: 'BCS-301', match: 'Data' },
            { type: 'notice', title: 'Exam Schedule Update', date: '2024-11-25', match: 'Exam' },
            { type: 'faculty', name: 'Dr. Sarah Williams', department: 'Computer Science', match: 'Sarah' }
        ];
        
        let html = '<div class="search-results">';
        
        if (results.length > 0) {
            results.forEach(result => {
                html += `
                    <div class="search-result-item">
                        <div class="result-type ${result.type}">
                            <i class="fas fa-${this.getResultIcon(result.type)}"></i>
                            <span>${result.type.charAt(0).toUpperCase() + result.type.slice(1)}</span>
                        </div>
                        <div class="result-content">
                            <h4>${result.name || result.title}</h4>
                            <p>${result.id || result.code || result.department || ''}</p>
                        </div>
                        <button class="btn btn-sm btn-outline view-result">View</button>
                    </div>
                `;
            });
        } else {
            html = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    getResultIcon(type) {
        const icons = {
            student: 'user-graduate',
            faculty: 'chalkboard-teacher',
            subject: 'book',
            notice: 'bullhorn',
            course: 'graduation-cap',
            department: 'building'
        };
        return icons[type] || 'file';
    }

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        // Handle different notification types
        switch(notification.type) {
            case 'warning':
                // Navigate to relevant page
                if (notification.message.includes('attendance')) {
                    window.location.href = 'attendance.html';
                } else if (notification.message.includes('exam')) {
                    window.location.href = 'exam-timetable.html';
                }
                break;
            case 'info':
                // Show notification details
                this.showNotificationDetail(notification);
                break;
            default:
                // Default action - just mark as read
                break;
        }
    }

    showNotificationDetail(notification) {
        const modal = document.createElement('div');
        modal.className = 'notification-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${notification.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="notification-detail">
                        <div class="detail-meta">
                            <span class="type ${notification.type}">
                                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                                ${notification.type}
                            </span>
                            <span class="time">${notification.time}</span>
                        </div>
                        <div class="detail-message">
                            ${notification.message}
                        </div>
                    </div>
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
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    handleKeyboardShortcuts(e) {
        // Don't trigger shortcuts when user is typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Alt + S: Search focus
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Alt + N: Notifications
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            this.toggleNotifications();
        }
        
        // Alt + T: Theme toggle
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            this.toggleTheme();
        }
        
        // Alt + M: User menu
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            this.toggleUserMenu();
        }
        
        // Alt + D: Dashboard
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        }
        
        // Escape: Close all dropdowns and modals
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
            
            // Close any open modals
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear session storage
            sessionStorage.clear();
            
            // Clear any temporary data
            localStorage.removeItem('currentScannedStudents');
            localStorage.removeItem('attendanceSessions');
            
            // Redirect to login page
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        window.location.href = '../index.html';
    }

    redirectToDashboard(role) {
        const dashboards = {
            student: 'student/dashboard.html',
            faculty: 'faculty/dashboard.html',
            admin: 'admin/dashboard.html'
        };
        
        window.location.href = dashboards[role] || 'student/dashboard.html';
    }

    setupAutoLogout() {
        // Auto logout after 30 minutes of inactivity
        let timeout;
        
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (confirm('Your session has expired due to inactivity. Click OK to stay logged in, or Cancel to logout.')) {
                    resetTimer();
                } else {
                    this.logout();
                }
            }, 30 * 60 * 1000); // 30 minutes
        };
        
        // Reset timer on user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });
        
        resetTimer();
    }

    showToast(message, type = 'info', duration = 3000) {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Utility methods
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTime(date) {
        return `${this.formatDate(date)} at ${this.formatTime(date)}`;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize common system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const commonSystem = new CommonSystem();
    
    // Make it globally available
    window.commonSystem = commonSystem;
    
    // Add CSS for additional components
    const style = document.createElement('style');
    style.textContent = `
        /* Toast Notifications */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-success {
            border-left: 4px solid var(--success);
        }
        
        .toast-error {
            border-left: 4px solid var(--danger);
        }
        
        .toast-warning {
            border-left: 4px solid var(--warning);
        }
        
        .toast-info {
            border-left: 4px solid var(--info);
        }
        
        .toast i {
            font-size: 1.25rem;
        }
        
        .toast-success i {
            color: var(--success);
        }
        
        .toast-error i {
            color: var(--danger);
        }
        
        .toast-warning i {
            color: var(--warning);
        }
        
        .toast-info i {
            color: var(--info);
        }
        
        .toast-close {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--dark-200);
            cursor: pointer;
            font-size: 1.25rem;
            padding: 0.25rem;
            border-radius: var(--radius-sm);
            transition: all 0.2s ease;
        }
        
        .toast-close:hover {
            color: var(--danger);
            background: rgba(239, 68, 68, 0.1);
        }
        
        /* Search Results Modal */
        .search-results-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-md);
        }
        
        .search-results-modal .modal-content {
            width: 100%;
            max-width: 600px;
        }
        
        .search-loading {
            text-align: center;
            padding: 3rem;
            color: var(--dark-300);
        }
        
        .search-loading i {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .search-results {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .search-result-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--light-100);
            border-radius: var(--radius-md);
            border: 1px solid var(--light-300);
            transition: all 0.2s ease;
        }
        
        .search-result-item:hover {
            border-color: var(--primary);
            background: rgba(67, 97, 238, 0.05);
        }
        
        .result-type {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.75rem;
            color: var(--dark-300);
            min-width: 60px;
        }
        
        .result-type i {
            font-size: 1.25rem;
        }
        
        .result-type.student i {
            color: var(--primary);
        }
        
        .result-type.faculty i {
            color: var(--secondary);
        }
        
        .result-type.subject i {
            color: var(--success);
        }
        
        .result-type.notice i {
            color: var(--warning);
        }
        
        .result-content {
            flex: 1;
        }
        
        .result-content h4 {
            font-size: 1rem;
            margin-bottom: 0.25rem;
            color: var(--dark-500);
        }
        
        .result-content p {
            font-size: 0.875rem;
            color: var(--dark-300);
            margin: 0;
        }
        
        .no-results {
            text-align: center;
            padding: 3rem;
            color: var(--dark-300);
        }
        
        .no-results i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        /* Notification Detail Modal */
        .notification-detail-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-md);
        }
        
        .notification-detail-modal .modal-content {
            width: 100%;
            max-width: 500px;
        }
        
        .notification-detail {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .detail-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--light-300);
        }
        
        .type {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-full);
        }
        
        .type.success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
        }
        
        .type.error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger);
        }
        
        .type.warning {
            background: rgba(245, 158, 11, 0.1);
            color: var(--warning);
        }
        
        .type.info {
            background: rgba(59, 130, 246, 0.1);
            color: var(--info);
        }
        
        .time {
            font-size: 0.875rem;
            color: var(--dark-300);
        }
        
        .detail-message {
            line-height: 1.6;
            color: var(--dark-400);
        }
        
        /* No Notifications */
        .no-notifications {
            text-align: center;
            padding: 3rem;
            color: var(--dark-300);
        }
        
        .no-notifications i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .notification-section h5 {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--dark-300);
            margin: 1rem 0 0.5rem 0;
            padding: 0 1rem;
        }
        
        /* Responsive Sidebar */
        .sidebar-collapsed .main-content {
            margin-left: 0;
        }
        
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .sidebar.active {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0 !important;
            }
        }
    `;
    document.head.appendChild(style);
});