import { TDirection } from "./figures";

export const randomShuffleFn = () => Math.random() - .5;

export const getReverseDirection = (direction: TDirection): TDirection => {
    if (direction === 'down') return 'up'
    if (direction === 'up') return 'down'
    if (direction === 'left') return 'right'
    return 'left'
}