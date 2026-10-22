import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=API_KEY
)


# ============================================================
# ALLOWED PATTERNS
# ============================================================

ALLOWED_PATTERNS = {
    "Two Pointers": [
        "Two Pointers"
    ],

    "Sliding Window": [
        "Fixed Window",
        "Variable Window"
    ],

    "Binary Search": [
        "Standard Binary Search",
        "Binary Search on Answer"
    ],

    "Hashing": [
        "Hash Map / Dictionary",
        "Frequency Counting",
        "Existence / Lookup"
    ],

    "Stack and Queue": [
        "Stack",
        "Monotonic Stack",
        "Increasing Monotonic Stack",
        "Decreasing Monotonic Stack",
        "Queue"
    ],

    "Linked List": [
        "Slow & Fast Pointer",
        "Reverse Technique",
        "Dummy Node"
    ],

    "Trees": [
        "BFS",
        "Level Order Traversal",
        "DFS",
        "Path-based problems",
        "Tree-property problems",
        "Depth computation"
    ],

    "Graphs": [
        "BFS",
        "DFS",
        "Topological Sort",
        "Kahn's Algorithm",
        "DFS-based Topological Sort"
    ],

    "Recursion / Backtracking": [
        "Recursion",
        "Backtracking",
        "Pruning"
    ],

    "Dynamic Programming": [
        "1D DP (Linear)",
        "2D DP (Grid)",
        "String DP",
        "Knapsack Variants",
        "Interval DP",
        "Tree DP"
    ],

    "Greedy": [
        "Greedy / Local Optimal Choice"
    ],

    "Heap / Priority Queue": [
        "Min Heap",
        "Max Heap",
        "Heap of Size K"
    ],

    "Bit Manipulation": [
        "AND",
        "OR",
        "XOR",
        "Bit Shifts"
    ],
}


# ============================================================
# ALLOWED DATA STRUCTURES
# ============================================================

ALLOWED_DATA_STRUCTURES = [
    "Array",
    "String",
    "Hash Map",
    "Hash Set",
    "Stack",
    "Queue",
    "Linked List",
    "Tree",
    "Binary Tree",
    "Graph",
    "Heap",
    "Trie",
]


# ============================================================
# ALLOWED ALGORITHMS
# ============================================================

ALLOWED_ALGORITHMS = [
    "Sorting",
    "Binary Search",
    "Depth First Search",
    "Breadth First Search",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "Backtracking",
    "Dynamic Programming",
    "Greedy",
]


# ============================================================
# SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = f"""
You are a coding solution analysis agent.

Analyze the ACTUAL submitted code.

Do not analyze what techniques could have been used.

Only identify techniques that are actually used in the submitted code.

============================================================
ALLOWED PATTERNS
============================================================

{ALLOWED_PATTERNS}

Pattern hierarchy:

Two Pointers
- Two Pointers

Sliding Window
- Fixed Window
- Variable Window

Binary Search
- Standard Binary Search
- Binary Search on Answer

Hashing
- Hash Map / Dictionary
- Frequency Counting
- Existence / Lookup

Stack and Queue
- Stack
- Monotonic Stack
- Increasing Monotonic Stack
- Decreasing Monotonic Stack
- Queue

Linked List
- Slow & Fast Pointer
- Reverse Technique
- Dummy Node

Trees
- BFS
- Level Order Traversal
- DFS
- Path-based problems
- Tree-property problems
- Depth computation

Graphs
- BFS
- DFS
- Topological Sort
- Kahn's Algorithm
- DFS-based Topological Sort

Recursion / Backtracking
- Recursion
- Backtracking
- Pruning

Dynamic Programming
- 1D DP (Linear)
- 2D DP (Grid)
- String DP
- Knapsack Variants
- Interval DP
- Tree DP

Greedy
- Greedy / Local Optimal Choice

Heap / Priority Queue
- Min Heap
- Max Heap
- Heap of Size K

Bit Manipulation
- AND
- OR
- XOR
- Bit Shifts


============================================================
ALLOWED DATA STRUCTURES
============================================================

{ALLOWED_DATA_STRUCTURES}


============================================================
ALLOWED ALGORITHMS
============================================================

{ALLOWED_ALGORITHMS}


============================================================
RULES
============================================================

1. Analyze the submitted code itself.

2. Do not infer a pattern merely because the problem is commonly
   associated with that pattern.

3. Only identify patterns that are actually implemented in the code.

4. Multiple patterns can be returned if multiple patterns are
   genuinely used.

5. For every detected pattern, return:

   - main_pattern
   - subpattern
   - confidence
   - reason

6. main_pattern must be one of the allowed main patterns.

7. subpattern must belong to that main pattern's hierarchy.

8. If a pattern has no meaningful subpattern, use null.

9. confidence must be a number between 0 and 1.

10. reason must briefly explain exactly what in the submitted code
    demonstrates the pattern.

11. Do not invent patterns.

12. Do not include techniques that are not actually used.

13. Use exact capitalization from the allowed lists.

14. Determine the actual time complexity of the submitted code.

15. Determine the actual space complexity of the submitted code.

16. Multiple data structures may be returned.

17. Multiple algorithms may be returned.

18. Only return a data structure if it is actually used by the code.

19. Only return an algorithm if it is actually implemented or directly
    used by the code.

