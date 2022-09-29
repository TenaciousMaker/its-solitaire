import React, { useState } from 'react';
import { flipCardInTableau, initGame, movePile } from './service';
import TableauComponent from '../TableauComponent';
import './styles.css';

export default function AppComponent() {
    const solitaire = initGame();
    const [stock, setStock] = useState(solitaire.stock);
    const [waste, setWaste] = useState(solitaire.waste);
    const [tableau, setTableau] = useState(solitaire.tableau);
    const [foundation, setFoundation] = useState(solitaire.foundation);

    function handleMove(p1: number, p2: number, card: number) {
        setTableau(movePile(tableau, p1, p2, card));
    }

    function handleFlip(pileIndex: number, cardIndex: number) {
        setTableau(flipCardInTableau(tableau, pileIndex, cardIndex));
    }

    return (
        <div className='game'>
            <TableauComponent tableau={tableau} onMove={handleMove} onFlip={handleFlip} />
        </div>
    );
}
