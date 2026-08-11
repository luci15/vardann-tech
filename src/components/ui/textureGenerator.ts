import * as THREE from "three";

export function createGeoJsonEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background light ocean surface
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.5, "#f1f7fc");
  grad.addColorStop(1, "#dcebf7");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Graticule Lines (Equirectangular Lat/Lon grid)
  ctx.strokeStyle = "rgba(0, 80, 160, 0.12)";
  ctx.lineWidth = 1.5;
  for (let lon = -180; lon <= 180; lon += 15) {
    const x = ((lon + 180) / 360) * 2048;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 15) {
    const y = ((90 - lat) / 180) * 1024;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }

  // Country & Region Boundary Polygons (lat, lon)
  const LAND_POLYGONS: [number, number][][] = [
    // Eurasia Main
    [[71,25],[70,40],[68,60],[75,100],[70,150],[60,163],[50,140],[38,120],[22,114],[10,104],[1,103],[15,96],[22,91],[16,81],[8,77],[19,72],[25,62],[25,57],[12,44],[28,34],[37,22],[36,-5],[43,-9],[48,-4],[54,8],[62,5],[70,18]],
    // India Subcontinent
    [[35,75],[32,78],[28,88],[25,92],[22,89],[21,88],[16,81],[10,80],[8,77],[10,76],[15,73],[20,73],[24,68],[30,70]],
    // Pakistan & Afghanistan
    [[35,75],[37,71],[35,61],[30,61],[25,62],[24,68],[30,70]],
    // Iran
    [[38,44],[38,55],[37,63],[25,62],[25,57],[30,48],[33,46]],
    // Saudi Arabia & Gulf
    [[30,35],[30,48],[25,57],[24,59],[22,59],[17,54],[12,44],[16,42],[20,40],[28,35]],
    // Yemen & Oman
    [[17,54],[22,59],[24,59],[22,55],[16,52],[12,44]],
    // Iraq & Syria
    [[37,42],[37,44],[33,46],[30,48],[30,35],[33,35],[36,36]],
    // Turkey
    [[42,27],[42,44],[37,44],[36,36],[37,27]],
    // Egypt
    [[31,25],[31,34],[22,37],[22,25]],
    // Sudan & Horn of Africa
    [[22,25],[22,37],[12,44],[11,51],[0,42],[4,35],[10,24]],
    // North Africa
    [[37,10],[35,25],[31,25],[22,25],[18,12],[21,-17],[32,-9],[36,-5]],
    // West Africa
    [[21,-17],[18,12],[10,13],[5,9],[5,2],[5,-10],[10,-14],[15,-17]],
    // Central & East Africa
    [[0,9],[-10,13],[-10,40],[0,42],[4,35]],
    // Southern Africa
    [[-10,13],[-20,12],[-34,18],[-34,26],[-26,33],[-15,40],[-10,40]],
    // Madagascar
    [[-12,49],[-16,50],[-25,47],[-25,44],[-16,44]],
    // Central Asia
    [[52,50],[55,60],[53,72],[48,80],[42,80],[38,70],[38,55],[42,50],[45,52]],
    // Russia & Siberia
    [[75,100],[77,130],[70,150],[65,170],[60,163],[56,156],[50,140],[45,130],[48,100]],
    // China
    [[48,80],[48,100],[45,130],[40,124],[35,119],[30,121],[22,114],[22,108],[28,100],[35,100],[42,80]],
    // Southeast Asia
    [[28,100],[22,114],[20,106],[15,108],[10,104],[1,103],[8,98],[15,96],[22,91],[25,92]],
    // Europe Western
    [[58,6],[54,8],[51,2],[48,-4],[43,-9],[36,-5],[37,10],[43,10],[45,14],[50,14],[55,21],[55,12]],
    // Scandinavia
    [[71,25],[70,31],[65,22],[60,30],[58,9],[62,5],[66,14],[70,20]],
    // Australia
    [[-12,131],[-14,136],[-12,142],[-18,146],[-24,153],[-30,153],[-37,150],[-38,140],[-35,135],[-32,130],[-34,115],[-28,113],[-22,114],[-15,124]],
    // North America
    [[72,-168],[70,-150],[68,-135],[62,-125],[54,-130],[48,-125],[38,-123],[32,-117],[23,-110],[16,-93],[14,-90],[9,-79],[8,-77],[10,-73],[18,-96],[25,-97],[26,-80],[30,-85],[35,-75],[44,-66],[52,-55],[60,-64],[68,-65],[72,-80],[75,-100],[75,-130]],
    // South America
    [[12,-73],[10,-62],[8,-53],[0,-48],[-6,-35],[-18,-38],[-23,-43],[-34,-53],[-42,-63],[-54,-68],[-52,-75],[-45,-74],[-36,-73],[-18,-71],[-12,-77],[-5,-81],[2,-79],[9,-77]],
    // Greenland
    [[83,-30],[80,-18],[70,-22],[60,-44],[65,-53],[76,-68],[81,-60]]
  ];

  ctx.fillStyle = "rgba(148, 163, 184, 0.35)";
  ctx.strokeStyle = "rgba(0, 70, 150, 0.8)";
  ctx.lineWidth = 2;

  for (const poly of LAND_POLYGONS) {
    if (poly.length < 3) continue;
    ctx.beginPath();
    for (let i = 0; i < poly.length; i++) {
      const [lat, lon] = poly[i];
      const x = ((lon + 180) / 360) * 2048;
      const y = ((90 - lat) / 180) * 1024;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
