let restaurants;
let neighborhoods;
let cuisines;
let map;
var markers = [];


/**
 * Register sw.
 */

if (navigator.serviceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: './' })
      .then((registration) => {
        console.log('SW registered!');
        let sw;
        if (registration.installing) {
          sw = registration.installing;
          console.log('SW installing!');
        } else if (registration.waiting) {
          sw = registration.waiting;
          console.log('SW installed and waiting!');
        } else if (registration.active) {
          sw = registration.active;
          console.log('SW active!');
        }

        if (sw) {
          console.log(sw.state);
          sw.addEventListener('statechange', (e) => {
            console.log(e.target.state);
          });
        }
      }).catch(() => {
        console.log('SW Registration failed!');
      });
  });
}


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
  sourceWebp1.srcset = `./assets/img/${restaurant.id}-xl.webp 1x`;
  sourceWebp1.media = '(min-width: 2200px)';
  picture.append(sourceWebp1);

  const sourceWebp2 = document.createElement('source');
  sourceWebp2.type = 'image/webp';
  sourceWebp2.srcset = `./assets/img/${restaurant.id}-l.webp 1x`;
  sourceWebp2.media = `(min-width: 500px) and (max-width: 650px),
                       (min-width: 1500px) and (max-width: 2200px)`;
  picture.append(sourceWebp2);

  const sourceWebp3 = document.createElement('source');
  sourceWebp3.type = 'image/webp';
  sourceWebp3.srcset = `./assets/img/${restaurant.id}-m.webp 1x,
                        ./assets/img/${restaurant.id}-m@2x.webp 2x`;
  sourceWebp3.media = `(min-width: 400px) and (max-width: 500px),
                       (min-width: 800px) and (max-width: 950px),
                       (min-width: 1200px) and (max-width: 1500px)`;
  picture.append(sourceWebp3);


  const sourceWebp4 = document.createElement('source');
  sourceWebp4.type = 'image/webp';
  sourceWebp4.srcset = `./assets/img/${restaurant.id}-s.webp 1x,
                        ./assets/img/${restaurant.id}-s@2x.webp 2x`;
  sourceWebp4.media = `(min-width: 320px) and (max-width: 400px),
                       (min-width: 650px) and (max-width: 800px),
                       (min-width: 950px) and (max-width: 1200px)`;
  picture.append(sourceWebp4);

  const sourceJpg1 = document.createElement('source');
  sourceJpg1.type = 'image/jpg';
  sourceJpg1.srcset = `./assets/img/${restaurant.id}-xl.jpg 1x`;
  sourceJpg1.media = '(min-width: 2200px)';
  picture.append(sourceJpg1);

  const sourceJpg2 = document.createElement('source');
  sourceJpg2.type = 'image/jpg';
  sourceJpg2.srcset = `./assets/img/${restaurant.id}-l.jpg 1x`;
  sourceJpg2.media = `(min-width: 500px) and (max-width: 650px),
                      (min-width: 1500px) and (max-width: 2200px)`;
  picture.append(sourceJpg2);

  const sourceJpg3 = document.createElement('source');
  sourceJpg3.type = 'image/jpg';
  sourceJpg3.srcset = `./assets/img/${restaurant.id}-m.jpg 1x,
                       ./assets/img/${restaurant.id}-m@2x.jpg 2x`;
  sourceJpg3.media = `(min-width: 400px) and (max-width: 500px),
                      (min-width: 800px) and (max-width: 950px),
                      (min-width: 1200px) and (max-width: 1500px)`;
  picture.append(sourceJpg3);

  const image = document.createElement('img');
  image.className = 'card__img rounded';
  image.srcset = `./assets/img/${restaurant.id}-s.jpg 1x,
                  ./assets/img/${restaurant.id}-s@2x.jpg 2x`;
  image.media = `(min-width: 320px) and (max-width: 400px),
                 (min-width: 650px) and (max-width: 800px),
                 (min-width: 950px) and (max-width: 1200px)`;
  image.alt = `${restaurant.name} Restaurant image: ${restaurant.description}`;
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
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('role', 'button');
  more.setAttribute('aria-label', 'Go to more info about this Restaurant');
  more.innerHTML = 'View Details';
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
