export interface PlayingCard {
    suit: CardSuit;
    value: CardValue;
    faceUp: boolean;
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

// Not listed in suit priority.
export enum CardSuit {
    Club = 0,
    Diamond,
    Spade,
    Heart,
}

export enum CardValue {
    Ace = 0,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
}