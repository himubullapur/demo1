// Global State Management
const AppState = {
    currentUser: null,
    jobs: [],
    filteredJobs: [],
    currentJobId: null,
    editingJobId: null,
    shortlistedData: [],
    filteredShortlistedData: [],
    currentCompanyData: [],
    currentCompanyFullData: null,
    showShortlistedBanner: false,
    notifications: [],
    jobShortlisted: {} // Store shortlisted data per job
};

// Sample Data
const sampleJobs = [
    {
        id: 1,
        company: "TechCorp Solutions",
        title: "Software Developer",
        status: "Open",
        deadline: "2024-02-15",
        description: "We are looking for a passionate Software Developer to join our dynamic team. You will be responsible for designing, developing, and maintaining web applications using modern technologies.",
        salary: "4-6 LPA",
        location: "Bangalore, India",
        eligibility: "B.Tech/B.E in Computer Science or related field. Strong knowledge of JavaScript, React, Node.js. Minimum 70% throughout academics.",
        formLink: "https://forms.google.com/example1",
        applicants: []
    },
    {
        id: 2,
        company: "DataFlow Analytics",
        title: "Data Analyst",
        status: "Interviewing",
        deadline: "2024-02-10",
        description: "Join our data team to help transform raw data into actionable insights. You'll work with large datasets and create meaningful visualizations for business stakeholders.",
        salary: "3.5-5 LPA",
        location: "Hyderabad, India",
        eligibility: "B.Tech/B.E/MCA in any discipline. Knowledge of SQL, Python, Excel. Strong analytical skills required.",
        formLink: "https://forms.google.com/example2",
        applicants: []
    },
    {
        id: 3,
        company: "CloudVision Systems",
        title: "DevOps Engineer",
        status: "Open",
        deadline: "2024-02-20",
        description: "We're seeking a DevOps Engineer to streamline our development and deployment processes. Experience with AWS, Docker, and CI/CD pipelines preferred.",
        salary: "5-7 LPA",
        location: "Pune, India",
        eligibility: "B.Tech in Computer Science/IT. Experience with cloud platforms, containerization, and automation tools.",
        formLink: "https://forms.google.com/example3",
        applicants: []
    },
    {
        id: 4,
        company: "FinTech Innovations",
        title: "Frontend Developer",
        status: "Closed",
        deadline: "2024-01-30",
        description: "Create beautiful and responsive user interfaces for our financial applications. Work with React, Vue.js, and modern CSS frameworks.",
        salary: "4-5.5 LPA",
        location: "Mumbai, India",
        eligibility: "B.Tech/B.E in Computer Science. Proficiency in HTML, CSS, JavaScript, React/Vue.js. Portfolio required.",
        formLink: "https://forms.google.com/example4",
        applicants: []
    },
    {
        id: 5,
        company: "AI Research Labs",
        title: "Machine Learning Engineer",
        status: "Open",
        deadline: "2024-02-25",
        description: "Join our AI team to develop cutting-edge machine learning solutions. Work on exciting projects involving computer vision, NLP, and predictive analytics.",
        salary: "6-9 LPA",
        location: "Chennai, India",
        eligibility: "M.Tech/B.Tech in Computer Science/AI/ML. Strong knowledge of Python, TensorFlow, PyTorch. Research experience preferred.",
        formLink: "https://forms.google.com/example5",
        applicants: []
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load sample data
    AppState.jobs = [...sampleJobs];
    AppState.filteredJobs = [...sampleJobs];
    
    // Show student dashboard by default
    showStudentDashboard();
    
    // Load jobs
    loadJobs();
    
    // Initialize animations
    animateElements();
}

// Navigation Functions
function showStudentDashboard() {
    hideAllPages();
    document.getElementById('student-dashboard').classList.add('active');
    setActiveNav('student-nav');
    loadJobs();
    checkShortlistedBanner();
    loadNotifications();
}

function showAdminLogin() {
    if (AppState.currentUser) {
        showAdminDashboard();
    } else {
        hideAllPages();
        document.getElementById('admin-login').classList.add('active');
        setActiveNav('admin-nav');
    }
}

function showAdminDashboard() {
    hideAllPages();
    document.getElementById('admin-dashboard').classList.add('active');
    setActiveNav('admin-nav');
    loadAdminDashboard();
}

function showShortlistedView() {
    hideAllPages();
    document.getElementById('shortlisted-view').classList.add('active');
    setActiveNav('shortlisted-nav');
    
    // Update global shortlisted data from job-specific data
    updateGlobalShortlistedData();
    
    // Check if data exists
    if (AppState.shortlistedData.length === 0) {
        document.getElementById('no-shortlisted-data').style.display = 'block';
        document.getElementById('shortlisted-data-section').style.display = 'none';
    } else {
        document.getElementById('no-shortlisted-data').style.display = 'none';
        document.getElementById('shortlisted-data-section').style.display = 'block';
        showCompanyView(); // Show company view by default
    }
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));
}

function setActiveNav(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
}

// Student Dashboard Functions
function loadJobs() {
    const jobListings = document.getElementById('job-listings');
    jobListings.innerHTML = '';
    
    AppState.filteredJobs.forEach((job, index) => {
        const jobCard = createJobCard(job, index);
        jobListings.appendChild(jobCard);
    });
    
    // Animate job cards
    animateJobCards();
}

