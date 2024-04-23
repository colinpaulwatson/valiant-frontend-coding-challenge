import { ref } from 'vue'

export default function getTermMonths () {
  const termMonthsError = ref(null)
  const termMonths = ref([])

  async function load () {
    try {
      const res = await fetch('http://localhost:5000/requested-term-months')
      if (!res.ok) {
        throw Error('Unable to get term months from data source')
      }
      termMonths.value = await res.json()
    } catch (err) {
      termMonthsError.value = err.message
    }
  }
  load()

  return { termMonths, termMonthsError }
}
