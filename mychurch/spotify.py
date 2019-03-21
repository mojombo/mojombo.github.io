import requests

def fetch(url, param):
  return requests.get(url % param).json()

def extract(query):
  gain = {}
  gain['query'] = query
  query = query.replace(' - ','').replace(' ', '+')
  r = fetch('https://api.spotify.com/v1/search?q=%s&type=album', query)
  print r
#  try:
#    gain["url"] = r['albums']['items'][0]['external_urls']['spotify']
#    gain["image"] = r['albums']['items'][0]['images'][1]['url']
#    r = fetch('https://api.spotify.com/v1/albums/%s', r['albums']['items'][0]['id'])
#    gain["year"] = r['release_date'][0:4]
#  except:
#    pass
  return gain

fi = open('albums.txt', 'r')
all = []
for li in fi:
  all.append(extract(li.strip()))
fi.close()

print '\n---\nlayout: default\ntitle: my church - albums\n---\n\n<div id="home">\n'
for year in range(2015, 1976, -1):
  buffer = ''
  buffer += '<h1>%s</h1><br>' % str(year)
  for item in all:
    try:
      if item["year"] == str(year):
        buffer += '<a href="%s"><img src="%s" alt="%s"></a>' % (item["url"], item["image"], item["query"])
    except:
      pass
  if buffer.endswith('a>'):
    print buffer

print '</div>\n'