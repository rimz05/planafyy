"use client";

import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { useRef, useState } from "react";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import CardItem from "./card-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}
export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
        ref = {provided.innerRef}
        {...provided.draggableProps}
        className="shrink-0 h-full w-[272px] select-none">
          <div 
          {...provided.dragHandleProps}
          className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
                {(provided) => (
                    <ol
                    ref = {provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                        data.cards.length > 0 ? "mt-2" : "mt-0"
                    )}
                    >
                    {data.cards.map((card, index) => (
                        <CardItem index={index} key={card.id} data={card} />
                    ))}
                    {provided.placeholder}
                    </ol>
                )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
