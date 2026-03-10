const START_DATE = new Date('2026-03-09T00:00:00+05:30');

// State Management
let state = {
    days: [],
    completions: JSON.parse(localStorage.getItem('study_completions')) || {},
    notes: JSON.parse(localStorage.getItem('study_notes')) || {},
    settings: JSON.parse(localStorage.getItem('study_settings')) || {
        allowPastEditing: false
    },
    currentDay: 1,
    activeView: 'dashboard'
};

// Initialize App
async function init() {
    // Apply initial body attributes for CSS
    document.body.setAttribute('data-past-editing', state.settings.allowPastEditing);
    try {
        const response = await fetch('data.json');
        state.days = await response.json();
        
        calculateCurrentDay();
        setupEventListeners();
        renderDashboard();
        renderProgressGrid();
        updateGlobalProgress();
        
        // Start live ticker to update "Current Activity" every minute
        setInterval(updateCurrentActivity, 60000);
        updateCurrentActivity();
        
    } catch (error) {
        console.error("Failed to load study plan:", error);
    }
}

function calculateCurrentDay() {
    const today = new Date();
    // For testing purposes, if it's before the start date, default to Day 1
    if (today < START_DATE) {
        state.currentDay = 1;
        return;
    }
    const diffTime = Math.abs(today - START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    state.currentDay = Math.min(diffDays, 30);
    
    document.getElementById('current-date-display').textContent = 
        `${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Day ${state.currentDay}`;
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.nav-item.active').classList.remove('active');
            btn.classList.add('active');
            const view = btn.dataset.view;
            switchView(view);
        });
    });

    // Modal Close
    const modal = document.getElementById('activity-modal');
    document.querySelector('.close-modal').onclick = () => modal.classList.remove('active');
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); };

    // Sync Calendar
    document.getElementById('sync-calendar').addEventListener('click', syncToCalendar);
    
    // Export Journal
    document.getElementById('export-journal').addEventListener('click', exportJournal);

    // Settings
    const pastToggle = document.getElementById('toggle-past-editing');
    pastToggle.checked = state.settings.allowPastEditing;
    pastToggle.onchange = (e) => {
        state.settings.allowPastEditing = e.target.checked;
        localStorage.setItem('study_settings', JSON.stringify(state.settings));
        document.body.setAttribute('data-past-editing', e.target.checked);
        renderProgressGrid(); // Refresh grid to show/hide clickable state
    };

    document.getElementById('reset-all').onclick = () => {
        if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
            localStorage.clear();
            location.reload();
        }
    };
}

function renderDashboard() {
    const container = document.getElementById('daily-activities');
    container.innerHTML = '';
    
    const dayData = state.days.find(d => d.day === state.currentDay);
    if (!dayData) return;

    dayData.activities.forEach((activity, index) => {
        const card = createActivityCard(activity, index, state.currentDay);
        container.appendChild(card);
    });
}

function createActivityCard(activity, index, dayNum) {
    const cardId = `day-${dayNum}-act-${index}`;
    const isCompleted = state.completions[cardId] || false;
    
    const card = document.createElement('div');
    card.className = `activity-card ${isCompleted ? 'completed' : ''}`;
    card.dataset.id = cardId;
    
    const colorClass = activity.title.toLowerCase().includes('learning') ? 'learning' : 
                      activity.title.toLowerCase().includes('building') ? 'building' : 'outreach';

    card.innerHTML = `
        <div class="activity-header">
            <span class="tag ${colorClass}">${activity.title}</span>
            <span class="activity-time">${activity.time}</span>
        </div>
        <h4>${activity.description.split(';')[0]}</h4>
        <p>${activity.description}</p>
        <div class="card-footer">
            <div class="completion-hint">${isCompleted ? '✅ Done' : 'Click to open lab notes'}</div>
            <button class="btn-check ${isCompleted ? 'checked' : ''}" onclick="event.stopPropagation(); toggleCompletion('${cardId}')">
                ${isCompleted ? '✓' : ''}
            </button>
        </div>
    `;

    card.addEventListener('click', () => openActivityModal(activity, cardId));
    return card;
}

