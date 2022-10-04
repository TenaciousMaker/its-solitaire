import React from "react";
import { Tableau, Pile } from "../../model";
import { DropFunction, getDraggable, getDroppable } from "../../services/dragdropService";
import { AppContext } from "../../enums/AppContext";
import PileComponent from "../PileComponent";
import "./styles.css";

type Props = {
    tableau: Tableau;
    onDrop: DropFunction,
    onClick: (cardIndex: number, pileIndex: number) => void;
    onDoubleClick: (cardIndex: number, pileIndex: number) => void;
};

export default function TableauComponent({ tableau, onDrop, onClick, onDoubleClick }: Props) {
    return (
        <div className={AppContext.Tableau}>
            {tableau.map((pile: Pile, pileIndex: number) => {
                function handleClick(cardIndex: number) {
                    onClick(cardIndex, pileIndex);
                }
                function handleDoubleClick(cardIndex: number) {
                    onDoubleClick(cardIndex, pileIndex);
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
                    <PileComponent
                        key={pileIndex}
                        pile={pile}
                        pileType={AppContext.Tableau}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        onDropSetup={dropSetup(pileIndex)}
                        onDragSetup={dragSetup(pileIndex)}
                        renderRecursively
                    />
                );
            })}
        </div>
    );
}
