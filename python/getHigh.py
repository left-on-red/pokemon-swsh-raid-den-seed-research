#!/usr/bin/python
import sys

x = int(sys.argv[1], 0)
k = int(sys.argv[2], 0)
val = x << k
print(hex(val).rstrip("L"))