import React from 'react';
import { PlayingCard } from '../../model';
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
    const cardClass = `card-front ${SUIT_CLASS[suit]}`;

    return (
        <div className={containerClass}>
            <div className='card-inner'>
                <div className='card-back' onClick={onClick}></div>
                {faceUp &&
                    <div className={cardClass} onDoubleClick={onDoubleClick}>
                        <div className='card-corner card-corner-top'>
                            <div className='value-display'>{CARD_VALUE_DISPLAY[value]}</div>
                            <div className='suit-display'>{SUIT_VALUE_DISPLAY[suit]}</div>
                        </div>
                        <div className='card-center'>
                            <div className='suit-display'>{SUIT_VALUE_DISPLAY[suit]}</div>
                        </div>
                        <div className='card-corner card-corner-bottom'>
                            <div className='value-display'>{CARD_VALUE_DISPLAY[value]}</div>
                            <div className='suit-display'>{SUIT_VALUE_DISPLAY[suit]}</div>
                        </div>
                    </div>}
            </div>
        </div>
    );
}