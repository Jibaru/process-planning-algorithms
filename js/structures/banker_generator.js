import { NumberMatrix } from "../utils/number_matrix.js";
import { NumberVector } from "../utils/number_vector.js";

export class BankerGenerator {
  constructor(maxMatrix, allocationMatrix, resourcesVector) {
    this._maxMatrix = new NumberMatrix(maxMatrix, true);
    this._allocationMatrix = new NumberMatrix(allocationMatrix, true);
    this._resourcesVector = new NumberVector(resourcesVector);

    // To store the indexes of rows of accepted processes
    this._acceptedProcessesIndexes = {};
    this._ended = false;
    this._currentProcessLabel = null;

    this._computeNeededMatrix();
    this._computeInitialAvaliableVector();
  }

  _computeNeededMatrix() {
    this._neededMatrix = new NumberMatrix(this._maxMatrix.matrix, true);
    this._neededMatrix.substract(this._allocationMatrix);
  }

  _computeInitialAvaliableVector() {
    this._avaliableVector = new NumberVector(this._resourcesVector.vector);
    const sumsColVector = new NumberVector(
      this._allocationMatrix.colsSums(true)
    );
    this._avaliableVector.substract(sumsColVector);
  }

  get neededMatrix() {
    return this._neededMatrix.matrix;
  }

  get maxMatrix() {
    return this._maxMatrix.matrix;
  }

  get allocationMatrix() {
    return this._allocationMatrix.matrix;
  }

  get avaliableVector() {
    return this._avaliableVector.vector;
  }

  get resourcesVector() {
    return this._resourcesVector.vector;
  }

  get currentProcessLabel() {
    return this._currentProcessLabel;
  }

  isEnded() {
    return this._ended;
  }

  executeOne() {
    // First, get min sum index of all not acepted processes in the needed matrix
    const minIndex = this._minRowsSumsIndex();

    // If minIndex is -1, the banker algorithm ends
    if (minIndex == -1) {
      this._ended = true;
      return false;
    }

    this._currentProcessLabel = this._maxMatrix.getAt(minIndex, 0);

    // Second, substract the vector of minIndex with avaliableVector
    const minRowVector = new NumberVector(
      this._neededMatrix.getRowVectorAt(minIndex)
    );
    this._avaliableVector.substract(minRowVector);

    // Third, check if avaliable vector has negative values
    if (this._avaliableVector.hasNegativeValues()) {
      // If it is, return false, the system isn't safe
      return false;
    }

    // If not, sum allocationMatrix[minIndex] row with minRowVector and add to avaliableVector
    const allocationVector = new NumberVector(
      this._allocationMatrix.getRowVectorAt(minIndex)
    );
    this._avaliableVector.add(minRowVector);
    this._avaliableVector.add(allocationVector);

    // Fourth, set allocationMatrix[miIndex] and neededMatrix[minIndex] row by zero
    this._neededMatrix.setRowZero(minIndex);
    this._allocationMatrix.setRowZero(minIndex);

    // Finally, save the accepted process and return true
    this._acceptedProcessesIndexes[minIndex] = true;
    return true;
  }

  _minRowsSumsIndex() {
    const rowsSums = this._neededMatrix.rowsSums();
    const notAceptedRowSums = [];

    for (let i = 0; i < rowsSums.length; i++) {
      if (this._acceptedProcessesIndexes.hasOwnProperty(i)) {
        continue;
      }
      notAceptedRowSums.push({
        index: i,
        value: rowsSums[i],
      });
    }

    console.log(this._acceptedProcessesIndexes);

    if (notAceptedRowSums.length == 0) {
      return -1;
    }

    const notAceptedRowSumsValues = notAceptedRowSums.map(
      (rowSum) => rowSum.value
    );

    const minIndex = notAceptedRowSumsValues.indexOf(
      Math.min(...notAceptedRowSumsValues)
    );

    return notAceptedRowSums[minIndex].index;
  }
}
