import { makeAutoObservable } from "mobx";
import { v4 } from "uuid";
import Board from "./board";
import { directions, TDirection } from "./figures";
import { getReverseDirection, randomShuffleFn } from "./utils";

export class Wagon {
    x: number;
    y: number;
    board: Board
    uuid: string;
    terrainTypes = ['rail']
    tail?: Wagon;

    constructor(x: number, y: number, board: Board, tail?: Wagon) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.uuid = v4()
        this.tail = tail;
        makeAutoObservable(this)
    }

    move(x: number, y: number) {
        if (this.tail) {
            // console.log(x,y, this.x,this.y)
            this.tail.move(this.x, this.y)
        }
        this.x = x;
        this.y = y;
    }

    get currentCell() {
        return this.board.cellField[this.board.width * this.y + this.x]
    }

    get possibleDirections() {
        return directions.filter(direction => {
            if (this.currentCell.value?.[direction]) {
                return this.terrainTypes.filter(type => this.currentCell.value?.[direction].includes(type as any)).length
            }
        })
    }

    destroy() {
        if (this.tail) {
            this.tail.destroy()
        }
        console.log('destroying wagon')
        this.board.transport.splice(this.board.transport.findIndex(trans => trans.uuid === this.uuid), 1)
    }
}

export class Loco {
    x: number;
    y: number;
    board: Board
    lastDirection: TDirection
    lastTerrain: 'rail' | 'bridgerail' | 'blank' = 'rail'
    terrainTypes = ['rail', 'bridgerail']
    uuid: string;
    tail?: Wagon;


    constructor(x: number, y: number, lastDirection: TDirection, board: Board, tail?: Wagon) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.uuid = v4()
        this.tail = tail;
        this.lastDirection = lastDirection || this.possibleDirections.sort(randomShuffleFn)[0]
        makeAutoObservable(this)
    }

    get currentCell() {
        return this.board.cellField[this.board.width * this.y + this.x]
    }

    move() {

        const whereToMove = this.possibleDirections.filter(dir => dir !== getReverseDirection(this.lastDirection)).sort(randomShuffleFn)[0]
        if (!whereToMove) {
            return this.destroy();
        }
        const nextCell = this.currentCell[whereToMove];
        if (nextCell) {
            this.lastTerrain = this.currentCell[whereToMove]!.value![getReverseDirection(whereToMove)][0]
            this.lastDirection = whereToMove;
            if (this.tail) {
                this.tail.move(this.x, this.y);
            }
            this.x = nextCell?.x;
            this.y = nextCell?.y;

        }
        if (!nextCell) { // edge of board
            this.destroy()
        }
    }

    destroy() {
        console.log('nowhere to move')
        if (this.tail) {
            this.tail.destroy()
        }
        this.board.transport.splice(this.board.transport.findIndex(trans => trans.uuid === this.uuid), 1)
    }

    get possibleDirections() {
        return directions.filter(direction => {
            if (this.currentCell.value?.[direction]) {
                if (this.currentCell.value?.name === 'BridgeStartFigure') {
                    return this.terrainTypes.filter(type => this.currentCell.value?.[direction].includes(type as any)).length
                }
                return this.currentCell.value?.[direction].includes(this.lastTerrain)
            }
        })
    }
}