const StatisticsParticipant = () => import('../../components/participant/main-page/StatisticsParticipant.vue');
const Greeting = () => import('../../components/participant/greeting/Greeting.vue');
const Result = () => import('../../components/participant/result/Result.vue');
const Testing = () => import('../../components/participant/testing/Testing.vue');

export default [
    {
        path: '/p',
        name: 'Participant',
        component: StatisticsParticipant
    },
    {
        path: "/p/:id/greeting",
        name: "Greeting",
        component: Greeting
    },
    {
        path: '/p/:id/result',
        name: 'Result',
        component: Result
    },
    {
        path: '/p/:id/testing',
        name: 'Testing',
        component: Testing
    }
];
