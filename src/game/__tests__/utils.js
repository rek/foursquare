export const getCell = () => {
  return {
    isOn: false,
    player: true,

    isTop: false,
    isBottom: false,
  }
}

describe('Utils', function() {
  test('getCell', function() {
    expect(getCell()).toBeTruthy()
  })
})
