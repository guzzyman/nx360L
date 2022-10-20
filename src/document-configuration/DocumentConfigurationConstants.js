export const DocumentGlobalEntityTypeEnum = {
  CLIENTS: 1,
  LOANS: 15,
};

export const DocumentGlobalEntityTypeOptions = Object.keys(
  DocumentGlobalEntityTypeEnum
).map((key) => ({ label: key, value: DocumentGlobalEntityTypeEnum[key] }));
