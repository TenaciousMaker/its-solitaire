import React from "react";
import { Pile } from "../model";
import CardComponent from "../CardComponent";
import './styles.css';

type Props = {
    pile: Pile;
    fanDirection?: "left" | "down";
    onClick?(cardIndex: number): void;
    onDoubleClick?(cardIndex: number): void;
};

/*
Handles stacking/nesting of cards and drag/drop.
 */
export default function CardStackComponent({
    pile,
    onClick,
    onDoubleClick,
    fanDirection,
}: Props) {
    const pileClass = `pile${fanDirection ? ' fan-direction-' + fanDirection : ''}`;

    return (
        <div className={pileClass}>
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
                    <CardComponent
                        {...card}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                    />
                );
            })}
        </div>
    );
}
