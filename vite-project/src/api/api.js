import axios from "axios";
import API_token from "../../APIToken"

//Look at the API variable later, and process.env
// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const BASE_URL = "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class Melodic2API {
  // the token for interactive with the API will be stored here.
  static userToken;

  static async request(endpoint, data = {}, userAuth = false, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
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
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
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

  static async searchGenre(data) {
    let res = await this.request(`songs/genre`, data);
    return res.songs;
  }


  /** Register New User. */

  static async registerUser(data) {
    let res = await this.request(`auth/register`, data, false, 'post');

    return res.token;
  }

  /** Login a user. */

  static async loginUser(data) {
    let res = await this.request(`auth/token`, data, false, 'post');
    return res.token;
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


  static async getAllTopScores(data) {
    let res = await this.request(`scores/top`, data);
    return res.scores
  }

  static async getSongTopScore(mp3Id) {
    let res = await this.request(`scores/${mp3Id}/top`);
    return res.score
  }

  static async getUserSongTopScore(mp3Id, username) {
    let res = await this.request(`scores/${mp3Id}/${username}/top`, true);
    return res.score
  }

  static async getUserSongScores(mp3Id, username, data) {
    let res = await this.request(`scores/${mp3Id}/${username}/all-scores`, data, true);
    return res.scores
  }

  static async getUserAllScores(username, data) {
    let res = await this.request(`scores/${username}/all-scores`, data, true);
    return res.scores
  }

  static async getUserTopScores(username, data) {
    let res = await this.request(`scores/${username}/top-scores`, data, true);
    return res.scores
  }



  static async getUserUndefeatedTopScores(username, data) {
    let res = await this.request(`scores/${username}/undefeated-scores`, data, true);
    return res.scores
  }

  static async newScore(data) {
    let res = await this.request(`scores/new-score`, data, true, 'post');
    return res.score
  }


}



export default Melodic2API;
