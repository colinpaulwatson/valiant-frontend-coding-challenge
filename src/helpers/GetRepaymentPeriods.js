import { ref } from 'vue'

export default function getRepaymentPeriods () {
  const repaymentPeriodsError = ref(null)
  const repaymentPeriods = ref([])

  async function load () {
    try {
      const res = await fetch('http://localhost:5000/requested-repayment-periods')
      if (!res.ok) {
        throw Error('Unable to get repayment periods from data source')
      }
      repaymentPeriods.value = await res.json()
    } catch (err) {
      repaymentPeriodsError.value = err.message
    }
  }
  load()

  return { repaymentPeriods, repaymentPeriodsError }
}