function updateCurrentActivity() {
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const dayData = state.days.find(d => d.day === state.currentDay);
    if (!dayData) return;

    // Find if we are currently in a task time block
    const currentActivity = dayData.activities.find(act => {
        const [start, end] = act.time.split(' - ');
        return currentTimeStr >= start && currentTimeStr <= end;
    });

    const hero = document.getElementById('current-task-hero');
    if (currentActivity) {
        document.getElementById('hero-task-title').textContent = currentActivity.title;
        document.getElementById('hero-task-desc').textContent = currentActivity.description;
        document.getElementById('hero-task-time').textContent = currentActivity.time;
        
        const cardId = `day-${state.currentDay}-act-${dayData.activities.indexOf(currentActivity)}`;
        const isCompleted = state.completions[cardId];
        
        document.getElementById('complete-current').textContent = isCompleted ? 'Completed ✅' : 'Mark as Completed';
        document.getElementById('complete-current').onclick = () => toggleCompletion(cardId);
        hero.style.opacity = '1';
    } else {
        // Find next activity
        const nextActivity = dayData.activities.find(act => {
            const [start] = act.time.split(' - ');
            return currentTimeStr < start;
        });

        if (nextActivity) {
            document.getElementById('hero-task-title').textContent = "Next Up: " + nextActivity.title;
            document.getElementById('hero-task-desc').textContent = nextActivity.description;
            document.getElementById('hero-task-time').textContent = nextActivity.time;
        } else {
            document.getElementById('hero-task-title').textContent = "Rest & Reflect";
            document.getElementById('hero-task-desc').textContent = "You've finished today's planned blocks! Review your lab notes.";
            document.getElementById('hero-task-time').textContent = "Post-16:30";
        }
        document.getElementById('complete-current').style.display = 'none';
    }
}

function openActivityModal(activity, id) {
    // Security Check: If it's a past day and editing is disabled
    const dayOfActivity = parseInt(id.split('-')[1]);
    const realToday = calculateRealCurrentDay();
    const isActuallyPast = realToday > dayOfActivity;
    const isFuture = dayOfActivity > realToday;
    
    if (isFuture) {
        alert("You cannot edit future tasks. Stay focused on today!");
        return;
    }

    if (isActuallyPast && !state.settings.allowPastEditing) {
        alert("Editing past activities is disabled in Settings.");
        return;
    }

    const modal = document.getElementById('activity-modal');
    document.getElementById('modal-activity-title').textContent = activity.title;
    document.getElementById('modal-activity-desc').textContent = activity.description;
    
    const textarea = document.getElementById('activity-notes');
    textarea.value = state.notes[id] || '';
    
    document.getElementById('save-notes').onclick = () => {
        const text = textarea.value;
        state.notes[id] = text;
        localStorage.setItem('study_notes', JSON.stringify(state.notes));
        
        // Auto-completion logic: 5 lines of content
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length >= 5 && !state.completions[id]) {
            state.completions[id] = true;
            localStorage.setItem('study_completions', JSON.stringify(state.completions));
            updateGlobalProgress();
            renderProgressGrid();
        }

        modal.classList.remove('active');
        renderDashboard(); 
    };

    // Copy to Social
    document.getElementById('copy-social').onclick = () => {
        const text = textarea.value;
        const socialText = `🚀 AI Generalist Sprint - Day ${dayOfActivity}\n` +
                          `📝 Activity: ${activity.title}\n\n` +
                          `${text}\n\n` +
                          `#AIGeneralist #LearningInPublic #AIStudyTracker`;
        
        navigator.clipboard.writeText(socialText).then(() => {
            const originalText = document.getElementById('copy-social').innerHTML;
            document.getElementById('copy-social').innerHTML = 'Copied! ✅';
            setTimeout(() => {
                document.getElementById('copy-social').innerHTML = originalText;
            }, 2000);
        });
    };

    modal.classList.add('active');
}

