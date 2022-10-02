import React, { useState } from "react";
import {
    flipCardInTableau,
    initGame,
    movePile,
    moveStockToWaste,
    moveTableauCardToFoundation,
    moveWasteToFoundation,
    moveWasteToTableau,
    recycleWastePile,
} from "../../services/gameService";
import { DropFunction } from "../../services/dragdropService";
import { AppContext } from "../../enums/AppContext";
import TableauComponent from "../TableauComponent";
import StockComponent from "../StockComponent";
import WasteComponent from "../WasteComponent";
import FoundationComponent from "../FoundationComponent";
import "./styles.css";
import { Foundation } from "../../model";

export default function AppComponent() {
    const solitaire = initGame();
    const [stock, setStock] = useState(solitaire.stock);
    const [waste, setWaste] = useState(solitaire.waste);
    const [tableau, setTableau] = useState(solitaire.tableau);
    const [foundation, setFoundation] = useState(solitaire.foundation);

    let handleDrop: DropFunction = (
        contextTo,
        contextFrom,
        payloadTo,
        payloadFrom
    ) => {
        if (contextTo === AppContext.Tableau) {
            if (contextFrom === AppContext.Tableau) {
                setTableau(
                    movePile(
                        tableau,
                        payloadFrom.pileIndex,
                        payloadTo.pileIndex,
                        payloadFrom.cardIndex
                    )
                );
            }
            if (contextFrom === AppContext.Waste) {
                const [newWaste, newTableau] = moveWasteToTableau(
                    waste,
                    tableau,
                    payloadTo.pileIndex
                );
                setTableau(newTableau);
                setWaste(newWaste);
            }
        }
        if (contextTo === AppContext.Foundation) {
            if (contextFrom === AppContext.Tableau) {
                const [newTableau, newFoundation] = moveTableauCardToFoundation(
                    tableau,
                    payloadFrom.pileIndex,
                    payloadFrom.cardIndex,
                    foundation,
                    payloadTo.pileIndex
                );
                setFoundation(newFoundation);
                setTableau(newTableau);
            }
            if (contextFrom === AppContext.Waste) {
                const [newWaste, newFoundation] = moveWasteToFoundation(
                    waste,
                    foundation,
                    waste[payloadFrom.cardIndex].suit
                );
                setWaste(newWaste);
                setFoundation(newFoundation);
            }
        }
    };

    let handleClick =
        (context: string) =>
        (cardIndex: number, pileIndex: number = 0) => {
            if (context === AppContext.Tableau && cardIndex !== undefined) {
                setTableau(flipCardInTableau(tableau, pileIndex, cardIndex));
            }
            if (context === AppContext.Stock) {
                let newStock, newWaste;
                if (stock.length) {
                    [newStock, newWaste] = moveStockToWaste(stock, waste);
                } else {
                    newStock = recycleWastePile(waste);
                    waste.length = 0;
                    newWaste = waste;
                }
                setWaste(newWaste);
                setStock(newStock);
            }
        };

    let handleDoubleClick =
        (context: string) =>
        (cardIndex: number, pileIndex: number = 0) => {
            if (context === AppContext.Tableau) {
                const [newTableau, newFoundation] = moveTableauCardToFoundation(
                    tableau,
                    pileIndex,
                    cardIndex,
                    foundation,
                    tableau[pileIndex][cardIndex].suit
                );
                setTableau(newTableau);
                setFoundation(newFoundation);
            }
            if (context === AppContext.Waste) {
                const [newWaste, newFoundation] = moveWasteToFoundation(
                    waste,
                    foundation,
                    waste[cardIndex].suit
                );
                setWaste(newWaste);
                setFoundation(newFoundation);
            }
        };

    return (
        <div className="game">
            <FoundationComponent
                foundation={foundation}
                onDrop={handleDrop}
            />
            <WasteComponent
                waste={waste}
                onDoubleClick={handleDoubleClick(AppContext.Waste)}
            />
            <StockComponent
                stock={stock}
                onClick={handleClick(AppContext.Stock)}
                onDrop={handleDrop}
            />
            {/* <div className="top-container">
                <div className="stock-container">
                </div>
            </div> */}
            <TableauComponent
                tableau={tableau}
                onDrop={handleDrop}
                onDoubleClick={handleDoubleClick(AppContext.Tableau)}
                onClick={handleClick(AppContext.Tableau)}
            />
        </div>
    );
}
