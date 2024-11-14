// Some code I snatched for checking if an array exist in a 2d array
export function includesArray(matrix, subArray) {
    for (let row of matrix) {
      if (row.length !== subArray.length) continue;
  
      let match = true;
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== subArray[i]) {
          match = false;
          break;
        }
      }
  
      if (match) return true;
    }
  
    return false;
}

// Some more code I snatched because I didnt want to write it out
export function removeDuplicates(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

export function isBetween(x, min, max) {
    return x >= min && x <= max;
}