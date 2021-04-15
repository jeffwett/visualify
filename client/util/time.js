
export function  formatTime(ms) {
    const seconds = Math.trunc(ms / 1000)
    const seconds_p = (seconds % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })
    const min_p = Math.trunc(seconds / 60)
    return min_p + ":" + seconds_p
  }
