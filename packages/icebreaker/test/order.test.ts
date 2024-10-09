import { icebreaker, icebreakerLegacy } from '@/index'
import { ESLint } from 'eslint'
import { every, some } from 'lodash-es'

const importCase0 = `import Vue from 'vue'

import '@/plugins/vue/element-ui'
import '@assets/css/element-style.scss'

import '@/plugins/unocss.platform'
import App from './App.vue'

new Vue({
  render: h => h(App),
}).$mount('#app')
`

const importCase1 = `import '@/plugins/vue/element-ui'
import '@assets/css/element-style.scss'
import '@/plugins/unocss.platform'
import Vue from 'vue'
import App from './App.vue'
import http from '@/plugins/http'
import router from '@/plugins/router-php'

Vue.prototype.$http = http
Vue.prototype.$router = router
new Vue({
  render: h => h(App),
}).$mount('#app')
`

const importCase2 = `import Vue from 'vue'
import App from './App.vue'
import { pinia } from '@/plugins'

import '@/plugins/vue/element-ui'
import '@assets/css/element-style.scss'

import '@/plugins/unocss.platform'

import Directives from '@/plugins/Directives'

Vue.use(Directives)

new Vue({
  pinia,
  render: h => h(App),
}).$mount('#app')
`

const importCase3 = `import '@/plugins/vue/element-ui'
import '@assets/css/element-style.scss'
import '@/plugins/unocss.platform'
import Vue from 'vue'
import App from './App.vue'
// 所有 plugins 请按需引入
import Directives from '@/plugins/Directives'
Vue.use(Directives)
import currency from '@/plugins/currency'
Vue.prototype['$currency'] = currency
import global from '@/plugins/global'
Vue.prototype['$global'] = global
import router from '@/plugins/router-php'
Vue.prototype['$router'] = router
import dayjs from 'dayjs'
Vue.prototype['$dayjs'] = dayjs
import http from '@/plugins/http'
Vue.prototype['$http'] = http

new Vue({
  render: h => h(App),
}).$mount('#app')
`

describe('order', () => {
  let eslint: ESLint
  let legacyEslint: ESLint
  // 初始化 ESLint 实例，加载你的配置
  beforeEach(async () => {
    eslint = new ESLint({
      overrideConfig: await icebreaker(),
    })

    legacyEslint = new ESLint({
      overrideConfig: await icebreakerLegacy(),
    })
  })

  it('import order 0', async () => {
    const res = await eslint.lintText(importCase0)
    expect(res.length).toBe(1)
    expect(res[0].errorCount === 1).toBe(true)
    expect(res[0].messages.findIndex(x => x.ruleId === 'perfectionist/sort-imports') > -1).toBe(true)
  })

  it('import order 0 legacy', async () => {
    const res = await legacyEslint.lintText(importCase0)
    expect(res.length).toBe(1)
    expect(res[0].errorCount).toBe(0)
    expect(res[0].messages.findIndex(x => x.ruleId === 'perfectionist/sort-imports') > -1).toBe(false)
  })

  it('import order 1', async () => {
    const res = await eslint.lintText(importCase1)
    expect(res.length).toBe(1)
    expect(res[0].errorCount === 2).toBe(true)
    expect(every(res[0].messages, (x) => {
      return x.ruleId === 'perfectionist/sort-imports'
    })).toBe(true)
  })

  it('import order 1 legacy', async () => {
    const res = await legacyEslint.lintText(importCase1)
    expect(res.length).toBe(1)
    expect(res[0].errorCount).toBe(0)
    expect(res[0].messages.findIndex(x => x.ruleId === 'perfectionist/sort-imports') > -1).toBe(false)
  })

  it('import order 2', async () => {
    const res = await eslint.lintText(importCase2)
    expect(res.length).toBe(1)
    expect(res[0].errorCount === 2).toBe(true)
    expect(every(res[0].messages, (x) => {
      return x.ruleId === 'perfectionist/sort-imports'
    })).toBe(true)
  })

  it('import order 2 legacy', async () => {
    const res = await legacyEslint.lintText(importCase2)
    expect(res.length).toBe(1)
    expect(res[0].errorCount).toBe(0)
    expect(res[0].messages.findIndex(x => x.ruleId === 'perfectionist/sort-imports') > -1).toBe(false)
  })

  it('import order 3', async () => {
    const res = await eslint.lintText(importCase3)
    expect(res.length).toBe(1)
    expect(res[0].errorCount === 17).toBe(true)
    expect(some(res[0].messages, (x) => {
      return x.ruleId === 'perfectionist/sort-imports'
    })).toBe(true)
    expect(some(res[0].messages, (x) => {
      return x.ruleId === 'import/first'
    })).toBe(true)
  })

  it('import order 3 legacy', async () => {
    const res = await legacyEslint.lintText(importCase3)
    expect(res.length).toBe(1)
    expect(res[0].errorCount).toBe(16)
    expect(res[0].messages.findIndex(x => x.ruleId === 'perfectionist/sort-imports') > -1).toBe(false)
    expect(some(res[0].messages, (x) => {
      return x.ruleId === 'import/first'
    })).toBe(true)
  })
})
