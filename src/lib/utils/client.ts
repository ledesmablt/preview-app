type Dict = Record<string, any>
export function getChangedFields(newVal: Dict, oldVal: Dict): Dict {
  const output: Dict = {}
  for (let key in newVal) {
    if (newVal[key] !== oldVal[key]) {
      output[key] = newVal[key]
    }
  }
  return output
}