20. Return ONLY valid JSON.

21. Do not wrap the JSON in markdown.

22. Do not add comments outside the JSON.


============================================================
EXPECTED JSON STRUCTURE
============================================================

{{
    "patterns": [
        {{
            "main_pattern": "Hashing",
            "subpattern": "Hash Map / Dictionary",
            "confidence": 0.95,
            "reason": "The code stores previously seen values in a HashMap and performs complement lookups."
        }}
    ],
    "data_structures": [
        "Array",
        "Hash Map"
    ],
    "algorithms": [],
    "time_complexity": "O(n)",
    "space_complexity": "O(n)",
    "explanation": "Short explanation of the actual implementation."
}}


If no patterns are detected:

{{
    "patterns": [],
    "data_structures": [],
    "algorithms": [],
    "time_complexity": "",
    "space_complexity": "",
    "explanation": ""
}}
"""


# ============================================================
# VALIDATE PATTERNS
# ============================================================

def validate_patterns(patterns):
    """
    Validate pattern objects returned by the LLM.

    Expected format:
    {
        "main_pattern": "Hashing",
        "subpattern": "Hash Map / Dictionary",
        "confidence": 0.95,
        "reason": "The code stores previously seen values in a HashMap."
    }
    """

    valid_patterns = []

    if not isinstance(patterns, list):
        return valid_patterns

    for pattern in patterns:

        # Pattern must be a dictionary
        if not isinstance(pattern, dict):
            continue

        main_pattern = pattern.get("main_pattern")
        subpattern = pattern.get("subpattern")
        confidence = pattern.get("confidence")
        reason = pattern.get("reason")

        # ----------------------------------------------------
        # Validate main pattern
        # ----------------------------------------------------

        if main_pattern not in ALLOWED_PATTERNS:
            continue

        # ----------------------------------------------------
        # Validate subpattern
        # ----------------------------------------------------

        allowed_subpatterns = ALLOWED_PATTERNS[main_pattern]

        if subpattern is not None:
            if subpattern not in allowed_subpatterns:
                continue

        # ----------------------------------------------------
        # Validate confidence
        # ----------------------------------------------------

        try:
            confidence = float(confidence)
        except (TypeError, ValueError):
            continue

        # Clamp confidence between 0 and 1
        confidence = max(0.0, min(1.0, confidence))

        # ----------------------------------------------------
        # Validate reason
        # ----------------------------------------------------

        if not isinstance(reason, str):
            reason = ""

        # ----------------------------------------------------
        # Store clean pattern
        # ----------------------------------------------------

        valid_patterns.append({
            "main_pattern": main_pattern,
            "subpattern": subpattern,
            "confidence": confidence,
            "reason": reason
        })

    return valid_patterns


def validate_list(values, allowed_values):
    """
    Validate a list of strings against an allowed list.
    """

    if not isinstance(values, list):
        return []

    return [
        value
        for value in values
        if isinstance(value, str)
        and value in allowed_values
    ]


# ============================================================
# ANALYZE SOLUTION
# ============================================================

def analyze_solution(problem_description: str, code: str):

    response = client.models.generate_content(
        model="gemini-2.5-flash",

        contents=f"""
{SYSTEM_PROMPT}

PROBLEM:
{problem_description}

CODE:
{code}
""",

        config=types.GenerateContentConfig(
            temperature=0,
            response_mime_type="application/json",
        ),
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    result = json.loads(response.text)

    # --------------------------------------------------------
    # Validate patterns
    # --------------------------------------------------------

    result["patterns"] = validate_patterns(
        result.get("patterns", [])
    )

    # --------------------------------------------------------
    # Validate data structures
    # --------------------------------------------------------

    result["data_structures"] = validate_list(
        result.get("data_structures", []),
        ALLOWED_DATA_STRUCTURES
    )

    # --------------------------------------------------------
    # Validate algorithms
    # --------------------------------------------------------

    result["algorithms"] = validate_list(
        result.get("algorithms", []),
        ALLOWED_ALGORITHMS
    )

    # --------------------------------------------------------
    # Ensure remaining fields exist
    # --------------------------------------------------------

    result["time_complexity"] = result.get(
        "time_complexity",
        ""
    )

    result["space_complexity"] = result.get(
        "space_complexity",
        ""
    )

    result["explanation"] = result.get(
        "explanation",
        ""
    )

    return result
# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    problem_description = """
    Given an integer array nums, find all unique triplets
    [nums[i], nums[j], nums[k]] such that:

    i != j
    i != k
    j != k

    and nums[i] + nums[j] + nums[k] == 0.
    """

    code = """
class Solution {

    public List<List<Integer>> threeSum(int[] nums) {

        Arrays.sort(nums);

        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {

            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            int left = i + 1;
            int right = nums.length - 1;

            while (left < right) {

                int sum = nums[i]
                        + nums[left]
                        + nums[right];

                if (sum == 0) {

                    result.add(
                        Arrays.asList(
                            nums[i],
                            nums[left],
                            nums[right]
                        )
                    );

                    left++;
                    right--;

                } else if (sum < 0) {

                    left++;

                } else {

                    right--;
                }
            }
        }

        return result;
    }
}
"""

    analysis = analyze_solution(
        problem_description,
        code
    )

    print(
        json.dumps(
            analysis,
            indent=2
        )
    )