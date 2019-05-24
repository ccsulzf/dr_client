export const NAV_CONFIG = [
    {
        name: '首页',
        selected: false,
        expanded: false,
        path: '/dashboard/home',
        icon: 'fa-home',
        subList: [
        ]
    },
    {
        name: '记账',
        selected: false,
        expanded: false,
        icon: 'fa-pencil-square-o',
        subList: [
            {
                name: '支出',
                path: '/account/expense',
                selected: false
            }, {
                name: '收入',
                path: '/account/income',
                selected: false
            }, {
                name: '转账',
                path: '',
                selected: false
            }, {
                name: '还款',
                path: '',
                selected: false
            }, {
                name: '借款',
                path: '',
                selected: false
            }
        ]
    }, {
        name: '报表',
        selected: false,
        expanded: false,
        icon: 'fa-area-chart',
        subList: [
            {
                name: '支出明细',
                path: '/report/expense-detail',
                selected: false
            }, {
                name: '支出汇总',
                // path: '/account/income',
                selected: false
            }
        ]
    }, {
        name: '设置',
        selected: false,
        expanded: false,
        icon: 'fa-cog',
        subList: [
            {
                name: '预算设置',
                path: '',
                selected: false
            }
        ]
    }
];

