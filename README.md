# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

The porpouse of this repo it's to accomplish the 3 stages of Mobile Web Specialist Udacity Nanodegree.

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a **mobile-ready web application**. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality.

### Requirements

Make the provided site fully responsive. All of the page elements should be usable and visible in any viewport, including desktop, tablet, and mobile displays. Images shouldn't overlap, and page elements should wrap when the viewport is too small to display them side by side.

You will convert a site that looks like this:

<span style="display:block;text-align:center">
  <img src="./assets/docs/starter-mobile-page-1.png" alt="initial Image app 1" style="width: 450px;"/>
</span>
---
<span style="display:block;text-align:center">
  <img src="./assets/docs/starter-mobile-page-2.png" alt="initial Image app 2" style="width: 450px;"/>
</span>

into a site that looks like this:

<span style="display:block;text-align:center">
  <img src="./assets/docs/finished-mobile-page-1.png" alt="final Image app 1" style="width: 450px;"/>
</span>

---

<span style="display:block;text-align:center">
  <img src="./assets/docs/finished-mobile-page-2.png" alt="final Image app 2" style="width: 450px;"/>
</span>

---

**Make the site accessible**. Using what you've learned about web accessibility, ensure that alt attributes are present and descriptive for images. Add screen-reader-only attributes when appropriate to add useful supplementary text. Use semantic markup where possible, and aria attributes when semantic markup is not feasible.

**Cache the static site for offline use**. Using Cache API and a ServiceWorker, cache the data for the website so that any page (including images) that has been visited is accessible offline.



------
## Installation
Clone the GitHub repository and use **Npm** to install dependencies.

````
$ git clone https://github.com/Tsuna-mi/mws-restaurant.git
$ cd mws-restaurant
$ npm install
````
## Usage

You need to have a simple HTTP server to serve up the site files on your local computer. If you have Python installed on your machine (check with `python -V`), you can run: 

- For python 2.x: `python -m SimpleHTTPServer 8000` (or with other port)
- For python 3.x: `python3 -m http.server 8000` (or with other port)

Or you can run other server of your preference. I usually work with npm packages, for that I use **http-server** node package. Easy to install with: `npm install http-server -g`. To run, inside the project directory, if you don't need more options: `http-server -p 8000`
See the different options at: [http-server](https://www.npmjs.com/package/http-server).

Then you can open: 'http://localhost:8000/'

----

If you prefer, you can run:
````
gulp serve
````
to run a **dev version** of the application with optimised images, or

````
gulp serve:dist
````
to run a **distribution version** of the application with minified files and optimised images.

(At gulpfile there are other tasks listed you can use)

With your server running, visit the site: `http://localhost:8000`.


## License

The contents of this repository are covered under the [MIT License](LICENSE).

----

### *Thanks for visiting this repo! I hope you enjoy* :D


