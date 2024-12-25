// 保存 JWT 到 localStorage
export function saveToken(token) {
    localStorage.setItem('jwt', token);
}

// 从 localStorage 获取 JWT
export function getToken() {
    return localStorage.getItem('jwt');
}

// 从 localStorage 移除 JWT
export function removeToken() {
    localStorage.removeItem('jwt');
}