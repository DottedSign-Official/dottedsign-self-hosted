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
  file,
  focusFile,
  setFileName,
  setFocusFile,
  onDelete,
  isEnvelope,
  isShowMore,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 99999 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const isDraggable = (() => {
    return isEnvelope;
  })();

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item
        key={key}
        id={id}
        file={file}
        focusFile={focusFile}
        setFileName={setFileName}
        setFocusFile={setFocusFile}
        onDelete={onDelete}
        isEnvelope={isEnvelope}
        isShowMore={isShowMore}
        isDraggable={isDraggable}
      />
    </div>
  );
};

const ListDocument = ({
  files,
  focusFile,
  setFileName,
  setFocusFile,
  onDelete,
  isEnvelope,
  isShowMore,
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
      const oldIndex = files.findIndex(
        (file, idx) => `file-${idx}` === active.id,
      );
      const newIndex = files.findIndex(
        (file, idx) => `file-${idx}` === over.id,
      );

      if (onMove && oldIndex !== -1 && newIndex !== -1) {
        onMove({ oldIndex, newIndex });
      }
    }
  };

  const itemIds = files.map((file, idx) => `file-${idx}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <Wrapper>
          {files.map((file, idx) => (
            <Card
              key={idx}
              id={`file-${idx}`}
              file={file}
              focusFile={focusFile}
              setFileName={setFileName}
              setFocusFile={setFocusFile}
              onDelete={onDelete}
              isEnvelope={isEnvelope}
              isShowMore={isShowMore}
            />
          ))}
        </Wrapper>
      </SortableContext>
    </DndContext>
  );
};

export default ListDocument;
