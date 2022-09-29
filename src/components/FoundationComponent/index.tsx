import React from "react";
import { Foundation, Pile } from "../../model";
import { DropFunction, getDraggable, getDroppable } from "../../services/dragdropService";
import { AppContext } from "../../enums/AppContext";
import CardStackComponent from "../CardStackComponent";
import "./styles.css";

type Props = {
    foundation: Foundation;
    onDrop: DropFunction,
};

export default function FoundationComponent({ foundation, onDrop }: Props) {
    return (
        <div className="foundation">
            {foundation.map((pile: Pile, pileIndex: number) => {
                const dropSetup = (pidx: number) => (cardIndex: number) => {
                    const dropPayload = {
                        pileIndex: pidx,
                        cardIndex,
                    };
                    return getDroppable(AppContext.Foundation, dropPayload, onDrop);
                }
                const dragSetup = (pidx: number) => (cardIndex: number) => {
                    const dropPayload = {
                        pileIndex: pidx,
                        cardIndex,
                    };
                    return getDraggable(AppContext.Foundation, dropPayload);
                }
                return (
                    <CardStackComponent
                        key={pileIndex}
                        pile={pile}
                        onDropSetup={dropSetup(pileIndex)}
                        onDragSetup={dragSetup(pileIndex)}
                    />
                );
            })}
        </div>
    );
}
