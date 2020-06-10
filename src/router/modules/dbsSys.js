/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/dbsSys',
  component: Layout,
  redirect: 'noRedirect',
  name: 'DbsSys',
  meta: {
    title: 'DbsSys',
    icon: 'chart'
  },
  children: [
    {
      path: 'building',
      component: () => import('@/views/dbsSys/building/buildingManage'),
      name: 'BuildingManage',
      meta: { title: 'buildingManage', noCache: true }
    },
    {
      path: 'building/add',
      component: () => import('@/views/dbsSys/building/addBuilding'),
      name: 'BuildingAdd',
      meta: { title: 'BuildingAdd', noCache: true }
    },
    {
      path: 'phase',
      component: () => import('@/views/dbsSys/phase/phaseManage'),
      name: 'PhaseManage',
      meta: { title: 'PhaseManage', noCache: true }
    },
    {
      path: 'phase/add',
      component: () => import('@/views/dbsSys/phase/addPhase'),
      name: 'PhaseAdd',
      meta: { title: 'PhaseAdd', noCache: true }
    }
  ]
}

export default chartsRouter
