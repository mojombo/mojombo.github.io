from collections import defaultdict

datadict = defaultdict(list)

fi = open ('forgalom.txt', 'r')
for li in fi:
	li = li.strip().split('\t')
	datadict[li[0]] = [li[1], li[2]]
fi.close()

fi = open('bp_input.geojson', 'r')
fo = open('bp_output.geojson', 'w')
for li in fi:
	if 'properties' in li:
		id = li.split('"IDB": ')[1].split('.0')[0]
		push = ', "name": "' + datadict[id][0] + '" , "density": ' + datadict[id][1]
		li = li.replace('.0 }, "geo', push + ' }, "geo')
	print >>fo, li.strip()
fo.close()
fi.close()