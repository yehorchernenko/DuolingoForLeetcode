/*
 * Blind 75 track: the Medium and Hard problems from the Blind 75 list, 3 cards each.
 * Easy problems are left out on purpose (Two Sum, Valid Anagram, Reverse Linked List, ...).
 *
 * Same card format as cards.js, plus `p` = LeetCode problem number (see PROBLEMS).
 * Code cards contain a `________` blank; option text (minus backticks) is pasted into it.
 * tests/check_snippets.py runs every code card: the correct option must pass the tests,
 * and every wrong option must fail them.
 */
(() => {
  const py = (s) => s.raw[0].replace(/^\n/, "").trimEnd();

  // number: [title, slug, difficulty, premium?]
  const PROBLEMS = {
    238: ["Product of Array Except Self", "product-of-array-except-self", "Medium"],
    53: ["Maximum Subarray", "maximum-subarray", "Medium"],
    152: ["Maximum Product Subarray", "maximum-product-subarray", "Medium"],
    153: ["Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "Medium"],
    33: ["Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "Medium"],
    15: ["3Sum", "3sum", "Medium"],
    11: ["Container With Most Water", "container-with-most-water", "Medium"],
    371: ["Sum of Two Integers", "sum-of-two-integers", "Medium"],
    322: ["Coin Change", "coin-change", "Medium"],
    300: ["Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium"],
    1143: ["Longest Common Subsequence", "longest-common-subsequence", "Medium"],
    139: ["Word Break", "word-break", "Medium"],
    39: ["Combination Sum", "combination-sum", "Medium"],
    198: ["House Robber", "house-robber", "Medium"],
    213: ["House Robber II", "house-robber-ii", "Medium"],
    91: ["Decode Ways", "decode-ways", "Medium"],
    62: ["Unique Paths", "unique-paths", "Medium"],
    55: ["Jump Game", "jump-game", "Medium"],
    133: ["Clone Graph", "clone-graph", "Medium"],
    207: ["Course Schedule", "course-schedule", "Medium"],
    417: ["Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium"],
    200: ["Number of Islands", "number-of-islands", "Medium"],
    128: ["Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium"],
    269: ["Alien Dictionary", "alien-dictionary", "Hard", true],
    261: ["Graph Valid Tree", "graph-valid-tree", "Medium", true],
    323: ["Number of Connected Components in an Undirected Graph", "number-of-connected-components-in-an-undirected-graph", "Medium", true],
    57: ["Insert Interval", "insert-interval", "Medium"],
    56: ["Merge Intervals", "merge-intervals", "Medium"],
    435: ["Non-overlapping Intervals", "non-overlapping-intervals", "Medium"],
    253: ["Meeting Rooms II", "meeting-rooms-ii", "Medium", true],
    347: ["Top K Frequent Elements", "top-k-frequent-elements", "Medium"],
    295: ["Find Median from Data Stream", "find-median-from-data-stream", "Hard"],
    23: ["Merge k Sorted Lists", "merge-k-sorted-lists", "Hard"],
    19: ["Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium"],
    143: ["Reorder List", "reorder-list", "Medium"],
    73: ["Set Matrix Zeroes", "set-matrix-zeroes", "Medium"],
    54: ["Spiral Matrix", "spiral-matrix", "Medium"],
    48: ["Rotate Image", "rotate-image", "Medium"],
    79: ["Word Search", "word-search", "Medium"],
    3: ["Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium"],
    424: ["Longest Repeating Character Replacement", "longest-repeating-character-replacement", "Medium"],
    76: ["Minimum Window Substring", "minimum-window-substring", "Hard"],
    49: ["Group Anagrams", "group-anagrams", "Medium"],
    5: ["Longest Palindromic Substring", "longest-palindromic-substring", "Medium"],
    647: ["Palindromic Substrings", "palindromic-substrings", "Medium"],
    271: ["Encode and Decode Strings", "encode-and-decode-strings", "Medium", true],
    124: ["Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "Hard"],
    102: ["Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium"],
    297: ["Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "Hard"],
    105: ["Construct Binary Tree from Preorder and Inorder Traversal", "construct-binary-tree-from-preorder-and-inorder-traversal", "Medium"],
    98: ["Validate Binary Search Tree", "validate-binary-search-tree", "Medium"],
    230: ["Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "Medium"],
    208: ["Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "Medium"],
    211: ["Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "Medium"],
    212: ["Word Search II", "word-search-ii", "Hard"],
  };
  window.PROBLEMS = Object.fromEntries(Object.entries(PROBLEMS).map(([n, [title, slug, diff, premium]]) =>
    [n, { num: +n, title, url: `https://leetcode.com/problems/${slug}/`, diff, premium: !!premium }]));

  const units = [
    {
      id: "b75arr",
      title: "Arrays & Bits",
      icon: "📦",
      desc: "Prefix products, Kadane, rotated arrays, 3Sum, bit addition.",
      cards: [
        // 238 Product of Array Except Self
        { id: "b238a", p: 238, q: "Product of Array Except Self in O(n) without division. Approach?",
          o: ["Prefix products from the left, then multiply in suffix products from the right", "Total product, then divide by each nums[i]", "Sort, then multiply neighbors", "For each i, multiply every other element"],
          e: "res[i] = (product of everything before i) × (product of everything after i). Two passes, O(1) extra space besides the output." },
        { id: "b238b", p: 238, q: "Fill in the suffix pass.",
          c: py`
def product_except_self(nums):
    n = len(nums)
    res = [1] * n
    for i in range(1, n):
        res[i] = res[i - 1] * nums[i - 1]   # prefix product
    suffix = 1
    for i in range(n - 1, -1, -1):
        ________
        suffix *= nums[i]
    return res`,
          o: ["`res[i] *= suffix`", "`res[i] = suffix`", "`res[i] *= suffix * nums[i]`", "`suffix *= res[i]`"],
          e: "res[i] already holds the prefix product, so multiply the suffix into it. Update suffix after using it, so it never includes nums[i]." },
        { id: "b238c", p: 238, q: "Product of Array Except Self: why not compute the total product and divide by nums[i]?",
          o: ["A zero in the array makes the division impossible", "Division is O(n) per element", "Python integers overflow", "It returns the answer in reverse order"],
          e: "With one zero, only that index is non-zero; with two zeros everything is 0. The problem also bans division. Prefix × suffix handles every case." },

        // 53 Maximum Subarray
        { id: "b53a", p: 53, q: "Maximum Subarray: largest sum of a contiguous subarray. Approach?",
          o: ["Kadane: at each index, extend the running sum or restart at the current number", "Sliding window that shrinks when the sum drops below zero", "Sort and add up all positive numbers", "Prefix sums with a hash map of seen sums"],
          e: "O(n) time, O(1) space. Sorting destroys contiguity." },
        { id: "b53b", p: 53, q: "Fill in Kadane's update.",
          c: py`
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        ________
        best = max(best, cur)
    return best`,
          o: ["`cur = max(x, cur + x)`", "`cur = max(cur, cur + x)`", "`cur = cur + x`", "`cur = max(0, cur + x)`"],
          e: "Either the best subarray ending here extends the previous one, or it starts fresh at x." },
        { id: "b53c", p: 53, q: "A common Kadane variant starts `best = 0` and resets `cur = 0` when it goes negative. Which input breaks it?",
          o: ["All negative numbers, like [-3, -1, -2]", "All positive numbers", "A single positive number", "An array with a zero in the middle"],
          e: "It returns 0, but the subarray must be non-empty, so the answer is -1. Initialize with nums[0]." },

        // 152 Maximum Product Subarray
        { id: "b152a", p: 152, q: "Maximum Product Subarray: what must you track at each index?",
          o: ["Both the largest and the smallest product ending here", "Only the largest product ending here", "The count of negative numbers so far", "A prefix product array and its maximum"],
          e: "Multiplying by a negative number turns the smallest (most negative) product into the largest." },
        { id: "b152b", p: 152, q: "Fill in the update.",
          c: py`
def max_product(nums):
    res = cur_max = cur_min = nums[0]
    for x in nums[1:]:
        candidates = (x, x * cur_max, x * cur_min)
        ________
        res = max(res, cur_max)
    return res`,
          o: ["`cur_max, cur_min = max(candidates), min(candidates)`", "`cur_max = max(candidates)`", "`cur_max, cur_min = max(x, x * cur_max), min(x, x * cur_min)`", "`cur_max, cur_min = max(candidates), min(x, cur_min)`"],
          e: "Both values must come from the same three candidates, computed before either is overwritten. [-2, 3, -4] → 24 only works if cur_min carries -6 forward." },
        { id: "b152c", p: 152, q: "Maximum Product Subarray: how does this solution handle a 0 in the array?",
          o: ["x itself is a candidate, so the product restarts right after the zero", "Zeros must be removed before the loop", "It needs a special case that splits the array", "cur_min absorbs the zero and keeps the product"],
          e: "At a zero, cur_max = cur_min = 0. At the next number, `x` alone wins, which starts a new subarray." },

        // 153 Find Minimum in Rotated Sorted Array
        { id: "b153a", p: 153, q: "Fill in the binary search.",
          c: py`
def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            ________
        else:
            hi = mid
    return nums[lo]`,
          o: ["`lo = mid + 1`", "`lo = mid`", "`hi = mid - 1`", "`lo = hi`"],
          e: "nums[mid] > nums[hi] means the drop (the minimum) is strictly right of mid. `lo = mid` loops forever on [2, 1]." },
        { id: "b153b", p: 153, q: "Find Minimum in Rotated Sorted Array: why `hi = mid` and not `hi = mid - 1` in the else branch?",
          o: ["nums[mid] might be the minimum itself, so it must stay in range", "To avoid an index error at the end", "It makes the loop run fewer times", "Both work the same"],
          e: "When nums[mid] ≤ nums[hi], mid could be the answer. Dropping it can skip the minimum." },
        { id: "b153c", p: 153, q: "Why compare nums[mid] with nums[hi] rather than nums[lo]?",
          o: ["nums[mid] > nums[lo] is also true for an unrotated array, where the minimum is on the left, so it's ambiguous", "nums[lo] can go out of bounds", "Comparing with hi is faster", "Comparing with lo works just as well"],
          e: "Comparing with hi always tells you which side holds the drop. Comparing with lo needs extra special cases." },

        // 33 Search in Rotated Sorted Array
        { id: "b33a", p: 33, q: "Search in Rotated Sorted Array: after computing mid, what do you check first?",
          o: ["Which half, lo..mid or mid..hi, is sorted", "Whether target is greater than nums[0]", "Where the pivot is, with a linear scan", "Whether nums[mid] is the maximum"],
          e: "One half is always sorted. If the target lies within that half's range, search there; otherwise search the other half. O(log n)." },
        { id: "b33b", p: 33, q: "Fill in the condition for the sorted left half.",
          c: py`
def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:          # left half is sorted
            ________
                hi = mid - 1
            else:
                lo = mid + 1
        else:                              # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
          o: ["`if nums[lo] <= target < nums[mid]:`", "`if target < nums[mid]:`", "`if nums[lo] < target < nums[mid]:`", "`if nums[lo] <= target <= nums[hi]:`"],
          e: "Go left only if target is inside the sorted range [nums[lo], nums[mid]). Using `<` on the left end misses target == nums[lo]." },
        { id: "b33c", p: 33, q: "Why `nums[lo] <= nums[mid]` (with `<=`) to detect a sorted left half?",
          o: ["When lo == mid, the left half is one element and must count as sorted", "To handle duplicate values", "It makes no difference", "To avoid integer overflow"],
          e: "With `<`, [3, 1] and target 1 checks the wrong half and returns -1." },

        // 15 3Sum
        { id: "b15a", p: 15, q: "3Sum: after sorting and fixing nums[i], how do you find pairs that sum to -nums[i]?",
          o: ["Two pointers from i+1 and the end, moving inward", "Nested loops over every j and k", "Binary search over the whole array", "A sliding window of size 3"],
          e: "Sum too small → move left up; too big → move right down. O(n) per i, O(n²) total." },
        { id: "b15b", p: 15, q: "Fill in the duplicate skip after a match.",
          c: py`
def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                l += 1
                ________
    return res`,
          o: ["`while l < r and nums[l] == nums[l - 1]: l += 1`", "`r -= 1`", "`l += 1`", "`while l < r and nums[l] == nums[l + 1]: l += 1`"],
          e: "After recording a triplet, skip every left value equal to the one just used. Otherwise [-2, 0, 0, 2, 2] reports [-2, 0, 2] twice." },
        { id: "b15c", p: 15, q: "3Sum: why can you `break` out of the outer loop once nums[i] > 0?",
          o: ["The array is sorted, so every later number is also positive and no triplet can sum to 0", "Positive numbers never appear in a valid triplet", "To skip duplicates", "You can't, that would be a bug"],
          e: "A small pruning step that LeetCode solutions often use." },

        // 11 Container With Most Water
        { id: "b11a", p: 11, q: "Container With Most Water: where do the pointers start, and why?",
          o: ["At both ends: the widest container. Then shrink the width only to find taller lines", "Both at the tallest line", "In the middle, expanding outward", "Sort the heights and pair the two tallest"],
          e: "Width only shrinks, so a move is only worth it if it might find a taller limiting line." },
        { id: "b11b", p: 11, q: "Fill in which pointer moves.",
          c: py`
def max_area(height):
    l, r = 0, len(height) - 1
    best = 0
    while l < r:
        best = max(best, (r - l) * min(height[l], height[r]))
        if ________:
            l += 1
        else:
            r -= 1
    return best`,
          o: ["`height[l] < height[r]`", "`height[l] > height[r]`", "`height[l] < height[l + 1]`", "`r - l > len(height) // 2`"],
          e: "Move the shorter line. The shorter line limits the area, and every other container that uses it is narrower, so it can be dropped." },
        { id: "b11c", p: 11, q: "Container With Most Water (two pointers): time and space?",
          o: ["O(n) time, O(1) space", "O(n log n) time, O(1) space", "O(n²) time, O(1) space", "O(n) time, O(n) space"],
          e: "Each step moves one pointer inward, so n − 1 steps in total." },

        // 371 Sum of Two Integers
        { id: "b371a", p: 371, q: "Sum of Two Integers without + or −: what do XOR and AND give you?",
          o: ["a ^ b is the sum without carries; (a & b) << 1 is the carry", "a & b is the sum; a ^ b is the carry", "a | b is the sum; a & b is the carry", "a ^ b is the carry; a | b is the sum"],
          e: "Repeat sum = a ^ b, carry = (a & b) << 1 until the carry is 0." },
        { id: "b371b", p: 371, q: "Fill in the loop body (Python, emulating 32-bit ints).",
          c: py`
def get_sum(a, b):
    mask = 0xFFFFFFFF
    a, b = a & mask, b & mask
    while b:
        ________
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)`,
          o: ["`a, b = (a ^ b) & mask, ((a & b) << 1) & mask`", "`a = (a ^ b) & mask; b = ((a & b) << 1) & mask`", "`a, b = (a | b) & mask, ((a & b) << 1) & mask`", "`a, b = (a & b) & mask, ((a ^ b) << 1) & mask`"],
          e: "Both new values must come from the OLD a and b. The two-statement version computes the carry from the already-updated a." },
        { id: "b371c", p: 371, q: "Sum of Two Integers: why does the Python version need `& 0xFFFFFFFF`?",
          o: ["Python ints are unbounded, so with a negative number the carry would grow forever", "XOR is undefined for negative numbers in Python", "It makes the loop faster", "Python has no << operator for negative numbers"],
          e: "Masking emulates 32-bit overflow. At the end, `~(a ^ mask)` turns a value above 0x7FFFFFFF back into a negative Python int." },
      ],
    },

    {
      id: "b75dp",
      title: "Dynamic Programming",
      icon: "🧩",
      desc: "Coin change, LIS, LCS, word break, robbers, decode ways.",
      cards: [
        // 322 Coin Change
        { id: "b322a", p: 322, q: "Coin Change: fewest coins to make `amount`. Approach?",
          o: ["Bottom-up DP over amounts: dp[a] = min(dp[a − c] + 1)", "Greedy: take the largest coin that fits", "Backtracking over every combination", "Sort coins, then binary search"],
          e: "O(amount × number of coins) time, O(amount) space." },
        { id: "b322b", p: 322, q: "Fill in the transition.",
          c: py`
def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)     # amount + 1 means "impossible"
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                ________
    return dp[amount] if dp[amount] <= amount else -1`,
          o: ["`dp[a] = min(dp[a], dp[a - c] + 1)`", "`dp[a] += dp[a - c]`", "`dp[a] = dp[a - c] + 1`", "`dp[a] = min(dp[a], dp[c] + 1)`"],
          e: "Try each coin as the last coin used. `dp[a] += dp[a - c]` counts the number of WAYS instead; that's Coin Change II." },
        { id: "b322c", p: 322, q: "Coin Change: why not take the biggest coin that fits each time?",
          o: ["With coins [1, 3, 4] and amount 6, greedy picks 4+1+1 (3 coins), but 3+3 needs only 2", "Greedy is too slow", "Greedy fails only when amount is 0", "It works; DP is only for counting ways"],
          e: "Greedy only works for 'canonical' coin systems like real currency. Interview inputs are arbitrary." },

        // 300 LIS
        { id: "b300a", p: 300, q: "LIS in O(n log n): what does `tails[k]` store?",
          o: ["The smallest possible tail of an increasing subsequence of length k+1", "The actual longest subsequence found so far", "The largest element seen up to index k", "How many subsequences end at index k"],
          e: "Keeping tails small leaves the most room to extend. tails stays sorted, so binary search works." },
        { id: "b300b", p: 300, q: "Fill in the replace step.",
          c: py`
from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            ________
    return len(tails)`,
          o: ["`tails[i] = x`", "`tails.insert(i, x)`", "`tails[i - 1] = x`", "`tails.append(x)`"],
          e: "x becomes a smaller tail for subsequences of length i+1. The length of tails is the answer; tails itself isn't a real subsequence." },
        { id: "b300c", p: 300, q: "LIS (strictly increasing): why `bisect_left` and not `bisect_right`?",
          o: ["With equal values, bisect_right appends a duplicate and counts [7, 7] as increasing", "bisect_right is slower", "bisect_left returns the length directly", "There's no difference"],
          e: "bisect_left replaces an equal value instead of extending past it. For a non-decreasing LIS you'd use bisect_right." },

        // 1143 LCS
        { id: "b1143a", p: 1143, q: "Longest Common Subsequence of strings of length m and n. Approach?",
          o: ["2D DP over prefixes of both strings, O(m·n)", "Sliding window over both strings", "Greedy: match each char at its first occurrence in the other string", "Hash set intersection of the characters"],
          e: "dp[i][j] = LCS of text1[:i] and text2[:j]." },
        { id: "b1143b", p: 1143, q: "Fill in the mismatch case.",
          c: py`
def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                ________
    return dp[m][n]`,
          o: ["`dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])`", "`dp[i][j] = dp[i - 1][j - 1]`", "`dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]) + 1`", "`dp[i][j] = 0`"],
          e: "On a mismatch, drop the last char of one string or the other and keep the better result." },
        { id: "b1143c", p: 1143, q: "Why is the LCS table (m+1) × (n+1) instead of m × n?",
          o: ["Row 0 and column 0 stand for empty prefixes, so i−1 and j−1 never go out of bounds", "To store the answer separately", "Python lists are 1-indexed", "To hold a sentinel for duplicates"],
          e: "Base cases (LCS with an empty string = 0) come for free." },

        // 139 Word Break
        { id: "b139a", p: 139, q: "Word Break: what does dp[i] mean?",
          o: ["s[:i] can be split into dictionary words", "s[i] starts a dictionary word", "Number of words used up to i", "s[i:] is a single dictionary word"],
          e: "dp[0] = True (empty string). The answer is dp[len(s)]." },
        { id: "b139b", p: 139, q: "Fill in the condition.",
          c: py`
def word_break(s, word_dict):
    words = set(word_dict)
    dp = [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        for j in range(i):
            if ________:
                dp[i] = True
                break
    return dp[len(s)]`,
          o: ["`dp[j] and s[j:i] in words`", "`s[j:i] in words`", "`dp[j] or s[j:i] in words`", "`dp[i - 1] and s[j:i] in words`"],
          e: "s[:i] works if some split point j has a breakable s[:j] AND a dictionary word s[j:i]." },
        { id: "b139c", p: 139, q: "Word Break: why does 'greedily take the longest matching word' fail?",
          o: ["'aaaa' with ['aaa', 'aa']: taking 'aaa' leaves 'a', but 'aa' + 'aa' works", "It's too slow", "It fails only on empty strings", "It doesn't fail"],
          e: "A choice that looks good locally can block the rest of the string. DP tries every split point." },

        // 39 Combination Sum
        { id: "b39a", p: 39, q: "Combination Sum (distinct candidates, reuse allowed): list every combination. Approach?",
          o: ["Backtracking with a start index, so each combination is built in one order", "DP that counts the number of ways", "BFS over partial sums", "Greedy using the largest candidate first"],
          e: "The start index stops [2, 3] and [3, 2] from both appearing." },
        { id: "b39b", p: 39, q: "Fill in the recursive call.",
          c: py`
def combination_sum(candidates, target):
    res = []
    def dfs(start, remaining, path):
        if remaining == 0:
            res.append(path[:])
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remaining:
                continue
            path.append(c)
            ________
            path.pop()
    dfs(0, target, [])
    return res`,
          o: ["`dfs(i, remaining - c, path)`", "`dfs(i + 1, remaining - c, path)`", "`dfs(0, remaining - c, path)`", "`dfs(start, remaining - c, path)`"],
          e: "Pass i (not i + 1) so the same number can be picked again. Passing 0 or start lets earlier numbers back in, which creates duplicate orderings." },
        { id: "b39c", p: 39, q: "Why `res.append(path[:])` instead of `res.append(path)`?",
          o: ["path keeps changing as you backtrack; a copy saves the current combination", "To sort the path", "To turn it into a tuple", "It's only for speed"],
          e: "Without the copy, every entry in res points to the same list, which ends up empty." },

        // 198 House Robber
        { id: "b198a", p: 198, q: "House Robber: why doesn't 'take all even or all odd indexes' work?",
          o: ["Sometimes skipping two houses in a row is best: [2, 1, 1, 2] → 4", "It does always work", "It fails only for negative values", "It fails only when n is odd"],
          e: "Even indexes give 3, odd give 3, but houses 0 and 3 give 4. DP considers every valid pattern." },
        { id: "b198b", p: 198, q: "Fill in the O(1)-space update.",
          c: py`
def rob(nums):
    prev2, prev1 = 0, 0      # best up to i-2, best up to i-1
    for x in nums:
        ________
    return prev1`,
          o: ["`prev2, prev1 = prev1, max(prev1, prev2 + x)`", "`prev2 = prev1; prev1 = max(prev1, prev2 + x)`", "`prev2, prev1 = prev1, prev2 + x`", "`prev2, prev1 = prev1, max(prev1, prev1 + x)`"],
          e: "Tuple assignment evaluates the right side with the OLD values. The two-statement version overwrites prev2 before using it." },
        { id: "b198c", p: 198, q: "House Robber: why can space drop from O(n) to O(1)?",
          o: ["dp[i] depends only on dp[i−1] and dp[i−2]", "The answer is always the last house", "Python reuses lists", "The houses can be sorted"],
          e: "This works whenever a recurrence only looks back a fixed number of steps." },

        // 213 House Robber II
        { id: "b213a", p: 213, q: "House Robber II: houses are in a circle. Approach?",
          o: ["Run House Robber on nums[1:] and on nums[:-1], take the max", "Run House Robber once and subtract min(first, last)", "Run it on nums[1:-1] and add max(first, last)", "A 2D DP over start and end index"],
          e: "The first and last houses can't both be robbed, so solve the line without one of them, then without the other." },
        { id: "b213b", p: 213, q: "Fill in rob_circle.",
          c: py`
def rob_line(nums):
    prev2 = prev1 = 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1

def rob_circle(nums):
    if len(nums) == 1:
        return nums[0]
    ________`,
          o: ["`return max(rob_line(nums[1:]), rob_line(nums[:-1]))`", "`return max(rob_line(nums), rob_line(nums[1:-1]))`", "`return rob_line(nums[1:-1])`", "`return max(rob_line(nums[1:]), rob_line(nums[:-1])) + nums[0]`"],
          e: "Exclude the last house, or exclude the first house. One of those two cases contains the optimal plan." },
        { id: "b213c", p: 213, q: "House Robber II: why the `len(nums) == 1` check?",
          o: ["Both nums[1:] and nums[:-1] are empty for one house, so you'd return 0 instead of nums[0]", "rob_line crashes on one element", "A circle needs at least 3 houses", "It's only a speed optimization"],
          e: "A single house has no neighbor, so rob it." },

        // 91 Decode Ways
        { id: "b91a", p: 91, q: "Decode Ways: which input breaks solutions that forget about '0'?",
          o: ["\"06\": 0 ways, because '0' isn't a letter and '06' isn't valid", "\"11\"", "\"26\"", "\"123\""],
          e: "'0' can only appear as the second digit of '10' or '20'." },
        { id: "b91b", p: 91, q: "Fill in the two-digit condition.",
          c: py`
def num_decodings(s):
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        if s[i - 1] != "0":
            dp[i] += dp[i - 1]
        if ________:
            dp[i] += dp[i - 2]
    return dp[n]`,
          o: ["`i >= 2 and \"10\" <= s[i - 2:i] <= \"26\"`", "`i >= 2 and s[i - 2:i] <= \"26\"`", "`i >= 2 and \"10\" <= s[i - 2:i] < \"26\"`", "`i >= 2 and s[i - 2] in \"12\"`"],
          e: "A valid pair is 10..26. String comparison works because both sides have two digits. '06' and '27' aren't letters." },
        { id: "b91c", p: 91, q: "Decode Ways: why is plain recursion slow, and what fixes it?",
          o: ["It solves the same suffix exponentially many times; memoize on the index (or fill a table)", "Recursion depth; use a stack", "String slicing; use indexes", "It isn't slow"],
          e: "Each index has only one answer, so memoizing gives O(n)." },

        // 62 Unique Paths
        { id: "b62a", p: 62, q: "Unique Paths (m × n grid, moving right or down): dp[r][c] = ?",
          o: ["dp[r−1][c] + dp[r][c−1]", "dp[r−1][c−1] + 1", "max(dp[r−1][c], dp[r][c−1])", "dp[r−1][c] × dp[r][c−1]"],
          e: "Every path into a cell comes from above or from the left." },
        { id: "b62b", p: 62, q: "Fill in the one-row version.",
          c: py`
def unique_paths(m, n):
    row = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            ________
    return row[-1]`,
          o: ["`row[c] += row[c - 1]`", "`row[c] = row[c - 1]`", "`row[c] += row[c]`", "`row[c] = row[c - 1] + 1`"],
          e: "Before the update, row[c] is the value from above; row[c−1] is already updated, the value from the left." },
        { id: "b62c", p: 62, q: "Unique Paths has a closed form. What is it?",
          o: ["C(m+n−2, m−1): choose which of the m+n−2 moves go down", "m × n", "2^(m+n)", "(m+n)!"],
          e: "Every path is exactly m−1 downs and n−1 rights in some order." },

        // 55 Jump Game
        { id: "b55a", p: 55, q: "Jump Game: why is greedy enough here?",
          o: ["Every index up to the farthest reach can be reached, so only that reach matters", "Jumps are always length 1", "Taking the largest jump each time is optimal", "It isn't; you need DP"],
          e: "'Largest jump each time' is a different, wrong strategy. Track max(i + nums[i]) instead." },
        { id: "b55b", p: 55, q: "Fill in the reach update.",
          c: py`
def can_jump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach:
            return False
        ________
    return True`,
          o: ["`reach = max(reach, i + x)`", "`reach = i + x`", "`reach += x`", "`reach = max(reach, x)`"],
          e: "Reach must never shrink: [2, 5, 0, 0] reaches the end from index 1 even though index 2 can't jump." },
        { id: "b55c", p: 55, q: "Jump Game greedy: time and space?",
          o: ["O(n) time, O(1) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(2ⁿ) time, O(n) space"],
          e: "One pass, one variable. The DP version is O(n²)." },
      ],
    },

    {
      id: "b75graph",
      title: "Graphs",
      icon: "🕸️",
      desc: "Cloning, topological sort, flood fill, union-find.",
      cards: [
        // 133 Clone Graph
        { id: "b133a", p: 133, q: "Clone Graph: what stops infinite loops on cycles?",
          o: ["A map from each original node to its clone, checked before creating a new one", "A visited set of node values only", "A recursion depth limit", "Cloning neighbors before the node itself"],
          e: "A visited set tells you a node was seen, but you also need its clone to link to. The map gives both." },
        { id: "b133b", p: 133, q: "Fill in the missing line.",
          c: py`
def clone_graph(node):
    if not node:
        return None
    clones = {}
    def dfs(n):
        if n in clones:
            return clones[n]
        copy = Node(n.val)
        ________
        copy.neighbors = [dfs(nb) for nb in n.neighbors]
        return copy
    return dfs(node)`,
          o: ["`clones[n] = copy`", "`clones[copy] = n`", "`clones[n.val] = copy`", "`copy.neighbors = n.neighbors`"],
          e: "Register the clone BEFORE visiting neighbors, so a neighbor that points back finds it instead of recursing forever." },
        { id: "b133c", p: 133, q: "Clone Graph: time and space for V nodes and E edges?",
          o: ["O(V + E) time, O(V) space", "O(V²) time, O(V²) space", "O(V · E) time, O(V) space", "O(E log V) time, O(E) space"],
          e: "Each node is cloned once and each edge is followed once." },

        // 207 Course Schedule
        { id: "b207a", p: 207, q: "Course Schedule: when is it impossible to finish all courses?",
          o: ["When the prerequisite graph has a cycle", "When a course has more than one prerequisite", "When the graph is disconnected", "When numCourses is odd"],
          e: "Courses can be finished iff a topological order exists, which means the graph is acyclic." },
        { id: "b207b", p: 207, q: "Fill in Kahn's algorithm.",
          c: py`
from collections import deque

def can_finish(num_courses, prerequisites):
    graph = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1
    queue = deque(i for i in range(num_courses) if indegree[i] == 0)
    taken = 0
    while queue:
        cur = queue.popleft()
        taken += 1
        for nxt in graph[cur]:
            indegree[nxt] -= 1
            ________
    return taken == num_courses`,
          o: ["`if indegree[nxt] == 0: queue.append(nxt)`", "`queue.append(nxt)`", "`if indegree[nxt] < 0: queue.append(nxt)`", "`if indegree[cur] == 0: queue.append(nxt)`"],
          e: "A course becomes available once its last prerequisite is done. Courses stuck in a cycle never reach in-degree 0, so taken < num_courses." },
        { id: "b207c", p: 207, q: "Course Schedule with DFS instead: how do you detect a cycle?",
          o: ["Three states: unvisited / in the current path / done. Reaching a node in the current path means a cycle", "A single visited set", "Count edges and compare with V − 1", "Union-find on the directed edges"],
          e: "A single visited set flags diamonds (two paths to one node) as false cycles. Union-find only works for undirected graphs." },

        // 417 Pacific Atlantic
        { id: "b417a", p: 417, q: "Pacific Atlantic Water Flow: why start the searches from the ocean edges?",
          o: ["One search per ocean costs O(m·n), instead of a separate search from every cell", "Edge cells are always the tallest", "DFS can't start in the middle", "To avoid recursion limits"],
          e: "Walk 'uphill' from each ocean's border. Cells reached from both oceans are the answer." },
        { id: "b417b", p: 417, q: "Fill in the uphill condition.",
          c: py`
def pacific_atlantic(heights):
    rows, cols = len(heights), len(heights[0])
    def dfs(r, c, seen):
        seen.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen
                    and ________):
                dfs(nr, nc, seen)
    pac, atl = set(), set()
    for r in range(rows):
        dfs(r, 0, pac)
        dfs(r, cols - 1, atl)
    for c in range(cols):
        dfs(0, c, pac)
        dfs(rows - 1, c, atl)
    return sorted(map(list, pac & atl))`,
          o: ["`heights[nr][nc] >= heights[r][c]`", "`heights[nr][nc] <= heights[r][c]`", "`heights[nr][nc] > heights[r][c]`", "`heights[nr][nc] == heights[r][c]`"],
          e: "Water flows to cells of equal or lower height. Going backwards from the ocean, you climb to equal or higher cells. Strict `>` misses flat areas." },
        { id: "b417c", p: 417, q: "Pacific Atlantic Water Flow: time complexity?",
          o: ["O(m·n)", "O((m·n)²)", "O(m·n·log(m·n))", "O(m + n)"],
          e: "Each ocean's search visits each cell at most once." },

        // 200 Number of Islands
        { id: "b200a", p: 200, q: "Fill in the missing line.",
          c: py`
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        ________
        sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count`,
          o: ["`grid[r][c] = \"0\"`", "`grid[r][c] = \"1\"`", "`return`", "`sink(r, c)`"],
          e: "Mark the cell as visited by sinking it BEFORE recursing, so neighbors don't come back to it." },
        { id: "b200b", p: 200, q: "Number of Islands: a 300 × 300 grid of all land crashes the recursive Python DFS. Why, and what's the fix?",
          o: ["Recursion depth reaches ~90,000, above Python's limit; use BFS or an explicit stack", "There are too many islands to count", "Integer overflow in count", "Strings are immutable; use ints"],
          e: "Interviewers like hearing that you know this. BFS with a deque has the same O(m·n) complexity." },
        { id: "b200c", p: 200, q: "Number of Islands: time and worst-case extra space (DFS, sinking cells in place)?",
          o: ["O(m·n) time, O(m·n) space for the stack", "O(m·n) time, O(1) space always", "O((m·n)²) time", "O(m + n) time"],
          e: "Union-find is an alternative with the same time complexity." },

        // 128 Longest Consecutive Sequence
        { id: "b128a", p: 128, q: "Fill in when to start counting a run.",
          c: py`
def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if ________:
            length = 1
            while x + length in s:
                length += 1
            best = max(best, length)
    return best`,
          o: ["`x - 1 not in s`", "`x + 1 not in s`", "`x - 1 in s`", "`x not in s`"],
          e: "Only start at the beginning of a run (no x−1). That keeps the total work O(n)." },
        { id: "b128b", p: 128, q: "Longest Consecutive Sequence: the inner while loop looks O(n²). Why is the total O(n)?",
          o: ["Counting only starts at the beginning of a run, so each number is walked over once", "The while loop runs at most once", "Hash sets make loops free", "It is O(n²) in the worst case"],
          e: "Amortized analysis: total inner-loop steps across all starts ≤ n." },
        { id: "b128c", p: 128, q: "Longest Consecutive Sequence: why not just sort?",
          o: ["Sorting is O(n log n); the problem requires O(n)", "Sorting breaks on duplicates", "Sorting is fine and preferred", "You can't sort negative numbers"],
          e: "Mention sorting as the simple first idea, then improve it with a hash set." },

        // 269 Alien Dictionary
        { id: "b269a", p: 269, q: "Alien Dictionary: which edges do you build from the sorted word list?",
          o: ["One edge from the first differing character of each adjacent pair, then topological sort", "Edges between every pair of characters inside each word", "A trie, then read it in BFS order", "Character counts, sorted"],
          e: "Only the first difference between neighbors tells you anything about the order." },
        { id: "b269b", p: 269, q: "Fill in the case where no character differs.",
          c: py`
def alien_order(words):
    graph = {ch: set() for w in words for ch in w}
    for w1, w2 in zip(words, words[1:]):
        for a, b in zip(w1, w2):
            if a != b:
                graph[a].add(b)
                break
        else:
            ________
    indeg = {ch: 0 for ch in graph}
    for a in graph:
        for b in graph[a]:
            indeg[b] += 1
    queue = [ch for ch in graph if indeg[ch] == 0]
    order = []
    while queue:
        ch = queue.pop()
        order.append(ch)
        for nxt in graph[ch]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                queue.append(nxt)
    return "".join(order) if len(order) == len(graph) else ""`,
          o: ["`if len(w1) > len(w2): return \"\"`", "`return \"\"`", "`if len(w1) < len(w2): return \"\"`", "`continue`"],
          e: "If one word is a prefix of the next, that's fine (\"ab\" before \"abc\"). A longer word before its own prefix (\"abc\" before \"ab\") is invalid." },
        { id: "b269c", p: 269, q: "Alien Dictionary: why use only the FIRST differing character of two adjacent words?",
          o: ["Characters after it don't affect the ordering, so they give no information", "Only to save time", "The last differing character matters too", "Because words are sorted by length"],
          e: "\"wrt\" < \"wrf\" tells you t < f. Nothing after that position is compared." },

        // 261 Graph Valid Tree
        { id: "b261a", p: 261, q: "Graph Valid Tree (n nodes, undirected edges): which conditions?",
          o: ["Exactly n − 1 edges and connected (equivalently, n − 1 edges and no cycle)", "No node has degree above 2", "Exactly n edges and no cycle", "Every node has a parent with a smaller label"],
          e: "A tree with n nodes always has exactly n − 1 edges and is connected." },
        { id: "b261b", p: 261, q: "Fill in the union step.",
          c: py`
def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]    # path halving
            x = parent[x]
        return x
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra == rb:
            return False                     # cycle
        ________
    return True`,
          o: ["`parent[ra] = rb`", "`parent[a] = b`", "`ra = rb`", "`parent[ra] = ra`"],
          e: "Link the ROOTS. `parent[a] = b` can overwrite a's existing link and split a component." },
        { id: "b261c", p: 261, q: "Graph Valid Tree: why are 'n − 1 edges' plus 'no cycle' enough to prove connectivity?",
          o: ["An acyclic graph with n nodes and n − 1 edges must be connected", "They aren't; you also need a BFS", "Cycles always mean too many edges", "n − 1 edges always means connected"],
          e: "A forest with k trees has n − k edges. n − 1 edges means k = 1. (n − 1 edges alone isn't enough: there could be a cycle plus an isolated node.)" },

        // 323 Number of Connected Components
        { id: "b323a", p: 323, q: "Connected components with union-find: a simple way to count?",
          o: ["Start at n; subtract 1 for every union that merges two different roots", "Count distinct values in the parent array without calling find()", "n minus the number of edges", "Count nodes with no edges"],
          e: "Without find(), parent values may not be roots yet. n − edges is wrong when there are cycles." },
        { id: "b323b", p: 323, q: "Fill in the line that starts a new component.",
          c: py`
def count_components(n, edges):
    graph = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)
    seen = set()
    def dfs(u):
        seen.add(u)
        for v in graph[u]:
            if v not in seen:
                dfs(v)
    count = 0
    for u in range(n):
        ________
            dfs(u)
            count += 1
    return count`,
          o: ["`if u not in seen:`", "`if u in seen:`", "`if graph[u]:`", "`if not graph[u]:`"],
          e: "Each DFS from an unseen node covers one whole component. Isolated nodes count as components too." },
        { id: "b323c", p: 323, q: "Why add each edge in BOTH directions when building the graph?",
          o: ["The graph is undirected; with one direction, DFS misses nodes reachable from the other end", "To count each edge twice", "DFS needs it for directed graphs", "It isn't needed"],
          e: "With only a → b, a DFS starting at b never reaches a." },
      ],
    },

    {
      id: "b75int",
      title: "Intervals & Heaps",
      icon: "📅",
      desc: "Merge, insert, schedule; top-k and running median.",
      cards: [
        // 57 Insert Interval
        { id: "b57a", p: 57, q: "Fill in the merge condition.",
          c: py`
def insert(intervals, new):
    res = []
    i, n = 0, len(intervals)
    while i < n and intervals[i][1] < new[0]:      # ends before new starts
        res.append(intervals[i]); i += 1
    while i < n and ________:
        new = [min(new[0], intervals[i][0]), max(new[1], intervals[i][1])]
        i += 1
    res.append(new)
    res.extend(intervals[i:])
    return res`,
          o: ["`intervals[i][0] <= new[1]`", "`intervals[i][0] < new[1]`", "`intervals[i][1] <= new[1]`", "`intervals[i][0] <= new[0]`"],
          e: "An interval overlaps the new one if it starts at or before the new end. Touching intervals ([1, 2] and [2, 3]) merge." },
        { id: "b57b", p: 57, q: "Insert Interval: do [1, 2] and [2, 3] overlap?",
          o: ["Yes: touching endpoints merge into [1, 3]", "No: they stay separate", "Only after sorting by end", "Depends on the interval lengths"],
          e: "Insert Interval and Merge Intervals treat touching as overlapping. (Non-overlapping Intervals does not.) Ask your interviewer!" },
        { id: "b57c", p: 57, q: "Insert Interval: time complexity?",
          o: ["O(n): a single pass over already-sorted input", "O(n log n): you must sort after inserting", "O(log n) overall with binary search", "O(n²)"],
          e: "Binary search finds the position in O(log n), but building the output is still O(n)." },

        // 56 Merge Intervals
        { id: "b56a", p: 56, q: "Merge Intervals: sort by which key, and why?",
          o: ["Start, so every interval that overlaps the current group comes right after it", "End, so the earliest finishing interval comes first", "Length, so short intervals get absorbed", "No sorting; use a hash map of starts"],
          e: "After sorting by start, you only compare with the last merged interval. O(n log n)." },
        { id: "b56b", p: 56, q: "Fill in the merge step.",
          c: py`
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    res = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= res[-1][1]:
            ________
        else:
            res.append([start, end])
    return res`,
          o: ["`res[-1][1] = max(res[-1][1], end)`", "`res[-1][1] = end`", "`res[-1][0] = min(res[-1][0], start)`", "`res.append([res[-1][0], end])`"],
          e: "Take the max: [1, 10] merged with [2, 3] must stay [1, 10]." },
        { id: "b56c", p: 56, q: "Merge Intervals: time and extra space?",
          o: ["O(n log n) time; O(n) for the output (sorting may use O(log n)–O(n))", "O(n) time, O(1)", "O(n²) time, O(1)", "O(n log n) time, O(n²) space"],
          e: "Sorting dominates. The merge pass is O(n)." },

        // 435 Non-overlapping Intervals
        { id: "b435a", p: 435, q: "Non-overlapping Intervals is really the same problem as…",
          o: ["Maximum number of non-overlapping intervals (activity selection); answer = n − kept", "Meeting Rooms II", "Merge Intervals", "Insert Interval"],
          e: "Keep as many as possible; everything else gets removed." },
        { id: "b435b", p: 435, q: "Fill in the greedy check.",
          c: py`
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    removed = 0
    prev_end = float("-inf")
    for start, end in intervals:
        if ________:
            prev_end = end           # keep it
        else:
            removed += 1
    return removed`,
          o: ["`start >= prev_end`", "`start > prev_end`", "`end >= prev_end`", "`start <= prev_end`"],
          e: "Keep an interval if it starts at or after the last kept end. In this problem, touching ([1, 2], [2, 3]) is NOT overlapping." },
        { id: "b435c", p: 435, q: "Non-overlapping Intervals: why sort by END?",
          o: ["Keeping the interval that finishes first leaves the most room for the rest", "Sorting by start gives wrong overlaps", "End values are always unique", "Just convention; both sorts work with this exact loop"],
          e: "Sorting by start also works, but then on overlap you must keep the smaller end, which is a different loop." },

        // 253 Meeting Rooms II
        { id: "b253a", p: 253, q: "Fill in when a room can be reused.",
          c: py`
import heapq

def min_meeting_rooms(intervals):
    intervals.sort(key=lambda x: x[0])
    ends = []                      # min-heap of end times of rooms in use
    for start, end in intervals:
        if ends and ________:
            heapq.heappop(ends)    # that room is free again
        heapq.heappush(ends, end)
    return len(ends)`,
          o: ["`ends[0] <= start`", "`ends[0] < start`", "`ends[-1] <= start`", "`end >= ends[0]`"],
          e: "The earliest-ending room is at ends[0]. A meeting ending at 5 frees the room for one starting at 5. ends[-1] isn't the max of a heap." },
        { id: "b253b", p: 253, q: "Meeting Rooms II: why does the heap's size at the end equal the answer?",
          o: ["Each meeting pops at most one room and always pushes one, so the size only grows to the peak overlap", "It counts meetings that overlap the first one", "It's the total number of meetings", "It's the longest meeting"],
          e: "Size never shrinks, and it only grows when every room is busy." },
        { id: "b253c", p: 253, q: "Meeting Rooms II without a heap?",
          o: ["Sort starts and ends separately; sweep with two pointers counting rooms in use", "Merge intervals and count groups", "Count meetings longer than average", "Binary search on the number of rooms only"],
          e: "Start before the next end → need a room (+1); otherwise a room frees up. Still O(n log n)." },

        // 347 Top K Frequent
        { id: "b347a", p: 347, q: "Top K Frequent Elements: bucket sort vs min-heap of size k. Time?",
          o: ["O(n) vs O(n log k)", "O(n log n) vs O(n)", "O(k) vs O(n)", "O(n²) vs O(n log n)"],
          e: "Counting is O(n) either way. Buckets are indexed by frequency (1..n), so no sorting is needed." },
        { id: "b347b", p: 347, q: "Fill in the bucket step.",
          c: py`
from collections import Counter

def top_k_frequent(nums, k):
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        ________
    res = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res`,
          o: ["`buckets[freq].append(num)`", "`buckets[num].append(freq)`", "`buckets[freq] = [num]`", "`buckets[len(nums) - freq].append(num)`"],
          e: "Bucket i holds the numbers that appear i times. Assigning `= [num]` drops ties." },
        { id: "b347c", p: 347, q: "Top K Frequent: why does the bucket array have len(nums) + 1 slots?",
          o: ["A frequency can be anything from 1 to n, and it's used directly as the index", "One bucket per distinct value", "To leave room for k", "Python lists need a sentinel"],
          e: "Index 0 goes unused; index n holds a number that makes up the whole array." },

        // 295 Find Median from Data Stream
        { id: "b295a", p: 295, q: "Find Median from Data Stream: add_num / find_median cost with two heaps?",
          o: ["O(log n) / O(1)", "O(1) / O(log n)", "O(n) / O(1)", "O(log n) / O(log n)"],
          e: "The median is the top of one heap, or the average of the two tops." },
        { id: "b295b", p: 295, q: "Fill in add_num.",
          c: py`
import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []   # max-heap (negated values): smaller half
        self.hi = []   # min-heap: larger half

    def add_num(self, num):
        heapq.heappush(self.lo, -num)
        ________
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def find_median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
          o: ["`heapq.heappush(self.hi, -heapq.heappop(self.lo))`", "`heapq.heappush(self.hi, heapq.heappop(self.lo))`", "`heapq.heappush(self.hi, num)`", "`heapq.heappush(self.hi, -self.lo[0])`"],
          e: "Move lo's maximum to hi (un-negating it). Then rebalance sizes so lo has the same count as hi, or one more." },
        { id: "b295c", p: 295, q: "Why push into lo and then immediately move lo's top into hi?",
          o: ["It guarantees every number in lo ≤ every number in hi", "To keep both heaps sorted", "Only to balance the sizes", "Heaps can't be pushed into directly"],
          e: "The new number might belong in either half. Passing it through lo puts the right element into hi." },
      ],
    },

    {
      id: "b75ll",
      title: "Linked Lists & Matrix",
      icon: "🔗",
      desc: "Merge k lists, reorder, in-place matrix tricks, word search.",
      cards: [
        // 23 Merge k Sorted Lists
        { id: "b23a", p: 23, q: "Merge k Sorted Lists: why put the index i in the heap tuple (val, i, node)?",
          o: ["On equal values Python compares the next field; ListNode can't be compared, so i breaks the tie", "To know which list is longest", "Only for stable sorting; it's optional", "The heap needs 3-tuples"],
          e: "Without i, two equal values raise TypeError: '<' not supported between ListNode instances." },
        { id: "b23b", p: 23, q: "Fill in the push of the next node.",
          c: py`
import heapq

def merge_k_lists(lists):
    heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
    heapq.heapify(heap)
    dummy = tail = ListNode()
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            ________
    return dummy.next`,
          o: ["`heapq.heappush(heap, (node.next.val, i, node.next))`", "`heapq.heappush(heap, (node.val, i, node.next))`", "`heapq.heappush(heap, (node.next.val, node.next))`", "`heapq.heappush(heap, (node.next.val, i, node))`"],
          e: "Replace the popped node with its successor from the same list. The heap never holds more than k entries → O(N log k)." },
        { id: "b23c", p: 23, q: "Merge k Sorted Lists: another O(N log k) approach without a heap?",
          o: ["Divide and conquer: merge lists in pairs, halving the count each round", "Merge them one by one into a growing result", "Concatenate and sort", "Repeatedly merge the two longest lists"],
          e: "Merging one by one is O(N·k): the growing result gets re-scanned every time." },

        // 19 Remove Nth From End
        { id: "b19a", p: 19, q: "Remove Nth From End: why move fast n + 1 steps ahead, starting from a dummy?",
          o: ["So slow stops at the node BEFORE the one to remove", "So fast never becomes None", "To skip the head", "It's off by one; n steps is correct"],
          e: "To delete a node you need its predecessor." },
        { id: "b19b", p: 19, q: "Fill in the removal.",
          c: py`
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    ________
    return dummy.next`,
          o: ["`slow.next = slow.next.next`", "`slow = slow.next.next`", "`slow.next = fast`", "`slow.next.next = None`"],
          e: "Bypass the target node. Return dummy.next, not head, because head may have been removed." },
        { id: "b19c", p: 19, q: "Remove Nth From End: which test case breaks a solution without a dummy node?",
          o: ["Removing the head, e.g. [1, 2] with n = 2", "Removing the last node", "[1, 2, 3, 4, 5] with n = 3", "n = 1 on a long list"],
          e: "Without a dummy there's no predecessor for the head, so it needs a special case." },

        // 143 Reorder List
        { id: "b143a", p: 143, q: "Reorder List (L0→Ln→L1→Ln−1…) in O(1) space: the three steps?",
          o: ["Find the middle, reverse the second half, merge the halves alternately", "Copy to an array, then rebuild", "Reverse the whole list, then merge it with the original", "Recursively swap the first and last nodes"],
          e: "Copying to an array works too, but uses O(n) space. Reversing the whole list destroys the original order." },
        { id: "b143b", p: 143, q: "Fill in the merge step.",
          c: py`
def reorder_list(head):
    slow, fast = head, head.next          # 1. find the middle
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    second, slow.next = slow.next, None   # 2. cut and reverse the second half
    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev, second = second, nxt
    first, second = head, prev            # 3. merge
    while second:
        tmp1, tmp2 = first.next, second.next
        ________
        first, second = tmp1, tmp2`,
          o: ["`first.next = second; second.next = tmp1`", "`first.next = tmp2; second.next = tmp1`", "`second.next = first; first.next = tmp1`", "`first.next = second; second.next = tmp2`"],
          e: "Splice the second-half node between first and first's old next. Saving tmp1/tmp2 beforehand keeps the remaining nodes reachable." },
        { id: "b143c", p: 143, q: "Reorder List: what happens if you forget `slow.next = None` after finding the middle?",
          o: ["The first half still points into the second half, so the result contains a cycle", "Nothing; the merge fixes it", "The last node is lost", "The middle node is duplicated"],
          e: "For [1, 2, 3, 4], node 3 ends up pointing to itself." },

        // 73 Set Matrix Zeroes
        { id: "b73a", p: 73, q: "Set Matrix Zeroes with O(1) extra space: where do you record which rows and columns to zero?",
          o: ["In the matrix's own first row and first column, plus flags for those two", "In two hash sets of rows and columns", "By writing None into cells while scanning", "In a separate copy of the matrix"],
          e: "Hash sets are O(m + n), which is a good first answer. The marker trick is the follow-up." },
        { id: "b73b", p: 73, q: "Fill in the condition for zeroing an inner cell.",
          c: py`
def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_row = any(matrix[0][c] == 0 for c in range(cols))
    first_col = any(matrix[r][0] == 0 for r in range(rows))
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = matrix[0][c] = 0
    for r in range(1, rows):
        for c in range(1, cols):
            if ________:
                matrix[r][c] = 0
    if first_row:
        for c in range(cols):
            matrix[0][c] = 0
    if first_col:
        for r in range(rows):
            matrix[r][0] = 0`,
          o: ["`matrix[r][0] == 0 or matrix[0][c] == 0`", "`matrix[r][0] == 0 and matrix[0][c] == 0`", "`matrix[r][c] == 0`", "`matrix[0][0] == 0`"],
          e: "A cell is zeroed if its row OR its column is marked." },
        { id: "b73c", p: 73, q: "Set Matrix Zeroes: why check the first row and column for zeros BEFORE using them as markers?",
          o: ["Markers written later would look like original zeros and wrongly wipe the whole first row or column", "To skip them for speed", "Because Python copies lists", "It's only needed for square matrices"],
          e: "Record those two facts first, then apply them last." },

        // 54 Spiral Matrix
        { id: "b54a", p: 54, q: "Fill in the guard before walking the bottom row.",
          c: py`
def spiral_order(matrix):
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1
        if ________:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1
    return res`,
          o: ["`top <= bottom`", "`left <= right`", "`top < bottom`", "`True`"],
          e: "top just moved down. If it passed bottom, the single remaining row was already read left-to-right, so don't read it again backwards." },
        { id: "b54b", p: 54, q: "Spiral Matrix: which inputs most often break a spiral solution?",
          o: ["A single row, a single column, and non-square matrices like 3 × 4", "Square matrices only", "Matrices with negative numbers", "1 × 1 matrices only"],
          e: "Test [[1, 2, 3]] and [[1], [2], [3]] by hand. That's where elements get read twice." },
        { id: "b54c", p: 54, q: "Spiral Matrix (boundary pointers): time and extra space, not counting the output?",
          o: ["O(m·n) time, O(1) space", "O(m·n) time; a visited set is required, so O(m·n) space", "O((m·n)²) time, O(1) space", "O(m + n) time, O(1) space"],
          e: "A visited set works, but the four boundaries make it unnecessary." },

        // 48 Rotate Image
        { id: "b48a", p: 48, q: "Fill in the transpose range.",
          c: py`
def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(________):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()`,
          o: ["`i + 1, n`", "`n`", "`1, n`", "`i + 1, n - 1`"],
          e: "Swap each pair above the diagonal exactly once. With range(n), every pair is swapped twice, which undoes the transpose." },
        { id: "b48b", p: 48, q: "Rotate Image: to rotate 90° COUNTER-clockwise instead, you can…",
          o: ["Reverse each row, then transpose", "Transpose, then reverse each row", "Reverse each row twice", "Transpose twice"],
          e: "Transpose then reverse rows = clockwise. Reverse rows then transpose = counter-clockwise." },
        { id: "b48c", p: 48, q: "Rotate Image: another in-place approach?",
          o: ["Rotate four cells at a time, layer by layer from the outside in", "Swap rows i and n−1−i only", "Reverse the whole matrix as a flat list", "Sort each column"],
          e: "Both approaches are O(n²) time, O(1) extra space." },

        // 79 Word Search
        { id: "b79a", p: 79, q: "Word Search: why overwrite board[r][c] with '#' before recursing?",
          o: ["So the same cell isn't used twice in one path", "To speed up comparisons", "To mark cells that can never be part of any path", "To avoid index errors"],
          e: "It's a temporary mark for this path only. It must be restored afterwards, because other paths may use the cell." },
        { id: "b79b", p: 79, q: "Fill in the line after exploring neighbors.",
          c: py`
def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
            return False
        board[r][c] = "#"
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
        ________
        return found
    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))`,
          o: ["`board[r][c] = word[i]`", "`board[r][c] = \"#\"`", "`board[r][c] = \"\"`", "`board[r][c] = word[0]`"],
          e: "Backtrack: restore the original letter so other starting points and paths can use it." },
        { id: "b79c", p: 79, q: "Word Search: a cheap check that avoids the worst cases?",
          o: ["Count letters first; if the board has too few of some letter, return False", "Sort the board", "Use BFS instead of DFS", "Cache (r, c) → result across different starts"],
          e: "Caching (r, c) is wrong, because the result depends on which cells the current path has used. Another trick: search the reversed word if its first letter is more common." },
      ],
    },

    {
      id: "b75str",
      title: "Strings",
      icon: "🔤",
      desc: "Sliding windows, anagram keys, palindromes, encoding.",
      cards: [
        // 3 Longest Substring Without Repeating Characters
        { id: "b3a", p: 3, q: "Fill in the condition for moving left.",
          c: py`
def length_of_longest_substring(s):
    last = {}                      # char -> last index seen
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and ________:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best`,
          o: ["`last[ch] >= left`", "`last[ch] > left`", "`last[ch] < left`", "`right > left`"],
          e: "Only a repeat INSIDE the current window matters. Otherwise left jumps backwards: \"abba\" would give 3 instead of 2." },
        { id: "b3b", p: 3, q: "Longest Substring Without Repeating Characters: the classic \"abba\" bug?",
          o: ["left jumps back to an old position; left must never move backwards", "The window length is right − left", "Using a set instead of a map", "Starting right at 1"],
          e: "At the last 'a', the earlier 'a' is at index 0, which is outside the window [2, 3]. Ignore it." },
        { id: "b3c", p: 3, q: "Time and space with an alphabet of size k?",
          o: ["O(n) time, O(min(n, k)) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(n) time, O(n²) space"],
          e: "Each index is visited once, and the map holds at most one entry per distinct character." },

        // 424 Longest Repeating Character Replacement
        { id: "b424a", p: 424, q: "Fill in when the window must shrink.",
          c: py`
def character_replacement(s, k):
    count = {}
    left = max_freq = best = 0
    for right, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1
        max_freq = max(max_freq, count[ch])
        while ________:
            count[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best`,
          o: ["`(right - left + 1) - max_freq > k`", "`(right - left + 1) - max_freq >= k`", "`len(count) > k`", "`max_freq > k`"],
          e: "Characters other than the most frequent one must be replaced. Shrink when that number exceeds k." },
        { id: "b424b", p: 424, q: "Character Replacement: max_freq is never decreased when the window shrinks. Why is that still correct?",
          o: ["The answer only grows when the window beats the best max_freq so far, so a stale max can't produce a wrong larger answer", "It's a bug LeetCode's tests miss", "Shrinking never removes the most frequent character", "max_freq is recomputed in the while loop"],
          e: "A stale max_freq only stops the window from shrinking, so it may stay at its best length. It never makes the reported answer too big." },
        { id: "b424c", p: 424, q: "Character Replacement (26 uppercase letters): time complexity?",
          o: ["O(n)", "O(26 · n²)", "O(n log n)", "O(n · k)"],
          e: "Each pointer only moves forward. Recomputing max over 26 counts each step would still be O(26n)." },

        // 76 Minimum Window Substring
        { id: "b76a", p: 76, q: "Minimum Window Substring: what does `missing` track?",
          o: ["How many characters of t, counting repeats, the window still lacks", "The number of distinct characters in the window", "The current window length", "Characters of s that aren't in t"],
          e: "When missing hits 0 the window is valid; then shrink from the left." },
        { id: "b76b", p: 76, q: "Fill in when removing s[left] breaks the window.",
          c: py`
from collections import Counter

def min_window(s, t):
    need = Counter(t)
    missing = len(t)
    left = 0
    best = (0, float("inf"))
    for right, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        while missing == 0:
            if right - left < best[1] - best[0]:
                best = (left, right)
            need[s[left]] += 1
            if ________:
                missing += 1
            left += 1
    return "" if best[1] == float("inf") else s[best[0]:best[1] + 1]`,
          o: ["`need[s[left]] > 0`", "`need[s[left]] >= 0`", "`s[left] in t`", "`need[s[left]] < 0`"],
          e: "need goes negative for surplus characters. Only when it climbs back above 0 did you lose a character you actually needed." },
        { id: "b76c", p: 76, q: "Minimum Window Substring: time complexity?",
          o: ["O(|s| + |t|)", "O(|s| · |t|)", "O(|s|²)", "O(|s| log |s|)"],
          e: "Building need is O(|t|). Each pointer crosses s once." },

        // 49 Group Anagrams
        { id: "b49a", p: 49, q: "Group Anagrams key: sorted word vs 26-count tuple, for n words of length k. Time?",
          o: ["O(n · k log k) vs O(n · k)", "O(n log n) vs O(n)", "O(n · k) vs O(n · k log k)", "Both O(n²)"],
          e: "Sorted keys are easier to write; count tuples avoid the sort." },
        { id: "b49b", p: 49, q: "Fill in the grouping line.",
          c: py`
from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for w in strs:
        count = [0] * 26
        for ch in w:
            count[ord(ch) - ord("a")] += 1
        ________
    return list(groups.values())`,
          o: ["`groups[tuple(count)].append(w)`", "`groups[count].append(w)`", "`groups[len(w)].append(w)`", "`groups[sum(count)].append(w)`"],
          e: "Lists are unhashable (TypeError), so convert to a tuple. Length isn't a valid key: 'ab' and 'cd' have the same length." },
        { id: "b49c", p: 49, q: "Group Anagrams: why is the sum of character codes a broken key?",
          o: ["Different letters can have the same sum, e.g. 'ad' and 'bc'", "It's too slow", "ord fails on uppercase letters", "Sums overflow"],
          e: "97 + 100 = 98 + 99. A key must be equal ONLY for anagrams." },

        // 5 Longest Palindromic Substring
        { id: "b5a", p: 5, q: "Longest Palindromic Substring: why expand around 2n − 1 centers?",
          o: ["Odd palindromes center on a character, even ones between two characters", "To read in both directions", "Because 2n − 1 substrings exist", "To handle uppercase"],
          e: "\"aba\" centers on 'b'; \"abba\" centers between the two b's." },
        { id: "b5b", p: 5, q: "Fill in the loop body.",
          c: py`
def longest_palindrome(s):
    best = ""
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l + 1:r]
    for i in range(len(s)):
        ________
    return best`,
          o: ["`best = max(best, expand(i, i), expand(i, i + 1), key=len)`", "`best = max(best, expand(i, i), key=len)`", "`best = max(best, expand(i, i + 1), key=len)`", "`best = max(expand(i, i), expand(i, i + 1), key=len)`"],
          e: "Check both the odd and the even center, and keep the best result so far." },
        { id: "b5c", p: 5, q: "Expand-around-center: time and space?",
          o: ["O(n²) time, O(1) space", "O(n) time, O(1) space", "O(n³) time, O(1) space", "O(n²) time, O(n²) space"],
          e: "The DP table version is also O(n²) time but O(n²) space. Manacher's algorithm is O(n) but rarely expected." },

        // 647 Palindromic Substrings
        { id: "b647a", p: 647, q: "How does Palindromic Substrings relate to Longest Palindromic Substring?",
          o: ["Same expand-around-center loop; count every successful expansion instead of tracking the longest", "It needs a completely different DP", "Count distinct palindromes with a set", "It can only be solved with Manacher's algorithm"],
          e: "Every step outward that still matches is one more palindrome." },
        { id: "b647b", p: 647, q: "Fill in the right pointer for this center.",
          c: py`
def count_substrings(s):
    count = 0
    for center in range(2 * len(s) - 1):
        l = center // 2
        r = ________
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1
    return count`,
          o: ["`l + center % 2`", "`l + 1`", "`l`", "`center`"],
          e: "Even center numbers are characters (r = l), odd ones are gaps between characters (r = l + 1)." },
        { id: "b647c", p: 647, q: "How many palindromic substrings does \"aaa\" have?",
          o: ["6", "3", "4", "5"],
          e: "a, a, a, aa, aa, aaa. Substrings at different positions count separately." },

        // 271 Encode and Decode Strings
        { id: "b271a", p: 271, q: "Encode and Decode Strings: why doesn't joining with a delimiter like ',' work?",
          o: ["The strings may contain the delimiter, since any character is allowed", "It's too slow", "Python can't split on commas", "Delimiters double the length"],
          e: "Length-prefixing (\"4#lint\") works for any content." },
        { id: "b271b", p: 271, q: "Fill in the decode step.",
          c: py`
def encode(strs):
    return "".join(f"{len(s)}#{s}" for s in strs)

def decode(data):
    res, i = [], 0
    while i < len(data):
        j = data.index("#", i)
        length = int(data[i:j])
        ________
        i = j + 1 + length
    return res`,
          o: ["`res.append(data[j + 1:j + 1 + length])`", "`res.append(data[j:j + length])`", "`res.append(data[i:j])`", "`res.append(data[j + 1:].split(\"#\")[0])`"],
          e: "The string starts right after '#' and is exactly `length` characters long, whatever it contains." },
        { id: "b271c", p: 271, q: "Why does `data.index('#', i)` find the right '#', even if strings contain '#'?",
          o: ["i always points at a length prefix, which is only digits, so the first '#' after it ends the prefix", "Strings can't contain '#'", "index() searches from the end", "It doesn't; '#' must be escaped"],
          e: "Decoding skips over each string by its length and never scans inside it." },
      ],
    },

    {
      id: "b75tree",
      title: "Trees & Tries",
      icon: "🌳",
      desc: "Path sums, BFS, serialization, BSTs, tries.",
      cards: [
        // 124 Binary Tree Maximum Path Sum
        { id: "b124a", p: 124, q: "Max Path Sum: why clamp each child's gain with max(gain, 0)?",
          o: ["A negative branch only lowers the sum, so it's better to leave it out", "To avoid negative indexes", "Node values are non-negative", "To make the recursion terminate"],
          e: "A path can stop at any node, so a branch that hurts can be skipped." },
        { id: "b124b", p: 124, q: "Fill in what gain() returns.",
          c: py`
def max_path_sum(root):
    best = float("-inf")
    def gain(node):
        nonlocal best
        if not node:
            return 0
        left = max(gain(node.left), 0)
        right = max(gain(node.right), 0)
        best = max(best, node.val + left + right)   # path that bends here
        ________
    gain(root)
    return best`,
          o: ["`return node.val + max(left, right)`", "`return node.val + left + right`", "`return max(left, right)`", "`return best`"],
          e: "A path that continues up to the parent can use only ONE child branch. The bent path (both sides) only updates best." },
        { id: "b124c", p: 124, q: "Max Path Sum: why start `best` at -inf instead of 0?",
          o: ["All values may be negative, and the path must contain at least one node", "0 would overflow", "Python's max() requires it", "It doesn't matter"],
          e: "For the tree [-3], the answer is -3, not 0." },

        // 102 Level Order
        { id: "b102a", p: 102, q: "Fill in how many nodes this level has.",
          c: py`
from collections import deque

def level_order(root):
    if not root:
        return []
    res, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(________):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res`,
          o: ["`len(queue)`", "`len(level)`", "`len(res) + 1`", "`2 ** len(res)`"],
          e: "range() reads len(queue) once at the start, before this level adds its children. That number is exactly this level's width." },
        { id: "b102b", p: 102, q: "Level Order: why fix the count at the start of each level instead of looping `while queue`?",
          o: ["Children added during the loop belong to the next level", "len() is slow", "A deque can't be measured while you iterate", "To process nodes right to left"],
          e: "This 'level size' trick also solves Right Side View, Zigzag Order and Average of Levels." },
        { id: "b102c", p: 102, q: "Level Order Traversal: time and space for n nodes?",
          o: ["O(n) time, O(n) space (the widest level)", "O(n log n) time, O(log n) space", "O(n) time, O(1) space", "O(n²) time, O(n) space"],
          e: "The last level of a complete tree holds about n/2 nodes." },

        // 297 Serialize and Deserialize
        { id: "b297a", p: 297, q: "Serialize/Deserialize: why are null markers ('N') needed in pre-order?",
          o: ["Without them, different tree shapes produce the same string", "To mark the end of the string", "Commas need a placeholder", "For negative numbers"],
          e: "[1, 2] as a left child or as a right child both give \"1,2\" without null markers." },
        { id: "b297b", p: 297, q: "Fill in the recursive build.",
          c: py`
def serialize(root):
    out = []
    def dfs(node):
        if not node:
            out.append("N")
            return
        out.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ",".join(out)

def deserialize(data):
    vals = iter(data.split(","))
    def build():
        v = next(vals)
        if v == "N":
            return None
        node = TreeNode(int(v))
        ________
        return node
    return build()`,
          o: ["`node.left, node.right = build(), build()`", "`node.right, node.left = build(), build()`", "`node.left = build()`", "`node.left = node.right = build()`"],
          e: "Read in the same order you wrote: the left subtree first, then the right. The right side of a tuple assignment is evaluated left to right." },
        { id: "b297c", p: 297, q: "Serialize + deserialize: time and space?",
          o: ["O(n) time and space", "O(n log n) time", "O(n²) because of string joins", "O(h) space only"],
          e: "Each node and each null marker is handled once. Using ''.join keeps it linear." },

        // 105 Construct from Preorder and Inorder
        { id: "b105a", p: 105, q: "Construct Tree from Preorder & Inorder: what gives the root, and what splits the subtrees?",
          o: ["The next preorder value is the root; its position in inorder splits left and right", "The middle of preorder is the root", "inorder[0] is the root; preorder splits the subtrees", "The largest value is the root"],
          e: "A hash map of inorder positions makes each split O(1), so the whole build is O(n)." },
        { id: "b105b", p: 105, q: "Fill in the left subtree.",
          c: py`
def build_tree(preorder, inorder):
    index = {v: i for i, v in enumerate(inorder)}
    pre = iter(preorder)
    def build(lo, hi):              # builds from inorder[lo..hi]
        if lo > hi:
            return None
        root = TreeNode(next(pre))
        mid = index[root.val]
        ________
        root.right = build(mid + 1, hi)
        return root
    return build(0, len(inorder) - 1)`,
          o: ["`root.left = build(lo, mid - 1)`", "`root.left = build(lo, mid)`", "`root.left = build(0, mid - 1)`", "`root.left = build(mid - 1, hi)`"],
          e: "The left subtree is everything in inorder to the left of the root, within the current range." },
        { id: "b105c", p: 105, q: "Construct Tree: why must the left subtree be built before the right?",
          o: ["Preorder lists the root, then the whole left subtree, then the right; values are consumed in that order", "Left subtrees are smaller", "It doesn't matter", "Inorder requires it"],
          e: "With postorder + inorder, you consume from the END, so build the right subtree first." },

        // 98 Validate BST
        { id: "b98a", p: 98, q: "Validate BST: which tree fools the local check (left < node < right)?",
          o: ["[5, 4, 6, null, null, 3, 7]: 3 is in 5's right subtree", "[2, 1, 3]", "[1]", "[3, 1, 5, null, 2]"],
          e: "Each parent-child pair looks fine, but 3 < 5 sits in 5's right subtree." },
        { id: "b98b", p: 98, q: "Fill in the recursive check.",
          c: py`
def is_valid_bst(root):
    def valid(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return ________
    return valid(root, float("-inf"), float("inf"))`,
          o: ["`valid(node.left, low, node.val) and valid(node.right, node.val, high)`", "`valid(node.left, low, high) and valid(node.right, low, high)`", "`valid(node.left, node.val, high) and valid(node.right, low, node.val)`", "`valid(node.left, low, node.val) or valid(node.right, node.val, high)`"],
          e: "Going left, node.val becomes the upper bound; going right, it becomes the lower bound. Both subtrees must be valid." },
        { id: "b98c", p: 98, q: "Validate BST with an in-order traversal: what must hold?",
          o: ["Each visited value is strictly greater than the previous one", "Values never decrease", "Left and right subtrees have equal sizes", "The root is the median"],
          e: "Strictly greater: duplicates make it invalid on LeetCode." },

        // 230 Kth Smallest in a BST
        { id: "b230a", p: 230, q: "Fill in the step after visiting a node.",
          c: py`
def kth_smallest(root, k):
    stack, node = [], root
    while True:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        ________`,
          o: ["`node = node.right`", "`node = node.left`", "`node = None`", "`node = stack[-1].right`"],
          e: "Iterative in-order: after visiting a node, continue into its right subtree. O(h + k)." },
        { id: "b230b", p: 230, q: "Kth Smallest in a BST: what's the key property?",
          o: ["In-order traversal visits values in sorted order", "The kth level holds the kth smallest value", "The leftmost leaf is the median", "Pre-order is sorted"],
          e: "Left, node, right = ascending order." },
        { id: "b230c", p: 230, q: "Follow-up: the BST changes often and you query k often. How do you improve?",
          o: ["Store the subtree size in each node and walk down in O(h)", "Re-run in-order every time", "Cache the sorted list forever", "Use a hash map of values"],
          e: "If the left subtree has size L: k ≤ L → go left; k = L + 1 → this node; otherwise go right with k − L − 1." },

        // 208 Implement Trie
        { id: "b208a", p: 208, q: "Trie: why do you need an end-of-word marker?",
          o: ["'app' is a prefix of 'apple' but isn't a word until inserted, so a node existing isn't enough", "To save memory", "To mark leaf nodes only", "To sort the children"],
          e: "search() checks the marker; startsWith() only checks that the path exists." },
        { id: "b208b", p: 208, q: "Fill in the insert step.",
          c: py`
class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for ch in word:
            ________
        node["$"] = True                 # end-of-word marker

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node:
                return None
            node = node[ch]
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and "$" in node

    def starts_with(self, prefix):
        return self._walk(prefix) is not None`,
          o: ["`node = node.setdefault(ch, {})`", "`node[ch] = node = {}`", "`node = node.get(ch, {})`", "`node[ch] = {}`"],
          e: "Reuse the child if it exists, otherwise create it, then step into it. `node[ch] = node = {}` overwrites existing branches." },
        { id: "b208c", p: 208, q: "Trie insert and search for a word of length L: time?",
          o: ["O(L) each", "O(log n)", "O(n · L)", "O(1)"],
          e: "The cost depends on the word length, not on how many words are stored." },

        // 211 Add and Search Words
        { id: "b211a", p: 211, q: "Add and Search Words: why skip the '$' key when expanding '.'?",
          o: ["'$' is the end marker, not a letter; following it would treat True as a child node", "To avoid duplicate words", "It's optional", "Only for speed"],
          e: "Keeping data and markers apart (or using a TrieNode class with an is_end field) avoids this bug." },
        { id: "b211b", p: 211, q: "Fill in the wildcard branch.",
          c: py`
class WordDictionary:
    def __init__(self):
        self.root = {}

    def add_word(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return "$" in node
            ch = word[i]
            if ch == ".":
                return any(________ for k, child in node.items() if k != "$")
            return ch in node and dfs(node[ch], i + 1)
        return dfs(self.root, 0)`,
          o: ["`dfs(child, i + 1)`", "`dfs(child, i)`", "`dfs(node, i + 1)`", "`\"$\" in child`"],
          e: "'.' matches any one letter, so try every child and move to the next character." },
        { id: "b211c", p: 211, q: "Add and Search Words: worst-case search for a pattern of L dots?",
          o: ["It may visit every trie node down to depth L: O(min(26^L, trie size))", "O(L)", "O(log n)", "O(L²)"],
          e: "Patterns without dots are O(L). Each dot can fan out to up to 26 branches." },

        // 212 Word Search II
        { id: "b212a", p: 212, q: "Word Search II: why `node.pop('$')` when a word is found?",
          o: ["So the same word isn't reported again from another path", "Only to free memory", "To end the search immediately", "Because '$' blocks further recursion"],
          e: "Without it, a word reachable from two paths appears twice in the output." },
        { id: "b212b", p: 212, q: "Fill in the pruning line.",
          c: py`
def find_words(board, words):
    root = {}
    for w in words:
        node = root
        for ch in w:
            node = node.setdefault(ch, {})
        node["$"] = w
    rows, cols, found = len(board), len(board[0]), []

    def dfs(r, c, parent):
        ch = board[r][c]
        node = parent[ch]
        if "$" in node:
            found.append(node.pop("$"))
        board[r][c] = "#"
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] in node:
                dfs(nr, nc, node)
        board[r][c] = ch
        ________

    for r in range(rows):
        for c in range(cols):
            if board[r][c] in root:
                dfs(r, c, root)
    return found`,
          o: ["`if not node: parent.pop(ch)`", "`parent.pop(ch)`", "`node.clear()`", "`if not node: root.pop(ch)`"],
          e: "Once a trie branch is empty (all its words found), remove it so no other path searches it again. Only remove EMPTY branches." },
        { id: "b212c", p: 212, q: "Word Search II: why build a trie instead of running Word Search once per word?",
          o: ["One board DFS follows all words at once and stops as soon as no word has the current prefix", "Tries use less memory than strings", "Word Search can't handle multiple words", "It's required for correctness"],
          e: "Per-word search repeats the same board walks for words with common prefixes." },
      ],
    },
  ];

  for (const u of units) {
    u.track = "blind75";
    window.UNITS.push(u);
  }
})();
