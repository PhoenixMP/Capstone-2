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
  static usertoken;

  static async request(endpoint, data = {}, userAuth = false, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;

    const headers = (!userAuth) ?
      { Authorization: `Bearer ${API_token}` } :
      { Authorization: `Bearer ${this.usertoken}` };

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

  /** Get details on a song by mp3Id. */

  static async getSong(mp3Id) {
    let res = await this.request(`songs/${mp3Id}`);
    return res;
  }

  /** Get all songs. */

  static async getAllsongs(data) {
    let res = await this.request(`songs/`, data);
    return res.songs;
  }

  static async searchGenre(data) {
    let res = await this.request(`songs/genre`, data);
    return res.songs;
  }


  // /** Register New User. */

  // static async registerUser(data) {
  //   let res = await this.request(`auth/register`, data, 'post');

  //   return res.token;
  // }

  // /** Login a user. */

  // static async loginUser(data) {
  //   let res = await this.request(`auth/token`, data, 'post');
  //   return res.token;
  // }


  // /** Patch updated user. */

  // static async updateUser(username, data) {
  //   let res = await this.request(`users/${username}`, data, 'patch');
  //   return res.user
  // }



}



export default Melodic2API;
