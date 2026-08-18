import * as THREE from "three";

export function createGeoJsonEarthTexture(): THREE.Texture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.Texture();
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Realistic ocean surface with subtle depth gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, "#eef6fc");
  grad.addColorStop(0.5, "#e2f0fc");
  grad.addColorStop(1, "#c8e2f8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Latitude / Longitude Graticule Grid
  ctx.strokeStyle = "rgba(0, 80, 160, 0.14)";
  ctx.lineWidth = 1.2;
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

  // Realistic landmass polygons [lat, lon]
  const LAND_POLYGONS: [number, number][][] = [
    // North America
    [[71,-156],[71,-125],[60,-140],[58,-135],[48,-124],[38,-123],[32,-117],[23,-110],[16,-93],[14,-90],[8,-82],[9,-79],[18,-96],[25,-97],[25,-80],[30,-81],[30,-85],[35,-75],[44,-66],[52,-55],[60,-64],[68,-65],[72,-80],[75,-100],[75,-130]],
    // Central America & Caribbean
    [[16,-93],[14,-90],[9,-79],[8,-77],[10,-73],[14,-72],[18,-88]],
    // South America
    [[12,-73],[10,-62],[8,-53],[0,-48],[-6,-35],[-18,-38],[-23,-43],[-34,-53],[-42,-63],[-54,-68],[-52,-75],[-45,-74],[-36,-73],[-18,-71],[-12,-77],[-5,-81],[2,-79],[9,-77]],
    // Greenland
    [[83,-30],[80,-18],[70,-22],[60,-44],[65,-53],[76,-68],[81,-60]],
    // Europe Western & Central
    [[71,25],[70,31],[65,22],[60,30],[58,9],[54,8],[51,2],[48,-4],[43,-9],[36,-5],[37,10],[43,10],[45,14],[50,14],[55,21],[55,12],[62,5],[66,14],[70,20]],
    // British Isles
    [[58,-6],[58,-3],[50,-1],[50,-5],[55,-6]],
    // Scandinavia
    [[71,25],[70,30],[65,25],[60,20],[55,12],[58,9],[62,5],[66,14]],
    // Iberia
    [[43,-9],[43,-3],[36,-5],[36,-9]],
    // Africa Main
    [[37,10],[35,25],[31,25],[22,25],[18,12],[21,-17],[32,-9],[36,-5],[21,-17],[18,12],[10,13],[5,9],[5,2],[5,-10],[10,-14],[15,-17],[0,9],[-10,13],[-20,12],[-34,18],[-34,26],[-26,33],[-15,40],[-10,40],[0,42],[4,35],[11,51],[12,44],[22,37],[31,34]],
    // Madagascar
    [[-12,49],[-16,50],[-25,47],[-25,44],[-16,44]],
    // Middle East & Arabia
    [[30,35],[37,36],[37,44],[35,50],[30,48],[25,57],[24,59],[22,59],[17,54],[12,44],[16,42],[20,40],[28,35]],
    // India & South Asia Subcontinent
    [[35,75],[35,78],[32,78],[28,88],[25,92],[22,89],[21,88],[16,81],[10,80],[8,77],[10,76],[15,73],[20,73],[24,68],[30,70],[35,72]],
    // Sri Lanka
    [[9,80],[9,82],[6,81],[6,80]],
    // Eurasia & Russia
    [[75,100],[77,130],[70,150],[65,170],[60,163],[56,156],[50,140],[45,130],[48,100],[52,50],[55,60],[53,72],[48,80],[42,80],[38,70],[38,55],[42,50],[45,52],[60,60],[68,60],[75,100]],
    // China & East Asia
    [[48,80],[48,100],[45,130],[40,124],[35,119],[30,121],[22,114],[22,108],[28,100],[35,100],[42,80]],
    // Japan
    [[45,142],[40,140],[35,136],[31,130],[34,131],[40,135]],
    // Southeast Asia & Indochina
    [[28,100],[22,114],[20,106],[15,108],[10,104],[1,103],[8,98],[15,96],[22,91],[25,92]],
    // Indonesia & Malaysia
    [[6,117],[1,103],[-6,106],[-8,115],[-8,125],[-3,128],[3,117]],
    // Philippines
    [[18,122],[14,120],[8,126],[12,125]],
    // Australia
    [[-12,131],[-14,136],[-12,142],[-18,146],[-24,153],[-30,153],[-37,150],[-38,140],[-35,135],[-32,130],[-34,115],[-28,113],[-22,114],[-15,124]],
    // New Zealand
    [[-34,172],[-41,175],[-46,168],[-41,172]],
    // Antarctica
    [[-70,-180],[-70,-120],[-70,-60],[-70,0],[-70,60],[-70,120],[-70,180],[-85,180],[-85,-180]]
  ];

  ctx.fillStyle = "rgba(0, 80, 160, 0.32)";
  ctx.strokeStyle = "rgba(0, 80, 160, 0.85)";
  ctx.lineWidth = 2.2;

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

  // Highlight India Hub Area (Gold Glow on Texture)
  const indiaX = ((78.96 + 180) / 360) * 2048;
  const indiaY = ((90 - 20.59) / 180) * 1024;
  const hubGrad = ctx.createRadialGradient(indiaX, indiaY, 0, indiaX, indiaY, 60);
  hubGrad.addColorStop(0, "rgba(248, 192, 40, 0.6)");
  hubGrad.addColorStop(0.5, "rgba(248, 192, 40, 0.2)");
  hubGrad.addColorStop(1, "transparent");
  ctx.fillStyle = hubGrad;
  ctx.beginPath();
  ctx.arc(indiaX, indiaY, 60, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralBumpTexture(): THREE.Texture {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return new THREE.Texture();
  }

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


