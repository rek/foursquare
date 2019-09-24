import {
  types,
  Instance,
} from 'mobx-state-tree'
import times from 'lodash/times'
import range from 'lodash/range'
import map from 'lodash/map'
import findLast from 'lodash/findLast'

const GameBoardCell = types.model('GameBoardCell', {
  isOn: false,
  player: true,
})
  .actions((self) => {
    return {
      makeMove(player: boolean) {
        self.isOn = true
        self.player = player
      },

    }
  })

const GameBoardColumn = types.model('GameBoardColumn', {
  column: types.array(GameBoardCell)
})
  .views((self) => {
    return {
      getCell(position: number) {
        return self.column[position]
      },
    }
  })

  .actions((self) => {
    return {
      addMove(player: boolean) {
        // find the last position that a move has been added to
        findLast(self.column, (cell, id) => {
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

  width: 0,
  height: 0,

  columns: types.optional(types.array(GameBoardColumn), [])
})
  .views((self) => {
    return {
      get currentPlayer() {
        return self.turn ? 'Player 1' : 'Player 2'
      },

      getState: (columnId: number, cellId: number) => {
        // console.log(columnId, cellId); return true
        return self.columns[columnId].getCell(cellId).isOn
      }
    }
  })

  .actions((self) => {
    const actions = {
      // generate the grid of the game board
      generate(width?: number, height?: number) {
        {map(range(width || self.width), (key) => {
          self.columns.push({
             column: times(height || self.height, () => ({}))
          })
        })}
      },

      afterCreate() {
        actions.generate()
      },

      restart() {
        // self.columns = []
        self.turn = true
        actions.generate()
      },

      changeTurn: () => {
        self.turn = !self.turn
      },

      checkVictory() {
        console.log('Not yet.')
      },

      insert: (column: number) => () => {
        // add a move for the current user
        self.columns[column].addMove(self.turn)

        actions.checkVictory()

        actions.changeTurn()
      },
    }

    return actions
  })

export type IStore = Instance<typeof GameStore>
