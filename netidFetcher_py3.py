# takes input list of names
# netIds, colleges, years output

# In:  First Last
# Out: NAME: First Last; NETID: netid; COLLEGE: college; YEAR: year

import sys
import os
import re
import requests
import urllib3
from urllib.parse import urlparse
from bs4 import BeautifulSoup


def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: %s in.txt \n" % sys.argv[0])
        sys.exit(1)


    infile_fullname = sys.argv[1]
    inFile = open(infile_fullname, 'r')
    fileName, fileExtension = os.path.splitext(infile_fullname)
    outFile = open(fileName+"_data_out"+fileExtension, 'w')

    baseurl = 'http://www.cornell.edu/search/index.cfm?tab=people&q='

    http = urllib3.PoolManager()

    try:
        for name in inFile:
            name = 'bryce evans'
            #name = name.replace(" ","%20")

            url = urllib3.parse.quote_plus(baseurl+name)
            outFile.write(url+"\n")
            print(url+"\n")
            r = http.request('GET',url)


            soup = BeautifulSoup(r.data)
            # print(dir(soup))
            # # print(dir(soup))
            #print((soup.html.body))
            t = soup.find('table')
            print(str(t))

            # #print(test)

    except UnicodeDecodeError:
        print("breaking on decode error")


    

    inFile.close()
    outFile.close()


if __name__ == "__main__":
    main()
