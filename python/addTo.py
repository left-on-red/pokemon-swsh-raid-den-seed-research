#!/usr/bin/python
import sys

val = int(sys.argv[1], 0)
val += int(sys.argv[2], 0);
print(hex(val).rstrip("L"))