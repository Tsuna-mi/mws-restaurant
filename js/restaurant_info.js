let restaurant;
let map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    const error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const card = document.getElementById('restaurant-detail');

  const picture = document.createElement('picture');
  picture.className = 'card__img rounded';
  card.append(picture);

  const sourceWebp1 = document.createElement('source');
  sourceWebp1.type = 'image/webp';
  sourceWebp1.srcset = `public/img/${restaurant.id}-xl.webp 1x`;
  sourceWebp1.media = `(min-width: 700px) and (max-width: 949px), 
                       (min-width: 1050px)`;
  picture.append(sourceWebp1);

  const sourceWebp2 = document.createElement('source');
  sourceWebp2.type = 'image/webp';
  sourceWebp2.srcset = `public/img/${restaurant.id}-l.webp 1x`;
  sourceWebp2.media = `(min-width: 450px) and (max-width: 699px), 
                       (min-width: 950px) and (max-width: 1049px)`;
  picture.append(sourceWebp2);

  const sourceWebp3 = document.createElement('source');
  sourceWebp3.type = 'image/webp';
  sourceWebp3.srcset = `public/img/${restaurant.id}-m.webp 1x, 
                        public/img/${restaurant.id}-m@2x.webp 2x`;
  sourceWebp3.media = '(min-width: 350px) and (max-width: 449px)';
  picture.append(sourceWebp3);


  const sourceWebp4 = document.createElement('source');
  sourceWebp4.type = 'image/webp';
  sourceWebp4.srcset = `public/img/${restaurant.id}-s.webp 1x, 
                        public/img/${restaurant.id}-s@2x.webp 2x`;
  sourceWebp4.srcset = '(max-width: 349px)';
  picture.append(sourceWebp4);

  const sourceJpg1 = document.createElement('source');
  sourceJpg1.type = 'image/jpg';
  sourceJpg1.srcset = `public/img/${restaurant.id}-xl.jpg 1x`;
  sourceJpg1.media = `(min-width: 700px) and (max-width: 949px), 
                      (min-width: 1050px)`;
  picture.append(sourceJpg1);

  const sourceJpg2 = document.createElement('source');
  sourceJpg2.type = 'image/jpg';
  sourceJpg2.srcset = `public/img/${restaurant.id}-l.jpg 1x`;
  sourceJpg2.media = `(min-width: 450px) and (max-width: 699px), 
                      (min-width: 950px) and (max-width: 1049px)`;
  picture.append(sourceJpg2);

  const sourceJpg3 = document.createElement('source');
  sourceJpg3.type = 'image/jpg';
  sourceJpg3.srcset = `public/img/${restaurant.id}-m.jpg 1x, 
                        public/img/${restaurant.id}-m@2x.jpg 2x`;
  sourceJpg3.media = '(min-width: 350px) and (max-width: 449px)';
  picture.append(sourceJpg3);

  const sourceJpg4 = document.createElement('source');
  sourceJpg4.type = 'image/jpg';
  sourceJpg4.srcset = `public/img/${restaurant.id}-s.jpg 1x, 
                       public/img/${restaurant.id}-s@2x.jpg 2x`;
  sourceJpg4.media = '(max-width: 349px)';
  picture.append(sourceJpg4);

  const image = document.createElement('img');
  image.className = 'card__img rounded';
  image.src = `public/img/${restaurant.id}-s.jpg`;
  image.alt = `${restaurant.name} Restaurant image: ${restaurant.description}`;
  picture.append(image);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  const tbody = document.createElement('tbody');
  hours.appendChild(tbody);

  Object.keys(operatingHours).forEach((key) => {
    const row = document.createElement('tr');
    const day = document.createElement('td');

    day.innerHTML = `${key}`;
    day.className = 'day';

    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.className = operatingHours[key] === 'Closed' ? 'time closed' : 'time';
    row.appendChild(time);

    tbody.appendChild(row);
  });
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => ul.appendChild(createReviewHTML(review)));
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.className = 'reviews__item rounded';
  const top = document.createElement('h3');
  top.className = 'top';
  const name = document.createElement('span');
  name.innerHTML = review.name;
  name.className = 'name';
  top.appendChild(name);
  const date = document.createElement('span');
  date.innerHTML = review.date;
  date.className = 'date shadow';
  top.appendChild(date);
  li.appendChild(top);

  const rating = document.createElement('span');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.className = 'rating';
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.className = 'comments';
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute('aria-current', 'page');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
