<script setup>
import { onUpdated, ref } from 'vue'
import getLoanData from '../helpers/GetLoanData.js'
import PMT from '../utils/PMT.js'

const pv = ref(null)
const rate = ref(null)
const period = ref(null)
const periodLabel = ref(null)
const term = ref(null)
const nper = ref(null)
const payment = ref(null)
const pvError = ref(null)
const totalRepayments = ref(null)

const loanPurposes = getLoanData('http://localhost:5000/loan-purposes')
const repaymentPeriods = getLoanData('http://localhost:5000/requested-repayment-periods')
const termMonths = getLoanData('http://localhost:5000/requested-term-months')

onUpdated(() => {
  if (isNaN(pv.value)) {
    pv.value = null
    payment.value = null
    totalRepayments.value = null
  }
  if ((pv.value !== null) && (pv.value < 1000 || pv.value > 20000000)) {
    pvError.value = '$ amount needs to between 1000 and 20,000,000'
    payment.value = null
    totalRepayments.value = null
  }
  if (pv.value >= 1000 && pv.value <= 20000000) {
    pvError.value = null
  }
  if (pv.value >= 1000 && pv.value <= 20000000 && rate.value && period.value && term.value) {
    pvError.value = null
    nper.value = term.value / 12 * period.value.value
    payment.value = (PMT(rate.value / 12, nper.value, pv.value)).toFixed(2)
    totalRepayments.value = (nper.value * payment.value).toFixed(2)
    periodLabel.value = period.value.label
  }
})
</script>

<template>
  <div class="flex h-screen content-start justify-center bg-slate-100">
    <div class="my-5 max-h-80 max-w-xl rounded-lg bg-white p-6 text-slate-700 shadow ring-1 ring-slate-900/5">
      <div class="flex items-center py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mr-2 size-6 text-cyan-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
          />
        </svg>

        <h2 class="mx-2 text-center text-lg font-semibold text-slate-600">
          Loan Repayment Calculator
        </h2>
      </div>
      <form @submit.prevent="handleCalculatePayment">
        <div class="my-4">
          <label>I need $</label>
          <input
            v-model="pv"
            type="text"
            required
            class="borderfocus:outline-none mx-2 rounded-md border border-slate-300 bg-zinc-100 px-3 py-1 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-100"
          >

          <label>for</label>
          <select
            v-model="rate"
            required
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
            required
            class="borderfocus:outline-none mx-2 rounded-md border border-slate-300 px-3 py-1 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-100"
          >
            <option
              v-for="repaymentPeriod in repaymentPeriods"
              :key="repaymentPeriod.value.label"
              :value="repaymentPeriod"
            >
              {{ repaymentPeriod.label }}
            </option>
          </select>

          <label>over</label>
          <select
            v-model="term"
            required
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

        <div class="mb-3 mt-6 border-t border-slate-200">
          <div class="pt-3 text-xs font-semibold uppercase text-slate-500">
            Your {{ periodLabel }} payment is: <span class="ml-2 text-lg text-cyan-700">$ {{ payment }}</span>
          </div>

          <div class="my-1 text-xs font-semibold uppercase text-slate-500">
            Your total repayments are: <span class="ml-2 text-lg text-cyan-700">$ {{ totalRepayments }}</span>
          </div>
        </div>

        <div
          v-if="pvError"
          class="text-xs text-red-400"
        >
          {{ pvError }}
        </div>
      </form>
    </div>
  </div>
</template>
