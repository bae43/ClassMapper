import sys
import os
import re


def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: %s in.txt \n" % sys.argv[0])
        sys.exit(1)


    infile_fullname = sys.argv[1]
    inFile = open(infile_fullname, 'r')
    fileName, fileExtension = os.path.splitext(infile_fullname)
    outFile = open(fileName+"_out"+fileExtension, 'w')

#SoCal - Shannon Spiers (San Juan Capistrano, south OC)

    try:
        for line in inFile:
            
            data = line.split(',')[0]
            print(data)
            # data = line.split('-')[1]
            # array = data.split('(')
            # name = array[0]
            # place = array[1].replace(')','').split(',')[0]
            # outFile.write(name + " - " + place)
            outFile.write(data+"\n")





    except UnicodeDecodeError:
        print("error")

    

    inFile.close()
    outFile.close()


if __name__ == "__main__":
    main()
