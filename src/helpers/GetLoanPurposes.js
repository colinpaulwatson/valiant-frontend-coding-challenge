import { ref } from 'vue'

export default function getLoanPurposes () {
  const loanPurposesError = ref(null)
  const loanPurposes = ref([])

  async function load () {
    try {
      const res = await fetch('http://localhost:5000/loan-purposes')
      if (!res.ok) {
        throw Error('Unable to get loan purposes from data source')
      }
      loanPurposes.value = await res.json()
    } catch (err) {
      loanPurposesError.value = err.message
    }
  }
  load()

  return { loanPurposes, loanPurposesError }
}
