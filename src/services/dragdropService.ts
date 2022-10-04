import { ReactHTMLElement } from "react";

type Droppable = {
    onDragOver: (event: React.DragEvent<HTMLElement>) => void;
    onDragLeave: (event: React.DragEvent<HTMLElement>) => void;
    onDrop: (event: React.DragEvent<HTMLElement>) => void;
};

type Draggable = {
    draggable: true;
    onDragStart: (event: React.DragEvent<HTMLElement>) => void;
    onDragEnd: (event: React.DragEvent<HTMLElement>) => void;
};

export type DropFunction = (
    contextTo: string,
    contextFrom: string,
    payloadTo: any,
    payloadFrom: any
) => void;

export function getDroppable(
    contextTo: string,
    payloadTo: any,
    onDropAction: DropFunction,
): Droppable {
    return {
        onDragOver(e) {
            const target = e.currentTarget as Element;
            target.classList.add('drag-over');
            e.preventDefault();
        },
        onDragLeave(e) {
            const target = e.currentTarget as Element;
            target.classList.remove('drag-over');
        },
        onDrop(e) {
            const dataTransfer = e.dataTransfer;
            const target = e.currentTarget as Element;
            target.classList.remove('drag-over');
            const contextFrom = dataTransfer?.getData("context");
            const payloadFrom = dataTransfer?.getData("json") || "";
            if (contextFrom && payloadFrom) {
                onDropAction(contextTo, contextFrom, payloadTo, JSON.parse(payloadFrom));
            }
        },
    };
}

export function getDraggable(
    context: string,
    payload?: any
): Draggable {
    return {
        draggable: true,
        onDragStart(e) {
            const target = e.target as Element;
            const dataTransfer = e.dataTransfer;
            dataTransfer.effectAllowed = 'move';
            dataTransfer?.setData("context", context);
            dataTransfer?.setData("json", JSON.stringify(payload || ""));
            target.classList.add('dragging');
        },
        onDragEnd(e) {
            const target = e.target as Element;
            target.classList.remove('dragging');
        },
    };
}
