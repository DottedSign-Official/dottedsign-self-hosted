function isSnakeCase(str) {
  if (str === "verify_info[uuid]" || str === "verify_info[verify_data]") {
    return true;
  }
  return /^[a-z0-9]+(_[a-z0-9]+)*$/.test(str);
}

export function findNonSnakeCaseKey(data) {
  function checkKeys(obj, path = []) {
    if (typeof obj !== "object" || obj === null) {
      return null;
    }

    for (const key of Object.keys(obj)) {
      const currentPath = [...path, key];

      if (!isSnakeCase(key)) {
        return currentPath.join(" -> ");
      }

      //NOTE: Recursive : check nested structure
      const nestedResult = checkKeys(obj[key], currentPath);
      if (nestedResult) {
        return nestedResult;
      }
    }

    // NOTE: all keys are in snake_case
    return null;
  }

  return checkKeys(data);
}
