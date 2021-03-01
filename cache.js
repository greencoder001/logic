module.exports = {
  ctime: _ => {
    return `${new Date().getDate()}${new Date().getMonth()}${new Date().getHours()}`
  }
}
