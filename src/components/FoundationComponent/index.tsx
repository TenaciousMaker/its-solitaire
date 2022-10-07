import React from "react";
import { Foundation, Pile } from "../../model";
import { DropFunction, getDraggable, getDroppable } from "../../services/dragdropService";
import { AppContext } from "../../enums/AppContext";
import PileComponent from "../PileComponent";
import "./styles.css";

type Props = {
    foundation: Foundation;
    onDrop: DropFunction,
};

export default function FoundationComponent({ foundation, onDrop }: Props) {
    return (
        <section className={AppContext.Foundation}>
            <ul>
                {foundation.map((pile: Pile, pileIndex: number) => {
                    const dropSetup = (pidx: number) => (cardIndex?: number) => {
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
                        <li key={pileIndex}>
                            <PileComponent
                                pile={pile}
                                onDropSetup={dropSetup(pileIndex)}
                                onDragSetup={dragSetup(pileIndex)}
                            />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
