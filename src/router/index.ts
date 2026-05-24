import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { usePermissStore } from "../store/permiss";
import Home from "../views/home.vue";
import { checkLogin, apiGetUsers, apiGetRoles } from "../api";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
          permiss: "1",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
      },
      {
        path: "/base-info",
        name: "baseinfo",
        meta: {
          title: "公司信息",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "baseinfo" */ "../views/baseInfo.vue"),
      },
      {
        path: "/advantage",
        name: "advantage",
        meta: {
          title: "优势内容",
          permiss: "8",
        },
        component: () =>
          import(
            /* webpackChunkName: "advantage" */ "../views/advantage/index.vue"
          ),
      },
      {
        path: "/banner",
        name: "banner",
        meta: {
          title: "banner设置",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "banner" */ "../views/banner/index.vue"),
      },
      {
        path: "/customs",
        name: "customs",
        meta: {
          title: "合作客户",
          permiss: "8",
        },
        component: () =>
          import(
            /* webpackChunkName: "customs" */ "../views/customs/index.vue"
          ),
      },
      {
        path: "/services",
        name: "services",
        meta: {
          title: "产品服务",
          permiss: "8",
        },
        component: () =>
          import(
            /* webpackChunkName: "service" */ "../views/service/index.vue"
          ),
      },
      {
        path: "/news",
        name: "news",
        meta: {
          title: "新闻动态",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "news" */ "../views/news/index.vue"),
      },
      {
        path: "/recruit",
        name: "recruit",
        meta: {
          title: "招聘内容设置",
          permiss: "8",
        },
        component: () =>
          import(
            /* webpackChunkName: "recruit" */ "../views/recruit/recruit.vue"
          ),
      },
      {
        path: "/table",
        name: "basetable",
        meta: {
          title: "表格",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/table.vue"),
      },
      {
        path: "/charts",
        name: "basecharts",
        meta: {
          title: "图表",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "charts" */ "../views/charts.vue"),
      },
      {
        path: "/form",
        name: "baseform",
        meta: {
          title: "表单",
          permiss: "5",
        },
        component: () =>
          import(/* webpackChunkName: "form" */ "../views/form.vue"),
      },
      {
        path: "/tabs",
        name: "tabs",
        meta: {
          title: "tab标签",
          permiss: "3",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/tabs.vue"),
      },
      {
        path: "/donate",
        name: "donate",
        meta: {
          title: "鼓励作者",
          permiss: "14",
        },
        component: () =>
          import(/* webpackChunkName: "donate" */ "../views/donate.vue"),
      },
      {
        path: "/usermanage",
        name: "usermanage",
        meta: {
          title: "用户管理",
          permiss: "13",
        },
        component: () =>
          import(
            /* webpackChunkName: "usermanage" */ "../views/user/index.vue"
          ),
      },
      {
        path: "/permission",
        name: "permission",
        meta: {
          title: "权限管理",
          permiss: "13",
        },
        component: () =>
          import(
            /* webpackChunkName: "permission" */ "../views/permission/index.vue"
          ),
      },
      {
        path: "/upload",
        name: "upload",
        meta: {
          title: "上传插件",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "upload" */ "../views/upload.vue"),
      },
      {
        path: "/icon",
        name: "icon",
        meta: {
          title: "自定义图标",
          permiss: "10",
        },
        component: () =>
          import(/* webpackChunkName: "icon" */ "../views/icon.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "个人中心",
        },
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user.vue"),
      },
      {
        path: "/editor",
        name: "editor",
        meta: {
          title: "富文本编辑器",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "editor" */ "../views/editor.vue"),
      },
      {
        path: "/markdown",
        name: "markdown",
        meta: {
          title: "markdown编辑器",
          permiss: "9",
        },
        component: () =>
          import(/* webpackChunkName: "markdown" */ "../views/markdown.vue"),
      },
      {
        path: "/export",
        name: "export",
        meta: {
          title: "导出Excel",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "export" */ "../views/export.vue"),
      },
      {
        path: "/import",
        name: "import",
        meta: {
          title: "导入Excel",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "import" */ "../views/import.vue"),
      },
      {
        path: "/order",
        name: "order",
        meta: {
          title: "订单管理",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "order" */ "../views/order/index.vue"),
      },
      {
        path: "/customer",
        name: "customer",
        meta: {
          title: "客户管理",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "customer" */ "../views/customer/index.vue"),
      },
      {
        path: "/order-detail",
        name: "orderDetail",
        meta: {
          title: "订单详情",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "orderDetail" */ "../views/order/orderDetail.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
  },
  {
    path: "/403",
    name: "403",
    meta: {
      title: "没有权限",
    },
    component: () => import(/* webpackChunkName: "403" */ "../views/403.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  const role = localStorage.getItem("ms_username");
  const permiss = usePermissStore();
  const status = await checkLogin();

  if (!to.path.includes("login") && status.code === -10001) {
    next("/login");
    return;
  }

  // 已登录用户：从后端加载权限 keys 到 store
  if (!to.path.includes("login") && status.code >= 0) {
    try {
      const [usersRes, rolesRes]: any[] = await Promise.all([
        apiGetUsers(),
        apiGetRoles(),
      ]);

      const user = (usersRes?.data || []).find((u: any) => u.account === role);
      const roleData = user?.role_id
        ? (rolesRes?.data || []).find((r: any) => r.id === user.role_id)
        : null;

      let keys: string[] = [];
      if (roleData) {
        try { keys = JSON.parse(roleData.keys); } catch {}
      }

      // 无角色用户给予最小权限兜底
      if (keys.length === 0) {
        keys = ['1'];
      }

      permiss.handleSet(keys);
      localStorage.setItem('ms_keys', JSON.stringify(keys));
    } catch (err) {
      console.error('路由守卫加载权限失败', err);
    }
  }

  if (!role && to.path !== "/login") {
    next("/login");
  } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
    next("/403");
  } else {
    next();
  }
});

export default router;
