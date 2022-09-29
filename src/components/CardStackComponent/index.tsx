import React from "react";
import { Pile } from "../../model";
import CardComponent from "../CardComponent";
import "./styles.css";

type Props = {
    pile: Pile;
    fanDirection?: "left" | "down";
    onClick?(cardIndex: number): void;
    onDoubleClick?(cardIndex: number): void;
    onDragSetup(cardIndex: number): void;
    onDropSetup?(cardIndex?: number): void;
};

/*
Handles stacking/nesting of cards and drag/drop.
 */
export default function CardStackComponent({
    pile,
    onClick,
    onDoubleClick,
    onDragSetup,
    onDropSetup,
    fanDirection,
}: Props) {
    const pileClass = `pile${
        fanDirection ? " fan-direction-" + fanDirection : ""
    }`;

    return (
        <div className={pileClass} {...(onDropSetup ? onDropSetup() : {})}>
            {pile.map((card, cardIndex) => {
                function handleClick() {
                    if (onClick) {
                        onClick(cardIndex);
                    }
                }
                function handleDoubleClick() {
                    if (onDoubleClick) {
                        onDoubleClick(cardIndex);
                    }
                }
                return (
                    <div
                        {...(onDragSetup ? onDragSetup(cardIndex) : {})}
                        {...(onDropSetup ? onDropSetup(cardIndex) : {})}
                        key={cardIndex}
                    >
                        <CardComponent
                            {...card}
                            onClick={handleClick}
                            onDoubleClick={handleDoubleClick}
                        />
                    </div>
                );
            })}
        </div>
    );
}
