// State management
const state = {
    screenTime: {
        active: false,
        seconds: 0,
        timer: null,
        limit: 120 // minutes
    },
    activities: {
        completed: 0,
        goal: 60, // minutes
        history: []
    },
    exercises: {
        completed: 0,
        daily_goal: 4,
        history: []
    },
    achievements: [
        { id: 1, name: "Early Bird", icon: "fa-sun", description: "Complete an exercise before 9 AM", earned: false },
        { id: 2, name: "Active Achiever", icon: "fa-medal", description: "Meet daily activity goal 5 days in a row", earned: false },
        { id: 3, name: "Mind Master", icon: "fa-brain", description: "Complete all daily cognitive exercises", earned: false },
        { id: 4, name: "Balance Builder", icon: "fa-balance-scale", description: "Maintain healthy screen time for a week", earned: false }
    ],
    settings: {
        screenTimeLimit: 120,
        activityGoal: 60,
        screenTimeAlerts: true,
        activityReminders: true
    }
};