export const createTypesArray = (LandUseTypesList) => {
  let typesArray = [];
  Object.keys(LandUseTypesList).forEach((type, index) => {
    typesArray.push({
      id: index,
      name: type,
      description: LandUseTypesList[type].description,
      color: LandUseTypesList[type].color,
      height: LandUseTypesList[type].height,
      "height[0]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[0]
        : 0,
      "height[1]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[1]
        : 0,
      "height[2]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[2]
        : 0,

      LBCS: LandUseTypesList[type].LBCS
        ? JSON.stringify(LandUseTypesList[type].LBCS)
        : null,
      NAICS: LandUseTypesList[type].NAICS
        ? JSON.stringify(LandUseTypesList[type].NAICS)
        : null,
      interactive: LandUseTypesList[type].interactive,
    });
  });
  return typesArray;
};
