import netidFetcher
import MySQLdb


def timeout(func, args=(), kwargs={}, timeout_duration=10, default=None):
    import threading
    class InterruptableThread(threading.Thread):
        def __init__(self):
            threading.Thread.__init__(self)
            self.result = default
        def run(self):
            self.result = func(*args, **kwargs)
    it = InterruptableThread()
    it.start()
    it.join(timeout_duration)
    if it.isAlive():
        return it.result
    else:
        return it.result

def info(name):
    return timeout(netidFetcher.info, (name,), timeout_duration = 2, default = [])


def get_names(cursor):  
    # cursor.execute("SELECT  name FROM  members WHERE netid IS NULL")
    # data = [item[0] for item in cursor.fetchall()]
    # return data
    f = open("co2017members/co2017members_chop_3.txt","r")
    return f

def insertData(db, cursor, name, id, college):  
   # UPDATE members SET netid='jaw457',college='EN' WHERE name='Jaden Williams';
    query = "UPDATE members SET netid='%s',college='%s' WHERE name='%s';" % (id,college,name)
    print query

    try:
       cursor.execute(query)
       db.commit()
    except:
       db.rollback()

# Fetch a single row using fetchone() method.
#data = cursor.fetchone()

def main():

    # Open database connection
    db = MySQLdb.connect("localhost", "root", "", "co2017")
    cursor = db.cursor()

    data = get_names(cursor)

    total = 0
    hit = 0



    outFile = open("sql_insert_log.txt", 'w')

    for name in data:
        cu_info = info(name)

        total = total + 1
        if cu_info != None and len(cu_info) > 0:
            hit += 1
            print "\n" + str(cu_info[0])
            netid = str(cu_info[0][0]) 
            college = str(cu_info[0][1])
            outFile.write("%s (%s) - %s\n" % (name, netid, college))
            insertData(db, cursor, name, netid, college)
        else:
            outFile.write("%s - MISS\n" % (name))

    # disconnect from server
    print "\nDone"
    outFile.write("\nHits/ Misses/ Total: %d / %d / %d" % (hit,total-hit,total))
    outFile.close()
    db.close()
    return

main()