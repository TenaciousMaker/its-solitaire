import React, { createRef, ReactNode, useEffect } from "react";
import { Pile, PlayingCard } from "../../model";
import CardComponent from "../CardComponent";
import "./styles.css";

type Props = {
    pile: Pile;
    pileType?: "tableau" | "waste";
    renderRecursively?: boolean;
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
    pileType,
    renderRecursively = false,
    onClick,
    onDoubleClick,
    onDragSetup,
    onDropSetup,
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

    // Clean up after component unmounts.
    useEffect(() => {
        return () => {
            refs.length = 0;
        }
    });

    function renderCards(cards: Pile, cardIndex: number = 0): ReactNode[] {
        if (cardIndex === cards.length) {
            return [];
        }

        const card: PlayingCard = cards[cardIndex];
        const handleClick = () => {
            if (onClick) {
                onClick(cardIndex);
            }
        }
        const handleDoubleClick = () => {
            if (onDoubleClick) {
                onDoubleClick(cardIndex);
            }
        }
        // const ref = createRef<HTMLDivElement>();
        // refs.push(ref);
        const node = (
            <li
                // ref={ref}
                key={card.key}
                className={`card-outer${card.faceUp ? ' droppable' : ''}`}
                {...((card.faceUp && onDragSetup) ? onDragSetup(cardIndex) : {})}
                {...((card.faceUp && onDropSetup) ? onDropSetup(cardIndex) : {})}
            >
                <CardComponent
                    {...card}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                />
                {renderRecursively && renderCards(cards, cardIndex + 1)}
            </li>
        );

        if (renderRecursively) {
            return [(<ul key={card.key}>{node}</ul>)];
        } else {
            return [node, ...renderCards(cards, cardIndex + 1)];
        }
    }

    return (
        <ul className={pileClass} {...(onDropSetup ? onDropSetup() : {})} onClick={handleEmptyClick}>
            {renderCards(pile)}
        </ul>
    );
}
