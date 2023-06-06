# Sheet Music Generator


## Tech Stack Overview:
This will be a full-stack website that is built with React and Node.


## Website Goal:
To provide users with a playable virtual keyboard that allows them to record, save, and share melodies, and also generate the sheet music notation for their melodies.


## Website Demographics:
Either people with a musical background and have a use for visualizing or producing sheet music, or anyone who enjoys experimenting with melody creation.


## Website Data:
I plan to use an API (such as VexFlow) that generates the sheet music image based on imputed music information, and also the WebAudi API or the "use-sound" React Hook.



## Approach:
#### Database schema:
I will store registered users in my database. Login authentication information and data for their saved melodies will be stored for each user. Depending on how easy it is to store and retrieve images from an SQL server, the produced sheet music will either also be saved on the database or they will be re-rendered using the API each time a user logs in.  


#### Potential API issues:
The VexFlow API is open source and may not be as well maintained or as flexible as some other more known APIs. If I opt to create my own API, this may be a more ambitious and complex project that could take longer to complete.


#### Is there any sensitive information you need to secure?
User login passwords.


#### App Functionality/User Flow:
Any user will be able to play melodies on their keyboard instrument, and then record and play-back the melodies they create. The recorded melodies will produce the corresponding sheet music notation in the form of an image. Users will need to register or log in to be able to save and access their recorded melodies and the generated sheet music. Users with an account will have the option to toggle the visibility of their saved melodies, allowing any other user on the homepage (whether logged in or not) to listen to the melody and/or view the sheet music.


#### Beyond CRUD:
The website will contain several features that push beyond a standard CRUD app. The core function of the app is for users to generate sheet music based on a played melody. The stretch goals include standardizing/polishing the melodies before audio playback or generating sheet music, and making the melodies sharable.
