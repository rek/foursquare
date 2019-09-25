import {
  types,
  Instance,
} from 'mobx-state-tree'
import times from 'lodash/times'
import range from 'lodash/range'
import map from 'lodash/map'
import findLast from 'lodash/findLast'

// @refactor: move to new file - GameBoardCell
export const GameBoardCell = types.model('GameBoardCell', {
  isOn: false,
  player: true,

  isTop: false,
  isBottom: false,
})
  .views((self) => {
    return {
      get playerName() {
        return self.player ? 'Player 1' : 'Player 2'
      },

      hasMoveFromPlayer(player: boolean) {
        return self.isOn && self.player === player
      }
    }
  })

  .actions((self) => {
    return {
      setTop() {
        self.isTop = true
      },

      setBottom() {
        self.isBottom = true
      },

      makeMove(player: boolean) {
        self.isOn = true
        self.player = player
      },
    }
  })

// @refactor: move to new file - GameBoardColumn
export const GameBoardColumn = types.model('GameBoardColumn', {
  cells: types.array(GameBoardCell)
})
  .views((self) => {
    return {
      getCell(position: number) {
        return self.cells[position]
      },

      isCellTop(cellId: number) {
        return cellId === 0
      },

      isCellBottom(cellId: number) {
        return self.cells.length === cellId
      },
    }
  })

  .actions((self) => {
    return {
      addMove(player: boolean) {
        // console.log('Adding move for:', player)

        // find the last position that a move has been added to
        findLast(self.cells, (cell, id) => {
          if (!cell.isOn) {
             self.getCell(id).makeMove(player)
             return true
          }
        })
      },
    }
  })

