# chopper.py

import sys
import os

chunk_size = 500

infile_fullname = sys.argv[1]
inFile = open(infile_fullname, 'r')

fileName, fileExtension = os.path.splitext(infile_fullname)

if not os.path.exists(fileName):
    os.makedirs(fileName)


outFile = open(fileName+"/"+fileName+"_chop_0"+fileExtension, 'w')

i = 1
chop = 1
for line in inFile:

	outFile.write(line)

	if(i % (chunk_size) == 0):
		outFile.close()
		outFile = open(fileName+"/"+fileName+"_chop_"+str(chop)+fileExtension, 'w')
		chop += 1
		i = 0
	i += 1

	



