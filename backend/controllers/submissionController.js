import Submission from '../models/Submission.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import vm from 'vm';

const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_ALIASES = {
  javascript: 'javascript',
  js: 'javascript',
  python: 'python3',
  py: 'python3',
  java: 'java',
  c: 'c',
  cpp: 'c++',
  'c++': 'c++',
};

const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  python: 'Python',
  py: 'Python',
  python3: 'Python',
  java: 'Java',
  cpp: 'C++',
  'c++': 'C++',
  c: 'C',
};

const PREFERRED_FUNCTION_NAMES = [
  'solveProblem',
  'solution',
  'solve',
  'search',
  'searchRotatedArray',
  'isValid',
  'canFinish',
  'mergeKLists',
  'lengthOfLongestSubstring',
  'findMedianSortedArrays',
  'twoSum',
  'wordLadder',
  'main',
];

const normalizeSubmissionLanguage = (language) => {
  const normalized = String(language || 'javascript').toLowerCase();
  return LANGUAGE_LABELS[normalized] || 'JavaScript';
};

const getEffectiveTestCases = (challengeDoc) => {
  if (challengeDoc?.testCases && challengeDoc.testCases.length > 0) {
    return challengeDoc.testCases;
  }

  if (challengeDoc?.exampleInput !== undefined && challengeDoc?.exampleOutput !== undefined) {
    return [
      {
        input: String(challengeDoc.exampleInput),
        output: String(challengeDoc.exampleOutput),
        explanation: 'Auto-generated from challenge example',
      },
    ];
  }

  return [];
};

const splitTopLevel = (text, separator = ',') => {
  const parts = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let quote = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : '';

    if ((ch === '"' || ch === "'") && prev !== '\\') {
      if (!inString) {
        inString = true;
        quote = ch;
      } else if (quote === ch) {
        inString = false;
        quote = '';
      }
      current += ch;
      continue;
    }

    if (!inString) {
      if (ch === '[' || ch === '{' || ch === '(') depth++;
      if (ch === ']' || ch === '}' || ch === ')') depth--;

      if (ch === separator && depth === 0) {
        parts.push(current.trim());
        current = '';
        continue;
      }
    }

    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const parseLiteral = (value) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed.length) return '';
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;
    if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
    return trimmed;
  }
};

const parseInput = (input) => {
  if (typeof input !== 'string') return input;
  const trimmed = input.trim();

  // 1) Full JSON input
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // continue
  }

  // 2) Named assignments like: nums1 = [1,3], nums2 = [2]
  if (trimmed.includes('=')) {
    const named = {};
    const parts = splitTopLevel(trimmed, ',');
    parts.forEach((part) => {
      const eqIdx = part.indexOf('=');
      if (eqIdx > 0) {
        const key = part.slice(0, eqIdx).trim();
        const value = part.slice(eqIdx + 1).trim();
        named[key] = parseLiteral(value);
      }
    });
    if (Object.keys(named).length > 0) return named;
  }

  // 3) Fallback raw string
  return trimmed;
};

const normalizeForCompare = (value) => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'number') return Number(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
      return trimmed;
    }
  }
  return value;
};

const valuesFromParsedInput = (parsedInput) => {
  if (Array.isArray(parsedInput)) return parsedInput;
  if (parsedInput && typeof parsedInput === 'object') return Object.values(parsedInput);
  return [parsedInput];
};

const pickCallableFunction = (context) => {
  for (const name of PREFERRED_FUNCTION_NAMES) {
    if (typeof context[name] === 'function') return { name, fn: context[name] };
  }

  const names = Object.keys(context).filter((key) => typeof context[key] === 'function');
  if (names.length > 0) return { name: names[0], fn: context[names[0]] };
  return null;
};

