import { makeAutoObservable } from "mobx";
import { v4 } from "uuid";
import Board from "./board";
import { AdvancedFigure, combinationNames, combinations, directions, TDirection } from "./figures";
import { getReverseDirection, randomShuffleFn } from "./utils";
import { Loco, Wagon } from "./wagon";

export class Cell {

    growSpeed = 10;

    x: number

    y: number

    uuid: string

    board: Board;

    manualValue?: AdvancedFigure

    get up(): Cell | undefined {
        if (this.y === 0) {
            return undefined
        }
        return this.board.cellField[this.y * this.board.width + this.x - this.board.width]
    }
    get right(): Cell | undefined {
        if (this.x === this.board.width - 1) {
            return undefined
        }
        return this.board.cellField[this.y * this.board.width + this.x + 1]
    }
    get down(): Cell | undefined {
        if (this.y === this.board.height - 1) {
            return undefined
        }
        return this.board.cellField[this.y * this.board.width + this.x + this.board.width]
    }
    get left(): Cell | undefined {
        if (this.x === 0) {
            return undefined
        }
        return this.board.cellField[this.y * this.board.width + this.x - 1]
    }

    onClick = () => {
        if (this.value) {
            // console.log(this.value)
        }
        if (!this.value) {
            const lol = Math.floor(Math.random() * 5)
            this.manualValue = combinations[combinationNames[lol]];
            setTimeout(() => this.grow(this), this.growSpeed);
            // this.grow()
        }
    }

    createTrain = () => {
        const loco = new Loco(this.x, this.y, 'up', this.board);
        let train: any[] = []
        let lastHead: Wagon | Loco = loco;
        let possibleDirs = lastHead.possibleDirections.sort(randomShuffleFn);
        loco.lastDirection = getReverseDirection(possibleDirs[0]);
        
        for (let i = 0; i<5; i++) {
            const lastCell = this.board.cellField[lastHead.y*this.board.width + lastHead.x];
            const wag = new Wagon(lastCell[possibleDirs[0]]?.x || 0, lastCell[possibleDirs[0]]?.y || 0, this.board)
            lastHead.tail = wag;
            lastHead = wag;
            train.push(wag)
        }
        //     const wagon = new Wagon(lastHead[possibleDirs[0]]?.x || 0, this[getReverseDirection(possibleDirs[0])]?.y || 0, this.board)
        //     console.log(wagon.possibleDirections)
        //     possibleDirs = wagon.possibleDirections.filter(dir => possibleDirs[0] === dir)
        //     lastHead.tail = wagon;
        //     train.push(wagon)
        //     lastHead = wagon;
        
        train.push(loco)
        this.board.transport.push(...train)
        console.log(this.board.transport)
    }

    doubleClick = () => {
        this.createTrain()
    }


    shuffleFn = (figureA: AdvancedFigure, figureB: AdvancedFigure) =>
        Math.random() * (figureB.weight + figureA.weight) - figureA.weight;

    grow = (fromCell?: Cell):void => {
        let randomNextTarget: Cell = this.lowestEntropyNeighbours.sort(randomShuffleFn)[0];
        if (!randomNextTarget) {
            randomNextTarget = this.board.lowestEntropyCells.sort(randomShuffleFn)[0];
        }
        if (!randomNextTarget) {
            return;
        }
        const randomValue: any = randomNextTarget.validCombinations.sort(randomShuffleFn).sort(this.shuffleFn)[0];
        if (!randomValue && fromCell) {
            fromCell.manualValue = undefined;
            if (fromCell.up) {
                fromCell.up.manualValue = undefined;
            }
            if (fromCell.right) {
                fromCell.right.manualValue = undefined;
            }
            if (fromCell.down) {
                fromCell.down.manualValue = undefined;
            }
            if (fromCell.left) {
                fromCell.left.manualValue = undefined;
            }
            return fromCell.grow(this);
        }
        randomNextTarget.manualValue = randomValue;
        if (randomValue) { 
            // setTimeout(() => randomNextTarget.grow(this), this.growSpeed);
            randomNextTarget.grow(this)
        }
    }

    get neighboursWithOutValue() {
        return directions.map(direction => this[direction]).
            filter(dir => dir && !dir.value)
    }

    get lowestEntropyNeighbours(): any {
        const lowestEntropyValue = this.neighboursWithOutValue.
            reduce((prev, next) => prev!.entropy > next!.entropy ? next : prev, ({entropy: 999} as any))?.entropy;
        return this.neighboursWithOutValue.filter(neighbour => neighbour?.entropy === lowestEntropyValue)
    }

    get value() {
        if (this.manualValue) {
            return this.manualValue
        }
    }

    get validCombinations(): AdvancedFigure[] {
        return this.getValidCombinations('up').
            filter(com => this.getValidCombinations('right').includes(com)).
            filter(com => this.getValidCombinations('down').includes(com)).
            filter(com => this.getValidCombinations('left').includes(com)).map(com => combinations[com])
    }

    get printValidCombinations() {
        console.log('up', this.getValidCombinations('up'))
        console.log('right', this.getValidCombinations('right'))
        console.log('down', this.getValidCombinations('down'))
        console.log('left', this.getValidCombinations('left'))
        return undefined
    }

    get entropy() {
        if (this.value) {
            return 0
        }
        return this.validCombinations.length
    }

    getValidCombinations(direction: TDirection) {
        const NeighbourCell = this[direction];
        if (!NeighbourCell || !NeighbourCell.value) {
            return combinationNames;
        }
        const NeighbourCellFigure = NeighbourCell.value;
        return Object.values(combinations).filter(combination => {
            return combination[direction].filter(type => {
                return NeighbourCellFigure[getReverseDirection(direction)].includes(type)
            }).length
        }).map(com => com.name + com.angle)
    }


    constructor(x: number, y: number, board: Board) {
        makeAutoObservable(this)
        this.uuid = v4()
        this.x = x
        this.y = y;
        this.board = board;

    }
}
