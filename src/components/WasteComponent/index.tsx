import React from "react";
import { AppContext } from "../../enums/AppContext";
import { Waste } from "../../model";
import { getDraggable } from "../../services/dragdropService";
import CardStackComponent from "../CardStackComponent";
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
        if (cardIndex === waste.length - 1) {
            return getDraggable(AppContext.Waste, {cardIndex});
        }
        return {};
    }
    return (
        <div className='waste'>
            <CardStackComponent
                pile={waste}
                pileType={AppContext.Waste}
                onDoubleClick={handleDoubleClick}
                onDragSetup={dragSetup}
            />
        </div>
    );
}
