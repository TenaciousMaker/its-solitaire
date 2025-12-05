import { Pile, Stock, Tableau, PlayingCard, Waste, Foundation, Solitaire } from "../model";
import { CardValue } from "../enums/CardValue";
import { CardSuit } from "../enums/CardSuit";

// Build a new deck of cards, in order.
export function buildDeck(): Pile {
    const deck: Pile = [];
    for (let s = 0; s < 4; s++) {
        for (let v = 0; v < 13; v++) {
            deck.push(getCard(s, v));
        }
    }
    return deck;
}

// Shuffle that deck.
export function populateStock(deck: Stock): Stock {
    const stock: Stock = [];
    while (deck.length) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        stock.push(...deck.splice(randomIndex, 1));
    }
    return stock;
}

// Lay out the tableau, a set of seven piles that have incrementing
// counts of cards with the final card face up.
export function populateTableau(stock: Stock): [Stock, Tableau] {
    const tableau: Tableau = [];
    const remainingStock: Stock = stock.slice();
    for (let p = 0; p < 7; p++) {
        const pile: Pile = [];
        for (let s = 0; s < p + 1; s++) {
            let card = remainingStock.pop()!;
            if (s === p) {
                card = flipCardUp(card);
            }
            pile.push(card);
        }
        tableau.push(pile);
    }
    return [remainingStock, tableau];
}

// Move a card from stock to waste.
export function moveStockToWaste(stock: Stock, waste: Waste): [Stock, Waste] {
    if (stock.length) {
        const stockCopy = stock.slice();
        const card = flipCardUp(stockCopy.pop()!);
            return [stockCopy, [...waste, card]];
    }
    return [stock, waste];
}

// Recycle waste pile back to stock.
export function recycleWastePile(waste: Waste): Stock {
    return waste.slice().reverse().map(card => {
        return flipCardDown(card);
    });
}

// Move card from waste to tableau pile.
export function moveWasteToTableau(waste: Waste, tableau: Tableau, p: number): [Waste, Tableau] {
    const wasteCopy = waste.slice();
    const top = wasteCopy.pop();
    const bottom = tableau[p][tableau[p].length - 1];
    if (top && isNextTableauCard(top, bottom)) {
        const tableauCopy = tableau.slice();
        tableauCopy[p] = [...tableauCopy[p], top];
        return [wasteCopy, tableauCopy];
    }
    return [waste, tableau];
}

// Shift cards between piles in the tableau.
export function movePile(tableau: Tableau, p1: number, p2: number, idx: number): Tableau {
    const top = tableau[p1][idx];
    const bottom = tableau[p2][tableau[p2].length - 1];
    if (isNextTableauCard(top, bottom)) {
        const tab = tableau.slice();
        const pile1 = tab[p1].slice(0, idx);
        const pile2 = tab[p2].concat(tab[p1].slice(idx));
        tab[p1] = pile1;
        tab[p2] = pile2;
        return tab;
    }
    return tableau;
}

// Ensure ace is in the right pile, according to its suit.
function moveToFoundation(foundation: Foundation, card: PlayingCard, pileIndex: number): Foundation {
    const foundationCopy = foundation.slice();
    if (card.value === CardValue.Ace) {
        foundationCopy[card.suit] = foundationCopy[card.suit].concat(card);
    } else {
        foundationCopy[pileIndex] = foundationCopy[pileIndex].concat(card);
    }
    return foundationCopy;
}

// Move card from waste to foundation pile.
export function moveWasteToFoundation(waste: Waste, foundation: Foundation, idx: number): [Waste, Foundation] {
    const top = waste[waste.length - 1];
    const bottom = foundation[idx][foundation[idx].length - 1];
    if (isNextFoundationCard(top, bottom)) {
        return [waste.slice(0, -1), moveToFoundation(foundation, top, idx)];
    }
    return [waste, foundation];
}

// Move a card to the foundation from a tableau pile.
export function moveTableauCardToFoundation(
    tableau: Tableau,
    p: number,
    c: number,
    foundation: Foundation,
    idx: number): [Tableau, Foundation]
{
    const top = tableau[p][c];
    const bottom = foundation[idx][foundation[idx].length - 1];
    if (isNextFoundationCard(top, bottom)) {
        const tableauCopy = tableau.slice();
        tableauCopy[p] = tableauCopy[p].slice(0, c);
        const foundationCopy = moveToFoundation(foundation, top, idx);
        return [tableauCopy, foundationCopy];
    }
    return [tableau, foundation];
}

// Flip a card if it's on the top of a pile.
export function flipCardInTableau(tableau: Tableau, pileIndex: number, cardIndex: number): Tableau {
    if (cardIndex === tableau[pileIndex].length - 1) {
        const tableauCopy = [...tableau];
        const pile = [...tableauCopy[pileIndex]];
        pile[cardIndex] = flipCardUp(pile[cardIndex]);
        tableauCopy[pileIndex] = pile;
        return tableauCopy;
    }
    return tableau;
}

export function getCard(suit: CardSuit, value: CardValue, faceUp: boolean = false): PlayingCard {
    return {suit, value, faceUp, key: `${suit}${value}`};
}

function flipCardUp(c: PlayingCard): PlayingCard {
    return {
        ...c,
        faceUp: true,
    };
}

function flipCardDown(c: PlayingCard): PlayingCard {
    return {
        ...c,
        faceUp: false,
    };
}

function isNextTableauCard(top: PlayingCard, bottom: PlayingCard): boolean {
    return (bottom ? isNextCard(top, bottom, -1) && isAltSuit(top, bottom) : top.value === CardValue.King);
}

function isNextFoundationCard(top: PlayingCard, bottom: PlayingCard): boolean {
    return (bottom ? isNextCard(top, bottom) && isSameSuit(top, bottom) : top.value === CardValue.Ace);
}

function isNextCard(top: PlayingCard, bottom: PlayingCard, increment: number = 1): boolean {
    return top.value === bottom.value + increment;
}

function isAltSuit(c1: PlayingCard, c2: PlayingCard): boolean {
    return c1.suit % 2 !== c2.suit % 2;
}

function isSameSuit(c1: PlayingCard, c2: PlayingCard): boolean {
    return c1.suit === c2.suit;
}

export function initGame(): Solitaire {
    const stock = populateStock(buildDeck());
    const [remainingStock, tableau] = populateTableau(stock);
    return {
        foundation: [[], [], [], []],
        tableau: tableau,
        stock: remainingStock,
        waste: [],
    };
}