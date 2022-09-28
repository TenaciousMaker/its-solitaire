import React from "react";
import { Tableau } from "../App/model";
import PlayingCard, { getDroppable } from "../PlayingCard";

type Props = {
    tableau: Tableau;
    onMove: (p1: number, p2: number, top: number) => void;
    onFlip: (pileIndex: number, cardIndex: number) => void;
};

export default function TableauComponent({ tableau, onMove, onFlip }: Props) {
    return (
        <div className="tableau">
            {tableau.map((pile, pileIndex) => {
                const handleDrop = (fromPile: number, cardIndex: number) => {
                    onMove(fromPile, pileIndex, cardIndex);
                };
                return (
                    <div className="pile" {...getDroppable(handleDrop)}>
                        {pile.map((card, cardIndex) => {
                            function handleFlip() {
                                onFlip(pileIndex, cardIndex);
                            }
                            return (
                                <PlayingCard
                                    suit={card.suit}
                                    value={card.value}
                                    faceUp={card.faceUp}
                                    cardIndex={cardIndex}
                                    pileIndex={pileIndex}
                                    onDrop={handleDrop}
                                    onFlip={handleFlip}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
