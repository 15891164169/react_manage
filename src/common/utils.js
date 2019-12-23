// 函数节流
export const throttle = function (fn, delay = 1000) {
  let start = 0
  return function () {
    const current = Date.now()
    if (current - start > delay) {
      fn.apply(this, arguments)
      start = current
    }
  }
}

// 函数防抖
export const debounce = (fn, delay = 1000) => {
  return function (...args) {
    // const args = arguments // arguments的2种方式
    if (fn.timeoutId) clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => {
      fn.apply(this, args)
      delete fn.timeoutId
    }, delay)
  }
}
