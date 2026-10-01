#!/usr/bin/env python3
"""Run every fill-in-the-blank code card in js/blind75.js.

For each card, the correct option (o[0]) must pass the tests below, and every wrong
option must FAIL them (wrong answer, exception, or timeout). Otherwise a "wrong"
option could actually be a correct answer.

    python3 tests/check_snippets.py      # needs node on PATH
"""
import json
import multiprocessing as mp
import random
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLANK = "________"
TIMEOUT = 5


# ---------- shared data structures available to snippets ----------
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


class Node:  # graph node (Clone Graph)
    def __init__(self, val=0, neighbors=None):
        self.val, self.neighbors = val, neighbors or []


def to_linked(vals):
    dummy = tail = ListNode()
    for v in vals:
        tail.next = tail = ListNode(v)
    return dummy.next


def from_linked(head, limit=1000):
    out = []
    while head and len(out) < limit:
        out.append(head.val)
        head = head.next
    assert head is None, "cycle in list"
    return out


def to_tree(vals):
    """LeetCode level-order list -> TreeNode."""
    if not vals or vals[0] is None:
        return None
    root = TreeNode(vals[0])
    queue, i = [root], 1
    while queue and i < len(vals):
        node = queue.pop(0)
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i]); queue.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i]); queue.append(node.right)
        i += 1
    return root


def from_tree(root):
    out, queue = [], [root]
    while queue:
        node = queue.pop(0)
        if node:
            out.append(node.val)
            queue += [node.left, node.right]
        else:
            out.append(None)
    while out and out[-1] is None:
        out.pop()
    return out


