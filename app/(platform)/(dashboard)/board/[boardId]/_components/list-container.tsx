"use client"
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable, DropResult} from "@hello-pangea/dnd"
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
    data: ListWithCards[];
    boardId : string;
}

function reorder<T>(list: T[], startIndex: number, endTime: number){
  const result = Array.from(list);
  const [removed] = result.splice(startIndex,1);
  result.splice(endTime, 0, removed);
  return result;
}



export const ListContainer = ({
    data,
    boardId
}: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder} =  useAction(updateListOrder, {
    onSuccess: () =>{
      toast.success("List Reordered")
    },
    onError: (error) =>{
      toast.error(error);
    }
  }) 

  const { execute: executeCardListOrder} =  useAction(updateCardOrder, {
    onSuccess: () =>{
      toast.success("Card Reordered")
    },
    onError: (error) =>{
      toast.error(error);
    }
  }) 

  useEffect(()=>{
    setOrderedData(data)
  },[data])

  const onDragEnd = (result: DropResult) =>{
    const {destination, source, type} = result;

    if(!destination){
      return;
    }

    //if dropped in same location
    if(destination.droppableId == source.droppableId &&
      destination.index === source.index
    ){
      return;
    }

    //user moves a list
    if(type === "list"){
      const items = reorder(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) =>(
        {...item, order:index}
      ));

      setOrderedData(items);
      executeUpdateListOrder({items, boardId});
    }

    //user moves a card
    if(type === "card"){
      let newOrderedData = [...orderedData];

      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destList = newOrderedData.find(list => list.id === destination.droppableId)

      if(!sourceList || !destList){
        return;
      }

      //check if the cards exists on the sourceList
      if(!sourceList.cards){
        sourceList.cards = [];
      }

      //check if the cards exists on the destlist
      if(!destList.cards){
        destList.cards = [];
      }

      //moving card in the same list 
      if(source.droppableId  === destination.droppableId){
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        )

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData)
        executeCardListOrder({
          boardId: boardId,
          items:reorderedCards,
        })

      }else{

        //remove card from the souce list 
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        //assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        //add card to the destination list
        destList.cards.splice(destination.index,0, movedCard);

        sourceList.cards.forEach((card, idx) =>{
          card.order = idx
        })

        //update the order in the destination list
        destList.cards.forEach((card, idx) =>{
          card.order = idx;
        })

        setOrderedData(newOrderedData)
        executeCardListOrder({
          boardId: boardId,
          items:destList.cards,
        })
      }

    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) =>(
          <ol
          {...provided.droppableProps}
          ref = {provided.innerRef}
           className="flex gap-x-3 h-full  ">
          {orderedData.map((list, index)=>{
            return(
              <ListItem
              key ={list.id}     
              index = {index}
              data = {list}
              />
            )
          })}
          {provided.placeholder}
            <ListForm/>
            <div className="flex-shrink-0 w-1"/>
        </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}

