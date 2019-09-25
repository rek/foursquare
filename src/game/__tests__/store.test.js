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

    beforeEach(function() {
      game = GameStore.create({width: 4, height: 4})
    })

    test('Initial conditions', function() {
      expect(game.turn).toEqual(true)
      expect(game.playing).toEqual(true)
    })

    test('Change turn', function() {
      expect(game.turn).toEqual(true)
      game.changeTurn()
      expect(game.turn).toEqual(false)
    })

    test('simple victory - vertical', function() {
      const insertFirstCol = game.insert(0)
      const insertSecondCol = game.insert(1)

      insertFirstCol()
      insertSecondCol()
      expect(game.playing).toEqual(true)

      insertFirstCol()
      insertSecondCol()
      expect(game.playing).toEqual(true)

      insertFirstCol()
      expect(game.playing).toEqual(false)
    })
  })

})
