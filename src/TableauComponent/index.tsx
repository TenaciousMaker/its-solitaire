import React from "react";
import { Tableau } from "../model";
import CardStackComponent from "../CardStackComponent";
import './styles.css';

type Props = {
    tableau: Tableau;
    onMove: (p1: number, p2: number, top: number) => void;
    onFlip: (pileIndex: number, cardIndex: number) => void;
};

// {...getDraggable(String(cardIndex), String(pileIndex))} {...getDroppable(onHandleDrop)}


type Droppable = {
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void,
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void,
};

type Draggable = {
    draggable: true;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void,
};

export function getDroppable(onDropAction: (pile: number, card: number) => void): Droppable {
    return {
        onDragOver(event) {
            event.preventDefault();
        },
        onDrop({dataTransfer}) {
            const cardIndex = dataTransfer?.getData('card');
            const pileIndex = dataTransfer?.getData('pile');
            if (cardIndex && pileIndex) {
                onDropAction(parseInt(pileIndex, 10), parseInt(cardIndex, 10));
            }
        }
    }
}

function getDraggable(card: string, pile: string): Draggable {
    return {
        draggable: true,
        onDragStart({dataTransfer}) {
            dataTransfer?.setData('card', card);
            dataTransfer?.setData('pile', pile);
        }
    }
}

export default function TableauComponent({ tableau, onMove, onFlip }: Props) {
    return (
        <div className="tableau">
            {tableau.map((pile, pileIndex) => {
                const handleDrop = (fromPile: number, cardIndex: number) => {
                    onMove(fromPile, pileIndex, cardIndex);
                };
                function handleClick(cardIndex: number) {
                    onFlip(pileIndex, cardIndex);
                }
                function handleDoubleClick(cardIndex: number) {
                    // onFlip(pileIndex, cardIndex);
                }
                return (
                    <CardStackComponent pile={pile} onClick={handleClick} onDoubleClick={handleDoubleClick} fanDirection='down' />
                );
            })}
        </div>
    );
}
