/* eslint-disable style/no-tabs */
import stylelint from 'stylelint'
import { icebreaker } from '@/index'

const incorrectOrder = `
	div {
		background-color: slategray;
		box-sizing: border-box;
		flex: 1 1 auto;
		font-size: 1.5rem;
		grid-gap: 16px;
		order: 1;
		pointer-events: all;
		position: relative;
		transition: opacity 300ms ease;
		width: 320px;
	}`

const correctOrder = `
	div {
		position: relative;
		box-sizing: border-box;
		flex: 1 1 auto;
		grid-gap: 16px;
		order: 1;
		width: 320px;
		font-size: 1.5rem;
		pointer-events: all;
		background-color: slategray;
		transition: opacity 300ms ease;
	}`
describe('stylelint', () => {
  it('lint', async () => {
    const result = await stylelint.lint({
      config: icebreaker(),
      code: '.a{font-size:10upx;}',
    })

    expect(result.results.length).toBe(1)
    expect(result.results[0].warnings.length).toBe(1)
    expect(result.results[0].warnings[0].rule).toBe('unit-no-unknown')

    const result2 = await stylelint.lint({
      config: icebreaker(),
      code: '.a{font-size:10rpx;}',
    })

    expect(result2.results.length).toBe(1)
    expect(result2.results[0].warnings.length).toBe(0)
  })

  it('incorrectOrder', async () => {
    const result = await stylelint.lint({
      config: icebreaker(),
      code: incorrectOrder,
    })
    expect(result.results.length).toBe(1)
    expect(result.results[0].warnings.length).toBe(5)
    expect(result.results[0].warnings[0].text.trim()).toBe(`Expected "box-sizing" to come before "background-color" (order/properties-order)`)

    // 'Expected "box-sizing" to come before "background-color" (order/properties-order)',
    // 'it indicates a properties-order error',
  })

  it('correctOrder', async () => {
    const result = await stylelint.lint({
      config: icebreaker(),
      code: correctOrder,
    })
    expect(result.results.length).toBe(1)
    expect(result.results[0].warnings.length).toBe(1)
    expect(result.results[0].warnings[0].text.trim()).toBe(`Expected "grid-gap" to be "gap" (property-no-deprecated)`)
  })
})
