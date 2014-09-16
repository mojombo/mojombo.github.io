var myIcon = L.icon({
iconUrl: 'bar-24.png',
iconSize: [24, 24], 
iconAnchor: [12, 24],
popupAnchor: [0, -24]
});

L.marker([47.4968729535, 19.0628763777], {icon: myIcon}).bindPopup('Szimpla Kert').addTo(cities),
L.marker([47.5045985272, 19.0583825111], {icon: myIcon}).bindPopup('Instant').addTo(cities),
L.marker([47.499330901, 19.0609275741], {icon: myIcon}).bindPopup('Mika Tivadar Mulató').addTo(cities),
L.marker([47.498122342, 19.0553945303], {icon: myIcon}).bindPopup('Anker Klub').addTo(cities),
L.marker([47.49919, 19.0604], {icon: myIcon}).bindPopup('400').addTo(cities),
L.marker([47.4961398246, 19.0693044662], {icon: myIcon}).bindPopup('Corvintető').addTo(cities),
L.marker([47.5007643742, 19.0650987625], {icon: myIcon}).bindPopup('Fogasház').addTo(cities),
L.marker([47.5097586087, 19.0900593996], {icon: myIcon}).bindPopup('Dürer Kert').addTo(cities),
L.marker([47.5096462809, 19.01032269], {icon: myIcon}).bindPopup('Majorka').addTo(cities),
L.marker([47.5003526789, 19.0534715969], {icon: myIcon}).bindPopup('DiVino Borbár').addTo(cities),
L.marker([47.5039126, 19.057055], {icon: myIcon}).bindPopup('Most').addTo(cities),
L.marker([47.499026, 19.060518], {icon: myIcon}).bindPopup('Ellató Kert').addTo(cities),
L.marker([47.50482864, 19.0617004037], {icon: myIcon}).bindPopup('Kiadó Kocsma').addTo(cities),
L.marker([47.4793892665, 19.0508162206], {icon: myIcon}).bindPopup('Szatyor Bár és Galéria').addTo(cities),
L.marker([47.5131283319, 19.0832841396], {icon: myIcon}).bindPopup('Kertem').addTo(cities),
L.marker([47.5089650618, 19.0284758806], {icon: myIcon}).bindPopup('Jégkert').addTo(cities);