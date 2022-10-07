import React from "react";
import { AppContext } from "../../enums/AppContext";
import { Stock } from "../../model";
import { DropFunction, getDraggable, getDroppable } from "../../services/dragdropService";
import PileComponent from "../PileComponent";
import "./styles.css";

type Props = {
    stock: Stock;
    onClick(cardIndex: number): void;
    onDrop:DropFunction;
};

export default function StockComponent({
    stock,
    onClick,
    onDrop,
}: Props) {
    function handleClick(cardIndex: number) {
        onClick(cardIndex);
    }
    const dropSetup = (cardIndex: number) => {
        return getDroppable(AppContext.Stock, {cardIndex}, onDrop);
    }
    const dragSetup = (cardIndex: number) => {
        return getDraggable(AppContext.Stock, {cardIndex});
    }
    return (
        <section className={AppContext.Stock}>
            <PileComponent
                pile={stock}
                onClick={handleClick}
                onDropSetup={dropSetup}
                onDragSetup={dragSetup}
            />
        </section>
    );
}
