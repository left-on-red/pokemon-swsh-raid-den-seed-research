#!/usr/bin/python
import sys

val = int(sys.argv[1], 0)
s1 = int(sys.argv[2], 0)
val = val ^ s1 ^ (s1 << 16)
print(hex(val).rstrip("L"))