export const GameStore = types.model('GameStore', {
  turn: true, // true = player 1
  playing: true, // game is active

  winAmount: 3,
  width: 0,
  height: 0,

  columns: types.optional(types.array(GameBoardColumn), [])
})
  .views((self) => {
    const views = {
      get currentPlayer() {
        return self.turn ? 'Player 1' : 'Player 2'
      },

      hasColumn(columnId: number): boolean {
        return !!self.columns[columnId]
      },

      getCell: (columnId: number, cellId: number) => {
        return self.columns[columnId].getCell(cellId)
      },

      // @refactor: make these getters more generic, way too many repeated safteys here
      getCellBelow: (columnId: number, cellId: number) => {
        if (!views.hasColumn(columnId)) {
          return undefined
        }

        const cell = views.getCell(columnId, cellId)

        if (!cell) {
          return undefined
        }

        return cell.isBottom
          ? undefined
          : views.getCell(columnId, cellId + 1)
      },

      getAdjacentCellAbove: (columnId: number, cellId: number) => {
        if (!views.hasColumn(columnId)) {
          return undefined
        }

        const cell = views.getCell(columnId, cellId)

        if (!cell) {
          return undefined
        }

        if (!cell.isTop) {
          return views.getCell(columnId + 1, cellId - 1)
        }

        return undefined
      },

      getAdjacentCell: (columnId: number, cellId: number) => {
        if (!views.hasColumn(columnId)) {
          return undefined
        }

        return views.getCell(columnId + 1, cellId)
      },

      getAdjacentCellBelow: (columnId: number, cellId: number) => {
        if (!views.hasColumn(columnId)) {
          return undefined
        }

        const cell = views.getCell(columnId, cellId)

        if (!cell) {
          return undefined
        }

        if (!cell.isBottom) {
          return views.getCell(columnId + 1, cellId + 1)
        }

        return undefined
      },
    }

    return views
  })

  .actions((self) => {
    const actions = {
      // generate the grid of the game board
      generate(width?: number, height?: number) {
        map(range(width || self.width), (key) => {
          self.columns.push({
             cells: times(height || self.height, () => ({}))
          })

          // add position markers to cells so we don't have to check later on
          const column = self.columns[self.columns.length - 1]
          column.cells[0].setTop()
          column.cells[column.cells.length - 1].setBottom()
        })
      },

      endGame() {
        self.playing = false
      },

      // auto called from mst on store create
      afterCreate() {
        actions.generate()
      },

      restart() {
        // @ts-ignore
        self.columns = []
        self.turn = true
        self.playing = true
        actions.generate()
      },

      changeTurn: () => {
        self.turn = !self.turn
      },

      checkVictory() {
        type winnerType = {
          player?: boolean
        }

        type matchType = {
          matchingCellInline: number,
          matchingCellBelow: number,
          matchingCellDiagonalAbove: number,
          matchingCellDiagonalBelow: number,
        }

        // mutates result, previousCellMatches
        const checkCell = (
          mode: keyof matchType,
          cell: any,
          player: boolean,
          result: winnerType,
          previousCellMatches: matchType
        ): number => {
          if (!cell) {
            return 0
          }

          // console.log('cellAdjacentAbove', cellAdjacentAbove)
          if (cell && cell.hasMoveFromPlayer(player)) {
            previousCellMatches[mode]++
            // console.log('Found match', mode, previousCellMatches[mode])

            // player wins if they get a line of previous matches equal to the win limit
            if (previousCellMatches[mode] === self.winAmount) {
              // console.warn('Winner:', mode)
              result.player = player
            }
          } else {
            previousCellMatches[mode] = 0
          }

          // return the length of the line of matches we are checking
          return previousCellMatches[mode]
        }

        const checkAdjecentCells = (
          columnIndex: number,
          cellIndex: number,
          player: boolean,
          result: winnerType = {player: undefined},
          previousCellMatches: matchType = {
            matchingCellInline: 0,
            matchingCellBelow: 0,
            matchingCellDiagonalAbove: 0,
            matchingCellDiagonalBelow: 0,
          },
        ): winnerType => {
          // console.log('Checking:', {columnIndex, cellIndex})

          let checkingLine = 0

          // @refactor: can make this line simpler and move the -+ logic into the getters
          // eg: getCellBelow(columnIndex, cellIndex, increment)
          // checkingLine += checkCell('CellBelow', columnIndex, cellIndex, player, result, previousCellMatches)

          // don't need to search up or backwards, as down and across/inline already covers those directions
          checkingLine += checkCell('matchingCellBelow', self.getCellBelow(columnIndex, cellIndex - previousCellMatches['matchingCellBelow']), player, result, previousCellMatches)
          checkingLine += checkCell('matchingCellDiagonalAbove', self.getAdjacentCellAbove(columnIndex + previousCellMatches['matchingCellDiagonalAbove'], cellIndex + previousCellMatches['matchingCellDiagonalAbove']), player, result, previousCellMatches)
          checkingLine += checkCell('matchingCellInline', self.getAdjacentCell(columnIndex + previousCellMatches['matchingCellInline'], cellIndex), player, result, previousCellMatches)
          checkingLine += checkCell('matchingCellDiagonalBelow', self.getAdjacentCellBelow(columnIndex - previousCellMatches['matchingCellDiagonalBelow'], cellIndex - previousCellMatches['matchingCellDiagonalBelow']), player, result, previousCellMatches)

          // if none of the adjacent cells are part of match
          // then we stop checking
          if (checkingLine === 0) {
            return result
          }

          return checkAdjecentCells(columnIndex, cellIndex, player, result, previousCellMatches)
        }

        const result = self.columns.find((column, columnIndex) => {
          // console.log('Checking column:', columnIndex, column.cells.toJSON(), {player: self.turn})

          // if there is not enough room left in the grid to win, skip checking these columns
          if (columnIndex > self.columns.length - self.winAmount) {
            // console.log('Skipping column at edge:', columnIndex)
            return false
          }

          let finished = false

          column.cells.forEach((cell, cellIndex) => {
            // only check cells that are 'on'
            if (cell.isOn) {
              // since we check after each move, we don't need to check cells from the other player,
              // since they would have been check last turn
              if (cell.player === self.turn) {
                // console.log('Starting check for player:', cell.player, {columnIndex, cellIndex})
                const finalResults = checkAdjecentCells(columnIndex, cellIndex, cell.player)
                // console.log('finalResults', finalResults)

                if (finalResults && finalResults.player !== undefined) {
                  console.warn('WINNER:', self.currentPlayer, finalResults)
                  finished = true
                }
              }
            }
          })

          return finished
        })

        return !!result
      },

      insert: (column: number) => () => {
        // console.log('Adding move into col:', column)

        // add a move for the current user
        self.columns[column].addMove(self.turn)

        actions.checkVictory()
          ? actions.endGame()
          : actions.changeTurn()
      },
    }

    return actions
  })

export type IStore = Instance<typeof GameStore>
