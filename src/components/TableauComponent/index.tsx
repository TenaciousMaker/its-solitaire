import React from "react";
import { Tableau, Pile } from "../../model";
import CardStackComponent from "../CardStackComponent";
import "./styles.css";
import { DropFunction, getDraggable, getDroppable } from "../../services/dragdropService";
import { AppContext } from "../../enums/AppContext";

type Props = {
    tableau: Tableau;
    onDrop: DropFunction,
    onClick: (pileIndex: number, cardIndex: number) => void;
};

export default function TableauComponent({ tableau, onDrop, onClick }: Props) {
    return (
        <div className="tableau">
            {tableau.map((pile: Pile, pileIndex: number) => {
                function handleClick(cardIndex: number) {
                    onClick(cardIndex, pileIndex);
                }
                function handleDoubleClick(cardIndex: number) {
                    // onFlip(pileIndex, cardIndex);
                }
                const dropSetup = (pidx: number) => (cardIndex?: number) => {
                    const dropPayload = {
                        pileIndex: pidx,
                        cardIndex,
                    };
                    return getDroppable(AppContext.Tableau, dropPayload, onDrop);
                }
                const dragSetup = (pidx: number) => (cardIndex: number) => {
                    const dropPayload = {
                        pileIndex: pidx,
                        cardIndex,
                    };
                    return getDraggable(AppContext.Tableau, dropPayload);
                }
                return (
                    <CardStackComponent
                        key={pileIndex}
                        pile={pile}
                        fanDirection="down"
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        onDropSetup={dropSetup(pileIndex)}
                        onDragSetup={dragSetup(pileIndex)}
                    />
                );
            })}
        </div>
    );
}
