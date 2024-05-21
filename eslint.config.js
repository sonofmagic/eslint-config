import { icebreaker } from './packages/icebreaker/dist/index.mjs'

export default icebreaker({}, {
  ignores: ['**/fixtures/**'],
})

// export default icebreaker({
//   prettier: true,
//   stylistic: false,
// })
