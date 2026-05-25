export function xmlParser(xmlString) {
  const parser = new window.DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
}

export function getDataValue(domData, xmlTag = "") {
  const childValue = domData.getElementsByTagName(xmlTag).item(0);
  if (childValue && childValue.firstChild) {
    return childValue.firstChild.nodeValue;
  } else {
    return null;
  }
}

export function getDataArray(domData, xmlTag) {
  const dataString = getDataValue(domData, xmlTag);
  return dataString.split(",");
}

let lastHighlightedEle = null;

export function scrollToDom(id, highlight = false) {
  const ele = document.getElementById(id);

  if (!ele) {
    return null;
  }
  ele.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });

  if (highlight) {
    if (lastHighlightedEle) {
      lastHighlightedEle.classList.remove("Sign-field-highlight");
    }
    ele.classList.add("Sign-field-highlight");
    lastHighlightedEle = ele;
  }
}

export function checkVisiblePage(totalPage) {
  let firstElementWithVisibleTop;
  let firstElementWithBottomBelowViewportTop;

  for (let idx = 0; idx < totalPage; idx++) {
    const element = document.getElementById(`pageContainer${idx + 1}`);
    if (!element) {
      continue;
    }

    const { top, bottom } = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    if (top >= 0 && top <= viewportHeight - 70) {
      firstElementWithVisibleTop = idx + 1;
      break;
    }

    if (!firstElementWithBottomBelowViewportTop && bottom > 98) {
      firstElementWithBottomBelowViewportTop = idx + 1;
    }
  }

  return firstElementWithVisibleTop || firstElementWithBottomBelowViewportTop;
}
