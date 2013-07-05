
from bs4 import BeautifulSoup
import re
import requests

baseurl = 'http://www.cornell.edu/search/index.cfm?tab=people&q='

def parse_name(name):
    return name.replace(' ','%20')

def get_created_year(soup):
    try:
        return re.findall(' 201.', re.findall('CREATED ON:.*MOD', str(soup), re.DOTALL)[0])[0][1:]
    except Exception as e:
        return ""


def info(name, year = ""):
    namestr = parse_name(name)
    url = baseurl + namestr
    r = requests.get(url)
    soup = BeautifulSoup(r.text)
    # only single-person pages have vcard
    vcard = soup.find("div", {"id":"vcardlink"})
    t = str(vcard)
    l = re.findall(r'netid=.*[0-9]', t)
    if len(l) > 0:
        try:
            thisyear = get_created_year(soup)
        except Exception as e:
            thisyear = ""
        if (year == "") or (thisyear == year): 
            netid = l[0][6:]
            table = soup.findAll('table')
            try:
                ct = table[7]
                college = re.findall(r'>.*<',str(ct).split('\n')[7])[0][1:-1]
            except Exception as e:
                college = ""
            return [(netid, college)]
        else: 
            return []
    else:
        # run same process on each name in the list
        searchsoups = soup.findAll("div", {"class":"peopleresults"})
        out = []
        if len(searchsoups) > 0:
            students = searchsoups[0].findAll("td", {"class":"nameresult"})
            for i in students:
                name = re.findall(r'>[A-Z].*</a', str(i))[0][1:-3]
                out = out + info(name, year)
        return out


