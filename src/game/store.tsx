import {types} from 'mobx-state-tree'

const GameStore = types.model('GameStore', {
})
  .views((self) => {
    return {
      getState: (rowId: number, cellId: number) => {
        console.log(rowId, cellId); return true
      }
    }
  })

  .actions((self) => {
    return {

    }
  })

export default GameStore
