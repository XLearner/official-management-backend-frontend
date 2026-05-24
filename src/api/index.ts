import { AxiosResponse } from "axios";
import request from "../utils/request";
import qs from "qs";
// export const baseURL = "http://www.zhonghanlogistics.cn:8903";
export const baseURL = "http://localhost:8903";

const filterRes = (res: AxiosResponse<any, any>) =>
  res.status === 200 && res.data;

export const checkLogin = () => {
  return request({
    url: `${baseURL}/v1/check`,
    method: "post",
  }).then(filterRes);
};

export const apiLogin = (params: { account: string; password: string }) => {
  return request({
    url: `${baseURL}/v1/login`,
    method: "post",
    data: qs.stringify({
      account: params.account,
      pwd: params.password,
    }),
  }).then(filterRes);
};

export const apiLogout = () => {
  return request({
    url: `${baseURL}/v1/logout`,
    method: "post",
  }).then(filterRes);
};

export const apiGetBaseInfo = (name: string) => {
  return request({
    url: `${baseURL}/v1/get/info`,
    method: "get",
    params: {
      name,
    },
  }).then(filterRes);
};

export const apiSaveBaseInfo = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/info`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

export const apiGetBanner = () => {
  return request({
    url: `${baseURL}/v1/get/banner`,
    method: "get",
  }).then(filterRes);
};

export const apiSaveBanner = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/save/banner`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

