import React, {SFC} from 'react'

import {GameGrid} from './grid'
import Header from './header'
import {GameStore} from './store'

type GameProps = {
}

const Game: SFC<GameProps> = () => {
  const width = 3
  const height = 4

  const store = GameStore.create({width, height})

  return (
    <div>
      <Header
        store={store}
      />

      <GameGrid
        width={3}
        height={4}
        store={store}
      />
    </div>
  )
}

export default Game
