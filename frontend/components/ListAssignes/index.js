import React from "react";

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

import { STAGE_ACTION } from "../../constants/constants";
import Assigne from "../Assigne";
import { Wrapper } from "./styled";

const AssigneItem = (data) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 99999 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const isMore = (() => {
    if (data.position === "cc") {
      return false;
    }

    if (
      data.position === "review" ||
      data.item.action === STAGE_ACTION.review
    ) {
      return false;
    }
    if (
      data.position === "signingGroupView" ||
      data.position === "signingGroupEdit"
    ) {
      return false;
    }

    return true;
  })();

  const isTag = (() => {
    if (data.position === "cc") {
      return false;
    }

    return true;
  })();

  const isDraggable = (() => {
    if (data.isReadOnly) {
      return false;
    }
    if (data.position === "cc") {
      return false;
    }
    if (
      data.isPublicForm &&
      data.item.signer_type === "form_signer" &&
      data.keyIndex === 0
    ) {
      return false;
    }

    return true;
  })();

  const isDeletable = (() => {
    if (
      data.isPublicForm &&
      data.item.signer_type === "form_signer" &&
      data.keyIndex === 0
    ) {
      return false;
    }

    return true;
  })();

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Assigne
        {...data}
        isMe
        isReadOnly={data.isReadOnly}
        isTag={isTag}
        isMore={isMore}
        isDraggable={isDraggable}
        isDeletable={isDeletable}
        isTemplateApplied={data.isTemplateApplied}
        isPublicForm={data.isPublicForm}
        isNameOnly={data.isTemplate}
        listeners={listeners}
      />
    </div>
  );
};

const AssigneList = ({
  isReadOnly,
  isTemplate,
  isTemplateApplied,
  isOrder,
  isModal,
  isPublicForm,
  allItems,
  items,
  warnings,
  onModify,
  onDelete,
  onMore,
  position,
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

  const itemIds = items.map((item, idx) => {
    const id = item.key || `item-${idx}`;
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
          {items.map((item, idx) => (
            <AssigneItem
              key={item.uid}
              isReadOnly={isReadOnly}
              isTemplate={isTemplate}
              isTemplateApplied={isTemplateApplied}
              isOrderBar={isOrder && idx > 0}
              isMoreWarning={warnings[item.uid]}
              isModal={isModal}
              isPublicForm={isPublicForm}
              id={item.key || `item-${idx}`}
              keyIndex={idx}
              allItems={allItems}
              item={item}
              onModify={onModify}
              onDelete={onDelete}
              onMore={onMore}
              disabled={isTemplateApplied}
              position={position}
            />
          ))}
        </Wrapper>
      </SortableContext>
    </DndContext>
  );
};

export default AssigneList;
