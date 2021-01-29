def getfextension(exptype):
    if exptype == 'webjs':
        return 'js'
    else:
        return 'js'

def export(c, f):
    fi = open(f, 'w', encoding = 'utf-8')
    fi.write(c)
    fi.close()
