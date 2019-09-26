export const getCell = (extras = {}) => {
  return {
    isOn: false,
    player: 0,

    isTop: false,
    isBottom: false,

    ...extras
  }
}

export const getColumn = (extras = {}) => {
  return {
    cells: [],
    ...extras
  }
}

describe('Utils', function() {
  test('getCell', function() {
    expect(getCell()).toBeTruthy()
  })
})