export const apiDeleteBanner = (params: { id: string }) => {
  return request({
    url: `${baseURL}/v1/delete/banner`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 亮点业务
export const apiGetHighlightBusi = () => {
  return request({
    url: `${baseURL}/v1/get/business`,
    method: "get",
  }).then(filterRes);
};
export const apiAddHighlightBusi = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/add/business`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetHighlightBusi = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/business`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteHighlightBusi = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/business`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 合作客户
export const apiGetCustom = () => {
  return request({
    url: `${baseURL}/v1/get/custom`,
    method: "get",
  }).then(filterRes);
};
export const apiAddCustom = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/add/custom`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetCustom = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/custom`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteCustom = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/custom`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 优势内容
export const apiGetAdvantage = () => {
  return request({
    url: `${baseURL}/v1/get/advantage`,
    method: "get",
  }).then(filterRes);
};
export const apiAddAdvantage = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/add/advantage`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetAdvantage = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/advantage`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteAdvantage = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/advantage`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 相关服务
export const apiGetRelative = () => {
  return request({
    url: `${baseURL}/v1/get/relativeService`,
    method: "get",
  }).then(filterRes);
};
export const apiAddRelative = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/add/relativeService`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetRelative = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/relativeService`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteRelative = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/relativeService`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 新闻动态
export const apiGetNews = () => {
  return request({
    url: `${baseURL}/v1/get/news`,
    method: "get",
  }).then(filterRes);
};
export const apiAddNews = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/add/news`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetNews = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/news`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteNews = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/news`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 招聘信息
export const apiGetRecruit = () => {
  return request({
    url: `${baseURL}/v1/get/recruit`,
    method: "get",
  }).then(filterRes);
};
export const apiAddRecruit = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/add/recruit`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetRecruit = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/recruit`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteRecruit = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/recruit`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 轨迹信息
export const apiGetTrack = () => {
  return request({
    url: `${baseURL}/v1/get/track`,
    method: "get",
  }).then(filterRes);
};
export const apiAddTrack = (params: any) => {
  return request({
    url: `${baseURL}/v1/add/track`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetTrack = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/track`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteTrack = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/track`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 订单信息
export const apiGenerateOrderId = () => {
  return request({
    url: `${baseURL}/v1/generate/orderId`,
    method: "get",
  }).then(filterRes);
};
export const apiGetOrder = (id?: string) => {
  return request({
    url: `${baseURL}/v1/get/order`,
    method: "get",
    params: { id: id },
  }).then(filterRes);
};
export const apiAddOrder = (params: any) => {
  return request({
    url: `${baseURL}/v1/add/order`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetOrder = (params: any) => {
  return request({
    url: `${baseURL}/v1/set/order`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteOrder = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/order`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiGetOrders = () => {
  return request({
    url: `${baseURL}/v1/get/order`,
    method: "get",
  }).then(filterRes);
};

// 货物信息
export const apiGetGoods = (orderId: string) => {
  return request({
    url: `${baseURL}/v1/get/goods`,
    method: "get",
    params: { orderId },
  }).then(filterRes);
};
export const apiAddGoods = (params: any) => {
  return request({
    url: `${baseURL}/v1/add/goods`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetGoods = (params: any) => {
  return request({
    url: `${baseURL}/v1/set/goods`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteGoods = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/goods`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 用户信息
export const apiGetUsers = (id?: string) => {
  return request({
    url: `${baseURL}/v1/get/users`,
    method: "get",
    params: { id: id },
  }).then(filterRes);
};
export const apiAddUser = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/add/user`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiSetUser = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/user`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};
export const apiDeleteUser = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/delete/user`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
};

// 菜单数据
export const apiGetNav = (name: string) => {
  return request({
    url: `${baseURL}/v1/get/nav`,
    method: "get",
    params: { name },
  }).then(filterRes);
}

// 账单导出
export const apiExportBill = (orderIds: string[]) => {
  return request({
    url: `${baseURL}/v1/bill/export`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: { orderIds },
    responseType: "arraybuffer",
  }).then((res: AxiosResponse) => {
    if (res.status === 200) {
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `账单_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { code: 0, msg: "导出成功" };
    }
    return { code: -1, msg: "导出失败" };
  });
}

// 面单生成
export const apiGenerateWaybill = (orderId: string, goodsIndices?: number[], watermark?: boolean) => {
  return request({
    url: `${baseURL}/v1/waybill/generate`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: { orderId, goodsIndices, watermark },
  }).then(filterRes);
}

// 客户管理
export const apiGetCustomers = (keyword?: string, page?: number, pageSize?: number) => {
  return request({
    url: `${baseURL}/v1/get/customer`,
    method: "get",
    params: { keyword, page, pageSize },
  }).then(filterRes);
};
export const apiGetCustomer = (id: string) => {
  return request({
    url: `${baseURL}/v1/customer`,
    method: "get",
    params: { id },
  }).then(filterRes);
};
export const apiAddCustomer = (params: Record<string, any>) => {
  return request({
    url: `${baseURL}/v1/customer`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: params,
  }).then(filterRes);
};
export const apiSetCustomer = (params: Record<string, any>) => {
  return request({
    url: `${baseURL}/v1/customer`,
    method: "put",
    headers: { "Content-Type": "application/json" },
    data: params,
  }).then(filterRes);
};
export const apiDeleteCustomer = (params: { id: string }) => {
  return request({
    url: `${baseURL}/v1/customer`,
    method: "delete",
    headers: { "Content-Type": "application/json" },
    data: params,
  }).then(filterRes);
}

// 角色管理
export const apiGetRoles = () => {
  return request({
    url: `${baseURL}/v1/get/role`,
    method: "get",
  }).then(filterRes);
};
export const apiAddRole = (params: { name: string; keys: string[]; remark?: string }) => {
  return request({
    url: `${baseURL}/v1/role`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: params,
  }).then(filterRes);
};
export const apiSetRole = (params: { id: number; name: string; keys: string[]; remark?: string }) => {
  return request({
    url: `${baseURL}/v1/role`,
    method: "put",
    headers: { "Content-Type": "application/json" },
    data: params,
  }).then(filterRes);
};
export const apiDeleteRole = (params: { id: number }) => {
  return request({
    url: `${baseURL}/v1/role`,
    method: "delete",
    headers: { "Content-Type": "application/json" },
    data: params,
  }).then(filterRes);
};