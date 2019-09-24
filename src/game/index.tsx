import React, {SFC} from 'react'
import {GameGrid} from './grid'

type GameProps = {
}

const Game: SFC<GameProps> = () => {
  const store = {
    getState: (rowId: number, cellId: number) => {console.log(rowId, cellId); return true}
  }

  return (
    <div>
      <GameGrid
        width={3}
        height={4}
        store={store}
      />
    </div>
  )
}

export default Game
