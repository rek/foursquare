import {getCell} from './utils'
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
				cells: [getCell()]
			})
		})

		test('Get cell', function() {
			expect(column.getCell(0).isOn).toEqual(false)
		})
	})

	describe('Main Game Store', function() {
		let game

		beforeEach(function() {
			game = GameStore.create()
		})

		test('Initial conditions', function() {
			expect(game.turn).toEqual(true)
			expect(game.playing).toEqual(true)
		})
	})

})