# ---------- tests, keyed by card id ----------
def t_b238b(ns):
    f = ns["product_except_self"]
    assert f([1, 2, 3, 4]) == [24, 12, 8, 6]
    assert f([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]


def t_b53b(ns):
    f = ns["max_subarray"]
    assert f([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert f([1]) == 1
    assert f([5, 4, -1, 7, 8]) == 23
    assert f([-3, -1, -2]) == -1


def t_b152b(ns):
    f = ns["max_product"]
    for nums, want in [([2, 3, -2, 4], 6), ([-2, 0, -1], 0), ([-2, 3, -4], 24),
                       ([-2], -2), ([2, -5, -2, -4, 3], 24), ([0, 2], 2)]:
        assert f(nums) == want, (nums, f(nums))


def t_b153a(ns):
    f = ns["find_min"]
    base = [11, 13, 15, 17, 19, 21]
    for k in range(len(base)):
        assert f(base[k:] + base[:k]) == 11
    assert f([2, 1]) == 1 and f([1]) == 1


def t_b33b(ns):
    f = ns["search"]
    base = [0, 1, 2, 4, 5, 6, 7]
    for k in range(len(base)):
        nums = base[k:] + base[:k]
        for t in range(-1, 9):
            want = nums.index(t) if t in nums else -1
            assert f(nums, t) == want, (nums, t)
    assert f([3, 1], 1) == 1


def t_b15b(ns):
    f = ns["three_sum"]
    def norm(res):
        return sorted(tuple(sorted(x)) for x in res)
    assert norm(f([-1, 0, 1, 2, -1, -4])) == [(-1, -1, 2), (-1, 0, 1)]
    assert norm(f([-2, 0, 0, 2, 2])) == [(-2, 0, 2)]
    assert norm(f([0, 0, 0, 0])) == [(0, 0, 0)]
    assert norm(f([0, 1, 1])) == []


def t_b11b(ns):
    f = ns["max_area"]
    for h, want in [([1, 8, 6, 2, 5, 4, 8, 3, 7], 49), ([1, 1], 1), ([4, 3, 2, 1, 4], 16),
                    ([1, 2, 1], 2), ([2, 3, 4, 5, 18, 17, 6], 17)]:
        assert f(h) == want, (h, f(h))
    rnd = random.Random(3)
    for _ in range(300):
        h = [rnd.randint(0, 20) for _ in range(rnd.randint(2, 12))]
        brute = max((j - i) * min(h[i], h[j]) for i in range(len(h)) for j in range(i + 1, len(h)))
        assert f(h) == brute, h


def t_b371b(ns):
    f = ns["get_sum"]
    rnd = random.Random(1)
    pairs = [(1, 2), (2, 3), (-1, 1), (-2, -3), (0, 0), (1000, -1000), (1, 1)]
    pairs += [(rnd.randint(-1000, 1000), rnd.randint(-1000, 1000)) for _ in range(200)]
    for a, b in pairs:
        assert f(a, b) == a + b, (a, b)


def t_b322b(ns):
    f = ns["coin_change"]
    for coins, amount, want in [([1, 2, 5], 11, 3), ([2], 3, -1), ([1], 0, 0),
                                ([1, 3, 4], 6, 2), ([186, 419, 83, 408], 6249, 20)]:
        assert f(coins, amount) == want, (coins, amount)


def t_b300b(ns):
    f = ns["length_of_lis"]
    for nums, want in [([10, 9, 2, 5, 3, 7, 101, 18], 4), ([0, 1, 0, 3, 2, 3], 4),
                       ([7, 7, 7, 7], 1), ([4, 10, 4, 3, 8, 9], 3), ([1], 1)]:
        assert f(nums) == want, nums


def t_b1143b(ns):
    f = ns["lcs"]
    for a, b, want in [("abcde", "ace", 3), ("abc", "abc", 3), ("abc", "def", 0),
                       ("bsbininm", "jmjkbkjkv", 1), ("oxcpqrsvwf", "shmtulqrypy", 2)]:
        assert f(a, b) == want, (a, b)


def t_b139b(ns):
    f = ns["word_break"]
    assert f("leetcode", ["leet", "code"])
    assert f("applepenapple", ["apple", "pen"])
    assert not f("catsandog", ["cats", "dog", "sand", "and", "cat"])
    assert f("aaaa", ["aaa", "aa"])
    assert not f("ab", ["a"])


def t_b39b(ns):
    f = ns["combination_sum"]
    def norm(res):
        return sorted(sorted(x) for x in res)
    def check(c, t, want):
        got = f(c, t)
        assert len(got) == len(want) and norm(got) == sorted(want), (c, t, got)
    check([2, 3, 6, 7], 7, [[2, 2, 3], [7]])
    check([2, 3, 5], 8, [[2, 2, 2, 2], [2, 3, 3], [3, 5]])
    check([2], 1, [])


def t_b198b(ns):
    f = ns["rob"]
    for nums, want in [([1, 2, 3, 1], 4), ([2, 7, 9, 3, 1], 12), ([2, 1, 1, 2], 4), ([5], 5), ([], 0)]:
        assert f(nums) == want, nums


def t_b213b(ns):
    f = ns["rob_circle"]
    for nums, want in [([2, 3, 2], 3), ([1, 2, 3, 1], 4), ([1, 2, 3], 3), ([5], 5),
                       ([200, 3, 140, 20, 10], 340)]:
        assert f(nums) == want, nums


def t_b91b(ns):
    f = ns["num_decodings"]
    for s, want in [("12", 2), ("226", 3), ("06", 0), ("10", 1), ("27", 1), ("2101", 1),
                    ("11106", 2), ("105", 1), ("26", 2)]:
        assert f(s) == want, (s, f(s))


def t_b62b(ns):
    f = ns["unique_paths"]
    for m, n, want in [(3, 7, 28), (3, 2, 3), (1, 1, 1), (7, 3, 28), (2, 2, 2)]:
        assert f(m, n) == want, (m, n)


def t_b55b(ns):
    f = ns["can_jump"]
    for nums, want in [([2, 3, 1, 1, 4], True), ([3, 2, 1, 0, 4], False), ([0], True),
                       ([2, 0, 0], True), ([1, 0, 1, 0], False), ([2, 5, 0, 0], True)]:
        assert f(nums) == want, nums


def t_b133b(ns):
    ns["Node"] = Node
    f = ns["clone_graph"]
    nodes = [Node(i) for i in range(1, 5)]
    for i, n in enumerate(nodes):
        n.neighbors = [nodes[(i - 1) % 4], nodes[(i + 1) % 4]]
    c = f(nodes[0])
    seen, stack = {}, [c]
    while stack:
        x = stack.pop()
        if x.val in seen:
            assert seen[x.val] is x, "two clones of one node"
            continue
        assert x not in nodes, "returned an original node"
        seen[x.val] = x
        stack += x.neighbors
    assert sorted(seen) == [1, 2, 3, 4]
    for v, x in seen.items():
        assert sorted(nb.val for nb in x.neighbors) == sorted([(v - 2) % 4 + 1, v % 4 + 1])
    assert f(None) is None


def t_b207b(ns):
    f = ns["can_finish"]
    assert f(2, [[1, 0]])
    assert not f(2, [[1, 0], [0, 1]])
    assert f(3, [[1, 0], [2, 0], [2, 1]])
    assert not f(4, [[1, 0], [2, 1], [3, 2], [1, 3]])
    assert f(1, [])


def t_b417b(ns):
    f = ns["pacific_atlantic"]
    h = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]
    assert f(h) == [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
    assert f([[1]]) == [[0, 0]]
    assert f([[1, 1], [1, 1]]) == [[0, 0], [0, 1], [1, 0], [1, 1]]


def t_b200a(ns):
    f = ns["num_islands"]
    g1 = ["11110", "11010", "11000", "00000"]
    g2 = ["11000", "11000", "00100", "00011"]
    assert f([list(r) for r in g1]) == 1
    assert f([list(r) for r in g2]) == 3
    assert f([["0"]]) == 0


def t_b128a(ns):
    f = ns["longest_consecutive"]
    for nums, want in [([100, 4, 200, 1, 3, 2], 4), ([0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9),
                       ([], 0), ([1, 2, 0, 1], 3)]:
        assert f(nums) == want, nums


def t_b269b(ns):
    f = ns["alien_order"]
    def valid(words, order):
        chars = {c for w in words for c in w}
        if sorted(order) != sorted(chars):
            return False
        rank = {c: i for i, c in enumerate(order)}
        key = lambda w: [rank[c] for c in w]
        return all(key(a) <= key(b) for a, b in zip(words, words[1:]))
    for words in (["wrt", "wrf", "er", "ett", "rftt"], ["z", "x"], ["ab", "abc"], ["a", "b", "ca", "cc"]):
        assert valid(words, f(words)), words
    for words in (["z", "x", "z"], ["abc", "ab"]):
        assert f(words) == "", words


def t_b261b(ns):
    f = ns["valid_tree"]
    assert f(5, [[0, 1], [0, 2], [0, 3], [1, 4]])
    assert not f(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]])
    assert not f(4, [[0, 1], [1, 2], [2, 0]])
    assert not f(4, [[0, 1], [0, 2], [1, 2]])
    assert f(4, [[0, 1], [2, 3], [1, 2]])
    assert f(1, [])


def t_b323b(ns):
    f = ns["count_components"]
    assert f(5, [[0, 1], [1, 2], [3, 4]]) == 2
    assert f(5, [[0, 1], [1, 2], [2, 3], [3, 4]]) == 1
    assert f(3, []) == 3
    assert f(4, [[2, 3]]) == 3


def t_b57a(ns):
    f = ns["insert"]
    assert f([[1, 3], [6, 9]], [2, 5]) == [[1, 5], [6, 9]]
    assert f([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]) == [[1, 2], [3, 10], [12, 16]]
    assert f([], [5, 7]) == [[5, 7]]
    assert f([[1, 5]], [2, 3]) == [[1, 5]]
    assert f([[1, 2], [4, 5]], [2, 4]) == [[1, 5]]
    assert f([[1, 5]], [6, 8]) == [[1, 5], [6, 8]]


def t_b56b(ns):
    f = ns["merge"]
    assert f([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]
    assert f([[1, 4], [4, 5]]) == [[1, 5]]
    assert f([[1, 10], [2, 3]]) == [[1, 10]]
    assert f([[1, 4], [0, 4]]) == [[0, 4]]


def t_b435b(ns):
    f = ns["erase_overlap_intervals"]
    assert f([[1, 2], [2, 3], [3, 4], [1, 3]]) == 1
    assert f([[1, 2], [1, 2], [1, 2]]) == 2
    assert f([[1, 2], [2, 3]]) == 0
    assert f([[1, 100], [11, 22], [1, 11], [2, 12]]) == 2


def t_b253a(ns):
    f = ns["min_meeting_rooms"]
    assert f([[0, 30], [5, 10], [15, 20]]) == 2
    assert f([[7, 10], [2, 4]]) == 1
    assert f([[1, 5], [5, 10]]) == 1
    assert f([[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]) == 4


def t_b347b(ns):
    f = ns["top_k_frequent"]
    assert set(f([1, 1, 1, 2, 2, 3], 2)) == {1, 2}
    assert set(f([1], 1)) == {1}
    assert set(f([4, 4, 5, 5, 6], 2)) == {4, 5}
    assert set(f([1, 2, 2, 3, 3, 3], 2)) == {2, 3}


def t_b295b(ns):
    rnd = random.Random(2)
    for _ in range(20):
        mf = ns["MedianFinder"]()
        seen = []
        for _ in range(rnd.randint(1, 30)):
            x = rnd.randint(-50, 50)
            mf.add_num(x)
            seen.append(x)
            seen.sort()
            n = len(seen)
            want = seen[n // 2] if n % 2 else (seen[n // 2 - 1] + seen[n // 2]) / 2
            assert mf.find_median() == want, (seen, mf.find_median())


def t_b23b(ns):
    ns["ListNode"] = ListNode
    f = ns["merge_k_lists"]
    assert from_linked(f([to_linked(x) for x in ([1, 4, 5], [1, 3, 4], [2, 6])])) == [1, 1, 2, 3, 4, 4, 5, 6]
    assert from_linked(f([])) == []
    assert from_linked(f([None, to_linked([1])])) == [1]


def t_b19b(ns):
    ns["ListNode"] = ListNode
    f = ns["remove_nth_from_end"]
    for vals, n, want in [([1, 2, 3, 4, 5], 2, [1, 2, 3, 5]), ([1], 1, []), ([1, 2], 1, [1]), ([1, 2], 2, [2])]:
        assert from_linked(f(to_linked(vals), n)) == want, (vals, n)


def t_b143b(ns):
    f = ns["reorder_list"]
    for vals, want in [([1, 2, 3, 4], [1, 4, 2, 3]), ([1, 2, 3, 4, 5], [1, 5, 2, 4, 3]), ([1], [1]), ([1, 2], [1, 2])]:
        head = to_linked(vals)
        f(head)
        assert from_linked(head) == want, vals


def t_b73b(ns):
    f = ns["set_zeroes"]
    for m, want in [([[1, 1, 1], [1, 0, 1], [1, 1, 1]], [[1, 0, 1], [0, 0, 0], [1, 0, 1]]),
                    ([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]], [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]),
                    ([[1, 0]], [[0, 0]]), ([[1], [0]], [[0], [0]]),
                    ([[1, 2, 3], [4, 0, 6], [7, 8, 0]], [[1, 0, 0], [0, 0, 0], [0, 0, 0]])]:
        f(m)
        assert m == want, m


def t_b54a(ns):
    f = ns["spiral_order"]
    assert f([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 3, 6, 9, 8, 7, 4, 5]
    assert f([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) == [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
    assert f([[1, 2, 3]]) == [1, 2, 3]
    assert f([[1], [2], [3]]) == [1, 2, 3]
    assert f([[1, 2], [3, 4], [5, 6]]) == [1, 2, 4, 6, 5, 3]
    assert f([[1, 2, 3], [4, 5, 6]]) == [1, 2, 3, 6, 5, 4]
    def reference(m):
        out, m = [], [row[:] for row in m]
        while m:
            out += m.pop(0)
            m = [list(r) for r in zip(*m)][::-1]
        return out
    for rows in range(1, 6):
        for cols in range(1, 6):
            m = [[r * cols + c for c in range(cols)] for r in range(rows)]
            assert f(m) == reference(m), (rows, cols)


def t_b48a(ns):
    f = ns["rotate"]
    for n in (1, 2, 3, 4, 5):
        m = [[r * n + c for c in range(n)] for r in range(n)]
        want = [list(row) for row in zip(*m[::-1])]
        f(m)
        assert m == want, n


def t_b79b(ns):
    f = ns["exist"]
    board = lambda: [list("ABCE"), list("SFCS"), list("ADEE")]
    assert f(board(), "ABCCED")
    assert f(board(), "SEE")
    assert not f(board(), "ABCB")
    assert f([list("CAA"), list("AAA"), list("BCD")], "AAB")
    assert f([list("ABCE"), list("SFES"), list("ADEE")], "ABCESEEEFS")


def t_b3a(ns):
    f = ns["length_of_longest_substring"]
    for s, want in [("abcabcbb", 3), ("bbbbb", 1), ("pwwkew", 3), ("", 0), ("abba", 2), (" ", 1), ("dvdf", 3)]:
        assert f(s) == want, s


def t_b424a(ns):
    f = ns["character_replacement"]
    for s, k, want in [("ABAB", 2, 4), ("AABABBA", 1, 4), ("AAAA", 0, 4), ("ABCDE", 1, 2), ("ABBB", 0, 3)]:
        assert f(s, k) == want, (s, k)


def t_b76b(ns):
    f = ns["min_window"]
    for s, t, want in [("ADOBECODEBANC", "ABC", "BANC"), ("a", "a", "a"), ("a", "aa", ""),
                       ("aa", "aa", "aa"), ("ab", "b", "b"), ("bba", "ab", "ba"), ("abc", "cba", "abc")]:
        assert f(s, t) == want, (s, t, f(s, t))


def t_b49b(ns):
    f = ns["group_anagrams"]
    norm = lambda groups: sorted(sorted(g) for g in groups)
    assert norm(f(["eat", "tea", "tan", "ate", "nat", "bat"])) == [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
    assert norm(f([""])) == [[""]]
    assert norm(f(["ab", "ba", "abc", "cd", "ad", "bc"])) == [["ab", "ba"], ["abc"], ["ad"], ["bc"], ["cd"]]


def t_b5b(ns):
    f = ns["longest_palindrome"]
    assert f("babad") in ("bab", "aba")
    assert f("cbbd") == "bb"
    assert f("a") == "a"
    assert f("racecarxyz") == "racecar"
    assert f("abacdcaba") == "abacdcaba"


def t_b647b(ns):
    f = ns["count_substrings"]
    for s, want in [("abc", 3), ("aaa", 6), ("a", 1), ("abba", 6)]:
        assert f(s) == want, s


def t_b271b(ns):
    enc, dec = ns["encode"], ns["decode"]
    for strs in (["lint", "code", "love", "you"], ["", "#", "12#ab"], [], ["a#b#c", "3#x"]):
        assert dec(enc(strs)) == strs, strs


def t_b124b(ns):
    f = ns["max_path_sum"]
    for vals, want in [([1, 2, 3], 6), ([-10, 9, 20, None, None, 15, 7], 42), ([-3], -3), ([2, -1], 2),
                       ([5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1], 48)]:
        assert f(to_tree(vals)) == want, vals


def t_b102a(ns):
    f = ns["level_order"]
    assert f(to_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]
    assert f(to_tree([1])) == [[1]]
    assert f(None) == []
    assert f(to_tree([1, 2, None, 3, None, 4])) == [[1], [2], [3], [4]]


def t_b297b(ns):
    ns["TreeNode"] = TreeNode
    ser, de = ns["serialize"], ns["deserialize"]
    for vals in ([1, 2, 3, None, None, 4, 5], [], [1], [1, 2], [1, None, 2], [5, 4, 8, 11, None, 13, 4]):
        assert from_tree(de(ser(to_tree(vals)))) == vals, vals


def t_b105b(ns):
    ns["TreeNode"] = TreeNode
    f = ns["build_tree"]
    for pre, ino, want in [([3, 9, 20, 15, 7], [9, 3, 15, 20, 7], [3, 9, 20, None, None, 15, 7]),
                           ([-1], [-1], [-1]), ([1, 2], [2, 1], [1, 2]),
                           ([1, 2, 3], [3, 2, 1], [1, 2, None, 3]), ([1, 2, 3], [1, 2, 3], [1, None, 2, None, 3])]:
        assert from_tree(f(pre, ino)) == want, (pre, ino)


def t_b98b(ns):
    f = ns["is_valid_bst"]
    for vals, want in [([2, 1, 3], True), ([5, 1, 4, None, None, 3, 6], False), ([5, 4, 6, None, None, 3, 7], False),
                       ([2, 2, 2], False), ([1], True), ([3, 1, 5, None, 2], True)]:
        assert f(to_tree(vals)) == want, vals


def t_b230a(ns):
    f = ns["kth_smallest"]
    for vals in ([3, 1, 4, None, 2], [5, 3, 6, 2, 4, None, None, 1]):
        ordered = sorted(v for v in vals if v is not None)
        for k in range(1, len(ordered) + 1):
            assert f(to_tree(vals), k) == ordered[k - 1], (vals, k)


def t_b208b(ns):
    t = ns["Trie"]()
    t.insert("apple")
    assert t.search("apple") and not t.search("app") and t.starts_with("app")
    t.insert("app")
    assert t.search("app") and t.search("apple") and not t.starts_with("b")


def t_b211b(ns):
    d = ns["WordDictionary"]()
    for w in ("bad", "dad", "mad"):
        d.add_word(w)
    assert not d.search("pad")
    assert d.search("bad") and d.search(".ad") and d.search("b..") and d.search("...")
    assert not d.search("....") and not d.search("b.")


def t_b212b(ns):
    f = ns["find_words"]
    b1 = lambda: [list("oaan"), list("etae"), list("ihkr"), list("iflv")]
    assert sorted(f(b1(), ["oath", "pea", "eat", "rain"])) == ["eat", "oath"]
    assert sorted(f(b1(), ["oath", "oat", "oa"])) == ["oa", "oat", "oath"]
    assert f([list("ab"), list("cd")], ["abcb"]) == []
    assert sorted(f([list("oabn"), list("otae"), list("ahkr"), list("aflv")], ["oa", "oaa"])) == ["oa", "oaa"]


# ---------- runner ----------
def load_cards():
    js = """
    global.window = { UNITS: [] };
    require(process.argv[1]);
    const cards = window.UNITS.flatMap(u => u.cards).filter(c => c.c && c.c.includes("________"));
    console.log(JSON.stringify(cards));
    """
    out = subprocess.run(["node", "-e", js, str(ROOT / "js" / "blind75.js")],
                         capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def fill(code, option):
    option = option.strip().strip("`")
    option = option.replace('\\"', '"')
    return code.replace(BLANK, option, 1)


def _run(src, test_name, q):
    try:
        ns = {"ListNode": ListNode, "TreeNode": TreeNode, "Node": Node}
        exec(compile(src, "<snippet>", "exec"), ns)
        globals()[test_name](ns)
        q.put(("pass", ""))
    except BaseException as e:  # noqa: BLE001 - any failure counts
        q.put(("fail", f"{type(e).__name__}: {e}"[:200]))


def run(src, test_name):
    q = mp.Queue()
    p = mp.Process(target=_run, args=(src, test_name, q))
    p.start()
    p.join(TIMEOUT)
    if p.is_alive():
        p.kill()
        return "fail", "timeout"
    return q.get() if not q.empty() else ("fail", f"exit code {p.exitcode}")


def main():
    cards = load_cards()
    problems = 0
    for card in cards:
        name = f"t_{card['id']}"
        if name not in globals():
            print(f"MISSING TEST  {card['id']}")
            problems += 1
            continue
        for i, opt in enumerate(card["o"]):
            status, msg = run(fill(card["c"], opt), name)
            ok = (status == "pass") == (i == 0)
            if not ok:
                problems += 1
                kind = "correct option fails" if i == 0 else "WRONG option passes"
                print(f"FAIL  {card['id']}  {kind}: {opt}  {msg}")
    print(f"{len(cards)} code cards, {sum(len(c['o']) for c in cards)} options checked, {problems} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
