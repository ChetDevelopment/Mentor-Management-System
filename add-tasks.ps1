# GitHub Projects Auto-Add Script for Windows PowerShell
# This script adds all Day 1 tasks to your GitHub Projects board

Write-Host "================================" -ForegroundColor Blue
Write-Host "MentorKhet Task Auto-Adder" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue
Write-Host ""

# Configuration
$PROJECT_NUMBER = 1
$OWNER = "ChetDevelopment"

# Check if gh CLI is installed
Write-Host "Checking for GitHub CLI..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version
    Write-Host "✓ GitHub CLI found: $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: GitHub CLI (gh) is not installed!" -ForegroundColor Red
    Write-Host "Please install from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Day 1 Tasks
$TASKS = @(
    "1.1 Install Node.js v20+ if not installed [15m]",
    "1.2 Install VS Code if not installed [15m]",
    "1.3 Install PostgreSQL (or use Docker) [1h]",
    "1.4 Create database named 'mentorkhet' [30m]",
    "1.5 Clone repository from GitHub [15m]",
    "1.6 Open project in VS Code [5m]",
    "1.7 Run 'npm install' in terminal [30m]",
    "1.8 Copy .env.example to .env [5m]",
    "1.9 Update DB_PASSWORD in .env file [5m]",
    "1.10 Update DB_DATABASE in .env file [5m]",
    "1.11 Test database connection (npm run start:dev) [30m]",
    "1.12 Check entities folder exists [5m]",
    "1.13 Create User entity class [1h]",
    "1.14 Add @Entity('users') decorator [10m]",
    "1.15 Add id column with @PrimaryGeneratedColumn [15m]",
    "1.16 Add email column with @Column [10m]",
    "1.17 Add password column with @Column [10m]",
    "1.18 Add firstName, lastName columns [10m]",
    "1.19 Add role column with enum [15m]",
    "1.20 Add createdAt, updatedAt columns [10m]",
    "1.21 Create Mentor entity class [1h]",
    "1.22 Add @Entity('mentors') decorator [10m]",
    "1.23 Add userId column with @Column [10m]",
    "1.24 Add bio, title, company columns [15m]",
    "1.25 Add yearsOfExperience column [10m]",
    "1.26 Add rating, totalSessions columns [15m]",
    "1.27 Add isAvailable column [10m]",
    "1.28 Create Mentee entity class [1h]",
    "1.29 Add @Entity('mentees') decorator [10m]",
    "1.30 Add userId column with @Column [10m]",
    "1.31 Add occupation, organization columns [15m]",
    "1.32 Add goals, interests columns [15m]",
    "1.33 Save all entity files [5m]",
    "1.34 Restart server to test entities load [15m]",
    "1.35 Check database for new tables [15m]",
    "1.36 Commit Day 1 work to Git [30m]"
)

Write-Host "Adding $($TASKS.Count) tasks to GitHub Projects..." -ForegroundColor Yellow
Write-Host ""

# Add each task
$count = 0
foreach ($task in $TASKS) {
    $count++
    Write-Host "[$count/$($TASKS.Count)] Adding: $task" -ForegroundColor Cyan
    
    # Add task to project
    gh project item-add $PROJECT_NUMBER --owner $OWNER --title $task
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✓ All tasks added successfully!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Open your project at:" -ForegroundColor Yellow
Write-Host "https://github.com/users/ChetDevelopment/projects/1" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
