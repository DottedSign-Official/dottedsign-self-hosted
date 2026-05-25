import { SOCKET_TIMEOUT_CONFIG } from "../constants/constants";

const dynamicTimeout = (files = [], operationType = "upload") => {
  const config = SOCKET_TIMEOUT_CONFIG[operationType];

  const { perFile, perMb, baseTimeout, maxTimeout } = config;

  const totalSize = files.reduce((sum, file) => {
    const fileSize = file.file?.size || file.size || file.file_size || 0;
    return sum + fileSize;
  }, 0);

  const timeout = (() => {
    const fileCountTimeout = files.length * perFile;
    const sizeBasedTimeout = Math.ceil(totalSize / (1024 * 1024)) * perMb;
    return baseTimeout + fileCountTimeout + sizeBasedTimeout;
  })();

  const finalTimeout = Math.min(timeout, maxTimeout);

  return finalTimeout;
};

export const calculateUploadTimeout = (files) => {
  return dynamicTimeout(files, "upload");
};

export const calculateMergeTimeout = (files) => {
  return dynamicTimeout(files, "merge");
};
