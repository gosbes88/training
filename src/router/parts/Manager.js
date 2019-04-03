const Manager = () => import('../../components/manager/mainPage/MainPage');
const CompletedTests = () => import('../../components/manager/completed/MainPage');
const TestResults = () => import('../../components/manager/completed/TestResults');
const Constructor = () => import('../../components/manager/constructor/create/MainPage');
const QuizList = () => import('../../components/manager/constructor/list/MainPage');
const QuizSelection = () => import('../../components/manager/test/quiz/MainPage');
const TestParticipants = () => import('../../components/manager/test/participants/MainPage');
const CommonInformation = () => import('../../components/manager/test/commonInformation/MainPage');
const ParticipantsPage = () => import('../../components/manager/test/addedParticipants/MainPage');
const Finish = () => import('../../components/manager/test/finish/MainPage');

export default [
    {
        path: '/m',
        name: 'Manager',
        component: Manager
    },
    {
        path: '/m/completed',
        name: 'CompletedTests',
        component: CompletedTests
    },
    {
        path: 'm/test/:id/results',
        name: 'TestResults',
        component: TestResults
    },
    {
        path: '/m/constructor/list',
        name: 'QuizList',
        component: QuizList
    },
    {
        path: '/m/constructor/:id',
        name: 'Constructor',
        component: Constructor
    },
    {
        path: '/m/test/:id/quiz',
        name: 'QuizSelection',
        component: QuizSelection
    },
    {
        path: '/m/test/:id/participants',
        name: 'Participants',
        component: TestParticipants
    },
    {
        path: '/m/test/:id/appeal',
        name: 'CommonInformation',
        component: CommonInformation
    },
    {
        path: '/m/test/:id/participants/page',
        name: 'ParticipantsPage',
        component: ParticipantsPage
    },
    {
        path: '/m/test/:id/finish',
        name: 'Finish',
        component: Finish
    }
];
