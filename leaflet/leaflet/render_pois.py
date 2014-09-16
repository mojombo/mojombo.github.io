fi = open('nightlife.txt', 'r')
fo = open('nightlife_all.js', 'w')

print >>fo, "var myIcon = L.icon({\niconUrl: 'bar-24.png',\niconSize: [24, 24], \
\niconAnchor: [12, 24],\npopupAnchor: [0, -24]\n});"

for li in fi:
	it = li.strip().split('\t')
	print >>fo, "L.marker([" + it[1] + ", " + it[2] + "], {icon: myIcon}).bindPopup('" + it[0] + "').addTo(cities),"
fo.close()
fi.close()