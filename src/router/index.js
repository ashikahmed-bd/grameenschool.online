import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'text-primary',
  linkExactActiveClass: '',

  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/login.vue'),
      meta: {
        title: 'Login',
        auth: false,
      },
    },

    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('../views/auth/forgot.vue'),
      meta: {
        title: 'Forgot',
        auth: false,
      },
    },

    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue'),
      meta: {
        title: 'Dashboard',
        auth: true,
      },
    },

    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/courses/index.vue'),
      meta: {
        title: 'Courses',
        auth: true,
      },
    },
    {
      path: '/course/create',
      name: 'course.create',
      component: () => import('../views/courses/create.vue'),
      meta: {
        title: 'Create',
        auth: true,
      },
    },

    {
      path: '/course/:id/basic',
      name: 'course.basic',
      component: () => import('../views/courses/basic.vue'),
      meta: {
        title: 'Basic Information',
        auth: true,
      },
    },

    {
      path: '/course/:id/targets',
      name: 'course.targets',
      component: () => import('../views/courses/targets.vue'),
      meta: {
        title: 'Course Targets',
        auth: true,
      },
    },

    {
      path: '/course/:id/curriculum',
      name: 'course.curriculum',
      component: () => import('../views/courses/curriculum.vue'),
      meta: {
        title: 'Course Curriculum',
        auth: true,
      },
    },

    {
      path: '/course/:id/pricing',
      name: 'course.pricing',
      component: () => import('../views/courses/pricing.vue'),
      meta: {
        title: 'Course Pricing',
        auth: true,
      },
    },

    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/collections/index.vue'),
      meta: {
        title: 'Collections',
        auth: true,
      },
    },

    {
      path: '/collection/create',
      name: 'collection.create',
      component: () => import('../views/collections/create.vue'),
      meta: {
        title: 'Collections Create',
        auth: true,
      },
    },

    {
      path: '/collection/:id',
      name: 'collection.edit',
      component: () => import('../views/collections/update.vue'),
      meta: {
        title: 'Collections Update',
        auth: true,
      },
    },

    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/categories/index.vue'),
      meta: {
        title: 'Categories',
        auth: true,
      },
    },
    {
      path: '/categories/create',
      name: 'categories.create',
      component: () => import('../views/categories/create.vue'),
      meta: {
        title: 'Create Categories',
        auth: true,
      },
    },

    {
      path: '/categories/:id',
      name: 'categories.edit',
      component: () => import('../views/categories/update.vue'),
      meta: {
        title: 'Update Categories',
        auth: true,
      },
    },

    {
      path: '/meets',
      name: 'meets',
      component: () => import('../views/meets/index.vue'),
      meta: {
        title: 'Live Classes',
        auth: true,
      },
    },

    {
      path: '/google/callback',
      name: 'google.callback',
      component: () => import('../views/google/callback.vue'),
      meta: {
        title: 'Google Callback',
        auth: true,
      },
    },

    {
      path: '/notices',
      name: 'notices',
      component: () => import('../views/notices/index.vue'),
      meta: {
        title: 'All Notices',
        auth: true,
      },
    },
    {
      path: '/notices/create',
      name: 'notices.create',
      component: () => import('../views/notices/create.vue'),
      meta: {
        title: 'Notice create',
        auth: true,
      },
    },

    {
      path: '/payouts',
      name: 'payouts',
      component: () => import('../views/payouts/index.vue'),
      meta: {
        title: 'Payouts',
        auth: true,
      },
    },

    {
      path: '/payouts/:id/update',
      name: 'payouts.update',
      component: () => import('../views/payouts/update.vue'),
      meta: {
        title: 'Payout Update',
        auth: true,
      },
    },

    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/index.vue'),
      meta: {
        title: 'Orders',
        auth: true,
      },
    },

    {
      path: '/orders/:id',
      name: 'orders.view',
      component: () => import('../views/orders/view.vue'),
      meta: {
        title: 'Orders Details',
        auth: true,
      },
    },

    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('../views/reviews/index.vue'),
      meta: {
        title: 'Reviews',
        auth: true,
      },
    },

    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/index.vue'),
      meta: {
        title: 'Users List',
        auth: true,
      },
    },

    {
      path: '/users/create',
      name: 'users.create',
      component: () => import('../views/users/create.vue'),
      meta: {
        title: 'Create Users',
        auth: true,
      },
    },

    {
      path: '/users/:id/edit',
      name: 'users.edit',
      component: () => import('../views/users/update.vue'),
      meta: {
        title: 'Update Users',
        auth: true,
      },
    },

    {
      path: '/users/:id/view',
      name: 'users.view',
      component: () => import('../views/users/view.vue'),
      meta: {
        title: 'View Users',
        auth: true,
      },
    },

    {
      path: '/users/:id/referral-apply',
      name: 'users.referral_apply',
      component: () => import('../views/users/referral.vue'),
      meta: {
        title: 'Referral Apply',
        auth: true,
      },
    },

    {
      path: '/users/:id/make-instructor',
      name: 'users.make_instructor',
      component: () => import('../views/users/make_instructor.vue'),
      meta: {
        title: 'Make Referral',
        auth: true,
      },
    },

    // benefits route
    {
      path: '/benefits',
      name: 'benefits',
      component: () => import('../views/benefits/index.vue'),
      meta: {
        title: 'Benefits',
        auth: true,
      },
    },

    {
      path: '/benefit/create',
      name: 'benefit.create',
      component: () => import('../views/benefits/create.vue'),
      meta: {
        title: 'Add Benefit',
        auth: true,
      },
    },

    {
      path: '/benefit/:id/edit',
      name: 'benefit.edit',
      component: () => import('../views/benefits/update.vue'),
      meta: {
        title: 'Update Benefit',
        auth: true,
      },
    },

    // contacts route
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/contacts/index.vue'),
      meta: {
        title: 'Contacts',
        auth: true,
      },
    },

    {
      path: '/contact/:id/view',
      name: 'contact.view',
      component: () => import('../views/contacts/view.vue'),
      meta: {
        title: 'View Contact',
        auth: true,
      },
    },

    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile/index.vue'),
      meta: {
        title: 'Profile',
        auth: true,
      },
    },

    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/index.vue'),
      redirect: '/settings/appearance',
      children: [
        {
          path: 'appearance',
          name: 'SettingsAppearance',
          component: () => import('@/views/settings/appearance.vue'),
          meta: {
            title: 'Appearance',
            auth: true,
          },
        },
        {
          path: 'contact',
          name: 'SettingsContact',
          component: () => import('@/views/settings/contact.vue'),
          meta: {
            title: 'Contact',
            auth: true,
          },
        },
        {
          path: 'seo',
          name: 'SettingsSeo',
          component: () => import('@/views/settings/seo.vue'),
          meta: {
            title: 'SEO',
            auth: true,
          },
        },
        {
          path: 'payment',
          name: 'SettingsPayment',
          component: () => import('@/views/settings/payment.vue'),
          meta: {
            title: 'Payment Configuration',
            auth: true,
          },
        },
        {
          path: 'sms',
          name: 'SettingsSms',
          component: () => import('@/views/settings/sms.vue'),
          meta: {
            title: 'SMS Configuration',
            auth: true,
          },
        },
        {
          path: 'backup',
          name: 'SettingsBackup',
          component: () => import('@/views/settings/backup.vue'),
          meta: {
            title: 'System Backup',
            auth: true,
          },
        },
      ],
    },

    {
      path: '/website',
      name: 'website',
      component: () => import('@/views/website/index.vue'),
      redirect: '/website/homepage',
      children: [
        {
          path: 'homepage',
          name: 'WebHomepage',
          component: () => import('@/views/website/homepage.vue'),
          meta: {
            title: 'Home Page',
            auth: true,
          },
        },

        {
          path: 'contact',
          name: 'contactPage',
          component: () => import('@/views/website/contact.vue'),
          meta: {
            title: 'contact Page',
            auth: true,
          },
        },

        {
          path: 'about',
          name: 'aboutPage',
          component: () => import('@/views/website/about.vue'),
          meta: {
            title: 'about Page',
            auth: true,
          },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  document.title = to.meta.title + ' - Grameen School' || 'Not Found!'
  if (to.meta.auth && !authStore.loggedIn) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
