#!/usr/bin/python
import sys

val = int(sys.argv[1], 0)
toPrint = ((val >> 16) ^ (val & 0xffff)) >> 4
print(hex(toPrint).rstrip("L"))