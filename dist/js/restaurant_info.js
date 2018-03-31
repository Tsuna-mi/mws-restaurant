let restaurant,map;window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");if(t)DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)});else{e("No restaurant id in URL",null)}}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-detail"),n=document.createElement("picture");n.className="card__img rounded",t.append(n);const a=document.createElement("source");a.type="image/webp",a.srcset=`./assets/img/${e.id}-xl.webp 1x`,a.media="(min-width: 700px) and (max-width: 949px),\n                       (min-width: 1050px)",n.append(a);const s=document.createElement("source");s.type="image/webp",s.srcset=`./assets/img/${e.id}-l.webp 1x`,s.media="(min-width: 450px) and (max-width: 699px),\n                       (min-width: 950px) and (max-width: 1049px)",n.append(s);const d=document.createElement("source");d.type="image/webp",d.srcset=`./assets/img/${e.id}-m.webp 1x,\n                        ./assets/img/${e.id}-m@2x.webp 2x`,d.media="(min-width: 350px) and (max-width: 449px)",n.append(d);const r=document.createElement("source");r.type="image/webp",r.srcset=`./assets/img/${e.id}-s.webp 1x,\n                        ./assets/img/${e.id}-s@2x.webp 2x`,r.srcset="(max-width: 349px)",n.append(r);const m=document.createElement("source");m.type="image/jpg",m.srcset=`./assets/img/${e.id}-xl.jpg 1x`,m.media="(min-width: 700px) and (max-width: 949px),\n                      (min-width: 1050px)",n.append(m);const i=document.createElement("source");i.type="image/jpg",i.srcset=`./assets/img/${e.id}-l.jpg 1x`,i.media="(min-width: 450px) and (max-width: 699px),\n                      (min-width: 950px) and (max-width: 1049px)",n.append(i);const c=document.createElement("source");c.type="image/jpg",c.srcset=`./assets/img/${e.id}-m.jpg 1x,\n                        ./assets/img/${e.id}-m@2x.jpg 2x`,c.media="(min-width: 350px) and (max-width: 449px)",n.append(c);const p=document.createElement("source");p.type="image/jpg",p.srcset=`./assets/img/${e.id}-s.jpg 1x,\n                       ./assets/img/${e.id}-s@2x.jpg 2x`,p.media="(max-width: 349px)",n.append(p);const l=document.createElement("img");l.className="card__img rounded",l.src=`./assets/img/${e.id}-s.jpg`,l.alt=`${e.name} Restaurant image: ${e.description}`,n.append(l),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours"),n=document.createElement("tbody");t.appendChild(n),Object.keys(e).forEach(t=>{const a=document.createElement("tr"),s=document.createElement("td");s.innerHTML=`${t}`,s.className="day",a.appendChild(s);const d=document.createElement("td");d.innerHTML=e[t],d.className="Closed"===e[t]?"time closed":"time",a.appendChild(d),n.appendChild(a)})}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>a.appendChild(createReviewHTML(e))),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li");t.className="reviews__item rounded";const n=document.createElement("h4");n.className="top";const a=document.createElement("span");a.innerHTML=e.name,a.className="name",n.appendChild(a);const s=document.createElement("span");s.innerHTML=e.date,s.className="date shadow",n.appendChild(s),t.appendChild(n);const d=document.createElement("span");d.innerHTML=`Rating: ${e.rating}`,d.className="rating",t.appendChild(d);const r=document.createElement("p");return r.innerHTML=e.comments,r.className="comments",t.appendChild(r),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.setAttribute("aria-current","page"),n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});
//# sourceMappingURL=maps/restaurant_info.js.map