function toggleCompletion(id) {
    const dayOfActivity = parseInt(id.split('-')[1]);
    const isActuallyPast = calculateRealCurrentDay() > dayOfActivity;

    if (isActuallyPast && !state.settings.allowPastEditing) {
        alert("Updating past activities is disabled in Settings.");
        return;
    }

    state.completions[id] = !state.completions[id];
    localStorage.setItem('study_completions', JSON.stringify(state.completions));
    renderDashboard();
    renderProgressGrid();
    updateGlobalProgress();
    updateCurrentActivity();
}

function renderProgressGrid() {
    const grid = document.getElementById('progress-grid');
    grid.innerHTML = '';
    
    const realToday = calculateRealCurrentDay();

    for (let i = 1; i <= 30; i++) {
        const node = document.createElement('div');
        node.className = 'node';
        node.dataset.day = i;
        if (i === state.currentDay) node.classList.add('active');
        
        const isPast = i < realToday;
        const isFuture = i > realToday;
        
        if (isPast) node.classList.add('past');
        if (isFuture) node.classList.add('future');

        // A day is "completed" if all 3 activities are done
        const isDayDone = [0, 1, 2].every(idx => state.completions[`day-${i}-act-${idx}`]);
        if (isDayDone) node.classList.add('completed');
        
        node.onclick = () => {
            // Behavioral fix: Only allow clicking if:
            // 1. It is the real current day
            // 2. OR it is a past day AND settings allow it
            
            if (isFuture) {
                // Strictly block future
                return;
            }

            if (isPast && !state.settings.allowPastEditing) {
                // Block past if setting is off
                return;
            }
            
            state.currentDay = i;
            // Update UI
            document.getElementById('current-date-display').textContent = 
                `Viewing: March ${8 + i}, 2026 • Day ${i}`;
            
            renderDashboard();
            renderProgressGrid();
            
            // If they click away from the dashboard view, switch them back to see the day
            if (state.activeView !== 'dashboard') {
                switchView('dashboard');
                document.querySelector('.nav-item[data-view="dashboard"]').click();
            }
        };
        grid.appendChild(node);
    }
}

// Helper to get real current day regardless of viewed day
function calculateRealCurrentDay() {
    const today = new Date();
    if (today < START_DATE) return 1;
    const diffTime = Math.abs(today - START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 30);
}

function updateGlobalProgress() {
    const total = 90; // 30 days * 3 tasks
    const completed = Object.values(state.completions).filter(v => v).length;
    const percent = (completed / total) * 100;
    
    document.getElementById('global-progress-bar').style.width = `${percent}%`;
    document.getElementById('completed-count').textContent = completed;
}

