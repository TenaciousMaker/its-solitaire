import React from 'react';
import { PlayingCard } from '../App/model';

export const CARD_VALUE_DISPLAY = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export const SUIT_VALUE_DISPLAY = ['♣︎','♦︎','♠︎','♥︎'];
export const SUIT_CLASS = ['club','diamond','spade','heart'];

type Props = PlayingCard & {
  cardIndex: number;
  pileIndex: number;
  onDrop: (pile: number, card: number) => void;
  onFlip: (card: number) => void;
};

export default function PlayingCardComponent({suit, value, faceUp, cardIndex, pileIndex, onDrop, onFlip}: Props) {
    const containerClass = `card-container${faceUp ? ' flipped' : ''}`;
    const cardClass = `card ${SUIT_CLASS[suit]}`;
    const cardDisplay = `${CARD_VALUE_DISPLAY[value]} ${SUIT_VALUE_DISPLAY[suit]}`;
    const cardStyles = {
        // Set offset for top of card
        height: faceUp ? `2rem` : `2px`,
    };

    const onHandleDrop = (pileIndex: number, cardIndex: number) => {
        onDrop(pileIndex, cardIndex);
    }

    return (
        <div className={containerClass} style={cardStyles}>
            <div className='card-inner'>
                {faceUp &&
                    <div className={cardClass} {...getDraggable(String(cardIndex), String(pileIndex))} {...getDroppable(onHandleDrop)}>{cardDisplay}</div>
                }
                <div className='card-back' onClick={() => onFlip(cardIndex)}></div>
            </div>
        </div>
    );
}

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