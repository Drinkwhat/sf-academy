const getDataLength = () => {
  fetch("/pendingData")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("pendingData").innerHTML = data.length
      let seconds = Math.ceil(data.length / 15 * 10)
      let minutes = Math.trunc(seconds / 60)
      seconds %= 60
      const hours = Math.trunc(minutes / 60)
      minutes %= 60
      document.getElementById("time").innerHTML = `${hours}:${minutes}:${seconds}`
    })

  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("processedData").innerHTML = data.length
    })
}

// eslint-disable-next-line no-unused-vars
const main = () => {
  getDataLength()
  setInterval(getDataLength, 10000)
}