import { AxiosResponse } from "axios";
import request from "../utils/request";
import qs from "qs";
export const baseURL = "http://www.zhonghanlogistics.cn:8903";
// export const baseURL = "http://localhost:8903"

const filterRes = (res: AxiosResponse<any, any>) => res.status === 200 && res.data

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
      name
    }
  }).then(filterRes);
}

export const apiSaveBaseInfo = (params: Record<string, string>) => {
  return request({
    url: `${baseURL}/v1/set/info`,
    method: "post",
    data: qs.stringify(params),
  }).then(filterRes);
}

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
}
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
}
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
}
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
}
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
}
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
}
export const apiAddTrack = (params: Record<string, string>) => {
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
