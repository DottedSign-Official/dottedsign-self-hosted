import React from "react";
import Item from "./Item";
import { Wrapper } from "./styled";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({
  key,
  id,
  fileInfo,
  fileFocus,
  setFileName,
  onPasswordProtected,
  isInSigningPhase,
  isInAssignFieldsPhase,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 99999 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const isDraggable = (() => {
    if (isInSigningPhase) {
      return false;
    }

    return true;
  })();

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Item
        key={key}
        id={id}
        fileInfo={fileInfo}
        fileFocus={fileFocus}
        setFileName={setFileName}
        isDraggable={isDraggable}
        onPasswordProtected={onPasswordProtected}
        isInSigningPhase={isInSigningPhase}
        isInAssignFieldsPhase={isInAssignFieldsPhase}
        listeners={listeners}
      />
    </div>
  );
};

const FileList = ({
  fileList,
  fileFocus,
  setFileName,
  onPasswordProtected,
  isInSigningPhase,
  isInAssignFieldsPhase,
  onMove,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (document.activeElement) {
      document.activeElement.blur();
    }
    if (active && over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(active.id);
      const newIndex = itemIds.indexOf(over.id);
      if (onMove && oldIndex !== -1 && newIndex !== -1) {
        onMove({ oldIndex, newIndex });
      }
    }
  };

  const itemIds = fileList.map((fileInfo, idx) => {
    const id = `item-${idx}`;
    return id;
  });
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <Wrapper>
          {fileList.map((fileInfo, idx) => (
            <Card
              key={idx}
              id={`item-${idx}`}
              fileInfo={fileInfo}
              fileFocus={fileFocus}
              setFileName={setFileName}
              onPasswordProtected={onPasswordProtected}
              isInSigningPhase={isInSigningPhase}
              isInAssignFieldsPhase={isInAssignFieldsPhase}
            />
          ))}
        </Wrapper>
      </SortableContext>
    </DndContext>
  );
};

export default FileList;
