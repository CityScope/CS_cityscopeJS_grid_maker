// cityIOSettings.cityIO.baseURL
export const cityIOSettings = {
  cityIO: {
    baseURL: "https://cityio.media.mit.edu/api/",
  },
};

export const GridEditorSettings = {
  map: {
    mapStyle: {
      sat: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd?fresh=true",
      dark: "mapbox://styles/relnox/cjl58dpkq2jjp2rmzyrdvfsds?fresh=true",
      blue: "mapbox://styles/relnox/ck0h5xn701bpr1dqs3he2lecq?fresh=true",
      normal: "mapbox://styles/relnox/cl8dv36nv000t14qik9yg4ys6?fresh=true",
    },
  },

  GEOGRIDDATA: {
    color: [0, 0, 0],
    height: [0, 50, 100],
    id: 0,
    interactive: "Web",
    name: "name",
  },

  GEOGRID: {
    features: [],
    properties: {
      header: {
        tableName: "test",
        cellSize: 15,
        latitude: 42.3664655,
        longitude: -71.0854323,
        tz: -5,
        ncols: 20,
        nrows: 20,
        rotation: 0,
        projection:
          "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_def",
      },

      types: {
        Office: {
          description: "Offices and other commercial buildings, 0-100 stories",
          LBCS: [
            {
              proportion: 1,
              use: {
                "2310": 1,
              },
            },
          ],
          NAICS: [
            {
              proportion: 1,
              use: {
                "5400": 1,
              },
            },
          ],
          interactive: true,
          color: "#2482c6",
          height: [0, 50, 100],
        },
        Campus: {
          description: "Campus buildings, non-interactive, 0-30 stories",
          LBCS: [
            {
              proportion: 1,
              use: {
                "2310": 1,
              },
            },
          ],
          NAICS: [
            {
              proportion: 1,
              use: {
                "5400": 1,
              },
            },
          ],
          interactive: false,
          color: "#ab8f39",
          height: [0, 15, 30],
        },
        Park: {
          description:
            "Parks, playgrounds, and other open spaces. No height value",
          LBCS: [
            {
              proportion: 1,
              use: {
                "7240": 1,
              },
            },
          ],
          NAICS: null,
          interactive: true,
          color: "#7eb346",
          height: [0, 0, 0],
        },
        Residential: {
          description: "Residential buildings and apartments, 0-100 stories",
          LBCS: [
            {
              proportion: 1,
              use: {
                "1100": 1,
              },
            },
          ],
          NAICS: null,
          interactive: true,
          color: "#b97e18",
          height: [0, 50, 100],
        },
      },
    },
    type: "FeatureCollection",
  },
};
