import { Pile, Stock, Tableau, PlayingCard, Waste, Foundation, CardValue, Solitaire, CardSuit } from "./model";

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
    const stock2 = stock.slice();
    let card = stock2.pop();
    if (card) {
        card = flipCardUp(card);
        return [stock2, [...waste, card]];
    }
    return [stock, waste];
}

// Recycle waste pile back to stock.
export function recycleWastePile(waste: Waste): Stock {
    return waste.slice().reverse().map(card => {
        if (card) {
            flipCardDown(card);
        }
        return card;
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

// Move card from waste to foundation pile.
export function moveWasteToFoundation(waste: Waste, foundation: Foundation, p: number): [Waste, Foundation] {
    const wasteCopy = waste.slice();
    const top = wasteCopy.pop();
    const bottom = foundation[p][foundation[p].length - 1];
    if (top && isNextFoundationCard(top, bottom)) {
        const foundationCopy = foundation.slice();
        foundationCopy[p] = [...foundationCopy[p], top];
        return [wasteCopy, foundationCopy];
    }
    return [waste, foundation];
}

// Shift cards between piles in the tableau.
export function movePile(tableau: Tableau, p1: number, p2: number, idx: number): Tableau {
    console.log(p1, p2, idx, tableau)
    const top = tableau[p1][idx];
    const bottom = tableau[p2][tableau[p2].length - 1];
    console.log(top, bottom)
    if (isNextTableauCard(top, bottom)) {
        console.log('YEP')
        const tab = tableau.slice();
        const pile1 = tab[p1].slice(0, idx);
        const pile2 = tab[p2].concat(tab[p1].slice(idx));
        tab[p1] = pile1;
        tab[p2] = pile2;
        return tab;
    }
    return tableau;
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
        const foundationCopy = foundation.slice();
        foundationCopy[idx] = foundationCopy[idx].concat(top);
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
    return tableau
}

// Create a new card.
export function getCard(suit: CardSuit, value: CardValue, faceUp: boolean = false): PlayingCard {
    return {suit, value, faceUp};
}

export function isNextTableauCard(top: PlayingCard | undefined, bottom: PlayingCard | undefined): boolean {
    return (bottom ? isNextCard(top, bottom) && isAltSuit(top, bottom) : top?.value === CardValue.King);
}

export function isNextFoundationCard(top: PlayingCard | undefined, bottom: PlayingCard | undefined): boolean {
    return (bottom ? isNextCard(top, bottom) && isSameSuit(top, bottom) : top?.value === CardValue.Ace);
}

export function isNextCard(top: PlayingCard | undefined, bottom: PlayingCard | undefined): boolean {
    return true;//bottom ? top?.value === bottom.value - 1 : top?.value === 0;
}

export function isAltSuit(c1: PlayingCard | undefined, c2: PlayingCard | undefined): boolean {
    return true;// c1 !== undefined && c2 !== undefined && (c1.suit % 2 !== c2.suit % 2);
}

export function isSameSuit(c1: PlayingCard | undefined, c2: PlayingCard | undefined): boolean {
    return c2 ? c1?.suit === c2.suit : true;
}

export function flipCardUp(c: PlayingCard): PlayingCard {
    if (c) {
        return {
            ...c,
            faceUp: true,
        };
    }
    return c;
}

export function flipCardDown(c: PlayingCard): PlayingCard {
    if (c) {
        return {
            ...c,
            faceUp: false,
        };
    }
    return c;
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