type ElementAttributes<K extends keyof HTMLElementTagNameMap> = Partial<
  HTMLElementTagNameMap[K]
> &
  Record<string, string>;

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: ElementAttributes<K> = {},
  textContent?: string
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag) as HTMLElementTagNameMap[K];

  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (key in element) {
      (element as any)[key] = value;
    } else {
      console.log(
        `${key} is not a valid attribute for the ${tag} HTML Element.`
      );
    }
  }

  // Set text content
  if (textContent) {
    element.textContent = textContent;
  }

  return element;
};
