import { Solitaire } from "../../model";
import { CardValue } from "../../enums/CardValue";
import { CardSuit } from "../../enums/CardSuit";
import {
    getCard,
    buildDeck,
    populateStock,
    populateTableau,
    movePile,
    isNextCard,
    isAltSuit,
    isSameSuit,
    moveTableauCardToFoundation,
    moveStockToWaste,
    recycleWastePile,
    moveWasteToTableau,
    moveWasteToFoundation,
    flipCardInTableau,
    initGame,
} from "../gameService";

describe("service", () => {
  it(`builds a deck of cards`, () => {
    const deck = buildDeck();
    expect(deck).toHaveLength(52);
  });

  it(`'shuffles' the deck and returns a stockpile of random cards`, () => {
    const deck = buildDeck();
    const stock = populateStock(deck.slice());
    expect(stock).toHaveLength(52);
    const isNotOrdered = deck.some((card, idx) => {
      return stock[idx] !== card;
    });
    expect(isNotOrdered).toBeTruthy();
  });

  it(`creates the tableau`, () => {
    const deck = buildDeck();
    const stock = populateStock(deck.slice());
    const [remainingStock, tableau] = populateTableau(stock.slice());
    expect(remainingStock.length).toBeLessThan(stock.length);
    expect(tableau).toHaveLength(7);
    tableau.forEach((x, idx) => {
      expect(x).toHaveLength(idx + 1);
      const card = x[x.length - 1];
      expect(card.faceUp).toBeTruthy();
    });
  });

  it(`checks if top card can be played on bottom card`, () => {
    const c1 = getCard(CardSuit.Club, CardValue.Ace);
    const c2 = getCard(CardSuit.Diamond, CardValue.Ace);
    const c3 = getCard(CardSuit.Diamond, CardValue.Two);
    expect(isNextCard(c1, c2)).toBeFalsy();
    expect(isNextCard(c2, c1)).toBeFalsy();
    expect(isNextCard(c3, c2)).toBeTruthy();
    expect(isNextCard(c2, c3, -1)).toBeTruthy();
  });

  it(`checks if two cards are in alternating suit colors`, () => {
    const c1 = getCard(CardSuit.Club, CardValue.Ace);
    const c2 = getCard(CardSuit.Heart, CardValue.Two);
    expect(isAltSuit(c1, c2)).toBeTruthy();
  });

  it(`checks if two cards are in the same suit`, () => {
    const c1 = getCard(3, CardValue.Ace);
    const c2 = getCard(3, CardValue.Two);
    expect(isSameSuit(c1, c2)).toBeTruthy();
  });

  it(`moves card(s) from stock pile to waste pile`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace, true);
    const card2 = getCard(CardSuit.Diamond, CardValue.Two);
    const card3 = getCard(CardSuit.Heart, CardValue.Three);
    const stock = [card2, card3];
    const waste = [card1];
    const [stock2, waste2] = moveStockToWaste(stock, waste);
    expect(stock2).toEqual([card2]);
    expect(waste2).toEqual([card1, {...card3, faceUp: true}]);
  });

  it(`recycles waste pile`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const card2 = getCard(CardSuit.Diamond, CardValue.Two);
    const card3 = getCard(CardSuit.Heart, CardValue.Three);
    const stock = recycleWastePile([card1, card2, card3]);
    expect(stock).toEqual([card3, card2, card1]);
  });

  it(`moves a card from the waste pile to a tableau pile`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const card2 = getCard(CardSuit.Diamond, CardValue.Three);
    const card3 = getCard(CardSuit.Spade, CardValue.Two);
    const waste = [card1, card3];
    const tableau = [[card2]];
    let [waste2, tableau2] = moveWasteToTableau(waste, tableau, 0);
    expect(waste2).toEqual([card1]);
    expect(tableau2).toEqual([[card2, card3]]);
  });

  it(`does not move a card from the waste pile to a tableau pile if invalid`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const card2 = getCard(CardSuit.Diamond, CardValue.Two);
    const card3 = getCard(CardSuit.Heart, CardValue.Three);
    const waste = [card2, card1];
    const tableau = [[card3]];
    let [waste2, tableau2] = moveWasteToTableau(waste, tableau, 0);
    expect(waste2).toEqual(waste);
    expect(tableau2).toEqual(tableau);
  });

  it(`moves a king card from the waste pile to an empty tableau pile`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.King);
    const waste = [card1];
    const tableau = [[]];
    const [waste2, tableau2] = moveWasteToTableau(waste, tableau, 0);
    expect(waste2).toEqual([]);
    expect(tableau2).toEqual([[card1]]);
  });

  it(`moves a card from the waste pile to a foundation pile`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const card2 = getCard(CardSuit.Diamond, CardValue.Two);
    const card3 = getCard(CardSuit.Diamond, CardValue.Three);
    const card4 = getCard(CardSuit.Diamond, CardValue.Ace);
    const waste = [card1, card3];
    const foundation = [[card4, card2]];
    let [waste2, foundation2] = moveWasteToFoundation(waste, foundation, 0);
    expect(waste2).toEqual([card1]);
    expect(foundation2).toEqual([[card4, card2, card3]]);
  });

  it(`does not move a card from the waste pile to a foundation pile if invalid`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const card2 = getCard(CardSuit.Diamond, CardValue.Two);
    const card3 = getCard(CardSuit.Heart, CardValue.Three);
    const waste = [card2, card1];
    const foundation = [[card3]];
    let [waste2, foundation2] = moveWasteToFoundation(waste, foundation, 0);
    expect(waste2).toEqual(waste);
    expect(foundation2).toEqual(foundation);
  });

  it(`moves a king card from the waste pile to an empty foundation pile`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const waste = [card1];
    const foundation = [[]];
    const [waste2, foundation2] = moveWasteToFoundation(waste, foundation, 0);
    expect(waste2).toEqual([]);
    expect(foundation2).toEqual([[card1]]);
  });

  it(`moves card(s) from one tableau pile to another`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const card2 = getCard(CardSuit.Diamond, CardValue.Two);
    const card3 = getCard(CardSuit.Spade, CardValue.Three);
    const tableau = [[card3], [card2, card1]];
    const tableau2 = movePile(tableau, 1, 0, 0);
    expect(tableau2).toEqual([[card3, card2, card1], []]);
  });

  it(`does not move card(s) from one tableau pile to another if invalid`, () => {
    const card1 = getCard(CardSuit.Diamond, CardValue.Ace);
    const card2 = getCard(CardSuit.Diamond, CardValue.Two);
    const card3 = getCard(CardSuit.Heart, CardValue.Three);
    const tableau = [[card1], [card2, card3]];
    const tableau2 = movePile(tableau, 1, 0, 0);
    expect(tableau2).toEqual([[card1], [card2, card3]]);
  });

  it(`moves a card from tableau to foundation`, () => {
    const card1 = getCard(CardSuit.Club, CardValue.Ace);
    const card2 = getCard(CardSuit.Heart, CardValue.Ace);
    const card3 = getCard(CardSuit.Heart, CardValue.Two);
    const foundation = [[card2]];
    const tableau = [[card1], [card3]];
    const [tableau2, foundation2] = moveTableauCardToFoundation(
      tableau,
      1,
      0,
      foundation,
      0
    );
    expect(foundation2).toEqual([[card2, card3]]);
    expect(tableau2).toEqual([[card1], []]);
  });

  it(`places an ace in its correct foundation pile, according to suit`, () => {
    const card1 = getCard(CardSuit.Diamond, CardValue.Two);
    const tableau = [[card1]];
    const foundation = [[]];
    const [tableau2, foundation2] = moveTableauCardToFoundation(
      tableau,
      0,
      0,
      foundation,
      0
    );
    expect(tableau2).toEqual([[card1]]);
    expect(foundation2).toEqual([[]]);
  });

  it(`does not move a card from tableau to foundation if invalid`, () => {
    const card1 = getCard(CardSuit.Diamond, CardValue.Two);
    const tableau = [[card1]];
    const foundation = [[]];
    const [tableau2, foundation2] = moveTableauCardToFoundation(
      tableau,
      0,
      0,
      foundation,
      0
    );
    expect(tableau2).toEqual([[card1]]);
    expect(foundation2).toEqual([[]]);
  });

  it(`flips a card in the tableau`, () => {
    const card1 = getCard(CardSuit.Diamond, CardValue.Two);
    const tableau = [[card1]];
    const tableau2 = flipCardInTableau(tableau, 0, 0);
    expect(tableau[0][0].faceUp).toBeFalsy();
    expect(tableau2[0][0].faceUp).toBeTruthy();
  });

  it(`initializes the game`, () => {
    const game = initGame();
    expect(game.stock).toHaveLength(24);
    expect(game.tableau).toHaveLength(7);
    expect(game.foundation).toHaveLength(4);
    expect(game.waste).toHaveLength(0);
  });
});
