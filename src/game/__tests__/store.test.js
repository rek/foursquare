import {getCell, getColumn} from './utils'
import {GameStore, GameBoardCell, GameBoardColumn} from '../store'

describe('Store tests', function() {
  describe('GameBoardCell', function() {
    let cell

    beforeEach(function() {
      cell = GameBoardCell.create()
    })

    test('Make move', function() {
      cell.makeMove()

      expect(cell.isOn).toEqual(true)
    })
  })

  describe('GameBoardColumn', function() {
    let column

    beforeEach(function() {
      column = GameBoardColumn.create({
        cells: [getCell(), getCell()]
      })
    })

    test('Get cell', function() {
      expect(column.getCell(0).isOn).toEqual(false)
    })

    test('Add Move', function() {
      expect(column.cells[1].isOn).toEqual(false)
      column.addMove()
      expect(column.cells[1].isOn).toEqual(true)
    })
  })

  describe('Main Game Store', function() {
    let game

    const getInsertionForColumn = (colId) => game.insert(colId)

    beforeEach(function() {
      game = GameStore.create({width: 4, height: 4})
    })

    test('Initial conditions', function() {
      expect(game.turn).toEqual(0)
      expect(game.playing).toEqual(true)
    })

    test('Change turn', function() {
      expect(game.turn).toEqual(0)
      game.changeTurn()
      expect(game.turn).toEqual(1)
      game.changeTurn()
      expect(game.turn).toEqual(2)
      game.changeTurn()
      expect(game.turn).toEqual(0)
    })

    test('simple victory - vertical', function() {
      const insertFirstCol = getInsertionForColumn(0)
      const insertSecondCol = getInsertionForColumn(1)
      const insertThirdCol = getInsertionForColumn(2)

      insertFirstCol()
      insertSecondCol()
      insertThirdCol()
      expect(game.playing).toEqual(true)

      insertFirstCol()
      insertSecondCol()
      insertThirdCol()
      expect(game.playing).toEqual(true)

      insertFirstCol()
      expect(game.playing).toEqual(false)
    })

    test('Restart game', () => {
      const insertFirstCol = getInsertionForColumn(0)

      insertFirstCol()
      insertFirstCol()
      insertFirstCol()
      insertFirstCol()

      expect(game.columns[0].cells[0].isOn).toEqual(true)
      expect(game.columns[0].cells[1].isOn).toEqual(true)

      game.restart()

      expect(game.columns[0].cells[0].isOn).toEqual(false)
      expect(game.columns[0].cells[1].isOn).toEqual(false)

    })
  })

})
