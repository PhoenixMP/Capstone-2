
# NoteWorthy
Deployed on Render: https://noteworthy-play.onrender.com/


*Gain insights into the project's website navigation and the interactive gameplay through two separate YouTube videos. 
The first is a walkthrough that highlights the website's structure and the second explores a gameplay preview.*

[![Image not available](/md-files/noteworthy-home.png)](https://youtu.be/c0Q13rNL8dQ)
[![Image not available](/md-files/noteworthy-gameplay.png)](https://www.youtube.com/watch?v=2MRHU614ZzU)

### About Noteworthy

NoteWorthy is a website that brings the excitement of a rhythm-based game similar to Guitar Hero, but with a unique twist – players use their computer keyboard to play piano notes. Just like in Guitar Hero, users are presented with a scrolling note highway on the screen, but this time, the notes correspond to piano keys. As the notes approach, players must hit the corresponding keys on their keyboard to produce the audio for the melody. With a diverse selection of songs and varying levels of difficulty, the game challenges players' timing, coordination, and musical skills. 

### Website Features
#### __Search Songs__
A collection of 38 playable songs awaits users on the "songs" page. User interaction is versatile – they can peruse the list through scrolling, specify their desired song title via search, or neatly categorize by genre. This array of song data is securely hosted on an independent backend server I developed. The act of sorting or searching triggers distinct API requests that extract the matching songs from the server.
Giving users the ability to explore and organize songs not only enhances clarity about available options but also streamlines the song selection process for greater efficiency.

#### __Optional Login/Signup__
The website offers a user-friendly login/signup feature that allows visitors to seamlessly access and enjoy the game. Notably, an account is not mandatory to begin playing; all visitors can explore song selections, view score leaderboards, and actively participate in gameplay across available tracks. However, the system doesn't provide personal score history or score-saving capabilities for users who opt not to create an account. Users without an account have the option to login or create an account to save a score each time they complete a round of gameplay.
This approach prioritizes accessibility and immediate engagement while preserving certain user-specific data exclusively for registered users. 

#### __Leaderboards__
Upon song selection, users are directed to a dedicated "song-details" page featuring an interactive leaderboard. Each leaderboard showcases a ranked compilation of the highest scores, saved by registered users, for the specific chosen song. Every recorded score is accompanied by the corresponding username and the timestamp of its achievement.
Leaderboards promote a sense of achievement and social interaction among players. By showcasing top scores, players are motivated to improve their skills and compete with others, contributing to prolonged engagement and community-building.

#### __User Profiles__
Registered users can access their dedicated profile page, showcasing a carousel of score cards representing their achievements. Users can accumulate these score cards by saving their best scores for different songs. This profile page offers two distinct views: "Personal Best" and "Undefeated" score cards.
A "Personal Best" score card is initially obtained for a song as soon as a user saves a non-zero score. This card is continually updated whenever the user achieves a new personal best score for that particular song.
On the other hand, "Undefeated" score cards are earned when a user holds the top score for a specific song. However, these cards can be relinquished if another user surpasses their score, reflecting a dynamic and competitive aspect of the game's leaderboard system.


### Gameplay Features

#### __Rhythm-Based-Gameplay__
During gameplay, players encounter a dynamic visual element: a scrolling “note highway” terminating at a virtual piano. This “note highway” showcases intricate patterns of music notes that emulate the selected song's melody. These music notes take on the appearance of "falling piano keys" – rectangular blocks, either black or white, with varying lengths corresponding to the note's duration.  Their horizontal alignment strategically positions them above one of the virtual piano's keys, signifying the note they represent. As the notes fall in synchronization with the music's tempo, players must deftly time their actions, pressing the corresponding piano key just as the note reaches the virtual piano.

#### __Keyboard Controls__
Users control (or “play”) the virtual piano with their computer keyboard. Each note on the virtual piano is labeled with a unique letter, and each of these letters corresponds to a key on a computer keyboard. Pressing these keyboard keys will translate their input into in-game actions and will also generate the single-note audio for that piano key.

#### __Scoring System__
The scoring system evaluates a player's performance based on their note hits. When a player hits a note within a designated accuracy range before or after the note's arrival at the virtual piano, points are assigned proportionally to the player's proximity to the ideal hit timing. The closer a player's input aligns with the note, the higher the score attributed to that particular note. If the players timing is within 50 milliseconds before or after the note, they are awarded 3 points. For within 100 milliseconds, 2 points. Within 200 milliseconds, 1 point. 
The total score is a continuously updated accumulation of all individual note points earned throughout gameplay. It's prominently displayed on the screen during gameplay and constantly changes as players hit notes.
Moreover, the scoring system upholds a strict standard for accurate gameplay. If a player's input is either too early or too late, if they press a key incorrectly, or if they miss a falling note key entirely, these instances result in a "miss" for that note. A "miss" does not deduct points from the player's score; instead, it signifies a reset of their note streak and point multiplier. 

The thorough scoring system incentivizes players to strive for accuracy and precision while playing, adding a challenging and rewarding element to the game. The "miss" penalty reinforces the importance of maintaining accuracy while ensuring a fair and enjoyable gaming experience.

#### __Milestone Streak Popup__
The milestone streak popup is a transient graphical element that momentarily appears prominently on the screen whenever a user successfully achieves a milestone streak during gameplay. When reached, these milestone streaks contribute to an augmented score multiplier that affects the points earned for each correct keypress. 
Purpose: The introduction of the milestone streak popup serves as an informative visual cue to acknowledge and celebrate a player's achievement of a significant milestone, without disrupting gameplay flow. 


#### __Score Multiplier__
The score multiplier mechanic boosts a player's score when they hit consecutive notes accurately. Successfully maintaining a streak of accurate hits amplifies the player's score multiplier.  If the player gets a “miss” for any note, the streak resets and the score multiplier is reset back to x1.
The relationship between the streak count and the multiplier operates as follows:

  - Streak = 0: x1 multiplier
  - Streak = 1: x2 multiplier
  - Streak = 10: x4 multiplier
  - Streak = 20: x8 multiplier
  - Streak = 30: x16 multiplier
  - Streak = 40: x32 multiplier


The score multiplier adds an extra layer of strategy, encouraging players to maintain precision and timing throughout their gameplay to achieve higher scores.


#### __Score Meter__
In cases where a top score exists for a particular song, a score meter will be present at the top of gameplay. As the player accumulates points by accurately hitting notes, the score meter steadily fills up, tracking their performance in real time. The meters fill level reflects the incremental progress of the player's current score compared to the existing top score. Should the player surpass the top score during gameplay, the score meter achieves full capacity and changes color.
The score meter serves as a visual incentive, encouraging players to aim for high scores and potentially surpass existing achievements.

#### __Personal Best Score__
The “Personal Best” score feature is a snippet of information visible solely to authenticated users who have previously set a score for that specific song. When present, this feature exhibits the player's highest achieved score for the given song. Notably, this score is independent of the top score and serves as a personalized reference point reflecting the player's individual performance.
The inclusion of the players personal best score serves as a factual representation of their progress and performance, and allows users to track their personal accomplishments within the game. 

#### __Restart Game & Exit Game__
The restart game feature enables players to reset the current gameplay session at any point and start over from the beginning of the song. The exit game feature allows players to exit the game and return to the leaderboard at any point during gameplay.
These option offers players flexibility and control over their gaming experience.

#### __Save Score Early__
The "save score early" functionality presents players with a strategic opportunity to safeguard their current score and depart the game before song completion, under specific conditions. This option is offered to enhance user convenience and cater to various scenarios:
1.	Non-Logged-In Users: For users who are not logged in, the feature becomes available as soon as they achieve a non-zero score. This allows them to preserve their progress and either proceed to create an account or log in to retain that initial score as their personal best.
2.	Logged-In Users (No Personal Best): When a logged-in user plays a song for the first time, the "save score early" option becomes accessible immediately upon obtaining a non-zero score. This grants them the ability to retain their progress even if they choose to conclude their session early.
3.	Logged-In Users (Existing Personal Best): For logged-in users who have established a personal best score for the song, the "save score early" option emerges only if they surpass their current personal best. This ensures that the option remains pertinent and incentivizes players to strive for improved scores.
In summary, the "save score early" feature is carefully tailored to user circumstances, enabling them to manage their progress effectively and reap the benefits of their gameplay achievements, while adhering to distinct criteria based on their login status and past performance.

#### __Instructions__

The instructions window is displayed to non-logged-in users before each song to help newcomers grasp the game's mechanics, controls, and objectives. This window features a visual diagram highlighting the specific computer keyboard keys for in-game actions. Users can minimize the instructions window using the 'x' button. Once users are logged in, this window no longer appears. 
This feature ensures players receive essential information for a smooth onboarding experience.
#### __Timer__
The timer displays the elapsed time during gameplay, indicating the player's progress through the song.
It enhances players' awareness of the song's pacing and their performance, helping them manage their gameplay.

#### __Countdown__
The countdown feature provides a visual countdown from 3 before the start of gameplay, allowing players to prepare for the upcoming notes.

#### __Dynamic Backgrounds__
I've generated four distinct background videos using the AI video generation software, Runway Gen 2. These videos showcase abstract surrealist imagery centered around grand pianos. During gameplay users are treated to a visual spectacle as one of these randomly selected background videos accompanies their experience. This dynamic feature enhances immersion, providing players with engaging and visually captivating surroundings that complement the musical gameplay.

#### __Note Accuracy Feedback__
The visual feedback system for denotating the accuracy of a players keypress provides instantaneous cues to players. As users interact with falling notes and piano keys, a color-coded system activates: accurate hits illuminate both the falling note and corresponding piano key in green, while mistimed actions trigger a red glow. Below the virtual piano keys, real-time descriptors ("perfect," "great," "good," or "miss") appear, accompanied by the precise points earned for that note. This swift, dynamic feedback loop enhances player awareness, encouraging timely and precise actions for an immersive gaming experience.

#### __Audio Feedback__
The background music plays as a version of the song without its central melody. With each virtual piano key press, the corresponding note's audio is triggered, allowing players to generate individual note sounds. Accurate key presses enable players to progressively reintegrate the absent melody, effectively completing the song's arrangement. The precision of their timing and accuracy directly influences the harmony of the audio. Mistimed or incorrect key presses, however, introduce discernible disruptions, immediately conveying deviations in performance. 
This dynamic connection between player inputs and audio responses provides an essential means for players to gauge their progress and adjust their actions, fostering a heightened sense of interaction between the immersive background music and the player's active contribution through virtual piano key presses. 


### Testing Status: Initial Manual Testing Conducted
The website project has undergone an initial round of manual testing, where I personally navigated through the site and thoroughly interacted with its features. While the formal unit test code is temporarily pending, rest assured that this phase is planned. Updates will be provided as testing activities are advanced. Your understanding is appreciated.

### User Flow Diagram
![Image not avaialble](/md-files/user-flow-diagram.png)


### NoteWorthy Backend API
Web server hosted on render: https://noteworthy-backend.onrender.com/

#### __Backend API and Database Architecture Overview:__
The NoteWorthy application is built with a React front end that communicates with a separate Express web server acting as the backend. This modular approach allows for efficient handling of API calls between the two components. To facilitate secure communication and access, API keys are utilized for authorization when making requests to the backend's endpoints.

#### __Database Structure:__
NoteWorthy employs two distinct databases to maintain data separation and modularity. The first database contains song-related information used to render the interactive gameplay experience. This includes song metadata, note data forming the melody, and MP3 files that are stored on the backend server.
The second database stores user-related information. User records consist of login credentials, user profiles, and associated scores. Each score is linked to a specific song by utilizing a corresponding song ID for efficient data organization and retrieval.

#### __Song Database Construction:__
The song database was populated through a meticulous process involving MIDI files. Using Python, the 'pretty_midi' library was employed to dissect MIDI files, parsing each track within a song. The melody track was identified among the available tracks, and from that melody track note data was extracted. These notes form the cascading falling notes that constitute the core gameplay experience.
New Midi files were generated to create an audio backdrop for the melody. These files retained all original tracks except the melody track, effectively creating a melody-less version akin to karaoke accompaniments. The MIDI files were subsequently converted into MP3 files and stored on the backend server.
Storage and Retrieval of Song Data:
Within the song database, note data is stored as JSON objects. The encoded MP3 files are organized within the backend's file system, categorized by the corresponding song ID. When a request for a specific song ID is made, the backend locates the corresponding MP3 file and retrieves its encoded data, which is then transmitted to the front end for playback.


### Tech Stack
  - Front End:
    - React
  - Back End/Server:
    - Express.js and Node.js

### Additional Notes

#### __CSS Credit__
The components listed below incorporate CSS contributions from the respective sources:
  - Homepage heading animation: Charlie Marcotte's CodePen - https://codepen.io/FUGU22/pen/YxEojN
  - Falling notes animation (song search and profile pages): yochans on CodePen - https://codepen.io/yochans/pen/PoQMxQj
  - Loading component: ugly-elephant-80 on Uiverse - https://uiverse.io/Shoh2008/ugly-elephant-80
  - Login/signup form: vinodjangid07 on Uiverse - https://uiverse.io/vinodjangid07/splendid-bat-9
  - Songs page vinyl slide-out animation: Nicolas Jesenberger on CodePen - https://codepen.io/nicolasjesenberger/pen/jOeLNJv
  - Profile page score cards: William Goldsworthy on CodePen - https://codepen.io/william-goldsworthy/pen/JzVajj
  - Background confetti animation (new top score): Arista on CodePen - https://codepen.io/aristamademe/pen/ZERRRqZ
  - Result/save-score container design: https://uiverse.io/sabbircoder07/quick-panther-36


#### __Song Credits and Usage Disclaimer__

The songs featured on this website have been transformed into interactive gameplay for demonstration and educational purposes only. The MIDI files used to create these musical experiences were sourced primarily from freemidi.org, and a piano arrangement for the track 'I'm Just a Ken' (from the Barbie movie) was contributed by user Mattea Lee on MuseScore. I do not claim ownership or rights to the original songs, which are popular mainstream compositions subject to copyright protection. The transformation of MIDI files into interactive gameplay, including note data manipulation and conversion into MP3 format, has been undertaken solely for the purpose of showcasing technical capabilities and creative innovation. No commercial use or distribution of the songs is intended or implied.

If you are the rights holder of any of the compositions featured on this website and have concerns about their usage, please contact me so that I can propmptly address any issues.




