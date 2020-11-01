// 对token进行存储，在登录的时候自动存储，在退出登录的时候自动移除
const KEY = 'hmmm_token'

const saveToken = token => {
    localStorage.setItem(KEY, token)
}

const getToken = () => {
    return localStorage.getItem(KEY)
}

const removeToken = () => {
    localStorage.removeItem(KEY)
}
export { saveToken, getToken, removeToken }