const extractDeclaredFunctionNames = (code) => {
  const names = [];
  const unique = new Set();
  const text = String(code || '');

  const pushName = (name) => {
    if (!name || unique.has(name)) return;
    unique.add(name);
    names.push(name);
  };

  const functionRegex = /function\s+([A-Za-z_$][\w$]*)\s*\(/g;
  let match = null;
  while ((match = functionRegex.exec(text)) !== null) {
    pushName(match[1]);
  }

  const assignedFunctionRegex = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g;
  while ((match = assignedFunctionRegex.exec(text)) !== null) {
    pushName(match[1]);
  }

  return names;
};

const findExportedFunction = (context) => {
  const moduleExports = context?.module?.exports;
  const exportsObj = context?.exports;

  if (typeof moduleExports === 'function') return moduleExports;
  if (typeof exportsObj === 'function') return exportsObj;

  const candidateContainers = [moduleExports, exportsObj];
  const preferredOrder = [...PREFERRED_FUNCTION_NAMES, 'default'];

  for (const container of candidateContainers) {
    if (!container || typeof container !== 'object') continue;
    for (const key of preferredOrder) {
      if (typeof container[key] === 'function') return container[key];
    }
    const firstFnKey = Object.keys(container).find((key) => typeof container[key] === 'function');
    if (firstFnKey) return container[firstFnKey];
  }

  return null;
};

const invokeDeclaredFunctionInContext = ({ context, code, args, fileTag }) => {
  const declaredNames = extractDeclaredFunctionNames(code);
  if (declaredNames.length === 0) return { found: false, value: undefined };

  context.__judgeArgs = args;

  for (const fnName of declaredNames) {
    if (!/^[A-Za-z_$][\w$]*$/.test(fnName)) continue;
    const invocationScript = new vm.Script(
      `(function () {
        if (typeof ${fnName} === 'function') {
          return ${fnName}.apply(null, globalThis.__judgeArgs);
        }
        return undefined;
      })();`,
      { filename: `${fileTag}_invoke.js` }
    );

    try {
      const value = invocationScript.runInContext(context, { timeout: 1000 });
      if (value !== undefined) return { found: true, value };
    } catch (error) {
      return { found: true, error };
    }
  }

  return { found: false, value: undefined };
};

const extractLanguageFunctionNames = (code, runtimeLang) => {
  const text = String(code || '');
  const names = [];
  const unique = new Set();
  const reserved = new Set([
    'if',
    'for',
    'while',
    'switch',
    'catch',
    'return',
    'sizeof',
    'main',
  ]);
  const classNames = new Set();
  let match = null;

  const pushName = (name) => {
    if (!name || unique.has(name) || reserved.has(name)) return;
    unique.add(name);
    names.push(name);
  };

  const classRegex = /\bclass\s+([A-Za-z_]\w*)/g;
  while ((match = classRegex.exec(text)) !== null) {
    classNames.add(match[1]);
  }

  if (runtimeLang === 'python3') {
    const pyDefRegex = /\bdef\s+([A-Za-z_]\w*)\s*\(/g;
    while ((match = pyDefRegex.exec(text)) !== null) {
      pushName(match[1]);
    }
    return names.filter((name) => name !== '__init__');
  }

  const cLikeRegex = /\b([A-Za-z_]\w*)\s*\([^;{}]*\)\s*\{/g;
  while ((match = cLikeRegex.exec(text)) !== null) {
    const fnName = match[1];
    if (classNames.has(fnName)) continue;
    pushName(fnName);
  }

  return names;
};

const extractNamedFunctionHints = (code, runtimeLang = '') => {
  const jsStyleNames = extractDeclaredFunctionNames(code);
  const languageNames = extractLanguageFunctionNames(code, runtimeLang);
  const names = [...new Set([...jsStyleNames, ...languageNames])];
  const preferred = PREFERRED_FUNCTION_NAMES.filter((name) => names.includes(name) && name !== 'main');
  if (preferred.length > 0) return preferred;
  return names.filter((name) => name !== 'main');
};

const escapeForPythonTripleSingle = (text) => String(text || '').replace(/\\/g, '\\\\').replace(/'''/g, "\\'\\'\\'");
const escapeForCppString = (text) => String(text || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const escapeForJavaString = (text) => String(text || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const toCppLiteral = (value) => {
  if (value === null || value === undefined) return '0';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '0';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'string') return `"${escapeForCppString(value)}"`;
  if (Array.isArray(value)) return `{${value.map((item) => toCppLiteral(item)).join(', ')}}`;
  return '0';
};

const toJavaTypeAndLiteral = (value) => {
  if (Array.isArray(value)) {
    const child = value.length > 0 ? toJavaTypeAndLiteral(value[0]) : { type: 'int', literal: '0' };
    const type = `${child.type}[]`;
    const literal = `new ${child.type}[]{${value.map((item) => toJavaTypeAndLiteral(item).literal).join(', ')}}`;
    return { type, literal };
  }
  if (typeof value === 'boolean') return { type: 'boolean', literal: value ? 'true' : 'false' };
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { type: 'int', literal: String(value) };
    return { type: 'double', literal: String(value) };
  }
  return { type: 'String', literal: `"${escapeForJavaString(String(value ?? ''))}"` };
};

const buildPythonHarness = ({ code, parsedInput, candidateNames }) => {
  if (!candidateNames || candidateNames.length === 0) return null;
  const argsJson = JSON.stringify(parsedInput);
  const namesJson = JSON.stringify(candidateNames);

  return `${code}

import json as __judge_json

__judge_args = __judge_json.loads('''${escapeForPythonTripleSingle(argsJson)}''')
if isinstance(__judge_args, dict):
    __judge_args = list(__judge_args.values())
elif not isinstance(__judge_args, list):
    __judge_args = [__judge_args]
__judge_names = __judge_json.loads('''${escapeForPythonTripleSingle(namesJson)}''')

def __judge_dump(value):
    try:
        return __judge_json.dumps(value)
    except Exception:
        return str(value)

def __judge_try_callable(fn):
    try:
        result = fn(*__judge_args)
        if result is not None:
            print(__judge_dump(result))
        return True
    except Exception:
        return False

__judge_done = False
for __judge_name in __judge_names:
    __judge_fn = globals().get(__judge_name)
    if callable(__judge_fn) and __judge_try_callable(__judge_fn):
        __judge_done = True
        break

if not __judge_done:
    __judge_solution = globals().get('Solution')
    if __judge_solution:
        try:
            __judge_instance = __judge_solution()
            for __judge_name in __judge_names:
                __judge_fn = getattr(__judge_instance, __judge_name, None)
                if callable(__judge_fn) and __judge_try_callable(__judge_fn):
                    __judge_done = True
                    break
        except Exception:
            pass
`;
};

const buildCppHarnessVariants = ({ code, parsedInput, candidateNames }) => {
  if (!candidateNames || candidateNames.length === 0) return [];
  if (/\bmain\s*\(/.test(code)) return [];
  const args = valuesFromParsedInput(parsedInput);
  const argList = args.map((arg) => toCppLiteral(arg)).join(', ');
  const fnName = candidateNames[0];

  const printer = `
#include <iostream>
#include <vector>
#include <string>

template <typename T>
void __judge_print(const T& value) { std::cout << value; }

inline void __judge_print(const std::string& value) { std::cout << value; }
inline void __judge_print(const char* value) { std::cout << value; }
inline void __judge_print(const bool& value) { std::cout << (value ? "true" : "false"); }

template <typename T>
void __judge_print(const std::vector<T>& values) {
  std::cout << "[";
  for (size_t i = 0; i < values.size(); i++) {
    if (i) std::cout << ",";
    __judge_print(values[i]);
  }
  std::cout << "]";
}
`;

  const globalCall = `${code}
${printer}
int main() {
  auto __judge_result = ${fnName}(${argList});
  __judge_print(__judge_result);
  return 0;
}
`;

  const solutionCall = `${code}
${printer}
int main() {
  Solution __judge_solution;
  auto __judge_result = __judge_solution.${fnName}(${argList});
  __judge_print(__judge_result);
  return 0;
}
`;

  return [globalCall, solutionCall];
};

const buildCHarnessVariants = ({ code, parsedInput, candidateNames }) => {
  if (!candidateNames || candidateNames.length === 0) return [];
  if (/\bmain\s*\(/.test(code)) return [];
  const args = valuesFromParsedInput(parsedInput);
  const fnName = candidateNames[0];
  const variants = [];

  if (args.length === 2 && Array.isArray(args[0]) && args[0].every((n) => typeof n === 'number')) {
    const arr = args[0];
    const target = typeof args[1] === 'number' ? args[1] : 0;
    variants.push(`${code}
#include <stdio.h>
int main() {
  int nums[] = {${arr.join(', ')}};
  int target = ${target};
  int result = ${fnName}(nums, sizeof(nums) / sizeof(nums[0]), target);
  printf("%d", result);
  return 0;
}
`);
  }

  if (args.length > 0 && args.every((arg) => typeof arg === 'number')) {
    variants.push(`${code}
#include <stdio.h>
int main() {
  int result = ${fnName}(${args.map((n) => String(n)).join(', ')});
  printf("%d", result);
  return 0;
}
`);
  }

  return variants;
};

const buildJavaHarness = ({ code, parsedInput, candidateNames }) => {
  if (!candidateNames || candidateNames.length === 0) return null;
  if (/\bpublic\s+static\s+void\s+main\s*\(/.test(code)) return null;
  const solutionClassMatch = String(code).match(/\bclass\s+([A-Za-z_]\w*)/);
  const targetClassName = solutionClassMatch?.[1] || 'Solution';
  const args = valuesFromParsedInput(parsedInput);
  const javaArgs = args.map((arg, idx) => {
    const typed = toJavaTypeAndLiteral(arg);
    return `    ${typed.type} arg${idx} = ${typed.literal};`;
  });
  const objArgs = `new Object[]{${args.map((_, idx) => `arg${idx}`).join(', ')}}`;
  const candidateList = candidateNames.map((name) => `"${escapeForJavaString(name)}"`).join(', ');

  return `${code}
class Main {
  private static String __judgeStringify(Object value) {
    if (value == null) return "null";
    Class<?> cls = value.getClass();
    if (!cls.isArray()) return String.valueOf(value);
    StringBuilder sb = new StringBuilder();
    sb.append("[");
    int len = Array.getLength(value);
    for (int i = 0; i < len; i++) {
      if (i > 0) sb.append(",");
      sb.append(__judgeStringify(Array.get(value, i)));
    }
    sb.append("]");
    return sb.toString();
  }

  public static void main(String[] args) throws Exception {
${javaArgs.join('\n')}
    Object[] callArgs = ${objArgs};
    String[] candidates = new String[]{${candidateList}};

    Class<?> targetClass = Class.forName("${escapeForJavaString(targetClassName)}");

    Object instance = null;
    for (String name : candidates) {
      for (java.lang.reflect.Method m : targetClass.getDeclaredMethods()) {
        if (!m.getName().equals(name) || m.getParameterCount() != callArgs.length) continue;
        m.setAccessible(true);
        if (!java.lang.reflect.Modifier.isStatic(m.getModifiers())) {
          if (instance == null) instance = targetClass.getDeclaredConstructor().newInstance();
        }
        Object result = m.invoke(java.lang.reflect.Modifier.isStatic(m.getModifiers()) ? null : instance, callArgs);
        if (result != null) System.out.print(__judgeStringify(result));
        return;
      }
    }
  }
}
`;
};

const getPistonOutputMeta = (stdoutRaw) => {
  const stdout = String(stdoutRaw || '').trim();
  const stdoutLines = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lastStdoutLine = stdoutLines.length > 0 ? stdoutLines[stdoutLines.length - 1] : '';
  return { stdout, stdoutLines, lastStdoutLine };
};

const evaluatePistonResult = ({ testCase, stdoutRaw, stderrRaw }) => {
  const stderr = String(stderrRaw || '').trim();
  const { stdout, stdoutLines, lastStdoutLine } = getPistonOutputMeta(stdoutRaw);
  const noOutputError =
    !stderr && !stdout
      ? 'No output produced. For C/C++/Java/Python, print the final answer to stdout (or write a main method that reads stdin and prints output).'
      : null;
  const passedByFullStdout = compareOutputs(testCase.output, stdout);
  const passedByLastLine = lastStdoutLine ? compareOutputs(testCase.output, lastStdoutLine) : false;
  const passed = !stderr && !noOutputError && (passedByFullStdout || passedByLastLine);
  const actualOutput = stdout.length ? (passedByLastLine && !passedByFullStdout ? lastStdoutLine : stdout) : null;
  return {
    passed,
    actualOutput,
    logs: stdoutLines,
    error: stderr || noOutputError,
  };
};

const runPistonExecution = async ({ runtimeLang, code, stdinPayload }) => {
  const response = await fetch(PISTON_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: runtimeLang,
      version: '*',
      files: [{ content: code }],
      stdin: String(stdinPayload ?? ''),
    }),
  });
  const data = await response.json();
  const run = data?.run || {};
  return {
    stdout: String(run.stdout || ''),
    stderr: String(run.stderr || ''),
  };
};

const compareOutputs = (expectedOutput, actualOutput) => {
  const expectedVal = normalizeForCompare(expectedOutput);
  const actualVal = normalizeForCompare(actualOutput);

  if (typeof expectedVal === 'number' && typeof actualVal === 'number') {
    return Math.abs(expectedVal - actualVal) < 0.0001;
  }
  try {
    return JSON.stringify(expectedVal) === JSON.stringify(actualVal);
  } catch (e) {
    return String(expectedVal) === String(actualVal);
  }
};

const executeJavaScriptCase = ({ code, testCase, fileTag }) => {
  const logs = [];
  const parsedInput = parseInput(testCase.input);
  const sandbox = {
    console: {
      log: (...args) => {
        try {
          logs.push(args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '));
        } catch (e) {
          logs.push(String(args));
        }
      },
    },
    print: (...args) => sandbox.console.log(...args),
    input: parsedInput,
    module: {},
    exports: {},
  };

  if (parsedInput && typeof parsedInput === 'object' && !Array.isArray(parsedInput)) {
    Object.keys(parsedInput).forEach((key) => {
      sandbox[key] = parsedInput[key];
    });
  }

  const context = vm.createContext(sandbox);
  const wrappedCode = `"use strict";\n${code}\n`;
  let actualOutput = null;
  let passed = false;
  const start = Date.now();

  try {
    const script = new vm.Script(wrappedCode, { filename: fileTag });
    script.runInContext(context, { timeout: 1000 });

    const callable = pickCallableFunction(context);
    const args = valuesFromParsedInput(parsedInput);

    if (callable) {
      const invokeResult = callable.fn(...args);
      if (invokeResult !== undefined) actualOutput = invokeResult;
    }

    if (actualOutput === null) {
      const exportedFn = findExportedFunction(context);
      if (exportedFn) {
        const invokeResult = exportedFn(...args);
        if (invokeResult !== undefined) actualOutput = invokeResult;
      }
    }

    if (actualOutput === null) {
      const declaredInvocation = invokeDeclaredFunctionInContext({ context, code, args, fileTag });
      if (declaredInvocation?.error) throw declaredInvocation.error;
      if (declaredInvocation?.found && declaredInvocation.value !== undefined) {
        actualOutput = declaredInvocation.value;
      }
    }

    if (actualOutput === null && logs.length > 0) actualOutput = logs.join('\n');
    if (actualOutput === null) {
      if (context.module && context.module.exports) actualOutput = context.module.exports;
      else if (context.exports) actualOutput = context.exports;
    }

    passed = compareOutputs(testCase.output, actualOutput);
    const executionTime = Date.now() - start;
    return {
      passed,
      actualOutput,
      logs,
      executionTime,
      error: null,
    };
  } catch (err) {
    return {
      passed: false,
      actualOutput: null,
      logs,
      executionTime: Date.now() - start,
      error: err.message,
    };
  }
};

const executePistonCase = async ({ code, language, testCase }) => {
  const runtimeLang = LANGUAGE_ALIASES[String(language || '').toLowerCase()];
  if (!runtimeLang) {
    return {
      passed: false,
      actualOutput: null,
      logs: [],
      executionTime: 0,
      error: `Unsupported language: ${language}`,
    };
  }

  const start = Date.now();
  try {
    const parsedInput = parseInput(testCase.input);
    const stdinPayload =
      typeof parsedInput === 'string' ? parsedInput : JSON.stringify(parsedInput);
    const baseRun = await runPistonExecution({ runtimeLang, code, stdinPayload });
    const baseEval = evaluatePistonResult({
      testCase,
      stdoutRaw: baseRun.stdout,
      stderrRaw: baseRun.stderr,
    });
    if (baseEval.passed) {
      return {
        ...baseEval,
        executionTime: Date.now() - start,
      };
    }

    const candidateNames = extractNamedFunctionHints(code, runtimeLang);
    const fallbackPrograms = [];

    if (runtimeLang === 'python3') {
      const harness = buildPythonHarness({ code, parsedInput, candidateNames });
      if (harness) fallbackPrograms.push(harness);
    } else if (runtimeLang === 'java') {
      const harness = buildJavaHarness({ code, parsedInput, candidateNames });
      if (harness) fallbackPrograms.push(harness);
    } else if (runtimeLang === 'c++') {
      fallbackPrograms.push(...buildCppHarnessVariants({ code, parsedInput, candidateNames }));
    } else if (runtimeLang === 'c') {
      fallbackPrograms.push(...buildCHarnessVariants({ code, parsedInput, candidateNames }));
    }

    for (const candidateCode of fallbackPrograms) {
      const run = await runPistonExecution({
        runtimeLang,
        code: candidateCode,
        stdinPayload: '',
      });
      const evaluated = evaluatePistonResult({
        testCase,
        stdoutRaw: run.stdout,
        stderrRaw: run.stderr,
      });
      if (evaluated.passed) {
        return {
          ...evaluated,
          executionTime: Date.now() - start,
        };
      }
    }

    return {
      ...baseEval,
      executionTime: Date.now() - start,
    };
  } catch (err) {
    return {
      passed: false,
      actualOutput: null,
      logs: [],
      executionTime: Date.now() - start,
      error: `Language runner error: ${err.message}`,
    };
  }
};

const executeAgainstTestCases = async ({ code, language, testCases, filePrefix = 'submission' }) => {
  const normalizedLanguage = String(language || 'javascript').toLowerCase();
  const isJavaScript = normalizedLanguage === 'javascript' || normalizedLanguage === 'js';

  const testResults = [];
  let testsPassed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const baseResult = isJavaScript
      ? executeJavaScriptCase({
          code,
          testCase,
          fileTag: `${filePrefix}_test${i + 1}.js`,
        })
      : await executePistonCase({
          code,
          language: normalizedLanguage,
          testCase,
        });

    if (baseResult.passed) testsPassed++;

    testResults.push({
      testCase: i + 1,
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: baseResult.actualOutput,
      passed: baseResult.passed,
      error: baseResult.error,
      logs: baseResult.logs,
      executionTime: baseResult.executionTime,
    });
  }

  return { testResults, testsPassed };
};

// Submit solution
export const submitSolution = async (req, res) => {
  try {
    const { challengeId, code, language } = req.body;
    const userId = req.user.id;

    if (!challengeId || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide challengeId and code',
      });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }

    const effectiveTestCases = getEffectiveTestCases(challenge);
    if (effectiveTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No runnable test data found for this challenge.',
      });
    }

    // Create submission
    const submission = new Submission({
      userId,
      challengeId,
      code,
      language: normalizeSubmissionLanguage(language),
      totalTests: effectiveTestCases.length,
    });
    const { testResults, testsPassed } = await executeAgainstTestCases({
      code,
      language,
      testCases: effectiveTestCases,
      filePrefix: `submission_${submission._id || 'temp'}`,
    });

    submission.testsPassed = testsPassed;
    submission.testResults = testResults;
    submission.status = testsPassed === effectiveTestCases.length ? 'Accepted' : 'Wrong Answer';
    submission.executionTime = testResults.reduce((s, t) => s + (t.executionTime || 0), 0);
    submission.memory = Math.random() * 50;

    await submission.save();

    // Update challenge stats
    challenge.stats.totalAttempts += 1;
    if (submission.status === 'Accepted') {
      challenge.stats.totalSolutions += 1;
    }
    challenge.stats.acceptanceRate = (challenge.stats.totalSolutions / challenge.stats.totalAttempts) * 100;
    await challenge.save();

    // Update user stats
    const user = await User.findById(userId);
    user.stats.totalProblemsAttempted += 1;
    if (submission.status === 'Accepted') {
      user.stats.totalProblemsSolved += 1;
      await user.updateStreak();
    }
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Solution submitted successfully',
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Run code quickly without creating a submission (used by frontend 'Run Code')
export const runCode = async (req, res) => {
  try {
    const { challengeId, code, language, testCases } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide code' });
    }

    // Accept either a challengeId (load test cases from DB) or inline testCases
    let challenge;
    let effectiveTestCases = [];
    if (testCases && Array.isArray(testCases)) {
      challenge = { testCases };
    } else {
      if (!challengeId) return res.status(400).json({ success: false, message: 'Please provide challengeId or testCases' });
      challenge = await Challenge.findById(challengeId);
      if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      effectiveTestCases = testCases;
    } else {
      effectiveTestCases = getEffectiveTestCases(challenge);
    }

    if (effectiveTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No runnable test data found for this challenge.',
      });
    }

    const { testResults, testsPassed } = await executeAgainstTestCases({
      code,
      language,
      testCases: effectiveTestCases,
      filePrefix: 'run',
    });

    return res.status(200).json({ success: true, total: effectiveTestCases.length, passed: testsPassed, testResults });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all submissions for a challenge
export const getChallengeSubmissions = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const submissions = await Submission.find({ challengeId })
      .populate('userId', 'firstName lastName')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await Submission.find({ userId })
      .populate('challengeId', 'title difficulty category')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single submission
export const getSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate('userId', 'firstName lastName')
      .populate('challengeId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const buildLeaderboardRows = async (timeRange = 'all') => {
  const now = new Date();
  let fromDate = null;
  if (timeRange === 'today') {
    fromDate = new Date(now);
    fromDate.setHours(0, 0, 0, 0);
  } else if (timeRange === 'week') {
    fromDate = new Date(now);
    fromDate.setDate(now.getDate() - 7);
  } else if (timeRange === 'month') {
    fromDate = new Date(now);
    fromDate.setMonth(now.getMonth() - 1);
  }

  const matchStage = fromDate
    ? [{ $match: { submittedAt: { $gte: fromDate } } }]
    : [];

  const users = await User.find({})
    .select('firstName lastName email profileImage stats')
    .lean();

  const submissionStats = await Submission.aggregate([
    ...matchStage,
    {
      $group: {
        _id: '$userId',
        totalSubmissions: { $sum: 1 },
        acceptedSubmissions: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0],
          },
        },
        solvedChallenges: {
          $addToSet: {
            $cond: [{ $eq: ['$status', 'Accepted'] }, '$challengeId', null],
          },
        },
        lastSubmission: { $max: '$submittedAt' },
      },
    },
    {
      $project: {
        totalSubmissions: 1,
        acceptedSubmissions: 1,
        lastSubmission: 1,
        problemsSolved: {
          $size: {
            $setDifference: ['$solvedChallenges', [null]],
          },
        },
        acceptanceRate: {
          $cond: [
            { $gt: ['$totalSubmissions', 0] },
            {
              $multiply: [
                { $divide: ['$acceptedSubmissions', '$totalSubmissions'] },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
  ]);

  const statMap = new Map(
    submissionStats.map((row) => [String(row._id), row])
  );

  const rows = users.map((user) => {
    const stats = statMap.get(String(user._id));
    return {
      userId: user._id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      profileImage: user.profileImage || null,
      problemsSolved: stats?.problemsSolved ?? user.stats?.totalProblemsSolved ?? 0,
      totalSubmissions: stats?.totalSubmissions ?? 0,
      acceptanceRate: Number((stats?.acceptanceRate ?? 0).toFixed(2)),
      currentStreak: user.stats?.currentStreak ?? 0,
      lastSubmission: stats?.lastSubmission || null,
    };
  });

  return rows;
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { difficulty, category, limit = 20 } = req.query;

    let matchStage = {};
    if (difficulty) {
      matchStage.difficulty = difficulty;
    }
    if (category) {
      matchStage.category = category;
    }

    // Aggregate user stats
    const leaderboard = await Submission.aggregate([
      {
        $match: { status: 'Accepted' },
      },
      {
        $group: {
          _id: '$userId',
          totalSolved: { $sum: 1 },
          lastSubmission: { $max: '$submittedAt' },
        },
      },
      {
        $sort: { totalSolved: -1, lastSubmission: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 1,
          totalSolved: 1,
          lastSubmission: 1,
          'userInfo.firstName': 1,
          'userInfo.lastName': 1,
          'userInfo.country': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get detailed leaderboard with ranking
export const getDetailedLeaderboard = async (req, res) => {
  try {
    const { limit = 50, sortBy = 'solved', timeRange = 'all' } = req.query;

    let leaderboard = await buildLeaderboardRows(timeRange);

    if (sortBy === 'acceptance') {
      leaderboard.sort(
        (a, b) =>
          b.acceptanceRate - a.acceptanceRate ||
          b.problemsSolved - a.problemsSolved
      );
    } else if (sortBy === 'recent') {
      leaderboard.sort(
        (a, b) =>
          new Date(b.lastSubmission || 0) - new Date(a.lastSubmission || 0)
      );
    } else if (sortBy === 'streak') {
      leaderboard.sort(
        (a, b) =>
          b.currentStreak - a.currentStreak ||
          b.problemsSolved - a.problemsSolved
      );
    } else {
      leaderboard.sort(
        (a, b) =>
          b.problemsSolved - a.problemsSolved ||
          b.acceptanceRate - a.acceptanceRate
      );
    }

    leaderboard = leaderboard.slice(0, parseInt(limit, 10));

    leaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user ranking
export const getUserRanking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = 'all' } = req.query;
    const leaderboard = await buildLeaderboardRows(timeRange);
    leaderboard.sort(
      (a, b) =>
        b.problemsSolved - a.problemsSolved ||
        b.acceptanceRate - a.acceptanceRate
    );

    const index = leaderboard.findIndex(
      (entry) => String(entry.userId) === String(userId)
    );

    if (index === -1) {
      return res.status(200).json({
        success: true,
        ranking: null,
        message: 'User not found in leaderboard',
      });
    }

    const current = leaderboard[index];

    res.status(200).json({
      success: true,
      ranking: {
        rank: index + 1,
        problemsSolved: current.problemsSolved,
        acceptanceRate: current.acceptanceRate,
        totalSubmissions: current.totalSubmissions,
        currentStreak: current.currentStreak,
        user: {
          firstName: current.firstName,
          lastName: current.lastName,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

