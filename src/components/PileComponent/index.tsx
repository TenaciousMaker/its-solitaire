import React, { createRef, ReactHTML, ReactHTMLElement } from "react";
import { Pile } from "../../model";
import CardComponent from "../CardComponent";
import "./styles.css";

type Props = {
    pile: Pile;
    pileType?: "tableau" | "waste";
    onClick?(cardIndex?: number): void;
    onDoubleClick?(cardIndex: number): void;
    onDragSetup(cardIndex: number): void;
    onDropSetup?(cardIndex?: number): void;
};

/*
Handles stacking/nesting of cards and drag/drop.
 */
export default function PileComponent({
    pile,
    onClick,
    onDoubleClick,
    onDragSetup,
    onDropSetup,
    pileType,
}: Props) {
    const pileClass = `pile${
        pileType ? " pile-type-" + pileType : ""
    }`;

    function handleEmptyClick() {
        if (onClick) {
            onClick();
        }
    }

    const refs: Array<React.RefObject<HTMLDivElement>> = [];

    function explode() {
        refs.forEach(({current: element}) => {
            if (element) {
                const x = Math.floor(Math.random() * 4) - 2;
                const y = Math.floor(Math.random() * 4) - 2;
                const z = Math.floor(Math.random() * 4) - 2;
                const rot = Math.floor(Math.random() * 360);
                element.style.transform = `rotate3d(${x}, ${y}, ${z}, ${rot}deg)`;
            }
        });
    }

    return (
        <div className={pileClass} {...(onDropSetup ? onDropSetup() : {})} onClick={handleEmptyClick}>
            {pile.map((card, cardIndex) => {
                function handleClick() {
                    if (onClick) {
                        onClick(cardIndex);
                    }
                }
                function handleDoubleClick() {
                    if (onDoubleClick) {
                        onDoubleClick(cardIndex);
                        // explode();
                    }
                }
                const ref = createRef<HTMLDivElement>();
                // refs.push(ref);
                return (
                    <div
                        ref={ref}
                        key={card.key}
                        className="card-outer"
                        {...(onDragSetup ? onDragSetup(cardIndex) : {})}
                        {...(onDropSetup ? onDropSetup(cardIndex) : {})}
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
