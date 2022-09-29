import React, { useState } from 'react';
import { flipCardInTableau, initGame, movePile, moveStockToWaste, moveTableauCardToFoundation, moveWasteToFoundation, moveWasteToTableau } from '../../services/gameService';
import { DropFunction } from '../../services/dragdropService';
import { AppContext } from "../../enums/AppContext";
import TableauComponent from '../TableauComponent';
import StockComponent from '../StockComponent';
import WasteComponent from '../WasteComponent';
import FoundationComponent from '../FoundationComponent';
import './styles.css';

export default function AppComponent() {
    const solitaire = initGame();
    const [stock, setStock] = useState(solitaire.stock);
    const [waste, setWaste] = useState(solitaire.waste);
    const [tableau, setTableau] = useState(solitaire.tableau);
    const [foundation, setFoundation] = useState(solitaire.foundation);

    let handleDrop:DropFunction = (contextTo, contextFrom, payloadTo, payloadFrom) => {
        console.log(contextTo, contextFrom, payloadTo, payloadFrom)
        if (contextTo === AppContext.Tableau) {
            if (contextFrom === AppContext.Tableau) {
                setTableau(movePile(tableau, payloadFrom.pileIndex, payloadTo.pileIndex, payloadFrom.cardIndex));
            }
            if (contextFrom === AppContext.Waste) {
                const [newWaste, newTableau] = moveWasteToTableau(waste, tableau, payloadTo.pileIndex);
                setTableau(newTableau);
                setWaste(newWaste);
            }
        }
        if (contextTo === AppContext.Foundation) {
            if (contextFrom === AppContext.Tableau) {
                const [newTableau, newFoundation] = moveTableauCardToFoundation(tableau, payloadFrom.pileIndex, payloadFrom.cardIndex, foundation, payloadTo.pileIndex);
                setFoundation(newFoundation);
                setTableau(newTableau);
            }
        }
    }

    let handleClick = (context: string) => (cardIndex: number, pileIndex: number = 0) => {
        if (context === AppContext.Tableau) {
            setTableau(flipCardInTableau(tableau, pileIndex, cardIndex));
        }
        if (context === AppContext.Stock) {
            const [newStock, newWaste] = moveStockToWaste(stock, waste);
            setWaste(newWaste);
            setStock(newStock);
        }
    }

    let handleDoubleClick = (context: string) => (cardIndex: number, pileIndex: number = 0) => {
        if (context === AppContext.Tableau) {
            setTableau(flipCardInTableau(tableau, pileIndex, cardIndex));
        }
        if (context === AppContext.Waste) {
            const [newWaste, newFoundation] = moveWasteToFoundation(waste, foundation, waste[cardIndex].suit)
            setWaste(newWaste);
            setFoundation(newFoundation);
        }
    }

    return (
        <div className='game'>
            <div className='top-container'>
                <FoundationComponent foundation={foundation} onDrop={handleDrop} />
                <div className='spacer'></div>
                <WasteComponent waste={waste} onDoubleClick={handleDoubleClick(AppContext.Waste)} />
                <StockComponent stock={stock} onClick={handleClick(AppContext.Stock)} onDrop={handleDrop} />
            </div>
            <TableauComponent tableau={tableau} onDrop={handleDrop} onClick={handleClick(AppContext.Tableau)} />
        </div>
    );
}