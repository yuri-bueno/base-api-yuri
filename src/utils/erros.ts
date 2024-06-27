const apiErrors = {
  REQUIRED_ERROR: "required",

  INVALID_NUMBER_ERROR: "invalid-number",
  INVALID_TYPE_ERROR: "invalid-type",
  LONG_NUMBER_ERROR: "long-number",
  SHORT_NUMBER_ERROR: "short-number",

  INVALID_TEXT_REGEX_ERROR: "invalid-text-regex",
  LONG_TEXT_ERROR: "long-text",
  SHORT_TEXT_ERROR: "short-text",
} as const;

export default apiErrors;
