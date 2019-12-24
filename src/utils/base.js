export function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
// let base = '';
// let file = '';
// if (process.env.NODE_ENV == 'development') {
// 	base = 'http://192.168.10.185:8885/platform-face';
// 	file = 'http://192.168.10.185:8885/platform-face'
// } else {
// 	base = 'http://192.168.10.185:8885/platform-face';
// 	file = 'http://192.168.10.185:8885/platform-face'
// 	// base = 'http://192.168.10.182:8885/platform-face';
// 	// file = 'http://192.168.10.182:8885/platform-face'
// }
// export const baseURL = base
// export const fileUrl = file
// export const  baseURL='http://192.168.10.182:8885/platform-face';
// export const fileUrl='http://192.168.10.182:8885/platform-face';
// export const baseURL = 'http://47.111.169.108:8880/platform-face';
// export const fileUrl = 'http://47.111.169.108:8880/platform-face'
// export const  baseURL='http://192.168.10.117:8885/platform-face';
// export const fileUrl='http://192.168.10.117:8885/platform-face'
export const  baseURL='http://localhost:8885/platform-face';
export const fileUrl='http://localhost:8885/platform-face'
