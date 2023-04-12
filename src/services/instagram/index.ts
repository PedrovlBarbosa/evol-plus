import axios from "axios";
import fs from "fs";

interface InstagramOptions {
  appId: string;
  appSecret: string;
  userAccessToken: string;
}

class Instagram {
  private appId: string;
  private appSecret: string;
  private userAccessToken: string;
  private longLivedAccessToken: string;

  constructor(options: InstagramOptions) {
    this.appId = options.appId;
    this.appSecret = options.appSecret;
    this.userAccessToken = options.userAccessToken;
    this.longLivedAccessToken = "";
  }

  private async exchangeAccessToken() {
    try {
      const exchangeTokenResponse = await axios.get(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${this.userAccessToken}`
      );
      this.longLivedAccessToken = exchangeTokenResponse.data.access_token;
    } catch (error) {
      console.error("Error exchanging access token:", error);
      throw error;
    }
  }

  public async uploadPhoto(photoPath: string, caption?: string) {
    try {
      if (!this.longLivedAccessToken) {
        await this.exchangeAccessToken();
      }

      // Upload the photo to the user's Instagram account using the /user/media endpoint
      const formData = new FormData();
      formData.append("image", new Blob([fs.readFileSync(photoPath)]));
      if (caption) {
        formData.append("caption", caption);
      }

      const uploadResponse = await axios.post(
        `https://graph.instagram.com/me/media?access_token=${this.longLivedAccessToken}`,
        formData
      );
      const mediaId = uploadResponse.data.id;

      // Get a deep link to the newly created post
      const permalinkResponse = await axios.get(
        `https://graph.instagram.com/${mediaId}?fields=permalink&access_token=${this.longLivedAccessToken}`
      );
      const permalink = permalinkResponse.data.permalink;
      console.log(`New post created! You can view it at: ${permalink}`);
    } catch (error) {
      console.error("Error uploading photo to Instagram:", error);
      throw error;
    }
  }
}

export default Instagram;