function createJobCard(job, index) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => showJobDetail(job.id);
    
    const statusClass = job.status.toLowerCase().replace(' ', '-');
    const formattedDeadline = new Date(job.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    card.innerHTML = `
        <div class="job-header">
            <div>
                <div class="company-name">${job.company}</div>
                <div class="job-title">${job.title}</div>
            </div>
            <span class="status-badge ${statusClass}">${job.status}</span>
        </div>
        <div class="job-details">
            <div class="job-detail-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Deadline: ${formattedDeadline}</span>
            </div>
            <div class="job-detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${job.location}</span>
            </div>
            <div class="job-detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>${job.salary}</span>
            </div>
        </div>
        <div class="job-actions">
            <button class="view-details-btn">
                <span>View Details</span>
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    return card;
}

function animateJobCards() {
    const cards = document.querySelectorAll('.job-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function filterJobs() {
    const searchTerm = document.getElementById('job-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    AppState.filteredJobs = AppState.jobs.filter(job => {
        const matchesSearch = job.company.toLowerCase().includes(searchTerm) || 
                             job.title.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || job.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    loadJobs();
}

// Job Detail Functions
function showJobDetail(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const modal = document.getElementById('job-detail-modal');
    const content = document.getElementById('job-detail-content');
    
    const formattedDeadline = new Date(job.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const statusClass = job.status.toLowerCase().replace(' ', '-');
    
    content.innerHTML = `
        <div class="job-detail-header">
            <div class="job-detail-title">${job.title}</div>
            <div class="job-detail-company">${job.company}</div>
            <span class="status-badge ${statusClass}">${job.status}</span>
        </div>
        
        <div class="job-detail-section">
            <h3><i class="fas fa-info-circle"></i> Job Description</h3>
            <p>${job.description}</p>
        </div>
        
        <div class="job-detail-grid">
            <div class="detail-item">
                <h4><i class="fas fa-calendar-alt"></i> Application Deadline</h4>
                <p>${formattedDeadline}</p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
                <p>${job.location}</p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-rupee-sign"></i> Salary Range</h4>
                <p>${job.salary}</p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-building"></i> Company</h4>
                <p>${job.company}</p>
            </div>
        </div>
        
        <div class="job-detail-section">
            <h3><i class="fas fa-check-circle"></i> Eligibility Criteria</h3>
            <p>${job.eligibility}</p>
        </div>
        
        ${job.status === 'Open' ? `
            <div class="apply-section">
                <a href="${job.formLink}" target="_blank" class="apply-btn">
                    <i class="fas fa-external-link-alt"></i>
                    <span>Apply Now</span>
                </a>
                <p class="apply-note">You will be redirected to the application form</p>
            </div>
        ` : `
            <div class="apply-section">
                <button class="apply-btn" disabled style="opacity: 0.6; cursor: not-allowed;">
                    <i class="fas fa-times-circle"></i>
                    <span>Applications ${job.status === 'Closed' ? 'Closed' : 'In Review'}</span>
                </button>
            </div>
        `}
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeJobDetail() {
    const modal = document.getElementById('job-detail-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Admin Authentication
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Simple authentication (in real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        AppState.currentUser = { username: 'admin', role: 'admin' };
        showNotification('Login successful!', 'success');
        showAdminDashboard();
    } else {
        showNotification('Invalid credentials. Use admin/admin123', 'error');
    }
}

function logout() {
    AppState.currentUser = null;
    showNotification('Logged out successfully', 'info');
    showStudentDashboard();
}

// Admin Dashboard Functions
function loadAdminDashboard() {
    loadAdminJobList();
    loadAdminNotifications();
}


function loadAdminJobList() {
    const adminJobList = document.getElementById('admin-job-list');
    if (!adminJobList) {
        console.log('admin-job-list element not found, skipping reload');
        return;
    }
    
    adminJobList.innerHTML = '';
    
    AppState.jobs.forEach(job => {
        const jobCard = createAdminJobCard(job);
        adminJobList.appendChild(jobCard);
    });
}

function createAdminJobCard(job) {
    const card = document.createElement('div');
    card.className = 'admin-job-card';
    
    const formattedDeadline = new Date(job.deadline).toLocaleDateString('en-IN');
    const statusClass = job.status.toLowerCase().replace(' ', '-');
    const hasShortlisted = AppState.jobShortlisted[job.id] && AppState.jobShortlisted[job.id].length > 0;
    
    card.innerHTML = `
        <div class="admin-job-header">
            <div class="admin-job-info">
                <h4>${job.title}</h4>
                <p>${job.company} • ${job.location} • Deadline: ${formattedDeadline}</p>
                ${hasShortlisted ? `
                    <div class="shortlisted-indicator">
                        <i class="fas fa-users"></i>
                        <span>${AppState.jobShortlisted[job.id].length - 1} candidates shortlisted</span>
                    </div>
                ` : ''}
            </div>
            <div class="admin-job-actions">
                <select class="status-select" onchange="updateJobStatus(${job.id}, this.value)">
                    <option value="Open" ${job.status === 'Open' ? 'selected' : ''}>Open</option>
                    <option value="Interviewing" ${job.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Closed" ${job.status === 'Closed' ? 'selected' : ''}>Closed</option>
                </select>
                <button class="admin-btn edit-btn" onclick="editJob(${job.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="admin-btn shortlist-btn" onclick="showJobShortlistUpload(${job.id})" title="Upload Shortlisted Candidates">
                    <i class="fas fa-user-check"></i>
                    ${hasShortlisted ? 'Update' : 'Shortlist'}
                </button>
                ${hasShortlisted ? `
                    <button class="admin-btn view-shortlist-btn" onclick="viewJobShortlist(${job.id})" title="View Shortlisted Candidates">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                ` : ''}
                <button class="admin-btn delete-btn" onclick="deleteJob(${job.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
        <div class="admin-job-details">
            <span class="status-badge ${statusClass}">${job.status}</span>
            <span class="job-salary">${job.salary}</span>
        </div>
    `;
    
    return card;
}

// Job Management Functions
function showAddJobModal() {
    AppState.editingJobId = null;
    document.getElementById('job-form-title').textContent = 'Add New Job';
    document.getElementById('job-form').reset();
    document.getElementById('job-form-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function editJob(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    AppState.editingJobId = jobId;
    document.getElementById('job-form-title').textContent = 'Edit Job';
    
    // Populate form with job data
    document.getElementById('job-company').value = job.company;
    document.getElementById('job-title').value = job.title;
    document.getElementById('job-deadline').value = job.deadline;
    document.getElementById('job-status').value = job.status;
    document.getElementById('job-description').value = job.description;
    document.getElementById('job-salary').value = job.salary;
    document.getElementById('job-location').value = job.location;
    document.getElementById('job-eligibility').value = job.eligibility;
    document.getElementById('job-batches').value = job.batches || '';
    document.getElementById('job-branches').value = job.branches || '';
    document.getElementById('job-selection-process').value = job.selectionProcess || '';
    document.getElementById('job-form-link').value = job.formLink;
    
    document.getElementById('job-form-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function handleJobSubmit(event) {
    event.preventDefault();
    
    const jobData = {
        company: document.getElementById('job-company').value,
        title: document.getElementById('job-title').value,
        deadline: document.getElementById('job-deadline').value,
        status: document.getElementById('job-status').value,
        description: document.getElementById('job-description').value,
        salary: document.getElementById('job-salary').value,
        location: document.getElementById('job-location').value,
        eligibility: document.getElementById('job-eligibility').value,
        batches: document.getElementById('job-batches').value,
        branches: document.getElementById('job-branches').value,
        selectionProcess: document.getElementById('job-selection-process').value,
        formLink: document.getElementById('job-form-link').value
    };
    
    if (AppState.editingJobId) {
        // Update existing job
        const jobIndex = AppState.jobs.findIndex(j => j.id === AppState.editingJobId);
        AppState.jobs[jobIndex] = { ...AppState.jobs[jobIndex], ...jobData };
        showNotification('Job updated successfully!', 'success');
    } else {
        // Add new job
        const newJob = {
            id: Math.max(...AppState.jobs.map(j => j.id)) + 1,
            ...jobData,
            applicants: []
        };
        AppState.jobs.push(newJob);
        
        // Add notification for new job
        addNotification({
            type: 'success',
            title: `New Job Opening: ${jobData.title}`,
            message: `${jobData.company} is hiring for ${jobData.title} position. Application deadline: ${new Date(jobData.deadline).toLocaleDateString()}`,
            action: {
                text: 'View Details',
                callback: () => showJobDetail(newJob.id)
            }
        });
        
        showNotification('Job added successfully!', 'success');
    }
    
    // Update filtered jobs and reload
    AppState.filteredJobs = [...AppState.jobs];
    closeJobForm();
    loadAdminJobList();
    loadJobs();
}

function updateJobStatus(jobId, newStatus) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (job) {
        job.status = newStatus;
        AppState.filteredJobs = [...AppState.jobs];
        
        // Animate status change
        const statusBadge = event.target.closest('.admin-job-card').querySelector('.status-badge');
        statusBadge.style.opacity = '0';
        
        setTimeout(() => {
            statusBadge.textContent = newStatus;
            statusBadge.className = `status-badge ${newStatus.toLowerCase().replace(' ', '-')}`;
            statusBadge.style.opacity = '1';
        }, 150);
        
        loadJobs();
        showNotification(`Job status updated to ${newStatus}`, 'success');
    }
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        AppState.jobs = AppState.jobs.filter(j => j.id !== jobId);
        AppState.filteredJobs = [...AppState.jobs];
        loadAdminJobList();
        loadJobs();
        showNotification('Job deleted successfully!', 'success');
    }
}

function closeJobForm() {
    document.getElementById('job-form-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.editingJobId = null;
    
    // Reset form and clear all fields
    document.getElementById('job-form').reset();
    document.getElementById('job-form-title').textContent = 'Add New Job';
}

// File Upload Functions
function showFileUpload(jobId) {
    AppState.currentJobId = jobId;
    document.getElementById('file-upload-modal').classList.add('active');
    document.getElementById('data-viewer').style.display = 'none';
    document.getElementById('upload-progress').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeFileUpload() {
    document.getElementById('file-upload-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentJobId = null;
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('drop-zone').classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('drop-zone').classList.remove('drag-over');
}

function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('drop-zone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('upload-progress').style.display = 'block';
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayData(data);
            showNotification('File processed successfully!', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const result = [];
    
    for (let line of lines) {
        if (line.trim()) {
            result.push(line.split(',').map(cell => cell.trim()));
        }
    }
    
    return result;
}

function displayData(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    const dataViewer = document.getElementById('data-viewer');
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 50);
    }
    
    // Store applicant data
    const job = AppState.jobs.find(j => j.id === AppState.currentJobId);
    if (job) {
        job.applicants = data;
    }
    
    // Show data viewer
    document.getElementById('upload-progress').style.display = 'none';
    dataViewer.style.display = 'block';
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function animateElements() {
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Observe animated elements
    document.querySelectorAll('.animate-slide-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// Modal close on outside click
document.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if (event.target === modal) {
            if (modal.id === 'job-detail-modal') {
                closeJobDetail();
            } else if (modal.id === 'job-form-modal') {
                closeJobForm();
            } else if (modal.id === 'file-upload-modal') {
                closeFileUpload();
            }
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            if (activeModal.id === 'job-detail-modal') {
                closeJobDetail();
            } else if (activeModal.id === 'job-form-modal') {
                closeJobForm();
            } else if (activeModal.id === 'file-upload-modal') {
                closeFileUpload();
            }
        }
    }
});

// Shortlisted Candidates Functions
function handleShortlistedFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('shortlisted-drop-zone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processShortlistedFile(files[0]);
    }
}

function handleShortlistedFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processShortlistedFile(files[0]);
    }
}

function processShortlistedFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('shortlisted-upload-progress').style.display = 'block';
    const progressFill = document.getElementById('shortlisted-progress-fill');
    const progressText = document.getElementById('shortlisted-progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readShortlistedFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readShortlistedFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayShortlistedData(data);
            showNotification('Shortlisted candidates file processed successfully!', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function displayShortlistedData(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    // Store the data
    AppState.shortlistedData = data;
    AppState.filteredShortlistedData = data;
    
    // Show notification banner for students
    AppState.showShortlistedBanner = true;
    
    // Add notification for students
    addNotification({
        type: 'success',
        title: 'New Shortlisted Candidates Available!',
        message: `${data.length - 1} candidates have been shortlisted. Check if you're selected!`,
        action: {
            text: 'View Shortlisted',
            callback: () => showShortlistedView()
        }
    });
    
    // Load company view by default
    loadCompanyView();
    
    // Also populate table view
    populateTableView(data);
    
    // Hide upload progress and show data section
    document.getElementById('shortlisted-upload-progress').style.display = 'none';
    document.getElementById('shortlisted-data-section').style.display = 'block';
    document.getElementById('no-shortlisted-data').style.display = 'none';
}

function populateTableView(data) {
    const tableHeader = document.getElementById('shortlisted-table-header');
    const tableBody = document.getElementById('shortlisted-table-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 50);
    }
}

function filterShortlistedCandidates() {
    const searchTerm = document.getElementById('shortlisted-search').value.toLowerCase();
    
    if (!AppState.shortlistedData || AppState.shortlistedData.length === 0) return;
    
    if (!searchTerm) {
        AppState.filteredShortlistedData = AppState.shortlistedData;
    } else {
        AppState.filteredShortlistedData = [
            AppState.shortlistedData[0], // Keep header
            ...AppState.shortlistedData.slice(1).filter(row => {
                return row.some(cell => 
                    cell && cell.toString().toLowerCase().includes(searchTerm)
                );
            })
        ];
    }
    
    updateShortlistedTable();
}

function updateShortlistedTable() {
    const tableBody = document.getElementById('shortlisted-table-body');
    tableBody.innerHTML = '';
    
    // Create body rows with filtered data
    for (let i = 1; i < AppState.filteredShortlistedData.length; i++) {
        const row = document.createElement('tr');
        
        AppState.filteredShortlistedData[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 30);
    }
}

function exportShortlistedData() {
    if (!AppState.shortlistedData || AppState.shortlistedData.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    // Create CSV content
    const csvContent = AppState.filteredShortlistedData.map(row => {
        return row.map(cell => {
            // Escape quotes and wrap in quotes if contains comma
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
        }).join(',');
    }).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'shortlisted_candidates.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data exported successfully!', 'success');
}

function clearShortlistedData() {
    if (confirm('Are you sure you want to clear all shortlisted data?')) {
        AppState.shortlistedData = [];
        AppState.filteredShortlistedData = [];
        
        document.getElementById('shortlisted-data-section').style.display = 'none';
        document.getElementById('shortlisted-upload-progress').style.display = 'none';
        document.getElementById('shortlisted-file-input').value = '';
        document.getElementById('shortlisted-search').value = '';
        
        // Update admin stats if on admin page
        if (AppState.currentUser) {
            updateShortlistedStats();
        }
        
        showNotification('Shortlisted data cleared successfully!', 'success');
    }
}

// Admin Shortlisted Functions
function updateShortlistedStats() {
    const totalShortlisted = AppState.shortlistedData.length > 0 ? AppState.shortlistedData.length - 1 : 0;
    const companies = new Set();
    
    if (AppState.shortlistedData.length > 1) {
        // Find company column index (assuming it exists)
        const headers = AppState.shortlistedData[0];
        const companyIndex = headers.findIndex(header => 
            header.toLowerCase().includes('company') || 
            header.toLowerCase().includes('organization')
        );
        
        if (companyIndex !== -1) {
            for (let i = 1; i < AppState.shortlistedData.length; i++) {
                if (AppState.shortlistedData[i][companyIndex]) {
                    companies.add(AppState.shortlistedData[i][companyIndex]);
                }
            }
        }
    }
    
    animateCounter('total-shortlisted', totalShortlisted);
    animateCounter('shortlisted-companies', companies.size);
    
    // Show recent shortlisted preview
    showRecentShortlistedPreview();
}

function showRecentShortlistedPreview() {
    const previewSection = document.getElementById('recent-shortlisted-preview');
    const recentList = document.getElementById('recent-shortlisted-list');
    
    if (AppState.shortlistedData.length <= 1) {
        previewSection.style.display = 'none';
        return;
    }
    
    recentList.innerHTML = '';
    
    // Show last 5 entries
    const headers = AppState.shortlistedData[0];
    const nameIndex = headers.findIndex(header => 
        header.toLowerCase().includes('name') || 
        header.toLowerCase().includes('student')
    );
    const companyIndex = headers.findIndex(header => 
        header.toLowerCase().includes('company') || 
        header.toLowerCase().includes('organization')
    );
    const positionIndex = headers.findIndex(header => 
        header.toLowerCase().includes('position') || 
        header.toLowerCase().includes('role') ||
        header.toLowerCase().includes('job')
    );
    
    const recentEntries = AppState.shortlistedData.slice(-6, -1).reverse(); // Last 5 entries
    
    recentEntries.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        const name = nameIndex !== -1 ? entry[nameIndex] : 'N/A';
        const company = companyIndex !== -1 ? entry[companyIndex] : 'Unknown Company';
        const position = positionIndex !== -1 ? entry[positionIndex] : 'Position not specified';
        
        item.innerHTML = `
            <div class="recent-item-info">
                <h5>${name}</h5>
                <p>${position}</p>
            </div>
            <div class="recent-item-company">${company}</div>
        `;
        
        recentList.appendChild(item);
        
        // Animate appearance
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    previewSection.style.display = 'block';
}

function showShortlistedUploadModal() {
    document.getElementById('admin-shortlisted-modal').classList.add('active');
    document.getElementById('admin-data-viewer').style.display = 'none';
    document.getElementById('admin-upload-progress').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeAdminShortlistedModal() {
    document.getElementById('admin-shortlisted-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear form
    document.getElementById('admin-file-input').value = '';
    document.getElementById('admin-data-viewer').style.display = 'none';
    document.getElementById('admin-upload-progress').style.display = 'none';
}

function handleAdminShortlistedDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('admin-drop-zone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processAdminShortlistedFile(files[0]);
    }
}

function handleAdminShortlistedSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processAdminShortlistedFile(files[0]);
    }
}

function processAdminShortlistedFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('admin-upload-progress').style.display = 'block';
    const progressFill = document.getElementById('admin-progress-fill');
    const progressText = document.getElementById('admin-progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readAdminShortlistedFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readAdminShortlistedFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayAdminShortlistedPreview(data);
            showNotification('File processed successfully! Review and save.', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function displayAdminShortlistedPreview(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    // Store temporarily for saving
    window.tempShortlistedData = data;
    
    const dataViewer = document.getElementById('admin-data-viewer');
    const tableHeader = document.getElementById('admin-table-header');
    const tableBody = document.getElementById('admin-table-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows (show first 10 for preview)
    const previewRows = Math.min(data.length - 1, 10);
    for (let i = 1; i <= previewRows; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
    }
    
    if (data.length > 11) {
        const moreRow = document.createElement('tr');
        const moreCell = document.createElement('td');
        moreCell.colSpan = data[0].length;
        moreCell.textContent = `... and ${data.length - 11} more entries`;
        moreCell.style.textAlign = 'center';
        moreCell.style.fontStyle = 'italic';
        moreCell.style.color = '#4a5568';
        moreRow.appendChild(moreCell);
        tableBody.appendChild(moreRow);
    }
    
    // Hide upload progress and show data viewer
    document.getElementById('admin-upload-progress').style.display = 'none';
    dataViewer.style.display = 'block';
}

function saveShortlistedData() {
    if (!window.tempShortlistedData) {
        showNotification('No data to save', 'error');
        return;
    }
    
    // Save to main state
    AppState.shortlistedData = [...window.tempShortlistedData];
    AppState.filteredShortlistedData = [...window.tempShortlistedData];
    
    // Update public shortlisted view if it exists
    if (document.getElementById('shortlisted-data-section')) {
        displayShortlistedData(AppState.shortlistedData);
    }
    
    // Update admin stats
    updateShortlistedStats();
    
    // Clear temp data
    window.tempShortlistedData = null;
    
    showNotification('Shortlisted data saved successfully!', 'success');
    closeAdminShortlistedModal();
}

function viewAllShortlisted() {
    if (AppState.shortlistedData.length === 0) {
        showNotification('No shortlisted data available. Please upload some data first.', 'info');
        return;
    }
    
    // Switch to shortlisted view
    showShortlistedView();
}

// Enhanced Student Experience Functions
function checkShortlistedBanner() {
    const banner = document.getElementById('shortlisted-notification');
    if (AppState.showShortlistedBanner && AppState.shortlistedData.length > 0) {
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

function viewShortlistedFromBanner() {
    showShortlistedView();
    dismissBanner();
}

function dismissBanner() {
    AppState.showShortlistedBanner = false;
    document.getElementById('shortlisted-notification').style.display = 'none';
}

function showCompanyView() {
    document.getElementById('company-view').style.display = 'block';
    document.getElementById('table-view').style.display = 'none';
    
    // Update buttons
    document.getElementById('company-view-btn').classList.add('active');
    document.getElementById('table-view-btn').classList.remove('active');
    
    loadCompanyView();
}

function showTableView() {
    document.getElementById('company-view').style.display = 'none';
    document.getElementById('table-view').style.display = 'block';
    
    // Update buttons
    document.getElementById('company-view-btn').classList.remove('active');
    document.getElementById('table-view-btn').classList.add('active');
}

function loadCompanyView() {
    const companiesGrid = document.getElementById('companies-grid');
    if (!companiesGrid) {
        console.log('companies-grid element not found, skipping company view update');
        return;
    }
    
    // First check if we have job-specific shortlists
    const hasJobShortlists = Object.keys(AppState.jobShortlisted).some(jobId => 
        AppState.jobShortlisted[jobId] && AppState.jobShortlisted[jobId].length > 0
    );
    
    if (!hasJobShortlists && (!AppState.shortlistedData || AppState.shortlistedData.length <= 1)) {
        companiesGrid.innerHTML = `
            <div class="no-companies-message">
                <div class="no-data-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Companies with Shortlisted Candidates</h3>
                <p>Companies will appear here once the admin uploads shortlisted data.</p>
            </div>
        `;
        return;
    }
    
    companiesGrid.innerHTML = '';
    
    // Create company map from job-specific data if available
    const companiesMap = new Map();
    
    if (hasJobShortlists) {
        // Use job-specific data to create company cards
        Object.keys(AppState.jobShortlisted).forEach(jobId => {
            const shortlistData = AppState.jobShortlisted[jobId];
            const job = AppState.jobs.find(j => j.id == jobId);
            
            if (shortlistData && shortlistData.length > 0 && job) {
                const companyName = job.company;
                const candidateCount = shortlistData.length - 1; // Minus header
                
                if (!companiesMap.has(companyName)) {
                    companiesMap.set(companyName, 0);
                }
                companiesMap.set(companyName, companiesMap.get(companyName) + candidateCount);
            }
        });
    } else if (AppState.shortlistedData.length > 1) {
        // Fallback to global shortlisted data
        const headers = AppState.shortlistedData[0];
        const companyIndex = headers.findIndex(header => 
            header.toLowerCase().includes('company') || 
            header.toLowerCase().includes('organization')
        );
        
        if (companyIndex !== -1) {
            for (let i = 1; i < AppState.shortlistedData.length; i++) {
                const row = AppState.shortlistedData[i];
                const company = row[companyIndex] || 'Unknown Company';
                
                if (!companiesMap.has(company)) {
                    companiesMap.set(company, 0);
                }
                companiesMap.set(company, companiesMap.get(company) + 1);
            }
        }
    }
    
    // Create company cards
    if (companiesMap.size > 0) {
        let cardIndex = 0;
        companiesMap.forEach((candidateCount, companyName) => {
            const card = createCompanyCard(companyName, candidateCount);
            companiesGrid.appendChild(card);
            
            // Animate card appearance
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, cardIndex * 100);
            cardIndex++;
        });
    } else {
        companiesGrid.innerHTML = `
            <div class="no-companies-message">
                <div class="no-data-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Companies Found</h3>
                <p>Unable to identify companies from the shortlisted data.</p>
            </div>
        `;
    }
}

function createCompanyCard(companyName, candidateCount) {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.onclick = () => openCompanyModal(companyName);
    
    // Determine company type for icon
    const companyLower = companyName.toLowerCase();
    let icon = 'fas fa-building';
    if (companyLower.includes('tech') || companyLower.includes('software')) {
        icon = 'fas fa-laptop-code';
    } else if (companyLower.includes('bank') || companyLower.includes('finance')) {
        icon = 'fas fa-university';
    } else if (companyLower.includes('consult')) {
        icon = 'fas fa-handshake';
    }
    
    card.innerHTML = `
        <div class="company-card-header">
            <div class="company-card-icon">
                <i class="${icon}"></i>
            </div>
            <div class="company-card-info">
                <h4>${companyName}</h4>
                <p>Click to view selected candidates</p>
            </div>
        </div>
        <div class="company-card-stats">
            <div class="candidate-count">
                <i class="fas fa-users"></i>
                <span>${candidateCount} candidate${candidateCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="view-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    `;
    
    return card;
}

function openCompanyModal(companyName) {
    // Get candidates for this company from job-specific data
    const companyCandidates = [];
    let headers = [];
    
    // First try to get data from job-specific shortlists
    Object.keys(AppState.jobShortlisted).forEach(jobId => {
        const shortlistData = AppState.jobShortlisted[jobId];
        const job = AppState.jobs.find(j => j.id == jobId);
        
        if (shortlistData && shortlistData.length > 0 && job && job.company === companyName) {
            if (headers.length === 0) {
                headers = [...shortlistData[0]];
                companyCandidates.push(headers);
            }
            
            // Add all candidates from this job
            for (let i = 1; i < shortlistData.length; i++) {
                companyCandidates.push([...shortlistData[i]]);
            }
        }
    });
    
    // Fallback to global shortlisted data if no job-specific data
    if (companyCandidates.length === 0 && AppState.shortlistedData.length > 0) {
        const globalHeaders = AppState.shortlistedData[0];
        const companyIndex = globalHeaders.findIndex(header => 
            header.toLowerCase().includes('company') || 
            header.toLowerCase().includes('organization')
        );
        
        if (companyIndex !== -1) {
            companyCandidates.push(globalHeaders);
            
            for (let i = 1; i < AppState.shortlistedData.length; i++) {
                const row = AppState.shortlistedData[i];
                if (row[companyIndex] === companyName) {
                    companyCandidates.push(row);
                }
            }
        }
    }
    
    AppState.currentCompanyData = companyCandidates;
    
    // Update modal content
    const candidateCount = Math.max(0, companyCandidates.length - 1);
    document.getElementById('company-modal-name').textContent = companyName;
    document.getElementById('company-modal-count').textContent = 
        `${candidateCount} candidate${candidateCount !== 1 ? 's' : ''} shortlisted`;
    
    // Update company icon
    updateCompanyIcon(companyName);
    
    // Add company description
    updateCompanyDescription(companyName, candidateCount);
    
    // Populate company candidates table
    populateCompanyCandidatesTable(companyCandidates);
    
    // Clear search
    document.getElementById('company-candidate-search').value = '';
    
    // Show modal
    document.getElementById('company-shortlisted-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateCompanyIcon(companyName) {
    const iconElement = document.getElementById('company-modal-icon');
    const companyLower = companyName.toLowerCase();
    
    let icon = 'fas fa-building';
    if (companyLower.includes('tech') || companyLower.includes('software')) {
        icon = 'fas fa-laptop-code';
    } else if (companyLower.includes('bank') || companyLower.includes('finance')) {
        icon = 'fas fa-university';
    } else if (companyLower.includes('consult')) {
        icon = 'fas fa-handshake';
    } else if (companyLower.includes('health') || companyLower.includes('medical')) {
        icon = 'fas fa-heartbeat';
    } else if (companyLower.includes('education')) {
        icon = 'fas fa-graduation-cap';
    }
    
    iconElement.innerHTML = `<i class="${icon}"></i>`;
}

function updateCompanyDescription(companyName, candidateCount) {
    const descriptionElement = document.getElementById('company-modal-description');
    
    // Get company type for description
    const companyLower = companyName.toLowerCase();
    let description = '';
    
    if (companyLower.includes('tech') || companyLower.includes('software')) {
        description = `
            <h5>About the Selection Process:</h5>
            <p>Technology company with focus on software development and innovation.</p>
            <ul>
                <li>Technical interview rounds</li>
                <li>Coding assessments</li>
                <li>System design discussions</li>
                <li>HR and cultural fit interview</li>
            </ul>
        `;
    } else if (companyLower.includes('bank') || companyLower.includes('finance')) {
        description = `
            <h5>About the Selection Process:</h5>
            <p>Financial services organization with emphasis on analytical and communication skills.</p>
            <ul>
                <li>Aptitude and reasoning tests</li>
                <li>Financial knowledge assessment</li>
                <li>Group discussions</li>
                <li>Personal interview</li>
            </ul>
        `;
    } else if (companyLower.includes('consult')) {
        description = `
            <h5>About the Selection Process:</h5>
            <p>Consulting firm focused on problem-solving and client interaction skills.</p>
            <ul>
                <li>Case study analysis</li>
                <li>Presentation skills assessment</li>
                <li>Client simulation exercises</li>
                <li>Partner interview</li>
            </ul>
        `;
    } else {
        description = `
            <h5>About the Selection Process:</h5>
            <p>Multi-stage selection process to identify the best candidates.</p>
            <ul>
                <li>Written examination</li>
                <li>Technical/domain assessment</li>
                <li>Personal interview</li>
                <li>Final HR discussion</li>
            </ul>
        `;
    }
    
    descriptionElement.innerHTML = description;
}

function populateCompanyCandidatesTable(data) {
    const tableHeader = document.getElementById('company-candidates-header');
    const tableBody = document.getElementById('company-candidates-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 100);
    }
}

function filterCompanyCandidates() {
    const searchTerm = document.getElementById('company-candidate-search').value.toLowerCase();
    
    if (!AppState.currentCompanyData || AppState.currentCompanyData.length === 0) return;
    
    let filteredData;
    if (!searchTerm) {
        filteredData = AppState.currentCompanyData;
    } else {
        filteredData = [
            AppState.currentCompanyData[0], // Keep headers
            ...AppState.currentCompanyData.slice(1).filter(row => {
                return row.some(cell => 
                    cell && cell.toString().toLowerCase().includes(searchTerm)
                );
            })
        ];
    }
    
    // Update table with filtered data
    const tableBody = document.getElementById('company-candidates-body');
    tableBody.innerHTML = '';
    
    // Highlight matching rows
    for (let i = 1; i < filteredData.length; i++) {
        const row = document.createElement('tr');
        
        // Check if this row matches the search term
        const isMatch = searchTerm && filteredData[i].some(cell => 
            cell && cell.toString().toLowerCase().includes(searchTerm)
        );
        
        if (isMatch) {
            row.classList.add('highlight-row');
        }
        
        filteredData[i].forEach(cell => {
            const td = document.createElement('td');
            const cellText = cell || '';
            
            // Highlight matching text
            if (searchTerm && cellText.toLowerCase().includes(searchTerm)) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                td.innerHTML = cellText.replace(regex, '<mark>$1</mark>');
            } else {
                td.textContent = cellText;
            }
            
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 50);
    }
    
    // Show message if no results
    if (filteredData.length <= 1) {
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.colSpan = AppState.currentCompanyData[0].length;
        noResultsCell.textContent = 'No candidates found matching your search.';
        noResultsCell.style.textAlign = 'center';
        noResultsCell.style.fontStyle = 'italic';
        noResultsCell.style.color = '#4a5568';
        noResultsCell.style.padding = '2rem';
        noResultsRow.appendChild(noResultsCell);
        tableBody.appendChild(noResultsRow);
    }
}

function closeCompanyShortlistedModal() {
    document.getElementById('company-shortlisted-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentCompanyData = [];
}

// Notification System Functions
function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    
    if (AppState.notifications.length === 0) {
        // Add sample notifications
        addNotification({
            type: 'info',
            title: 'Welcome to DSI Placement Portal',
            message: 'Check this section regularly for important updates about placements and shortlisted candidates.',
            time: new Date().toISOString()
        });
    }
    
    displayNotifications();
}

function addNotification(notification) {
    const newNotification = {
        id: Date.now(),
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        time: notification.time || new Date().toISOString(),
        read: false,
        action: notification.action || null
    };
    
    AppState.notifications.unshift(newNotification);
    
    // Keep only last 10 notifications
    if (AppState.notifications.length > 10) {
        AppState.notifications = AppState.notifications.slice(0, 10);
    }
    
    displayNotifications();
}

function displayNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';
    
    if (AppState.notifications.length === 0) {
        notificationsList.innerHTML = `
            <div class="notification-item">
                <div class="notification-icon info">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="notification-content">
                    <h4>No notifications yet</h4>
                    <p>You'll see important updates and announcements here.</p>
                </div>
            </div>
        `;
        return;
    }
    
    AppState.notifications.forEach((notification, index) => {
        const item = document.createElement('div');
        item.className = `notification-item ${!notification.read ? 'unread' : ''}`;
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        const timeAgo = getTimeAgo(notification.time);
        
        item.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <div class="notification-time">${timeAgo}</div>
                ${notification.action ? `
                    <div class="notification-action">
                        <button class="notification-btn" onclick="executeNotificationAction(${notification.id})">
                            ${notification.action.text}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Mark as read when clicked
        item.onclick = () => markNotificationRead(notification.id);
        
        notificationsList.appendChild(item);
        
        // Animate appearance
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'bell';
    }
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
}

function markNotificationRead(notificationId) {
    const notification = AppState.notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        displayNotifications();
    }
}

function markAllNotificationsRead() {
    AppState.notifications.forEach(notification => {
        notification.read = true;
    });
    displayNotifications();
    showNotification('All notifications marked as read', 'success');
}

function executeNotificationAction(notificationId) {
    const notification = AppState.notifications.find(n => n.id === notificationId);
    if (notification && notification.action && notification.action.callback) {
        notification.action.callback();
        markNotificationRead(notificationId);
    }
}

// Job-Specific Shortlist Functions
function showJobShortlistUpload(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    AppState.currentJobId = jobId;
    
    // Update modal content
    document.getElementById('job-shortlist-title').textContent = 
        AppState.jobShortlisted[jobId] ? 'Update Shortlisted Candidates' : 'Upload Shortlisted Candidates';
    document.getElementById('job-shortlist-subtitle').textContent = `${job.company} • ${job.title}`;
    
    // Reset modal state
    document.getElementById('job-shortlist-data-viewer').style.display = 'none';
    document.getElementById('job-shortlist-upload-progress').style.display = 'none';
    document.getElementById('job-shortlist-file-input').value = '';
    
    // Show modal
    document.getElementById('job-shortlist-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeJobShortlistModal() {
    document.getElementById('job-shortlist-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentJobId = null;
    
    // Reset form
    document.getElementById('job-shortlist-file-input').value = '';
    document.getElementById('job-shortlist-data-viewer').style.display = 'none';
    document.getElementById('job-shortlist-upload-progress').style.display = 'none';
}

function handleJobShortlistDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('job-shortlist-drop-zone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processJobShortlistFile(files[0]);
    }
}

function handleJobShortlistFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processJobShortlistFile(files[0]);
    }
}

function processJobShortlistFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('job-shortlist-upload-progress').style.display = 'block';
    const progressFill = document.getElementById('job-shortlist-progress-fill');
    const progressText = document.getElementById('job-shortlist-progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readJobShortlistFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readJobShortlistFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayJobShortlistPreview(data);
            showNotification('File processed successfully! Review and save.', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function displayJobShortlistPreview(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    // Store temporarily for saving
    window.tempJobShortlistData = data;
    
    const dataViewer = document.getElementById('job-shortlist-data-viewer');
    const tableHeader = document.getElementById('job-shortlist-table-header');
    const tableBody = document.getElementById('job-shortlist-table-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows (show first 10 for preview)
    const previewRows = Math.min(data.length - 1, 10);
    for (let i = 1; i <= previewRows; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
    }
    
    if (data.length > 11) {
        const moreRow = document.createElement('tr');
        const moreCell = document.createElement('td');
        moreCell.colSpan = data[0].length;
        moreCell.textContent = `... and ${data.length - 11} more entries`;
        moreCell.style.textAlign = 'center';
        moreCell.style.fontStyle = 'italic';
        moreCell.style.color = '#4a5568';
        moreRow.appendChild(moreCell);
        tableBody.appendChild(moreRow);
    }
    
    // Hide upload progress and show data viewer
    document.getElementById('job-shortlist-upload-progress').style.display = 'none';
    dataViewer.style.display = 'block';
}

function saveJobShortlistData() {
    try {
        // Validate data exists
        if (!window.tempJobShortlistData) {
            showNotification('Please upload a file first', 'error');
            return;
        }
        
        if (!AppState.currentJobId) {
            showNotification('Please select a job first', 'error');
            return;
        }
        
        // Find job
        const jobId = parseInt(AppState.currentJobId);
        const job = AppState.jobs.find(j => j.id === jobId);
        
        if (!job) {
            showNotification('Job not found. Please try again.', 'error');
            return;
        }
        
        // Save data
        if (!AppState.jobShortlisted) {
            AppState.jobShortlisted = {};
        }
        
        AppState.jobShortlisted[jobId] = window.tempJobShortlistData.slice();
        
        // Update global data
        updateGlobalShortlistedData();
        
        // Add notification for students
        addNotification({
            type: 'success',
            title: `${job.company} Shortlist Updated!`,
            message: `${window.tempJobShortlistData.length - 1} candidates shortlisted for ${job.title} position.`,
            action: {
                text: 'View Shortlist',
                callback: () => showShortlistedView()
            }
        });
        
        // Clear temp data
        window.tempJobShortlistData = null;
        
        // Reload admin interface (only if on admin page)
        if (document.getElementById('admin-job-list')) {
            loadAdminJobList();
        }
        
        // Show success
        showNotification(`Successfully saved ${AppState.jobShortlisted[jobId].length - 1} shortlisted candidates!`, 'success');
        
        // Close modal
        closeJobShortlistModal();
        
    } catch (error) {
        console.error('Save error:', error);
        showNotification('Error saving data: ' + error.message, 'error');
    }
}

function updateGlobalShortlistedData() {
    // Combine all job shortlists into global shortlisted data
    const allShortlisted = [];
    let headers = [];
    
    // Check if we have any job-specific shortlisted data
    const hasJobShortlists = Object.keys(AppState.jobShortlisted).some(jobId => 
        AppState.jobShortlisted[jobId] && AppState.jobShortlisted[jobId].length > 0
    );
    
    if (hasJobShortlists) {
        Object.keys(AppState.jobShortlisted).forEach(jobId => {
            const shortlistData = AppState.jobShortlisted[jobId];
            if (shortlistData && shortlistData.length > 0) {
                if (headers.length === 0) {
                    // Add company column to headers if not exists
                    headers = [...shortlistData[0]];
                    if (!headers.some(h => h.toLowerCase().includes('company'))) {
                        headers.unshift('Company');
                    }
                    allShortlisted.push(headers);
                }
                
                const job = AppState.jobs.find(j => j.id == jobId);
                const companyName = job ? job.company : 'Unknown Company';
                
                // Add data rows with company name
                for (let i = 1; i < shortlistData.length; i++) {
                    const row = [...shortlistData[i]];
                    if (!headers.some(h => h.toLowerCase().includes('company'))) {
                        row.unshift(companyName);
                    }
                    allShortlisted.push(row);
                }
            }
        });
        
        AppState.shortlistedData = allShortlisted;
        AppState.filteredShortlistedData = allShortlisted;
        AppState.showShortlistedBanner = true;
    }
    
    // Update shortlisted view if needed
    if (allShortlisted.length > 0) {
        // Update company view if it's visible
        const companyView = document.getElementById('company-view');
        if (companyView && companyView.style.display !== 'none') {
            loadCompanyView();
        }
        // Note: populateTableView function doesn't exist, so we skip this
        // populateTableView(allShortlisted);
    }
}

function viewJobShortlist(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    const shortlistData = AppState.jobShortlisted[jobId];
    
    if (!job || !shortlistData) {
        showNotification('No shortlist data found for this job', 'error');
        return;
    }
    
    AppState.currentJobId = jobId;
    
    // Update modal content
    document.getElementById('job-shortlist-view-title').textContent = 'Shortlisted Candidates';
    document.getElementById('job-shortlist-view-subtitle').textContent = `${job.company} • ${job.title}`;
    document.getElementById('job-shortlist-view-count').textContent = 
        `${shortlistData.length - 1} candidate${shortlistData.length !== 2 ? 's' : ''} shortlisted`;
    
    // Populate table
    populateJobShortlistViewTable(shortlistData);
    
    // Clear search
    document.getElementById('job-shortlist-search').value = '';
    
    // Show modal
    document.getElementById('job-shortlist-view-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function populateJobShortlistViewTable(data) {
    const tableHeader = document.getElementById('job-shortlist-view-header-table');
    const tableBody = document.getElementById('job-shortlist-view-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 50);
    }
}

function filterJobShortlistCandidates() {
    const searchTerm = document.getElementById('job-shortlist-search').value.toLowerCase();
    const originalData = AppState.jobShortlisted[AppState.currentJobId];
    
    if (!originalData) return;
    
    let filteredData;
    if (!searchTerm) {
        filteredData = originalData;
    } else {
        filteredData = [
            originalData[0], // Keep headers
            ...originalData.slice(1).filter(row => {
                return row.some(cell => 
                    cell && cell.toString().toLowerCase().includes(searchTerm)
                );
            })
        ];
    }
    
    populateJobShortlistViewTable(filteredData);
}

function exportJobShortlistData() {
    const shortlistData = AppState.jobShortlisted[AppState.currentJobId];
    const job = AppState.jobs.find(j => j.id === AppState.currentJobId);
    
    if (!shortlistData || !job) {
        showNotification('No data to export', 'error');
        return;
    }
    
    // Create CSV content
    const csvContent = shortlistData.map(row => {
        return row.map(cell => {
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
        }).join(',');
    }).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${job.company}_${job.title}_shortlisted.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Shortlist data exported successfully!', 'success');
}

function deleteJobShortlistData() {
    if (!AppState.currentJobId) return;
    
    const job = AppState.jobs.find(j => j.id === AppState.currentJobId);
    if (!job) return;
    
    if (confirm(`Are you sure you want to delete the shortlist for ${job.company} - ${job.title}?`)) {
        delete AppState.jobShortlisted[AppState.currentJobId];
        
        // Update global shortlisted data
        updateGlobalShortlistedData();
        
        // Reload admin job list
        loadAdminJobList();
        
        showNotification('Shortlist deleted successfully!', 'success');
        closeJobShortlistViewModal();
    }
}

function closeJobShortlistViewModal() {
    document.getElementById('job-shortlist-view-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentJobId = null;
}

// Admin Notifications Functions
function loadAdminNotifications() {
    const adminNotificationsList = document.getElementById('admin-notifications-list');
    
    if (AppState.notifications.length === 0) {
        adminNotificationsList.innerHTML = `
            <div class="admin-notification-item">
                <div class="admin-notification-icon info">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="admin-notification-content">
                    <h5>No notifications posted yet</h5>
                    <p>Use the "Post New Notification" button to add announcements for students.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Show recent 5 notifications
    const recentNotifications = AppState.notifications.slice(0, 5);
    adminNotificationsList.innerHTML = '';
    
    recentNotifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = 'admin-notification-item';
        
        const timeAgo = getTimeAgo(notification.time);
        
        item.innerHTML = `
            <div class="admin-notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="admin-notification-content">
                <h5>${notification.title}</h5>
                <p>${notification.message}</p>
                <div class="admin-notification-time">${timeAgo}</div>
            </div>
        `;
        
        adminNotificationsList.appendChild(item);
    });
}

function showAddNotificationModal() {
    document.getElementById('add-notification-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listener for action checkbox
    document.getElementById('notification-action-enabled').onchange = function() {
        const actionSection = document.getElementById('notification-action-section');
        actionSection.style.display = this.checked ? 'block' : 'none';
    };
}

function closeAddNotificationModal() {
    document.getElementById('add-notification-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('notification-form').reset();
    document.getElementById('notification-action-section').style.display = 'none';
}

function handleNotificationSubmit(event) {
    event.preventDefault();
    
    const type = document.getElementById('notification-type').value;
    const title = document.getElementById('notification-title').value;
    const message = document.getElementById('notification-message').value;
    const actionEnabled = document.getElementById('notification-action-enabled').checked;
    const actionText = document.getElementById('notification-action-text').value;
    
    const notificationData = {
        type: type,
        title: title,
        message: message
    };
    
    if (actionEnabled && actionText) {
        notificationData.action = {
            text: actionText,
            callback: () => showNotification('Action clicked!', 'info')
        };
    }
    
    addNotification(notificationData);
    showNotification('Notification posted successfully!', 'success');
    
    closeAddNotificationModal();
    loadAdminNotifications();
}

// Company Modal Functions
function viewFullCompanyList() {
    const companyName = document.getElementById('company-modal-name').textContent;
    
    // Get all shortlisted data for this company
    const allCompanyData = [];
    let headers = [];
    
    Object.keys(AppState.jobShortlisted).forEach(jobId => {
        const shortlistData = AppState.jobShortlisted[jobId];
        const job = AppState.jobs.find(j => j.id == jobId);
        
        if (shortlistData && shortlistData.length > 0 && job && job.company === companyName) {
            if (headers.length === 0) {
                headers = [...shortlistData[0]];
                allCompanyData.push(headers);
            }
            
            // Add all candidates from this job
            for (let i = 1; i < shortlistData.length; i++) {
                allCompanyData.push([...shortlistData[i]]);
            }
        }
    });
    
    AppState.currentCompanyFullData = allCompanyData;
    
    // Update full list modal
    document.getElementById('full-list-company-name').textContent = companyName;
    populateFullCompanyListTable(allCompanyData);
    
    // Close company modal and show full list modal
    document.getElementById('company-shortlisted-modal').classList.remove('active');
    document.getElementById('full-company-list-modal').classList.add('active');
}

function populateFullCompanyListTable(data) {
    const tableHeader = document.getElementById('full-company-list-header');
    const tableBody = document.getElementById('full-company-list-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" style="text-align: center; padding: 2rem; color: #4a5568;">
                    No data available
                </td>
            </tr>
        `;
        return;
    }
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
    }
}

function filterFullCompanyList() {
    const searchTerm = document.getElementById('full-list-search').value.toLowerCase();
    const originalData = AppState.currentCompanyFullData;
    
    if (!originalData) return;
    
    let filteredData;
    if (!searchTerm) {
        filteredData = originalData;
    } else {
        filteredData = [
            originalData[0], // Keep headers
            ...originalData.slice(1).filter(row => {
                return row.some(cell => 
                    cell && cell.toString().toLowerCase().includes(searchTerm)
                );
            })
        ];
    }
    
    populateFullCompanyListTable(filteredData);
}

function exportFullCompanyList() {
    const companyName = document.getElementById('full-list-company-name').textContent;
    const data = AppState.currentCompanyFullData;
    
    if (!data || data.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    // Create CSV content
    const csvContent = data.map(row => {
        return row.map(cell => {
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
        }).join(',');
    }).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${companyName}_all_shortlisted.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Full company list exported successfully!', 'success');
}

function closeFullCompanyListModal() {
    document.getElementById('full-company-list-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentCompanyFullData = null;
}
