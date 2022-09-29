import React from 'react';
import { PlayingCard } from '../model';
import './styles.css';

export const CARD_VALUE_DISPLAY = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export const SUIT_VALUE_DISPLAY = ['♣︎','♦︎','♠︎','♥︎'];
export const SUIT_CLASS = ['club','diamond','spade','heart'];

type Props = PlayingCard & {
    onClick?():void;
    onDoubleClick?():void;
};

export default function CardComponent({suit, value, faceUp, onClick, onDoubleClick}: Props) {
    const containerClass = `card-container${faceUp ? ' flipped' : ''}`;
    const cardClass = `card ${SUIT_CLASS[suit]}`;
    const cardDisplay = `${CARD_VALUE_DISPLAY[value]} ${SUIT_VALUE_DISPLAY[suit]}`;
    const cardStyles = {
        // Set offset for top of card
        height: faceUp ? `2rem` : `2px`,
    };

    return (
        <div className={containerClass} style={cardStyles}>
            <div className='card-inner'>
                {faceUp &&
                    <div className={cardClass}>{cardDisplay}</div>
                }
                <div className='card-back' onClick={onClick} onDoubleClick={onDoubleClick}></div>
            </div>
        </div>
    );
}