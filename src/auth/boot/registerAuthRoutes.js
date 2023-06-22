import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
  router.addRoute('/', {
    name: 'auth.register',
    path: '/register',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/IdentityPasswordRegisterPage.vue')
  })

  router.addRoute('/', {
    name: 'auth.login',
    path: '/login',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/IdentityPasswordLoginPage.vue')
  })

  router.addRoute('/', {
    name: 'auth.requestPasswordReset',
    path: '/forgot-password',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/PasswordResetRequestViaEmailPage.vue')
  })

  router.addRoute('/', {
    name: 'auth.resetPassword',
    path: '/password-reset',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/PasswordResetViaEmailPage.vue')
  })

  router.addRoute('/', {
    path: '/',
    component: () => import('layouts/AuthenticatedLayout.vue'),
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('src/pages/CorePage.vue'),
        meta: { authOnly: true }
      },
      {
        path: '/goals',
        name: 'goals',
        component: () => import('src/pages/GoalsPage.vue'),
        meta: { authOnly: true }
      },
      {
        path: '/tasks',
        name: 'tasks',
        component: () => import('src/pages/TasksPage.vue'),
        meta: { authOnly: true }
      },
      {
        path: '/routines',
        name: 'routines',
        component: () => import('src/pages/RoutinesPage.vue'),
        meta: { authOnly: true }
      },
      {
        path: '/help',
        name: 'help',
        component: () => import('src/pages/HelpPage.vue'),
        meta: { authOnly: true }
      }
    ]
  })
})
