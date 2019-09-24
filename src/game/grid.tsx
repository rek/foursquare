import React, {ReactNode} from 'react'
import {observer} from 'mobx-react'
import range from 'lodash/range'
import map from 'lodash/map'

import {makeStyles, createStyles, Theme} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import {IStore} from './store'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
)

const GridCell = (props: {
  classes: any,
  children: ReactNode,
}) => {
  return (
    <Grid item>
      <Paper className={props.classes.paper}>
        {props.children}
      </Paper>
    </Grid>
  )
}

// observer here is to update the cell content on change
const GridRow = observer((props: {
  amount: number,
  cellId: number,
  classes: any,
  children: (cellProps: {
    columnId: number,
    cellId: number
  }) => ReactNode
}) => {
  return (
    <Grid container justify='center' spacing={1}>
      {map(range(props.amount), (columnId) => {
        return (
          <GridCell
            key={`${props.cellId}-${columnId}`}
            {...props}
          >
            {props.children && props.children({
              columnId,
              cellId: props.cellId,
            })}
          </GridCell>
        )
      })}
    </Grid>
  )
})

// observer here is to update the 'insert' button when store changes
export const GameGrid = observer((props: {
  width: number,
  height: number,
  store: IStore,
}) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>

        {map(range(props.height), (key) => {
          return (
            <GridRow
              key={`row-${key}`}
              amount={props.width}
              cellId={key}
              classes={classes}
            >
              {(cellProps) => {
                const cell = props.store.getCell(cellProps.columnId, cellProps.cellId)

                return cell.isOn
                  ? cell.playerName
                  : 'off'
              }}
            </GridRow>
          )
        })}

        {props.store.playing &&
          <GridRow
            amount={props.width}
            cellId={-1}
            classes={classes}
          >
            {(cellProps) => {
              return <Button onClick={props.store.insert(cellProps.columnId)}>Insert</Button>
            }}
          </GridRow>
        }
      </Grid>
    </Grid>
  )
})
