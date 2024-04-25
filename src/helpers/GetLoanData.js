import { ref } from 'vue'

export default function getLoanData (url) {
  const loanDataError = ref(null)
  const loanData = ref([])

  async function load () {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        throw Error('Unable to get loan data from data source')
      }
      loanData.value = await res.json()
    } catch (err) {
      loanDataError.value = err.message
    }
  }
  load()

  return loanData
}
