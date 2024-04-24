<script setup>
import { ref } from 'vue'
import getLoanPurposes from '../helpers/GetLoanPurposes'
import getRepaymentPeriods from '../helpers/GetRepaymentPeriods'
import getTermMonths from '../helpers/GetTermMonths'
import PMT from '../utils/PMT.js'

const error = ref([null])
const pv = ref(null)
const rate = ref(null)
const period = ref(null)
const term = ref(null)
const nper = ref(null)
const payment = ref(null)

const { loanPurposes, loanPurposesError } = getLoanPurposes()
const { repaymentPeriods, repaymentPeriodsError } = getRepaymentPeriods()
const { termMonths, termMonthsError } = getTermMonths()

if (loanPurposesError) error.value.push(loanPurposesError)
if (repaymentPeriodsError) error.value.push(repaymentPeriodsError)
if (termMonthsError) error.value.push(termMonthsError)

function handleCalculatePayment () {
  nper.value = term.value / 12 * period.value
  payment.value = (PMT(rate.value / 12, nper.value, pv.value)).toFixed(2)
}

</script>

<template>
  <div class="flex h-screen content-start justify-center bg-slate-100">
    <div class="my-6 max-h-80 max-w-xl rounded-lg bg-white p-6 text-slate-700 shadow ring-1 ring-slate-900/5">
      <h2 class="pb-4 pt-6 text-center text-lg font-semibold text-slate-800">
        Loan Repayment Calculator
      </h2>

      <form @submit.prevent="handleCalculatePayment">
        <div class="my-4">
          <label>I need $</label>
          <input
            v-model="pv"
            type="text"
            class="borderfocus:outline-none mx-2 rounded-md border border-slate-300 px-3 py-1 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-100"
          >

          <label>for</label>
          <select
            v-model="rate"
            class="borderfocus:outline-none mx-2 rounded-md border border-slate-300 px-3 py-1 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-100"
          >
            <option
              v-for="loanPurpose in loanPurposes"
              :key="loanPurpose.value"
              :value="loanPurpose.annualRate"
            >
              {{ loanPurpose.label }}
            </option>
          </select>
        </div>

        <div class="my-4">
          <label>repaid</label>
          <select
            v-model="period"
            class="borderfocus:outline-none mx-2 rounded-md border border-slate-300 px-3 py-1 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-100"
          >
            <option
              v-for="repaymentPeriod in repaymentPeriods"
              :key="repaymentPeriod.value"
              :value="repaymentPeriod.value"
            >
              {{ repaymentPeriod.label }}
            </option>
          </select>

          <label>over</label>
          <select
            v-model="term"
            class="borderfocus:outline-none mx-2 rounded-md border border-slate-300 px-3 py-1 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-100"
          >
            <option
              v-for="termMonth in termMonths"
              :key="termMonth.value"
              :value="termMonth.value"
            >
              {{ termMonth.label }}
            </option>
          </select>
        </div>

        <div>
          <button>Calculate payment</button>
        </div>
      </form>

      Your payment is: $ {{ payment }}

      <!-- <ul v-if="error.length">
    <li
      v-for="item in error"
      :key="item"
    >
      Error: ** {{ item }} **
    </li>
  </ul> -->
    </div>
  </div>
</template>
