import styled, { css } from "styled-components";
import { AdvancedFigure } from "./store";
import { Wagon } from "./store/wagon";

const cellWidth = 30;
const cellHeight = 30;

export const StyledCell = styled.div<ICell>`
    display: flex;
    /* border: solid 1px rgb(114, 104, 104); */
    flex-flow: column wrap;
    overflow: hidden;
    font-size:10px;
    background-size: cover;
    width: ${() => cellWidth}px;
    height: ${() => cellHeight}px;
    transform: rotate(${({figure}) => figure?.angle}deg) ${({figure}) => {
        if (figure?.flip) {
            if (figure?.angle === 180) {
                return 'scaleX(-1)'
            }
            if (figure?.angle === 270) {
                return 'scaleX(-1)'
            }
        }
    }};
`;

interface IWagon {
    wagon: Wagon;
    x: number;
    y: number;
}

export const StyledWagon = styled.div<IWagon>`
    position: absolute;
    left: ${({x}) => x * cellWidth}px;
    top: ${({y}) => y * cellHeight}px;
    width: ${() => cellWidth}px;
    height: ${() => cellHeight}px;
    background: ${({wagon}) => wagon instanceof Wagon ? 'blue' : 'red'}};
    border-radius: 100%;
    transition:all 1s linear;
`

interface IBoard {
    width: number;
    height: number;
}

export const StyledBoard = styled.div<IBoard>`
    display: flex;
    position: relative;
    width: ${({width}) => width*cellWidth}px;
    height: ${({height}) => height*cellWidth}px;
    flex-flow: row wrap;
    justify-content: center;
    border: solid 1px white;
    ${StyledCell} {
        flex: 0 0 ${({width}) => 100/width}%;
    }
`;

interface ICell {
    figure?: AdvancedFigure;
}
