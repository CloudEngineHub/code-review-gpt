import chalk from "chalk";

import { testThreshold } from "../constants";
import { TestCase } from "../types";

/**
 * Possible test results.
 */
export enum testResult {
  PASS = "PASS",
  WARN = "WARN",
  FAIL = "FAIL",
}

/**
 * Determine the test result based on the similarity score.
 * @param similarity The similarity score.
 * @returns The test result.
 */
const determineTestResult = (similarity: number): testResult => {
  // If the similarity score is more than 1 - threshold, then the test is considered as passing.
  // Else if the similarity score is more than 1 - 2 * threshold, then the test is considered as warn. We display a complete report for this test but do not fail the test.
  // Else, the test is considered as failing. We display a complete report for this test and fail the test.
  const MAX_SIMILARITY_SCORE = 1;
  if (similarity > MAX_SIMILARITY_SCORE - testThreshold) {
    return testResult.PASS;
  } else if (similarity > MAX_SIMILARITY_SCORE - 2 * testThreshold) {
    return testResult.WARN;
  } else {
    return testResult.FAIL;
  }
};

const formatTestResult = (result: testResult, message: string): string => {
  switch (result) {
    case testResult.PASS:
      return chalk.green(`✅ [PASS] - ${message}`);
    case testResult.WARN:
      return chalk.yellow(`⚠️ [WARN] - ${message}`);
    case testResult.FAIL:
      return chalk.red(`❌ [FAIL] - ${message}`);
    default:
      throw new Error(`Unknown test result: ${result}`);
  }
};

/**
 * Generate a test report for a test case.
 * @param testCase The test case.
 * @param review The review generated by the AI.
 * @param similarReview The most similar review found in the vector store.
 * @param similarity The similarity score between the review and the most similar review found in the vector store.
 * @returns The test report and the test result.
 */
export const generateTestReport = (
  testCase: TestCase,
  review: string,
  similarReview: string,
  similarity: number
): { report: string; result: testResult } => {
  const result = determineTestResult(similarity);

  const shouldDisplayDetailedReport = result !== testResult.PASS;

  const report =
    formatTestResult(
      result,
      `Test case: ${testCase.name} - Similarity score: ${similarity}\n`
    ) +
    (shouldDisplayDetailedReport
      ? displayDetailedReport(testCase, review, similarReview)
      : "");

  return {
    result,
    report,
  };
};

/**
 * Generate a test report template for a test case.
 * @param testCase The test case.
 * @param review The review generated by the AI.
 * @param similarReview The most similar review found in the vector store.
 * @param similarity The similarity score between the review and the most similar review found in the vector store.
 * @returns The test report template.
 */
const displayDetailedReport = (
  testCase: TestCase,
  review: string,
  similarReview: string
) => `
 > Test case snippet: ${JSON.stringify(testCase.snippet)}

===============================================================================

 > Review:
${review}
===============================================================================

> Similar review:
${similarReview}

`;

/**
 * Generate a summary of the test results.
 * @param testResults The test results.
 * @returns The summary.
 */
export const generateTestResultsSummary = (testResults: {
  [key: string]: testResult;
}): string => {
  const summary = Object.entries(testResults).reduce(
    (summary, [testCaseName, result]) => {
      return (
        summary + formatTestResult(result, `Test case: ${testCaseName}`) + "\n"
      );
    },
    chalk.blue(`\n### Test results summary:\n`)
  );

  const counts = Object.values(testResults).reduce((counts, result) => {
    counts[result]++;

    return counts;
  }, Object.fromEntries(Object.values(testResult).map((result) => [result, 0])));

  return (
    summary +
    `\n**SUMMARY: ${chalk.green(`✅ PASS: ${counts.PASS}`)} - ${chalk.yellow(
      `⚠️ WARN: ${counts.WARN}`
    )} - ${chalk.red(`❌ FAIL: ${counts.FAIL}`)}**\n`
  );
};
