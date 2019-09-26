import React from 'react'
import {observer} from 'mobx-react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import {IStore} from './store'

const Header = (props: {
  store: IStore,
  undo: any,
}) => {
  // console.log('store', props.store)

  return (
    <div>
      <Typography align='center'>
        Foursquare
      </Typography>
      <Button onClick={props.store.restart}>
        Restart Game
      </Button>
      <div>
        <Button onClick={props.undo}>
          Undo last move
        </Button>
      </div>
      <div>
        <Typography align='center' variant='caption'>
          Current turn: {props.store.currentPlayer}
        </Typography>
      </div>
    </div>
  )
}

export default observer(Header)
