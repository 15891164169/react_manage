export default {
  leftNav: {
    setItem(data) {
      window.sessionStorage.setItem('left_nav_collapsed', JSON.stringify(data))
    },
    getItem() {
      return JSON.parse(window.sessionStorage.getItem('left_nav_collapsed') || 'false')
    },
    removeItem() {
      window.sessionStorage.removeItem('left_nav_collapsed')
    }
  },
  user: {
    setItem(userinfo) {
      window.sessionStorage.setItem('user_info', JSON.stringify(userinfo))
    },
    getItem() {
      return JSON.parse(window.sessionStorage.getItem('user_info') || '{}')
    },
    removeItem() {
      window.sessionStorage.removeItem('user_info')
    }
  }
}
