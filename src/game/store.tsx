import {
  types,
  Instance,
} from 'mobx-state-tree'

export const GameStore = types.model('GameStore', {
  turn: true, // true = player 1
})
  .views((self) => {
    return {
      get currentPlayer() {
        return self.turn ? 'Player 1' : 'Player 2'
      },

      getState: (rowId: number, cellId: number) => {
        console.log(rowId, cellId); return true
      }
    }
  })

  .actions((self) => {
    const actions = {
      restart() {
        self.turn = true
      },

      changeTurn: () => {
        self.turn = !self.turn
      },

      insert: (column: number) => () => {
        console.log('column', column)
        actions.changeTurn()
      },
    }

    return actions
  })

export type IStore = Instance<typeof GameStore>
