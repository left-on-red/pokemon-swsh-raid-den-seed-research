#!/usr/bin/python
import sys

sidtid = int(sys.argv[1], 0)
pid = int(sys.argv[2], 0)

val = (sidtid ^ pid) >> 16

if ((val ^ (sidtid >> 16)) == (pid & 0xffff)): print(2)
else: print(1)