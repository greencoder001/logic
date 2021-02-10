def imppkg(expt, pkg):
    fi = open('pkg/' + expt + '/' +  str(pkg) + '.lgp')
    pkex = fi.read()
    fi.close()
    return pkex

def phtml(c):
    return f"""

    """

def ugly(c, lang):
    if lang == 'web' or lang == 'html' or lang == 'htm':
        c = phtml(c)
    return c

def compilelgs(filepath, exportpath, fname, export_type):
    exported = ''
    fi = open(filepath, 'r', encoding = 'utf-8')
    content = fi.read()
    fi.close()
    if_conditions = 0
    linesall = content.splitlines()
    if (export_type == 'application' or export_type == 'webjs'):
        linesall.append('/* @endfile; */')
    for line in linesall:
        without_tabs = line.replace('\t', '').replace('  ', '')
        if without_tabs.startswith('import '):
            pkg = without_tabs[7:]
            exported += imppkg(export_type, pkg)
        elif (without_tabs.startswith('if')) and without_tabs.endswith(':') and (export_type == 'application' or export_type == 'webjs'):
            condition = without_tabs[3:][:-1]
            exported += 'if(' + condition + '){\n'
            if_conditions += 1
        elif (without_tabs.startswith('while')) and without_tabs.endswith(':') and (export_type == 'application' or export_type == 'webjs'):
            condition = without_tabs[6:][:-1]
            exported += 'while(' + condition + '){\n'
            if_conditions += 1
        elif (without_tabs.startswith('else')) and without_tabs.endswith(':') and (export_type == 'application' or export_type == 'webjs'):
            exported += 'else{\n'
            if_conditions += 1
        elif (without_tabs.startswith('repeat')) and without_tabs.endswith(':') and (export_type == 'application' or export_type == 'webjs'):
            count = without_tabs[7:][:-1]
            exported += 'for(counter=0;counter<' + count + ';counter++){\n'
            if_conditions += 1
        elif (without_tabs.startswith('repeat')) and without_tabs.endswith(':') and (export_type == 'python' or export_type == 'py'):
            count = without_tabs[7:][:-1]
            exported += 'for counter in range(0,' + count + '):\n'
            if_conditions += 1
        elif '/* @endfile; */' in line:
            tabcount = 0
            while '  ' in line:
                tabcount += 1
                line = line.replace('  ', '')
            suffix = ''
            if tabcount < if_conditions and (export_type != 'python' and export_type != 'py'):
                suffix = '}'
                if_conditions -= 1
            if (export_type == 'application' or export_type == 'webjs'):
                exported += suffix + '/*endfile*/\n'
            if (export_type == 'python' or export_type == 'py'):
                exported += suffix + '\n"""endfile"""\n'
        else:
            tabcount = 0
            lb = line
            while '  ' in line:
                tabcount += 1
                line = line.replace('  ', '')
            suffix = ''
            if tabcount < if_conditions and (export_type != 'python' and export_type != 'py'):
                suffix = '}'
                if_conditions -= 1
            if export_type == 'py' or export_type == 'python':
                exported += lb + '\n' + suffix
            else:
                exported += line + '\n' + suffix
    return ugly(exported, export_type)
