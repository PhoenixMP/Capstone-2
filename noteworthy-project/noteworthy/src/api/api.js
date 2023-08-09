import axios from "axios";

//required token and URL For API 
const API_token = "*EJi2&bqVvJ06QRSqV^*8@MpjN9#It5M1C2cu$cNypg7Qz9SJ3"
const BASE_URL = "https://noteworthy-backend.onrender.com";


/**
 * Utility class for making targeted API calls and handling responses.
 * Provides functions to interact with specific endpoints and manage API data.
 */
class NoteworthyAPI {

  //Authentication token for the currently logged-in user.
  // This token is obtained upon successful user login and is required for
  // authenticating API requests and accessing protected resources.
  // If no user is logged in, this variable remains undefined.
  static userToken;


  /**
 * Makes an asynchronous API request to a specified endpoint.
 *
 * @param {string} endpoint - The endpoint URL to make the request to.
 * @param {Object} [data={}] - Optional data to include in the request payload (for non-GET methods).
 * @param {boolean} [userAuth=false] - Indicates whether user authentication is required.
 * @param {string} [method="get"] - The HTTP method for the request (default: "get").
 * @returns {Promise} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if the API request encounters an error.
 * 
 * Summary: This function facilitates making asynchronous API requests to a specified endpoint.
 * It allows for sending data in the request payload, supports user authentication,
 * and handles various HTTP methods. The function returns a promise that resolves to
 * the API response data or throws an error if the request encounters an issue.
 */
  static async request(endpoint, data = {}, userAuth = false, method = "get") {

    const url = `${BASE_URL}/${endpoint}`;

    const headers = (!userAuth) ?
      { apiauth: `Bearer ${API_token}` } :
      { userauth: `Bearer ${this.userToken}`, apiauth: `Bearer ${API_token}` };

    const params = (method === "get")
      ? data
      : {};

    try {

      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      if ((err.response.status === 401 || err.response.status === 400) && (url === `${BASE_URL}/auth/token` || url === `${BASE_URL}/auth/register`)) {
        return err.response
      }

    }
  }


  // Individual API routes

  /** Get details, notes, and mp3 encoded data for a song by mp3Id. */
  static async getSong(mp3Id) {
    let res = await this.request(`songs/${mp3Id}`);
    return res;
  }


  /** Get all songs. */
  static async getAllSongs(data) {
    let res = await this.request(`songs/`, data);
    return res.songs;
  }

  /** Get all songs under specified genre. */
  static async searchGenre(data) {
    let res = await this.request(`songs/genre`, data);
    return res.songs;
  }


  /** Register New User. */
  static async registerUser(data) {
    let res = await this.request(`auth/register`, data, false, 'post');
    return res;
  }

  /** Login a user. */
  static async loginUser(data) {
    let res = await this.request(`auth/token`, data, false, 'post');
    return res;
  }



  /** Patch updated user. */
  static async updateUser(username) {
    let res = await this.request(`users/${username}`, data, true, 'patch');
    return res.user
  }

  /** Get user info. */
  static async getUser(username, data) {
    let res = await this.request(`users/${username}`, data, true);
    return res.user
  }

  /** Get the site-wide undefeated top scores for all songs. */
  static async getAllTopScores(data) {
    let res = await this.request(`scores/top`, data);
    return res.scores
  }

  /** Get the undefeated top scores for specified song. */
  static async getSongTopScore(mp3Id) {
    let res = await this.request(`scores/${mp3Id}/top`);
    return res.score
  }

  /** Get the best score for each user on specified song. */
  static async getSongTopScores(mp3Id) {
    let res = await this.request(`scores/${mp3Id}/all-top`);
    return res.scores
  }

  /** Get all of the scores for a song. */
  static async getSongAllScores(mp3Id) {
    let res = await this.request(`scores/${mp3Id}/all`);
    return res.scores
  }

  /** Get the best score for a user on a specified song */
  static async getUserSongTopScore(mp3Id, username, data) {
    let res = await this.request(`scores/${mp3Id}/${username}/top`, data, true);
    return res.score
  }

  /** Get all of the scores a user has for a specified songs    */
  static async getUserSongScores(mp3Id, username, data) {
    let res = await this.request(`scores/${mp3Id}/${username}/all-scores`, data, true);
    return res.scores
  }

  /** Get all scores for a user   */
  static async getUserAllScores(username, data) {
    let res = await this.request(`scores/${username}/all-scores`, data, true);
    return res.scores
  }

  /** Get all the best saved scores for a user  */
  static async getUserTopScores(username, data) {
    let res = await this.request(`scores/${username}/top-scores`, data, true);
    return res.scores
  }


  /** Get all of the undefeated top scores for a user  */
  static async getUserUndefeatedTopScores(username, data) {
    let res = await this.request(`scores/${username}/undefeated-scores`, data, true);
    return res.scores
  }

  /** Save a score */
  static async saveScore(data) {
    let res = await this.request(`scores/new-score`, data, true, 'post');
    return res.score
  }


}



export default NoteworthyAPI;
