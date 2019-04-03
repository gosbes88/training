const NotFound = () => import('common/components/error/404');
const Forbidden = () => import('common/components/error/403');
const Empty = () => import('../../../../common/common.vue/src/components/Empty');
const RouterWrap = () => import('../components/common/RouterWrap');
const InternalServerError = () => import('common/components/error/500');
import manager from './parts/Manager';
import participant from './parts/Participant';

export default [
    {
        path: '/',
        component: RouterWrap,
        children: [
            {
                path: "",
                name: "Training",
                component: Empty,
                meta: {
                    base: 'training'
                }
            },
            ...manager,
            ...participant
        ]
    },
    {
        path: "/403",
        name: "Forbidden",
        component: Forbidden
    },
    {
        path: "/500",
        name: "InternalServerError",
        component: InternalServerError
    },
    {
        path: '*',
        component: NotFound
    }
];
