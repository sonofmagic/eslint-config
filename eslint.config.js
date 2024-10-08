// eslint-disable-next-line antfu/no-import-dist
import { icebreaker } from './packages/icebreaker/dist/index.js'

export default icebreaker(
  {
    vue: true,
    ignores: ['**/fixtures/**'],
  },
)
