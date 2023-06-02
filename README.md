## Superhero API

This is a RESTful API built using Express.js, MongoDB, and Cloudinary. The API
allows you to manage superheroes by providing functionality to create
superheroes, fetch superheroes/fetch by ID, add or remove images from a
superhero, and delete superheroes completely.

# Installation

-> Clone the repository to your local machine: -> Navigate to the project
directory: -> Install the dependencies: npm install

Create an .env file in the root directory and provide the necessary environment
variables: PORT=3000, MONGO_URL=<your-mongodb-uri>,
MONGO_URL_TEST=<your-test-mongodb-uri>,
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>,
CLOUDINARY_API_KEY=<your-cloudinary-api-key>,
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# Usage

To start the API server, run the following command: npm start

## Endpoints

# Create a Superhero

URL: /create Method: POST Request Body:
{nickname:"nickname",real_name:"real_name",origin_description:"origin_description",superpowers:"superpowers",catch_phrase:"catch_phrase",
Images:[]}

# Get all superheroes

URL: /superheroes Method: GET

# Get Superhero by ID

URL: /:id Method: GET, Request Params: id

# Add Images to an existing Superhero

URL: /:id/add-images Method: post, Request Body: Form-Data: files

# Update Superhero

URL: /:id Method: PATCH, Requset Body: any file of the following body
{nickname:"nickname",real_name:"real_name",origin_description:"origin_description",superpowers:"superpowers",catch_phrase:"catch_phrase",
Images:[]}

# Remove image

URL: /:id/remove-images Method: PATCH, Requset Body: {Images: []}

# Remove superhero

URL: /:id-images Method: DELETE, Requset Params: id
