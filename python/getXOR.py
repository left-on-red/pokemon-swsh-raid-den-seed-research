#!/usr/bin/python
import sys

v1 = int(sys.argv[1], 0)
v2 = int(sys.argv[2], 0)
val = v1 ^ v2
print(hex(val).rstrip("L"))