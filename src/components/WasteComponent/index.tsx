import React from "react";
import { AppContext } from "../../enums/AppContext";
import { Waste } from "../../model";
import { getDraggable } from "../../services/dragdropService";
import PileComponent from "../PileComponent";
import "./styles.css";

type Props = {
    waste: Waste;
    onDoubleClick(cardIndex: number): void;
};

export default function WasteComponent({
    waste,
    onDoubleClick,
}: Props) {
    function handleDoubleClick(cardIndex: number) {
        onDoubleClick(cardIndex);
    }
    const dragSetup = (cardIndex: number) => {
        // Only allow dragging the top card.
        if (cardIndex === waste.length - 1) {
            return getDraggable(AppContext.Waste, {cardIndex});
        }
        return {};
    }
    return (
        <section className={AppContext.Waste}>
            <PileComponent
                pile={waste}
                pileType={AppContext.Waste}
                onDoubleClick={handleDoubleClick}
                onDragSetup={dragSetup}
            />
        </section>
    );
}
