export const terrainTypes = (['rail', 'blank', 'bridgerail'] as const)

export type TDirection = 'up' | 'right' | 'down' | 'left'


export const directions = (['up', 'right', 'down', 'left'] as const);

export interface AdvancedFigure {
    name: string;
    symmetry: 'no' | 'angle' | 'angleOnce'
    flip?: boolean;
    angle: number;
    weight: number;
    up: typeof terrainTypes[number][];
    right: typeof terrainTypes[number][];
    down: typeof terrainTypes[number][];
    left: typeof terrainTypes[number][];
}

const LFigure: AdvancedFigure = {
    name: 'LFigure',
    symmetry: 'angle',
    angle: 0,
    up: ['rail'],
    right: ['rail'],
    down: ['blank'],
    weight: 2,
    left: ['blank']
}

const XFigure: AdvancedFigure = {
    name: 'XFigure',
    symmetry: 'no',
    angle: 0,
    weight: 0.1,
    up: ['rail'],
    right: ['rail'],
    down: ['rail'],
    left: ['rail']
}

const BridgeStartFigure: AdvancedFigure = {
    name: 'BridgeStartFigure',
    symmetry: 'angle',
    flip:true,
    angle: 0,
    weight: 1,
    up: ['rail'],
    right: ['blank'],
    down: ['bridgerail'],
    left: ['blank']
}

const IBridgeFigure: AdvancedFigure = {
    name: 'IBridgeFigure',
    symmetry: 'angleOnce',
    flip: true,
    angle: 0,
    weight: 1,
    up: ['bridgerail'],
    right: ['blank'],
    down: ['bridgerail'],
    left: ['blank']
}

const TunnelBridgeFigure: AdvancedFigure = {
    name: 'TunnelBridgeFigure',
    symmetry: 'angleOnce',
    flip: true,
    angle: 0,
    weight: 1,
    up: ['bridgerail'],
    right: ['rail'],
    down: ['bridgerail'],
    left: ['rail']
}

const IFigure: AdvancedFigure = {
    name: 'IFigure',
    symmetry: 'angleOnce',
    angle: 0,
    weight:8,
    up: ['rail'],
    right: ['blank'],
    down: ['rail'],
    left: ['blank']
}

const AdvBlankFigure: AdvancedFigure = {
    name: 'BlankFigure',
    symmetry: 'no',
    angle: 0,
    weight:0,
    up: ['blank'],
    right: ['blank'],
    down: ['blank'],
    left: ['blank']
}

const EndFigure: AdvancedFigure = {
    name: 'EndFigure',
    symmetry: 'angle',
    angle: 0,
    weight:0.0001,
    up: ['rail'],
    right: ['blank'],
    down: ['blank'],
    left: ['blank']
}

const TFigure: AdvancedFigure = {
    name: 'TFigure',
    symmetry: 'angle',
    angle: 0,
    weight: 0.3,
    up: ['blank'],
    right: ['rail'],
    down: ['rail'],
    left: ['rail']
}

export interface FigureTypes {
    [key: string]: AdvancedFigure
}

const generateFigures = (inputFigures: AdvancedFigure[]) => {
    const resFigures: FigureTypes = {};
    inputFigures.forEach(inputFigure => {
        inputFigure.weight = inputFigure.weight || 6;
        if (inputFigure.symmetry === 'angle') {
            resFigures[inputFigure.name + '0'] = { ...inputFigure, symmetry: 'no' };
            resFigures[inputFigure.name + '90'] = {
                ...inputFigure,
                angle: 90,
                symmetry: 'no',
                up: inputFigure.left,
                right: inputFigure.up,
                down: inputFigure.right,
                left: inputFigure.down
            };
            resFigures[inputFigure.name + '180'] = {
                ...inputFigure,
                angle: 180,
                symmetry: 'no',
                up: inputFigure.down,
                right: inputFigure.left,
                down: inputFigure.up,
                left: inputFigure.right
            };
            resFigures[inputFigure.name + '270'] = {
                ...inputFigure,
                angle: 270,
                symmetry: 'no',
                up: inputFigure.right,
                right: inputFigure.down,
                down: inputFigure.left,
                left: inputFigure.up
            };
        }
        if (inputFigure.symmetry === 'angleOnce') {
            resFigures[inputFigure.name + '0'] = { ...inputFigure, symmetry: 'no' };
            resFigures[inputFigure.name + '90'] = {
                ...inputFigure,
                angle: 90,
                symmetry: 'no',
                up: inputFigure.left,
                right: inputFigure.up,
                down: inputFigure.right,
                left: inputFigure.down
            };
        }
        if (inputFigure.symmetry === 'no') {
            resFigures[inputFigure.name + '0'] = inputFigure;
        }
    })
    return resFigures;
}

export const combinations = generateFigures([TFigure, AdvBlankFigure, LFigure, IFigure, XFigure, EndFigure, BridgeStartFigure, IBridgeFigure, TunnelBridgeFigure]);//

export const combinationNames = Object.keys(combinations)