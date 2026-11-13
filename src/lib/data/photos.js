// Every photo on the site, with its credit. All come from Wikimedia Commons under the licence listed,
// and are kept in src/assets/photos as .webp in three widths: -lg (1920), -md (960), -sm (480).
// Keep the credits page (/credits) whenever these photos are used.
const files = import.meta.glob('../assets/photos/*.webp', { eager: true, import: 'default' });

/** Returns a picker that serves the smallest file at least as wide as asked for. */
const local = (key) => (w) => {
  const size = w > 960 ? 'lg' : w > 480 ? 'md' : 'sm';
  const url = files[`../assets/photos/${key}-${size}.webp`];
  if (!url && import.meta.env.DEV) console.warn(`Missing photo: ${key}-${size}.webp`);
  return url;
};

export const photos = {
  lagoon: {
    src: local('lagoon'),
    alt: 'Aerial view of Victoria Island, Lagos, with the lagoon and a yacht harbour',
    title: 'Aerial view of Victoria Island in Lagos',
    credit: 'Ayorinde Ogundele',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_victoria_island_in_Lagos,_Nigeria_with_habours_for_yatches.jpg',
  },
  market: {
    src: local('market'),
    alt: 'Crowds and stalls at Balogun Market on Lagos Island, seen from above',
    title: 'Balogun Market, Lagos Island',
    credit: 'Yellowcrunchy',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Balogun_Market,_Lagos_Island.jpg',
  },
  bridge: {
    src: local('bridge'),
    alt: 'The Lekki Link Bridge in Lagos under a cloudy evening sky',
    title: 'The Lekki Link Bridge, Lagos',
    credit: 's.aderogba',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:The_lekki_Link_Bridge_Lagos_.jpg',
  },
  lekki: {
    src: local('lekki'),
    alt: 'Open plots of land with power lines in Lekki, Lagos',
    title: 'Lekki, Lagos',
    credit: 'Jeremy Weate',
    license: 'CC BY 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:2009_Lekki_Lagos_Nigeria_4203784050.jpg',
  },
  eko: {
    src: local('eko'),
    alt: 'Earth movers on sand reclaimed from the sea for Eko Atlantic City, Lagos',
    title: 'Eko Atlantic City',
    credit: 'Heinrich-Böll-Stiftung',
    license: 'CC BY-SA 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:Eko_Atlantic_City_(5209072338).jpg',
  },
  survey: {
    src: local('survey'),
    alt: 'A surveying prism and a total station standing on yellow tripods',
    title: 'Surveying prism and total station',
    credit: 'Syced',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Surveying_prism_and_total_station,_for_land_surveying,_in_Shibuya-ku.jpg',
  },
  skyline: {
    src: local('skyline'),
    alt: 'Office towers along a wide road in Lagos',
    title: 'Lagos skyline',
    credit: 'Clara Sanchiz',
    license: 'CC BY-SA 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:Lagos_skyline.jpg',
  },
  island: {
    src: local('island'),
    alt: 'Rooftops and towers of Lagos Island',
    title: 'Lagos Island cityscape',
    credit: 'Jamie Tubers',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Lagos_Island_City_Scape.jpg',
  },
  abuja: {
    src: local('abuja'),
    alt: 'Hills and the Usman Dam reservoir near Bwari, Abuja',
    title: 'Usman Dam, Bwari, Abuja',
    credit: 'Uzoma Ozurumba',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Usman_Dam,_Bwari,_Abuja_scenic_view_3.jpg',
  },
};
