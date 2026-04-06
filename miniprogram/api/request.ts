import { BASE_URL, REQUEST_TIMEOUT } from '../config/api';

interface ApiResponse<T = any> {
  code: number;
  data?: T;
  msg?: string;
}

function request<T>(method: 'GET' | 'POST' | 'DELETE', path: string, data?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${path}`,
      method,
      data,
      timeout: REQUEST_TIMEOUT,
      header: { 'content-type': 'application/json' },
      success(res) {
        // HTTP 状态码非 2xx
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const body = res.data as ApiResponse;
          reject(new Error(body.msg || `请求失败(${res.statusCode})`));
          return;
        }
        const body = res.data as ApiResponse<T>;
        if (body.code === 0) {
          resolve(body.data as T);
        } else {
          reject(new Error(body.msg || '请求失败'));
        }
      },
      fail(err) {
        // 区分超时和网络错误
        if (err.errMsg && err.errMsg.indexOf('timeout') !== -1) {
          reject(new Error('请求超时，请检查网络'));
        } else {
          reject(new Error('网络连接失败，请检查后端服务是否启动'));
        }
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
