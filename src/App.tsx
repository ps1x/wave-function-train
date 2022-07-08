import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import logo from './logo.svg'
import './App.css'
import { StyledCell, StyledBoard,StyledWagon } from './style'
import Board from './store/board'
import { Cell } from './store/cell'
import { Wagon } from './store/wagon'

const MyBoard = new Board()

const CellRenderer = observer(({ cell }: { cell: Cell }) => {
  return (
    <StyledCell onClick={cell.onClick} onDoubleClick={cell.doubleClick} className={cell.value?.name} figure={cell.value}></StyledCell>
  )
});

const WagonRenderer = observer(({ wagon }: {wagon: Wagon}) => {
  return (
    <StyledWagon wagon={wagon} x={wagon.x} y={wagon.y}/>
  )
});

(window as any).board = MyBoard;

const App =  observer(() => {
  return (
    <div className="App"  onKeyDown={MyBoard.handleKeyPress} tabIndex={0}>
      <header className="App-header">
        <StyledBoard width={MyBoard.width} height={MyBoard.height}>
          {MyBoard.cellField.map((cell) => {
            return (<CellRenderer key={cell.uuid} cell={cell} />)
          })}
          {MyBoard.transport.map((trans) => {
            return (<WagonRenderer key={trans.uuid} wagon={trans} />)
          })}
        </StyledBoard>
      </header>
    </div>
  )
})

export default App
