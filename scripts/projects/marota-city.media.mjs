// Media map for public/projects/marota-city/T104-T105.pdf
// `num` = image index reported by `pdfimages -list` (stable for this file).
// `mask` = its soft-mask (transparency) index, used for the 3D axonometric cut-outs.
// `render` = rasterise a page region instead (used when the page is a composition).

const config = {
  slug: "marota-city",
  pdf: "public/projects/marota-city/T104-T105.pdf",
  media: [
    // Brochure cover (page 1 is a single flattened image)
    { name: "cover", page: 1, num: 0, kind: "photo" },

    // Architectural renderings
    { name: "render-towers-sky", page: 8, num: 10, kind: "photo" },
    { name: "render-towers-front", page: 4, num: 4, kind: "photo" },
    { name: "render-street-retail", page: 5, num: 7, kind: "photo" },
    { name: "render-aerial-terraces", page: 6, num: 8, kind: "photo" },
    { name: "render-plaza", page: 7, num: 9, kind: "photo" },
    { name: "render-entrance", page: 9, num: 11, kind: "photo" },
    { name: "render-rooftop", page: 10, num: 12, kind: "photo" },
    { name: "render-aerial-towers", page: 49, num: 109, kind: "photo" },

    // Context
    { name: "marota-skyline", page: 2, render: { dpi: 250, crop: [0, 0.29, 1, 0.26] }, kind: "photo" },
    { name: "site-plan", page: 3, num: 3, kind: "plan" },
    { name: "section", page: 47, num: 99, kind: "plan" },
    { name: "elevation", page: 47, num: 100, kind: "plan" },
    { name: "tower-3d", page: 48, num: 103, mask: 104, kind: "cutout" },
    { name: "exploded-3d", page: 48, num: 105, mask: 106, kind: "cutout" },

    // Floor plans — 2D plan + 3D axonometric per level
    ...[
      ["b4", 13, 15, 14, 16, 17],
      ["b3", 15, 18, 16, 19, 20],
      ["b2", 17, 21, 18, 22, 23],
      ["b1", 19, 24, 20, 25, 26],
      ["f00", 21, 27, 22, 28, 29],
      ["f01", 23, 30, 24, 31, 32],
      ["f02", 25, 33, 26, 34, 35],
      ["f03", 27, 36, 27, 37, 38],
      ["f04", 28, 39, 28, 40, 41],
      ["f05", 29, 42, 29, 43, 44],
      ["f06", 30, 45, 30, 46, 47],
      ["f07", 31, 48, 31, 49, 50],
      ["f08", 32, 51, 32, 52, 53],
      ["f09", 33, 56, 33, 54, 55],
      ["f10", 34, 57, 34, 58, 59],
      ["f11", 35, 62, 35, 60, 61],
      ["f12", 36, 63, 36, 64, 65],
      ["f13", 37, 68, 37, 66, 67],
      ["f14", 38, 69, 38, 70, 71],
      ["f15", 39, 74, 39, 72, 73],
      ["f16", 40, 76, 40, 77, 78],
      ["f17", 41, 81, 41, 79, 80],
      ["f18", 42, 84, 42, 82, 83],
      ["f19", 43, 87, 43, 85, 86],
      ["f20", 44, 90, 44, 88, 89],
      ["f21", 45, 93, 45, 91, 92],
      ["f22", 46, 94, 46, 95, 96],
    ].flatMap(([id, p2d, n2d, p3d, n3d, m3d]) => [
      { name: `plan-${id}-2d`, page: p2d, num: n2d, kind: "plan" },
      { name: `plan-${id}-3d`, page: p3d, num: n3d, mask: m3d, kind: "cutout" },
    ]),
  ],
};

export default config;
