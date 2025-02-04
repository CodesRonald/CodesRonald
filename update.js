const axios = require('axios');
require('dotenv').config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  const response = await axios.post('https://accounts.spotify.com/api/token', null, {
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
};

const updateNowPlaying = async () => {
  try {
    const accessToken = await getAccessToken();
    const nowPlayingResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (nowPlayingResponse.status === 200 && nowPlayingResponse.data) {
      const nowPlaying = nowPlayingResponse.data.item;
      console.log(`Now playing: ${nowPlaying.name} by ${nowPlaying.artists.map(artist => artist.name).join(', ')}`);
      // Atualize seu perfil com a informação da música atual
      // Aqui você pode colocar o código para atualizar seu perfil
    } else {
      console.log('No song is currently playing.');
    }
  } catch (error) {
    console.error('Error updating now playing:', error);
  }
};

updateNowPlaying();
