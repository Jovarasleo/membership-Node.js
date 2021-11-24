export function createEl(el, elClass) {
  const newElement = document.createElement(el);
  if (elClass) {
    newElement.classList = elClass;
  }
  return newElement;
}
