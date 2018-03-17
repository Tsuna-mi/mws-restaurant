let restaurants;
let neighborhoods;
let cuisines;
let map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach((neighborhood) => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach((cuisine) => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  const loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => ul.append(createRestaurantHTML(restaurant)));
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.className = 'cards__item';
  const card = document.createElement('div');
  card.className = 'card';
  li.append(card);

  const picture = document.createElement('picture');
  picture.className = 'card__img rounded';
  card.append(picture);

  const sourceWebp1 = document.createElement('source');
  sourceWebp1.type = 'image/webp';
  sourceWebp1.srcset = `public/img/${restaurant.id}-xl.webp, 
                        media="(min-width: 800px)"`;
  picture.append(sourceWebp1);

  const sourceWebp2 = document.createElement('source');
  sourceWebp2.type = 'image/webp';
  sourceWebp2.srcset = `public/img/${restaurant.id}-l.webp, 
                        media="(min-width: 600px)"`;
  picture.append(sourceWebp2);

  const sourceWebp3 = document.createElement('source');
  sourceWebp3.type = 'image/webp';
  sourceWebp3.srcset = `public/img/${restaurant.id}-m.webp, 
                        public/img/${restaurant.id}-m@2x.webp 2x,
                        media="(min-width: 400px)"`;
  picture.append(sourceWebp3);


  const sourceWebp4 = document.createElement('source');
  sourceWebp4.type = 'image/webp';
  sourceWebp4.srcset = `public/img/${restaurant.id}-s.webp, 
                        public/img/${restaurant.id}-s@2x.webp 2x, 
                        media="(min-width: 300px)"`;
  picture.append(sourceWebp4);

  const sourceJpg1 = document.createElement('source');
  sourceJpg1.type = 'image/jpg';
  sourceJpg1.srcset = `public/img/${restaurant.id}-xl.jpg
                       media="(min-width: 800px)"`;
  picture.append(sourceJpg1);

  const sourceJpg2 = document.createElement('source');
  sourceJpg2.type = 'image/jpg';
  sourceJpg2.srcset = `public/img/${restaurant.id}-l.jpg, 
                       media="(min-width: 600px)"`;
  picture.append(sourceJpg2);

  const sourceJpg3 = document.createElement('source');
  sourceJpg3.type = 'image/jpg';
  sourceJpg3.srcset = `public/img/${restaurant.id}-m.jpg, 
                        public/img/${restaurant.id}-m@2x.jpg 2x,
                        media="(min-width: 400px)"`;
  picture.append(sourceJpg3);

  const image = document.createElement('img');
  image.className = 'card__img rounded';
  image.srcset = `public/img/${restaurant.id}-s.jpg,
                  public/img/${restaurant.id}-s@2x.jpg 2x,
                  media="(min-width: 300px)"`;
  image.alt = `${restaurant.name} Restaurant image`;
  picture.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.className = 'card__title';
  card.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  card.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  card.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  card.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach((restaurant) => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};
