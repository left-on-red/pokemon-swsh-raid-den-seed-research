#!/usr/bin/python
import sys

seed = int(sys.argv[1], 0)
offset = int(sys.argv[2], 0)

for i in range(offset): seed += 0x82A2B175229D6A5B
print(hex(seed).rstrip("L"))