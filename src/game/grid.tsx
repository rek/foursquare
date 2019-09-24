import React, {ReactNode} from 'react'
import range from 'lodash/range'
import map from 'lodash/map'

import {makeStyles, createStyles, Theme} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

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

const GridRow = (props: {amount: number, cellId: number, classes: any, children: (cellProps: {rowId: number, cellId: number}) => ReactNode}) => {
  return (
    <Grid container justify='center' spacing={1}>
      {map(range(props.amount), (rowId) => {
        return (
          <GridCell
            key={`${props.cellId}-${rowId}`}
            {...props}
          >
            {props.children && props.children({
              rowId,
              cellId: props.cellId,
            })}
          </GridCell>
        )
      })}
    </Grid>
  )
}

export const GameGrid = (props: {
  width: number,
  height: number,
  store: any,
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
                return props.store.getState(cellProps.rowId, cellProps.cellId) ? 'on' : 'off'
              }}
            </GridRow>
          )
        })}

        <GridRow
          amount={props.width}
          cellId={-1}
          classes={classes}
        >
          {(cellProps) => {
            return <div>Insert</div>
          }}
        </GridRow>

      </Grid>
    </Grid>
  )
}
