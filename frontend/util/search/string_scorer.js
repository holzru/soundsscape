const StringScorer = function () {
  // used for levenstien calcs
  this.grid = [[0]];
};

StringScorer.prototype.gridHeight = function () { return this.grid.length - 1; };
StringScorer.prototype.gridWidth = function () { return this.grid[0].length - 1; };

StringScorer.prototype.resizeGrid = function (newHeight, newWidth) {
  // resize width of grid
  for (let i = this.gridWidth() + 1; i < newWidth + 1; i++) {
    for (let j = 0; j < this.gridHeight() + 1; j++) {
      this.grid[j].push(j === 0 ? i : null);
    }
  }
  // resize height of grid
  for (let i = this.gridHeight() + 1; i < newHeight + 1; i++) {
    this.grid.push([i]);
    for (let j = 0; j < this.gridWidth(); j++) {
      this.grid[i].push(null);
    }
  }
};

StringScorer.prototype.scoreStrings = function (baseString, compString, compI, compJ, bestScore) {
  const compLength = compJ - compI; // length of subCompString
  const maxDist = Math.max(baseString.length, compLength); // max levenstien dist

  // levenstien score if either string is zero length
  if (!baseString.length) {
    return 1 - (compLength / maxDist);
  } else if (!compLength) {
    return 1 - (baseString.length / maxDist);
  }

  // return best-case score based on length if it is less than bestScore
  const lengthScore = 1 - (Math.abs(baseString.length - compLength) / maxDist);
  if (lengthScore <= bestScore) { return lengthScore; }

  // resize grid if need be
  if (baseString.length > this.gridHeight() || compLength > this.gridWidth()) {
    this.resizeGrid(baseString.length, compLength);
  }

  // levenstien calc
  let cost;
  for (let i = 1; i < baseString.length + 1; i++) {
    const char1 = baseString[i - 1];
    for (let j = 1; j < compLength + 1; j++) {
      const char2 = compString[compI + j - 1];
      cost = (char1.toLowerCase() === char2.toLowerCase() ? 0 : 1);
      this.grid[i][j] = Math.min(this.grid[i - 1][j] + 1,
                                 this.grid[i][j - 1] + 1,
                                 this.grid[i - 1][j - 1] + cost);
      // return current score if it has fallen below bestScore
      if (i === j) {
        const score = 1 - (this.grid[i][j] / maxDist);
        if (score <= bestScore) { return score; }
      }
    }
  }

  // return levenstien score
  const dist = this.grid[baseString.length][compLength];
  return 1 - (dist / maxDist);
};

module.exports = StringScorer;
