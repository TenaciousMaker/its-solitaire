import { CardSuit } from "./enums/CardSuit";
import { CardValue } from "./enums/CardValue";

export interface PlayingCard {
    suit: CardSuit;
    value: CardValue;
    faceUp: boolean;
    key: string;
}

export type Pile = Array<PlayingCard>;
export type Stock = Pile;
export type Waste = Pile;
export type Tableau = Pile[];
export type Foundation = Pile[];

export interface Solitaire {
    stock: Stock;
    waste: Waste;
    tableau: Tableau;
    foundation: Foundation;
}
