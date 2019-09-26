import React, {SFC} from 'react'

import {TimeTraveller} from 'mst-middlewares'

import {GameGrid} from './grid'
import Header from './header'
import {GameStore} from './store'

type GameProps = {
}

const Game: SFC<GameProps> = () => {
  const width = 5
  const height = 4

  const store = GameStore.create({width, height})
  console.log('store', store)

  const timeTraveller = TimeTraveller.create({}, {targetStore: store})

  const undo = () => {
    if (timeTraveller.canUndo) timeTraveller.undo()
  }

  return (
    <div>
      <Header
        store={store}
        undo={undo}
      />

      <GameGrid
        width={width}
        height={height}
        store={store}
      />
    </div>
  )
}

export default Game
