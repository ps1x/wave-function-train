import { makeAutoObservable } from "mobx";
import { Cell } from "./cell";
import { Loco } from "./wagon";

class Board {

    width = 30
    height = 15

    cellField: Cell[] = []

    transport: Loco[] = []

    onCellClick(x: number, y: number) {
        console.log('CellClicked:', x, y);
    }


    handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            this.clearCellField()
        }
        if (e.key === ' ') {
            this.clearCellField();
            this.cellField[0].grow(this.cellField[0]);
        }
        if (e.key === 'a') {
            setInterval(this.moveTransport, 900)
        }
    }

    moveTransport = () => {
        this.transport.filter(trans => trans instanceof Loco).forEach(trans => trans.move())
    }

    get cellsWithOutValue() {
        return this.cellField.filter(cell => cell && !cell.value)
    }

    get lowestEntropyCells() {
        const lowestEntropyValue = this.cellsWithOutValue.
            reduce((prev, next) => prev!.entropy > next!.entropy ? next : prev, { entropy: 999 })?.entropy;
        return this.cellsWithOutValue.filter(cell => cell?.entropy === lowestEntropyValue)
    }

    clearCellField() {
        console.log('clearing ')
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cellField[y * this.width + x].manualValue = undefined
            }
        }
    }

    constructor() {
        makeAutoObservable(this)
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cellField.push(new Cell(x, y, this))
            }
        }
    }
}

export default Board;