function exportJournal() {
    let md = `# 📓 AI Generalist - 30 Day Lab Journal\n\n`;
    md += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    md += `--- \n\n`;

    let hasNotes = false;

    state.days.forEach(day => {
        let dayNotes = "";
        day.activities.forEach((act, idx) => {
            const id = `day-${day.day}-act-${idx}`;
            const noteContent = state.notes[id] || "";
            if (noteContent.trim()) {
                dayNotes += `### ${act.title} - ${act.time}\n`;
                dayNotes += `> ${act.description.split(';')[0]}\n\n`;
                dayNotes += `${noteContent}\n\n`;
                dayNotes += `---\n\n`;
            }
        });

        if (dayNotes) {
            md += `## 📅 Day ${day.day}\n\n` + dayNotes;
            hasNotes = true;
        }
    });

    if (!hasNotes) {
        alert("You haven't written any lab notes yet! Start documenting your 11:30 - 13:30 build session.");
        return;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Feature enhancement: Add timestamp to filename so multiple exports in one day are distinct
    const now = new Date();
    const timeStamp = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStamp = now.toISOString().split('T')[0];
    
    link.href = url;
    link.setAttribute('download', `AIG_Sprint_Journal_${dateStamp}_${timeStamp}.md`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

function syncToCalendar() {
    // Generate ICS content
    let ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//AI Generalist Study Tracker//EN",
        "X-WR-CALNAME:AI Generalist 30-Day Sprint",
        "X-WR-TIMEZONE:Asia/Kolkata"
    ];

    state.days.forEach(day => {
        const date = new Date(START_DATE);
        date.setDate(date.getDate() + (day.day - 1));
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

        day.activities.forEach(act => {
            const [start, end] = act.time.split(' - ');
            const startTime = start.replace(':', '') + '00';
            const endTime = end.replace(':', '') + '00';

            ics.push("BEGIN:VEVENT");
            ics.push(`DTSTART;TZID=Asia/Kolkata:${dateStr}T${startTime}`);
            ics.push(`DTEND;TZID=Asia/Kolkata:${dateStr}T${endTime}`);
            ics.push(`SUMMARY:${act.title}: ${act.description.split(';')[0]}`);
            ics.push(`DESCRIPTION:${act.description}`);
            ics.push("STATUS:CONFIRMED");
            ics.push("BEGIN:VALARM");
            ics.push("TRIGGER:-PT15M");
            ics.push("ACTION:DISPLAY");
            ics.push("DESCRIPTION:Reminder: " + act.title);
            ics.push("END:VALARM");
            ics.push("END:VEVENT");
        });
    });

    ics.push("END:VCALENDAR");
    
    const blob = new Blob([ics.join("\r\n")], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'ai_generalist_study_plan.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("I've generated a 30-day Study Plan calendar file for you! Import this into Google Calendar to get native mobile and desktop notifications for every session.");
}

function switchView(view) {
    state.activeView = view;
    document.getElementById('view-title').textContent = view.charAt(0).toUpperCase() + view.slice(1);
    
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(`${view}-view`);
    if (section) section.classList.add('active');

    // Load content for specific views
    if (view === 'roadmap') renderRoadmapTable();
    if (view === 'insights') renderInsights();
}

function renderRoadmapTable() {
    const tbody = document.getElementById('roadmap-table-body');
    tbody.innerHTML = '';
    
    state.days.forEach(day => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>Day ${day.day}</strong></td>
            <td>${day.activities[0].description}</td>
            <td>${day.activities[1].description}</td>
            <td>${day.activities[2].description}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderInsights() {
    // Update Stats
    const totalCompletions = Object.values(state.completions).filter(v => v).length;
    const totalNotes = Object.keys(state.notes).filter(k => state.notes[k].trim()).length;
    
    document.getElementById('stat-notes-count').textContent = totalNotes;
    document.getElementById('stat-velocity').textContent = Math.round((totalCompletions / 90) * 100) + "%";
    
    // Calculate streak (consecutive completed days)
    let streak = 0;
    for (let i = state.currentDay; i >= 1; i--) {
        const isDayDone = [0, 1, 2].every(idx => state.completions[`day-${i}-act-${idx}`]);
        if (isDayDone) streak++;
        else if (i < state.currentDay) break; // break only if we missed a past day
    }
    document.getElementById('stat-streak').textContent = streak + " Days";

    // Show recent notes
    const recentList = document.getElementById('recent-notes-list');
    recentList.innerHTML = '';
    
    const noteKeys = Object.keys(state.notes).reverse().slice(0, 5);
    noteKeys.forEach(key => {
        if (!state.notes[key].trim()) return;
        
        const [dayStr, actStr] = key.split('-act-');
        const dayNum = dayStr.split('-')[1];
        const actData = state.days[dayNum-1].activities[actStr];

        const div = document.createElement('div');
        div.className = 'small-note-card';
        div.innerHTML = `
            <h5>Day ${dayNum} - ${actData.title}</h5>
            <p>${state.notes[key]}</p>
        `;
        recentList.appendChild(div);
    });
}

init();
