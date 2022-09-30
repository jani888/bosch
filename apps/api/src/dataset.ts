interface DatasetInfo {
  length: number;
  totalChunks: number;
}

export const getDatasetInfo = async (
  datasetId?: string
): Promise<DatasetInfo> => {
  return {
    length: 1,
    totalChunks: 1,
  };
};
