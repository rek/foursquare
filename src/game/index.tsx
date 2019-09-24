import React, {SFC} from 'react'

import {GameGrid} from './grid'
import Header from './header'
import Store from './store'

type GameProps = {
}

const Game: SFC<GameProps> = () => {
  const store = Store.create()

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
