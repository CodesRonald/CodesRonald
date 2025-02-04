require('dotenv').config();
const axios = require('axios');

// Função para obter novo access token usando o refresh token
async function getAccessToken() {
  const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.access_token;
}

// Função para obter o status da música atual
async function getCurrentlyPlaying(accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

// Função principal
(async () => {
  try {
    const accessToken = await getAccessToken();
    const currentlyPlaying = await getCurrentlyPlaying(accessToken);

    if (currentlyPlaying && currentlyPlaying.is_playing) {
      const song = currentlyPlaying.item.name;
      const artist = currentlyPlaying.item.artists.map(artist => artist.name).join(', ');

      console.log(`Currently playing: ${song} by ${artist}`);
      // Atualize seu perfil do GitHub aqui, se necessário.
    } else {
      console.log('Nothing is playing right now.');
    }
  } catch (error) {
    console.error('Error updating Spotify status:', error);
  }
})();
