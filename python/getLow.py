#!/usr/bin/python
import sys

x = int(sys.argv[1], 0)
k = int(sys.argv[2], 0)
mask = int(sys.argv[3], 0)
val = (x >> (64 - k)) & mask
print(hex(val).rstrip("L"))