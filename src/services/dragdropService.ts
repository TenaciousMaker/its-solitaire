type Droppable = {
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
};

type Draggable = {
    draggable: true;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
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
        onDragOver(event) {
            event.preventDefault();
        },
        onDrop({ dataTransfer }) {
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
        onDragStart({ dataTransfer }) {
            dataTransfer?.setData("context", context);
            dataTransfer?.setData("json", JSON.stringify(payload || ""));
        },
    };
}
