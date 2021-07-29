export class IPosition {
    x?: number
    y: number
}

export class IPositionRecord {
    id: string
    date: Date
    name: string
    position: any = { x: 0, y: 0, z: 0 }
}

export class IValue {
    value: number
}


