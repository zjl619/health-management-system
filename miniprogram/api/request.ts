import { BASE_URL } from '../config/api';

interface ApiResponse<T = any> {
  code: number;
  data?: T;
  msg?: string;
}

/** 通用请求封装 */
function request<T>(method: 'GET' | 'POST' | 'DELETE', path: string, data?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${path}`,
      method,
      data,
      header: { 'content-type': 'application/json' },
      success(res) {
        const body = res.data as ApiResponse<T>;
        if (body.code === 0) {
          resolve(body.data as T);
        } else {
          reject(new Error(body.msg || '请求失败'));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络错误'));
      },
    });
  });
}

export function get<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export function post<T>(path: string, data: any): Promise<T> {
  return request<T>('POST', path, data);
}

export function del<T>(path: string): Promise<T> {
  return request<T>('DELETE', path);
}
