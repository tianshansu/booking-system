const TODAY = "2025-01-15" //set a today's date

const sessions = [
    // ===== Today sessions (5) =====
    {
        id: 1,
        date: "2025-01-15",
        time: "09:00",
        title: "Initial Consultation",
        patientName: "Michael Chen",
        status: "Completed"
    },
    {
        id: 2,
        date: "2025-01-15",
        time: "10:30",
        title: "Follow-up Session",
        patientName: "Emma Rodriguez",
        status: "Scheduled"
    },
    {
        id: 3,
        date: "2025-01-15",
        time: "11:45",
        title: "Review Meeting",
        patientName: "Sarah Thompson",
        status: "Scheduled"
    },
    {
        id: 4,
        date: "2025-01-15",
        time: "14:00",
        title: "Training Session",
        patientName: "David Kim",
        status: "Scheduled"
    },
    {
        id: 5,
        date: "2025-01-15",
        time: "16:00",
        title: "Progress Check",
        patientName: "Amanda Foster",
        status: "Scheduled"
    },
    // ===== Upcoming sessions (5) =====
    {
        id: 6,
        date: "2025-01-18",
        time: "10:00",
        title: "Assessment Session",
        patientName: "Jennifer Lee",
        status: "Scheduled"
    },
    {
        id: 7,
        date: "2025-01-19",
        time: "13:30",
        title: "Consultation",
        patientName: "Robert Martinez",
        status: "Scheduled"
    },
    {
        id: 8,
        date: "2025-01-20",
        time: "09:00",
        title: "Initial Consultation",
        patientName: "Amanda Foster",
        status: "Scheduled"
    },
    {
        id: 9,
        date: "2025-01-21",
        time: "15:00",
        title: "Training Workshop",
        patientName: "Group Session (6 people)",
        status: "Scheduled"
    },
    {
        id: 10,
        date: "2025-01-22",
        time: "11:00",
        title: "Follow-up Session",
        patientName: "Daniel Wu",
        status: "Scheduled"
    }
]; //all sessions (mock data)

const recentActivities = [
    {
        id: 1,
        message: "Session completed with Michael Chen",
        time: "2 hours ago"
    },
    {
        id: 2,
        message: "New session scheduled for Amanda Foster",
        time: "5 hours ago"
    },
    {
        id: 3,
        message: "New person added - Amanda Foster",
        time: "6 hours ago"
    }
] // mock data for recent actiivity

export { sessions, recentActivities, TODAY };