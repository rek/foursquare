export const getCell = (extras = {}) => {
  return {
    isOn: false,
    player: true,

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
