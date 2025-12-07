
export const handleDragStart = (e, item, setDraggedItem) => {
  setDraggedItem(item);
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("itemId", item._id);
};

export const handleDragEnd = (setDraggedItem, setIsDraggingOver) => {
  setDraggedItem(null);
  setIsDraggingOver(false);
};

export const handleDragOver = (e, setIsDraggingOver) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  setIsDraggingOver(true);
};

export const handleDragLeave = (e, setIsDraggingOver) => {
  e.preventDefault();
  setIsDraggingOver(false);
};

export const handleDrop = (
  e,
  onDropCallback,
  setIsDraggingOver,
  setDraggedItem
) => {
  e.preventDefault();
  const itemId = e.dataTransfer.getData("itemId");
  
  if (itemId && onDropCallback) {
    onDropCallback(itemId);
  }
  
  setIsDraggingOver(false);
  setDraggedItem(null);
};

export const getDraggableClasses = (draggedItem, currentItem, baseClasses = "") => {
  const isDragging = draggedItem?._id === currentItem._id;
  return `${baseClasses} cursor-move ${isDragging ? "opacity-50" : ""}`;
};

export const getDropZoneClasses = (isDraggingOver, normalClasses = "", activeClasses = "") => {
  return isDraggingOver ? activeClasses : normalClasses;
};
