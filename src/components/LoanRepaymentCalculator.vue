<script setup>
import { ref, watchEffect } from 'vue'
import getLoanPurposes from '../helpers/GetLoanPurposes'
import getRepaymentPeriods from '../helpers/GetRepaymentPeriods'
import getTermMonths from '../helpers/GetTermMonths'

const error = ref([null])
const pv = ref(null)
const rate = ref(null)
const period = ref(null)
const term = ref(null)
const nper = ref(null)

const { loanPurposes, loanPurposesError } = getLoanPurposes()
const { repaymentPeriods, repaymentPeriodsError } = getRepaymentPeriods()
const { termMonths, termMonthsError } = getTermMonths()

if (loanPurposesError) error.value.push(loanPurposesError)
if (repaymentPeriodsError) error.value.push(repaymentPeriodsError)
if (termMonthsError) error.value.push(termMonthsError)

watchEffect(() => {
  nper.value = ref(period.value / 12 * term.value)
})

</script>

<template>
  <h2>Loan Repayment Calculator</h2>

  <form>
    <label>I need $</label>
    <input
      v-model="pv"
      type="text"
      pattern="[0-9]"
    >

    <label>for</label>
    <select v-model="rate">
      <option
        v-for="loanPurpose in loanPurposes"
        :key="loanPurpose.value"
        :value="loanPurpose.annualRate"
      >
        {{ loanPurpose.label }}
      </option>
    </select>

    <label>repaid</label>
    <select v-model="period">
      <option
        v-for="repaymentPeriod in repaymentPeriods"
        :key="repaymentPeriod.value"
        :value="repaymentPeriod.value"
      >
        {{ repaymentPeriod.label }}
      </option>
    </select>

    <label>over</label>
    <select v-model="term">
      <option
        v-for="termMonth in termMonths"
        :key="termMonth.value"
        :value="termMonth.value"
      >
        {{ termMonth.label }}
      </option>
    </select>
  </form>

  User's principal is: ${{ pv }}
  User's annual rate is {{ rate }}
  User's period is {{ period }}
  User's term in months is {{ term }}
  User's number of payments is {{ nper }}

  <!-- <ul v-if="error.length">
    <li
      v-for="item in error"
      :key="item"
    >
      Error: ** {{ item }} **
    </li>
  </ul> -->
</template>